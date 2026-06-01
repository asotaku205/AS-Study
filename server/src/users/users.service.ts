import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Provider, User, UserRole } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  // Tạo người dùng mới
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUsername = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username đã được sử dụng');
    }
    const email = createUserDto.email ? createUserDto.email.trim() : null;
    if (email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      email: email || null,
      password: hashedPassword,
      role: UserRole.User,
      provider: Provider.Local,
      emailVerified: email ? false : null,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.toUserResponse(savedUser);
  }
  // Tìm người dùng theo email
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }
  async findOneByEmailOrNull(email: string): Promise<User | null> {
    try {
      const user = await this.findOneByEmail(email);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }
  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }
  async findOneByUsernameOrNull(username: string): Promise<User | null> {
    try {
      const user = await this.findOneByUsername(username);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }
  async findOneByProviderId(providerId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { providerId },
    });
  }
  async createUserWithGoogle(createUserDto: {
    email: string;
    name: string;
    providerId: string;
  }): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (!user) {
      const username = await this.generateUniqueUsername(
        this.normalizeUsername(createUserDto.email || createUserDto.name),
      );
      user = this.usersRepository.create({
        email: createUserDto.email,
        name: createUserDto.name,
        username,
        role: UserRole.User,
        password: null,
        provider: Provider.Google,
        providerId: createUserDto.providerId,
        emailVerified: true,
      });
      user = await this.usersRepository.save(user);
    }
    return user;
  }
  async linkGoogleProvider(userId: number, providerId: string, email?: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user.provider || user.password === null) {
      user.provider = Provider.Google;
    }
    user.providerId = providerId;
    if (email) {
      user.email = email.trim();
      user.emailVerified = true;
    }
    return this.usersRepository.save(user);
  }

  async setResetToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const user = await this.findOneById(userId);
    user.resetTokenHash = tokenHash;
    user.resetTokenExpiresAt = expiresAt;
    await this.usersRepository.save(user);
  }
  async findByResetTokenHash(tokenHash: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { resetTokenHash: tokenHash },
    });
  }
  // Cập nhật thông tin người dùng
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User không tồn tại');
    }
    if (updateUserDto.username) {
      const existingUsername = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUsername && existingUsername.id !== id) {
        throw new ConflictException('Username đã được sử dụng');
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.email !== undefined) {
      const newEmail = updateUserDto.email ? updateUserDto.email.trim() : null;
      if (newEmail && newEmail !== existingUser.email) {
        const existingEmail = await this.usersRepository.findOne({
          where: { email: newEmail },
        });
        if (existingEmail && existingEmail.id !== id) {
          throw new ConflictException('Email đã được sử dụng');
        }
      }
      if (newEmail !== existingUser.email) {
        existingUser.email = newEmail;
        existingUser.emailVerified = newEmail ? false : null;
        existingUser.emailVerificationTokenHash = null;
        existingUser.emailVerificationExpiresAt = null;
      }
      delete updateUserDto.email;
    }

    Object.assign(existingUser, updateUserDto);

    const updatedUser = await this.usersRepository.save(existingUser);
    return this.toUserResponse(updatedUser);
  }
  async updatePassword(userId: number, newHashedPassword: string) {
    const user = await this.findOneById(userId);
    user.password = newHashedPassword;
    await this.usersRepository.save(user);
  }
  async updatePasswordAndClearResetToken(
    userId: number,
    newHashedPassword: string,
  ) {
    const user = await this.findOneById(userId);
    user.password = newHashedPassword;
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    await this.usersRepository.save(user);
  }
  // Cập nhật refresh token
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    return this.usersRepository.update(userId, {
      refreshTokenHashed: hashedRefreshToken,
    });
  }
  // hash refresh token
  async hashRefreshToken(refreshToken: string): Promise<string> {
    const pepper = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_PEPPER',
    );
    return createHmac('sha256', pepper).update(refreshToken).digest('hex');
  }
  // Xóa refresh token khi người dùng đăng xuất
  async clearRefreshToken(userId: number) {
    return this.usersRepository.update(userId, { refreshTokenHashed: null });
  }
  // Tìm người dùng theo ID
  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }

  async findOneByIdResponse(id: number): Promise<UserResponseDto> {
    const user = await this.findOneById(id);
    return this.toUserResponse(user);
  }
  //  Xóa người dùng
  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    await this.usersRepository.delete(id);
  }
  // Đếm tổng số người dùng
  async countUsers(): Promise<number> {
    return await this.usersRepository.count();
  }
  // Lấy tất cả người dùng
  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findAllUsersResponse(): Promise<UserResponseDto[]> {
    const users = await this.findAllUsers();
    return users.map((user) => this.toUserResponse(user));
  }

  private toUserResponse(user: User): UserResponseDto {
    const dto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    dto.hasPassword = !!user.password;
    return dto;
  }
  private normalizeUsername(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '')
      .slice(0, 30) || 'user';
  }
  private async generateUniqueUsername(base: string): Promise<string> {
    let candidate = base;
    let counter = 1;
    while (await this.usersRepository.findOne({ where: { username: candidate } })) {
      candidate = `${base}${counter}`;
      counter += 1;
    }
    return candidate;
  }
  async banUser(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('không thể tự ban chính mình');
    }

    const user = await this.findOneById(targetUserId);

    user.isBanned = true;
    user.refreshTokenHashed = null;

    return this.usersRepository.save(user);
  }
  async unbanUser(id: number): Promise<UserResponseDto> {
    const user = await this.findOneById(id);
    if (!user.isBanned) {
      
      return this.toUserResponse(user);
    }
    user.isBanned = false;
    const updatedUser = await this.usersRepository.save(user);
    return this.toUserResponse(updatedUser);
  }
}

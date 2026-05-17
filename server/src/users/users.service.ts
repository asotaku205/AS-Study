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
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  // Tạo người dùng mới
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const exitingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (exitingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
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
  // Cập nhật thông tin người dùng
  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, {
      ...updateUserDto,
    });

    return await this.usersRepository.findOne({ where: { id } });
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
}

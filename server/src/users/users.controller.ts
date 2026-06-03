import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../decorators/roles';
import { Public } from '../decorators/public';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(UserRole.Admin)
  @Get('stats/registration-growth')
  @HttpCode(HttpStatus.OK)
  async getUserRegistrationGrowth() {
    return this.usersService.getUserRegistrationGrowth();
  }

  @Patch(':id/ban')
  @Roles(UserRole.Admin)
  async banUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.usersService.banUser(req.user.userId, id);
  }
  @Patch(':id/unban')
  @Roles(UserRole.Admin)
  @HttpCode(HttpStatus.OK)
  async unbanUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.usersService.unbanUser(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserResponseDto> {
    if (req.user.role !== UserRole.Admin && req.user.userId !== id) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa người dùng này');
    }
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findOneById(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.usersService.findOneByIdResponse(id);
  }

  @Roles(UserRole.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
  @Get("chart")
  @UseGuards(JwtAuthGuard)
  getChart(@Req() req) {
    return this.usersService.getChart(
      req.user.userId,
    );
  }

  @Get('all')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAllUsersResponse();
  }

  @Get('count')
  @HttpCode(HttpStatus.OK)
  async countUsers(): Promise<number> {
    return this.usersService.countUsers();
  }
}

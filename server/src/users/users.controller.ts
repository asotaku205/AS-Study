import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../decorators/roles';
import { Public } from '../decorators/public';
import { UserResponseDto } from './dto/user-response.dto';
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

  @Get('find')
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('email') email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
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
  ): Promise<UserResponseDto> {
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

  @Roles(UserRole.Admin)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAllUsersResponse();
  }

  @Roles(UserRole.Admin)
  @Get('count')
  @HttpCode(HttpStatus.OK)
  async countUsers(): Promise<number> {
    return this.usersService.countUsers();
  }
}

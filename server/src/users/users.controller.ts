import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }
    @Get('find')
    @HttpCode(HttpStatus.OK)
    async findOne(@Query('email') email: string): Promise<User> {
        return this.usersService.findOneByEmail(email);
    }
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id', ParseIntPipe ) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User | null> {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findOneById(@Query('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOneById(id);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }
    @Get("all")
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }
    @Get('count')
    @HttpCode(HttpStatus.OK)
    async countUsers(): Promise<number> {
        return this.usersService.countUsers();
    }
}

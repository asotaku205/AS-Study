import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Type } from 'class-transformer';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}

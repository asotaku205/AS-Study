import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Quizz } from '../quizz/entities/quizz.entity';
import { Document } from '../documents/entities/document.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Quizz, Document])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}

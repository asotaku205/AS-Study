import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entity/user.entity';
import { Document } from '../documents/entities/document.entity';
import { Quizz } from '../quizz/entities/quizz.entity';
import { Lecture } from '../lectures/entities/lecture.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Document, Quizz, Lecture]),
    MailModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}

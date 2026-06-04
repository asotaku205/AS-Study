import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { Quizz } from './entities/quizz.entity';
import { Lecture } from '../lectures/entities/lecture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quizz, Lecture])],
  providers: [QuizzService],
  controllers: [QuizzController],
})
export class QuizzModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { Quizz } from './entities/quizz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quizz])],
  providers: [QuizzService],
  controllers: [QuizzController],
})
export class QuizzModule {}

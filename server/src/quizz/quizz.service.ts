import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from './entities/quizz.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz)
    private readonly quizzRepository: Repository<Quizz>,
  ) {}

  async saveResult(
    userId: number,
    topic: string,
    difficulty: string,
    questionCount: number,
    score: number | null,
  ) {
    const quiz = this.quizzRepository.create({
      userId,
      topic,
      difficulty,
      questionCount,
      score,
    });
    return await this.quizzRepository.save(quiz);
  }

  async getMyStats(userId: number) {
    const quizzes = await this.quizzRepository.find({ where: { userId } });
    const totalQuizzes = quizzes.length;
    const scoredQuizzes = quizzes.filter((q) => q.score !== null);
    const avgScore =
      scoredQuizzes.length > 0
        ? scoredQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) /
          scoredQuizzes.length
        : 0;

    return { totalQuizzes, avgScore };
  }

  async getAdminStats() {
    const totalQuizzes = await this.quizzRepository.count();

    const date = new Date();
    date.setDate(date.getDate() - 7);
    const weeklyQuizzesCount = await this.quizzRepository
      .createQueryBuilder('quizz')
      .where('quizz.createdAt >= :date', { date })
      .getCount();

    const prevWeekDate = new Date(date);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);

    const prevWeeklyQuizzesCount = await this.quizzRepository
      .createQueryBuilder('quizz')
      .where('quizz.createdAt >= :prevWeekDate AND quizz.createdAt < :date', {
        prevWeekDate,
        date,
      })
      .getCount();

    let growth = 0;
    if (prevWeeklyQuizzesCount > 0) {
      growth =
        ((weeklyQuizzesCount - prevWeeklyQuizzesCount) /
          prevWeeklyQuizzesCount) *
        100;
    } else if (weeklyQuizzesCount > 0) {
      growth = 100;
    }

    return {
      totalQuizzes,
      weeklyQuizzesCount,
      growth: growth.toFixed(1),
    };
  }

  async getMyRecentActivity(userId: number): Promise<any[]> {
    const quizzes = await this.quizzRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 5,
    });
    return quizzes.map((q) => ({
      type: 'quiz',
      title: 'Hoàn thành Quiz',
      detail: q.topic,
      date: q.createdAt,
    }));
  }
 
}

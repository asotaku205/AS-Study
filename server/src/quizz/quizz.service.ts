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
    questions?: any,
  ) {
    const quiz = this.quizzRepository.create({
      userId,
      topic,
      difficulty,
      questionCount,
      score,
      questions,
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

    const highScore =
      scoredQuizzes.length > 0
        ? Math.max(...scoredQuizzes.map((q) => q.score || 0))
        : 0;

    const difficultyDistribution = {
      basic: quizzes.filter((q) => q.difficulty?.toLowerCase() === 'basic' || q.difficulty?.toLowerCase() === 'easy').length,
      advanced: quizzes.filter((q) => q.difficulty?.toLowerCase() === 'advanced' || q.difficulty?.toLowerCase() === 'medium').length,
      expert: quizzes.filter((q) => q.difficulty?.toLowerCase() === 'expert' || q.difficulty?.toLowerCase() === 'hard').length,
    };

    let totalQuestions = 0;
    let totalCorrectAnswers = 0;
    scoredQuizzes.forEach((q) => {
      totalQuestions += q.questionCount || 0;
      totalCorrectAnswers += Math.round(((q.score || 0) / 100) * (q.questionCount || 0));
    });

    return {
      totalQuizzes,
      avgScore: Math.round(avgScore),
      highScore,
      totalQuestions,
      totalCorrectAnswers,
      difficultyDistribution,
    };
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
  async getMyQuizzes(userId: number) {
    return await this.quizzRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Document, DocumentStatus } from '../documents/entities/document.entity';
import { Quizz } from '../quizz/entities/quizz.entity';
import { Lecture } from '../lectures/entities/lecture.entity';
import { SettingsService } from '../settings/settings.service';
import { UpdateSettingsDto } from '../settings/dto/update-settings.dto';
import { MailService } from '../mail/mail.service';
import { SystemSettings } from '../settings/entities/system-settings.entity';

export type ActivityLevel = 'INFO' | 'WARN' | 'ERROR';

export interface AdminActivityItem {
  id: string;
  level: ActivityLevel;
  message: string;
  source: string;
  time: string;
  createdAt: string;
  category: 'user' | 'document' | 'quiz' | 'lecture' | 'system';
}

export interface PaginatedActivityResult {
  items: AdminActivityItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Quizz)
    private readonly quizzRepository: Repository<Quizz>,
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
  ) {}

  private getWeekStart(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private countSince(repo: Repository<any>, alias: string, since: Date): Promise<number> {
    return repo
      .createQueryBuilder(alias)
      .where(`${alias}.createdAt >= :since`, { since })
      .getCount();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  async getOverviewStats() {
    const weekStart = this.getWeekStart();

    const [
      totalUsers,
      newUsersThisWeek,
      bannedUsers,
      totalDocuments,
      newDocsThisWeek,
      pendingDocs,
      reportedDocs,
      publishedDocs,
      totalQuizzes,
      weeklyQuizzes,
      totalLectures,
      weeklyLectures,
    ] = await Promise.all([
      this.userRepository.count(),
      this.countSince(this.userRepository, 'user', weekStart),
      this.userRepository.count({ where: { isBanned: true } }),
      this.documentRepository.count(),
      this.countSince(this.documentRepository, 'document', weekStart),
      this.documentRepository.count({ where: { status: DocumentStatus.Pending } }),
      this.documentRepository.count({ where: { status: DocumentStatus.Reported } }),
      this.documentRepository.count({ where: { status: DocumentStatus.Published } }),
      this.quizzRepository.count(),
      this.countSince(this.quizzRepository, 'quizz', weekStart),
      this.lectureRepository.count(),
      this.countSince(this.lectureRepository, 'lecture', weekStart),
    ]);

    const prevWeekStart = new Date(weekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const prevWeeklyQuizzes = await this.quizzRepository
      .createQueryBuilder('quizz')
      .where('quizz.createdAt >= :prevWeekStart AND quizz.createdAt < :weekStart', {
        prevWeekStart,
        weekStart,
      })
      .getCount();

    let quizGrowth = 0;
    if (prevWeeklyQuizzes > 0) {
      quizGrowth = ((weeklyQuizzes - prevWeeklyQuizzes) / prevWeeklyQuizzes) * 100;
    } else if (weeklyQuizzes > 0) {
      quizGrowth = 100;
    }

    return {
      users: {
        total: totalUsers,
        newThisWeek: newUsersThisWeek,
        banned: bannedUsers,
      },
      documents: {
        total: totalDocuments,
        newThisWeek: newDocsThisWeek,
        pending: pendingDocs,
        reported: reportedDocs,
        published: publishedDocs,
      },
      quizzes: {
        total: totalQuizzes,
        weeklyCount: weeklyQuizzes,
        growth: Number(quizGrowth.toFixed(1)),
      },
      lectures: {
        total: totalLectures,
        weeklyCount: weeklyLectures,
      },
      alerts: pendingDocs + reportedDocs + bannedUsers,
    };
  }

  async getSettings(): Promise<SystemSettings> {
    return this.settingsService.getSettings();
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<SystemSettings> {
    return this.settingsService.updateSettings(dto);
  }

  async resetSettings(): Promise<SystemSettings> {
    return this.settingsService.resetToDefaults();
  }

  async sendTestEmail(): Promise<{ message: string }> {
    const settings = await this.settingsService.getSettings();
    if (!settings.adminEmail) {
      throw new BadRequestException('Chưa cấu hình email quản trị');
    }
    await this.mailService.sendTestEmail(settings.adminEmail, settings.siteName);
    return {
      message: `Đã gửi email thử nghiệm đến ${settings.adminEmail}`,
    };
  }

  async getPaginatedActivity(
    page = 1,
    limit = 10,
    level?: ActivityLevel | 'all',
  ): Promise<PaginatedActivityResult> {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const safePage = Math.max(page, 1);
    const fetchPerSource = Math.min(Math.max(safePage * safeLimit, 50), 300);

    const allItems = await this.buildActivityItems(fetchPerSource);
    const filtered =
      level && level !== 'all'
        ? allItems.filter((item) => item.level === level)
        : allItems;

    const total = filtered.length;
    const totalPages = total === 0 ? 1 : Math.ceil(total / safeLimit);
    const currentPage = Math.min(safePage, totalPages);
    const items = filtered.slice(
      (currentPage - 1) * safeLimit,
      currentPage * safeLimit,
    );

    return {
      items,
      total,
      page: currentPage,
      limit: safeLimit,
      totalPages,
    };
  }

  async getRecentActivity(limit = 30): Promise<AdminActivityItem[]> {
    const result = await this.getPaginatedActivity(1, limit, 'all');
    return result.items;
  }

  private async buildActivityItems(perSource: number): Promise<AdminActivityItem[]> {
    const [users, documents, quizzes, lectures] = await Promise.all([
      this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: perSource,
        select: ['id', 'name', 'username', 'createdAt', 'isBanned'],
      }),
      this.documentRepository.find({
        relations: ['owner'],
        order: { createdAt: 'DESC' },
        take: perSource,
      }),
      this.quizzRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: perSource,
      }),
      this.lectureRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: perSource,
      }),
    ]);

    const items: AdminActivityItem[] = [];

    users.forEach((user) => {
      items.push({
        id: `user-${user.id}`,
        level: user.isBanned ? 'WARN' : 'INFO',
        message: user.isBanned
          ? `Tài khoản "${user.name}" đã bị khóa`
          : `Người dùng mới đăng ký: ${user.name}`,
        source: 'UserService',
        time: this.formatTime(user.createdAt),
        createdAt: user.createdAt.toISOString(),
        category: 'user',
      });
    });

    documents.forEach((doc) => {
      let level: ActivityLevel = 'INFO';
      let message = `Tài liệu mới: "${doc.title}"`;

      if (doc.status === DocumentStatus.Pending) {
        level = 'WARN';
        message = `Tài liệu chờ duyệt: "${doc.title}"`;
      } else if (doc.status === DocumentStatus.Reported) {
        level = 'ERROR';
        message = `Tài liệu bị báo cáo: "${doc.title}"`;
      } else if (doc.status === DocumentStatus.Published) {
        message = `Tài liệu đã xuất bản: "${doc.title}"`;
      } else if (doc.status === DocumentStatus.Rejected) {
        level = 'WARN';
        message = `Tài liệu bị từ chối: "${doc.title}"`;
      }

      items.push({
        id: `doc-${doc.id}`,
        level,
        message,
        source: doc.owner?.name || 'Documents',
        time: this.formatTime(doc.createdAt),
        createdAt: doc.createdAt.toISOString(),
        category: 'document',
      });
    });

    quizzes.forEach((quiz) => {
      const scoreText =
        quiz.score !== null && quiz.score !== undefined
          ? ` — điểm ${quiz.score}%`
          : '';
      items.push({
        id: `quiz-${quiz.id}`,
        level: 'INFO',
        message: `Quiz hoàn thành: "${quiz.topic}"${scoreText}`,
        source: quiz.user?.name || 'QuizzService',
        time: this.formatTime(quiz.createdAt),
        createdAt: quiz.createdAt.toISOString(),
        category: 'quiz',
      });
    });

    lectures.forEach((lecture) => {
      items.push({
        id: `lecture-${lecture.id}`,
        level: 'INFO',
        message: `Bài giảng mới: "${lecture.title}"`,
        source: lecture.user?.name || 'LectureService',
        time: this.formatTime(lecture.createdAt),
        createdAt: lecture.createdAt.toISOString(),
        category: 'lecture',
      });
    });

    return items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getActivityCharts() {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const now = new Date();
    const result: {
      name: string;
      documents: number;
      quizzes: number;
      users: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const [documents, quizzes, users] = await Promise.all([
        this.documentRepository
          .createQueryBuilder('document')
          .where(
            'document.createdAt >= :dayStart AND document.createdAt < :dayEnd',
            { dayStart, dayEnd },
          )
          .getCount(),
        this.quizzRepository
          .createQueryBuilder('quizz')
          .where(
            'quizz.createdAt >= :dayStart AND quizz.createdAt < :dayEnd',
            { dayStart, dayEnd },
          )
          .getCount(),
        this.userRepository
          .createQueryBuilder('user')
          .where(
            'user.createdAt >= :dayStart AND user.createdAt < :dayEnd',
            { dayStart, dayEnd },
          )
          .getCount(),
      ]);

      result.push({
        name: days[date.getDay()],
        documents,
        quizzes,
        users,
      });
    }

    return result;
  }
}

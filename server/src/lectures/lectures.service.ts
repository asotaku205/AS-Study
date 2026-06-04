import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture } from './entities/lecture.entity';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  async saveLecture(userId: number, title: string, content: string) {
    const lecture = this.lectureRepository.create({
      userId,
      title,
      content,
    });
    return await this.lectureRepository.save(lecture);
  }

  async getMyLectures(userId: number) {
    return await this.lectureRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}

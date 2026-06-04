import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Quizz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 255 })
  topic: string;

  @Column({ length: 50 })
  difficulty: string;

  @Column({ type: 'int', default: 10 })
  questionCount: number;

  @Column({ type: 'int', nullable: true })
  score: number | null;

  @Column({ type: 'json', nullable: true })
  questions: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.quizzes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

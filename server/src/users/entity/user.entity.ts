import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { Quizz } from '../../quizz/entities/quizz.entity';
export enum UserRole {
  User = "user",
  Admin = "admin",
}
export enum Provider {
  Local = "local",
  Google = "google",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255 })
  name: string;
  @Column({ length: 255, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string | null;
  @Column({type: 'varchar', length: 255,nullable: true })
  password: string | null;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
  @Column({ default: false })
  isBanned: boolean;
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHashed: string | null;
  @Column({ type: 'enum', enum: Provider, nullable: true })
  provider: Provider;
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerId: string | null;
  @Column({ type: 'boolean', nullable: true })
  emailVerified: boolean | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationTokenHash: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  emailVerificationExpiresAt: Date | null;
  @Column({ type: 'varchar', length: 255, nullable: true })
  resetTokenHash: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  resetTokenExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Document, (document) => document.ownerUserId)
  documents: Document[];

  @OneToMany(() => Quizz, (quizz) => quizz.user)
  quizzes: Quizz[];
}
  
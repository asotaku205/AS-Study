import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

export enum DocumentVisibility {
  Public = 'public',
  Private = 'private',
}

export enum DocumentStatus {
  Published = 'Published',
  Draft = 'Draft',
  Pending = 'Pending',
  Reported = 'Reported',
  Rejected = 'Rejected',
}

@Entity()
export class Document {
  

  @PrimaryGeneratedColumn()
  id: number;

  
  @Column({ name: 'owner_user_id', nullable: true })
  ownerUserId: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;
  
  @Column()
  originalName: string;

  @Column()
  storedName: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  mimeType: string;
  @Column()
  fileUrl: string;

  @Column({ type: 'int', nullable: true })
  pageCount: number | null;

  @Column()
  sizeBytes: number;

  @Column({
    type: 'enum',
    enum: DocumentVisibility,
    default: DocumentVisibility.Private,
  })
  visibility: DocumentVisibility;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.Draft,
  })
  status: DocumentStatus;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @Column({ type: 'text', nullable: true, name: 'ocr_text' })
  ocrText: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;
}

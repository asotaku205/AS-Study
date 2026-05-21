import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
export enum CategoriesStatus {
  Published = 'Published',
  Hidden = 'Hidden',
}
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column({ type: 'enum', enum: CategoriesStatus })
  status: CategoriesStatus;
  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Document, (document) => document.categoryId)
  documents: Document[];
}

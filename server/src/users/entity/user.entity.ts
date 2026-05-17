import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 255 })
  name: string;
  @Column({ length: 255, unique: true })
  email: string;
  @Column({ length: 255 })
  password: string;
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHashed: string | null;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

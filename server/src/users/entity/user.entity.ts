import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  User = "user",
  Admin = "admin",
}
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
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHashed: string | null;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}

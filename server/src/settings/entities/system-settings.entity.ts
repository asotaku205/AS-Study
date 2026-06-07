import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_settings')
export class SystemSettings {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ name: 'site_name', default: 'AS Scholarly' })
  siteName: string;

  @Column({ name: 'admin_email', default: 'admin@asscholarly.com' })
  adminEmail: string;

  @Column({
    name: 'seo_desc',
    type: 'text',
    default:
      'Nền tảng học tập AI thế hệ mới giúp bạn tối ưu hoá quá trình tiếp thu kiến thức.',
  })
  seoDesc: string;

  @Column({ name: 'allow_register', default: true })
  allowRegister: boolean;

  @Column({ name: 'maintenance_mode', default: false })
  maintenanceMode: boolean;

  @Column({ name: 'auto_publish', default: false })
  autoPublish: boolean;

  @Column({ name: 'email_notify', default: true })
  emailNotify: boolean;

  @Column({ name: 'two_factor', default: false })
  twoFactor: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

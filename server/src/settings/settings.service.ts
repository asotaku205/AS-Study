import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettings } from './entities/system-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const DEFAULT_SETTINGS: Omit<SystemSettings, 'id' | 'updatedAt'> = {
  siteName: 'AS Scholarly',
  adminEmail: 'admin@asscholarly.com',
  seoDesc:
    'Nền tảng học tập AI thế hệ mới giúp bạn tối ưu hoá quá trình tiếp thu kiến thức.',
  allowRegister: true,
  maintenanceMode: false,
  autoPublish: false,
  emailNotify: true,
  twoFactor: false,
};

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SystemSettings)
    private readonly settingsRepository: Repository<SystemSettings>,
  ) {}

  async onModuleInit() {
    await this.ensureSettings();
  }

  private async ensureSettings(): Promise<SystemSettings> {
    let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.settingsRepository.create({ id: 1, ...DEFAULT_SETTINGS });
      settings = await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async getSettings(): Promise<SystemSettings> {
    return this.ensureSettings();
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<SystemSettings> {
    const settings = await this.ensureSettings();
    Object.assign(settings, dto);
    return this.settingsRepository.save(settings);
  }

  async resetToDefaults(): Promise<SystemSettings> {
    const settings = await this.ensureSettings();
    Object.assign(settings, DEFAULT_SETTINGS);
    return this.settingsRepository.save(settings);
  }
}

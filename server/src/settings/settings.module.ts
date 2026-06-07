import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettings } from './entities/system-settings.entity';
import { SettingsService } from './settings.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemSettings])],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}

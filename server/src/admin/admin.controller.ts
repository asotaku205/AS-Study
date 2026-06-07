import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../decorators/roles';
import { UserRole } from '../users/entity/user.entity';
import { UpdateSettingsDto } from '../settings/dto/update-settings.dto';

@Controller('admin')
@Roles(UserRole.Admin)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  getOverview() {
    return this.adminService.getOverviewStats();
  }

  @Get('activity')
  @HttpCode(HttpStatus.OK)
  getActivity(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('level') level?: string,
  ) {
    const parsedPage = page ? parseInt(page, 10) || 1 : 1;
    const parsedLimit = limit ? parseInt(limit, 10) || 10 : 10;
    const validLevels = ['all', 'INFO', 'WARN', 'ERROR'] as const;
    const parsedLevel = validLevels.includes(level as any)
      ? (level as 'all' | 'INFO' | 'WARN' | 'ERROR')
      : 'all';

    return this.adminService.getPaginatedActivity(
      parsedPage,
      parsedLimit,
      parsedLevel,
    );
  }

  @Get('activity-chart')
  @HttpCode(HttpStatus.OK)
  getActivityChart() {
    return this.adminService.getActivityCharts();
  }

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.adminService.updateSettings(dto);
  }

  @Post('settings/reset')
  @HttpCode(HttpStatus.OK)
  resetSettings() {
    return this.adminService.resetSettings();
  }

  @Post('settings/test-email')
  @HttpCode(HttpStatus.OK)
  sendTestEmail() {
    return this.adminService.sendTestEmail();
  }
}

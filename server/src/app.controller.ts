import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

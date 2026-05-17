import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Associated with NestJS and TypeScript 6.0.3';
  }
}

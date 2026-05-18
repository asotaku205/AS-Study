import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { Roles } from './decorators/roles';
import { RolesGuard } from './auth/passport/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
    
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
   {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],
})
export class AppModule {}

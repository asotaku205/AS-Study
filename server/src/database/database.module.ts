import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: '.env',
        isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST','localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize:
              configService.get<string>('DB_SYNCHRONIZE') === 'true' ||
              configService.get<string>('NODE_ENV') === 'development',
            logging: ['error'], // Chỉ hiển thị log khi có lỗi database, ẩn các câu SELECT/INSERT/UPDATE để tránh rối terminal
        }),
    })
],
})
export class DatabaseModule {

}

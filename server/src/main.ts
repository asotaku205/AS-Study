import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { json, urlencoded, Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: frontendUrl || true,
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const clientIndex = join(__dirname, '..', 'client', 'index.html');
  if (existsSync(clientIndex)) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        req.method !== 'GET' ||
        req.path.startsWith('/api') ||
        req.path.startsWith('/uploads') ||
        req.path.includes('.')
      ) {
        return next();
      }
      res.sendFile(clientIndex);
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();

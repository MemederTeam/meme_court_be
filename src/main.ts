import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Validation Pipe 글로벌 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: false, // 추가 속성 있어도 에러 안남
      transform: true, // 타입 자동 변환
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Meme Court API')
    .setDescription('밈 재판소 백엔드 API 문서')
    .setVersion('1.0')
    .addTag('health', '서버 상태')
    .addTag('users', '유저 관리')
    .addTag('posts', '게시글 관리')
    .addTag('hashtags', '해시태그 관리')
    .addTag('votes', '투표 관리')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  const baseUrl = process.env.SERVER_URL || `http://localhost:${port}`;
  console.log(`
🚀 Server is running on: ${baseUrl}
📚 Swagger API Docs: ${baseUrl}/api
  `);
}
bootstrap();

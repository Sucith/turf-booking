import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for specific origin and methods
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true, // optional, useful if you're sending cookies or auth headers
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

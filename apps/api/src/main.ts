import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);

  // Segurança
  app.use(helmet());
  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS')?.split(',') ?? true,
    credentials: true,
  });

  // Validação global (class-validator + class-transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global e versionamento simples
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  // Swagger em /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Carteira Pokémon TCG — API')
    .setDescription('API REST para gestão de coleções Pokémon TCG')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('API_PORT') ?? 3333;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`📚 Swagger em http://localhost:${port}/docs`);
}

bootstrap();

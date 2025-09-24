import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tradlibras.com.br', 'https://www.tradlibras.com.br']
      : true,
    credentials: true,
  });

  // Validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('TradLibras API')
    .setDescription('API para tradução e reconhecimento de voz para Libras')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('asr', 'Reconhecimento Automático de Fala')
    .addTag('translate', 'Tradução para Libras')
    .addTag('signs', 'Geração de Sinais')
    .addTag('health', 'Monitoramento de Saúde')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT || process.env.API_PORT || 8000);
  await app.listen(port);
  
  console.log(`🚀 TradLibras API rodando em http://localhost:${port}`);
  console.log(`📚 Documentação disponível em http://localhost:${port}/api`);
}

bootstrap();
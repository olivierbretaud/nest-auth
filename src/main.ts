import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { updatePostmanCollection } from '../scripts/sync-postman';
import helmet from 'helmet';
import { writeFileSync } from 'node:fs';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.setGlobalPrefix('api');

  // Sécuriser le transport avec Helmet - Headers de sécurité HTTP
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Désactivé pour compatibilité avec certaines APIs
  }));

  // Configuration CORS pour sécuriser les requêtes cross-origin
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4000', // Configurer selon votre frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  });

  // Validation globale des données
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // renvoie une erreur si une propriété inconnue est présente
    transform: true,       // transforme automatiquement les types (ex: string → number)
  }));

  // Configuration de swagger 
  const config = new DocumentBuilder()
  .setTitle('nest-auth')
  .setDescription('Documentation de mon API nest-auth')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey}_${methodKey}`
  });

  SwaggerModule.setup('/api/docs', app, document);


  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  console.log('Fichier Swagger généré')

  await app.listen(port);

  if (process.env.NODE_ENV === 'development') {
    await updatePostmanCollection();
  }

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🔒 Sécurité du transport activée (Helmet, CORS)`);
  console.log(`⏱️  Rate limiting activé: ${process.env.RATE_LIMIT_MAX || '10'} requêtes/${parseInt(process.env.RATE_LIMIT_TTL || '60000', 10) / 1000}s`);
  // Note: Pour HTTPS en production, utiliser un reverse proxy (nginx, traefik)
  // ou configurer directement avec: await app.listen(port, '0.0.0.0', { https: {...} });
}
bootstrap();

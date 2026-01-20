import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PrismaService } from '../prisma/prisma.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    UsersModule,
    // Configuration du rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10), // 60 secondes par défaut
      limit: parseInt(process.env.RATE_LIMIT_MAX || '10', 10), // 10 requêtes par défaut
    }]),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    // Activation globale du rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})

export class AppModule {}

import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { AuthModule } from "../auth/auth.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
	imports: [
		AuthModule,
		PassportModule, // Nécessaire pour que JwtAuthGuard fonctionne
	],
	controllers: [UsersController],
	providers: [UsersService, PrismaService],
})
export class UsersModule {}

import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || "secret_key",
			signOptions: { expiresIn: "1h" },
		}),
	],
	providers: [
		AuthService,
		UsersService,
		PrismaService,
		JwtStrategy,
		JwtAuthGuard,
	],
	exports: [JwtAuthGuard, AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}

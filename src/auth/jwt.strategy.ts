import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { UserRole } from "../users/enums/user-role.enum";
import type { UserJWTPayload } from "./types/auth";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || "secret_key",
		});
	}

	validate(payload: UserJWTPayload) {
		return {
			userId: payload.sub,
			email: payload.email,
			role: payload.role as UserRole,
		};
	}
}

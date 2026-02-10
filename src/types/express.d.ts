import type { UserAuth } from "src/auth/types/user-auth";

declare global {
	namespace Express {
		interface Request {
			user?: UserAuth;
		}
	}
}

import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

dotenv.config();

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async login(email: string, password: string) {
		const user = await this.usersService.findPasswordByEmail(email);
		if (!user) throw new UnauthorizedException("Invalid credentials");

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) throw new UnauthorizedException("Invalid credentials");

		const payload = { sub: user.id, email: user.email, role: user.role };

		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async requestPasswordReset(requestResetPasswordDto: RequestResetPasswordDto) {
		const user = await this.usersService.findByEmail(
			requestResetPasswordDto.email,
		);
		// Pour la sécurité, on ne révèle pas si l'email existe ou non
		if (!user) {
			throw new NotFoundException("User not found");
		}

		// Générer un token JWT avec expiration de 15 minutes
		const resetToken = this.jwtService.sign(
			{
				sub: user.id,
				email: user.email,
				type: "password_reset",
			},
			{ expiresIn: "15m" },
		);

		// TODO: Envoyer l'email avec le lien de réinitialisation
		// Exemple: https://votre-app.com/reset-password?token=${resetToken}
		console.log(`🔐 Reset password token for ${user.email}: ${resetToken}`);
		console.log(
			`📧 Email à envoyer avec le lien: /auth/reset-password?token=${resetToken}`,
		);

		return {
			message: "Un lien de réinitialisation a été envoyé.",
			// En développement, on peut retourner le token (à retirer en production)
			...(process.env.NODE_ENV !== "production" && { resetToken }),
		};
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		try {
			// Vérifier et décoder le token
			const payload = this.jwtService.verify(resetPasswordDto.token);

			// Vérifier que c'est bien un token de reset password
			if (payload.type !== "password_reset") {
				throw new BadRequestException("Token invalide");
			}

			// Vérifier que l'utilisateur existe toujours
			const user = await this.usersService.findByEmail(payload.email);
			if (!user) {
				throw new BadRequestException("Utilisateur introuvable");
			}

			// Hasher le nouveau mot de passe
			const hashedPassword = await bcrypt.hash(
				resetPasswordDto.newPassword,
				10,
			);

			// Mettre à jour le mot de passe
			await this.usersService.updatePassword(user.id, hashedPassword);

			return {
				message: "Mot de passe réinitialisé avec succès",
			};
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new BadRequestException(
					"Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.",
				);
			}
			if (error.name === "JsonWebTokenError") {
				throw new BadRequestException("Token invalide");
			}
			throw error;
		}
	}
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
	@IsNotEmpty()
	@ApiProperty({
		example: "token",
	})
	token: string;

	@IsNotEmpty()
	@MinLength(12, {
		message: "Le mot de passe doit contenir au moins 12 caractères",
	})
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
		message:
			"Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)",
	})
	@ApiProperty({
		example: "P@ssword123456",
	})
	newPassword: string;
}

export class ResetPassworResponseDto {
	@ApiProperty({
		example: "Mot de passe réinitialisé avec succès",
	})
	message: string;
}

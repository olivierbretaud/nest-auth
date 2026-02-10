import { ApiEmailProperty } from "../../common/swagger/email.property";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiEmailProperty()
	email: string;
}

export class RequestResetPassworResponseDto {
	@ApiProperty({
		example: "token",
	})
	resetToken: string;

	@ApiProperty({
		example: "Un lien de réinitialisation a été envoyé.",
	})
	message: string;
}

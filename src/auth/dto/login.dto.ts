import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiEmailProperty } from "../../common/swagger/email.property";

export class loginDto {
	@IsEmail()
	@ApiEmailProperty()
	email: string;

	@IsNotEmpty()
	@ApiProperty({
		example: "P@ssword123456",
	})
	password: string;
}

export class loginResponseDto {
	@ApiProperty({
		example: "token",
	})
	access_token: string;
}

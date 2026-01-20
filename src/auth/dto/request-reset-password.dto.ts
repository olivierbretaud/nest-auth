import { ApiEmailProperty } from '@/swagger/email.property';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiEmailProperty()
  email: string;
}

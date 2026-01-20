import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiEmailProperty } from 'src/swagger/email.property';


export class loginDto {
  @IsEmail()
  @ApiEmailProperty()
  email: string;

  @IsNotEmpty()
  // @MinLength(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  //   {
  //     message:
  //       'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)',
  //   },
  // )
  @ApiProperty({
    example: 'P@ssword123456',
  })
  password: string;
}

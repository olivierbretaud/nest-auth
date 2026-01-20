import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ example: 'john@mail.com' })
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @IsNotEmpty()
  @MinLength(12, { message: 'Le mot de passe doit contenir au moins 12 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)',
    },
  )
  @ApiProperty({ example: 'MotDePasse123' })
  password: string;
 
  @IsOptional()
  @ApiProperty({ example: UserRole.MEMBER })
  role: string = UserRole.MEMBER;
}
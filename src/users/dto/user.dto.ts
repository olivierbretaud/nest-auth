import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
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

  @IsOptional()
  @ApiProperty({ example: UserRole.MEMBER })
  role: string = UserRole.MEMBER;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MEMBER })
  role: UserRole;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z' })
  updatedAt: Date;
}

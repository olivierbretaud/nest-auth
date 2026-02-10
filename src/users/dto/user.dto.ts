import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEmail,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class CreateUserDto {
	@IsEmail()
	@ApiProperty({ example: "john@mail.com" })
	email: string;

	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty({ example: "John" })
	firstName: string;

	@IsNotEmpty()
	@MinLength(3)
	@ApiProperty({ example: "Doe" })
	lastName: string;

	@IsOptional()
	@ApiProperty({ example: UserRole.MEMBER })
	role: string = UserRole.MEMBER;

	@IsOptional()
	@IsBoolean()
	@ApiProperty({ example: true })
	isActive: boolean = true;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserResponseDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "john.doe@example.com" })
	email: string;

	@ApiProperty({ example: "John" })
	firstName: string;

	@ApiProperty({ example: "Doe" })
	lastName: string;

	@ApiProperty({ enum: UserRole, example: UserRole.MEMBER })
	role: UserRole;

	@ApiProperty({ example: "2024-01-01T10:00:00.000Z" })
	createdAt: Date;

	@ApiProperty({ example: "2024-01-01T10:00:00.000Z" })
	updatedAt: Date;
}

export class UserPaginationResponsDto {
	@ApiProperty({ example: UserResponseDto })
	users: [UserResponseDto];
	meta: PaginationMetoDto;
}

export class DeleteUserResponseDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: "User successfully deleted." })
	message: string;
}

import { Type } from "class-transformer";
import { IUser } from "../types/users";
import { PaginationMetoDto } from "@/common/dto";

export class UserQueryDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@ApiPropertyOptional({ example: 1, description: "Numéro de page" })
	page?: number = 1;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@ApiPropertyOptional({
		example: 10,
		description: "Nombre d'éléments par page",
	})
	limit?: number = 10;

	@IsOptional()
	@IsString()

	@ApiPropertyOptional({
		example: "createdAt",
		enum: ["createdAt", "updatedAt", "email", "firstName", "lastName"],
		description: "Propriété triée",
	})
	sortBy?: keyof IUser = "createdAt";

	@IsOptional()
	@IsIn(["asc", "desc"])
	@ApiPropertyOptional({
		example: "desc",
		enum: ["asc", "desc"],
		description: "Direction du tri",
	})
	sortOrder?: "asc" | "desc" = "desc";

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		description: "Global search on email, firstName and lastName",
	})
	search?: string;

	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@ApiPropertyOptional({
		description: "Filtre par compte actif",
	})
	isActive?: boolean;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({
		enum: UserRole,
		description: "Filtre par rôle",
	})
	role?: string;
}

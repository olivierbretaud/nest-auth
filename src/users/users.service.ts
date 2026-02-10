import { Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CreateUserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";
import { UserQueryParams } from "./types/users";

const selectUser: Prisma.UserSelect = {
	id: true,
	email: true,
	firstName: true,
	lastName: true,
	role: true,
	createdAt: true,
	updatedAt: true,
	isActive: true,
};

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	findAll() {
		return this.prisma.user.findMany({
			select: selectUser,
		});
	}

	async findPaginated(params: UserQueryParams) {
		const {
			search,
			page = 1,
			limit = 10,
			sortBy = "createdAt",
			sortOrder = "desc",
			role,
			isActive,
		} = params;

		const skip = (page - 1) * limit;

		// Construction dynamique des filtres
		const where: Prisma.UserWhereInput = {};
		if (search) {
			where.OR = [
				{ email: { contains: search, mode: "insensitive" } },
				{ firstName: { contains: search, mode: "insensitive" } },
				{ lastName: { contains: search, mode: "insensitive" } },
			];
		}

		if (role) {
			where.role = role;
		}

		if (typeof isActive === "boolean") {
			where.isActive = isActive;
		}

		// Main request
		const [users, total] = await Promise.all([
			this.prisma.user.findMany({
				where,
				skip,
				take: limit,
				orderBy: {
					[sortBy]: sortOrder,
				},
				select: selectUser,
			}),
			this.prisma.user.count({
				where,
			}),
		]);

		return {
			users,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			select: selectUser,
		});
	}

	findPasswordByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			select: {
				...selectUser,
				password: true,
			},
		});
	}

	findById(id: number) {
		return this.prisma.user.findUnique({ where: { id }, select: selectUser });
	}

	create(createUserDto: CreateUserDto) {
		return this.prisma.user.create({
			data: {
				email: createUserDto.email,
				firstName: createUserDto.firstName,
				lastName: createUserDto.lastName,
				isActive: true,
			},
			select: selectUser,
		});
	}

	updatePassword(userId: number, hashedPassword: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { password: hashedPassword, updatedAt: new Date() },
			select: selectUser,
		});
	}

	update(userId: number, updateUserDto: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				...updateUserDto,
				updatedAt: new Date(),
			},
			select: selectUser,
		});
	}

	delete(id: number) {
		return this.prisma.user.delete({ where: { id } });
	}
}

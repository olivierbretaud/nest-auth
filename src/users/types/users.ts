import type { UserRole } from "../enums/user-role.enum";

export interface IUser {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export interface UserQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: keyof IUser;
	sortOrder?: "asc" | "desc";
	email?: string;
	firstName?: string;
	lastName?: string;
	role?: string;
	isActive?: boolean;
}

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

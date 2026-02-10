import { Test } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { UsersService } from "./users.service";
import { mockUsers } from "./mock/users";
import { UserRole } from "./enums/user-role.enum";

// Typage du Prisma Mock
type PrismaMockType = {
	user: {
		findMany: jest.Mock;
		count: jest.Mock;
	};
};

describe("UsersService - findPaginated", () => {
	let service: UsersService;
	let prisma: PrismaMockType;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: PrismaService,
					useValue: {
						user: {
							findMany: jest.fn(),
							count: jest.fn(),
						},
					},
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		prisma = module.get(PrismaService) as PrismaMockType;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return paginated data", async () => {
		prisma.user.findMany.mockResolvedValue(mockUsers);
		prisma.user.count.mockResolvedValue(mockUsers.length);

		const result = await service.findPaginated({ page: 1, limit: 2 });

		expect(prisma.user.findMany).toHaveBeenCalled();
		expect(prisma.user.count).toHaveBeenCalled();
		expect(result.meta.total).toBe(5);
		expect(result.meta.totalPages).toBe(3);
	});

	it("should return searched email", async () => {
		// On mock la fonction pour filtrer dynamiquement selon le where.search
		prisma.user.findMany.mockImplementation(({ where }) => {
			const search = where?.OR?.[0]?.email?.contains || "";
			return mockUsers.filter((u) => u.email.includes(search));
		});

		prisma.user.count.mockImplementation(({ where }) => {
			const search = where?.OR?.[0]?.email?.contains || "";
			return mockUsers.filter((u) => u.email.includes(search)).length;
		});

		const searchEmail = mockUsers[1].email;
		const result = await service.findPaginated({
			page: 1,
			search: searchEmail,
		});

		expect(prisma.user.findMany).toHaveBeenCalled();
		expect(prisma.user.count).toHaveBeenCalled();

		expect(result.meta.total).toBe(1);
		expect(result.users[0].email).toBe(searchEmail);
	});

	it("should return filtered admin", async () => {
		// Mock count/findMany pour filtre role
		prisma.user.findMany.mockImplementation(({ where }) => {
			if (where?.role) {
				return mockUsers.filter((u) => u.role === where.role);
			}
			return mockUsers;
		});

		prisma.user.count.mockImplementation(({ where }) => {
			if (where?.role) {
				return mockUsers.filter((u) => u.role === where.role).length;
			}
			return mockUsers.length;
		});

		const result = await service.findPaginated({
			page: 1,
			role: UserRole.ADMIN,
		});

		expect(prisma.user.findMany).toHaveBeenCalled();
		expect(prisma.user.count).toHaveBeenCalled();

		const admins = mockUsers.filter((u) => u.role === UserRole.ADMIN);
		expect(result.meta.total).toBe(admins.length);
		expect(result.users).toEqual(admins);
	});
});

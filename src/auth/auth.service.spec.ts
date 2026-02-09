import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { IUser } from "@/users/types/users";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { validate } from "class-validator";

jest.mock("bcrypt");

describe("AuthService", () => {
	let service: AuthService;
	let jwtService: jest.Mocked<JwtService>;
	let usersService: jest.Mocked<UsersService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: JwtService,
					useValue: {
						verify: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						findByEmail: jest.fn(),
						updatePassword: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
		usersService = module.get(UsersService) as jest.Mocked<UsersService>;
	});

	it("devrait réinitialiser le mot de passe (cas succès)", async () => {
		const dto: ResetPasswordDto = {
			token: "fake-token",
			newPassword: "NewPassword123!",
		};

		// Mock du token décodé
		jwtService.verify.mockReturnValue({
			type: "password_reset",
			email: "test@example.com",
		} as { type: "password_reset"; email: string });

		// Mock de l’utilisateur trouvé
		const user: Partial<IUser> = { id: 1, email: "test@example.com" };
		usersService.findByEmail.mockResolvedValue(user as never);

		// Mock de bcrypt.hash
		(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

		const result = await service.resetPassword(dto);

		expect(jwtService.verify).toHaveBeenCalledWith(dto.token);
		expect(usersService.findByEmail).toHaveBeenCalledWith("test@example.com");
		expect(bcrypt.hash).toHaveBeenCalledWith(dto.newPassword, 10);
		expect(usersService.updatePassword).toHaveBeenCalledWith(
			user.id,
			"hashed-password",
		);
		expect(result).toEqual({
			message: "Mot de passe réinitialisé avec succès",
		});
	});

	it("devrait rejeter un mot de passe avec un format invalide", async () => {
		const dto = new ResetPasswordDto();
		dto.token = "fake-token";
		// Mot de passe invalide : pas de majuscule, pas de chiffre, pas de caractère spécial
		dto.newPassword = "passwordincorrect";

		const errors = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		const newPasswordErrors = errors.find((e) => e.property === "newPassword");

		expect(newPasswordErrors).toBeDefined();
		expect(newPasswordErrors?.constraints?.matches).toBeDefined();
	});
});

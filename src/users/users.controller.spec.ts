// biome-ignore-all lint/suspicious/noExplicitAny: allow any in test mocks
import * as dotenv from 'dotenv';
import { Test, type TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateUserDto } from './dto/user.dto';
import { UserRole } from './enums/user-role.enum';

dotenv.config();

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsers = [
    {
      id: 1,
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      id: 2,
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have UsersService injected', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an object with users array', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers as any);

      const result = await controller.findAll();

      expect(result).toEqual({ users: mockUsers });
      expect(Array.isArray(result.users)).toBe(true);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual({ users: [] });
      expect(Array.isArray(result.users)).toBe(true);
      expect(result.users.length).toBe(0);
    });
  });

  describe('profile', () => {
    it('should return the authenticated user from request', async () => {
      const mockUserPayload = {
        userId: 1,
        email: 'user@example.com',
        role: UserRole.MEMBER,
      };

      const userFromService = {
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(userFromService as any);

      const mockRequest: any = {
        user: mockUserPayload,
      };

      const result = await controller.profile(mockRequest);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(userFromService);
      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'email' in result) {
        expect(result.email).toBe('user@example.com');
      }
    });

    it('should return user with ADMIN role', async () => {
      const mockAdminPayload = {
        userId: 2,
        email: 'admin@example.com',
        role: 'Admin',
      };

      const adminFromService = {
        id: 2,
        email: 'admin@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(adminFromService as any);

      const mockRequest: any = {
        user: mockAdminPayload,
      };

      const result = await controller.profile(mockRequest);

      expect(service.findById).toHaveBeenCalledWith(2);
      expect(result).toEqual(adminFromService);
      expect(result).toBeDefined();
      if (result && typeof result === 'object' && 'role' in result) {
        expect(result.role).toBe('Admin');
      }
    });
  });

  describe('create', () => {
    const mockCreateUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.MEMBER,
    };

    const mockCreatedUser = {
      id: 3,
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.MEMBER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user successfully', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser as any);

      const result = await controller.create(mockCreateUserDto);

      expect(service.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(service.create).toHaveBeenCalled();
      expect(result.email).toBe(mockCreateUserDto.email);
      expect(result.firstName).toBe(mockCreateUserDto.firstName);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'newuser@example.com',
        firstName: 'Existing',
        lastName: 'User',
        password: 'hashed',
        role: UserRole.MEMBER,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValue(existingUser as any);
      const createSpy = jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser as any);

      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(service.findByEmail).toHaveBeenCalledWith(mockCreateUserDto.email);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('should hash the password before creating user', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

      jest.spyOn(service, 'create').mockResolvedValue(mockCreatedUser as any);

      await controller.create(mockCreateUserDto);

      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockCreateUserDto.email,
          firstName: mockCreateUserDto.firstName,
          lastName: mockCreateUserDto.lastName,
        }),
      );
    });
  });
});

import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
  });

  it('should connect to database', async () => {
    await expect(
      prisma.$queryRaw`SELECT 1`
    ).resolves.not.toThrow();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
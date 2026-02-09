import { Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import type { CreateUserDto } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/user.dto";

const selectUser: Prisma.UserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  isActive: true
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: selectUser
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, select: selectUser });
  }

  findPasswordByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, select: {
      ...selectUser,
      password: true } });
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
        isActive: true
      },
      select: selectUser,
    });
  }

  updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: selectUser,
    });
  }

  update(userId: number, updateUserDto: UpdateUserDto ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: selectUser,
    });
  }

  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

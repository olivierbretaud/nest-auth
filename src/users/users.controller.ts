import { Body, Controller, Get, Req, Post, UseGuards, ConflictException, Put, ParseIntPipe, NotFoundException, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, DeleteUserResponseDto, UserResponseDto } from './dto/user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { ApiErrors } from '../common/swagger/errors';
import { UserAuth } from '@/auth/types/auth';
import { UpdateUserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  @ApiErrors('FORBIDDEN', 'UNAUTHORIZED')
  @ApiResponse({
    description: 'Liste des utilisateurs',
    status: 200,
    type: [UserResponseDto],
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilistateur connecté' })
  @ApiErrors('UNAUTHORIZED')
  @ApiResponse({
    description: 'Utilisateur connecté',
    status: 200,
    type: UserResponseDto,
  })
  async profile(@Req() req: Request & { user: UserAuth }) {
    const userId = Number(req.user.userId);
    const user = await this.usersService.findById(userId);
    return user;
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Création d'utilistateur" })
  @ApiCreatedResponse({
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  })
  @ApiErrors('FORBIDDEN', 'BAD_REQUEST', 'UNAUTHORIZED')
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('Email already exists');
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mise à jour d'un utilisateur" })
  @ApiOkResponse({
    description: 'Utilisateur modifié avec succès',
    type: UserResponseDto,
  })
  @ApiErrors('FORBIDDEN', 'BAD_REQUEST', 'UNAUTHORIZED', 'NOT_FOUND', 'CONFLICT')
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe
    ) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.email) {
      const userFound = await this.usersService.findByEmail(updateUserDto.email);
      if (user.id !== userFound?.id && userFound?.email === updateUserDto.email) throw new ConflictException('Email already exists');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Suppresion d'un utilisateur" })
  @ApiResponse({
    description: 'Utilisateur supprimer avec succès',
    type: DeleteUserResponseDto,
    status: 204,
  })
  @ApiErrors('FORBIDDEN', 'UNAUTHORIZED', 'NOT_FOUND')
  async delete(
    @Param('id', ParseIntPipe
    ) id: number,
  ) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.delete(id);
    return {
      id,
      message: "User successfully deleted."
    }
  }
}

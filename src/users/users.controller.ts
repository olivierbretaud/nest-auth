import * as bcrypt from 'bcrypt';
import { Body, Controller, Get, Req, Post, UseGuards, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
// biome-ignore lint:useImportType
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste retournée' })
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Création d'utilistateur" })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('Email already exists');
    return this.usersService.create({
      ...createUserDto,
      password: hash,
    });
  }
}

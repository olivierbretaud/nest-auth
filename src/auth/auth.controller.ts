import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { Throttle } from "@nestjs/throttler";
import {
  RequestResetPasswordDto,
  RequestResetPassworResponseDto,
} from "./dto/request-reset-password.dto";
import { ResetPasswordDto, ResetPassworResponseDto } from "./dto/reset-password.dto";
import { loginDto, loginResponseDto } from "./dto/login.dto";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { ApiErrors } from "../swagger/errors";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: loginDto })
  @ApiOkResponse({ type: loginResponseDto })
  @ApiErrors('UNAUTHORIZED')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute pour le login (protection contre brute force)
  login(@Body() body: loginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('request-reset-password')
  @ApiOperation({ summary: "User request reset password" })
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 demandes par minute pour éviter le spam
  @ApiOkResponse({ type: RequestResetPassworResponseDto })
  @ApiErrors('UNAUTHORIZED')
  async requestPasswordReset(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(requestResetPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: "User reset password" }) 
  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({ type: ResetPassworResponseDto })
  @ApiErrors('BAD_REQUEST')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
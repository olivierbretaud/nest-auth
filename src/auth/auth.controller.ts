import { Body, Controller, Post } from "@nestjs/common";
// biome-ignore lint:style/useImportType: <explanation>
import { AuthService } from "./auth.service";

import { Throttle } from "@nestjs/throttler";
// biome-ignore lint:style/useImportType: <explanation>
import { RequestResetPasswordDto } from "./dto/request-reset-password.dto";
// biome-ignore lint:style/useImportType: <explanation>
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { loginDto } from "./dto/login.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: loginDto })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute pour le login (protection contre brute force)
  login(@Body() body: loginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('request-reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 demandes par minute pour éviter le spam
  async requestPasswordReset(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(requestResetPasswordDto);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 tentatives par minute
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ApiZodBody, ZodBody } from '../../common/decorators/zod-body.decorator';
import { RegisterDto, RegisterUserSchema } from './dto/register.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RefreshDto, RefreshSchema } from './dto/refresh.dto';
import { ForgotPasswordSchema, ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordSchema, ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Criar nova conta' })
  @ApiZodBody(RegisterUserSchema)
  register(@ZodBody(RegisterUserSchema) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Autenticar com email e senha' })
  @ApiZodBody(LoginSchema)
  login(@ZodBody(LoginSchema) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trocar refresh token por novo par de tokens' })
  @ApiZodBody(RefreshSchema)
  refresh(@ZodBody(RefreshSchema) dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revogar refresh token' })
  @ApiZodBody(RefreshSchema)
  async logout(@ZodBody(RefreshSchema) dto: RefreshDto) {
    await this.authService.logout(dto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @ApiOperation({ summary: 'Solicita redefinição de senha' })
  @ApiZodBody(ForgotPasswordSchema)
  async forgotPassword(@ZodBody(ForgotPasswordSchema) body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body.email);
    return { message: 'Se o email existir, você receberá instruções para redefinir a senha' };
  }

  @Post('reset-password')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Redefine a senha usando token recebido por email' })
  @ApiZodBody(ResetPasswordSchema)
  async resetPassword(@ZodBody(ResetPasswordSchema) body: ResetPasswordDto) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Senha redefinida com sucesso' };
  }
}

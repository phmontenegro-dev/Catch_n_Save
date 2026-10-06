import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { ApiZodBody, ZodBody } from '../../common/decorators/zod-body.decorator';
import { RegisterDto, RegisterUserSchema } from './dto/register.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RefreshDto, RefreshSchema } from './dto/refresh.dto';

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
}

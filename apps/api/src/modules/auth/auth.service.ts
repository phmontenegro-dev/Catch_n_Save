import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from '../../infra/email/email.service';
import { buildPasswordResetEmail } from '../../infra/email/templates/password-reset';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult extends TokenPair {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
      },
    });

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = await this.issueTokens(user.id, user.email);
    return {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    // 1) Valida assinatura e expiração do JWT
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // 2) Confere se o hash do refresh está no banco e não foi revogado
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!stored || stored.revokedAt) {
      // Reuso de token revogado → possível vazamento. Revoga tudo do usuário.
      if (stored?.revokedAt) {
        await this.prisma.refreshToken.updateMany({
          where: { userId: payload.sub, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        throw new ForbiddenException('Refresh token reutilizado, sessão encerrada');
      }
      throw new UnauthorizedException('Refresh token não reconhecido');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // 3) Revoga o refresh atual e emite um novo par (rotação)
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(payload.sub, payload.email);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------

  private async issueTokens(userId: string, email: string): Promise<TokenPair> {
    const payload = { sub: userId, email };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    });

    // jti (JWT ID) aleatório garante que dois refreshes emitidos no mesmo segundo sejam distintos
    const jti = randomBytes(16).toString('hex');
    const refreshToken = await this.jwt.signAsync(
      { ...payload, jti },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
      },
    );

    // Grava hash no banco para permitir revogação
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const expiresAt = this.calculateExpiresAt(expiresIn);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiresAt(expiresIn: string): Date {
    // Formatos aceitos: "7d", "24h", "60m", "3600s"
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Formato inválido de expiresIn: ${expiresIn}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + value * multipliers[unit]);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // IMPORTANTE: não revelamos se o email existe ou não (evita user enumeration)
    // Sempre retornamos sucesso, mas só mandamos email se o usuário existe.
    if (!user) {
      this.logger.log({ email }, 'Forgot password solicitado para email não cadastrado');
      return;
    }

    // Invalida tokens anteriores não usados desse usuário
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    // Gera novo token
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    const expirationMinutes = Number(this.config.getOrThrow('PASSWORD_RESET_EXPIRATION_MINUTES'));
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Monta a URL de reset
    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/resetar-senha?token=${rawToken}`;

    // Envia email
    await this.emailService.send({
      to: user.email,
      subject: "Redefinir sua senha — Catch 'n Save",
      html: buildPasswordResetEmail({
        userName: user.name,
        resetUrl,
        expirationMinutes,
      }),
    });

    this.logger.log({ userId: user.id, email: user.email }, 'Email de reset enviado');
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Token inválido');
    }

    if (resetToken.usedAt) {
      throw new BadRequestException('Token já utilizado');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    // Hash da nova senha com Argon2
    const passwordHash = await argon2.hash(newPassword);

    // Atualiza senha + marca token como usado + revoga refresh tokens existentes
    // (força logout de todas as sessões — comportamento esperado após reset)
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    this.logger.log({ userId: resetToken.userId }, 'Senha redefinida com sucesso');
  }
}

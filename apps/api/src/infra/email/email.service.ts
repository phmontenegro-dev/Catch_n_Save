import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client: Resend;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.getOrThrow<string>('RESEND_FROM_EMAIL');
    this.fromName = this.configService.getOrThrow<string>('RESEND_FROM_NAME');

    this.client = new Resend(apiKey);
  }

  async send(params: SendEmailParams): Promise<void> {
    try {
      const { data, error } = await this.client.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      if (error) {
        this.logger.error({ error, to: params.to }, 'Falha ao enviar email via Resend');
        throw new Error(`Falha ao enviar email: ${error.message}`);
      }

      this.logger.log({ emailId: data?.id, to: params.to }, 'Email enviado com sucesso');
    } catch (err) {
      this.logger.error({ err, to: params.to }, 'Exceção ao enviar email');
      throw err;
    }
  }
}

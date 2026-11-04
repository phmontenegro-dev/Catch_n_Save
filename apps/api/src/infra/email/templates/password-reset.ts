export type PasswordResetEmailParams = {
  userName: string;
  resetUrl: string;
  expirationMinutes: number;
};

export function buildPasswordResetEmail(params: PasswordResetEmailParams): string {
  const { userName, resetUrl, expirationMinutes } = params;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redefinir senha</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1C1C1C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1C1C1C; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #262626; border-radius: 12px; overflow: hidden;">

              <!-- Header -->
              <tr>
                <td style="padding: 32px 40px 16px; border-bottom: 1px solid #333;">
                  <h1 style="margin: 0; font-size: 20px; color: #F5C518; letter-spacing: 1px;">CATCH 'N SAVE</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 16px; font-size: 24px; color: #F2EFE8; font-weight: 700;">Redefinir sua senha</h2>

                  <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #A3A3A3;">
                    Olá, ${userName}.
                  </p>

                  <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #A3A3A3;">
                    Recebemos um pedido para redefinir a senha da sua conta. Se foi você, clica no botão abaixo. Senão, pode ignorar esse email.
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                    <tr>
                      <td style="background-color: #F5C518; border-radius: 8px;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 700; color: #1C1C1C; text-decoration: none;">
                          Redefinir senha
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 8px; font-size: 13px; color: #666;">
                    Esse link expira em ${expirationMinutes} minutos.
                  </p>

                  <p style="margin: 0; font-size: 13px; color: #666;">
                    Se o botão não funcionar, copia e cola essa URL no navegador:
                  </p>
                  <p style="margin: 8px 0 0; font-size: 12px; color: #A3A3A3; word-break: break-all;">
                    ${resetUrl}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; border-top: 1px solid #333; background-color: #1C1C1C;">
                  <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.5;">
                    Esse email foi enviado automaticamente. Não responda a esse endereço.<br>
                    Se você não pediu uma redefinição de senha, entre em contato conosco.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

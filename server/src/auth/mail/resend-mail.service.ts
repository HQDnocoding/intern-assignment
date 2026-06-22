import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { IMailService } from '../../common/interfaces/mail.interface.js';

@Injectable()
export class ResendMailService implements IMailService {
    private readonly logger = new Logger(ResendMailService.name);
    private readonly resend: Resend;
    private readonly backendUrl: string;
    private readonly fromAddress: string;

    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
        this.backendUrl = this.config.get<string>('BACKEND_URL') ?? 'http://localhost:3000';
        const fromEmail = this.config.get<string>('MAIL_FROM_EMAIL') ?? 'noreply@yourdomain.com';
        const fromName = this.config.get<string>('MAIL_FROM_NAME') ?? 'Demo';
        this.fromAddress = `${fromName} <${fromEmail}>`;
    }

    async sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
        const callbackURL = '/dashboard/onboarding?redirectTo=%2Fdashboard';
        const params = new URLSearchParams({ token, callbackURL });
        const verifyUrl = `${this.backendUrl}/auth/verify-email?${params.toString()}`;
        const safeName = name || 'there';

        const { error } = await this.resend.emails.send({
            from: this.fromAddress,
            to: email,
            subject: 'Verify email address',
            html: this.buildHtml(safeName, verifyUrl),
            text: this.buildText(safeName, verifyUrl),
        });

        if (error) {
            this.logger.error(`Failed to send verification email to ${email}`, error);
            throw new Error(`Email delivery failed: ${error.message}`);
        }
    }

    private buildHtml(name: string, verifyUrl: string) {
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0;background:#fff;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
      Email Verification
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff;padding:40px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:465px;border:1px solid #eaeaea;border-radius:4px;padding:20px;">
            <tr>
              <td>
                <h1 style="margin:30px 0 30px;text-align:center;font-size:24px;font-weight:400;color:#000;letter-spacing:0;">Email Verification</h1>
                <p style="margin:16px 0;font-size:14px;line-height:24px;color:#000;">Hello ${name},</p>
                <p style="margin:16px 0;font-size:14px;line-height:24px;color:#000;">To complete your account, you need verify your email address.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;text-align:center;">
                  <tr>
                    <td>
                      <a href="${verifyUrl}" target="_blank" style="display:inline-block;min-width:140px;background:#000;color:#fff;text-decoration:none;font-size:12px;font-weight:600;line-height:1;padding:12px 20px;border-radius:4px;">Verify email</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:16px 0;font-size:14px;line-height:24px;color:#000;">
                  or copy and paste this URL into your browser:
                  <a href="${verifyUrl}" target="_blank" style="color:#155dfc;text-decoration:none;word-break:break-all;">${verifyUrl}</a>
                </p>
                <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;" />
                <p style="margin:16px 0;font-size:12px;line-height:24px;color:#666;">
                  If you don't want to verify your email or didn't request this, just ignore and delete this message.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
    }

    private buildText(name: string, verifyUrl: string) {
        return [
            'EMAIL VERIFICATION',
            '',
            `Hello ${name},`,
            '',
            'To complete your account, you need verify your email address.',
            '',
            `Verify email: ${verifyUrl}`,
            '',
            '----------------------------------------',
            '',
            "If you didn't request this, just ignore and delete this message.",
        ].join('\n');
    }
}

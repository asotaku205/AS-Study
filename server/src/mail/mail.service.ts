import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(to: string, siteName: string) {
    const subject = `[${siteName}] Email kiểm tra hệ thống`;
    const text = `Đây là email thử nghiệm từ ${siteName}. Kết nối SMTP hoạt động bình thường.`;
    const html = `<p>Đây là email thử nghiệm từ <strong>${siteName}</strong>.</p><p>Kết nối SMTP hoạt động bình thường.</p>`;
    await this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
  }

  async sendResetPasswordEmail(to: string, resetLink: string) {
    const subject = 'Yêu cầu đặt lại mật khẩu';
    const text = `Đặt lại mật khẩu: ${resetLink}`;
    const html = `<p>Đặt lại mật khẩu: <a href="${resetLink}">${resetLink}</a></p>`;
    await this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
  }
}
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

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
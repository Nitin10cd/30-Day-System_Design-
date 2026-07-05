import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export interface SendEmailInput {
  to: string;
  subject?: string;
  message: string;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const tx = getTransporter();
  await tx.sendMail({
    from: env.emailFrom,
    to: input.to,
    subject: input.subject ?? 'Notification',
    text: input.message,
  });
}
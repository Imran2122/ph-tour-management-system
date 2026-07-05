/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import strict from "node:assert/strict";
import path from "node:path";
import ejs from "ejs";
import AppError from "../errorHelper/AppError";
const transporter = nodemailer.createTransport({
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface sendMailerOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    contact: Buffer | string;
    contentType: string;
  }[];
}

export const sentEmail = async ({
  to,
  subject,
  attachments,
  templateName,
  templateData,
}: sendMailerOptions) => {
  try {
    const templatePath = path.join(__dirname, `template/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.contact,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F email sent to ${to}:${info.messageId}`);
  } catch (error: any) {
    console.log("Email Error", error.message);
    throw new AppError(401, "email error");
  }
};

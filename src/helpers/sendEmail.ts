import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.mail,
    pass: config.mailPassword,
  },
});

export async function sendLoginCode(to: string, code: string) {
  const mailOptions = {
    from: config.mail,
    to,
    subject: "Your one-time login code",
    text: `Hi there!\n\nYour login code is: ${code}\nIt expires in 5 minutes.\n\n—DMS App`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function sendInviteEmail(to: string, companyId: string) {
  const loginUrl = `${config.app_url}/sign-in?companyId=${companyId}`; // example link

  const mailOptions = {
    from: config.mail,
    to,
    subject: "You've been invited to join DMS",
    text: `Hey there,

You've been invited to join the Developer Management System (DMS).

To get started, simply click the link below to sign in directly:

  ${loginUrl}

This url will expire in 15 minutes, so don't snooze on it. 😴

See you inside,
— The DMS Team`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

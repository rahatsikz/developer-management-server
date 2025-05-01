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
    text: `Hi there!\n\nYour login code is: ${code}\nIt expires in 5 minutes.\n\n—Your App`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

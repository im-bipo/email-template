import nodemailer from "nodemailer";
import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { siteDataMap } from "./data/data.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export async function sendMail(templateName, siteId, payloadData = {}) {
  // static recipients and subject from env take precedence
  const siteData =
    siteDataMap && siteDataMap[siteId] ? siteDataMap[siteId] : {};
  const locals = Object.assign({}, payloadData, { siteData });

  await transporter.verify();

  const templatePath = path.join(__dirname, "views", `${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, locals);

  const fromName =
    process.env.FROM_NAME ||
    (siteData && siteData.site && siteData.site.siteName) ||
    "No Reply";
  const fromEmail = process.env.FROM_EMAIL || "noreply@example.com";

  const to = "bipinkhatri.ram@gmail.com";
  const subject = "Notification";

  if (!to) {
    throw new Error(
      "No recipient configured. Set EMAIL_TO in .env or add siteData.notifications.to",
    );
  }

  const mailOptions = {
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

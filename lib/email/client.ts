import nodemailer from "nodemailer"

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || "",
    pass: process.env.GMAIL_APP_PASSWORD || "",
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return { success: false, error: "Missing Gmail credentials" }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Golf Club Inc." <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    })

    return { success: true, messageId: info.messageId }
  } catch (err: any) {
    console.error("Send failed:", err)
    return { success: false, error: err.message }
  }
}

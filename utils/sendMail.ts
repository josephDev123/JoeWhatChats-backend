import nodemailer from "nodemailer";

// Define SMTP configuration
const smtpConfig = {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8c619e086a8eaa",
    pass: "59b31dc12492de",
  },
};

// Create a reusable transporter
const transporter = nodemailer.createTransport(smtpConfig);

// Define a function to send emails
export const sendMail = async ({ otp, email }: { otp: any; email: any }) => {
  try {
    const info = await transporter.sendMail({
      from: "JosephUzuegbu@gmail.com",
      to: email,
      subject: "Confirmation OTP",
      text: otp,
      html: `<p>Pls don't expose this otp: ${otp}</p>`,
    });
    return info.messageId;
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

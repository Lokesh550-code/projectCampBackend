import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const mailGenrator = new Mailgen({
    theme: "default",
    product: {
      name: "Task manager",
      link: "https://taskManagerlink.com",
    },
  });

  const emailTextual = mailGenrator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenrator.generate(options.mailgenContent);

  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHTML,
  };

  try {
    await transport.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently, this might have happened because of missing credentials. Make suree you have provided your MAILTRAP credentials in the .env file",
    );

    console.error("Error: ", error);
  }
};

export const emailVerificationMailgenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We'are excited to have you on board.",
      action: {
        instructions:
          "To verify your email, please click on the button given below.",
        button: {
          color: "#3ba9d9",
          text: "Verify your email",
          link: verificationURL,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const passwordRecoveryMailgenContent = (username, passwordResetURL) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account.",
      action: {
        instructions: "To reset your password, click on the button below.",
        button: {
          color: "#d44343",
          text: "Verify your email",
          link: passwordResetURL,
        },
      },
      outro:
        "If you did not request for a password reset, then please ignore this email.",
    },
  };
};

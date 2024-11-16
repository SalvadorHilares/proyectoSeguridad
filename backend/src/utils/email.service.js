require("dotenv").config();
const nodemailer = require('nodemailer');
const { EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "shilaresbarrios@gmail.com",
    pass: EMAIL_PASSWORD
  }
});

const sendEmail = async ({ from, to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"${from.name} ${from.lastName}" <${from.email}>`,
      to: `"${to.name} ${to.lastName}" <${to.email}>`,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Error sending email via SMTP");
  }
};

module.exports = { sendEmail };

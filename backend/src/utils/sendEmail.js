import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  const mailOptions = {
    // from: "no-reply.wattsup@gmail.com",
    // from: "no-reply.whatsup@gmail.com",
    // from: "no-reply@yourapp.com",

    from: "whatsup.helpteam@gmail.com",
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;

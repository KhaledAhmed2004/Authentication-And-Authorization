import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for 465, false for other ports
    auth: {
      user: "khaledahmednayeem2002@gmail.com",
      pass: "jn7jnAPss4f63QBp6D",
    },
  });
  // send mail with defined transport object
  await transporter.sendMail({
    from: "khaledahmednayeem2002@gmail.com", // sender address
    to, // list of receivers
    subject: "Reset your password within 10 minits!", // Subject line
    text: "", // plain text body
    html, // html body
  });
};

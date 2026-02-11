import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//     },
// });
// console.log(transporter);
// export default transporter;

// const nodemailer = require('nodemailer');
// require('dotenv').config();
import dotenv from "dotenv";
dotenv.config();


const sendEmail = async (to, subject, html) => {
    console.log(to, "data")
    try {
        if (!to || (Array.isArray(to) && to.length === 0)) {
            throw new Error("Recipient email (to) is missing");
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: html
        });

        console.log("Email sent:", info.messageId);
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };

    } catch (error) {
        console.error("Email Error:", error.message);
        return {
            success: false,
            error: error.message,
            code: error.code || null
        };
    }
};


export default sendEmail;
import nodemailer from "nodemailer";

const sendEmail = async function name(email, subject, message) {
    
   const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, 
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });


    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // sender address
        to: email, // list of recipients
        subject: subject, // subject line
        html: message, // HTML body
    });
};


export default sendEmail;
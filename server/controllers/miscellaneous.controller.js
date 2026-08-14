import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

const contactUs = async(req,res,next)=>{
    const { name, email, message } = req.body;

    if(!name || !email || !message){
        return next(new AppError("All fields are required", 400));
    }

    try{
        const emailMessage = `Name : ${name}\nEmail : ${email}\nMessage : ${message}`;
        
        // send email to the organisation

        await sendEmail(
            process.env.SMTP_FROM_EMAIL,
            "Contact Us",
            emailMessage
        );

        // Send confirmation email to the user
        const userMessage = `Hello ${name},\nThank you for contacting us! We have received your message and will get in touch with you soon.\n\nBest regards,\nThe LMS Team 😊`;

        await sendEmail(
            email,
            'Thank You for Contacting Us',
            userMessage,
        );

        res.status(200).json({
            success : true,
            message : "Thanks for contacting. We have sent you a confirmation email and will get in touch with you soon."
        });

    } catch(error){
        return next(new AppError(error.message, 500));
    }

}


export {contactUs};
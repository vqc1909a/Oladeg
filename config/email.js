import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({path: ".env"});

export const transport = nodemailer.createTransport({
    host: process.env.NODE_ENV === "production" ?  process.env.EMAIL_HOST :  process.env.EMAIL_HOST_DEV,
    port: process.env.NODE_ENV === "production" ?  process.env.EMAIL_PORT :  process.env.EMAIL_PORT_DEV,
    secure: process.env.NODE_ENV === "production" ? true : false,
    auth: {
        user: process.env.NODE_ENV === "production" ? process.env.EMAIL_USER : process.env.EMAIL_USER_DEV,
        pass: process.env.NODE_ENV === "production" ? process.env.EMAIL_PASS : process.env.EMAIL_PASS_DEV 
    }
});

export const transportNoReply = nodemailer.createTransport({
    host: process.env.NODE_ENV === "production" ?  process.env.EMAIL_NOREPLY_HOST :  process.env.EMAIL_NOREPLY_HOST_DEV,
    port: process.env.NODE_ENV === "production" ?  process.env.EMAIL_NOREPLY_PORT :  process.env.EMAIL_NOREPLY_PORT_DEV,
    secure: process.env.NODE_ENV === "production" ? true : false,
    auth: {
        user: process.env.NODE_ENV === "production" ? process.env.EMAIL_NOREPLY_USER : process.env.EMAIL_NOREPLY_USER_DEV,
        pass: process.env.NODE_ENV === "production" ? process.env.EMAIL_NOREPLY_PASS : process.env.EMAIL_NOREPLY_PASS_DEV 
    }
});
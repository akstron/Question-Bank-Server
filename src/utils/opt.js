/**
 * Utilities related to handling OTP
 */

const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const { ClientError } = require('./errorHandler');

const createOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

/* Sending OTP */
const sendOtp = async (email, code) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_SENDER_NAME,
        to: email,
        subject: 'Email confirmation',
        html: `OTP = ${code}`
    };
    
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, response) => {
            if(error) return reject(error);
            resolve(response);
        });
    })
}

module.exports.handleOtp = async (user) => {
    const otp = createOtp();
    await Otp.create({otp, UserId: user.id});
    await sendOtp(user.email, otp);
}

module.exports.handleOtpVerification = async (user, otp) => {
    const otpFromDB = await Otp.findByPk(user.id);
    if(!otpFromDB){
        throw new ClientError('No user found');
    }

    if(otpFromDB.otp != otp){
        throw new ClientError('Invalid OTP');
    }

    user.isVerified = true;
    await user.save();
    await otpFromDB.destroy();
}
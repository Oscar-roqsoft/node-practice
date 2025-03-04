const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const redisClient = require('../db/redis');
const { ttl } = require('./constants');

// Twilio and Nodemailer setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendOTP = async (user, preferredMethod) => {
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
//   const ttl = ttl; // 10 minutes in seconds

  // Store OTP in Redis with email as key
  await redisClient.setEx(`otp:${user.email}`, ttl, otp);

  if (preferredMethod === 'email') {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Account',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });
  } else if (preferredMethod === 'phone') {
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}. It expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: user.phoneNumber,
    });
  }

  return otp; // For testing; remove in production
};

module.exports = sendOTP;
const nodemailer = require('nodemailer')

exports.generateOTP = (number = 6) => {

    let OTP = "";
      for (let i = 0; i <= 5; i++) {
        OTP += Math.round(Math.random() * 9);
      }

    return OTP;
}

exports.generateMailTransport = () =>nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS
    }
  });
const User = require("../models/userModel");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordRestToken = require("../models/passwordResetTokenModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransport } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const transport = generateMailTransport();

const userCrtl = {
  createUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const check = await User.findOne({ email: email });
      if (check) return sendError(res, "The email already exists");
      const newUser = new User({ name, email, password });
      await newUser.save();

      // generation 6 digit otp

      let OTP = generateOTP(6);
      // store otp inside our db
      const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
      });
      await newEmailVerificationToken.save();
      // send mail
      transport.sendMail({
        from: "verification@t&t.com",
        to: newUser.email,
        subject: "Email Verification",
        html: `
          <p>Your verification OTP</p>
          <h1>${OTP}</h1>
        `,
      });

      // const accessToken = createAccessToken({ id: newUser._id })
      // const refreshtoken = createRefreshToken({ id: newUser._id });
      // res.cookie('refreshtoken', refreshtoken,{
      //   httpOnly: true,
      //     path: '/api/user/refreshtoken',
      //     maxAge: 7*24*60*60*1000
      // });
      res.status(200).json({
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (err) {
      sendError(res, err);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return sendError(res, "User dose not exits");
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return sendError(res, "Password not matched!");
      }
      // if Login successful, create access token and refresh token
      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/user/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken: accessToken });
    } catch (err) {
      sendError(res, err);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/user/refreshtoken" });
      return res.end();
    } catch (err) {
      sendError(res, err);
    }
  },
  refreshToken: (req, res, next) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return sendError(res, "Please Login or Register");

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return sendError(res, "Please Login or Register");
        const accessToken = createAccessToken({ id: user.id });

        res.json({ user, accessToken });
      });
    } catch (err) {}
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { userId, OTP } = req.body;
      if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");
      if (!OTP) return sendError(res, "OTP is invalid");

      const user = await User.findById(userId);
      if (!user) return sendError(res, "User not found!");

      if (user.isVerified) return sendError(res, "User is already verified!");

      const token = await EmailVerificationToken.findOne({ owner: userId });
      if (!token) return sendError(res, "Token not found!");

      const isMatched = await token.compareToken(OTP);
      if (!isMatched) return sendError(res, "Please submit a valid OTP!");

      user.isVerified = true;
      await user.save();

      transport.sendMail({
        from: "verification@t&t.com",
        to: user.email,
        subject: "Welcome Email",
        html: "<h1>Welcome to our app and thanks for choosing us.</h1>",
      });

      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/user/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ accessToken: accessToken, message: "Your email is verified." });
    } catch (err) {
      sendError(res, err);
    }
  },
  resendEmailVerificationToken: async function (req, res) {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) return sendError(res, "User not found!");

      if (user.isVerified)
        return sendError(res, "This email id is already verified!");

      const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: userId,
      });

      if (alreadyHasToken)
        return sendError(
          res,
          "Only after one hour you can request for another token!"
        );

      let OTP = generateOTP(6);
      // store otp inside our db
      const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP,
      });
      await newEmailVerificationToken.save();
      // send mail
      transport.sendMail({
        from: "verification@t&t.com",
        to: user.email,
        subject: "Email Verification",
        html: `
          <p>Your verification OTP</p>
          <h1>${OTP}</h1>
        `,
      });

      res.status(200).json({message: "New OTP has been sent to your registered email account."});
    } catch (err) {}
  },
  forgetPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) res.sendError(res, "Email is missing!");

      const user = await User.findOne({ email: email });
      if (!user) return sendError(res, "User not found!");
      const alreadyHasToken = await PasswordRestToken.findOne({
        owner: user._id,
      });
      if (alreadyHasToken)
        return sendError(
          res,
          "Only after one hour you can request for another token!"
        );
      // hash string
      const token = await generateRandomByte();

      const newPasswordRestToken = new PasswordRestToken({
        owner: user._id,
        token: token,
      });
      await newPasswordRestToken.save();
      const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;
      transport.sendMail({
        from: "sercurity@t&t.com",
        to: user.email,
        subject: "Reset Password Link",
        html: `
        <p>Click here to reset your password</p>
        <a href=${resetPasswordUrl}>Change Password</a>
      `,
      });

      res.status(200).json({ message: "Link sent to your email!" });
    } catch (err) {
      return sendError(res, err);
    }
  },
  sendResetPasswordTokenStatus: (req, res, next) => {
    res.status(200).json({ valid: true });
  },
  resetPassword: async (req, res, next) => {
    try {
      const { newPassword, userId } = req.body;
      const user = await User.findById(userId);

      const matched = await user.comparePassword(newPassword);
      if (matched)
        return sendError(
          res,
          "The new password must be different from the old one!"
        );

      user.password = newPassword;
      await user.save();
      await PasswordRestToken.findByIdAndDelete(req.resetToken._id);

      transport.sendMail({
        from: "sercurity@t&t.com",
        to: user.email,
        subject: "Password Reset Successfully",
        html: `
        <h1>Password Reset Successfully</h1>
        <p>Now you can use new password.</p>
        `,
      });
      res.status(200).json({
        message: "Password Reset Successfully, now you can use new password",
      });
    } catch (err) {}
  },
  getUserInfo: async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");
      if (!user) return sendError(res, "User not found");
      res.status(200).json({ user });
    } catch (err) {}
  },
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const createAccessToken = (user) => {
  console.log(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "11m",
  });
};

module.exports = userCrtl;

// exports.verifyEmail = async (req, res, next) => {
//   try {
//     const {userId, OTP} = req.body;
//     if(!isValidObjectId(userId)) return res.json({error: "Invalid user!"});

//     const user = await User.findById(userId);
//     if(!user) return res.status(400).json({message: "User not found!"});

//     if(user.isVerified) return res.status(400).json({message: "User is already verified!"});

//     const token = await EmailVerificationToken.findOne({owner: userId});

//     if(!token) return res.status(400).json({message: "Token not found!"})

//     const isMatched = await token.compaireToken(OTP);
//     if(!isMatched) return res.status(400).json({message: "Please submit a valid OTP!"});

//     user.isVerified = true;
//     await user.save();

//     transport.sendMail({
//       from: "verification@t&t.com",
//       to: newUser.email,
//       subject: "Welcome Email",
//       html: "<h1>Welcome to our app and thanks for choosing us.</h1>",
//     });

//     res.status(200).json({message: "Your email is verified."});
//   }
//   catch (err) {

//   }
// }

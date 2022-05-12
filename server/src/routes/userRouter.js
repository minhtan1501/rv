const userCrtl = require("../controllers/userCtrl");
const { auth, admin } = require("../middleware/auth");

const { isValidPassRestToken } = require("../middleware/user");
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middleware/validator");
const userRoute = require("express").Router();
userRoute.get("/logout", userCrtl.logout);
userRoute.get("/info",auth, userCrtl.getUserInfo);
userRoute.post("/verify-email", userCrtl.verifyEmail);
userRoute.post("/resend-email-verify", userCrtl.resendEmailVerificationToken);
userRoute.get("/refreshtoken", userCrtl.refreshToken);
userRoute.post("/create", userValidator, validate, userCrtl.createUser);
userRoute.post("/login", signInValidator, validate, userCrtl.login);
userRoute.post("/forget-password", userCrtl.forgetPassword);
userRoute.post(
  "/verify-pass-reset-token",
  isValidPassRestToken,
  userCrtl.sendResetPasswordTokenStatus
);
userRoute.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassRestToken,
  userCrtl.resetPassword
);
module.exports = userRoute;

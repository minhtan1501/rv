const userCrtl = require("../controllers/userCtrl");
const { auth, admin } = require("../middleware/auth");

const { isValidPassRestToken } = require("../middleware/user");
const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middleware/validator");
const userRouter = require("express").Router();
userRouter.get("/logout", userCrtl.logout);
userRouter.get("/info",auth, userCrtl.getUserInfo);
userRouter.post("/verify-email", userCrtl.verifyEmail);
userRouter.post("/resend-email-verify", userCrtl.resendEmailVerificationToken);
userRouter.get("/refreshtoken", userCrtl.refreshToken);
userRouter.post("/create", userValidator, validate, userCrtl.createUser);
userRouter.post("/login", signInValidator, validate, userCrtl.login);
userRouter.post("/forget-password", userCrtl.forgetPassword);
userRouter.post(
  "/verify-pass-reset-token",
  isValidPassRestToken,
  userCrtl.sendResetPasswordTokenStatus
);
userRouter.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassRestToken,
  userCrtl.resetPassword
);
module.exports = userRouter;

import express from "express";
import {
  logoutUser,
  registerUser,
  loginUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  getCurrentUser,
  resetCurrentPassword,
  resendEmailVerification,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userFrogotPasswordValidator,
  userResetForgotPasswordValidator,
} from "../validators/index.js";

const router = express.Router();

// insecure routes
router.post("/register", userRegisterValidator(), validate, registerUser);
router.post("/login", userLoginValidator(), validate, loginUser);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/refresh-token", refreshAccessToken);
router.post(
  "/forgot-password",
  userFrogotPasswordValidator(),
  validate,
  forgotPasswordRequest,
);
router.post(
  "/rest-password/:resetToken",
  userResetForgotPasswordValidator(),
  validate,
  resetForgotPassword,
);

//  secure routes
router.get("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, resetCurrentPassword);
router.post("/resend-email-verification", verifyJWT, resendEmailVerification);

export default router;

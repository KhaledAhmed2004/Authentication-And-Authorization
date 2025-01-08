import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidation),
  AuthController.loginUser
);

router.post(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(AuthValidation.changedPasswordValidation),
  AuthController.changedPassowrd
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoute = router;

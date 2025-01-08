import { z } from "zod";

const loginValidation = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const changedPasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "old password is requird" }).min(6),
    newPassword: z.string({ required_error: "password is requird" }).min(6),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "refresh token is required" }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "User email is required." }).email(),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "User email is required." }).email(),
    newPassword: z.string({ required_error: "password is requird" }).min(6),
  }),
});

export const AuthValidation = {
  loginValidation,
  changedPasswordValidation,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};

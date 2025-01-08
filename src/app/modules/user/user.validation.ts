import { string, z } from "zod";
import { UserStatus } from "./user.constant";

const userValidactionSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["user", "admin"]).default("user"),
    status: z.enum(["active", "blocked"]).default("active"),
    isDeleted: z.boolean().default(false),
  }),
});

const changeStatusValidactionSchema = z.object({
  body: z.object({ status: z.enum([...UserStatus] as [string, ...string[]]) }),
});

export const UserValidaction = {
  userValidactionSchema,
  changeStatusValidactionSchema,
};

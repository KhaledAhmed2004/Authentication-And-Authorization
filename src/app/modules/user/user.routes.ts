import { USER_ROLE } from "./user.constant";
import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidaction } from "./user.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-student",
  validateRequest(UserValidaction.userValidactionSchema),
  UserControllers.createUser
);

router.get("/students", UserControllers.getAllUsersFromDB);

router.get(
  "/student/:id",
  auth(USER_ROLE.user),
  UserControllers.getSingleUserFromDB
);
router.post(
  "/change-status/:id",
  auth(USER_ROLE.admin),
  validateRequest(UserValidaction.changeStatusValidactionSchema),
  UserControllers.changeStatus
);

router.get("/me", auth(USER_ROLE.user, USER_ROLE.admin), UserControllers.getMe);

export const UserRouter = router;

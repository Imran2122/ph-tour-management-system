
import { Router } from "express";
import { userController } from "./user.controller";

import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
// higher order function

const router = Router();
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser,
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers,
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser,
);

export const userRoutes = router;

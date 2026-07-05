import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
} from "./tour.validation";
import { TourController } from "./tour.controller";
import { updateDivisionSchema } from "../division/division.validation";
import { DivisionController } from "../division/division.controller";
import { multerUpload } from "../../config/multer.config";
const router = express.Router();
/*
----------------tour router----------------
*/
router.get("/", TourController.getAllTours);
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  TourController.creteTour,
);

router.get("/:slug",DivisionController.getSingleDivision)

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateDivisionSchema),
  TourController.updateTour,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour,
);

/*
----------------tour router ----------------
*/

/*
----------------TOUR TYPE ROUTES ----------------
*/

router.get("/tour-types", TourController.getAllTourTypes);

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.createTourType,
);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.updateTourType,
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourTypes,
);

export const TourRoutes = router;

import { Router } from "express";

import { userRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { DivisionRoutes } from "../module/division/division.route";
import { TourRoutes } from "../module/tour/tour.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
     route: TourRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

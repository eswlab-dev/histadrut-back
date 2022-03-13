import { Router } from "express";
const router = Router();

import * as mondayController from "../controllers/monday.controller";
import authenticationMiddleware from "../middlewares/authentication";

router.post(
  "/monday/watch_group",
  authenticationMiddleware,
  mondayController.executeAction
);

export default router;

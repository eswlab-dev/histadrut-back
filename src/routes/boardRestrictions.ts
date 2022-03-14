import { Router } from "express";
import * as restrictionController from "../controllers/restriction.controller";
const router = Router();
router.get(
  "/account/:accountId",
  restrictionController.getBoardsRestrictionsByAccount
);
router.get(
  "/board/:accountId",
  restrictionController.getBoardsRestrictionsByAccount
);
router.post("/board", restrictionController.AddBoardRestriction);
router.put("/board", restrictionController.updateBoardRestriction);
router.delete("/board/:_id");
export default router;

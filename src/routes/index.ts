import express from "express";
const router = express.Router();
import mondayRoutes from "./monday";
import boardRestrictionsRoutes from "./boardRestrictions";
router.use(mondayRoutes);
router.use("/restriction", boardRestrictionsRoutes);
router.get("/", function (req, res) {
  res.json(getHealth());
});

router.get("/health", function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: "Healthy",
  };
}

export default router;

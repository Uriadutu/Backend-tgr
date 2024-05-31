import {
  getSKPD,
  createSKPD,
  updateSKPD,
  getSKPDById,
  deleteSKPD,
} from "../controllers/SKPD.js";
import express from "express";

const router = express.Router();

router.post("/skpd", createSKPD);
router.get("/skpd", getSKPD);
router.get("/skpd/:id", getSKPDById);
router.patch("/skpd/:id", updateSKPD);
router.delete("/skpd/:id", deleteSKPD);

export default router;

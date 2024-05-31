import express from "express"
import { getSlip, getSlipById, createSlip, rejectSlip, accSlip, getSlipByUser } from "../controllers/Slip.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js"

const router = express.Router()

router.get("/slips", getSlip)
router.get("/slips/:id", getSlipById)
router.get("/slips/user/:id", getSlipByUser)
router.post("/slips",verifyUser, createSlip)
router.patch("/slips/tolak/:id",verifyUser, rejectSlip)
router.patch("/slips/terima/:id",verifyUser, accSlip)

export default router
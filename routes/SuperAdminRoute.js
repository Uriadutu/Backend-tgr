import express from "express";
import {
    getSuperAdmin, getSuperAdminById, createSuperAdmin, deleteUser
} from  "../controllers/SuperAdmin.js"

const router = express.Router();

router.get("/super", getSuperAdmin);
router.get("/super/:id", getSuperAdminById);
router.post("/super", createSuperAdmin);
router.delete("/super/:id", deleteUser);

export default router;

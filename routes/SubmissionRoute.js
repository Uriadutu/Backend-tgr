import express from "express";
import {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmissionById,
  deleteSubmissionById,
  getSubmissionByUser,
  accSubmission,
  rejectSubmission,
} from "../controllers/Submission.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/submissions", getAllSubmissions);
router.get("/submissions/:id", getSubmissionById);
router.get("/submissions/user/:id", getSubmissionByUser);
router.post("/submissions",verifyUser, createSubmission);
router.patch("/submissions/terima/:id",verifyUser, accSubmission);
router.patch("/submissions/tolak/:id",verifyUser, rejectSubmission);
router.patch("/submissions/:id", updateSubmissionById);
router.delete("/submissions/:id", deleteSubmissionById);

export default router;

// src/routes/formSP2DK.routes.js
import { Router } from "express";
import {
  createFormSP2DKController,
  getAllFormSP2DKController,
  getFormSP2DKByIdController,
  updateFormSP2DKController,
  deleteFormSP2DKController,
} from "../controllers/formSP2DK.controller.js";

const router = Router();

// Nanti bisa ditambahkan middleware autentikasi di sini
// import { authenticateToken } from '../middlewares/auth.middleware.js';
// router.use(authenticateToken);

router.post("/", createFormSP2DKController);
router.get("/", getAllFormSP2DKController);
router.get("/:id", getFormSP2DKByIdController);
router.put("/:id", updateFormSP2DKController);
router.delete("/:id", deleteFormSP2DKController);

export default router;

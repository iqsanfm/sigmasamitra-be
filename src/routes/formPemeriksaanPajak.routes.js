// src/routes/formPemeriksaanPajak.routes.js
import { Router } from "express";
import {
  createFormPemeriksaanPajakController,
  getAllFormPemeriksaanPajakController,
  getFormPemeriksaanPajakByIdController,
  updateFormPemeriksaanPajakController,
  deleteFormPemeriksaanPajakController,
} from "../controllers/formPemeriksaanPajak.controller.js";

// import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Jika semua rute di bawah ini diproteksi
// router.use(authenticateToken);

router.post("/", createFormPemeriksaanPajakController);
router.get("/", getAllFormPemeriksaanPajakController);
router.get("/:id", getFormPemeriksaanPajakByIdController);
router.put("/:id", updateFormPemeriksaanPajakController);
router.delete("/:id", deleteFormPemeriksaanPajakController);

export default router;

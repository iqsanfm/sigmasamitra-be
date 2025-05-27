// src/routes/jenisPekerjaanTahunan.routes.js
import { Router } from "express";
import {
  createJenisPekerjaanTahunanController,
  getAllJenisPekerjaanTahunanController,
  getJenisPekerjaanTahunanByIdController,
  updateJenisPekerjaanTahunanController,
  deleteJenisPekerjaanTahunanController,
} from "../controllers/jenisPekerjaanTahunan.controller.js";

const router = Router();

// Contoh: Jika semua rute jenis pekerjaan tahunan perlu diproteksi ADMIN
// import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';
// router.use(authenticateToken, authorizeRole(['ADMIN']));

router.post("/", createJenisPekerjaanTahunanController);
router.get("/", getAllJenisPekerjaanTahunanController);
router.get("/:id", getJenisPekerjaanTahunanByIdController);
router.put("/:id", updateJenisPekerjaanTahunanController);
router.delete("/:id", deleteJenisPekerjaanTahunanController);

export default router;

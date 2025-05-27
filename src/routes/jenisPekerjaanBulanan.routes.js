// src/routes/jenisPekerjaanBulanan.routes.js
import { Router } from "express";
import {
  createJenisPekerjaanBulananController,
  getAllJenisPekerjaanBulananController,
  getJenisPekerjaanBulananByIdController,
  updateJenisPekerjaanBulananController,
  deleteJenisPekerjaanBulananController,
} from "../controllers/jenisPekerjaanBulanan.controller.js"; // Sesuaikan path jika perlu

// Nanti kita bisa tambahkan middleware autentikasi di sini jika diperlukan
// import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

// Contoh: Jika semua rute jenis pekerjaan bulanan perlu diproteksi dan hanya bisa diakses ADMIN
// router.use(authenticateToken, authorizeRole(['ADMIN']));

router.post("/", createJenisPekerjaanBulananController);
router.get("/", getAllJenisPekerjaanBulananController);
router.get("/:id", getJenisPekerjaanBulananByIdController);
router.put("/:id", updateJenisPekerjaanBulananController);
router.delete("/:id", deleteJenisPekerjaanBulananController);

export default router;

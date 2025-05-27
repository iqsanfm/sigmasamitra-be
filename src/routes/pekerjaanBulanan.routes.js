// src/routes/pekerjaanBulanan.routes.js
import { Router } from "express";
import {
  createPekerjaanBulananController,
  getAllPekerjaanBulananController,
  getPekerjaanBulananByIdController,
  updatePekerjaanBulananController,
  deletePekerjaanBulananController,
} from "../controllers/pekerjaanBulanan.controller.js";

// import { authenticateToken } from '../middlewares/auth.middleware.js'; // Jika akan diproteksi

const router = Router();

// Jika semua rute di bawah ini diproteksi
// router.use(authenticateToken);

router.post("/", createPekerjaanBulananController);
router.get("/", getAllPekerjaanBulananController);
router.get("/:id", getPekerjaanBulananByIdController);
router.put("/:id", updatePekerjaanBulananController);
router.delete("/:id", deletePekerjaanBulananController);

export default router;

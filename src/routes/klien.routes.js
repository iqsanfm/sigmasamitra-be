// src/routes/klien.routes.js
import { Router } from "express";
import {
  createKlienController,
  getAllKlienController,
  getKlienByIdController,
  updateKlienController,
  deleteKlienController,
} from "../controllers/klien.controller.js"; // Sesuaikan path jika perlu

// Nanti kita bisa tambahkan middleware autentikasi di sini
// import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Contoh: Semua rute klien mungkin perlu autentikasi
// router.use(authenticateToken); // Jika semua rute di bawah ini diproteksi

router.post("/", createKlienController);
router.get("/", getAllKlienController);
router.get("/:id", getKlienByIdController);
router.put("/:id", updateKlienController);
router.delete("/:id", deleteKlienController);

export default router;

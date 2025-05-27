// src/routes/pengguna.routes.js
import { Router } from "express";
import {
  createPengguna,
  getAllPengguna,
  getPenggunaById,
  updatePengguna,
  deletePengguna,
} from "../controllers/pengguna.controller.js";

// Nantinya kita akan import middleware autentikasi/otorisasi di sini
// import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js'; // Contoh

const router = Router();

// Rute untuk membuat pengguna baru
// Mungkin hanya ADMIN yang boleh membuat pengguna baru: authorizeRole(['ADMIN'])
router.post("/", createPengguna);

// Rute untuk mendapatkan semua pengguna
// Mungkin perlu autentikasi: authenticateToken
router.get("/", getAllPengguna);

// Rute untuk mendapatkan pengguna berdasarkan ID
// Mungkin perlu autentikasi: authenticateToken
router.get("/:id", getPenggunaById);

// Rute untuk memperbarui pengguna
// Mungkin hanya ADMIN atau pengguna itu sendiri yang boleh: authenticateToken, authorizeSelfOrAdmin
router.put("/:id", updatePengguna);

// Rute untuk menghapus pengguna
// Mungkin hanya ADMIN yang boleh: authenticateToken, authorizeRole(['ADMIN'])
router.delete("/:id", deletePengguna);

export default router;

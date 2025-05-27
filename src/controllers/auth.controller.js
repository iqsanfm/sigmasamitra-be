// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import * as PenggunaService from "../services/pengguna.service.js"; // Sesuaikan path jika perlu

// --- Controller untuk Register Pengguna Baru ---
export const register = async (req, res, next) => {
  try {
    const { nama_lengkap, email, password, role } = req.body; // Ambil role jika ada, service akan handle default

    // Validasi input dasar (bisa diperluas dengan library seperti Zod/Joi)
    if (!nama_lengkap || !email || !password) {
      const error = new Error("Nama lengkap, email, dan password wajib diisi.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const penggunaBaru = await PenggunaService.createPengguna({
      nama_lengkap,
      email,
      password,
      role, // Kirim role, service akan handle defaultnya jika tidak ada
    });

    res.status(201).json({
      message: "Registrasi pengguna berhasil",
      data: penggunaBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Login Pengguna ---
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email dan password wajib diisi.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const pengguna = await PenggunaService.loginUser(email, password); // Service akan handle verifikasi

    // Jika login berhasil, buat JWT
    const tokenPayload = {
      id: pengguna.id,
      email: pengguna.email,
      role: pengguna.role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } // Ambil dari .env atau default 1 jam
    );

    res.status(200).json({
      message: "Login berhasil",
      data: {
        token,
        user: pengguna, // Kirim data pengguna juga (tanpa password)
      },
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

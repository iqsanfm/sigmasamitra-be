// src/app.js (Contoh kerangka)
import express from "express";
import cors from "cors";
import mainRouter from "./src/routes/index.js"; // Impor router utama
// import errorHandler from './middlewares/errorHandler.js'; // Impor error handler

const app = express();

// Middleware dasar
app.use(cors()); // Atur CORS sesuai kebutuhan
app.use(express.json()); // Untuk parsing body JSON
app.use(express.urlencoded({ extended: true })); // Untuk parsing body URL-encoded

// Gunakan semua rute dari routes/index.js dengan prefix /api/v1 (atau tanpa prefix)
app.use("/api/v1", mainRouter); // Contoh dengan prefix versi

// Middleware untuk menangani rute tidak ditemukan (404)
app.use((req, res, next) => {
  const error = new Error("Resource tidak ditemukan");
  error.statusCode = 404;
  next(error);
});

const PORT = process.env.PORT || 5000; // Anda bisa ganti 3000 dengan port default lain

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan dengan lancar di http://localhost:${PORT}`);
});

// Middleware error handler global (harus diletakkan paling akhir)
// app.use(errorHandler); // Anda perlu membuat file errorHandler.js

export default app;

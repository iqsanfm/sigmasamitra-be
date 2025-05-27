// src/controllers/pengguna.controller.js
import * as PenggunaService from "../services/pengguna.service.js";

// --- Controller untuk Membuat Pengguna Baru ---
// Catatan: Fungsi ini mungkin tumpang tindih dengan fungsi register di auth.controller.js.
// Biasanya, pembuatan pengguna dilakukan melalui endpoint register atau oleh admin.
// Jika ini dimaksudkan untuk admin, pastikan ada otorisasi yang sesuai.
export const createPengguna = async (req, res, next) => {
  try {
    const dataPengguna = req.body;
    // Validasi input dasar (bisa diperluas)
    if (
      !dataPengguna.nama_lengkap ||
      !dataPengguna.email ||
      !dataPengguna.password
    ) {
      const error = new Error("Nama lengkap, email, dan password wajib diisi.");
      error.statusCode = 400; // Bad Request
      throw error;
    }
    const penggunaBaru = await PenggunaService.createPengguna(dataPengguna);

    res.status(201).json({
      message: "Pengguna berhasil dibuat",
      data: penggunaBaru, // Data sudah tanpa password dari service
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Mendapatkan Semua Pengguna ---
export const getAllPengguna = async (req, res, next) => {
  try {
    const semuaPengguna = await PenggunaService.getAllPengguna();
    res.status(200).json({
      message: "Berhasil mengambil semua data pengguna",
      data: semuaPengguna, // Data sudah tanpa password dari service
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Mendapatkan Pengguna Berdasarkan ID ---
export const getPenggunaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pengguna = await PenggunaService.getPenggunaById(id);
    // Service akan melempar error jika tidak ditemukan, jadi tidak perlu cek 'if (!pengguna)' di sini lagi.
    res.status(200).json({
      message: "Berhasil mengambil data pengguna",
      data: pengguna, // Data sudah tanpa password dari service
    });
  } catch (error) {
    // Jika error dari service memiliki statusCode, gunakan itu. Jika tidak, default ke 500.
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Memperbarui Pengguna ---
export const updatePengguna = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;

    // Validasi dasar: pastikan ada data yang dikirim untuk diupdate
    if (Object.keys(dataUpdate).length === 0) {
      const error = new Error("Tidak ada data yang dikirim untuk diperbarui.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const penggunaTerupdate = await PenggunaService.updatePengguna(
      id,
      dataUpdate
    );
    // Service akan melempar error jika pengguna tidak ditemukan.
    res.status(200).json({
      message: "Pengguna berhasil diperbarui",
      data: penggunaTerupdate, // Data sudah tanpa password dari service
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Menghapus Pengguna ---
export const deletePengguna = async (req, res, next) => {
  try {
    const { id } = req.params;
    const penggunaDihapus = await PenggunaService.deletePenggunaById(id);
    // Service akan melempar error jika pengguna tidak ditemukan.
    res.status(200).json({
      message: "Pengguna berhasil dihapus",
      data: penggunaDihapus, // Mengembalikan data pengguna yang dihapus (tanpa password)
    });
    // Alternatif: kirim status 204 No Content jika tidak ada body balasan
    // res.status(204).send();
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

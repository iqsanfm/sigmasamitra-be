// src/controllers/klien.controller.js
import * as KlienService from "../services/klien.service.js"; // Sesuaikan path jika perlu

// --- Controller untuk Membuat Klien Baru ---
export const createKlienController = async (req, res, next) => {
  try {
    const dataKlien = req.body;
    // TODO: Tambahkan validasi input di sini atau menggunakan middleware validasi
    if (!dataKlien.kode_klien || !dataKlien.nama_klien) {
      const error = new Error("Kode klien dan Nama klien wajib diisi.");
      error.statusCode = 400;
      throw error;
    }
    const klienBaru = await KlienService.createKlien(dataKlien);
    res.status(201).json({
      message: "Klien berhasil dibuat",
      data: klienBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Mendapatkan Semua Klien ---
export const getAllKlienController = async (req, res, next) => {
  try {
    const semuaKlien = await KlienService.getAllKlien();
    res.status(200).json({
      message: "Berhasil mengambil semua data klien",
      data: semuaKlien,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Mendapatkan Klien Berdasarkan ID ---
export const getKlienByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const klien = await KlienService.getKlienById(id);
    res.status(200).json({
      message: "Berhasil mengambil data klien",
      data: klien,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Memperbarui Klien ---
export const updateKlienController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    if (Object.keys(dataUpdate).length === 0) {
      const error = new Error("Tidak ada data yang dikirim untuk diperbarui.");
      error.statusCode = 400;
      throw error;
    }
    const klienTerupdate = await KlienService.updateKlienById(id, dataUpdate);
    res.status(200).json({
      message: "Klien berhasil diperbarui",
      data: klienTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// --- Controller untuk Menghapus Klien ---
export const deleteKlienController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await KlienService.deleteKlienById(id);
    res.status(200).json({
      // Atau 204 No Content jika service tidak mengembalikan data
      message: "Klien berhasil dihapus",
      data: result, // Opsional, tergantung apa yang dikembalikan service
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

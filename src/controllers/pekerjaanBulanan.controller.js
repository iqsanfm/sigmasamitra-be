// src/controllers/pekerjaanBulanan.controller.js
import * as PekerjaanBulananService from "../services/pekerjaanBulanan.service.js";

export const createPekerjaanBulananController = async (req, res, next) => {
  try {
    const { klienId, masa_pajak, tahun_pajak, jenisPekerjaanId } = req.body;
    if (!klienId || !masa_pajak || !tahun_pajak || !jenisPekerjaanId) {
      const error = new Error(
        "Field klienId, masa_pajak, tahun_pajak, dan jenisPekerjaanId wajib diisi."
      );
      error.statusCode = 400;
      throw error;
    }
    // Validasi tambahan untuk tipe data bisa dilakukan di sini atau dengan library validasi
    if (typeof tahun_pajak !== "number") {
      const error = new Error("Tahun pajak harus berupa angka.");
      error.statusCode = 400;
      throw error;
    }

    const pekerjaanBaru = await PekerjaanBulananService.createPekerjaanBulanan({
      klienId,
      masa_pajak,
      tahun_pajak,
      jenisPekerjaanId,
    });
    res.status(201).json({
      message: "Pekerjaan Bulanan berhasil dibuat",
      data: pekerjaanBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getAllPekerjaanBulananController = async (req, res, next) => {
  try {
    // Ambil query params untuk filtering jika ada
    const { klienId, tahun_pajak, masa_pajak } = req.query;
    const filters = {};
    if (klienId) filters.klienId = klienId;
    if (tahun_pajak) filters.tahun_pajak = parseInt(tahun_pajak, 10); // Pastikan jadi angka
    if (masa_pajak) filters.masa_pajak = masa_pajak;

    const semuaPekerjaan = await PekerjaanBulananService.getAllPekerjaanBulanan(
      filters
    );
    res.status(200).json({
      message: "Berhasil mengambil semua data Pekerjaan Bulanan",
      data: semuaPekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getPekerjaanBulananByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pekerjaan = await PekerjaanBulananService.getPekerjaanBulananById(id);
    res.status(200).json({
      message: "Berhasil mengambil data Pekerjaan Bulanan",
      data: pekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const updatePekerjaanBulananController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    if (Object.keys(dataUpdate).length === 0) {
      const error = new Error("Tidak ada data yang dikirim untuk diperbarui.");
      error.statusCode = 400;
      throw error;
    }
    // Validasi tambahan jika diperlukan
    if (dataUpdate.tahun_pajak && typeof dataUpdate.tahun_pajak !== "number") {
      const error = new Error("Tahun pajak harus berupa angka.");
      error.statusCode = 400;
      throw error;
    }

    const pekerjaanTerupdate =
      await PekerjaanBulananService.updatePekerjaanBulananById(id, dataUpdate);
    res.status(200).json({
      message: "Pekerjaan Bulanan berhasil diperbarui",
      data: pekerjaanTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deletePekerjaanBulananController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pekerjaanDihapus =
      await PekerjaanBulananService.deletePekerjaanBulananById(id);
    res.status(200).json({
      message: "Pekerjaan Bulanan berhasil dihapus",
      data: pekerjaanDihapus,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

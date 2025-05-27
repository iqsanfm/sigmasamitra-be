// src/controllers/jenisPekerjaanBulanan.controller.js
import * as JenisPekerjaanBulananService from "../services/jenisPekerjaanBulanan.service.js";

export const createJenisPekerjaanBulananController = async (req, res, next) => {
  try {
    const { nama } = req.body;
    if (!nama || typeof nama !== "string" || nama.trim() === "") {
      const error = new Error(
        "Nama Jenis Pekerjaan Bulanan wajib diisi dan tidak boleh kosong."
      );
      error.statusCode = 400;
      throw error;
    }
    const jenisPekerjaanBaru =
      await JenisPekerjaanBulananService.createJenisPekerjaanBulanan({ nama });
    res.status(201).json({
      message: "Jenis Pekerjaan Bulanan berhasil dibuat",
      data: jenisPekerjaanBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getAllJenisPekerjaanBulananController = async (req, res, next) => {
  try {
    const semuaJenisPekerjaan =
      await JenisPekerjaanBulananService.getAllJenisPekerjaanBulanan();
    res.status(200).json({
      message: "Berhasil mengambil semua data Jenis Pekerjaan Bulanan",
      data: semuaJenisPekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getJenisPekerjaanBulananByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const jenisPekerjaan =
      await JenisPekerjaanBulananService.getJenisPekerjaanBulananById(id);
    res.status(200).json({
      message: "Berhasil mengambil data Jenis Pekerjaan Bulanan",
      data: jenisPekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const updateJenisPekerjaanBulananController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    if (!nama || typeof nama !== "string" || nama.trim() === "") {
      const error = new Error(
        "Nama Jenis Pekerjaan Bulanan wajib diisi dan tidak boleh kosong untuk pembaruan."
      );
      error.statusCode = 400;
      throw error;
    }
    const jenisPekerjaanTerupdate =
      await JenisPekerjaanBulananService.updateJenisPekerjaanBulananById(id, {
        nama,
      });
    res.status(200).json({
      message: "Jenis Pekerjaan Bulanan berhasil diperbarui",
      data: jenisPekerjaanTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteJenisPekerjaanBulananController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jenisPekerjaanDihapus =
      await JenisPekerjaanBulananService.deleteJenisPekerjaanBulananById(id);
    res.status(200).json({
      message: "Jenis Pekerjaan Bulanan berhasil dihapus",
      data: jenisPekerjaanDihapus, // Opsional, bisa juga res.status(204).send();
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

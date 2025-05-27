// src/controllers/jenisPekerjaanTahunan.controller.js
import * as JenisPekerjaanTahunanService from "../services/jenisPekerjaanTahunan.service.js";

export const createJenisPekerjaanTahunanController = async (req, res, next) => {
  try {
    const { nama } = req.body;
    if (!nama || typeof nama !== "string" || nama.trim() === "") {
      const error = new Error(
        "Nama Jenis Pekerjaan Tahunan wajib diisi dan tidak boleh kosong."
      );
      error.statusCode = 400;
      throw error;
    }
    const jenisPekerjaanBaru =
      await JenisPekerjaanTahunanService.createJenisPekerjaanTahunan({ nama });
    res.status(201).json({
      message: "Jenis Pekerjaan Tahunan berhasil dibuat",
      data: jenisPekerjaanBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getAllJenisPekerjaanTahunanController = async (req, res, next) => {
  try {
    const semuaJenisPekerjaan =
      await JenisPekerjaanTahunanService.getAllJenisPekerjaanTahunan();
    res.status(200).json({
      message: "Berhasil mengambil semua data Jenis Pekerjaan Tahunan",
      data: semuaJenisPekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getJenisPekerjaanTahunanByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const jenisPekerjaan =
      await JenisPekerjaanTahunanService.getJenisPekerjaanTahunanById(id);
    res.status(200).json({
      message: "Berhasil mengambil data Jenis Pekerjaan Tahunan",
      data: jenisPekerjaan,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const updateJenisPekerjaanTahunanController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    if (!nama || typeof nama !== "string" || nama.trim() === "") {
      const error = new Error(
        "Nama Jenis Pekerjaan Tahunan wajib diisi dan tidak boleh kosong untuk pembaruan."
      );
      error.statusCode = 400;
      throw error;
    }
    const jenisPekerjaanTerupdate =
      await JenisPekerjaanTahunanService.updateJenisPekerjaanTahunanById(id, {
        nama,
      });
    res.status(200).json({
      message: "Jenis Pekerjaan Tahunan berhasil diperbarui",
      data: jenisPekerjaanTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteJenisPekerjaanTahunanController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jenisPekerjaanDihapus =
      await JenisPekerjaanTahunanService.deleteJenisPekerjaanTahunanById(id);
    res.status(200).json({
      message: "Jenis Pekerjaan Tahunan berhasil dihapus",
      data: jenisPekerjaanDihapus,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// src/controllers/formSP2DK.controller.js
import * as FormSP2DKService from "../services/formSP2DK.service.js";

// Fungsi helper untuk konversi tanggal, bisa ditaruh di utils jika sering dipakai
const parseOptionalDate = (dateString) => {
  if (!dateString) return null; // atau undefined tergantung preferensi service
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date; // Kembalikan null jika tidak valid
};
const parseRequiredDate = (dateString) => {
  if (!dateString)
    throw Object.assign(new Error("Tanggal wajib diisi."), { statusCode: 400 });
  const date = new Date(dateString);
  if (isNaN(date.getTime()))
    throw Object.assign(new Error("Format tanggal tidak valid."), {
      statusCode: 400,
    });
  return date;
};

export const createFormSP2DKController = async (req, res, next) => {
  try {
    const dataForm = req.body;
    // Validasi input dasar
    if (
      !dataForm.klienId ||
      !dataForm.staffPjId ||
      !dataForm.no_sp2dk ||
      !dataForm.tgl_sp2dk
    ) {
      const error = new Error(
        "Field klienId, staffPjId, no_sp2dk, dan tgl_sp2dk wajib diisi."
      );
      error.statusCode = 400;
      throw error;
    }

    // Konversi string tanggal menjadi objek Date
    dataForm.tgl_sp2dk = parseRequiredDate(dataForm.tgl_sp2dk);
    dataForm.tgl_kontrak = parseOptionalDate(dataForm.tgl_kontrak);
    dataForm.tgl_sphp = parseOptionalDate(dataForm.tgl_sphp);
    dataForm.tgl_lhp = parseOptionalDate(dataForm.tgl_lhp);
    dataForm.tgl_bayar = parseOptionalDate(dataForm.tgl_bayar);
    dataForm.tgl_lapor = parseOptionalDate(dataForm.tgl_lapor);

    const formBaru = await FormSP2DKService.createFormSP2DK(dataForm);
    res.status(201).json({
      message: "Form SP2DK berhasil dibuat",
      data: formBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getAllFormSP2DKController = async (req, res, next) => {
  try {
    const filters = req.query;
    // Tambahan: konversi tahun_pajak jika ada di filter
    if (filters.tahun_pajak_awal)
      filters.tahun_pajak_awal = parseInt(filters.tahun_pajak_awal, 10);
    if (filters.tahun_pajak_akhir)
      filters.tahun_pajak_akhir = parseInt(filters.tahun_pajak_akhir, 10);

    const semuaForm = await FormSP2DKService.getAllFormSP2DK(filters);
    res.status(200).json({
      message: "Berhasil mengambil semua data Form SP2DK",
      data: semuaForm,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getFormSP2DKByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await FormSP2DKService.getFormSP2DKById(id);
    res.status(200).json({
      message: "Berhasil mengambil data Form SP2DK",
      data: form,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const updateFormSP2DKController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    if (Object.keys(dataUpdate).length === 0) {
      const error = new Error("Tidak ada data yang dikirim untuk diperbarui.");
      error.statusCode = 400;
      throw error;
    }

    // Konversi string tanggal menjadi objek Date jika ada di payload update
    if (dataUpdate.tgl_sp2dk)
      dataUpdate.tgl_sp2dk = parseRequiredDate(dataUpdate.tgl_sp2dk);
    if (dataUpdate.hasOwnProperty("tgl_kontrak"))
      dataUpdate.tgl_kontrak = parseOptionalDate(dataUpdate.tgl_kontrak);
    if (dataUpdate.hasOwnProperty("tgl_sphp"))
      dataUpdate.tgl_sphp = parseOptionalDate(dataUpdate.tgl_sphp);
    if (dataUpdate.hasOwnProperty("tgl_lhp"))
      dataUpdate.tgl_lhp = parseOptionalDate(dataUpdate.tgl_lhp);
    if (dataUpdate.hasOwnProperty("tgl_bayar"))
      dataUpdate.tgl_bayar = parseOptionalDate(dataUpdate.tgl_bayar);
    if (dataUpdate.hasOwnProperty("tgl_lapor"))
      dataUpdate.tgl_lapor = parseOptionalDate(dataUpdate.tgl_lapor);

    const formTerupdate = await FormSP2DKService.updateFormSP2DKById(
      id,
      dataUpdate
    );
    res.status(200).json({
      message: "Form SP2DK berhasil diperbarui",
      data: formTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteFormSP2DKController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const formDihapus = await FormSP2DKService.deleteFormSP2DKById(id);
    res.status(200).json({
      message: "Form SP2DK berhasil dihapus",
      data: formDihapus,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

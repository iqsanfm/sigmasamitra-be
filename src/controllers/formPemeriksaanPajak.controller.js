// src/controllers/formPemeriksaanPajak.controller.js
import * as FormPemeriksaanPajakService from "../services/formPemeriksaanPajak.service.js";

export const createFormPemeriksaanPajakController = async (req, res, next) => {
  try {
    const dataForm = req.body;
    // Validasi input dasar (bisa diperluas dengan Zod/Joi)
    if (
      !dataForm.klienId ||
      !dataForm.staffPjId ||
      !dataForm.no_sp2 ||
      !dataForm.tgl_sp2
    ) {
      const error = new Error(
        "Field klienId, staffPjId, no_sp2, dan tgl_sp2 wajib diisi."
      );
      error.statusCode = 400;
      throw error;
    }
    // Pastikan tgl_sp2 adalah format tanggal yang valid sebelum dikirim ke service
    dataForm.tgl_sp2 = new Date(dataForm.tgl_sp2);
    if (dataForm.tgl_kontrak)
      dataForm.tgl_kontrak = new Date(dataForm.tgl_kontrak);
    if (dataForm.tgl_sphp) dataForm.tgl_sphp = new Date(dataForm.tgl_sphp);
    if (dataForm.tgl_lhp) dataForm.tgl_lhp = new Date(dataForm.tgl_lhp);
    if (dataForm.tgl_bap_pemb)
      dataForm.tgl_bap_pemb = new Date(dataForm.tgl_bap_pemb);
    if (dataForm.tgl_bayar) dataForm.tgl_bayar = new Date(dataForm.tgl_bayar);
    if (dataForm.tgl_lapor) dataForm.tgl_lapor = new Date(dataForm.tgl_lapor);

    const formBaru =
      await FormPemeriksaanPajakService.createFormPemeriksaanPajak(dataForm);
    res.status(201).json({
      message: "Form Pemeriksaan Pajak berhasil dibuat",
      data: formBaru,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getAllFormPemeriksaanPajakController = async (req, res, next) => {
  try {
    const filters = req.query; // Ambil filter dari query params
    if (filters.status === "") delete filters.status; // Hapus filter status jika kosong
    // Konversi tipe data filter jika perlu (misal string ke int)
    const semuaForm =
      await FormPemeriksaanPajakService.getAllFormPemeriksaanPajak(filters);
    res.status(200).json({
      message: "Berhasil mengambil semua data Form Pemeriksaan Pajak",
      data: semuaForm,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const getFormPemeriksaanPajakByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await FormPemeriksaanPajakService.getFormPemeriksaanPajakById(
      id
    );
    res.status(200).json({
      message: "Berhasil mengambil data Form Pemeriksaan Pajak",
      data: form,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const updateFormPemeriksaanPajakController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    if (Object.keys(dataUpdate).length === 0) {
      const error = new Error("Tidak ada data yang dikirim untuk diperbarui.");
      error.statusCode = 400;
      throw error;
    }
    // Konversi tanggal jika ada di dataUpdate
    if (dataUpdate.tgl_sp2) dataUpdate.tgl_sp2 = new Date(dataUpdate.tgl_sp2);
    if (dataUpdate.tgl_kontrak)
      dataUpdate.tgl_kontrak = new Date(dataUpdate.tgl_kontrak);
    if (dataUpdate.tgl_sphp)
      dataUpdate.tgl_sphp = new Date(dataUpdate.tgl_sphp);
    if (dataUpdate.tgl_lhp) dataUpdate.tgl_lhp = new Date(dataUpdate.tgl_lhp);
    if (dataUpdate.tgl_bap_pemb)
      dataUpdate.tgl_bap_pemb = new Date(dataUpdate.tgl_bap_pemb);
    if (dataUpdate.tgl_bayar)
      dataUpdate.tgl_bayar = new Date(dataUpdate.tgl_bayar);
    if (dataUpdate.tgl_lapor)
      dataUpdate.tgl_lapor = new Date(dataUpdate.tgl_lapor);

    const formTerupdate =
      await FormPemeriksaanPajakService.updateFormPemeriksaanPajakById(
        id,
        dataUpdate
      );
    res.status(200).json({
      message: "Form Pemeriksaan Pajak berhasil diperbarui",
      data: formTerupdate,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

export const deleteFormPemeriksaanPajakController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const formDihapus =
      await FormPemeriksaanPajakService.deleteFormPemeriksaanPajakById(id);
    res.status(200).json({
      message: "Form Pemeriksaan Pajak berhasil dihapus",
      data: formDihapus,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// src/services/formSP2DK.service.js
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// --- Service untuk Membuat FormSP2DK Baru ---
export const createFormSP2DK = async (dataForm) => {
  const {
    klienId,
    staffPjId,
    staffAdHocId, // Opsional
    no_sp2dk, // Wajib dan unik
    tgl_sp2dk, // Wajib
    // Ambil field lain yang relevan dari dataForm secara eksplisit
    no_pengawasan_tugas,
    no_urut_klien_internal,
    no_kontrak,
    tgl_kontrak,
    no_sphp,
    tgl_sphp,
    no_lhp,
    tgl_lhp,
    tgl_bayar,
    tgl_lapor,
    status,
    catatan_sp2dk,
  } = dataForm;

  // 1. Validasi keberadaan Klien
  const klien = await prisma.klien.findUnique({ where: { id: klienId } });
  if (!klien) {
    const error = new Error(`Klien dengan ID '${klienId}' tidak ditemukan.`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Validasi keberadaan Staff PJ (PIC)
  const staffPj = await prisma.pengguna.findUnique({
    where: { id: staffPjId },
  });
  if (!staffPj) {
    const error = new Error(
      `Staff PJ (Pengguna) dengan ID '${staffPjId}' tidak ditemukan.`
    );
    error.statusCode = 404;
    throw error;
  }

  // 3. Validasi keberadaan Staff Ad Hoc (jika ada)
  if (staffAdHocId) {
    const staffAdHoc = await prisma.pengguna.findUnique({
      where: { id: staffAdHocId },
    });
    if (!staffAdHoc) {
      const error = new Error(
        `Staff Ad Hoc (Pengguna) dengan ID '${staffAdHocId}' tidak ditemukan.`
      );
      error.statusCode = 404;
      throw error;
    }
  }

  try {
    const dataToCreate = {
      klienId,
      staffPjId,
      no_sp2dk,
      tgl_sp2dk, // Controller akan memastikan ini objek Date
      // Tambahkan field opsional hanya jika ada nilainya
      ...(staffAdHocId && { staffAdHocId }),
      ...(no_pengawasan_tugas && { no_pengawasan_tugas }),
      ...(no_urut_klien_internal && { no_urut_klien_internal }),
      ...(no_kontrak && { no_kontrak }),
      ...(tgl_kontrak && { tgl_kontrak }), // Controller akan memastikan ini objek Date atau null
      ...(no_sphp && { no_sphp }),
      ...(tgl_sphp && { tgl_sphp }), // Controller akan memastikan ini objek Date atau null
      ...(no_lhp && { no_lhp }),
      ...(tgl_lhp && { tgl_lhp }), // Controller akan memastikan ini objek Date atau null
      ...(tgl_bayar && { tgl_bayar }), // Controller akan memastikan ini objek Date atau null
      ...(tgl_lapor && { tgl_lapor }), // Controller akan memastikan ini objek Date atau null
      ...(status && { status }),
      ...(catatan_sp2dk && { catatan_sp2dk }),
    };

    const formBaru = await prisma.formSP2DK.create({
      data: dataToCreate,
      include: {
        klien: { select: { id: true, kode_klien: true, nama_klien: true } },
        staffPj: { select: { id: true, nama_lengkap: true, email: true } },
        staffAdHoc: { select: { id: true, nama_lengkap: true, email: true } },
      },
    });
    return formBaru;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target || ["field unik"];
      const customError = new Error(
        `Data duplikat untuk ${target.join(", ")} pada Form SP2DK.`
      );
      customError.statusCode = 409;
      throw customError;
    }
    console.error("Error creating FormSP2DK:", error.message, error.stack);
    const serviceError = new Error(
      "Gagal membuat Form SP2DK baru di database."
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Mendapatkan Semua FormSP2DK ---
export const getAllFormSP2DK = async (filters = {}) => {
  try {
    const semuaForm = await prisma.formSP2DK.findMany({
      where: filters,
      include: {
        klien: { select: { id: true, kode_klien: true, nama_klien: true } },
        staffPj: { select: { id: true, nama_lengkap: true } },
        staffAdHoc: { select: { id: true, nama_lengkap: true } },
      },
      orderBy: { tgl_sp2dk: "desc" },
    });
    return semuaForm;
  } catch (error) {
    console.error("Error fetching all FormSP2DK:", error.message, error.stack);
    const serviceError = new Error(
      "Gagal mengambil daftar Form SP2DK dari database."
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Mendapatkan FormSP2DK Berdasarkan ID ---
export const getFormSP2DKById = async (id) => {
  try {
    const form = await prisma.formSP2DK.findUniqueOrThrow({
      where: { id },
      include: {
        klien: true,
        staffPj: true,
        staffAdHoc: true,
      },
    });
    return form;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      const notFoundError = new Error(
        `Form SP2DK dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(
      `Error fetching FormSP2DK by ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal mengambil Form SP2DK dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Memperbarui FormSP2DK ---
export const updateFormSP2DKById = async (id, dataUpdate) => {
  // Ambil semua field yang mungkin diupdate secara eksplisit
  const {
    klienId,
    staffPjId,
    staffAdHocId,
    no_sp2dk,
    tgl_sp2dk,
    no_pengawasan_tugas,
    no_urut_klien_internal,
    no_kontrak,
    tgl_kontrak,
    no_sphp,
    tgl_sphp,
    no_lhp,
    tgl_lhp,
    tgl_bayar,
    tgl_lapor,
    status,
    catatan_sp2dk,
  } = dataUpdate;

  try {
    await prisma.formSP2DK.findUniqueOrThrow({ where: { id } });

    if (klienId) {
      /* ... validasi Klien ... */
    }
    if (staffPjId) {
      /* ... validasi Staff PJ ... */
    }
    if (staffAdHocId !== undefined) {
      /* ... validasi Staff Ad Hoc (handle null) ... */
    }

    const dataToUpdate = {};
    // Hanya tambahkan field ke dataToUpdate jika ada nilainya di dataUpdate
    // (Untuk field opsional, gunakan hasOwnProperty untuk bisa mengirim null secara eksplisit)
    if (klienId !== undefined) dataToUpdate.klienId = klienId;
    if (staffPjId !== undefined) dataToUpdate.staffPjId = staffPjId;
    if (dataUpdate.hasOwnProperty("staffAdHocId"))
      dataToUpdate.staffAdHocId = staffAdHocId;
    if (dataUpdate.hasOwnProperty("no_pengawasan_tugas"))
      dataToUpdate.no_pengawasan_tugas = no_pengawasan_tugas;
    if (dataUpdate.hasOwnProperty("no_urut_klien_internal"))
      dataToUpdate.no_urut_klien_internal = no_urut_klien_internal;
    if (dataUpdate.hasOwnProperty("no_kontrak"))
      dataToUpdate.no_kontrak = no_kontrak;
    if (dataUpdate.hasOwnProperty("tgl_kontrak"))
      dataToUpdate.tgl_kontrak = tgl_kontrak; // Controller pastikan Date/null
    if (no_sp2dk !== undefined) dataToUpdate.no_sp2dk = no_sp2dk;
    if (tgl_sp2dk !== undefined) dataToUpdate.tgl_sp2dk = tgl_sp2dk; // Controller pastikan Date
    if (dataUpdate.hasOwnProperty("no_sphp")) dataToUpdate.no_sphp = no_sphp;
    if (dataUpdate.hasOwnProperty("tgl_sphp")) dataToUpdate.tgl_sphp = tgl_sphp; // Controller pastikan Date/null
    if (dataUpdate.hasOwnProperty("no_lhp")) dataToUpdate.no_lhp = no_lhp;
    if (dataUpdate.hasOwnProperty("tgl_lhp")) dataToUpdate.tgl_lhp = tgl_lhp; // Controller pastikan Date/null
    if (dataUpdate.hasOwnProperty("tgl_bayar"))
      dataToUpdate.tgl_bayar = tgl_bayar; // Controller pastikan Date/null
    if (dataUpdate.hasOwnProperty("tgl_lapor"))
      dataToUpdate.tgl_lapor = tgl_lapor; // Controller pastikan Date/null
    if (status !== undefined) dataToUpdate.status = status;
    if (dataUpdate.hasOwnProperty("catatan_sp2dk"))
      dataToUpdate.catatan_sp2dk = catatan_sp2dk;

    const formTerupdate = await prisma.formSP2DK.update({
      where: { id },
      data: dataToUpdate,
      include: { klien: true, staffPj: true, staffAdHoc: true },
    });
    return formTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        /* ... error not found ... */
      }
      if (error.code === "P2002") {
        /* ... error unique constraint ... */
      }
    }
    console.error(
      `Error updating FormSP2DK with ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal memperbarui Form SP2DK dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Menghapus FormSP2DK ---
export const deleteFormSP2DKById = async (id) => {
  try {
    const formDihapus = await prisma.formSP2DK.findUniqueOrThrow({
      where: { id },
    });
    await prisma.formSP2DK.delete({ where: { id } });
    return formDihapus;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      /* ... error not found ... */
    }
    // Handle P2003 (foreign key constraint) jika ada relasi lain yang menghalangi penghapusan
    console.error(
      `Error deleting FormSP2DK with ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal menghapus Form SP2DK dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

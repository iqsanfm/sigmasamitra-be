// src/services/formPemeriksaanPajak.service.js
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// --- Service untuk Membuat Form Pemeriksaan Pajak Baru ---
export const createFormPemeriksaanPajak = async (dataForm) => {
  // Ambil semua field yang relevan dari dataForm secara eksplisit
  const {
    klienId,
    staffPjId,
    staffAdHocId,
    no_pengawasan_tugas,
    no_urut_klien_internal,
    no_kontrak,
    tgl_kontrak, // Controller harus memastikan ini objek Date atau null
    no_sp2, // Wajib dan unik di skema
    tgl_sp2, // Wajib dan controller harus memastikan ini objek Date
    no_sphp,
    tgl_sphp, // Controller harus memastikan ini objek Date atau null
    no_lhp,
    tgl_lhp, // Controller harus memastikan ini objek Date atau null (INI YANG BENAR, BUKAN tgl_lapor)
    status,
    catatan,
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
    // Bangun objek dataToCreate secara eksplisit dengan field yang valid
    const dataToCreate = {
      klienId,
      staffPjId,
      no_sp2,
      tgl_sp2, // Pastikan ini sudah jadi objek Date dari controller
      // Tambahkan field opsional hanya jika ada nilainya (undefined akan diabaikan Prisma)
      ...(staffAdHocId && { staffAdHocId }), // Kirim jika ada, atau biarkan undefined
      ...(no_pengawasan_tugas && { no_pengawasan_tugas }),
      ...(no_urut_klien_internal && { no_urut_klien_internal }),
      ...(no_kontrak && { no_kontrak }),
      ...(tgl_kontrak && { tgl_kontrak }), // Pastikan ini sudah jadi objek Date dari controller atau null
      ...(no_sphp && { no_sphp }),
      ...(tgl_sphp && { tgl_sphp }), // Pastikan ini sudah jadi objek Date dari controller atau null
      ...(no_lhp && { no_lhp }),
      ...(tgl_lhp && { tgl_lhp }), // Pastikan ini sudah jadi objek Date dari controller atau null
      ...(status && { status }),
      ...(catatan && { catatan }),
    };

    const formBaru = await prisma.formPemeriksaanPajak.create({
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
        `Data duplikat untuk ${target.join(", ")}.`
      );
      customError.statusCode = 409;
      throw customError;
    }
    console.error(
      "Error creating Form Pemeriksaan Pajak:",
      error.message,
      error.stack
    );
    const serviceError = new Error(
      "Gagal membuat Form Pemeriksaan Pajak baru di database."
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Memperbarui Form Pemeriksaan Pajak ---
export const updateFormPemeriksaanPajakById = async (id, dataUpdate) => {
  // Ambil semua field yang mungkin diupdate secara eksplisit
  const {
    klienId,
    staffPjId,
    staffAdHocId, // undefined jika tidak diupdate, null jika sengaja di-null-kan
    no_pengawasan_tugas,
    no_urut_klien_internal,
    no_kontrak,
    tgl_kontrak, // Controller harus memastikan ini objek Date atau null
    no_sp2,
    tgl_sp2, // Controller harus memastikan ini objek Date
    no_sphp,
    tgl_sphp, // Controller harus memastikan ini objek Date atau null
    no_lhp,
    tgl_lhp, // Controller harus memastikan ini objek Date atau null (INI YANG BENAR, BUKAN tgl_lapor)
    status,
    catatan,
  } = dataUpdate;

  try {
    // 1. Pastikan form yang akan diupdate ada
    await prisma.formPemeriksaanPajak.findUniqueOrThrow({ where: { id } });

    // 2. Validasi relasi jika diubah
    if (klienId) {
      const klien = await prisma.klien.findUnique({ where: { id: klienId } });
      if (!klien)
        throw Object.assign(
          new Error(`Klien dengan ID '${klienId}' tidak ditemukan.`),
          { statusCode: 404 }
        );
    }
    if (staffPjId) {
      const staffPj = await prisma.pengguna.findUnique({
        where: { id: staffPjId },
      });
      if (!staffPj)
        throw Object.assign(
          new Error(`Staff PJ dengan ID '${staffPjId}' tidak ditemukan.`),
          { statusCode: 404 }
        );
    }
    if (staffAdHocId !== undefined) {
      // Cek jika field staffAdHocId ada di payload
      if (staffAdHocId === null) {
        // Memang ingin di-set null
      } else {
        const staffAdHoc = await prisma.pengguna.findUnique({
          where: { id: staffAdHocId },
        });
        if (!staffAdHoc)
          throw Object.assign(
            new Error(
              `Staff Ad Hoc dengan ID '${staffAdHocId}' tidak ditemukan.`
            ),
            { statusCode: 404 }
          );
      }
    }

    // Bangun objek dataToUpdate secara eksplisit
    const dataToUpdate = {};
    if (klienId !== undefined) dataToUpdate.klienId = klienId;
    if (staffPjId !== undefined) dataToUpdate.staffPjId = staffPjId;
    // Untuk field opsional yang bisa di-null-kan:
    if (dataUpdate.hasOwnProperty("staffAdHocId"))
      dataToUpdate.staffAdHocId = staffAdHocId; // Bisa null
    if (dataUpdate.hasOwnProperty("no_pengawasan_tugas"))
      dataToUpdate.no_pengawasan_tugas = no_pengawasan_tugas;
    if (dataUpdate.hasOwnProperty("no_urut_klien_internal"))
      dataToUpdate.no_urut_klien_internal = no_urut_klien_internal;
    if (dataUpdate.hasOwnProperty("no_kontrak"))
      dataToUpdate.no_kontrak = no_kontrak;
    if (dataUpdate.hasOwnProperty("tgl_kontrak"))
      dataToUpdate.tgl_kontrak = tgl_kontrak; // Sudah Date atau null dari controller
    if (no_sp2 !== undefined) dataToUpdate.no_sp2 = no_sp2;
    if (tgl_sp2 !== undefined) dataToUpdate.tgl_sp2 = tgl_sp2; // Sudah Date dari controller
    if (dataUpdate.hasOwnProperty("no_sphp")) dataToUpdate.no_sphp = no_sphp;
    if (dataUpdate.hasOwnProperty("tgl_sphp")) dataToUpdate.tgl_sphp = tgl_sphp; // Sudah Date atau null dari controller
    if (dataUpdate.hasOwnProperty("no_lhp")) dataToUpdate.no_lhp = no_lhp;
    if (dataUpdate.hasOwnProperty("tgl_lhp")) dataToUpdate.tgl_lhp = tgl_lhp; // Sudah Date atau null dari controller
    if (status !== undefined) dataToUpdate.status = status;
    if (dataUpdate.hasOwnProperty("catatan")) dataToUpdate.catatan = catatan;

    const formTerupdate = await prisma.formPemeriksaanPajak.update({
      where: { id },
      data: dataToUpdate,
      include: {
        klien: true,
        staffPj: true,
        staffAdHoc: true,
      },
    });
    return formTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new Error(
          `Form Pemeriksaan Pajak dengan ID '${id}' tidak ditemukan untuk diperbarui.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.code === "P2002") {
        const target = error.meta?.target || ["field unik"];
        const customError = new Error(
          `Data duplikat untuk ${target.join(", ")} saat update.`
        );
        customError.statusCode = 409;
        throw customError;
      }
    }
    console.error(
      `Error updating Form Pemeriksaan Pajak with ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal memperbarui Form Pemeriksaan Pajak dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Mendapatkan Semua Form Pemeriksaan Pajak (Kode Anda sudah OK) ---
export const getAllFormPemeriksaanPajak = async (filters = {}) => {
  // ... (Kode Anda dari sebelumnya) ...
  try {
    const semuaForm = await prisma.formPemeriksaanPajak.findMany({
      where: filters,
      include: {
        klien: { select: { id: true, kode_klien: true, nama_klien: true } },
        staffPj: { select: { id: true, nama_lengkap: true } },
        staffAdHoc: { select: { id: true, nama_lengkap: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return semuaForm;
  } catch (error) {
    console.error(
      "Error fetching all Form Pemeriksaan Pajak:",
      error.message,
      error.stack
    );
    const serviceError = new Error(
      "Gagal mengambil daftar Form Pemeriksaan Pajak dari database."
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Mendapatkan Form Pemeriksaan Pajak Berdasarkan ID (Kode Anda sudah OK) ---
export const getFormPemeriksaanPajakById = async (id) => {
  // ... (Kode Anda dari sebelumnya) ...
  try {
    const form = await prisma.formPemeriksaanPajak.findUniqueOrThrow({
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
        `Form Pemeriksaan Pajak dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(
      `Error fetching Form Pemeriksaan Pajak by ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal mengambil Form Pemeriksaan Pajak dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// --- Service untuk Menghapus Form Pemeriksaan Pajak (Kode Anda sudah OK) ---
export const deleteFormPemeriksaanPajakById = async (id) => {
  // ... (Kode Anda dari sebelumnya) ...
  try {
    const formDihapus = await prisma.formPemeriksaanPajak.findUniqueOrThrow({
      where: { id },
    });
    await prisma.formPemeriksaanPajak.delete({
      where: { id },
    });
    return formDihapus;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      const notFoundError = new Error(
        `Form Pemeriksaan Pajak dengan ID '${id}' tidak ditemukan untuk dihapus.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(
      `Error deleting Form Pemeriksaan Pajak with ID ${id}:`,
      error.message,
      error.stack
    );
    const serviceError = new Error(
      `Gagal menghapus Form Pemeriksaan Pajak dengan ID '${id}'.`
    );
    serviceError.cause = error;
    throw serviceError;
  }
};

// src/services/pekerjaanBulanan.service.js
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// --- Service untuk Membuat Pekerjaan Bulanan Baru ---
export const createPekerjaanBulanan = async (dataPekerjaan) => {
  const { klienId, masa_pajak, tahun_pajak, jenisPekerjaanId } = dataPekerjaan;

  // 1. Validasi keberadaan Klien
  const klien = await prisma.klien.findUnique({ where: { id: klienId } });
  if (!klien) {
    const error = new Error(`Klien dengan ID '${klienId}' tidak ditemukan.`);
    error.statusCode = 404;
    throw error;
  }

  // 2. Validasi keberadaan Jenis Pekerjaan Bulanan
  const jenisPekerjaan = await prisma.jenisPekerjaanBulanan.findUnique({
    where: { id: jenisPekerjaanId },
  });
  if (!jenisPekerjaan) {
    const error = new Error(
      `Jenis Pekerjaan Bulanan dengan ID '${jenisPekerjaanId}' tidak ditemukan.`
    );
    error.statusCode = 404;
    throw error;
  }

  try {
    const pekerjaanBaru = await prisma.pekerjaanBulanan.create({
      data: {
        klienId,
        masa_pajak,
        tahun_pajak,
        jenisPekerjaanId,
      },
      include: {
        // Sertakan data relasi saat membuat
        klien: true,
        jenisPekerjaan: true,
      },
    });
    return pekerjaanBaru;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Unique constraint violation (klienId, masa_pajak, tahun_pajak, jenisPekerjaanId)
      const customError = new Error(
        `Pekerjaan bulanan untuk klien '${klien.nama_klien}', masa '${masa_pajak}/${tahun_pajak}', dengan jenis '${jenisPekerjaan.nama}' sudah ada.`
      );
      customError.statusCode = 409; // Conflict
      throw customError;
    }
    console.error("Error creating Pekerjaan Bulanan:", error);
    throw new Error("Gagal membuat Pekerjaan Bulanan baru di database.");
  }
};

// --- Service untuk Mendapatkan Semua Pekerjaan Bulanan ---
// Tambahkan filter jika perlu, misalnya berdasarkan klienId atau tahun_pajak
export const getAllPekerjaanBulanan = async (filters = {}) => {
  // Contoh filter: filters = { klienId: '...', tahun_pajak: 2023 }
  try {
    const semuaPekerjaan = await prisma.pekerjaanBulanan.findMany({
      where: filters,
      include: {
        klien: { select: { id: true, kode_klien: true, nama_klien: true } }, // Pilih field tertentu dari klien
        jenisPekerjaan: { select: { id: true, nama: true } }, // Pilih field tertentu dari jenis pekerjaan
      },
      orderBy: [
        // Contoh pengurutan
        { tahun_pajak: "desc" },
        { masa_pajak: "desc" },
        { klien: { nama_klien: "asc" } },
      ],
    });
    return semuaPekerjaan;
  } catch (error) {
    console.error("Error fetching all Pekerjaan Bulanan:", error);
    throw new Error("Gagal mengambil daftar Pekerjaan Bulanan dari database.");
  }
};

// --- Service untuk Mendapatkan Pekerjaan Bulanan Berdasarkan ID ---
export const getPekerjaanBulananById = async (id) => {
  try {
    const pekerjaan = await prisma.pekerjaanBulanan.findUniqueOrThrow({
      where: { id },
      include: {
        klien: true,
        jenisPekerjaan: true,
        forms: true, // Sertakan juga form terkait jika sudah ada relasinya
      },
    });
    return pekerjaan;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      const notFoundError = new Error(
        `Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(`Error fetching Pekerjaan Bulanan by ID ${id}:`, error);
    throw new Error(`Gagal mengambil Pekerjaan Bulanan dengan ID '${id}'.`);
  }
};

// --- Service untuk Memperbarui Pekerjaan Bulanan ---
export const updatePekerjaanBulananById = async (id, dataUpdate) => {
  const { klienId, masa_pajak, tahun_pajak, jenisPekerjaanId } = dataUpdate;

  try {
    // 1. Pastikan Pekerjaan Bulanan yang akan diupdate ada
    const currentPekerjaan = await prisma.pekerjaanBulanan.findUniqueOrThrow({
      where: { id },
    });

    // 2. Validasi keberadaan Klien jika diubah
    let klienNamaForError = currentPekerjaan.klien?.nama_klien || klienId;
    if (klienId && klienId !== currentPekerjaan.klienId) {
      const klien = await prisma.klien.findUnique({ where: { id: klienId } });
      if (!klien) {
        const error = new Error(
          `Klien dengan ID '${klienId}' tidak ditemukan.`
        );
        error.statusCode = 404;
        throw error;
      }
      klienNamaForError = klien.nama_klien;
    }

    // 3. Validasi keberadaan Jenis Pekerjaan Bulanan jika diubah
    let jenisPekerjaanNamaForError =
      currentPekerjaan.jenisPekerjaan?.nama || jenisPekerjaanId;
    if (
      jenisPekerjaanId &&
      jenisPekerjaanId !== currentPekerjaan.jenisPekerjaanId
    ) {
      const jenisPekerjaan = await prisma.jenisPekerjaanBulanan.findUnique({
        where: { id: jenisPekerjaanId },
      });
      if (!jenisPekerjaan) {
        const error = new Error(
          `Jenis Pekerjaan Bulanan dengan ID '${jenisPekerjaanId}' tidak ditemukan.`
        );
        error.statusCode = 404;
        throw error;
      }
      jenisPekerjaanNamaForError = jenisPekerjaan.nama;
    }

    const pekerjaanTerupdate = await prisma.pekerjaanBulanan.update({
      where: { id },
      data: {
        klienId,
        masa_pajak,
        tahun_pajak,
        jenisPekerjaanId,
      },
      include: {
        klien: true,
        jenisPekerjaan: true,
      },
    });
    return pekerjaanTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to update not found
        const notFoundError = new Error(
          `Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan untuk diperbarui.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.code === "P2002") {
        // Unique constraint violation
        const customError = new Error(
          `Pekerjaan bulanan untuk klien, masa, tahun, dan jenis pekerjaan tersebut sudah ada.`
        );
        customError.statusCode = 409;
        throw customError;
      }
    }
    console.error(`Error updating Pekerjaan Bulanan with ID ${id}:`, error);
    throw new Error(`Gagal memperbarui Pekerjaan Bulanan dengan ID '${id}'.`);
  }
};

// --- Service untuk Menghapus Pekerjaan Bulanan ---
export const deletePekerjaanBulananById = async (id) => {
  try {
    // Pastikan record ada sebelum dihapus
    const pekerjaanDihapus = await prisma.pekerjaanBulanan.findUniqueOrThrow({
      where: { id },
      include: {
        // Sertakan data relasi jika perlu dikembalikan
        klien: { select: { nama_klien: true } },
        jenisPekerjaan: { select: { nama: true } },
      },
    });

    // Hapus dulu semua FormPekerjaanBulanan yang terkait (jika ada dan tidak di-cascade delete oleh DB)
    // Ini PENTING jika ada foreign key constraint dari FormPekerjaanBulanan ke PekerjaanBulanan
    // dan onDelete tidak di-set ke Cascade pada skema Prisma untuk relasi FormPekerjaanBulanan.
    // await prisma.formPekerjaanBulanan.deleteMany({
    //   where: { pekerjaanBulananId: id },
    // });

    await prisma.pekerjaanBulanan.delete({
      where: { id },
    });
    return pekerjaanDihapus;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new Error(
          `Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan untuk dihapus.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      // P2003: Foreign key constraint failed. Misalnya jika ada FormPekerjaanBulanan yang masih berelasi
      // dan onDelete di skema Prisma tidak di-set ke Cascade.
      if (error.code === "P2003") {
        const constraintError = new Error(
          `Pekerjaan Bulanan ini tidak bisa dihapus karena masih memiliki data form terkait.`
        );
        constraintError.statusCode = 409; // Conflict
        throw constraintError;
      }
    }
    console.error(`Error deleting Pekerjaan Bulanan with ID ${id}:`, error);
    throw new Error(`Gagal menghapus Pekerjaan Bulanan dengan ID '${id}'.`);
  }
};

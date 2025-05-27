// src/services/klien.service.js
import { PrismaClient, Prisma } from "@prisma/client"; // Impor Prisma dan tipe error jika perlu

const prisma = new PrismaClient();

// --- Service untuk Membuat Klien Baru ---
export const createKlien = async (dataKlien) => {
  const { kode_klien, nama_klien, npwp, alamat } = dataKlien;

  // Cek apakah kode_klien sudah ada (karena unik)
  const existingKlienByKode = await prisma.klien.findUnique({
    where: { kode_klien },
  });
  if (existingKlienByKode) {
    const error = new Error(
      `Klien dengan kode_klien '${kode_klien}' sudah ada.`
    );
    error.statusCode = 409; // Conflict
    throw error;
  }

  // Cek apakah NPWP sudah ada (jika diisi dan unik)
  if (npwp) {
    const existingKlienByNpwp = await prisma.klien.findUnique({
      where: { npwp },
    });
    if (existingKlienByNpwp) {
      const error = new Error(`Klien dengan NPWP '${npwp}' sudah ada.`);
      error.statusCode = 409; // Conflict
      throw error;
    }
  }

  try {
    const klienBaru = await prisma.klien.create({
      data: {
        kode_klien,
        nama_klien,
        npwp,
        alamat,
      },
    });
    return klienBaru;
  } catch (error) {
    // Menangani error Prisma lainnya (misalnya validasi gagal dari sisi DB)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Contoh: jika ada unique constraint lain yang terlanggar
      if (error.code === "P2002") {
        // Kode error Prisma untuk unique constraint violation
        const target = error.meta?.target; // field yang menyebabkan error
        const customError = new Error(
          `Data duplikat untuk field: ${target.join(", ")}`
        );
        customError.statusCode = 409;
        throw customError;
      }
    }
    // Untuk error lain, biarkan controller yang menangani atau lempar error umum
    console.error("Error creating klien:", error);
    throw new Error("Gagal membuat klien baru di database.");
  }
};

// --- Service untuk Mendapatkan Semua Klien ---
export const getAllKlien = async () => {
  try {
    const semuaKlien = await prisma.klien.findMany({
      orderBy: {
        nama_klien: "asc", // Contoh: urutkan berdasarkan nama klien
      },
    });
    return semuaKlien;
  } catch (error) {
    console.error("Error fetching all klien:", error);
    throw new Error("Gagal mengambil daftar klien dari database.");
  }
};

// --- Service untuk Mendapatkan Klien Berdasarkan ID (CUID Prisma) ---
export const getKlienById = async (id) => {
  try {
    const klien = await prisma.klien.findUniqueOrThrow({
      where: { id },
    });
    return klien;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Record to find not found
      const notFoundError = new Error(
        `Klien dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(`Error fetching klien by ID ${id}:`, error);
    throw new Error(`Gagal mengambil klien dengan ID '${id}'.`);
  }
};

// --- Service untuk Memperbarui Klien ---
export const updateKlienById = async (id, dataUpdate) => {
  const { kode_klien, nama_klien, npwp, alamat } = dataUpdate;

  try {
    // Pertama, pastikan klien yang akan diupdate ada
    await prisma.klien.findUniqueOrThrow({ where: { id } });

    // Cek duplikasi jika kode_klien atau npwp diubah
    if (kode_klien) {
      const existingKlienByKode = await prisma.klien.findFirst({
        where: { kode_klien, NOT: { id } }, // Cari kode_klien yang sama tapi ID berbeda
      });
      if (existingKlienByKode) {
        const error = new Error(
          `Kode klien '${kode_klien}' sudah digunakan oleh klien lain.`
        );
        error.statusCode = 409;
        throw error;
      }
    }
    if (npwp) {
      const existingKlienByNpwp = await prisma.klien.findFirst({
        where: { npwp, NOT: { id } }, // Cari NPWP yang sama tapi ID berbeda
      });
      if (existingKlienByNpwp) {
        const error = new Error(
          `NPWP '${npwp}' sudah digunakan oleh klien lain.`
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const klienTerupdate = await prisma.klien.update({
      where: { id },
      data: {
        kode_klien,
        nama_klien,
        npwp,
        alamat,
      },
    });
    return klienTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to update not found
        const notFoundError = new Error(
          `Klien dengan ID '${id}' tidak ditemukan untuk diperbarui.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.code === "P2002") {
        // Unique constraint violation
        const target = error.meta?.target;
        const customError = new Error(
          `Data duplikat untuk field: ${target.join(", ")} saat update.`
        );
        customError.statusCode = 409;
        throw customError;
      }
    }
    console.error(`Error updating klien with ID ${id}:`, error);
    throw new Error(`Gagal memperbarui klien dengan ID '${id}'.`);
  }
};

// --- Service untuk Menghapus Klien ---
export const deleteKlienById = async (id) => {
  try {
    // Pastikan klien ada sebelum dihapus (findUniqueOrThrow akan melempar error jika tidak ada)
    const klienDihapus = await prisma.klien.findUniqueOrThrow({
      where: { id },
    });

    await prisma.klien.delete({
      where: { id },
    });
    return klienDihapus; // Mengembalikan data klien yang berhasil dihapus
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Record to delete not found
      const notFoundError = new Error(
        `Klien dengan ID '${id}' tidak ditemukan untuk dihapus.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    // TODO: Handle P2003 (foreign key constraint) jika Klien berelasi dan tidak bisa dihapus
    // if (error.code === 'P2003') {
    //   const constraintError = new Error(`Klien tidak bisa dihapus karena masih memiliki data terkait (misalnya pekerjaan).`);
    //   constraintError.statusCode = 409; // Conflict
    //   throw constraintError;
    // }
    console.error(`Error deleting klien with ID ${id}:`, error);
    throw new Error(`Gagal menghapus klien dengan ID '${id}'.`);
  }
};

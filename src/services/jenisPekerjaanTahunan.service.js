// src/services/jenisPekerjaanTahunan.service.js
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// --- Service untuk Membuat Jenis Pekerjaan Tahunan Baru ---
export const createJenisPekerjaanTahunan = async (dataJenisPekerjaan) => {
  const { nama } = dataJenisPekerjaan;

  const existingJenis = await prisma.jenisPekerjaanTahunan.findUnique({
    where: { nama },
  });
  if (existingJenis) {
    const error = new Error(
      `Jenis Pekerjaan Tahunan dengan nama '${nama}' sudah ada.`
    );
    error.statusCode = 409; // Conflict
    throw error;
  }

  try {
    const jenisPekerjaanBaru = await prisma.jenisPekerjaanTahunan.create({
      data: { nama },
    });
    return jenisPekerjaanBaru;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = error.meta?.target;
      const customError = new Error(
        `Data duplikat untuk field: ${target.join(", ")}`
      );
      customError.statusCode = 409;
      throw customError;
    }
    console.error("Error creating Jenis Pekerjaan Tahunan:", error);
    throw new Error("Gagal membuat Jenis Pekerjaan Tahunan baru di database.");
  }
};

// --- Service untuk Mendapatkan Semua Jenis Pekerjaan Tahunan ---
export const getAllJenisPekerjaanTahunan = async () => {
  try {
    const semuaJenisPekerjaan = await prisma.jenisPekerjaanTahunan.findMany({
      orderBy: { nama: "asc" },
    });
    return semuaJenisPekerjaan;
  } catch (error) {
    console.error("Error fetching all Jenis Pekerjaan Tahunan:", error);
    throw new Error(
      "Gagal mengambil daftar Jenis Pekerjaan Tahunan dari database."
    );
  }
};

// --- Service untuk Mendapatkan Jenis Pekerjaan Tahunan Berdasarkan ID ---
export const getJenisPekerjaanTahunanById = async (id) => {
  try {
    const jenisPekerjaan = await prisma.jenisPekerjaanTahunan.findUniqueOrThrow(
      {
        where: { id },
      }
    );
    return jenisPekerjaan;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      const notFoundError = new Error(
        `Jenis Pekerjaan Tahunan dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(`Error fetching Jenis Pekerjaan Tahunan by ID ${id}:`, error);
    throw new Error(
      `Gagal mengambil Jenis Pekerjaan Tahunan dengan ID '${id}'.`
    );
  }
};

// --- Service untuk Memperbarui Jenis Pekerjaan Tahunan ---
export const updateJenisPekerjaanTahunanById = async (id, dataUpdate) => {
  const { nama } = dataUpdate;

  try {
    await prisma.jenisPekerjaanTahunan.findUniqueOrThrow({ where: { id } });

    if (nama) {
      const existingJenisDenganNamaBaru =
        await prisma.jenisPekerjaanTahunan.findFirst({
          where: { nama, NOT: { id } },
        });
      if (existingJenisDenganNamaBaru) {
        const error = new Error(
          `Nama Jenis Pekerjaan Tahunan '${nama}' sudah digunakan.`
        );
        error.statusCode = 409; // Conflict
        throw error;
      }
    }

    const jenisPekerjaanTerupdate = await prisma.jenisPekerjaanTahunan.update({
      where: { id },
      data: { nama },
    });
    return jenisPekerjaanTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new Error(
          `Jenis Pekerjaan Tahunan dengan ID '${id}' tidak ditemukan untuk diperbarui.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.code === "P2002") {
        const target = error.meta?.target;
        const customError = new Error(
          `Data duplikat untuk field: ${target.join(", ")} saat update.`
        );
        customError.statusCode = 409;
        throw customError;
      }
    }
    console.error(
      `Error updating Jenis Pekerjaan Tahunan with ID ${id}:`,
      error
    );
    throw new Error(
      `Gagal memperbarui Jenis Pekerjaan Tahunan dengan ID '${id}'.`
    );
  }
};

// --- Service untuk Menghapus Jenis Pekerjaan Tahunan ---
export const deleteJenisPekerjaanTahunanById = async (id) => {
  try {
    const jenisPekerjaanDihapus =
      await prisma.jenisPekerjaanTahunan.findUniqueOrThrow({ where: { id } });

    await prisma.jenisPekerjaanTahunan.delete({
      where: { id },
    });
    return jenisPekerjaanDihapus;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new Error(
          `Jenis Pekerjaan Tahunan dengan ID '${id}' tidak ditemukan untuk dihapus.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      if (error.code === "P2003") {
        const constraintError = new Error(
          `Jenis Pekerjaan Tahunan ini tidak bisa dihapus karena masih digunakan oleh data pekerjaan tahunan.`
        );
        constraintError.statusCode = 409; // Conflict
        throw constraintError;
      }
    }
    console.error(
      `Error deleting Jenis Pekerjaan Tahunan with ID ${id}:`,
      error
    );
    throw new Error(
      `Gagal menghapus Jenis Pekerjaan Tahunan dengan ID '${id}'.`
    );
  }
};

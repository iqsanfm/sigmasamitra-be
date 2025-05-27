// src/services/jenisPekerjaanBulanan.service.js
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// --- Service untuk Membuat Jenis Pekerjaan Bulanan Baru ---
export const createJenisPekerjaanBulanan = async (dataJenisPekerjaan) => {
  const { nama } = dataJenisPekerjaan;

  // Cek apakah nama sudah ada (karena unik)
  const existingJenis = await prisma.jenisPekerjaanBulanan.findUnique({
    where: { nama },
  });
  if (existingJenis) {
    const error = new Error(
      `Jenis Pekerjaan Bulanan dengan nama '${nama}' sudah ada.`
    );
    error.statusCode = 409; // Conflict
    throw error;
  }

  try {
    const jenisPekerjaanBaru = await prisma.jenisPekerjaanBulanan.create({
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
    console.error("Error creating Jenis Pekerjaan Bulanan:", error);
    throw new Error("Gagal membuat Jenis Pekerjaan Bulanan baru di database.");
  }
};

// --- Service untuk Mendapatkan Semua Jenis Pekerjaan Bulanan ---
export const getAllJenisPekerjaanBulanan = async () => {
  try {
    const semuaJenisPekerjaan = await prisma.jenisPekerjaanBulanan.findMany({
      orderBy: { nama: "asc" },
    });
    return semuaJenisPekerjaan;
  } catch (error) {
    console.error("Error fetching all Jenis Pekerjaan Bulanan:", error);
    throw new Error(
      "Gagal mengambil daftar Jenis Pekerjaan Bulanan dari database."
    );
  }
};

// --- Service untuk Mendapatkan Jenis Pekerjaan Bulanan Berdasarkan ID ---
export const getJenisPekerjaanBulananById = async (id) => {
  try {
    const jenisPekerjaan = await prisma.jenisPekerjaanBulanan.findUniqueOrThrow(
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
        `Jenis Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan.`
      );
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    console.error(`Error fetching Jenis Pekerjaan Bulanan by ID ${id}:`, error);
    throw new Error(
      `Gagal mengambil Jenis Pekerjaan Bulanan dengan ID '${id}'.`
    );
  }
};

// --- Service untuk Memperbarui Jenis Pekerjaan Bulanan ---
export const updateJenisPekerjaanBulananById = async (id, dataUpdate) => {
  const { nama } = dataUpdate;

  try {
    // Pastikan record yang akan diupdate ada
    await prisma.jenisPekerjaanBulanan.findUniqueOrThrow({ where: { id } });

    // Jika nama diubah, cek apakah nama baru sudah digunakan oleh record lain
    if (nama) {
      const existingJenisDenganNamaBaru =
        await prisma.jenisPekerjaanBulanan.findFirst({
          where: { nama, NOT: { id } },
        });
      if (existingJenisDenganNamaBaru) {
        const error = new Error(
          `Nama Jenis Pekerjaan Bulanan '${nama}' sudah digunakan.`
        );
        error.statusCode = 409; // Conflict
        throw error;
      }
    }

    const jenisPekerjaanTerupdate = await prisma.jenisPekerjaanBulanan.update({
      where: { id },
      data: { nama },
    });
    return jenisPekerjaanTerupdate;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const notFoundError = new Error(
          `Jenis Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan untuk diperbarui.`
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
      `Error updating Jenis Pekerjaan Bulanan with ID ${id}:`,
      error
    );
    throw new Error(
      `Gagal memperbarui Jenis Pekerjaan Bulanan dengan ID '${id}'.`
    );
  }
};

// --- Service untuk Menghapus Jenis Pekerjaan Bulanan ---
export const deleteJenisPekerjaanBulananById = async (id) => {
  try {
    // Pastikan record ada sebelum dihapus untuk memberikan data yang dihapus (opsional)
    const jenisPekerjaanDihapus =
      await prisma.jenisPekerjaanBulanan.findUniqueOrThrow({ where: { id } });

    await prisma.jenisPekerjaanBulanan.delete({
      where: { id },
    });
    return jenisPekerjaanDihapus; // Mengembalikan data yang berhasil dihapus
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record to delete not found
        const notFoundError = new Error(
          `Jenis Pekerjaan Bulanan dengan ID '${id}' tidak ditemukan untuk dihapus.`
        );
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      // P2003: Foreign key constraint failed on the field.
      // Artinya, ada record di tabel PekerjaanBulanan yang masih menggunakan JenisPekerjaanBulanan ini.
      if (error.code === "P2003") {
        const constraintError = new Error(
          `Jenis Pekerjaan Bulanan ini tidak bisa dihapus karena masih digunakan oleh data pekerjaan bulanan.`
        );
        constraintError.statusCode = 409; // Conflict
        throw constraintError;
      }
    }
    console.error(
      `Error deleting Jenis Pekerjaan Bulanan with ID ${id}:`,
      error
    );
    throw new Error(
      `Gagal menghapus Jenis Pekerjaan Bulanan dengan ID '${id}'.`
    );
  }
};

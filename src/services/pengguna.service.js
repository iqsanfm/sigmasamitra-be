// src/services/pengguna.service.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fungsi untuk menghapus password dari objek pengguna
const excludePassword = (pengguna) => {
  if (pengguna) {
    const { password, ...dataTanpaPassword } = pengguna;
    return dataTanpaPassword;
  }
  return null;
};

// --- Service untuk Membuat Pengguna Baru (Untuk Register) ---
export const createPengguna = async (dataPengguna) => {
  const { email, password, nama_lengkap, role, isActive } = dataPengguna;

  const existingPengguna = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (existingPengguna) {
    const error = new Error("Email sudah terdaftar");
    error.statusCode = 409; // Conflict
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const penggunaBaru = await prisma.pengguna.create({
    data: {
      email,
      password: hashedPassword,
      nama_lengkap,
      role: role || "STAFF", // Default ke STAFF jika tidak disediakan saat register
      isActive: isActive !== undefined ? isActive : true, // Default ke true
    },
  });

  return excludePassword(penggunaBaru);
};

// --- Service untuk Login Pengguna (BARU DITAMBAHKAN) ---
export const loginUser = async (email, passwordInput) => {
  const pengguna = await prisma.pengguna.findUnique({
    where: { email },
  });

  if (!pengguna) {
    const error = new Error("Email atau password salah."); // Pesan generik
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  if (!pengguna.isActive) {
    const error = new Error("Akun pengguna tidak aktif.");
    error.statusCode = 403; // Forbidden
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    passwordInput,
    pengguna.password
  );
  if (!isPasswordValid) {
    const error = new Error("Email atau password salah."); // Pesan generik
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  return excludePassword(pengguna); // Kembalikan data pengguna tanpa password
};

// --- Service untuk Mendapatkan Semua Pengguna ---
export const getAllPengguna = async () => {
  // ... (kode getAllPengguna dari sebelumnya) ...
  const semuaPengguna = await prisma.pengguna.findMany({});
  return semuaPengguna.map((p) => excludePassword(p));
};

// --- Service untuk Mendapatkan Pengguna Berdasarkan ID ---
export const getPenggunaById = async (id) => {
  // ... (kode getPenggunaById dari sebelumnya) ...
  const pengguna = await prisma.pengguna.findUnique({ where: { id } });
  if (!pengguna) {
    const error = new Error("Pengguna tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }
  return excludePassword(pengguna);
};

// --- Service untuk Memperbarui Pengguna ---
export const updatePengguna = async (id, dataUpdate) => {
  // ... (kode updatePengguna dari sebelumnya) ...
  const { email, password, ...dataLain } = dataUpdate;
  const penggunaAda = await prisma.pengguna.findUnique({ where: { id } });
  if (!penggunaAda) {
    const error = new Error("Pengguna tidak ditemukan untuk diperbarui");
    error.statusCode = 404;
    throw error;
  }
  if (email && email !== penggunaAda.email) {
    const emailSudahAda = await prisma.pengguna.findUnique({
      where: { email },
    });
    if (emailSudahAda) {
      const error = new Error("Email baru sudah digunakan oleh pengguna lain");
      error.statusCode = 409;
      throw error;
    }
  }
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const penggunaTerupdate = await prisma.pengguna.update({
    where: { id },
    data: {
      ...dataLain,
      ...(email && { email }),
      ...(hashedPassword && { password: hashedPassword }),
    },
  });
  return excludePassword(penggunaTerupdate);
};

// --- Service untuk Menghapus Pengguna ---
export const deletePenggunaById = async (id) => {
  // ... (kode deletePenggunaById dari sebelumnya) ...
  const penggunaAda = await prisma.pengguna.findUnique({ where: { id } });
  if (!penggunaAda) {
    const error = new Error("Pengguna tidak ditemukan untuk dihapus");
    error.statusCode = 404;
    throw error;
  }
  await prisma.pengguna.delete({ where: { id } });
  return excludePassword(penggunaAda);
};

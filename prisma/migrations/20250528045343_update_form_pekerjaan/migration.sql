/*
  Warnings:

  - Added the required column `updatedAt` to the `form_jenis_pekerjaan_bulanan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPekerjaan" AS ENUM ('BARU', 'DALAM_PROSES', 'REVIEW', 'PERLU_REVISI', 'SELESAI', 'DITUNDA', 'DIBATALKAN');

-- AlterTable
ALTER TABLE "form_jenis_pekerjaan_bulanan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "no_pengawasan_tugas" TEXT,
ADD COLUMN     "no_urut_klien" INTEGER,
ADD COLUMN     "status" "StatusPekerjaan" DEFAULT 'BARU',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

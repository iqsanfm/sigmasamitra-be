/*
  Warnings:

  - Added the required column `updatedAt` to the `form_pekerjaan_tahunan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "form_pekerjaan_tahunan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "no_pengawasan_tugas" TEXT,
ADD COLUMN     "no_urut_klien" INTEGER,
ADD COLUMN     "status" "StatusPekerjaan" DEFAULT 'BARU',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

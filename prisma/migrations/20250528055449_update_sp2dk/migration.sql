/*
  Warnings:

  - You are about to drop the `form_sp2dk` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "form_sp2dk" DROP CONSTRAINT "form_sp2dk_klienId_fkey";

-- DropForeignKey
ALTER TABLE "form_sp2dk" DROP CONSTRAINT "form_sp2dk_staffAdHocId_fkey";

-- DropForeignKey
ALTER TABLE "form_sp2dk" DROP CONSTRAINT "form_sp2dk_staffPjId_fkey";

-- DropTable
DROP TABLE "form_sp2dk";

-- CreateTable
CREATE TABLE "form_sp2dk_excel" (
    "id" TEXT NOT NULL,
    "no_pengawasan_tugas" TEXT,
    "no_urut_klien_internal" TEXT,
    "klienId" TEXT NOT NULL,
    "staffPjId" TEXT NOT NULL,
    "staffAdHocId" TEXT,
    "no_kontrak" TEXT,
    "tgl_kontrak" TIMESTAMP(3),
    "no_sp2dk" TEXT NOT NULL,
    "tgl_sp2dk" TIMESTAMP(3) NOT NULL,
    "no_sphp" TEXT,
    "tgl_sphp" TIMESTAMP(3),
    "no_lhp" TEXT,
    "tgl_lhp" TIMESTAMP(3),
    "tgl_bayar" TIMESTAMP(3),
    "tgl_lapor" TIMESTAMP(3),
    "status" "StatusPekerjaan" NOT NULL DEFAULT 'BARU',
    "catatan_sp2dk" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_sp2dk_excel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_sp2dk_excel_no_sp2dk_key" ON "form_sp2dk_excel"("no_sp2dk");

-- CreateIndex
CREATE UNIQUE INDEX "form_sp2dk_excel_no_sphp_key" ON "form_sp2dk_excel"("no_sphp");

-- CreateIndex
CREATE UNIQUE INDEX "form_sp2dk_excel_no_lhp_key" ON "form_sp2dk_excel"("no_lhp");

-- AddForeignKey
ALTER TABLE "form_sp2dk_excel" ADD CONSTRAINT "form_sp2dk_excel_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_sp2dk_excel" ADD CONSTRAINT "form_sp2dk_excel_staffPjId_fkey" FOREIGN KEY ("staffPjId") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_sp2dk_excel" ADD CONSTRAINT "form_sp2dk_excel_staffAdHocId_fkey" FOREIGN KEY ("staffAdHocId") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

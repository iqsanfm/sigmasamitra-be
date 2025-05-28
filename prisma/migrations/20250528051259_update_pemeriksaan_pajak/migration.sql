-- CreateTable
CREATE TABLE "form_pemeriksaan_pajak" (
    "id" TEXT NOT NULL,
    "no_pengawasan_tugas" TEXT,
    "no_urut_klien_internal" TEXT,
    "klienId" TEXT NOT NULL,
    "staffPjId" TEXT NOT NULL,
    "staffAdHocId" TEXT,
    "no_kontrak" TEXT,
    "tgl_kontrak" TIMESTAMP(3),
    "no_sp2" TEXT NOT NULL,
    "tgl_sp2" TIMESTAMP(3) NOT NULL,
    "no_sphp" TEXT,
    "tgl_sphp" TIMESTAMP(3),
    "no_lhp" TEXT,
    "tgl_lhp" TIMESTAMP(3),
    "status" "StatusPekerjaan" NOT NULL DEFAULT 'BARU',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_pemeriksaan_pajak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_pemeriksaan_pajak_no_sp2_key" ON "form_pemeriksaan_pajak"("no_sp2");

-- CreateIndex
CREATE UNIQUE INDEX "form_pemeriksaan_pajak_no_sphp_key" ON "form_pemeriksaan_pajak"("no_sphp");

-- CreateIndex
CREATE UNIQUE INDEX "form_pemeriksaan_pajak_no_lhp_key" ON "form_pemeriksaan_pajak"("no_lhp");

-- AddForeignKey
ALTER TABLE "form_pemeriksaan_pajak" ADD CONSTRAINT "form_pemeriksaan_pajak_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_pemeriksaan_pajak" ADD CONSTRAINT "form_pemeriksaan_pajak_staffPjId_fkey" FOREIGN KEY ("staffPjId") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_pemeriksaan_pajak" ADD CONSTRAINT "form_pemeriksaan_pajak_staffAdHocId_fkey" FOREIGN KEY ("staffAdHocId") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

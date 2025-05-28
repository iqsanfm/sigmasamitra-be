-- CreateTable
CREATE TABLE "form_sp2dk" (
    "id" TEXT NOT NULL,
    "no_pengawasan_tugas" TEXT NOT NULL,
    "no_urut_klien_internal" TEXT,
    "klienId" TEXT NOT NULL,
    "staffPjId" TEXT NOT NULL,
    "staffAdHocId" TEXT,
    "no_kontrak" TEXT,
    "tgl_kontrak" TIMESTAMP(3),
    "no_sp2dk" TEXT NOT NULL,
    "tgl_sp2dk" TIMESTAMP(3) NOT NULL,
    "no_bap_pemb" TEXT,
    "tgl_bap_pemb" TIMESTAMP(3),
    "tgl_bayar" TIMESTAMP(3),
    "tgl_lapor" TIMESTAMP(3),
    "status" "StatusPekerjaan" NOT NULL DEFAULT 'BARU',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_sp2dk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "nama_project" TEXT NOT NULL,
    "klienId" TEXT NOT NULL,
    "picId" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMP(3),
    "tanggal_target_selesai" TIMESTAMP(3),
    "tanggal_aktual_selesai" TIMESTAMP(3),
    "status_project" "StatusPekerjaan" NOT NULL DEFAULT 'BARU',
    "nilai_project" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_sp2dk_no_pengawasan_tugas_key" ON "form_sp2dk"("no_pengawasan_tugas");

-- CreateIndex
CREATE UNIQUE INDEX "form_sp2dk_no_sp2dk_key" ON "form_sp2dk"("no_sp2dk");

-- CreateIndex
CREATE UNIQUE INDEX "projects_nama_project_key" ON "projects"("nama_project");

-- AddForeignKey
ALTER TABLE "form_sp2dk" ADD CONSTRAINT "form_sp2dk_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_sp2dk" ADD CONSTRAINT "form_sp2dk_staffPjId_fkey" FOREIGN KEY ("staffPjId") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_sp2dk" ADD CONSTRAINT "form_sp2dk_staffAdHocId_fkey" FOREIGN KEY ("staffAdHocId") REFERENCES "pengguna"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_picId_fkey" FOREIGN KEY ("picId") REFERENCES "pengguna"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "klien" (
    "id" TEXT NOT NULL,
    "kode_klien" TEXT NOT NULL,
    "nama_klien" TEXT NOT NULL,
    "npwp" TEXT,
    "alamat" TEXT,

    CONSTRAINT "klien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pekerjaan_bulanan" (
    "id" TEXT NOT NULL,
    "masa_pajak" TEXT NOT NULL,
    "tahun_pajak" INTEGER NOT NULL,
    "klienId" TEXT NOT NULL,
    "jenisPekerjaanId" TEXT NOT NULL,

    CONSTRAINT "pekerjaan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pekerjaan_tahunan" (
    "id" TEXT NOT NULL,
    "tahun_pajak" INTEGER NOT NULL,
    "klienId" TEXT NOT NULL,
    "jenisPekerjaanTahunanId" TEXT NOT NULL,

    CONSTRAINT "pekerjaan_tahunan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_pekerjaan_bulanan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_pekerjaan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_pekerjaan_tahunan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_pekerjaan_tahunan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_jenis_pekerjaan_bulanan" (
    "id" TEXT NOT NULL,
    "kode_biling" TEXT,
    "tanggal_bayar" TIMESTAMP(3),
    "jumlah_bayar" DECIMAL(65,30),
    "tanggal_lapor" TIMESTAMP(3),
    "pekerjaanBulananId" TEXT NOT NULL,

    CONSTRAINT "form_jenis_pekerjaan_bulanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_pekerjaan_tahunan" (
    "id" TEXT NOT NULL,
    "kode_biling" TEXT,
    "tanggal_bayar" TIMESTAMP(3),
    "jumlah_bayar" DECIMAL(65,30),
    "tanggal_lapor" TIMESTAMP(3),
    "pekerjaanTahunanId" TEXT NOT NULL,

    CONSTRAINT "form_pekerjaan_tahunan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "klien_kode_klien_key" ON "klien"("kode_klien");

-- CreateIndex
CREATE UNIQUE INDEX "klien_npwp_key" ON "klien"("npwp");

-- CreateIndex
CREATE UNIQUE INDEX "pekerjaan_bulanan_klienId_masa_pajak_tahun_pajak_jenisPeker_key" ON "pekerjaan_bulanan"("klienId", "masa_pajak", "tahun_pajak", "jenisPekerjaanId");

-- CreateIndex
CREATE UNIQUE INDEX "pekerjaan_tahunan_klienId_tahun_pajak_jenisPekerjaanTahunan_key" ON "pekerjaan_tahunan"("klienId", "tahun_pajak", "jenisPekerjaanTahunanId");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_pekerjaan_bulanan_nama_key" ON "jenis_pekerjaan_bulanan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_pekerjaan_tahunan_nama_key" ON "jenis_pekerjaan_tahunan"("nama");

-- AddForeignKey
ALTER TABLE "pekerjaan_bulanan" ADD CONSTRAINT "pekerjaan_bulanan_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerjaan_bulanan" ADD CONSTRAINT "pekerjaan_bulanan_jenisPekerjaanId_fkey" FOREIGN KEY ("jenisPekerjaanId") REFERENCES "jenis_pekerjaan_bulanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerjaan_tahunan" ADD CONSTRAINT "pekerjaan_tahunan_klienId_fkey" FOREIGN KEY ("klienId") REFERENCES "klien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pekerjaan_tahunan" ADD CONSTRAINT "pekerjaan_tahunan_jenisPekerjaanTahunanId_fkey" FOREIGN KEY ("jenisPekerjaanTahunanId") REFERENCES "jenis_pekerjaan_tahunan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_jenis_pekerjaan_bulanan" ADD CONSTRAINT "form_jenis_pekerjaan_bulanan_pekerjaanBulananId_fkey" FOREIGN KEY ("pekerjaanBulananId") REFERENCES "pekerjaan_bulanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_pekerjaan_tahunan" ADD CONSTRAINT "form_pekerjaan_tahunan_pekerjaanTahunanId_fkey" FOREIGN KEY ("pekerjaanTahunanId") REFERENCES "pekerjaan_tahunan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

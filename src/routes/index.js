// src/routes/index.js
import { Router } from "express";
import authRoutes from "./auth.routes.js";
import penggunaRoutes from "./pengguna.routes.js";
import klienRoutes from "./klien.routes.js";
import jenisPekerjaanBulananRoutes from "./jenisPekerjaanBulanan.routes.js";
import jenisPekerjaanTahunanRoutes from "./jenisPekerjaanTahunan.routes.js";
import pekerjaanBulananRoutes from "./pekerjaanBulanan.routes.js";
import formPemeriksaanPajakRoutes from "./formPemeriksaanPajak.routes.js";
import formSP2DKRoutes from "./formSP2DK.routes.js";
// import pekerjaanTahunanRoutes from './pekerjaanTahunan.routes.js';

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Selamat datang di API SigmaSamitra Backend!",
    documentation_hint:
      "Dokumentasi API mungkin tersedia di /docs atau path serupa.",
  });
});

router.use("/auth", authRoutes);
router.use("/pengguna", penggunaRoutes);
router.use("/klien", klienRoutes);
router.use("/jenis-pekerjaan-bulanan", jenisPekerjaanBulananRoutes);
router.use("/jenis-pekerjaan-tahunan", jenisPekerjaanTahunanRoutes);
router.use("/pekerjaan-bulanan", pekerjaanBulananRoutes);
router.use("/form-pemeriksaan-pajak", formPemeriksaanPajakRoutes);
router.use("/form-sp2dk", formSP2DKRoutes);

// router.use('/pekerjaan-tahunan', pekerjaanTahunanRoutes);

export default router;

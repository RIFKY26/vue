// src/routes/laporanRoutes.js
import {
  getLaporan,
  createLaporan,
  updateLaporan,
  deleteLaporan,
} from "../controllers/laporanController.js";

async function laporanRoutes(fastify, options) {
  // GET semua laporan
  fastify.get("/lapor", getLaporan);

  // POST laporan baru
  fastify.post("/lapor", createLaporan);

  // PUT update laporan (jika fitur edit diaktifkan)
  fastify.put("/lapor/:id", updateLaporan);

  // DELETE hapus laporan
  fastify.delete("/lapor/:id", deleteLaporan);
}

export default laporanRoutes;

import {
  getLaporan,
  createLaporan,
  updateLaporan,
  deleteLaporan,
} from "../controllers/laporanController.js";

async function laporanRoutes(fastify, options) {
  // GET
  fastify.get("/lapor", getLaporan);

  // POST (Multipart ditangani di controller karena setting global attachFieldsToBody: true)
  fastify.post("/lapor", createLaporan);

  // PUT
  fastify.put("/lapor/:id", updateLaporan);

  // DELETE
  fastify.delete("/lapor/:id", deleteLaporan);
}

export default laporanRoutes;

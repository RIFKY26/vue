import adopsiController from "../controllers/adopsiController.js";

async function adopsiRoutes(fastify, options) {
  // GET semua adopsi
  fastify.get("/adopsi", adopsiController.getAllAdopsi);

  // GET detail adopsi berdasarkan ID
  fastify.get("/adopsi/:id", adopsiController.getAdopsiById);

  // Buat permohonan adopsi baru
  fastify.post("/adopsi", adopsiController.createAdopsi);

  // Update status adopsi (optional)
  fastify.put("/adopsi/:id", adopsiController.updateAdopsiStatus);

  // Hapus adopsi
  fastify.delete("/adopsi/:id", adopsiController.deleteAdopsi);
}

export default adopsiRoutes;

import { getAllKucing } from "../controllers/kucingController.js";

export default async function kucingRoutes(fastify, opts) {
  fastify.get("/kucing", getAllKucing);
}

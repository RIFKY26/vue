import { getPeringkat } from "../controllers/peringkatController.js";

export default async function peringkatRoutes(fastify, opts) {

  fastify.get("/peringkat", async () => {
    const rows = await getPeringkat(fastify);
    return rows;
  });

}

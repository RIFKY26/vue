import shelterController from "../controllers/shelterController.js";

async function shelterRoutes(fastify, options) {
  fastify.get("/shelters", shelterController.getAllShelters);
  fastify.post("/shelters", shelterController.createShelter);
}

export default shelterRoutes;

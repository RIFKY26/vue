import {
  getListKucing,
  getKucingReminders,
  getKucingAktivitas
} from "../controllers/rawatKucingController.js";

export default async function rawatKucingRoutes(fastify, options) {

  // GET list kucing sesuai user login
fastify.get("/rawat/kucing", async (req) => {
  const idUser = req.query.id_user || 1;
  return await getListKucing(fastify, idUser);
});


  // GET reminders per kucing
  fastify.get("/rawat/kucing/:id/reminders", async (req) => {
    return await getKucingReminders(fastify, req.params.id);
  });

  // GET aktivitas per kucing
  fastify.get("/rawat/kucing/:id/aktivitas", async (req) => {
    return await getKucingAktivitas(fastify, req.params.id);
  });

}

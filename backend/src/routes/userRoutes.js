import {
  getUserProfile,
  getPoinHistory,
  updateUserProfile
} from "../controllers/userController.js";


export default async function userRoutes(fastify, opts) {
  console.log("userRoutes LOADED!");

  // GET profil user
  fastify.get("/users/:id", async (req, reply) => {
    const data = await getUserProfile(fastify, req.params.id);

    if (!data) {
      return reply.code(404).send({ message: "User tidak ditemukan" });
    }

    return data;
  });

  // GET riwayat poin
  fastify.get("/users/:id/poin-history", async (req) => {
    return await getPoinHistory(fastify, req.params.id);
  });

  fastify.put("/users/:id/update-profile", async (req, reply) => {
  try {
    await updateUserProfile(fastify, req.params.id, req.body);
    return reply.send({ message: "Profil berhasil diperbarui" });
  } catch (err) {
    console.error("Update profil error:", err);
    return reply.code(500).send({ message: "Gagal update profil" });
  }
});

}

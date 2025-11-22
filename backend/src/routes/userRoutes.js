export default async function userRoutes(fastify, opts) {
  console.log("userRoutes LOADED YA!");

  // GET PROFIL USER
  fastify.get("/users/:id", async (req, reply) => {
    const { id } = req.params;

    const [user] = await fastify.mysql.query(`
      SELECT id_user, username, nama, email, bio, phone, alamat, foto
      FROM user
      WHERE id_user = ?
    `, [id]);

    if (!user.length) {
      return reply.code(404).send({ message: "User tidak ditemukan" });
    }

    // total poin
    const [total] = await fastify.mysql.query(`
      SELECT total_poin 
      FROM user_point_total
      WHERE id_user = ?
    `, [id]);

    // statistik poin per jenis
    const [stats] = await fastify.mysql.query(`
      SELECT 
        SUM(CASE WHEN id_poin = 1 THEN poin ELSE 0 END) AS poinAdopsi,
        SUM(CASE WHEN id_poin = 2 THEN poin ELSE 0 END) AS poinDonasi,
        SUM(CASE WHEN id_poin = 3 THEN poin ELSE 0 END) AS poinLapor
      FROM user_point_history
      WHERE id_user = ?
    `, [id]);

    // jumlah aktivitas
    const [counts] = await fastify.mysql.query(`
      SELECT 
        SUM(CASE WHEN id_poin = 1 THEN 1 ELSE 0 END) AS totalAdopsi,
        SUM(CASE WHEN id_poin = 2 THEN 1 ELSE 0 END) AS totalDonasi,
        SUM(CASE WHEN id_poin = 3 THEN 1 ELSE 0 END) AS totalLapor
      FROM user_point_history
      WHERE id_user = ?
    `, [id]);

    return {
      ...user[0],
      totalPoin: total[0]?.total_poin || 0,
      poinAdopsi: stats[0]?.poinAdopsi || 0,
      poinDonasi: stats[0]?.poinDonasi || 0,
      poinLapor: stats[0]?.poinLapor || 0,
      totalAdopsi: counts[0]?.totalAdopsi || 0,
      totalDonasi: counts[0]?.totalDonasi || 0,
      totalLapor: counts[0]?.totalLapor || 0,
    };
  });

  // GET RIWAYAT POIN USER
  fastify.get("/users/:id/poin-history", async (req) => {
    const { id } = req.params;

    const [rows] = await fastify.mysql.query(`
      SELECT 
        h.id_history,
        h.deskripsi,
        h.poin,
        DATE_FORMAT(h.tanggal, '%d %M %Y') AS tanggal,
        p.nama_poin
      FROM user_point_history h
      LEFT JOIN poin p ON h.id_poin = p.id_poin
      WHERE h.id_user = ?
      ORDER BY h.tanggal DESC
    `, [id]);

    return rows;
  });
}

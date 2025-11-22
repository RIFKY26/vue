export default async function peringkatRoutes(fastify, opts) {

  // API untuk semua peringkat
  fastify.get("/peringkat", async () => {
    const [rows] = await fastify.mysql.query(`
      SELECT 
        pr.id_peringkat,
        pr.rank,
        pr.tindakan,
        u.id_user,
        u.username,
        p.nama_poin,
        p.jumlah_poin
      FROM peringkat pr
      LEFT JOIN user u ON pr.id_user = u.id_user
      LEFT JOIN poin p ON pr.id_poin = p.id_poin
      ORDER BY pr.rank ASC
    `);
    return rows;
  });

  // 🔥 API untuk modal riwayat tindakan berdasarkan user
  fastify.get("/peringkat/:id/histori", async (req) => {
    const { id } = req.params;

    const [rows] = await fastify.mysql.query(`
      SELECT 
        pr.tindakan,
        p.nama_poin,
        p.jumlah_poin
      FROM peringkat pr
      LEFT JOIN poin p ON pr.id_poin = p.id_poin
      WHERE pr.id_user = ?
    `, [id]);

    return rows;
  });
}

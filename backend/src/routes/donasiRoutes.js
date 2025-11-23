export default async function donasiRoutes(fastify, opts) {
  
  // GET semua donasi
  fastify.get("/donasi", async () => {
    const [rows] = await fastify.mysql.query(`
      SELECT 
        d.id_donasi AS id,
        d.headline,
        d.deskripsi,
        d.target_donasi AS target,
        s.nama_shelter AS shelter,
        l.kota AS lokasi,
        s.foto AS shelter_foto
      FROM donasi d
      LEFT JOIN shelter s ON d.id_shelter = s.id_shelter
      LEFT JOIN lokasi l ON s.id_lokasi = l.id_lokasi
    `);

    return rows;
  });

  // GET detail donasi
  fastify.get("/donasi/:id", async (req) => {
    const { id } = req.params;

    const [rows] = await fastify.mysql.query(`
      SELECT 
        d.id_donasi AS id,
        d.headline,
        d.deskripsi,
        d.target_donasi AS target,
        s.nama_shelter AS shelter,
        l.kota AS lokasi,
        l.alamat,
        s.foto AS shelter_foto
      FROM donasi d
      LEFT JOIN shelter s ON d.id_shelter = s.id_shelter
      LEFT JOIN lokasi l ON s.id_lokasi = l.id_lokasi
      WHERE d.id_donasi = ?
    `, [id]);

    return rows.length ? rows[0] : { message: "Not Found" };
  });
}

export default async function kucingRoutes(fastify, opts) {
  fastify.get("/kucing", async () => {
    const [rows] = await fastify.mysql.query(`
      SELECT 
        k.id_kucing AS id,
        k.usia,
        k.foto,
        jk.jenis_kucing AS ras,
        jg.jenis_kelamin AS gender,
        kc.kondisi_kucing AS kondisi
      FROM kucing k
      LEFT JOIN jenis_kucing jk ON k.id_jenis_kucing = jk.id_jenis_kucing
      LEFT JOIN jenis_kelamin jg ON k.id_jenis_kelamin = jg.id_jenis_kelamin
      LEFT JOIN kondisi_kucing kc ON k.id_kondisi_kucing = kc.id_kondisi_kucing;
    `);

    return rows;
  });
}

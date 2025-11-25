import db from "../config/database.js"; // atau fastify.mysql, tergantung setup kamu

class KucingModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT 
        a.id_adopsi AS id,
        a.headline AS nama,
        a.lokasi,
        a.informasi AS deskripsi,
        a.foto_adopsi AS foto,
        a.usia,
        jk.jenis_kucing AS ras,
        jg.jenis_kelamin AS gender,
        kc.kondisi_kucing AS kondisi,
        s.nama_shelter,
        s.lokasi AS shelter_lokasi,
        s.foto AS shelter_foto
      FROM adopsi a
      LEFT JOIN jenis_kucing jk ON a.jenis_kucing = jk.id_jenis_kucing
      LEFT JOIN jenis_kelamin jg ON a.jenis_kelamin = jg.id_jenis_kelamin
      LEFT JOIN kondisi_kucing kc ON a.kondisi_kucing = kc.id_kondisi_kucing
      LEFT JOIN shelter s ON s.id_shelter = a.id_shelter;
    `);

    return rows;
  }
}

export default KucingModel;

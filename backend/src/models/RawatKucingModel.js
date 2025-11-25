class RawatKucingModel {
  // GET list kucing
  static async getAllKucing(db) {
    const query = `
      SELECT 
        k.id_kucing,
        CONCAT('Kucing ', k.id_kucing) AS nama_kucing,
        k.usia,
        'default-cat.png' AS foto,
        jk.jenis_kucing,
        jkel.jenis_kelamin,
        kk.kondisi_kucing AS kondisi,
        sf.sifat
      FROM kucing k
      JOIN jenis_kucing jk ON jk.id_jenis_kucing = k.id_jenis_kucing
      JOIN jenis_kelamin jkel ON jkel.id_jenis_kelamin = k.id_jenis_kelamin
      JOIN kondisi_kucing kk ON kk.id_kondisi_kucing = k.id_kondisi_kucing
      JOIN sifat_kucing sf ON sf.id_sifat = k.id_sifat
      ORDER BY k.id_kucing ASC;
    `;

    const [rows] = await db.query(query);
    return rows;
  }

  // GET reminders per kucing
  static async getReminders(db, id) {
    const query = `
      SELECT 
        id_pengingat AS id,
        judul AS title,
        waktu AS time,
        frekuensi AS frequency,
        status AS checked
      FROM kucing_pengingat
      WHERE id_kucing = ?;
    `;

    const [rows] = await db.query(query, [id]);
    return rows;
  }

  // GET aktivitas per kucing
  static async getAktivitas(db, id) {
    const query = `
      SELECT 
        id_aktivitas AS id,
        judul AS title,
        deskripsi AS details,
        DATE_FORMAT(tanggal, '%e') AS day,
        DATE_FORMAT(tanggal, '%b') AS month,
        CONCAT('Pukul ', DATE_FORMAT(waktu, '%H:%i')) AS time,
        alarm
      FROM kucing_aktivitas
      WHERE id_kucing = ?
      ORDER BY tanggal ASC;
    `;

    const [rows] = await db.query(query, [id]);
    return rows;
  }
}

export default RawatKucingModel;

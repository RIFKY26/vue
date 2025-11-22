import db from "../config/database.js";

export default {
  async create(data) {
    const sql = `INSERT INTO laporan 
      (kondisi, kelamin, ras, tanggal, lokasi, latitude, longitude, deskripsi, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.kondisi,
      data.kelamin,
      data.ras,
      data.tanggal,
      data.lokasi,
      data.latitude,
      data.longitude,
      data.deskripsi,
      data.foto,
    ];

    const [result] = await db.execute(sql, values);
    return { id: result.insertId, ...data };
  },

  async getAll() {
    const [rows] = await db.execute(
      "SELECT * FROM laporan ORDER BY created_at DESC"
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute("SELECT * FROM laporan WHERE id = ?", [id]);
    return rows[0];
  },

  async update(id, data) {
    const sql = `UPDATE laporan SET kondisi=?, kelamin=?, ras=?, tanggal=?, lokasi=?, latitude=?, longitude=?, deskripsi=?, foto=IFNULL(?, foto) WHERE id = ?`;

    const values = [
      data.kondisi,
      data.kelamin,
      data.ras,
      data.tanggal,
      data.lokasi,
      data.latitude,
      data.longitude,
      data.deskripsi,
      data.foto,
      id,
    ];

    await db.execute(sql, values);
    return { id, ...data };
  },

  async delete(id) {
    await db.execute("DELETE FROM laporan WHERE id = ?", [id]);
    return true;
  },
};

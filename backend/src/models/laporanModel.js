// src/models/laporanModel.js
import db from "../config/database.js";

export const getAllLaporan = async () => {
  // Query JOIN untuk mendapatkan data lengkap sesuai tampilan Vue
  const query = `
        SELECT 
            l.id_lapor AS id,
            l.headline,
            l.lokasi,
            l.deskripsi,
            l.status,
            k.foto AS image,
            k.usia,
            jk.jenis_kelamin AS gender,
            ras.jenis_kucing AS ras,
            kk.kondisi_kucing AS kondisi,
            s.nama_shelter AS shelter
        FROM lapor l
        JOIN kucing k ON l.kucing = k.id_kucing
        LEFT JOIN jenis_kelamin jk ON k.id_jenis_kelamin = jk.id_jenis_kelamin
        LEFT JOIN jenis_kucing ras ON k.id_jenis_kucing = ras.id_jenis_kucing
        LEFT JOIN kondisi_kucing kk ON k.id_kondisi_kucing = kk.id_kondisi_kucing
        LEFT JOIN shelter s ON l.id_shelter = s.id_shelter
        ORDER BY l.id_lapor DESC
    `;
  const [rows] = await db.execute(query);
  return rows;
};

export const getLaporanById = async (id) => {
  const query = `SELECT * FROM lapor WHERE id_lapor = ?`;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

export const createLaporanBaru = async (data) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert ke tabel KUCING terlebih dahulu
    const [kucingResult] = await connection.execute(
      `INSERT INTO kucing (id_jenis_kucing, id_jenis_kelamin, id_kondisi_kucing, usia, foto) 
             VALUES (?, ?, ?, ?, ?)`,
      [
        data.id_jenis_kucing,
        data.id_jenis_kelamin,
        data.id_kondisi_kucing,
        data.usia,
        data.foto,
      ]
    );

    const newKucingId = kucingResult.insertId;

    // 2. Insert ke tabel LAPOR menggunakan ID Kucing yang baru dibuat
    const [laporResult] = await connection.execute(
      `INSERT INTO lapor (kucing, headline, lokasi, deskripsi, status) 
             VALUES (?, ?, ?, ?, 'Menunggu Tindakan')`,
      [newKucingId, data.headline, data.lokasi, data.deskripsi]
    );

    await connection.commit();
    return laporResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateLaporan = async (id, data) => {
  // Contoh update sederhana (bisa dikembangkan untuk update data kucing juga)
  const query = `
        UPDATE lapor 
        SET headline = ?, deskripsi = ?, lokasi = ? 
        WHERE id_lapor = ?
    `;
  const [result] = await db.execute(query, [
    data.headline,
    data.deskripsi,
    data.lokasi,
    id,
  ]);
  return result;
};

export const deleteLaporan = async (id) => {
  // Hapus laporan (Cascading delete perlu diperhatikan di database, atau hapus manual)
  const query = `DELETE FROM lapor WHERE id_lapor = ?`;
  const [result] = await db.execute(query, [id]);
  return result;
};

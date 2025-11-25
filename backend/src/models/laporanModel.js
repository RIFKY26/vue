// src/models/laporanModel.js
import db from "../config/database.js";

// === GET ALL (DIPERBAIKI: Tambahkan Select ID mentah) ===
export const getAllLaporan = async () => {
  const query = `
        SELECT 
            l.id_lapor AS id,
            l.headline,
            l.lokasi,
            l.deskripsi,
            l.status_lapor AS status,
            l.foto_lapor AS image,
            l.usia,
            l.id_adopter,
            
            -- Ambil ID aslinya juga untuk keperluan Edit form
            l.jenis_kelamin AS id_jenis_kelamin,
            l.jenis_kucing AS id_jenis_kucing,
            l.kondisi_kucing AS id_kondisi_kucing,

            -- Data Join (String untuk tampilan)
            jk.jenis_kelamin AS gender,
            ras.jenis_kucing AS ras,
            kk.kondisi_kucing AS kondisi,
            adp.nama AS pelapor
        FROM lapor l
        LEFT JOIN jenis_kelamin jk ON l.jenis_kelamin = jk.id_jenis_kelamin
        LEFT JOIN jenis_kucing ras ON l.jenis_kucing = ras.id_jenis_kucing
        LEFT JOIN kondisi_kucing kk ON l.kondisi_kucing = kk.id_kondisi_kucing
        LEFT JOIN adopter adp ON l.id_adopter = adp.id_adopter
        ORDER BY l.id_lapor DESC
    `;
  const [rows] = await db.execute(query);
  return rows;
};

// ... (Sisa fungsi getLaporanById, create, update, delete biarkan sama seperti file asli Anda, logicnya sudah benar) ...
// Pastikan export functions lainnya tetap ada di bawah sini.

export const getLaporanById = async (id) => {
  const query = `SELECT * FROM lapor WHERE id_lapor = ?`;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

export const createLaporanBaru = async (data) => {
  const query = `
    INSERT INTO lapor (
      headline, lokasi, deskripsi, usia, 
      jenis_kucing, jenis_kelamin, kondisi_kucing, 
      foto_lapor, id_adopter, status_lapor
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Tindakan')
  `;
  const [result] = await db.execute(query, [
    data.headline,
    data.lokasi,
    data.deskripsi,
    data.usia,
    data.jenis_kucing,
    data.jenis_kelamin,
    data.kondisi_kucing,
    data.foto_lapor,
    data.id_adopter,
  ]);
  return result.insertId;
};

export const updateLaporanData = async (id, data) => {
  let query = `
    UPDATE lapor SET 
      headline = ?, lokasi = ?, deskripsi = ?, usia = ?, 
      jenis_kucing = ?, jenis_kelamin = ?, kondisi_kucing = ?
  `;
  const params = [
    data.headline,
    data.lokasi,
    data.deskripsi,
    data.usia,
    data.jenis_kucing,
    data.jenis_kelamin,
    data.kondisi_kucing,
  ];
  if (data.foto_lapor) {
    query += `, foto_lapor = ?`;
    params.push(data.foto_lapor);
  }
  query += ` WHERE id_lapor = ?`;
  params.push(id);
  const [result] = await db.execute(query, params);
  return result;
};

export const deleteLaporanData = async (id) => {
  const query = `DELETE FROM lapor WHERE id_lapor = ?`;
  const [result] = await db.execute(query, [id]);
  return result;
};

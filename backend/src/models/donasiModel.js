// src/models/donasiModel.js
import db from "../config/database.js";

// ... (getAllDonasi & getDonasiById TETAP SAMA) ...
// Pastikan export functions lainnya (getAllDonasi, getDonasiById) tetap ada.

export const getAllDonasi = async () => {
  const query = `
    SELECT 
      d.id_donasi,
      d.judul,
      d.deskripsi,
      d.foto,
      d.target_donasi,
      d.terkumpul,
      d.created_at,
      d.id_shelter,
      s.nama_shelter,
      s.lokasi AS lokasi_shelter,
      s.foto AS foto_shelter
    FROM donasi d
    LEFT JOIN shelter s ON d.id_shelter = s.id_shelter
    ORDER BY d.id_donasi DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
};

export const getDonasiById = async (id) => {
  const query = `
    SELECT 
      d.id_donasi,
      d.judul,
      d.deskripsi,
      d.foto,
      d.target_donasi,
      d.terkumpul,
      d.created_at,
      d.id_shelter,
      s.nama_shelter,
      s.lokasi AS lokasi_shelter,
      s.foto AS foto_shelter
    FROM donasi d
    LEFT JOIN shelter s ON d.id_shelter = s.id_shelter
    WHERE d.id_donasi = ?
    LIMIT 1
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
};

// === UPDATE: AMBIL HISTORY DARI TABEL PEMBAYARAN_DONASI ===
export const getDonasiHistory = async (idDonasi) => {
  const query = `
    SELECT 
      pd.id_pembayaran,
      pd.nama_donatur, 
      pd.nominal, 
      pd.pesan, 
      pd.tanggal_bayar,
      mp.metode_pembayaran 
    FROM pembayaran_donasi pd
    LEFT JOIN metode_pembayaran mp ON pd.id_metode = mp.id_metode
    WHERE pd.id_donasi = ? 
    ORDER BY pd.id_pembayaran DESC 
    LIMIT 5
  `;
  const [rows] = await db.execute(query, [idDonasi]);
  return rows;
};

// === UPDATE: PROSES BAYAR KE TABEL PEMBAYARAN_DONASI ===
export const prosesDonasi = async (data) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Masukkan ke tabel 'pembayaran_donasi' milik Anda
    const queryBayar = `
      INSERT INTO pembayaran_donasi (
        id_donasi, 
        id_adopter, 
        id_metode, 
        nominal, 
        nama_donatur, 
        pesan
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    // id_adopter bisa NULL jika user tidak login (Guest)
    await connection.execute(queryBayar, [
      data.id_donasi,
      data.id_adopter || null,
      data.id_metode,
      data.nominal,
      data.nama_donatur,
      data.pesan,
    ]);

    // 2. Update Total Terkumpul di Tabel Donasi
    const queryUpdate = `
      UPDATE donasi 
      SET terkumpul = terkumpul + ? 
      WHERE id_donasi = ?
    `;
    await connection.execute(queryUpdate, [data.nominal, data.id_donasi]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getMetodePembayaran = async () => {
  const query = `
    SELECT 
      id_metode,
      metode_pembayaran 
    FROM metode_pembayaran
    ORDER BY id_metode ASC
  `;
  const [rows] = await db.execute(query);
  return rows;
};

export const findMetodePembayaranById = async (idMetode) => {
  const query = `
    SELECT id_metode, metode_pembayaran 
    FROM metode_pembayaran
    WHERE id_metode = ?
    LIMIT 1
  `;
  const [rows] = await db.execute(query, [idMetode]);
  return rows[0];
};

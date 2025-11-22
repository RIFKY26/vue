import * as LaporanModel from "../models/laporanModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- 1. SETUP PATH FOLDER ---
// Karena menggunakan ES Modules, kita perlu mendefinisikan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tentukan lokasi folder penyimpanan gambar
// Path ini naik 2 level dari 'src/controllers' ke root, lalu masuk ke 'public/image/adopsi'
const UPLOAD_DIR = path.join(__dirname, "../../public/image/adopsi");

// Pastikan folder upload ada, jika tidak, buat foldernya
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- 2. READ (GET) ---
export const getLaporan = async (req, reply) => {
  try {
    const data = await LaporanModel.getAllLaporan();

    // Format data agar sesuai dengan Frontend
    const formattedData = data.map((item) => ({
      ...item,
      // Frontend mengharapkan properti 'image'
      // Kita ambil dari kolom 'foto' di database
      image: item.foto || "default-cat.png",

      // Placeholder jika timeAgo belum dihitung dari DB
      timeAgo: item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "Baru saja",
    }));

    return reply.send(formattedData);
  } catch (error) {
    console.error("Error [getLaporan]:", error);
    return reply.status(500).send({ msg: "Gagal mengambil data laporan" });
  }
};

// --- 3. CREATE (POST) ---
export const createLaporan = async (req, reply) => {
  try {
    // Data dari FormData (Multipart) ada di req.body
    const parts = req.body;

    // Validasi sederhana
    if (!parts) {
      return reply.status(400).send({ msg: "Tidak ada data yang dikirim" });
    }

    // A. EKSTRAKSI DATA TEKS
    // Karena fastify-multipart dengan opsi 'attachFieldsToBody: true',
    // setiap field teks dibungkus object { value: 'isi', ... }
    const headline = parts.headline?.value;
    const lokasi = parts.lokasi?.value;
    const deskripsi = parts.deskripsi?.value;
    const usia = parts.usia?.value || "Tidak diketahui";

    // Convert String ID ke Integer (Default 1 jika kosong)
    const id_jenis_kucing = parseInt(parts.id_jenis_kucing?.value || 1);
    const id_jenis_kelamin = parseInt(parts.id_jenis_kelamin?.value || 1);
    const id_kondisi_kucing = parseInt(parts.id_kondisi_kucing?.value || 1);

    // B. HANDLE UPLOAD GAMBAR
    let namaFileFoto = "default-cat.png"; // Default jika user tidak upload

    if (parts.foto && parts.foto.filename) {
      // 1. Ambil buffer (data mentah) file
      const fileBuffer = await parts.foto.toBuffer();

      // 2. Buat nama file unik (timestamp + ekstensi asli)
      const ext = path.extname(parts.foto.filename);
      const timestamp = Date.now();
      namaFileFoto = `lapor-${timestamp}${ext}`; // Contoh: lapor-1732245.jpg

      // 3. Simpan file ke folder public
      const fullPath = path.join(UPLOAD_DIR, namaFileFoto);
      fs.writeFileSync(fullPath, fileBuffer);

      console.log(`File berhasil disimpan di: ${fullPath}`);
    }

    // C. SIMPAN KE DATABASE
    const newId = await LaporanModel.createLaporanBaru({
      headline,
      lokasi,
      deskripsi,
      id_jenis_kucing,
      id_jenis_kelamin,
      id_kondisi_kucing,
      usia,
      foto: namaFileFoto, // Kita simpan nama filenya saja
    });

    return reply.status(201).send({
      msg: "Laporan berhasil dibuat",
      id: newId,
      image: namaFileFoto,
    });
  } catch (error) {
    console.error("Error [createLaporan]:", error);
    return reply.status(500).send({
      msg: "Gagal membuat laporan",
      error: error.message,
    });
  }
};

// --- 4. UPDATE (PUT) ---
export const updateLaporan = async (req, reply) => {
  try {
    const { id } = req.params;

    // Catatan: Jika edit juga mengizinkan ganti foto,
    // logikanya harus mirip createLaporan (cek multipart).
    // Kode di bawah ini asumsi edit hanya TEXT (JSON).

    const { headline, deskripsi, lokasi, kondisi, gender, ras } = req.body;

    // Panggil Model Update
    await LaporanModel.updateLaporan(id, {
      headline,
      deskripsi,
      lokasi,
      // Tambahkan update field lain ke tabel kucing jika perlu
    });

    return reply.send({ msg: "Laporan berhasil diupdate" });
  } catch (error) {
    console.error("Error [updateLaporan]:", error);
    return reply.status(500).send({ msg: "Gagal update laporan" });
  }
};

// --- 5. DELETE (DELETE) ---
export const deleteLaporan = async (req, reply) => {
  try {
    const { id } = req.params;

    // Hapus data dari DB
    await LaporanModel.deleteLaporan(id);

    // (Opsional) Disini bisa ditambahkan logika untuk menghapus file gambar fisik
    // menggunakan fs.unlinkSync() jika ingin menghemat penyimpanan.

    return reply.send({ msg: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("Error [deleteLaporan]:", error);
    return reply.status(500).send({ msg: "Gagal menghapus laporan" });
  }
};

// src/controllers/laporanController.js
import * as LaporanModel from "../models/laporanModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path Upload
const UPLOAD_DIR = path.join(__dirname, "../../public/image/laporan");

// Helper Value
const getValue = (field) => {
  if (!field) return null;
  return field.value !== undefined ? field.value : field;
};

// ... (GET & CREATE biarkan sama) ...
export const getLaporan = async (req, reply) => {
  try {
    const data = await LaporanModel.getAllLaporan();
    const formattedData = data.map((item) => ({
      ...item,
      foto_lapor: item.image || item.foto_lapor || null, // Handle alias
      timeAgo: "Baru saja",
    }));
    return reply.send(formattedData);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ msg: "Gagal mengambil data" });
  }
};

export const createLaporan = async (req, reply) => {
  try {
    const parts = req.body;
    if (!parts.foto) return reply.status(400).send({ msg: "Foto wajib!" });

    const buffer = await parts.foto.toBuffer();
    const ext = path.extname(parts.foto.filename);
    const newFileName = `lapor-${Date.now()}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, newFileName), buffer);

    const laporanData = {
      headline: getValue(parts.headline),
      lokasi: getValue(parts.lokasi),
      deskripsi: getValue(parts.deskripsi),
      usia: parseInt(getValue(parts.usia)) || 0,
      jenis_kucing: parseInt(getValue(parts.id_jenis_kucing) || 1),
      jenis_kelamin: parseInt(getValue(parts.id_jenis_kelamin) || 1),
      kondisi_kucing: parseInt(getValue(parts.id_kondisi_kucing) || 1),
      foto_lapor: newFileName,
      id_adopter: 1,
    };

    const newId = await LaporanModel.createLaporanBaru(laporanData);
    return reply.status(201).send({ msg: "Berhasil", id: newId });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ msg: "Gagal membuat laporan" });
  }
};

// === UPDATE (Fixed) ===
export const updateLaporan = async (req, reply) => {
  const { id } = req.params;
  try {
    const parts = req.body;
    const oldData = await LaporanModel.getLaporanById(id);

    if (!oldData) {
      return reply.status(404).send({ msg: "Laporan tidak ditemukan" });
    }

    let namaFileFoto = null;

    // Cek jika user mengupload file baru
    // Note: parts.foto akan undefined jika user tidak memilih file baru di frontend
    if (parts.foto) {
      const buffer = await parts.foto.toBuffer();
      const ext = path.extname(parts.foto.filename);
      namaFileFoto = `lapor-${Date.now()}${ext}`;

      // Simpan yang baru
      fs.writeFileSync(path.join(UPLOAD_DIR, namaFileFoto), buffer);

      // Hapus yang lama
      if (oldData.foto_lapor && oldData.foto_lapor !== "default-cat.png") {
        const oldPath = path.join(UPLOAD_DIR, oldData.foto_lapor);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {}
        }
      }
    }

    const updateData = {
      headline: getValue(parts.headline),
      lokasi: getValue(parts.lokasi),
      deskripsi: getValue(parts.deskripsi),
      usia: parseInt(getValue(parts.usia)) || 0,
      // Gunakan || oldData.field untuk fallback jika frontend mengirim null
      jenis_kucing:
        parseInt(getValue(parts.id_jenis_kucing)) || oldData.jenis_kucing,
      jenis_kelamin:
        parseInt(getValue(parts.id_jenis_kelamin)) || oldData.jenis_kelamin,
      kondisi_kucing:
        parseInt(getValue(parts.id_kondisi_kucing)) || oldData.kondisi_kucing,
      foto_lapor: namaFileFoto, // null jika tidak ganti foto
    };

    await LaporanModel.updateLaporanData(id, updateData);
    return reply.send({ msg: "Laporan berhasil diupdate" });
  } catch (error) {
    console.error("Error Update:", error);
    return reply.status(500).send({ msg: "Gagal update laporan" });
  }
};

// === DELETE (Fixed) ===
export const deleteLaporan = async (req, reply) => {
  const { id } = req.params;
  try {
    // 1. Cek apakah data ada
    const oldData = await LaporanModel.getLaporanById(id);
    if (!oldData) {
      return reply.status(404).send({ msg: "Data tidak ditemukan" });
    }

    // 2. Hapus File Fisik (Gunakan Try-Catch agar error file tidak membatalkan hapus DB)
    if (oldData.foto_lapor && oldData.foto_lapor !== "default-cat.png") {
      const filePath = path.join(UPLOAD_DIR, oldData.foto_lapor);
      // Cek dulu file ada atau tidak
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(
            "Gagal hapus file fisik (lanjutkan hapus DB):",
            err.message
          );
        }
      }
    }

    // 3. Hapus Data di Database
    await LaporanModel.deleteLaporanData(id);

    return reply.send({ msg: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("Error Delete:", error);

    // MENANGANI ERROR DATABASE (Foreign Key)
    // Jika error karena data ini dipakai di tabel lain (misal: tabel adopsi/komentar)
    if (error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451) {
      return reply.status(400).send({
        msg: "Gagal: Data ini tidak bisa dihapus karena sedang digunakan di data lain (misal: Data Adopsi).",
      });
    }

    return reply
      .status(500)
      .send({ msg: error.message || "Gagal menghapus laporan" });
  }
};

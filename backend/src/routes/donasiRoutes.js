// src/routes/donasiRoutes.js
import {
  getDonasi,
  getDonasiDetail,
  bayarDonasi,
  getMetodePembayaran,
} from "../controllers/donasiController.js";

async function donasiRoutes(fastify, options) {
  // GET Semua Donasi
  // Mengambil daftar donasi beserta progress-nya
  fastify.get("/donasi", getDonasi);

  // GET Detail Donasi
  // Mengambil detail donasi berdasarkan ID beserta riwayat donaturnya
  fastify.get("/donasi/:id", getDonasiDetail);

  // POST Bayar Donasi
  // Melakukan transaksi pembayaran (donasi baru)
  // Body: { id_donasi, nama_donatur, nominal, id_metode, pesan, id_adopter }
  fastify.post("/donasi/bayar", bayarDonasi);

  // GET daftar metode pembayaran aktif
  fastify.get("/donasi/metode", getMetodePembayaran);
}

export default donasiRoutes;

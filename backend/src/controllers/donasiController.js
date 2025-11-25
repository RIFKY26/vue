// src/controllers/donasiController.js
import * as DonasiModel from "../models/donasiModel.js";

const formatDonasiRecord = (item) => {
  if (!item) return null;

  const terkumpul = Number(item.terkumpul) || 0;
  const target = Number(item.target_donasi) || 0;
  const progress = target > 0 ? (terkumpul / target) * 100 : 0;

  return {
    id_donasi: item.id_donasi,
    judul: item.judul,
    deskripsi: item.deskripsi,
    foto: item.foto,
    target_donasi: target,
    terkumpul,
    progress,
    created_at: item.created_at,
    shelter: {
      name: item.nama_shelter || "Shelter Tidak Diketahui",
      location: item.lokasi_shelter || "Indonesia",
      avatar: item.foto_shelter || "default-shelter.png",
    },
  };
};

export const getDonasi = async (req, reply) => {
  try {
    const data = await DonasiModel.getAllDonasi();

    if (!data || data.length === 0) {
      return reply.send([]);
    }

    const formatted = data.map(formatDonasiRecord);
    return reply.send(formatted);
  } catch (error) {
    console.error("ERROR di getDonasi:", error);
    return reply
      .status(500)
      .send({ msg: "Gagal ambil data", error: error.message });
  }
};

export const getDonasiDetail = async (req, reply) => {
  const { id } = req.params;
  try {
    const donasi = await DonasiModel.getDonasiById(id);
    if (!donasi)
      return reply.status(404).send({ msg: "Donasi tidak ditemukan" });

    const history = await DonasiModel.getDonasiHistory(id);

    return reply.send({
      ...formatDonasiRecord(donasi),
      riwayat: history,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ msg: "Error server" });
  }
};

export const bayarDonasi = async (req, reply) => {
  try {
    const {
      id_donasi,
      nama_donatur,
      nominal,
      id_metode,
      pesan,
      id_adopter,
    } = req.body;

    const nominalNumber = Number(nominal);
    const metodeId = Number(id_metode);
    const donasiId = Number(id_donasi);

    if (!donasiId || !metodeId || !nominalNumber || nominalNumber <= 0) {
      return reply.status(400).send({ msg: "Data pembayaran tidak lengkap!" });
    }

    const [donasiDetail, metode] = await Promise.all([
      DonasiModel.getDonasiById(donasiId),
      DonasiModel.findMetodePembayaranById(metodeId),
    ]);

    if (!donasiDetail) {
      return reply.status(404).send({ msg: "Program donasi tidak ditemukan." });
    }

    if (!metode) {
      return reply.status(400).send({ msg: "Metode pembayaran tidak valid." });
    }

    await DonasiModel.prosesDonasi({
      id_donasi: donasiId,
      id_adopter,
      id_metode: metodeId,
      nominal: nominalNumber,
      nama_donatur: nama_donatur || "Hamba Allah",
      pesan,
    });

    return reply.send({ msg: "Terima kasih! Donasi berhasil diterima." });
  } catch (error) {
    console.error("Gagal Bayar:", error);
    return reply.status(500).send({ msg: "Transaksi gagal diproses" });
  }
};

export const getMetodePembayaran = async (req, reply) => {
  try {
    const metode = await DonasiModel.getMetodePembayaran();
    return reply.send(metode);
  } catch (error) {
    console.error("ERROR getMetodePembayaran:", error);
    return reply
      .status(500)
      .send({ msg: "Gagal mengambil daftar metode pembayaran" });
  }
};

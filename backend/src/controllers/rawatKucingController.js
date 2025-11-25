import RawatKucingModel from "../models/RawatKucingModel.js";

export async function getListKucing(fastify, idUser) {
  return await RawatKucingModel.getAllKucing(fastify.mysql, idUser);
}

export async function getKucingReminders(fastify, id) {
  return await RawatKucingModel.getReminders(fastify.mysql, id);
}

export async function getKucingAktivitas(fastify, id) {
  return await RawatKucingModel.getAktivitas(fastify.mysql, id);
}

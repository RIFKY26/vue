import KucingModel from "../models/kucingModel.js";

export async function getAllKucing(req, reply) {
  const data = await KucingModel.getAll();
  return data;
}

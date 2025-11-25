import PeringkatModel from "../models/PeringkatModel.js";

export async function getPeringkat(fastify) {
  return await PeringkatModel.getAll(fastify.mysql);
}

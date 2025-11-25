import UserModel from "../models/UserModel.js";

export async function getUserProfile(fastify, id) {
  const db = fastify.mysql;

  const user = await UserModel.getUserProfile(db, id);
  if (!user) return null;

  const totalPoin = await UserModel.getTotalPoin(db, id);
  const stats = await UserModel.getPoinStats(db, id);
  const counts = await UserModel.getActivityCounts(db, id);
  const peringkat = await UserModel.getRank(db, id);

  return {
    ...user,
    totalPoin,
    peringkat,
    poinAdopsi: stats.poinAdopsi || 0,
    poinDonasi: stats.poinDonasi || 0,
    poinLapor: stats.poinLapor || 0,
    totalAdopsi: counts.totalAdopsi || 0,
    totalDonasi: counts.totalDonasi || 0,
    totalLapor: counts.totalLapor || 0,
  };
}

export async function getPoinHistory(fastify, id) {
  return await UserModel.getPoinHistory(fastify.mysql, id);
}

export async function updateUserProfile(fastify, id, data) {
  const db = fastify.mysql;
  await UserModel.updateProfile(db, id, data);
  return { success: true };
}

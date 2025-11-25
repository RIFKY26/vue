class userModel {
  // GET profil user + adopter
  static async getUserProfile(db, id) {
    const query = `
      SELECT 
        u.id_user,
        u.username,
        u.email,

        a.nama,
        a.bio,
        a.phone,
        a.alamat,
        a.foto

      FROM user u
      LEFT JOIN adopter a ON a.id_user = u.id_user
      WHERE u.id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  }

  // GET total poin
  static async getTotalPoin(db, id) {
    const query = `
      SELECT total_poin
      FROM user_point_total
      WHERE id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0]?.total_poin || 0;
  }

  // GET statistik poin per jenis
  static async getPoinStats(db, id) {
    const query = `
      SELECT 
        SUM(CASE WHEN id_poin = 1 THEN poin ELSE 0 END) AS poinAdopsi,
        SUM(CASE WHEN id_poin = 2 THEN poin ELSE 0 END) AS poinDonasi,
        SUM(CASE WHEN id_poin = 3 THEN poin ELSE 0 END) AS poinLapor
      FROM user_point_history
      WHERE id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // GET jumlah kegiatan
  static async getActivityCounts(db, id) {
    const query = `
      SELECT 
        SUM(CASE WHEN id_poin = 1 THEN 1 ELSE 0 END) AS totalAdopsi,
        SUM(CASE WHEN id_poin = 2 THEN 1 ELSE 0 END) AS totalDonasi,
        SUM(CASE WHEN id_poin = 3 THEN 1 ELSE 0 END) AS totalLapor
      FROM user_point_history
      WHERE id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // GET riwayat poin
  static async getPoinHistory(db, id) {
    const query = `
      SELECT 
        h.id_history,
        h.id_poin,
        h.deskripsi,
        h.poin,
        DATE_FORMAT(h.tanggal, '%d %M %Y') AS tanggal,
        p.nama_poin
      FROM user_point_history h
      LEFT JOIN poin p ON h.id_poin = p.id_poin
      WHERE h.id_user = ?
      ORDER BY h.tanggal DESC
    `;

    const [rows] = await db.query(query, [id]);
    return rows;
  }
}

export default UserModel;

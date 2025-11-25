class PeringkatModel {
  static async getAll(db) {
    const query = `
      SELECT 
        u.id_user,
        u.username,
        
        a.nama AS nama,
        a.foto AS avatar,

        COALESCE(upt.total_poin, 0) AS total_poin,

        SUM(CASE WHEN h.id_poin = 1 THEN h.poin ELSE 0 END) AS poinAdopsi,
        SUM(CASE WHEN h.id_poin = 2 THEN h.poin ELSE 0 END) AS poinDonasi,
        SUM(CASE WHEN h.id_poin = 3 THEN h.poin ELSE 0 END) AS poinLapor

      FROM user u
      LEFT JOIN adopter a ON a.id_user = u.id_user
      LEFT JOIN user_point_total upt ON u.id_user = upt.id_user
      LEFT JOIN user_point_history h ON u.id_user = h.id_user

      GROUP BY u.id_user
      ORDER BY total_poin DESC
    `;

    const [rows] = await db.query(query);
    return rows;
  }
}

export default PeringkatModel;

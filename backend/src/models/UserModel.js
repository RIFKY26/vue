class UserModel {
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
  // Note: id_poin 1=Donasi, 2=Adopsi, 3=Lapor (sesuai tabel poin)
  static async getPoinStats(db, id) {
    const query = `
      SELECT 
        SUM(CASE WHEN id_poin = 2 THEN poin ELSE 0 END) AS poinAdopsi,
        SUM(CASE WHEN id_poin = 1 THEN poin ELSE 0 END) AS poinDonasi,
        SUM(CASE WHEN id_poin = 3 THEN poin ELSE 0 END) AS poinLapor
      FROM user_point_history
      WHERE id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // GET jumlah kegiatan
  // Note: id_poin 1=Donasi, 2=Adopsi, 3=Lapor (sesuai tabel poin)
  static async getActivityCounts(db, id) {
    const query = `
      SELECT 
        SUM(CASE WHEN id_poin = 2 THEN 1 ELSE 0 END) AS totalAdopsi,
        SUM(CASE WHEN id_poin = 1 THEN 1 ELSE 0 END) AS totalDonasi,
        SUM(CASE WHEN id_poin = 3 THEN 1 ELSE 0 END) AS totalLapor
      FROM user_point_history
      WHERE id_user = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0];
  }

  // GET peringkat user berdasarkan total poin
  static async getRank(db, id) {
    const query = `
      SELECT 
        COUNT(*) + 1 AS peringkat
      FROM user_point_total
      WHERE total_poin > (
        SELECT COALESCE(total_poin, 0)
        FROM user_point_total
        WHERE id_user = ?
      )
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0]?.peringkat || 1;
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

  // UPDATE profil user + adopter
  static async updateProfile(db, id, data) {
    const { nama, email, bio, phone, alamat } = data;

    // Ambil data user saat ini untuk fallback apabila field kosong
    const [userRows] = await db.query(
      `SELECT username, email FROM user WHERE id_user = ?`,
      [id]
    );

    if (!userRows.length) {
      throw new Error("User tidak ditemukan");
    }

    const safeNama = (nama ?? "").trim();
    const safeEmail = (email ?? "").trim();
    const safeBio = (bio ?? "").trim();
    const safePhone = (phone ?? "").trim();
    const safeAlamat = (alamat ?? "").trim();

    const usernameToSave = safeNama || userRows[0].username;
    const emailToSave = safeEmail || userRows[0].email;

    // Update tabel user
    await db.query(
      `UPDATE user 
       SET username = ?, email = ?
       WHERE id_user = ?`,
      [usernameToSave, emailToSave, id]
    );

    // Cek apakah adopter sudah ada
    const [existing] = await db.query(
      `SELECT id_adopter FROM adopter WHERE id_user = ?`,
      [id]
    );

    const adopterPayload = [
      usernameToSave,
      safeBio,
      safePhone || "",
      safeAlamat,
      id,
    ];

    if (existing.length > 0) {
      // Update jika sudah ada
      await db.query(
        `UPDATE adopter 
         SET nama = ?, bio = ?, phone = ?, alamat = ?
         WHERE id_user = ?`,
        adopterPayload
      );
    } else {
      // Insert jika belum ada
      await db.query(
        `INSERT INTO adopter (nama, bio, phone, alamat, id_user)
         VALUES (?, ?, ?, ?, ?)`,
        [
          usernameToSave,
          safeBio,
          safePhone || "",
          safeAlamat,
          id,
        ]
      );
    }

    return true;
  }

}



export default UserModel;

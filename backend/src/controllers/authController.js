import db from "../config/database.js"; // Pastikan export default pool di config Anda
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  // ======================
  //   REGISTER (TRANSACTION)
  // ======================
  async register(req, reply) {
    // Ambil koneksi dari pool untuk transaksi
    const connection = await db.getConnection();

    try {
      // 1. Mulai Transaksi
      await connection.beginTransaction();

      const { email, username, phone, name, password, role } = req.body;

      // Validasi input dasar
      if (!email || !password || !name) {
        throw new Error("Email, Password, dan Nama wajib diisi");
      }

      // Default role jika tidak dipilih adalah Adopter
      const userRole = role || "Adopter";

      // 2. Cek Duplikat di tabel User
      const [existing] = await connection.query(
        "SELECT * FROM user WHERE email = ? OR username = ?",
        [email, username]
      );

      if (existing.length > 0) {
        throw new Error("Email atau Username sudah digunakan");
      }

      // 3. Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. INSERT ke tabel USER (Data Login)
      // Perhatikan: Phone tidak dimasukkan ke user, karena permintaan Anda phone masuk ke adopter/shelter
      const [userResult] = await connection.query(
        `INSERT INTO user (username, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, userRole]
      );

      const newUserId = userResult.insertId;

      // 5. INSERT ke tabel Detail Sesuai Role
      if (userRole === "Adopter") {
        // --- Masuk ke tabel ADOPTER ---
        // Mapping: id_user, nama, email, phone.
        // Field lain diset NULL/Default dulu agar tidak error.
        await connection.query(
          `INSERT INTO adopter (id_user, nama, email, phone, jenis_kelamin, tgl_lahir, pekerjaan, alasan_adopsi) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [newUserId, name, email, phone, null, null, null, null]
          // null digunakan utk field yg belum diisi saat register
        );
      } else if (userRole === "Shelter") {
        // --- Masuk ke tabel SHELTER ---
        // Mapping: id_user, nama_shelter (dari name), no_wa (dari phone)
        // Kita isi lokasi/deskripsi dengan strip (-) dulu agar tidak error database
        await connection.query(
          `INSERT INTO shelter (id_user, nama_shelter, no_wa, lokasi, deskripsi, sosial_media, jam_operasional) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newUserId, name, phone, "-", "-", "-", "-"]
        );
      }

      // 6. Commit Transaksi (Simpan Permanen)
      await connection.commit();

      return reply.send({
        message: "Registrasi berhasil",
        userId: newUserId,
        role: userRole,
      });
    } catch (error) {
      // 7. Rollback (Batalkan semua jika ada error)
      await connection.rollback();
      console.error("Register Error:", error);

      // Kirim error yang rapi ke frontend
      return reply.code(400).send({
        error: error.message || "Terjadi kesalahan saat registrasi",
      });
    } finally {
      // 8. Lepaskan koneksi kembali ke pool
      connection.release();
    }
  },

  // ======================
  //         LOGIN
  // ======================
  async login(req, reply) {
    try {
      // Frontend mengirim { username: "email@gmail.com", password: "..." }
      const { username, password } = req.body;

      // 1. Cari di tabel USER
      const [rows] = await db.query(
        "SELECT * FROM user WHERE email = ? OR username = ?",
        [username, username]
      );

      if (rows.length === 0) {
        return reply.code(400).send({ error: "Akun tidak ditemukan" });
      }

      const user = rows[0];

      // 2. Cek Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.code(400).send({ error: "Kata sandi salah" });
      }

      // 3. Ambil data detail tambahan (No HP, dll) berdasarkan Role
      let detailData = {};
      if (user.role === "Adopter") {
        const [adopterRows] = await db.query(
          "SELECT * FROM adopter WHERE id_user = ?",
          [user.id_user]
        );
        if (adopterRows.length > 0) detailData = adopterRows[0];
      } else if (user.role === "Shelter") {
        const [shelterRows] = await db.query(
          "SELECT * FROM shelter WHERE id_user = ?",
          [user.id_user]
        );
        if (shelterRows.length > 0) detailData = shelterRows[0];
      }

      // 4. Buat Token
      const token = jwt.sign(
        {
          id_user: user.id_user,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      // 5. Response
      return reply.send({
        message: "Login berhasil",
        token,
        user: {
          id: user.id_user,
          username: user.username,
          name: user.nama,
          email: user.email,
          role: user.role,
          // Ambil phone dari tabel detail
          phone: user.role === "Shelter" ? detailData.no_wa : detailData.phone,
          foto: user.foto,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      return reply.code(500).send({ error: "Terjadi kesalahan pada server" });
    }
  },

  // ... (Verify Token tetap sama) ...
  async verifyToken(req, reply) {
    try {
      const header = req.headers.authorization;
      if (!header) return reply.code(401).send({ error: "Token tidak ada" });
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id_user, role, email }
      return { valid: true, decoded };
    } catch (error) {
      return reply.code(401).send({ error: "Token tidak valid" });
    }
  },
};

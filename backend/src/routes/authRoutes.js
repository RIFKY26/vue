// src/routes/authRoutes.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import verifyToken from "../middleware/verifyToken.js";

export default async function authRoutes(fastify) {
  // ===========================
  // 📌 SIGNUP
  // ===========================
  fastify.post("/auth/signup", async (req, reply) => {
    try {
      const { username, email, password, phone } = req.body;

      if (!username || !email || !password) {
        return reply.status(400).send({ message: "Data tidak lengkap" });
      }

      // cek sudah ada email / username
      const [exist1] = await pool.query(
        "SELECT * FROM user WHERE username = ? OR email = ?",
        [username, email]
      );

      if (exist1.length > 0) {
        return reply
          .status(400)
          .send({ message: "Username atau Email sudah digunakan" });
      }

      const hash = await bcrypt.hash(password, 10);

      // insert user
      const [userInsert] = await pool.query(
        "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, 'user')",
        [username, email, hash]
      );

      const newUserId = userInsert.insertId;

      // insert adopter terkait user baru
      await pool.query(
        "INSERT INTO adopter (id_user, id_lokasi, no_telepon, foto_profile) VALUES (?, NULL, ?, NULL)",
        [newUserId, phone || null]
      );

      return reply.send({
        message: "Registrasi berhasil",
        user_id: newUserId,
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Server error" });
    }
  });

  // ===========================
  // 📌 LOGIN
  // ===========================
  fastify.post("/auth/login", async (req, reply) => {
    try {
      const { username, password } = req.body;

      const [rows] = await pool.query("SELECT * FROM user WHERE username = ?", [
        username,
      ]);

      if (rows.length === 0) {
        return reply.status(400).send({ message: "Akun tidak ditemukan" });
      }

      const user = rows[0];

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return reply.status(400).send({ message: "Password salah" });
      }

      const token = jwt.sign(
        {
          id_user: user.id_user,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return reply.send({
        message: "Login berhasil",
        token,
        user: {
          id_user: user.id_user,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ message: "Server error" });
    }
  });

  // ===========================
  // 📌 GET CURRENT USER
  // ===========================
  fastify.get("/auth/me", { preHandler: verifyToken }, async (req, reply) => {
    return reply.send({ user: req.user });
  });
}

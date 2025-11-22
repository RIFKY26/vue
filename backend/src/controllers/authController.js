import db from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  // ======================
  //        SIGN UP
  // ======================
  async register(req, reply) {
    try {
      const { email, phone, name, password } = req.body;

      // cek email tidak duplikat
      const [existing] = await db.query(
        "SELECT * FROM adopter WHERE email = ?",
        [email]
      );

      if (existing.length > 0) {
        return reply.code(400).send({ error: "Email sudah digunakan" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // tambah user ke database
      const [result] = await db.query(
        `INSERT INTO adopter (name, email, phone, password) VALUES (?, ?, ?, ?)`,
        [name, email, phone, hashedPassword]
      );

      return reply.send({
        message: "Registrasi berhasil",
        userId: result.insertId,
      });
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // ======================
  //         LOGIN
  // ======================
  async login(req, reply) {
    try {
      const { email, password } = req.body;

      const [rows] = await db.query("SELECT * FROM adopter WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        return reply.code(400).send({ error: "Email tidak ditemukan" });
      }

      const user = rows[0];

      // cek password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reply.code(400).send({ error: "Kata sandi salah" });
      }

      // buat token
      const token = jwt.sign(
        { userId: user.adopter_id },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );

      return reply.send({
        message: "Login berhasil",
        token,
        user: {
          id: user.adopter_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // ======================
  //     VERIFY TOKEN
  // ======================
  async verifyToken(req, reply) {
    try {
      const header = req.headers.authorization;

      if (!header) {
        return reply.code(401).send({ error: "Token tidak ada" });
      }

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      return { valid: true, decoded };
    } catch (error) {
      return reply.code(401).send({ error: "Token tidak valid" });
    }
  },
};

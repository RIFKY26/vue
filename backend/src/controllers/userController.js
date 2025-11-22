import db from "../database/db.js";
import jwt from "jsonwebtoken";

export default {
  // GET semua user
  async getAllUsers(req, reply) {
    try {
      const [rows] = await db.query(
        "SELECT adopter_id, nama, email, phone FROM adopter"
      );
      return rows;
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // GET user by ID
  async getUserById(req, reply) {
    try {
      const { id } = req.params;
      const [rows] = await db.query(
        "SELECT adopter_id, name, email, phone FROM adopter WHERE adopter_id = ?",
        [id]
      );

      if (rows.length === 0) {
        return reply.code(404).send({ error: "User tidak ditemukan" });
      }

      return rows[0];
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // UPDATE user
  async updateUser(req, reply) {
    try {
      const { id } = req.params;
      const { name, phone } = req.body;

      await db.query(
        "UPDATE adopter SET name = ?, phone = ? WHERE adopter_id = ?",
        [name, phone, id]
      );

      return { message: "User berhasil diperbarui" };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // DELETE user
  async deleteUser(req, reply) {
    try {
      const { id } = req.params;

      await db.query("DELETE FROM adopter WHERE adopter_id = ?", [id]);
      return { message: "User berhasil dihapus" };
    } catch (error) {
      reply.code(500).send({ error: error.message });
    }
  },

  // GET PROFILE berdasarkan TOKEN
  async getProfile(req, reply) {
    try {
      const header = req.headers.authorization;
      if (!header) return reply.code(401).send({ error: "Token tidak ada" });

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await db.query(
        "SELECT adopter_id, name, email, phone FROM adopter WHERE adopter_id = ?",
        [decoded.userId]
      );

      return rows[0];
    } catch (error) {
      reply.code(401).send({ error: "Token tidak valid" });
    }
  },
};

import jwt from "jsonwebtoken";

export default async function verifyToken(req, reply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Menyimpan data user ke request object agar bisa dipakai di controller lain
    // Struktur decoded sesuai authController login: { id_user, role, email }
    req.user = decoded;
  } catch (err) {
    return reply
      .status(401)
      .send({ message: "Token invalid atau kedaluwarsa" });
  }
}

import jwt from "jsonwebtoken";

export default async function verifyToken(req, reply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
  } catch (err) {
    return reply.status(401).send({ message: "Token invalid" });
  }
}

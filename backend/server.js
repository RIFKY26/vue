// File: backend/server.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import dotenv from "dotenv";
import path from "path";
import fs from "fs"; // <--- WAJIB ADA: Untuk cek folder (existsSync)
import { fileURLToPath } from "url";

// Import Routes
// Pastikan file-file ini ada di folder src/routes/
import laporanRoutes from "./src/routes/laporanRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import donasiRoutes from "./src/routes/donasiRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
// import kucingRoutes from "./src/routes/kucingRoutes.js";
// import shelterRoutes from "./src/routes/shelterRoutes.js";
// import adopsiRoutes from "./src/routes/adopsiRoutes.js";

dotenv.config();

// Setup Path untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// ==========================================
// 1. REGISTER PLUGINS
// ==========================================

// CORS (Agar Frontend bisa akses backend)
await fastify.register(cors, {
  origin: true, // Atau ganti dengan domain frontend misal "http://localhost:5173"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // <--- PENTING: Izinkan DELETE
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// MULTIPART (Agar bisa upload file/foto)
await fastify.register(multipart, {
  attachFieldsToBody: true, // Penting: field teks masuk ke req.body
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas file 5MB
});

// STATIC FILES (Agar gambar bisa diakses lewat URL)
const publicPath = path.join(__dirname, "public");
const laporanImgPath = path.join(__dirname, "public/image/laporan");

// Cek dan buat folder jika belum ada (Mencegah error saat upload pertama kali)
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}
if (!fs.existsSync(laporanImgPath)) {
  fs.mkdirSync(laporanImgPath, { recursive: true });
}

// Register plugin static
await fastify.register(fastifyStatic, {
  root: publicPath,
  prefix: "/public/", // URL akses: http://localhost:3000/public/image/laporan/nama.jpg
});

// ==========================================
// 2. REGISTER ROUTES
// ==========================================

// Prefix /api untuk semua route
fastify.register(laporanRoutes, { prefix: "/api" });
fastify.register(authRoutes, { prefix: "/api" });
fastify.register(donasiRoutes, { prefix: "/api" });
fastify.register(userRoutes, { prefix: "/api" });

// Route lainnya (Uncomment jika file sudah siap)
// fastify.register(kucingRoutes, { prefix: "/api" });
// fastify.register(shelterRoutes, { prefix: "/api" });
// fastify.register(adopsiRoutes, { prefix: "/api" });

// Route Default untuk cek server
fastify.get("/", async (request, reply) => {
  return { hello: "Welcome to AdoptMeow API" };
});

// ==========================================
// 3. START SERVER
// ==========================================
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server berjalan di http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

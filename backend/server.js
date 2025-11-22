// File: backend/server.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import staticFiles from "@fastify/static"; // <--- PENTING
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import kucingRoutes from "./src/routes/kucingRoutes.js";
import shelterRoutes from "./src/routes/shelterRoutes.js";
import adopsiRoutes from "./src/routes/adopsiRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import laporanRoutes from "./src/routes/laporanRoutes.js";

dotenv.config();

// Setup Path untuk ES Modules (Wajib agar folder terbaca)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// 1. Register CORS (Agar Frontend Vue bisa akses)
await fastify.register(cors, {
  origin: true, // Atau "http://localhost:5173"
});

// 2. Register Multipart (Agar bisa upload file)
await fastify.register(multipart, {
  attachFieldsToBody: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB
});

// 3. Register Static (AGAR GAMBAR BISA DIBUKA DI BROWSER) <--- INI KUNCINYA
await fastify.register(staticFiles, {
  root: path.join(__dirname, "public"), // Folder fisik di komputer
  prefix: "/public/", // URL akses di browser
});

// 4. Register Routes
fastify.register(kucingRoutes, { prefix: "/api" });
fastify.register(shelterRoutes, { prefix: "/api" });
fastify.register(adopsiRoutes, { prefix: "/api" });
fastify.register(authRoutes, { prefix: "/api" });
fastify.register(laporanRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    console.log("Server berjalan...");
    console.log(`- API: http://localhost:3000/api`);
    console.log(`- Images: http://localhost:3000/public/image/adopsi/`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

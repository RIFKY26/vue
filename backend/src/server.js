
import Fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'
import fastifyMysql from "@fastify/mysql"

import kucingRoutes from './routes/kucingRoutes.js'
// import donasiRoutes from "./routes/donasiRoutes.js"
import peringkatRoutes from "./routes/peringkatRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import rawatKucingRoutes from './routes/rawatKucingRoutes.js';
// import shelterRoutes from './routes/shelterRoutes.js'
// import adopsiRoutes from './routes/adopsiRoutes.js'

dotenv.config()

const fastify = Fastify({ logger: true })

await fastify.register(cors, {
  origin: 'http://localhost:5173',
})

await fastify.register(fastifyMysql, {
  promise: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

// fastify.register(donasiRoutes, { prefix: "/api" })
fastify.register(kucingRoutes, { prefix: '/api' })
fastify.register(peringkatRoutes, { prefix: "/api" })
fastify.register(userRoutes, { prefix: "/api" });
fastify.register(rawatKucingRoutes, { prefix: '/api' })
// fastify.register(shelterRoutes, { prefix: '/api' })
// fastify.register(adopsiRoutes, { prefix: '/api' })

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT })
    console.log('Backend berjalan di http://localhost:' + process.env.PORT)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()

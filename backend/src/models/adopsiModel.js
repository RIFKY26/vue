import pool from '../config/database.js'

export const getAdopsiAll = async () => {
  const [rows] = await pool.query(`
    SELECT a.id_adopsi, a.headline, a.informasi, a.verifikasi, a.adopsi,
           k.foto AS foto_kucing, k.usia,
           jk.jenis_kucing,
           jg.jenis_kelamin
    FROM adopsi a
    LEFT JOIN kucing k ON a.kucing = k.id_kucing
    LEFT JOIN njenis_kucing jk ON k.id_jenis_kucing = jk.id_jenis_kucing
    LEFT JOIN jenis_kelamin jg ON k.id_jenis_kelamin = jg.id_jenis_kelamin
  `)
  return rows
}

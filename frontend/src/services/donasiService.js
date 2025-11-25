import api from './api' // Pastikan path ini benar

const ENDPOINT = '/donasi'

export default {
  getAll() {
    return api.get(ENDPOINT)
  },
  getById(id) {
    return api.get(`${ENDPOINT}/${id}`)
  },
  getMetodePembayaran() {
    return api.get(`${ENDPOINT}/metode`)
  },
  // Endpoint Bayar Baru
  bayar(data) {
    // data berisi: { id_donasi, nominal, id_metode, nama_donatur, pesan }
    return api.post(`${ENDPOINT}/bayar`, data)
  },
  // Admin CRUD (Opsional jika masih dipakai)
  create(formData) {
    return api.post(ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update(id, formData) {
    return api.put(`${ENDPOINT}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete(id) {
    return api.delete(`${ENDPOINT}/${id}`)
  },
}

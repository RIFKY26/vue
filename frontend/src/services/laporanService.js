import axios from 'axios'

// PERBAIKAN: Ubah akhiran '/laporan' menjadi '/lapor' sesuai routes di backend
const API_URL = 'http://localhost:3000/api/lapor'

export default {
  getAll() {
    return axios.get(API_URL)
  },
  getById(id) {
    return axios.get(`${API_URL}/${id}`)
  },
  create(data) {
    // Pastikan header multipart ada
    return axios.post(API_URL, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete(id) {
    return axios.delete(`${API_URL}/${id}`)
  },
}

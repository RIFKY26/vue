<template>
  <main>
    <!-- HEADER -->
    <div class="main-header">
      <h1>Lapor</h1>
      <span class="breadcrumb">LAPOR / DAFTAR LAPORAN</span>
    </div>

    <div class="lapor-controls">
      <router-link to="/form-lapor" class="btn btn-primary">
        <i class="fa-solid fa-plus"></i>
        Laporkan
      </router-link>

      <div class="search-bar">
        <i class="fa-solid fa-search"></i>
        <input type="text" v-model="searchQuery" placeholder="Cari kucing sesuai keinginan..." />
      </div>

    </div>

    <!-- GRID LAPORAN -->
    <section class="report-grid">
      <div v-for="lapor in laporanList" :key="lapor.id" class="report-card">
        <img
          :src="getImageUrl(lapor.foto_lapor)"
          :alt="lapor.headline"
          class="card-img"
          @error="$event.target.src = 'https://placehold.co/600x400?text=Error+Loading'"
        />
        <div class="report-card-content">
          <div class="report-card-header">
            <h2>{{ lapor.headline }}</h2>
            <span>• {{ lapor.timeAgo }}</span>
          </div>

          <div class="lokasi-info">
            <span>
              <i class="fa-solid fa-map-marker-alt"></i> {{ lapor.lokasi }}
            </span>
          </div>

          <div class="cat-info">
            <span>
              <i :class="lapor.gender === 'Betina' ? 'fa-solid fa-venus' : 'fa-solid fa-mars'"></i>
              {{ lapor.gender }}
            </span>
            <span><i class="fa-solid fa-paw"></i> {{ lapor.ras }}</span>
            <span><i class="fa-solid fa-kit-medical"></i> {{ lapor.kondisi }}</span>
          </div>

          <p>{{ lapor.deskripsi }}</p>

          <div class="card-actions">
            <button class="btn btn-warning" @click="openModal(lapor)">Lihat Detail</button>
            <button v-if="lapor.status === 'Diselamatkan'" class="btn btn-info" disabled>
              <i class="fa-solid fa-check"></i>
              <span>Sudah Diselamatkan</span>
            </button>
            <button v-else class="btn btn-pending" disabled>
              <i class="fa-solid fa-clock"></i>
              <span>Menunggu Tindakan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- MODAL DETAIL / EDIT -->
  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Laporan' : 'Detail Laporan' }}</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <!-- MODE DETAIL -->
        <div v-if="!isEditing">
          <div class="modal-content-grid">
            <img
              :src="getImageUrl(laporan.foto_lapor)"

              alt="Foto Kucing"
              class="modal-image"
            />
            <div class="modal-info">
              <div class="info-field">
                <label>Kondisi</label>
                <span>{{ laporan.kondisi }}</span>
              </div>
              <div class="info-field">
                <label>Jenis Kelamin</label>
                <span>{{ laporan.gender }}</span>
              </div>
              <div class="info-field">
                <label>Ras Kucing</label>
                <span>{{ laporan.ras }}</span>
              </div>
            </div>
          </div>

           <div class="modal-section">
            <h4>Lokasi</h4>
            <p>{{ laporan.lokasi }}</p>
          </div>

          <div class="modal-section">
            <h4>Deskripsi</h4>
            <p>{{ laporan.deskripsi }}</p>
          </div>

          <div class="modal-section">
            <h4>Status</h4>
            <span
              class="status-badge"
              :class="{
                rescued: laporan.status === 'Diselamatkan',
                pending: laporan.status === 'Menunggu Tindakan',
              }"
            >
              {{ laporan.status }}
            </span>

            <template v-if="laporan.status === 'Diselamatkan' && laporan.shelter">
              <p class="rescued-by">Diselamatkan oleh:</p>
              <div class="shelter-info">
                <div class="icon"><i class="fa-solid fa-building"></i></div>
                <span>{{ laporan.shelter }}</span>
              </div>
            </template>
          </div>
        </div>

        <!-- MODE EDIT -->
        <form v-else @submit.prevent="saveEdit">
          <div class="form-group">
            <label>Kondisi</label>
            <input v-model="laporan.kondisi" type="text" required />
          </div>

          <div class="form-group">
            <label>Jenis Kelamin</label>
            <select v-model="laporan.gender">
              <option>Jantan</option>
              <option>Betina</option>
            </select>
          </div>

          <div class="form-group">
            <label>Ras Kucing</label>
            <input v-model="laporan.ras" type="text" required />
          </div>

          <div class="form-group">
            <label>Lokasi</label>
            <input v-model="laporan.lokasi" type="text" placeholder="Lokasi Penemuan (otomatis)" readonly required />
          </div>

          <MapPicker @update:location="setLocation" />

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="laporan.deskripsi" rows="3"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="toggleEditMode">Batal</button>
            <button type="submit" class="btn btn-warning">Simpan</button>
          </div>
        </form>
      </div>

      <div v-if="!isEditing" class="modal-footer">
        <button class="btn btn-secondary" @click="deleteReport">Hapus</button>
        <button class="btn btn-primary" @click="toggleEditMode">Ubah</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import MapPicker from "@/components/MapPicker.vue";

// --- STATE ---
const laporanList = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");

const isModalOpen = ref(false);
const isEditing = ref(false);
const laporan = ref({});

// --- KONFIGURASI URL GAMBAR ---
// Sesuaikan port dengan backend Anda (biasanya 3000)
const SERVER_URL = 'http://localhost:3000';

const getImageUrl = (filename) => {
  // 1. Cek jika filename kosong/null/undefined
  if (!filename) return 'https://placehold.co/600x400?text=No+Image';

  // 2. Cek jika filename sudah URL lengkap (misal: https://imgur.com/...)
  if (filename.startsWith('http')) return filename;

  // 3. Gabungkan dengan endpoint static backend
  // Backend (server.js) melayani folder 'public' di prefix '/public/'
  // Contoh hasil: http://localhost:3000/public/image/laporan/lapor-12345.jpg
  return `${SERVER_URL}/public/image/laporan/${filename}`;
};

// --- FETCH DATA ---
const fetchLaporan = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/lapor');

    // Backend Controller sebelumnya mengembalikan properti 'image'
    // Jika di DB Anda kolomnya 'foto', pastikan Controller mappingnya benar.
    laporanList.value = response.data;

    console.log("Data berhasil dimuat:", laporanList.value);
  } catch (error) {
    console.error("Gagal mengambil data:", error);
    // alert("Gagal memuat data."); // Optional: dimatikan agar tidak mengganggu dev
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLaporan();
});

// --- MODAL & FORM HANDLERS ---
function openModal(item = null) {
  if (item) {
    laporan.value = { ...item };
    isEditing.value = false;
  } else {
    laporan.value = {};
    isEditing.value = true;
  }
  isModalOpen.value = true;
}

function toggleEditMode() {
  isEditing.value = !isEditing.value;
}

function setLocation(data) {
  laporan.value.lokasi = data.alamat;
}


async function saveEdit() {
    // KODE INI PERLU DIPERHATIKAN:
    // Jika Anda ingin mengupload file saat EDIT, Anda tidak bisa mengirim JSON (laporan.value).
    // Anda harus menggunakan FormData seperti saat Create.
    // Jika hanya edit teks, JSON tidak masalah (karena controller saya update logicnya menangani 'parts.foto' undefined).

    // Namun untuk konsistensi, sebaiknya gunakan logic FormData di sini jika form edit Anda support file upload.
    try {
        if (laporan.value.id) {
            // Logic Update
            await api.put(`/lapor/${laporan.value.id}`, laporan.value);
            alert("Perubahan berhasil disimpan!");
        } else {
            // Logic Create (Ini biasanya sudah pakai FormData di file original Anda)
            // Pastikan komponen ini mengirim data yang benar.
             await api.post('/lapor', laporan.value);
             alert("Laporan berhasil dibuat!");
        }
        isModalOpen.value = false;
        fetchLaporan();
    } catch (error) {
        console.error("Gagal menyimpan:", error);
        alert("Gagal menyimpan perubahan.");
    }
}

function closeModal() {
  isModalOpen.value = false;
}
// src/views/LaporView.vue (Di dalam script setup)
// src/views/LaporView.vue

async function deleteReport() {
    // 1. Cek ID
    if (!laporan.value || !laporan.value.id) {
        alert("Error Internal: ID Laporan tidak terbaca (undefined).");
        return;
    }

    // 2. Konfirmasi
    if (!confirm(`Yakin ingin menghapus laporan "${laporan.value.headline}"?`)) {
        return;
    }

    try {
        // 3. Request Delete
        await api.delete(`/lapor/${laporan.value.id}`);

        alert("Berhasil: Data telah dihapus.");
        closeModal();
        fetchLaporan(); // Refresh data

    } catch (error) {
        console.error("Detail Error Delete:", error);

        // 4. Deteksi Pesan Error (Lebih Lengkap)
        // Cek 'msg' (custom kita), 'message' (default Fastify), atau error browser
        const serverMsg = error.response?.data?.msg;
        const serverMessage = error.response?.data?.message;
        const networkError = error.message;

        // Tampilkan pesan yang ketemu
        const finalMessage = serverMsg || serverMessage || networkError || "Gagal menghapus (Unknown Error)";

        alert(`Gagal Hapus: ${finalMessage}`);
    }
}
</script>

<style scoped>
/* Ensure Font Awesome is loaded */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

@import '@/assets/detail-modal.css';

/* Import lapor.css untuk styling dasar */

/* Font Family - Sama dengan aplikasi */
.lapor-controls,
.report-grid,
.report-card,
.report-card *,
.modal-content,
.modal-content * {
  font-family: 'Poppins', sans-serif;
}

/* Lapor Controls */
.lapor-controls {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 25px;
  gap: 15px;
}

.btn-primary {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: var(--blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Report Grid */
.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

/* Report Card */
.report-card {
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.12);
}

.report-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.report-card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.report-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 10px;
}

.report-card-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  flex-grow: 1;
  font-family: 'Poppins', sans-serif;
}

.report-card-header span {
  font-size: 13px;
  color: var(--text-light);
  white-space: nowrap;
  font-family: 'Poppins', sans-serif;
}

.lokasi-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.cat-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.cat-info span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--blue-light);
  color: var(--secondary-color);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
}

.cat-info i {
  color: var(--secondary-color) !important;
  font-size: 12px !important;
  display: inline-block !important;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  font-style: normal !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  vertical-align: middle !important;
  width: 14px !important;
  text-align: center !important;
  line-height: 1 !important;
}

/* Ensure icons are visible with :deep() */
:deep(.cat-info i.fa-venus),
:deep(.cat-info i.fa-paw),
:deep(.cat-info i.fa-kit-medical),
:deep(.cat-info i.fa-mars) {
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: var(--secondary-color) !important;
}

.report-card-content p {
  font-size: 14px;
  color: var(--text-dark);
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
  font-family: 'Poppins', sans-serif;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.btn-warning {
  background-color: var(--yellow-color);
  color: var(--text-dark);
}

.btn-warning:hover {
  opacity: 0.9;
}

.btn-info {
  background-color: var(--secondary-color);
  color: white;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-info i {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  font-size: 14px !important;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  width: auto !important;
  height: auto !important;
  line-height: 1 !important;
  color: white !important;
}

.btn-info span {
  display: inline-flex;
  align-items: center;
}

.btn-pending {
  background-color: #f59e0b;
  color: white;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-pending i {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  font-size: 14px !important;
  font-family: 'Font Awesome 6 Free' !important;
  font-weight: 900 !important;
  width: auto !important;
  height: auto !important;
  line-height: 1 !important;
  color: white !important;
}

.btn-pending span {
  display: inline-flex;
  align-items: center;
}

.btn-secondary {
  background-color: var(--bg-light);
  color: var(--text-dark);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

/* Form Styles */
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  font-size: 14px;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  background-color: var(--white);
  color: var(--text-dark);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Status Badge */
.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  color: white;
  margin-top: 10px;
}

.status-badge.rescued {
  background-color: var(--secondary-color);
}

.status-badge.pending {
  background-color: #f59e0b;
}

/* Responsive */
@media (max-width: 768px) {
  .lapor-controls {
    justify-content: stretch;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .report-grid {
    grid-template-columns: 1fr;
  }

  .report-card img {
    height: 200px;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

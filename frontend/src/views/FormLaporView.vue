<template>
  <main>
    <div class="main-header">
      <h1>Pengisian Laporan</h1>
      <span class="breadcrumb">LAPOR / FORM LAPORAN</span>
    </div>

    <div class="form-grid">
      <div class="form-section">
        <div class="upload-box">
          <h2>Pilih Foto</h2>

          <div
            class="upload-zone"
            :class="{ 'has-image': selectedImage }"
            @click="selectImage"
          >
            <div v-if="!selectedImage" class="upload-content">
              <div class="upload-icon">
                <i class="fa-solid fa-image"></i>
              </div>
              <button class="btn btn-warning" type="button">Pilih Gambar</button>
              <p>Atau</p>
              <button class="btn btn-secondary" type="button">Ambil Foto</button>
            </div>

            <div v-else class="preview-container">
              <img :src="selectedImage" class="preview-image" />
              <button class="btn-remove-image" type="button" @click.stop="removeImage">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            hidden
            @change="handleFileUpload"
          />
          <p v-if="errors.foto" style="color: red; font-size: 12px; margin-top: 5px;">
            * {{ errors.foto }}
          </p>
        </div>
      </div>

      <div class="form-section">
        <div class="info-box">
          <h2>Informasi Kucing</h2>

          <form @submit.prevent="submitForm">

            <div class="input-group">
              <i class="fa-solid fa-heading icon"></i>
              <input v-model="form.headline" type="text" placeholder="Judul Laporan (Cth: Kucing Luka di Jalan)" required />
            </div>

            <div class="input-group">
              <i class="fa-solid fa-heart-pulse icon"></i>
              <input v-model="form.kondisi_text" type="text" placeholder="Kondisi (Cth: Luka, Sakit)" required />
            </div>

            <div class="input-group">
              <i class="fa-solid fa-venus-mars icon"></i>
              <select v-model="form.id_jenis_kelamin" required>
                <option disabled value="">Pilih Jenis Kelamin</option>
                <option value="1">Jantan</option>
                <option value="2">Betina</option>
              </select>
            </div>

            <div class="input-group">
              <i class="fa-solid fa-cat icon"></i>
              <input v-model="form.ras_text" type="text" placeholder="Ras Kucing (Opsional)" />
            </div>

            <div class="input-group">
              <i class="fa-solid fa-calendar-day icon"></i>
              <input v-model="form.usia" type="text" placeholder="Perkiraan Usia (Cth: 3 Bulan)" />
            </div>

            <div class="input-group">
              <i class="fa-solid fa-map-marker-alt icon"></i>
              <input v-model="form.lokasi" type="text" placeholder="Lokasi Penemuan (Pilih di Peta)" readonly required />
            </div>

            <MapPicker @update:location="setLocation" />

            <div class="input-group textarea-group">
              <i class="fa-solid fa-align-left icon"></i>
              <textarea v-model="form.deskripsi" placeholder="Deskripsi lengkap kejadian..." rows="4" required></textarea>
            </div>

            <button class="btn btn-submit" :disabled="isLoading">
              <i v-if="!isLoading" class="fa-solid fa-paper-plane"></i>
              <span v-else>Mengirim...</span>
              {{ isLoading ? '' : 'Laporkan' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api"; // Import Axios instance
import MapPicker from "@/components/MapPicker.vue";

const router = useRouter();
const isLoading = ref(false);
const errors = ref({});

// State untuk Form Data
const form = ref({
  headline: "",
  id_jenis_kelamin: "", // Menggunakan ID
  kondisi_text: "",     // Nanti dikonversi / dikirim
  ras_text: "",
  usia: "",
  lokasi: "",
  deskripsi: ""
});

// State untuk File Gambar
const selectedImage = ref(null); // Untuk preview URL
const fileObject = ref(null);    // Untuk data File asli yang dikirim ke API
const fileInput = ref(null);

// --- Logic Gambar ---
function selectImage() {
  fileInput.value?.click();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    // Simpan file asli untuk dikirim ke server
    fileObject.value = file;
    // Buat URL lokal untuk preview
    selectedImage.value = URL.createObjectURL(file);
    errors.value.foto = ""; // Hapus error jika ada
  }
}

function removeImage() {
  selectedImage.value = null;
  fileObject.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

// --- Logic Lokasi ---
function setLocation(data) {
  form.value.lokasi = data.alamat;
  // Jika backend butuh lat/lng terpisah, simpan juga disini
}

// --- Logic Submit ---
async function submitForm() {
  // 1. Validasi sederhana
  if (!fileObject.value) {
    errors.value.foto = "Wajib menyertakan foto bukti laporan.";
    alert("Harap upload foto!");
    return;
  }

  isLoading.value = true;

  try {
    // 2. Gunakan FormData untuk kirim File + Text
    const formData = new FormData();

    // Append Text Fields
    formData.append("headline", form.value.headline);
    formData.append("lokasi", form.value.lokasi);
    formData.append("deskripsi", form.value.deskripsi);
    formData.append("usia", form.value.usia || "Tidak diketahui");

    // Kirim ID (Sesuaikan logika ini dengan ID di database Anda)
    // Default ke 1 jika kosong untuk menghindari error FK database
    formData.append("id_jenis_kelamin", form.value.id_jenis_kelamin || 1);
    formData.append("id_jenis_kucing", 1);   // Hardcode ID 1 (Lainnya) dulu karena inputnya text
    formData.append("id_kondisi_kucing", 1); // Hardcode ID 1 (Lainnya) dulu

    // Append File
    formData.append("foto", fileObject.value);

    // 3. Kirim ke Backend
    // Header 'Content-Type': 'multipart/form-data' biasanya otomatis diatur oleh Axios saat mendeteksi FormData
    const response = await api.post("/lapor", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Sukses:", response.data);
    alert("Laporan berhasil dikirim!");

    // Redirect ke halaman list laporan
    router.push("/lapor");

  } catch (error) {
    console.error("Gagal mengirim laporan:", error);
    alert("Terjadi kesalahan saat mengirim laporan. Cek console untuk detail.");
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Style sama seperti sebelumnya */
/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 25px;
  margin-top: 20px;
  align-items: start;
}

/* Form Section */
.form-section {
  display: flex;
  flex-direction: column;
}

/* Upload Box */
.upload-box {
  background-color: var(--white);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.upload-box h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 280px;
  background-color: var(--bg-light);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-zone:hover {
  background-color: var(--blue-light);
  border-color: var(--secondary-color);
}

.upload-zone.has-image {
  padding: 0;
  border-style: solid;
  border-color: var(--secondary-color);
  background-color: var(--white);
  min-height: auto;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.upload-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--yellow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--text-dark);
  margin-bottom: 10px;
}

.upload-zone .btn {
  pointer-events: none;
  min-width: 180px;
  padding: 10px 15px;
  font-size: 13px;
}

.upload-zone p {
  font-size: 14px;
  color: var(--text-light);
  margin: 10px 0;
  font-weight: 500;
}

/* Preview Container */
.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.btn-remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  z-index: 10;
}

.btn-remove-image:hover {
  background-color: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

/* Info Box */
.info-box {
  background-color: var(--white);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.info-box h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--secondary-color);
  display: inline-block;
}

/* Input Group */
.input-group {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  background-color: var(--white);
  transition: all 0.2s ease;
  min-height: 48px;
}

.input-group:focus-within {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px var(--blue-light);
}

.input-group .icon {
  padding: 0;
  background-color: var(--bg-light);
  border-right: 1px solid var(--border-color);
  font-size: 16px;
  color: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  width: 50px;
  flex-shrink: 0;
  height: auto;
  align-self: stretch;
}

.input-group input,
.input-group select,
.input-group textarea {
  border: none;
  flex-grow: 1;
  padding: 12px 15px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: var(--text-dark);
  background: transparent;
  width: 100%;
  min-height: 48px;
  line-height: 1.5;
}

.input-group select {
  cursor: pointer;
}

.textarea-group {
  align-items: stretch;
}

.textarea-group .icon {
  align-items: flex-start;
  padding-top: 15px;
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: var(--yellow-color);
  color: var(--text-dark);
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.btn-submit:hover {
  background-color: #fbbf24;
}

.btn-submit:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <main>
    <div class="main-header">
      <h1>Pengisian Laporan</h1>
      <span class="breadcrumb">LAPOR / FORM LAPORAN</span>
    </div>

    <div class="form-grid">
      <!-- Upload Foto -->
      <div class="form-section">
        <div class="upload-box">
          <h2>Pilih Foto</h2>
          
          <!-- Upload Zone -->
          <div 
            class="upload-zone" 
            :class="{ 'has-image': selectedImage, 'dragover': isDragging }"
            @click="selectImage"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <div v-if="!selectedImage" class="upload-content">
            <div class="upload-icon">
              <i class="fa-solid fa-image"></i>
            </div>
              <button type="button" class="btn btn-warning">Pilih Gambar atau Taruh di Sini</button>
            <p>Atau</p>
              <button type="button" class="btn btn-secondary" @click.stop="takePhoto">Ambil Foto</button>
            </div>
            
            <div v-else class="preview-container">
              <img :src="selectedImage" alt="Preview Foto" class="preview-image" />
              <button 
                type="button" 
                class="btn-remove-image" 
                @click.stop="removeImage"
                title="Hapus Foto"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Input file tersembunyi -->
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            hidden
          />
        </div>
      </div>

      <!-- Form Informasi -->
      <div class="form-section">
        <div class="info-box">
          <h2>Informasi</h2>
          <h3>JELASKAN INFORMASI MENGENAI KUCING INI</h3>

          <form @submit.prevent="submitForm">
            <div class="input-group">
              <span class="icon"><i class="fa-solid fa-heart-pulse"></i></span>
              <input 
                v-model="form.kondisi" 
                type="text" 
                placeholder="Kondisi Kucing Saat Ini" 
                required 
              />
            </div>

            <div class="input-group">
              <span class="icon"><i class="fa-solid fa-venus-mars"></i></span>
              <select v-model="form.kelamin" required>
                <option value="" disabled selected>Jenis Kelamin Kucing</option>
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>

            <div class="input-group">
              <span class="icon"><i class="fa-solid fa-cat"></i></span>
              <input 
                v-model="form.ras" 
                type="text" 
                placeholder="Ras Kucing" 
              />
            </div>

            <div class="input-group">
              <span class="icon"><i class="fa-solid fa-calendar-day"></i></span>
              <input
                v-model="form.tanggal"
                type="datetime-local"
                required
              />
            </div>

            <div class="input-group">
              <span class="icon"><i class="fa-solid fa-map-marker-alt"></i></span>
              <input 
                v-model="form.lokasi" 
                type="text" 
                placeholder="Lokasi Penemuan" 
                required 
              />
            </div>

            <div class="input-group textarea-group">
              <span class="icon"><i class="fa-solid fa-align-left"></i></span>
              <textarea
                v-model="form.deskripsi"
                rows="4"
                placeholder="Deskripsi Singkat (contoh: kondisi kucing, lokasi tepat, dll)"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-submit">
              <i class="fa-solid fa-paper-plane"></i>
              Laporkan
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  kondisi: '',
  kelamin: '',
  ras: '',
  tanggal: '',
  lokasi: '',
  deskripsi: ''
})

const selectedImage = ref(null)
const fileInput = ref(null)
const isDragging = ref(false)

function selectImage() {
  fileInput.value?.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.type.startsWith('image/')) {
      selectedImage.value = URL.createObjectURL(file)
    } else {
      alert('File harus berupa gambar!')
    }
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = URL.createObjectURL(file)
  } else {
    alert('File harus berupa gambar!')
  }
}

function removeImage() {
  if (selectedImage.value) {
    URL.revokeObjectURL(selectedImage.value)
    selectedImage.value = null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function takePhoto() {
  // Untuk production, bisa menggunakan camera API
  alert('Fitur kamera akan segera tersedia!')
  // Bisa juga trigger file input dengan capture="camera"
}

function submitForm() {
  if (!selectedImage.value) {
    alert('Harap upload foto terlebih dahulu!')
    return
  }
  
  console.log('Laporan dikirim:', {
    ...form.value,
    image: selectedImage.value
  })
  
  alert('Laporan berhasil dikirim!')
  // Redirect ke halaman lapor setelah submit
  router.push('/lapor')
}
</script>

<style scoped>
/* Import form-lapor.css untuk styling dasar (jika ada) */

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

.upload-zone.dragover {
  background-color: var(--blue-light);
  border-color: var(--secondary-color);
  border-style: solid;
  transform: scale(1.02);
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

.info-box h3 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 15px;
  margin-bottom: 20px;
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

.input-group input,
.input-group select {
  height: 100%;
  display: block;
}

.input-group textarea {
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 1.6;
  min-height: 90px;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: var(--text-light);
}

.input-group select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23878C92' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 35px;
}

.input-group select:invalid {
  color: var(--text-light);
}

.input-group select:valid {
  color: var(--text-dark);
}

.textarea-group {
  align-items: stretch;
}

.textarea-group .icon {
  align-items: flex-start;
  padding-top: 15px;
  height: auto;
}

.textarea-group textarea {
  resize: vertical;
  min-height: 90px;
  padding-top: 12px;
  padding-bottom: 12px;
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
  background-color: #FBBF24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .upload-zone {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .info-box {
    padding: 20px;
  }

  .info-box h2 {
    font-size: 16px;
  }

  .info-box h3 {
    font-size: 11px;
  }

  .upload-box {
    padding: 20px;
  }

  .upload-zone {
    min-height: 220px;
    padding: 25px 15px;
  }

  .upload-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .input-group {
    flex-direction: row;
  }

  .input-group .icon {
    border-right: 1px solid var(--border-color);
    border-bottom: none;
    min-width: 45px;
    width: 45px;
  }
}

@media (max-width: 480px) {
  .upload-zone .btn {
    min-width: auto;
    width: 100%;
    padding: 10px;
    font-size: 12px;
  }

  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .input-group .icon {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
    justify-content: center;
    padding: 10px;
    min-width: 100%;
  }

  .input-group input,
  .input-group select,
  .input-group textarea {
    padding: 12px;
  }
}
</style>


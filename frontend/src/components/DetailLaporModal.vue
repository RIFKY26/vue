<template>
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Detail Laporan</h3>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>

      <div class="modal-body">
        <div class="modal-content-grid">
          <img
            src="https://i.imgur.com/5D63UyY.jpg"
            alt="White Cat"
            class="modal-image"
          />

          <div class="modal-info">
            <div class="info-field">
              <label>Kondisi</label>
              <span>Sehat</span>
            </div>
            <div class="info-field">
              <label>Jenis Kelamin</label>
              <span>Betina</span>
            </div>
            <div class="info-field">
              <label>Ras Kucing</label>
              <span>Harga</span>
            </div>
          </div>
        </div>

        <div class="modal-section">
          <h4>Deskripsi</h4>
          <p>
            Ditemukan kucing telantar di sekitar taman, terlihat kurus dan butuh pertolongan.
          </p>
        </div>

        <div class="modal-section">
          <h4>Status</h4>
          <span class="status-badge rescued">Diselamatkan</span>
          <p class="rescued-by">Diselamatkan oleh:</p>
          <div class="shelter-info">
            <div class="icon"><i class="fa-solid fa-shield-cat"></i></div>
            <span>Nama Shelter</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary">Hapus</button>
        <button class="btn">Ubah</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 1. Tentukan data apa saja yang diterima komponen ini dari parent
defineProps({
  isVisible: Boolean,
  laporan: Object // Menerima satu objek 'laporan'
})

// 2. Tentukan event apa saja yang bisa dikirim komponen ini ke parent
defineEmits(['close'])
</script>

<style scoped>
/* 'scoped' berarti style ini HANYA berlaku untuk komponen ini.
  CSS dari file lain tidak akan merusaknya, dan CSS ini
  tidak akan merusak komponen lain.
*/
@import '@/assets/detail-modal.css';
</style>
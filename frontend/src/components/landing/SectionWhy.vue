<script setup>
import kucing1 from '@/assets/images/landing/kucing1.png'
import kucing2 from '@/assets/images/landing/kucing2.png'
import kucing3 from '@/assets/images/landing/kucing3.png'
</script>

<template>
  <section class="why-adoptmeow-section" id="tentang-kami">
    <div class="container why-adoptmeow-content">
      <h2 class="section-heading-white">Mengapa AdoptMeow?</h2>
      <p class="section-subtext-white">
        Di Luar Sana, Masih Banyak Kucing Terlantar yang Butuh Rumah Penuh Kasih. AdoptMeow Hadir Sebagai Jembatan Digital yang Menghubungkan Mereka Kepada Calon Sahabat Baru.
      </p>

      <div class="reason-grid">
        <div class="reason-card">
          <img :src="kucing1" alt="Kucing terlantar" />
          <h4>Laporan Kucing Terlantar</h4>
          <p>Temukan Kucing di Jalanan? Ambil Foto dan Laporkan Ke Komunitas dan Relawan Bisa Segera Membantu.</p>
        </div>
        <div class="reason-card">
          <img :src="kucing2" alt="Kucing adopsi" />
          <h4>Adopsi Dengan Hati</h4>
          <p>Jelajahi Daftar Kucing yang Siap Adopsi. Pilih yang Sesuai dengan Kondisi Kucing. Hingga Adopsi Selesai.</p>
        </div>
        <div class="reason-card">
          <img :src="kucing3" alt="Komunitas kucing" />
          <h4>Bangun Komunitas Kucing</h4>
          <p>Bergabung dengan Orang-Orang yang Punya Misi yang Sama. Setiap Laporan dan Adopsi Berdampak Baik yang Berarti Besar.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>


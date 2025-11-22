<template>
  <main>
    <div class="main-header">
      <h1>Donasi</h1>
      <span class="breadcrumb">DONASI / DETAIL DONASI</span>
    </div>

    <div v-if="!campaign" class="donation-detail-wrapper">
      <h2>Program Donasi Tidak Ditemukan</h2>
      <p>Mungkin link salah atau program sudah berakhir.</p>
    </div>

    <div v-else class="donation-detail-wrapper">
      <div class="donation-detail-card">
        <img :src="campaign.image" alt="Gambar kampanye donasi" />
        <div class="donation-detail-body">
          <h2>{{ campaign.title }}</h2>
          <div class="shelter-info">
            <img :src="campaign.shelter.avatar" alt="Avatar Shelter" class="shelter-logo" />
            <div class="shelter-details">
              <span class="shelter-name">{{ campaign.shelter.name }}</span>
              <span class="shelter-location">
                <i class="fa-solid fa-map-marker-alt"></i>
                {{ campaign.shelter.location }}
              </span>
            </div>
          </div>
          <p>{{ campaign.description }}</p>

          <div class="donation-progress">
            <div class="progress-text">
              <span
                >Terkumpul <strong>{{ campaign.terkumpulFormatted }}</strong> dari
                <strong>{{ campaign.targetFormatted }}</strong></span
              >
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: campaign.progress + '%' }"></div>
            </div>
          </div>

          <RouterLink :to="'/pembayaran/' + campaign.id" class="btn-donate"> Berdonasi </RouterLink>
        </div>
      </div>

      <div class="donor-list">
        <h3>Informasi Donatur Dana</h3>
        <div id="donor-list-container">
          <div v-for="donor in campaign.donors" :key="donor.name" class="donor-item">
            <img :src="donor.avatar" alt="Avatar Donatur" />
            <div class="donor-info">
              <div>
                <span class="name">{{ donor.name }}</span>
                <span class="time">{{ donor.time }}</span>
              </div>
              <p class="donation-text">
                Berdonasi sebesar <strong>{{ formatRupiah(donor.amount) }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
// useRoute digunakan untuk membaca URL
// RouterLink digunakan di dalam <template>
import { useRoute, RouterLink } from 'vue-router'

// --- FUNGSI BANTUAN ---
const formatRupiah = (number) => {
  return 'Rp. ' + new Intl.NumberFormat('id-ID').format(number)
}

// --- DATABASE SIMULASI (SESUAI PATH GAMBARMU) ---
const donationDatabase = ref({
  'pakan-kucing': {
    id: 'pakan-kucing',
    title: 'Bantu Pakan & Perawatan Kucing Jalanan',
    // Path dari folder 'public'
    image: '/image/donasi/Rectangle 23853 (1).png',
    shelter: {
      name: 'Rumah Kucing Bahagia',
      location: 'Jakarta Utara',
      avatar: '/image/donasi/image.png',
    },
    description:
      'Masih banyak kucing jalanan yang kelaparan dan tidak mendapatkan tempat aman. Melalui donasi ini, kamu bisa membantu menyediakan pakan, vaksinasi, serta biaya perawatan agar mereka bisa hidup lebih sehat dan berpeluang untuk diadopsi.',
    terkumpul: 200000,
    target: 200000,
    donors: [
      {
        name: 'Ramadhan',
        avatar: '/image/peringkat/laufey.png',
        time: '12 menit yang lalu',
        amount: 100000,
      },
      {
        name: 'Anonim',
        avatar: '/image/peringkat/yungkai.png',
        time: '15 menit yang lalu',
        amount: 50000,
      },
      {
        name: 'Budi',
        avatar: '/image/peringkat/shaqonel.png',
        time: '20 menit yang lalu',
        amount: 50000,
      },
    ],
  },
  'rawat-kucing': {
    id: 'rawat-kucing',
    title: 'Rawat Kucing Sakit Terlantar',
    // Path dari folder 'public'
    image: '/image/donasi/Rectangle 23853.png',
    shelter: {
      name: 'Meow Shelter',
      location: 'Jakarta',
      avatar: '/image/donasi/image.png',
    },
    description: 'Banyak kucing sakit yang kami temukan... Selengkapnya...',
    terkumpul: 4800000,
    target: 5000000,
    donors: [
      {
        name: 'Siti',
        avatar: 'https://i.imgur.com/5D63UyY.jpg',
        time: '5 menit yang lalu',
        amount: 200000,
      },
    ],
  },
})

// --- LOGIKA UTAMA ---
const route = useRoute() // 1. Ambil informasi rute saat ini
const campaignId = route.params.id // 2. Ambil ':id' dari URL (cth: "pakan-kucing")

// 3. 'computed' property akan mencari donasi yang benar
const campaign = computed(() => {
  const data = donationDatabase.value[campaignId]
  if (!data) return null // Jika ID tidak ditemukan

  // 4. Hitung data tambahan (progress bar, format rupiah)
  return {
    ...data,
    progress: (data.terkumpul / data.target) * 100,
    terkumpulFormatted: formatRupiah(data.terkumpul),
    targetFormatted: formatRupiah(data.target),
  }
})
</script>

<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>

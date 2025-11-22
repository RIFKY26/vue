<template>
  <main>
    <div class="main-header">
      <h1>Donasi</h1>
      <span class="breadcrumb">DONASI / DONASI</span>
    </div>

    <div class="donation-search-bar">
      <i class="fa-solid fa-search"></i>
      <input type="text" v-model="searchQuery" placeholder="Cari program donasi...">
    </div>

    <div class="donation-grid">
      <div v-for="program in filteredDonationData" :key="program.id" class="donation-card">
        <img :src="program.image" :alt="program.title">
        <div class="donation-card-body">
          <h3>{{ program.title }}</h3>
          <div class="shelter-info">
            <img :src="program.shelter.avatar" alt="Shelter avatar" class="shelter-logo">
            <div class="shelter-details">
              <span class="shelter-name">{{ program.shelter.name }}</span>
              <span class="shelter-location">
                <i class="fa-solid fa-map-marker-alt"></i>
                {{ program.shelter.location }}
              </span>
            </div>
          </div>
          <p>{{ program.description }}</p>

          <div class="donation-progress">
            <div class="progress-text">
              <span>Terkumpul <strong>{{ program.terkumpulFormatted }}</strong> dari <strong>{{ program.targetFormatted }}</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: program.progress + '%' }"></div>
            </div>
          </div>

          <RouterLink :to="'/donasi/' + program.id" class="btn-donate">Berdonasi</RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

// Search query
const searchQuery = ref('')

// Format Rupiah
const formatRupiah = (number) =>
  'Rp. ' + new Intl.NumberFormat('id-ID').format(number)

// Data backend
const rawDonationData = ref([])

// Ambil data dari backend
onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/donasi')

  // Mapping supaya SESUAI TEMPLATE kamu
  rawDonationData.value = res.data.map(item => ({
    id: item.id,
    title: item.headline,
    description: item.deskripsi,

    // Fallback gambar supaya layout tidak rusak
    image: item.shelter_foto
      ? `/image/${item.shelter_foto}`
      : "/image/donasi/Rectangle 23853.png",

    shelter: {
      name: item.shelter ?? "Shelter",
      location: item.lokasi ?? "Lokasi",
      avatar: item.shelter_foto
        ? `/image/${item.shelter_foto}`
        : "/image/donasi/image.png"
    },

    terkumpul: item.terkumpul ?? 0, // backend belum punya → fallback 0
    target: item.target ?? 10000
  }))
})

// Tambahan format + progress (sesuai template lama)
const donationData = computed(() =>
  rawDonationData.value.map(program => ({
    ...program,
    progress: (program.terkumpul / program.target) * 100,
    terkumpulFormatted: formatRupiah(program.terkumpul),
    targetFormatted: formatRupiah(program.target)
  }))
)

// Search filter
const filteredDonationData = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return donationData.value

  return donationData.value.filter(program =>
    program.title.toLowerCase().includes(q) ||
    program.shelter.name.toLowerCase().includes(q) ||
    program.shelter.location.toLowerCase().includes(q) ||
    program.description.toLowerCase().includes(q)
  )
})
</script>


<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>
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
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// Search query
const searchQuery = ref('')

// Fungsi bantuan untuk format Rupiah
const formatRupiah = (number) => {
  return 'Rp. ' + new Intl.NumberFormat('id-ID').format(number);
};

// --- DATA HARDCODE (SEKARANG ADA 4 ITEM) ---
const rawDonationData = ref([
  {
    id: 'pakan-kucing',
    title: "Bantu Pakan Kucing Jalanan",
    image: "/image/donasi/Rectangle 23853 (1).png", 
    shelter: { 
      name: "Rumah Kucing BDG", 
      location: "Bandung", 
      avatar: "/image/donasi/image.png" 
    },
    description: "Masih banyak kucing jalanan yang kelaparan... Selengkapnya...",
    terkumpul: 1250000, 
    target: 5000000,
  },
  {
    id: 'rawat-kucing',
    title: "Rawat Kucing Sakit Terlantar",
    image: "/image/donasi/Rectangle 23853.png",
    shelter: { 
      name: "Meow Shelter", 
      location: "Jakarta", 
      avatar: "/image/donasi/image.png" 
    },
    description: "Banyak kucing sakit yang kami temukan... Selengkapnya...",
    terkumpul: 4800000,
    target: 5000000,
  },
  // ===== ITEM BARU 1 =====
  {
    id: 'sterilisasi-liar',
    title: "Program Sterilisasi Kucing Liar",
    image: "/image/donasi/Rectangle 23853 (1).png", // Ganti dengan gambar baru nanti
    shelter: { 
      name: "Cat Haven", 
      location: "Surabaya", 
      avatar: "/image/donasi/image.png" 
    },
    description: "Bantu kami menekan populasi kucing jalanan dengan manusiawi.",
    terkumpul: 7500000,
    target: 10000000,
  },
  // ===== ITEM BARU 2 =====
  {
    id: 'shelter-baru',
    title: "Bangun Shelter Baru yang Layak",
    image: "/image/donasi/Rectangle 23853.png", // Ganti dengan gambar baru nanti
    shelter: { 
      name: "Paw Friends", 
      location: "Yogyakarta", 
      avatar: "/image/donasi/image.png" 
    },
    description: "Shelter kami sudah over-kapasitas. Bantu kami rumah baru.",
    terkumpul: 2100000,
    target: 15000000,
  }
]);

// Computed property untuk menghitung persentase dan format uang
const donationData = computed(() => {
  return rawDonationData.value.map(program => ({
    ...program,
    progress: (program.terkumpul / program.target) * 100,
    terkumpulFormatted: formatRupiah(program.terkumpul),
    targetFormatted: formatRupiah(program.target)
  }));
});

// Computed property untuk filter berdasarkan search query
const filteredDonationData = computed(() => {
  if (!searchQuery.value.trim()) {
    return donationData.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return donationData.value.filter(program => 
    program.title.toLowerCase().includes(query) ||
    program.shelter.name.toLowerCase().includes(query) ||
    program.shelter.location.toLowerCase().includes(query) ||
    program.description.toLowerCase().includes(query)
  );
});
</script>

<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>
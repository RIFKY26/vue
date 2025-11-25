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

     <div v-if="loading" style="text-align:center; padding: 40px;">
      <p>Memuat program donasi...</p>
    </div>

    <div v-else-if="filteredDonationData.length === 0" style="text-align:center; padding: 40px;">
      <p>Belum ada program donasi tersedia.</p>
    </div>

    <div class="donation-grid">
      <div v-for="program in filteredDonationData" :key="program.id" class="donation-card">
        <img
          :src="getImageUrl(program.image)"
          @error="$event.target.src = 'https://placehold.co/600x400?text=No+Image'"
          :alt="program.title"
        >
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
          <p>{{ truncateText(program.description, 100) }}</p>

          <div class="donation-progress">
            <div class="progress-text">
              <span>Terkumpul <strong>{{ formatRupiah(program.terkumpul) }}</strong> dari <strong>{{ formatRupiah(program.target) }}</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: calculateProgress(program) + '%' }"></div>
            </div>
          </div>

          <button class="btn-donate" @click="goToDetail(program.id)">Berdonasi</button>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DonasiService from '@/services/donasiService';

const router = useRouter();
const donations = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const SERVER_URL = 'http://localhost:3000'; // Sesuaikan port

// === FETCH DATA ===
const buildShelterAvatar = (filename) => {
  if (!filename) {
    return 'https://placehold.co/50x50?text=S'
  }
  return `${SERVER_URL}/public/image/shelter/${filename}`
}

const fetchDonasi = async () => {
  loading.value = true;
  try {
    const response = await DonasiService.getAll();
    const rawData = Array.isArray(response.data) ? response.data : (response.data.data || []);

    donations.value = rawData.map(item => ({
      id: item.id_donasi,
      title: item.judul,
      description: item.deskripsi,
      image: item.foto,
      terkumpul: Number(item.terkumpul || 0),
      target: Number(item.target_donasi || 0),
      shelter: {
        name: item.shelter?.name || 'AdoptMeow Official',
        location: item.shelter?.location || 'Indonesia',
        avatar: buildShelterAvatar(item.shelter?.avatar)
      }
    }));

  } catch (error) {
    console.error("Gagal load donasi:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDonasi();
});

// === COMPUTED & HELPERS ===
const filteredDonationData = computed(() => {
  if (!searchQuery.value.trim()) return donations.value;
  return donations.value.filter(d =>
    d.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getImageUrl = (filename) => {
  if (!filename || filename === 'default-donasi.png') return 'https://placehold.co/600x400?text=No+Image';
  return `${SERVER_URL}/public/image/donasi/${filename}`;
};

const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const calculateProgress = (program) => {
  if (!program.target) return 0;
  const p = (program.terkumpul / program.target) * 100;
  return p > 100 ? 100 : p;
};

const truncateText = (text, length) => {
  if(!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const goToDetail = (id) => {
  router.push(`/donasi/${id}`);
};
</script>

<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>

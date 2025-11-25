<template>
  <main>
    <div class="main-header">
      <h1>Donasi</h1>
      <span class="breadcrumb">DONASI / DETAIL DONASI</span>
    </div>

    <div v-if="loading" class="text-center p-5">Memuat data...</div>

    <div v-else-if="!campaign" class="donation-detail-wrapper">
      <h2>Program Donasi Tidak Ditemukan</h2>
      <p>Mungkin link salah atau program sudah berakhir.</p>
    </div>

    <div v-else class="donation-detail-wrapper">
      <div class="donation-detail-card">
        <img
          :src="getImageUrl(campaign.foto)"
          @error="$event.target.src = 'https://placehold.co/800x400?text=No+Image'"
          class="detail-img"
        />
        <div class="donation-detail-body">
          <h2>{{ campaign.judul }}</h2>
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
          <p>{{ campaign.deskripsi }}</p>

          <div class="donation-progress">
            <div class="progress-text">
              <span
                >Terkumpul <strong>{{ formatRupiah(campaign.terkumpul) }}</strong> dari
                <strong>{{ formatRupiah(campaign.target_donasi) }}</strong></span
              >
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: calculateProgress(campaign) + '%' }"></div>
            </div>
          </div>

          <button class="btn-donate" @click="goToPayment">
            <i class="fa-solid fa-heart"></i> Donasi Sekarang
          </button>

        </div>
      </div>

      <div class="donor-list">
        <h3>Informasi Donatur Dana</h3>
        <div id="donor-list-container">
          <div
            v-if="campaign.donors.length === 0"
            class="donor-item empty-donor"
          >
            <p>Belum ada donatur. Jadilah yang pertama!</p>
          </div>
          <div
            v-else
            v-for="donor in campaign.donors"
            :key="donor.id"
            class="donor-item"
          >
            <img :src="donor.avatar" alt="Avatar Donatur" />
            <div class="donor-info">
              <div>
                <span class="name">{{ donor.name }}</span>
                <span class="time">{{ donor.time }}</span>
              </div>
              <p class="donation-text">
                Berdonasi sebesar
                <strong>{{ formatRupiah(donor.amount) }}</strong>
                • {{ donor.method }}
              </p>
              <p v-if="donor.message" class="donor-message">
                “{{ donor.message }}”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DonasiService from '@/services/donasiService';

const route = useRoute();
const router = useRouter();
const campaign = ref(null);
const loading = ref(true);
const SERVER_URL = 'http://localhost:3000';

const buildShelterAvatar = (filename) => {
  if (!filename) {
    return 'https://placehold.co/50x50?text=S';
  }
  return `${SERVER_URL}/public/image/shelter/${filename}`;
};

const formatDonorTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const mapCampaignDetail = (data) => ({
  id_donasi: data.id_donasi,
  judul: data.judul,
  deskripsi: data.deskripsi,
  foto: data.foto,
  target_donasi: Number(data.target_donasi || 0),
  terkumpul: Number(data.terkumpul || 0),
  shelter: {
    name: data.shelter?.name || 'AdoptMeow Official',
    location: data.shelter?.location || 'Indonesia',
    avatar: buildShelterAvatar(data.shelter?.avatar),
  },
  donors: (data.riwayat || []).map((riwayat, index) => ({
    id: riwayat.id_pembayaran || `${riwayat.nama_donatur}-${index}`,
    name: riwayat.nama_donatur || 'Hamba Allah',
    amount: Number(riwayat.nominal || 0),
    method: riwayat.metode_pembayaran || 'Metode tidak dikenal',
    time: formatDonorTime(riwayat.tanggal_bayar),
    avatar: 'https://placehold.co/50x50?text=D',
    message: riwayat.pesan,
  })),
});

const fetchDetail = async () => {
  try {
    const id = route.params.id;
    const response = await DonasiService.getById(id);
    campaign.value = mapCampaignDetail(response.data);
  } catch (error) {
    console.error("Gagal load detail:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetail();
});

const goToPayment = () => {
  // Arahkan ke halaman pembayaran dengan ID donasi
  router.push(`/pembayaran/${campaign.value.id_donasi}`);
};

// Helpers
const getImageUrl = (filename) => {
  if (!filename) return 'https://placehold.co/800x400?text=No+Image';
  return `${SERVER_URL}/public/image/donasi/${filename}`;
};

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

const calculateProgress = (item) => {
  if(!item || !item.target_donasi) return 0;
  const p = (item.terkumpul / item.target_donasi) * 100;
  return p > 100 ? 100 : p;
};
</script>

<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>

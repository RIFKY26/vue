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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const formatRupiah = (number) =>
  'Rp. ' + new Intl.NumberFormat('id-ID').format(number)

const route = useRoute()
const campaign = ref(null)

onMounted(async () => {
  const id = route.params.id

  try {
    const res = await axios.get(`http://localhost:3000/api/donasi/${id}`)
    const d = res.data

    // --- Fallback biar tampilan TIDAK BERUBAH ---
    campaign.value = {
      id: d.id,
      title: d.headline,
      description: d.deskripsi,

      // jika backend tidak punya image kampanye → jangan rubah layout
      image: d.image ? `/image/${d.image}` : '/image/donasi/Rectangle 23853.png',

      // Fallback shelter
      shelter: {
        name: d.shelter ?? "Shelter",
        location: d.lokasi ?? "Lokasi",
        avatar: d.shelter_foto
          ? `/image/${d.shelter_foto}`
          : '/image/donasi/image.png'
      },

      // Fallback total & target biar progress bar muncul
      terkumpul: d.total_terkumpul ?? 0,
      target: d.target ?? 10000,

      progress: ((d.total_terkumpul ?? 0) / (d.target ?? 1)) * 100,
      terkumpulFormatted: formatRupiah(d.total_terkumpul ?? 0),
      targetFormatted: formatRupiah(d.target ?? 0),

      // Jika backend belum ada data donatur → tetap tampil default
      donors: d.donors?.length
        ? d.donors
        : [
            {
              name: "Belum ada donatur",
              avatar: "/image/peringkat/shaqonel.png",
              time: "",
              amount: 0
            }
          ]
    }
  } catch (err) {
    campaign.value = null
  }
})
</script>


<style scoped>
@import '@/assets/css/pages/donasi.css';
</style>
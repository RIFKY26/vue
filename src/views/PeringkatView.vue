<template>
  <main>
    <div class="main-header">
      <h1>Peringkat</h1>
      <span class="breadcrumb">PERINGKAT / PENGGUNA</span>
    </div>

    <div class="leaderboard-top3">
      <div class="top-user-card">
        <div class="rank-badge silver">2</div>
        <img :src="topUsers[1].avatar" alt="Foto Pengguna">
        <div class="stars">★★★★☆</div>
        <h3>{{ topUsers[1].nama }}</h3>
        <p>Total Points</p>
        <div class="total-points">{{ topUsers[1].totalPoin }}</div>
        <div class="point-details">
          <span>Poin Adopsi <span class="points">{{ topUsers[1].poinAdopsi }}</span></span>
          <span>Poin Lapor <span class="points">{{ topUsers[1].poinLapor }}</span></span>
          <span>Poin Donasi <span class="points">{{ topUsers[1].poinDonasi }}</span></span>
        </div>
      </div>
      <div class="top-user-card main">
        <div class="rank-badge gold">1</div>
        <img :src="topUsers[0].avatar" alt="Foto Pengguna">
        <div class="stars">★★★★★</div>
        <h3>{{ topUsers[0].nama }}</h3>
        <p>Total Points</p>
        <div class="total-points">{{ topUsers[0].totalPoin }}</div>
        <div class="point-details">
          <span>Poin Adopsi <span class="points">{{ topUsers[0].poinAdopsi }}</span></span>
          <span>Poin Lapor <span class="points">{{ topUsers[0].poinLapor }}</span></span>
          <span>Poin Donasi <span class="points">{{ topUsers[0].poinDonasi }}</span></span>
        </div>
      </div>
      <div class="top-user-card">
         <div class="rank-badge bronze">3</div>
        <img :src="topUsers[2].avatar" alt="Foto Pengguna">
        <div class="stars">★★★★☆</div>
        <h3>{{ topUsers[2].nama }}</h3>
        <p>Total Points</p>
        <div class="total-points">{{ topUsers[2].totalPoin }}</div>
        <div class="point-details">
          <span>Poin Adopsi <span class="points">{{ topUsers[2].poinAdopsi }}</span></span>
          <span>Poin Lapor <span class="points">{{ topUsers[2].poinLapor }}</span></span>
          <span>Poin Donasi <span class="points">{{ topUsers[2].poinDonasi }}</span></span>
        </div>
      </div>
    </div>

    <div class="leaderboard-table-wrapper">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Nama</th>
            <th>Poin Adopsi</th>
            <th>Poin Lapor</th>
            <th>Poin Donasi</th>
            <th>Total Poin</th>
            <th>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in leaderboardData" :key="user.id">
            <td>{{ user.rank }}</td>
            <td>
              <img :src="user.avatar" alt="Avatar">
              <span>{{ user.nama }}</span>
            </td>
            <td>{{ user.poinAdopsi }}</td>
            <td>{{ user.poinLapor }}</td>
            <td>{{ user.poinDonasi }}</td>
            <td class="total"><strong>{{ user.totalPoin }}</strong></td>
            <td>
  <i class="fa-solid fa-ellipsis tindakan-btn"
     @click="openModal(user.id, user.nama)">
  </i>
</td>

          </tr>
        </tbody>
      </table>
    </div>
  </main>

  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="modalTitle">{{ modalTitle }}</h3>
        <button @click="closeModal" class="modal-close">&times;</button>
      </div>
      <div id="modalBody" class="modal-body">
        <div v-if="historyData.length === 0">
          <p>Tidak ada riwayat poin untuk pengguna ini.</p>
        </div>
        <div v-else>
          <div v-for="item in historyData" :key="item.description" class="history-item">
            <div :class="['icon', item.type]">
              <i :class="['fa-solid', item.icon]"></i>
            </div>
            <div class="history-info">
              <strong>{{ item.description }}</strong>
            </div>
            <div class="history-points">+{{ item.points }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"

// DATA leaderboard dari backend
const leaderboardData = ref([])

// avatar default kalau tidak ada di DB
const defaultAvatar = "/image/peringkat/shaqonel.png"

// Ambil data dari backend
onMounted(async () => {
  const res = await axios.get("http://localhost:3000/api/peringkat")

  // mapping backend → struktur tampilan
  leaderboardData.value = res.data.map(item => ({
    id: item.id_peringkat,
    nama: item.username,
    rank: item.rank,
    avatar: defaultAvatar, // backend tidak punya avatar

    // backend hanya punya 1 poin (jumlah_poin)
    // tampilannya butuh 3 jenis poin → untuk sekarang fallback 0
    poinAdopsi: item.nama_poin === "adopsi" ? item.jumlah_poin : 0,
    poinLapor: item.nama_poin === "lapor" ? item.jumlah_poin : 0,
    poinDonasi: item.nama_poin === "donasi" ? item.jumlah_poin : 0,

    // total poin
    totalPoin: item.jumlah_poin,

    // tindakan (untuk modal)
    tindakan: item.tindakan
  }))
})

// TOP 3 user (langsung dari leaderboardData)
const topUsers = computed(() => {
  const sortedUsers = [...leaderboardData.value].sort((a, b) => a.rank - b.rank)
  return [
    sortedUsers[0] || {},
    sortedUsers[1] || {},
    sortedUsers[2] || {}
  ]
})

// --- MODAL DATA (sementara kosong karena backend belum ada riwayat) ---
const isModalOpen = ref(false)
const modalTitle = ref("")
const historyData = ref([])

function openModal(id, name) {
  modalTitle.value = `Riwayat Poin untuk ${name}`

  // Cari user berdasarkan id yang diklik
  const user = leaderboardData.value.find(u => u.id === id)

  // Jika ketemu → isi modal pakai tindakan yang ada di database
  if (user && user.tindakan) {
    historyData.value = [
      {
        type:
          user.poinDonasi > 0 ? "donasi" :
          user.poinAdopsi > 0 ? "adopsi" :
          "lapor",
        icon:
          user.poinDonasi > 0 ? "fa-hand-holding-dollar" :
          user.poinAdopsi > 0 ? "fa-paw" :
          "fa-flag",
        description: user.tindakan,
        points:
          user.poinDonasi > 0 ? user.poinDonasi :
          user.poinAdopsi > 0 ? user.poinAdopsi :
          user.poinLapor
      }
    ]
  } else {
    historyData.value = []
  }

  isModalOpen.value = true
}


function closeModal() {
  isModalOpen.value = false
}
</script>


<style scoped>
@import '@/assets/css/pages/peringkat.css';
/* CSS untuk modal dan tabel sudah ada di main.css (global) */
.tindakan-btn {
  cursor: pointer;
}

</style>
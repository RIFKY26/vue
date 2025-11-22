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
import { ref, computed } from 'vue'

// --- DATA HARDCODE (dari peringkat.js lama) ---
// Pastikan path gambar diawali dengan '/' untuk menunjuk ke folder 'public'
const leaderboardData = ref([
  { id: "Shaq O'niel", rank: 1, avatar: '/image/peringkat/shaqonel.png', nama: "Shaq O'niel", poinAdopsi: 832, poinLapor: 226, poinDonasi: 199, totalPoin: 1257 },
  { id: "yungkai", rank: 2, avatar: '/image/peringkat/yungkai.png', nama: 'yung kai', poinAdopsi: 657, poinLapor: 686, poinDonasi: 756, totalPoin: 976 },
  { id: "Rex Orange", rank: 3, avatar: '/image/peringkat/re oren.png', nama: 'Rex Orange', poinAdopsi: 787, poinLapor: 687, poinDonasi: 865, totalPoin: 865 },
  { id: "Laufey", rank: 4, avatar: '/image/peringkat/laufey.png', nama: 'Laufey', poinAdopsi: 767, poinLapor: 758, poinDonasi: 767, totalPoin: 860 },
]);

// Data untuk 3 teratas, diambil dari data utama
const topUsers = computed(() => [
    leaderboardData.value[0], // Peringkat 1
    leaderboardData.value[1], // Peringkat 2
    leaderboardData.value[2], // Peringkat 3
]);

const pointHistoryDatabase = {
    "Shaq O'niel": [
        { type: 'donasi', icon: 'fa-hand-holding-dollar', description: 'Donasi untuk Pakan Kucing', points: 199 },
        { type: 'adopsi', icon: 'fa-paw', description: 'Adopsi kucing bernama Mochi', points: 832 },
    ],
    "yungkai": [
        { type: 'adopsi', icon: 'fa-paw', description: 'Adopsi kucing bernama Leo', points: 657 },
        { type: 'lapor', icon: 'fa-flag', description: 'Melaporkan kucing terlantar', points: 686 }
    ],
    "Rex Orange": [
        { type: 'donasi', icon: 'fa-hand-holding-dollar', description: 'Donasi untuk Vaksinasi', points: 865 }
    ],
    "Laufey": [
        { type: 'donasi', icon: 'fa-hand-holding-dollar', description: 'Donasi untuk Shelter Baru', points: 860 }
    ]
};

// --- Data untuk Modal ---
const isModalOpen = ref(false);
const modalTitle = ref('');
const historyData = ref([]); // Data untuk ditampilkan di modal

// --- METHODS ---
function openModal(userId, userName) {
  modalTitle.value = `Riwayat Poin untuk ${userName}`;
  historyData.value = pointHistoryDatabase[userId] || [];
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<style scoped>
@import '@/assets/css/pages/peringkat.css';
/* CSS untuk modal dan tabel sudah ada di main.css (global) */
.tindakan-btn {
  cursor: pointer;
}

</style>
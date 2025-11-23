<template>
  <main>
    <div class="main-header">
      <h1>Profil</h1>
      <span class="breadcrumb">PROFIL / PENGGUNA</span>
    </div>

    <div class="profile-container">
      <!-- Card Profil Utama -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <img :src="userData.avatar" alt="Foto Profil">
            <button class="edit-avatar-btn" @click="editAvatar">
              <i class="fa-solid fa-camera"></i>
            </button>
          </div>
          <div class="profile-info">
            <h2>{{ userData.nama }}</h2>
            <p class="profile-email">{{ userData.email }}</p>
            <p class="profile-bio">{{ userData.bio }}</p>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-label">Total Poin</span>
                <span class="stat-value">{{ userData.totalPoin }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Peringkat</span>
                <span class="stat-value">#{{ userData.peringkat }}</span>
              </div>
            </div>
          </div>
          <button class="btn-edit-profile" @click="editProfile">
            <i class="fa-solid fa-pen"></i> Edit Profil
          </button>
        </div>
      </div>

      <!-- Grid Statistik -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon adopsi">
            <i class="fa-solid fa-paw"></i>
          </div>
          <div class="stat-content">
            <h3>Poin Adopsi</h3>
            <p class="stat-number">{{ userData.poinAdopsi }}</p>
            <span class="stat-desc">{{ userData.totalAdopsi }} Kucing Diadopsi</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon lapor">
            <i class="fa-solid fa-flag"></i>
          </div>
          <div class="stat-content">
            <h3>Poin Lapor</h3>
            <p class="stat-number">{{ userData.poinLapor }}</p>
            <span class="stat-desc">{{ userData.totalLapor }} Laporan</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon donasi">
            <i class="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <div class="stat-content">
            <h3>Poin Donasi</h3>
            <p class="stat-number">{{ userData.poinDonasi }}</p>
            <span class="stat-desc">{{ userData.totalDonasi }} Donasi</span>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="profile-tabs">
        <div class="tab-buttons">
          <button 
            :class="['tab-btn', { active: activeTab === 'aktivitas' }]"
            @click="activeTab = 'aktivitas'"
          >
            <i class="fa-solid fa-clock-rotate-left"></i> Aktivitas Terakhir
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'riwayat' }]"
            @click="activeTab = 'riwayat'"
          >
            <i class="fa-solid fa-list"></i> Riwayat Poin
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'pengaturan' }]"
            @click="activeTab = 'pengaturan'"
          >
            <i class="fa-solid fa-gear"></i> Pengaturan
          </button>
        </div>

        <!-- Tab: Aktivitas Terakhir -->
        <div v-if="activeTab === 'aktivitas'" class="tab-content">
          <div class="activity-list">
            <div v-for="activity in aktivitasData" :key="activity.id" class="activity-item">
              <div :class="['activity-icon', activity.type]">
                <i :class="['fa-solid', activity.icon]"></i>
              </div>
              <div class="activity-details">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
              <div class="activity-points">
                <span v-if="activity.points > 0" class="points-badge">+{{ activity.points }} poin</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Riwayat Poin -->
        <div v-if="activeTab === 'riwayat'" class="tab-content">
          <div class="history-list">
            <div v-for="history in riwayatPoin" :key="history.id" class="history-item">
              <div :class="['history-icon', history.type]">
                <i :class="['fa-solid', history.icon]"></i>
              </div>
              <div class="history-details">
                <h4>{{ history.description }}</h4>
                <span class="history-date">{{ history.date }}</span>
              </div>
              <div class="history-points">
                <span class="points-value">+{{ history.points }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Pengaturan -->
        <div v-if="activeTab === 'pengaturan'" class="tab-content">
          <div class="settings-section">
            <h3>Informasi Akun</h3>
            <div class="settings-form">
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" v-model="userData.nama" placeholder="Nama Lengkap">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" v-model="userData.email" placeholder="Email">
              </div>
              <div class="form-group">
                <label>Bio</label>
                <textarea v-model="userData.bio" placeholder="Tulis bio singkat tentang diri Anda" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Nomor Telepon</label>
                <input type="tel" v-model="userData.phone" placeholder="Nomor Telepon">
              </div>
              <div class="form-group">
                <label>Alamat</label>
                <textarea v-model="userData.alamat" placeholder="Alamat lengkap" rows="2"></textarea>
              </div>
              <button class="btn-save" @click="saveSettings">
                <i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan
              </button>
            </div>
          </div>

          <div class="settings-section">
            <h3>Tampilan</h3>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <h4>Mode Gelap</h4>
                  <p>{{ isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap' }}</p>
                </div>
                <label class="switch">
                  <input type="checkbox" :checked="isDarkMode" @change="toggleDarkMode">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>Notifikasi</h3>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <h4>Notifikasi Email</h4>
                  <p>Terima notifikasi melalui email</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifikasiEmail">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>Notifikasi Adopsi</h4>
                  <p>Notifikasi tentang status adopsi</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifikasiAdopsi">
                  <span class="slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <h4>Notifikasi Donasi</h4>
                  <p>Notifikasi tentang donasi dan kampanye</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="settings.notifikasiDonasi">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useDarkMode } from "../composables/useDarkMode";
import axios from "axios";

const route = useRoute();
const { isDarkMode, toggleDarkMode } = useDarkMode();

const activeTab = ref("aktivitas");

// -------------------------
// DATA REF
// -------------------------
const userData = ref({
  nama: "",
  email: "",
  bio: "",
  phone: "",
  alamat: "",
  avatar: "",
  totalPoin: 0,
  peringkat: 0,
  poinAdopsi: 0,
  poinLapor: 0,
  poinDonasi: 0,
  totalAdopsi: 0,
  totalLapor: 0,
  totalDonasi: 0,
});

const aktivitasData = ref([]);
const riwayatPoin = ref([]);

const settings = ref({
  notifikasiEmail: true,
  notifikasiAdopsi: true,
  notifikasiDonasi: false,
});

// -------------------------
// FETCH DATA FROM BACKEND
// -------------------------
async function loadUser() {
 const idUser = localStorage.getItem("id_user") || 3;


  // --- GET PROFIL USER ---
  const profil = await axios.get(`http://localhost:3000/api/users/${idUser}`);
  const p = profil.data;

  userData.value = {
    nama: p.nama,
    email: p.email,
    bio: p.bio,
    phone: p.phone,
    alamat: p.alamat,
    avatar: p.foto, // DB: foto
    totalPoin: p.total_poin,
    peringkat: 1,
    poinAdopsi: p.poinAdopsi,
    poinLapor: p.poinLapor,
    poinDonasi: p.poinDonasi,
    totalAdopsi: p.poinAdopsi > 0 ? 12 : 0,
    totalLapor: p.poinLapor > 0 ? 8 : 0,
    totalDonasi: p.poinDonasi > 0 ? 5 : 0,
  };

  // --- GET RIWAYAT / AKTIVITAS ---
  const history = await axios.get(
    `http://localhost:3000/api/users/${idUser}/poin-history`
  );

  riwayatPoin.value = history.data.map((h) => ({
    id: h.id_history,
    type:
      h.id_poin === 1
        ? "adopsi"
        : h.id_poin === 2
        ? "donasi"
        : "lapor",
    icon:
      h.id_poin === 1
        ? "fa-paw"
        : h.id_poin === 2
        ? "fa-hand-holding-dollar"
        : "fa-flag",
    description: h.deskripsi,
    date: h.tanggal,
    points: h.poin,
  }));

  // aktivitas (pakai format yang sama)
  aktivitasData.value = riwayatPoin.value.map((h) => ({
    id: h.id,
    type: h.type,
    icon: h.icon,
    title:
      h.type === "adopsi"
        ? "Adopsi Kucing"
        : h.type === "donasi"
        ? "Donasi"
        : "Laporan",
    description: h.description,
    time: h.date,
    points: h.points,
  }));
}

// -------------------------
// MOUNT
// -------------------------
onMounted(() => {
  if (route.query.tab === "pengaturan") {
    activeTab.value = "pengaturan";
  }

  loadUser();
});

// WATCH TAB
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab === "pengaturan") {
      activeTab.value = "pengaturan";
    }
  }
);

// -------------------------
// METHODS
// -------------------------
function editProfile() {
  activeTab.value = "pengaturan";
}

function editAvatar() {
  alert("Fitur edit avatar segera tersedia!");
}

function saveSettings() {
  alert("Pengaturan berhasil disimpan!");
}
</script>


<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 100%;
}

/* Profile Card */
.profile-card {
  background-color: var(--white);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow);
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 25px;
  position: relative;
}

.profile-avatar {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--border-color);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: white;
  border: 3px solid var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.edit-avatar-btn:hover {
  background-color: var(--blue-dark);
  transform: scale(1.1);
}

.profile-info {
  flex-grow: 1;
}

.profile-info h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.profile-email {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 10px;
}

.profile-bio {
  color: var(--text-dark);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.profile-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
  text-transform: uppercase;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--secondary-color);
}

.btn-edit-profile {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 20px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-edit-profile:hover {
  background-color: var(--blue-dark);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  background-color: var(--white);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-icon.adopsi {
  background-color: #22C55E;
}

.stat-icon.lapor {
  background-color: #3B82F6;
}

.stat-icon.donasi {
  background-color: #EF4444;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-light);
  margin-bottom: 5px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
  display: block;
  margin-bottom: 5px;
}

.stat-desc {
  font-size: 12px;
  color: var(--text-light);
}

/* Tabs */
.profile-tabs {
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.tab-buttons {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-light);
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  color: var(--secondary-color);
  background-color: var(--white);
}

.tab-btn.active {
  color: var(--secondary-color);
  background-color: var(--white);
  border-bottom-color: var(--secondary-color);
}

.tab-content {
  padding: 30px;
}

/* Activity List */
.activity-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item,
.history-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.activity-item:hover,
.history-item:hover {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-icon,
.history-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.activity-icon.adopsi,
.history-icon.adopsi {
  background-color: #22C55E;
}

.activity-icon.lapor,
.history-icon.lapor {
  background-color: #3B82F6;
}

.activity-icon.donasi,
.history-icon.donasi {
  background-color: #EF4444;
}

.activity-details,
.history-details {
  flex-grow: 1;
}

.activity-details h4,
.history-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.activity-details p,
.history-details p {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 5px;
}

.activity-time,
.history-date {
  font-size: 12px;
  color: var(--text-light);
}

.activity-points,
.history-points {
  flex-shrink: 0;
}

.points-badge,
.points-value {
  padding: 6px 12px;
  background-color: var(--secondary-color);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.points-value {
  font-size: 16px;
}

/* Settings */
.settings-section {
  margin-bottom: 40px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark);
}

.form-group input,
.form-group textarea {
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  color: var(--text-dark);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.btn-save {
  padding: 12px 30px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  transition: all 0.2s ease;
}

.btn-save:hover {
  background-color: var(--blue-dark);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: var(--bg-light);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.setting-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.setting-info p {
  font-size: 13px;
  color: var(--text-light);
}

/* Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--secondary-color);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .btn-edit-profile {
    position: static;
    margin-top: 20px;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .tab-buttons {
    flex-direction: column;
  }
}
</style>


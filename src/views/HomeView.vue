<template>
  <main>
    <div class="main-header">
      <h1>Beranda</h1>
      <span class="breadcrumb">BERANDA</span>
    </div>

    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <p>Halo, selamat datang kembali...</p>
        <h2>{{ userData.nama }}</h2>
      </div>
      <div class="welcome-image-wrapper">
        <img :src="kucingSvg" alt="Cute Cat Illustration" class="cat-illustration" />
      </div>
    </div>

    <!-- Points Summary -->
    <section class="points-summary">
      <div class="point-card">
        <div class="text">
          <h4>Poin Adopsi</h4>
          <p>{{ userData.poinAdopsi }}</p>
        </div>
        <div class="icon green"><i class="fa-solid fa-paw"></i></div>
      </div>
      <div class="point-card">
        <div class="text">
          <h4>Poin Lapor</h4>
          <p>{{ userData.poinLapor }}</p>
        </div>
        <div class="icon blue"><i class="fa-solid fa-flag"></i></div>
      </div>
      <div class="point-card">
        <div class="text">
          <h4>Poin Donasi</h4>
          <p>{{ userData.poinDonasi }}</p>
        </div>
        <div class="icon red"><i class="fa-solid fa-hand-holding-dollar"></i></div>
      </div>
    </section>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Adoption Feed -->
      <section class="adoption-feed">
        <h2>Mari Adopsi!</h2>
        <div class="filter-bar">
          <div class="search-bar">
            <i class="fa-solid fa-search"></i>
            <input 
              type="text" 
              placeholder="Cari kucing..." 
              v-model="searchQuery"
              @input="filterCats"
            />
          </div>
          <router-link to="/adopsi" class="btn-filter">
            <i class="fa-solid fa-list"></i>
            Lihat Semua
          </router-link>
        </div>

        <div class="cat-adoption-grid">
          <div 
            v-for="cat in displayedCats" 
            :key="cat.id"
            class="cat-card"
          >
            <img :src="cat.image" :alt="cat.name" />
            <div class="cat-card-body">
              <h3>{{ cat.name }}</h3>
              <div class="cat-info-tags">
                <span class="tag">
                  <i :class="cat.tags.genderIcon"></i> {{ cat.tags.gender }}
                </span>
                <span class="tag">
                  <i class="fa-solid fa-paw"></i> {{ cat.tags.breed }}
                </span>
                <span class="tag">
                  <i class="fa-solid fa-heart-pulse"></i> {{ cat.tags.health }}
                </span>
                <span class="tag">
                  <i class="fa-solid fa-calendar-days"></i> {{ cat.tags.age }}
                </span>
              </div>
              <div class="shelter-info">
                <img :src="cat.shelter.avatar" :alt="cat.shelter.name" />
                <span>{{ cat.shelter.name }}</span>
                <span class="location">
                  <i class="fa-solid fa-map-marker-alt"></i> {{ cat.shelter.location }}
                </span>
              </div>
              <p>{{ cat.description }}</p>
              <router-link :to="`/adopsi/${cat.id}`" class="btn-adopt">
                Adopsi
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Sidebar -->
      <aside class="right-sidebar">
        <!-- Aktivitas Kucing -->
        <div class="card">
          <div class="card-header">
            <h3>Aktivitas Kucingmu</h3>
            <router-link to="/rawat-kucing" class="btn-icon">
              <i class="fa-solid fa-plus"></i>
            </router-link>
          </div>
          <p class="date-label">{{ currentDate }}</p>
          <div class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-date-box">
                <span>{{ activity.day }}</span>
                {{ activity.month }}
              </div>
              <div class="activity-details">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
              </div>
            </div>
            <div v-if="recentActivities.length === 0" class="no-activity">
              <p>Tidak ada aktivitas hari ini</p>
            </div>
          </div>
        </div>

        <!-- Status Adopsi -->
        <div class="card" v-if="adoptionStatus">
          <h3>Status Adopsi</h3>
          <div class="status-details">
            <p class="cat-name">{{ adoptionStatus.catName }}</p>
            <div class="cat-info">
              <span><i :class="adoptionStatus.genderIcon"></i> {{ adoptionStatus.gender }}</span>
              <span><i class="fa-solid fa-paw"></i> {{ adoptionStatus.breed }}</span>
              <span><i class="fa-solid fa-calendar-days"></i> {{ adoptionStatus.age }}</span>
            </div>
            <div class="status-badge verification">{{ adoptionStatus.status }}</div>
          </div>
        </div>

        <!-- Status Laporan -->
        <div class="card" v-if="reportStatus">
          <h3>Status Laporan</h3>
          <div class="status-details">
            <p class="cat-name">{{ reportStatus.catName }}</p>
            <div class="cat-info">
              <span><i :class="reportStatus.genderIcon"></i> {{ reportStatus.gender }}</span>
              <span><i class="fa-solid fa-paw"></i> {{ reportStatus.breed }}</span>
              <span><i class="fa-solid fa-calendar-days"></i> {{ reportStatus.age }}</span>
            </div>
            <div class="status-badge rescued">
              <i class="fa-solid fa-check"></i> {{ reportStatus.status }}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import kucingSvg from '@/assets/images/kucing.svg'

// User Data
const userData = ref({
  nama: "Shaq O'niel",
  poinAdopsi: 832,
  poinLapor: 226,
  poinDonasi: 199
})

// Search Query
const searchQuery = ref('')

// Sample Cats Data
const cats = ref([
  {
    id: 'Mochi',
    name: 'Mochi',
    image: '/image/adopsi/kucing 1.png',
    tags: {
      gender: 'Betina',
      genderIcon: 'fa-solid fa-venus',
      breed: 'Persia',
      health: 'Sehat',
      age: '4 bln'
    },
    shelter: {
      name: 'Rumah Kucing BDG',
      location: 'Bandung',
      avatar: '/image/adopsi/image.png'
    },
    description: 'Kucing cantik, sehat, dan bersih. Cocok untuk kamu yang ingin sahabat baru di rumah.'
  },
  {
    id: 'Leo',
    name: 'Leo',
    image: '/image/adopsi/kucing 2.png',
    tags: {
      gender: 'Jantan',
      genderIcon: 'fa-solid fa-mars',
      breed: 'British',
      health: 'Sehat',
      age: '6 bln'
    },
    shelter: {
      name: 'Meow Shelter',
      location: 'Jakarta',
      avatar: '/image/adopsi/image.png'
    },
    description: 'Leo sangat aktif dan suka bermain. Mencari rumah yang bisa mengajaknya bermain.'
  },
  {
    id: 'Kiko',
    name: 'Kiko',
    image: '/image/adopsi/kucing 3.png',
    tags: {
      gender: 'Jantan',
      genderIcon: 'fa-solid fa-mars',
      breed: 'Domestik',
      health: 'Sehat',
      age: '3 bln'
    },
    shelter: {
      name: 'Paw Friends',
      location: 'Yogyakarta',
      avatar: '/image/adopsi/image.png'
    },
    description: 'Kiko adalah kucing yang mandiri dan suka menjelajah.'
  }
])

// Filtered Cats
const displayedCats = computed(() => {
  if (!searchQuery.value) {
    return cats.value.slice(0, 3) // Show only 3 on homepage
  }
  return cats.value.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    cat.tags.breed.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function filterCats() {
  // Filter is handled by computed property
}

// Current Date
const currentDate = computed(() => {
  const date = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('id-ID', options)
})

// Recent Activities
const recentActivities = ref([
  {
    id: 1,
    day: '24',
    month: 'November',
    title: 'Vaksinasi Kucing',
    description: 'Vaksinasi kucing ke klinik, Pukul 08:00'
  }
])

// Adoption Status
const adoptionStatus = ref({
  catName: 'Mochi',
  gender: 'Betina',
  genderIcon: 'fa-solid fa-venus',
  breed: 'Persia',
  age: '4 bln',
  status: 'Tahap Verifikasi'
})

// Report Status
const reportStatus = ref({
  catName: 'Kucing Terlantar',
  gender: 'Jantan',
  genderIcon: 'fa-solid fa-mars',
  breed: 'Domestik',
  age: '2 bln',
  status: 'Sudah Diselamatkan'
})
</script>

<style scoped>
/* Welcome Banner */
.welcome-banner {
  background-color: var(--yellow-color);
  border-radius: 12px;
  padding: 25px;
  color: var(--text-dark);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-height: 160px;
  background-image: url('/image/rawat-kucing/Group9791.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.welcome-content {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.welcome-image-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 20px;
  flex-shrink: 0;
}

.welcome-banner .cat-illustration {
  height: 120px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.welcome-banner p {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--text-dark);
}

.welcome-banner h2 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-dark);
}


/* Points Summary */
.points-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.point-card {
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.point-card:hover {
  transform: translateY(-4px);
}

.point-card .icon {
  font-size: 28px;
  padding: 15px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point-card .icon.green {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.point-card .icon.blue {
  background-color: #E3F2FD;
  color: #2196F3;
}

.point-card .icon.red {
  background-color: #FFEBEE;
  color: #F44336;
}

.point-card .text h4 {
  font-size: 14px;
  color: var(--text-light);
  font-weight: 500;
  margin-bottom: 5px;
}

.point-card .text p {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-dark);
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}

/* Adoption Feed */
.adoption-feed h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-dark);
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;
}

.filter-bar .search-bar {
  flex-grow: 1;
  position: relative;
}

.filter-bar .search-bar i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.filter-bar .search-bar input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  background-color: var(--white);
}

.filter-bar .search-bar input:focus {
  outline: none;
  border-color: var(--secondary-color);
}

.btn-filter {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-filter:hover {
  background-color: var(--blue-dark);
}

/* Cat Grid - menggunakan class dari main.css */

/* Right Sidebar */
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background-color: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 15px;
}

.date-label {
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 15px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.activity-date-box {
  text-align: center;
  background-color: var(--blue-light);
  color: var(--secondary-color);
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 12px;
  min-width: 70px;
}

.activity-date-box span {
  display: block;
  font-size: 20px;
  line-height: 1.2;
}

.activity-details h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.activity-details p {
  font-size: 13px;
  color: var(--text-light);
}

.status-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-details .cat-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.status-details .cat-info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 10px;
}

.status-badge {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  width: 100%;
}

.status-badge.verification {
  background-color: var(--yellow-color);
  color: var(--text-dark);
}

.status-badge.rescued {
  background-color: var(--secondary-color);
  color: var(--white);
}

.btn-icon {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: var(--blue-dark);
}

.no-activity {
  text-align: center;
  padding: 20px;
  color: var(--text-light);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 992px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .points-summary {
    grid-template-columns: 1fr;
  }

  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 20px;
  }

  .welcome-banner p {
    font-size: 16px;
  }

  .welcome-banner h2 {
    font-size: 24px;
  }

  .welcome-banner .cat-illustration {
    height: 100px;
  }
  
  .welcome-image-wrapper {
    margin-left: 0;
    margin-top: 10px;
  }

  .filter-bar {
    flex-direction: column;
  }

  .btn-filter {
    width: 100%;
    justify-content: center;
  }

  .cat-adoption-grid {
    grid-template-columns: 1fr;
  }
}
</style>

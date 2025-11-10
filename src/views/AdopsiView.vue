<template>
  <main>
    <div class="main-header">
      <h1>Adopsi</h1>
      <span class="breadcrumb">ADOPSI / DAFTAR KUCING</span>
    </div>

    <div class="adoption-controls">
      <div class="control-buttons">
        <button @click="toggleFilter" :class="{ active: isFilterOpen }">
          <i class="fa-solid fa-filter"></i> Filter
        </button>
        <button @click="showList" :class="{ active: !isFilterOpen }">
          <i class="fa-solid fa-list"></i> Semua
        </button>
      </div>

      <div class="search-bar">
        <i class="fa-solid fa-search"></i>
        <input type="text" v-model="searchQuery" placeholder="Cari kucing sesuai keinginan..." />
      </div>
    </div>

    <!-- Filter Panel -->
    <transition name="slide-fade">
      <div v-if="isFilterOpen" class="filter-panel">
        <div class="filter-header">
          <h4>
            <i class="fa-solid fa-filter"></i>
            Filter Pencarian
          </h4>
        </div>
        <div class="filter-content">
        <div class="filter-options">
          <div class="filter-group">
              <label class="filter-group-title">
                <i class="fa-solid fa-venus-mars"></i>
                Jenis Kelamin
              </label>
              <div class="filter-checkboxes">
                <label class="filter-checkbox-item">
                  <input 
                    type="checkbox" 
                    value="betina" 
                    v-model="selectedFilters.gender"
                    @change="applyFilters"
                  />
                  <span>Betina</span>
            </label>
                <label class="filter-checkbox-item">
                  <input 
                    type="checkbox" 
                    value="jantan" 
                    v-model="selectedFilters.gender"
                    @change="applyFilters"
                  />
                  <span>Jantan</span>
            </label>
              </div>
          </div>

          <div class="filter-group">
              <label class="filter-group-title">
                <i class="fa-solid fa-cat"></i>
                Ras Kucing
              </label>
              <div class="filter-checkboxes">
                <label class="filter-checkbox-item">
                  <input 
                    type="checkbox" 
                    value="persia" 
                    v-model="selectedFilters.ras"
                    @change="applyFilters"
                  />
                  <span>Persia</span>
            </label>
                <label class="filter-checkbox-item">
                  <input 
                    type="checkbox" 
                    value="british" 
                    v-model="selectedFilters.ras"
                    @change="applyFilters"
                  />
                  <span>British</span>
            </label>
                <label class="filter-checkbox-item">
                  <input 
                    type="checkbox" 
                    value="domestik" 
                    v-model="selectedFilters.ras"
                    @change="applyFilters"
                  />
                  <span>Domestik</span>
            </label>
              </div>
            </div>
          </div>
        </div>
        <div class="filter-footer">
          <button @click="clearFilters" class="btn-clear-filter">
            <i class="fa-solid fa-rotate-left"></i>
            Reset Filter
          </button>
        </div>
      </div>
    </transition>

    <!-- Grid Card -->
    <div class="adopsi-grid">
      <div v-for="cat in filteredCats" :key="cat.id" class="adopsi-card">
        <img :src="cat.gambar" :alt="'Foto ' + cat.nama" />
        <div class="adopsi-card-body">
          <h3>{{ cat.nama }}</h3>

          <div class="cat-info">
            <span
              ><i :class="cat.gender === 'betina' ? 'fa-solid fa-venus' : 'fa-solid fa-mars'"></i>
              {{ cat.gender }}</span
            >
            <span><i class="fa-solid fa-cat"></i> {{ cat.ras }}</span>
            <span><i class="fa-solid fa-heart-pulse"></i> Sehat</span>
            <span><i class="fa-solid fa-calendar-days"></i> {{ cat.umurTeks }}</span>
          </div>

          <div class="shelter-info">
            <img :src="cat.shelter.avatar" alt="Logo Shelter" class="shelter-logo" />
            <span>{{ cat.shelter.nama }}</span>
            <span class="location">
              <i class="fa-solid fa-map-marker-alt"></i> {{ cat.shelter.lokasi }}
            </span>
          </div>

          <p>{{ cat.deskripsi }}</p>
          <RouterLink :to="'/adopsi/' + cat.id" class="btn-adopt">Adopsi</RouterLink>
        </div>
      </div>

      <p v-if="filteredCats.length === 0" style="grid-column: 1 / -1; text-align: center">
        Tidak ada kucing yang sesuai dengan filter.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// --- 1. DATA REAKTIF ---
const isFilterOpen = ref(false)
const searchQuery = ref('')
const selectedFilters = ref({
  gender: [],
  ras: [],
})

// --- 2. DATA DUMMY KUCING ---
const allCatsData = ref([
  {
    id: 'Mochi',
    nama: 'Mochi',
    gender: 'betina',
    ras: 'persia',
    umurTeks: '1 thn',
    gambar: "/image/adopsi/kucing 1.png",
    shelter:  {
      nama: 'Rumah Kucing BDG',
      lokasi: 'Bandung',
      avatar: "/image/adopsi/image.png",
    },
    deskripsi: 'Mochi adalah kucing penyayang, lembut, dan cocok untuk keluarga kecil.',
  },
  {
    id: 'Leo',
    nama: 'Leo',
    gender: 'jantan',
    ras: 'british',
    umurTeks: '8 bln',
    gambar: "/image/adopsi/kucing 2.png",
    shelter: {
      nama: 'Meow Shelter',
      lokasi: 'Jakarta',
      avatar: "/image/adopsi/image.png",
    },
    deskripsi: 'Leo aktif dan suka bermain, sangat cocok untuk pemilik yang energik.',
  },
  {
    id: 'Kiko',
    nama: 'Kiko',
    gender: 'jantan',
    ras: 'domestik',
    umurTeks: '1.5 thn',
    gambar: "/image/adopsi/kucing 3.png",
    shelter: {
      nama: 'Paw Friends',
      lokasi: 'Yogyakarta',
      avatar: "/image/adopsi/image.png",
    },
    deskripsi: 'Kiko mandiri dan penjelajah, namun manja bila sudah kenal.',
  },
])

// --- 3. COMPUTED ---
const filteredCats = computed(() => {
  return allCatsData.value.filter((cat) => {
    const matchGender =
      selectedFilters.value.gender.length === 0 || selectedFilters.value.gender.includes(cat.gender)
    const matchRas =
      selectedFilters.value.ras.length === 0 || selectedFilters.value.ras.includes(cat.ras)
    const matchSearch =
      searchQuery.value === '' ||
      cat.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cat.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchGender && matchRas && matchSearch
  })
})

// --- 4. METHODS ---
function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value
  console.log('Filter panel is now:', isFilterOpen.value ? 'OPEN' : 'CLOSED')
}

function showList() {
  isFilterOpen.value = false
}

function applyFilters() {
  // Filter akan otomatis ter-update karena menggunakan computed property
  // Function ini bisa digunakan untuk logging atau action tambahan
  console.log('Filters applied:', selectedFilters.value)
}

function clearFilters() {
  selectedFilters.value.gender = []
  selectedFilters.value.ras = []
  searchQuery.value = ''
}
</script>

<style scoped>
@import '@/assets/css/pages/adopsi.css';
</style>

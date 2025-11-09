<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import ChatSidebar from './components/ChatSidebar.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// 2. Buat "saklar" reaktif
const isSidebarOpen = ref(true)
const isChatSidebarOpen = ref(false)
const isBellDropdownOpen = ref(false)

// Data pengingat kucing (simulasi - bisa diambil dari store/composable)
const catReminders = ref([
  { id: 1, catName: "Leo", title: "Memberi Makan Pagi", time: "08:00", frequency: "harian", checked: true },
  { id: 2, catName: "Leo", title: "Memberi Vitamin", time: "08:00", frequency: "harian", checked: false },
  { id: 4, catName: "Mochi", title: "Memberi Makan Sore", time: "17:00", frequency: "harian", checked: true }
])

// Computed untuk pengingat yang aktif
const activeReminders = computed(() => {
  return catReminders.value.filter(r => r.checked)
})

// Computed untuk jumlah notifikasi
const notificationCount = computed(() => {
  return activeReminders.value.length
})

const isAuthLayout = computed(() => route.meta.layout === 'auth')
const isLandingLayout = computed(() => route.meta.layout === 'landing')

// 3. Buat fungsi untuk tombol burger
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Fungsi untuk membuka chat sidebar
function openChatSidebar() {
  console.log('openChatSidebar called!') // Debug
  isChatSidebarOpen.value = true
  console.log('isChatSidebarOpen:', isChatSidebarOpen.value) // Debug
}

// Fungsi untuk menutup chat sidebar
function closeChatSidebar() {
  isChatSidebarOpen.value = false
}

// Fungsi untuk navigasi ke profil
function goToProfile(event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  console.log('Navigating to profile') // Debug
  router.push('/profil')
}

// Fungsi untuk navigasi ke pengaturan (profil dengan tab pengaturan aktif)
function goToSettings() {
  router.push({ path: '/profil', query: { tab: 'pengaturan' } })
}

// Fungsi untuk toggle bell dropdown
function toggleBellDropdown() {
  isBellDropdownOpen.value = !isBellDropdownOpen.value
}

// Tutup dropdown saat klik di luar
function handleClickOutside(event) {
  // Jangan tutup jika klik di sidebar, chat button, chat sidebar, atau profile icon
  const target = event.target
  if (
    target.closest('.sidebar') || 
    target.closest('.chat-link-btn') || 
    target.closest('.chat-sidebar') ||
    target.closest('.fa-user-circle') ||
    target.classList.contains('chat-link-btn') ||
    target.classList.contains('fa-user-circle')
  ) {
    return
  }
  if (!target.closest('.bell-container')) {
    isBellDropdownOpen.value = false
  }
}

// Load dark mode dari localStorage saat mount
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    document.documentElement.classList.add('dark-mode')
  }
  
  // Tambahkan event listener untuk menutup dropdown
  document.addEventListener('click', handleClickOutside)
  
  // Update class untuk landing page
  updateLayoutClass()
})

// Watch route untuk update layout class
watch(() => route.meta.layout, () => {
  updateLayoutClass()
})

// Fungsi untuk update class pada body dan #app
function updateLayoutClass() {
  const appElement = document.getElementById('app')
  if (isLandingLayout.value) {
    document.body.classList.add('landing-page-active')
    if (appElement) {
      appElement.classList.add('landing-layout-active')
      appElement.style.display = 'block'
      appElement.style.width = '100%'
    }
  } else {
    document.body.classList.remove('landing-page-active')
    if (appElement) {
      appElement.classList.remove('landing-layout-active')
      appElement.style.display = ''
      appElement.style.width = ''
    }
  }
}

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div :class="{ 'landing-layout': isLandingLayout, 'landing-layout-wrapper': isLandingLayout }">
    <!-- Landing Page - No sidebar, no header -->
    <RouterView v-if="isLandingLayout || isAuthLayout" />
    <!-- App Layout - With sidebar and header -->
  <template v-else>
    <Sidebar :isOpen="isSidebarOpen" @openChat="openChatSidebar" />

    <div class="main-content-wrapper" :class="{ 'full-width': !isSidebarOpen }">

      <header class="header">
        <div class="left-side">
          <i class="fa-solid fa-bars" id="burgerMenuBtn" @click="toggleSidebar"></i>
        </div>
        <div class="right-side">
          <!-- Settings Icon untuk Navigasi ke Pengaturan -->
          <i 
            class="fa-solid fa-cog" 
            @click="goToSettings"
            title="Pengaturan"
            style="cursor: pointer;"
          ></i>
          
          <!-- Bell Icon dengan Dropdown -->
          <div class="bell-container" style="position: relative;">
            <div 
              @click="toggleBellDropdown"
              style="cursor: pointer; position: relative; display: inline-block;"
            >
          <i class="fa-solid fa-bell"></i>
              <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
            </div>
            
            <!-- Dropdown Pengingat -->
            <div v-if="isBellDropdownOpen" class="bell-dropdown">
              <div class="bell-dropdown-header">
                <h4>Pengingat Kucing</h4>
                <span class="notification-count-text">{{ notificationCount }} pengingat aktif</span>
              </div>
              <div class="bell-dropdown-body">
                <div 
                  v-for="reminder in activeReminders" 
                  :key="reminder.id"
                  class="reminder-notification-item"
                >
                  <div class="reminder-notification-icon">
                    <i class="fa-solid fa-cat"></i>
                  </div>
                  <div class="reminder-notification-content">
                    <div class="reminder-notification-title">{{ reminder.title }}</div>
                    <div class="reminder-notification-details">
                      <span class="cat-name">{{ reminder.catName }}</span>
                      <span class="reminder-time">
                        <i class="fa-solid fa-clock"></i> {{ reminder.time }}
                      </span>
                      <span class="reminder-frequency">{{ reminder.frequency }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="activeReminders.length === 0" class="no-reminders">
                  <i class="fa-solid fa-bell-slash"></i>
                  <p>Tidak ada pengingat aktif</p>
                </div>
              </div>
              <div class="bell-dropdown-footer">
                <router-link to="/rawat-kucing" @click="isBellDropdownOpen = false">
                  Kelola Pengingat
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Profile Icon -->
          <i 
            class="fa-solid fa-user-circle" 
            @click.stop="goToProfile"
            style="cursor: pointer; position: relative; z-index: 10;"
            title="Profil"
          ></i>
        </div>
      </header>

      <RouterView />

    </div>
    
    <!-- Chat Sidebar -->
    <ChatSidebar :isOpen="isChatSidebarOpen" @close="closeChatSidebar" />
  </template>
  </div>
</template>

<style scoped>
/* Kosongkan, kita pakai main.css */
</style>

<style>
/* Override untuk landing page layout */
.landing-layout {
  width: 100% !important;
  display: block !important;
}
</style>

<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import ChatSidebar from './components/ChatSidebar.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()
const router = useRouter()

// === STATE ===
const isSidebarOpen = ref(true)
const isChatSidebarOpen = ref(false)
const isBellDropdownOpen = ref(false)

const catReminders = ref([
  { id: 1, catName: "Leo", title: "Memberi Makan Pagi", time: "08:00", frequency: "harian", checked: true },
  { id: 2, catName: "Leo", title: "Memberi Vitamin", time: "08:00", frequency: "harian", checked: false },
  { id: 4, catName: "Mochi", title: "Memberi Makan Sore", time: "17:00", frequency: "harian", checked: true }
])

// === COMPUTED ===
const activeReminders = computed(() => catReminders.value.filter(r => r.checked))
const notificationCount = computed(() => activeReminders.value.length)

const isAuthLayout = computed(() => route.meta.layout === 'auth')
const isLandingLayout = computed(() => route.meta.layout === 'landing')

// User login check
const isLoggedIn = computed(() => localStorage.getItem("token") !== null)

// === FUNCTIONS ===
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function openChatSidebar() {
  isChatSidebarOpen.value = true
}

function closeChatSidebar() {
  isChatSidebarOpen.value = false
}

function goToProfile() {
  router.push('/profil')
}

function goToSettings() {
  router.push({ path: '/profil', query: { tab: 'pengaturan' } })
}

function toggleBellDropdown() {
  isBellDropdownOpen.value = !isBellDropdownOpen.value
}

// Tutup dropdown saat klik di luar
function handleClickOutside(event) {
  const target = event.target
  if (
    target.closest('.sidebar') ||
    target.closest('.chat-link-btn') ||
    target.closest('.chat-sidebar') ||
    target.closest('.fa-user-circle')
  ) return

  if (!target.closest('.bell-container')) {
    isBellDropdownOpen.value = false
  }
}

// Update layout class saat ganti halaman
function updateLayoutClass() {
  const appEl = document.getElementById('app')

  if (isLandingLayout.value) {
    document.body.classList.add('landing-page-active')
    appEl?.classList.add('landing-layout-active')
  } else {
    document.body.classList.remove('landing-page-active')
    appEl?.classList.remove('landing-layout-active')
  }
}

// === MOUNTED ===
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updateLayoutClass()
})

watch(() => route.meta.layout, updateLayoutClass)

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


<template>
  <!-- 🔵 Layout khusus landing/auth -->
  <div :class="{ 'landing-layout': isLandingLayout, 'landing-layout-wrapper': isLandingLayout }">
    <RouterView v-if="isLandingLayout || isAuthLayout" />

    <!-- 🟩 Layout aplikasi utama (setelah login) -->
    <template v-else>
      <!-- Sidebar hanya tampil kalau user login -->
      <Sidebar
        v-if="isLoggedIn"
        :isOpen="isSidebarOpen"
        @openChat="openChatSidebar"
      />

      <div class="main-content-wrapper" :class="{ 'full-width': !isSidebarOpen }">

        <!-- Header hanya muncul kalau login -->
        <header class="header" v-if="isLoggedIn">
          <div class="left-side">
            <i class="fa-solid fa-bars" @click="toggleSidebar"></i>
          </div>
          <div class="right-side">

            <!-- SETTINGS ICON -->
            <i class="fa-solid fa-cog" @click="goToSettings" title="Pengaturan"></i>

            <!-- BELL -->
            <div class="bell-container">
              <div @click="toggleBellDropdown">
                <i class="fa-solid fa-bell"></i>
                <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
              </div>

              <!-- DROPDOWN -->
              <div v-if="isBellDropdownOpen" class="bell-dropdown">
                <div class="bell-dropdown-header">
                  <h4>Pengingat Kucing</h4>
                  <span>{{ notificationCount }} pengingat aktif</span>
                </div>

                <div class="bell-dropdown-body">
                  <div v-for="r in activeReminders" :key="r.id" class="reminder-notification-item">
                    <i class="fa-solid fa-cat"></i>
                    <div>
                      <div>{{ r.title }}</div>
                      <small>{{ r.catName }} • {{ r.time }} • {{ r.frequency }}</small>
                    </div>
                  </div>

                  <div v-if="activeReminders.length === 0" class="no-reminders">
                    <i class="fa-solid fa-bell-slash"></i>
                    <p>Tidak ada pengingat aktif</p>
                  </div>
                </div>

                <div class="bell-dropdown-footer">
                  <RouterLink to="/rawat-kucing" @click="isBellDropdownOpen = false">
                    Kelola Pengingat
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- PROFILE -->
            <i class="fa-solid fa-user-circle" @click="goToProfile"></i>
          </div>
        </header>

        <!-- Content -->
        <RouterView />
      </div>

      <!-- Chat -->
      <ChatSidebar :isOpen="isChatSidebarOpen" @close="closeChatSidebar" />
    </template>
  </div>
</template>


<style scoped>
/* Kosong */
</style>

<style>
.landing-layout {
  width: 100% !important;
}
</style>

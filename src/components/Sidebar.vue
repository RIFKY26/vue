<template>
  <aside class="sidebar" :class="{ 'hidden': !isOpen }">
    <div class="sidebar-header">AdoptMeow</div>
    <nav>
      <h3>Filter Utama</h3>
      <ul>
        <li><RouterLink to="/app/home"><i class="fa-solid fa-house"></i> Beranda</RouterLink></li>
        <li><RouterLink to="/lapor"><i class="fa-solid fa-flag"></i> Lapor</RouterLink></li>
        <li><RouterLink to="/adopsi"><i class="fa-solid fa-paw"></i> Adopsi</RouterLink></li>
        <li><RouterLink to="/donasi"><i class="fa-solid fa-hand-holding-dollar"></i> Donasi</RouterLink></li>
        <li><RouterLink to="/peringkat"><i class="fa-solid fa-ranking-star"></i> Peringkat</RouterLink></li>
        <li><RouterLink to="/rawat-kucing"><i class="fa-solid fa-notes-medical"></i> Rawat Kucing</RouterLink></li>
      </ul>
      <h3>Pengguna</h3>
      <ul>
        <li><RouterLink to="/profil"><i class="fa-solid fa-user"></i> Profil</RouterLink></li>
        <li class="chat-menu-item">
          <button 
            @click.prevent="handleOpenChat" 
            class="chat-link-btn"
            type="button"
          >
            <i class="fa-solid fa-comments"></i> Chat
          </button>
        </li>
        <li>
          <button @click="handleLogout" class="logout-btn">
            <i class="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

// Terima 'prop' isOpen dari App.vue
defineProps({
  isOpen: Boolean
})

const router = useRouter()

// Emit event untuk membuka chat
const emit = defineEmits(['openChat'])

// Handler untuk membuka chat
function handleOpenChat(event) {
  event?.preventDefault()
  event?.stopPropagation()
  console.log('Chat button clicked!') // Debug
  emit('openChat')
}

// Handler untuk logout
function handleLogout() {
  // Clear authentication state
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userEmail')
  // Redirect ke landing page
  router.push('/')
}
</script>

<style scoped>
nav a.router-link-exact-active {
  background-color: #EFF6FF;
  color: #3B82F6;
}

.sidebar ul li button.chat-link-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: var(--text-light);
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: inherit;
  border-radius: 8px;
  cursor: pointer !important;
  pointer-events: auto !important;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 100;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}

.sidebar ul li button.chat-link-btn:hover {
  background-color: var(--blue-light);
  color: var(--secondary-color);
}

.sidebar ul li button.chat-link-btn i {
  width: 20px;
  text-align: center;
}

.sidebar ul li button.chat-link-btn:active {
  transform: scale(0.98);
}

.sidebar ul li button.chat-link-btn:focus {
  outline: none;
}

.sidebar ul li.chat-menu-item {
  position: relative;
  z-index: 100;
}

.sidebar ul li.chat-menu-item button {
  position: relative;
  z-index: 101;
}

.sidebar ul li button.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: var(--text-light);
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
  font-size: inherit;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.sidebar ul li button.logout-btn:hover {
  background-color: var(--blue-light);
  color: var(--secondary-color);
}

.sidebar ul li button.logout-btn i {
  width: 20px;
  text-align: center;
}
</style>


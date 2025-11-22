<template>
  <main class="login-container">
    <div class="left-panel" :style="{ '--bg-image': `url(${backgroundImage})` }">
      <img :src="kucingImage" alt="Kucing Lucu" class="cat-illustration">
      <h2 class="tagline">Lupa password?</h2>
    </div>

    <div class="right-panel">
      <div class="login-form-wrapper">
        <h1>Lupa Kata Sandi User</h1>
        <p class="subtitle">Masukkan email untuk reset kata sandi</p>

        <form @submit.prevent="handleReset" class="login-form">
          <div class="input-group">
            <i class="fa-solid fa-at icon"></i>
            <input 
              type="email" 
              v-model="email"
              placeholder="Email" 
              required
            >
          </div>
          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Kirim Link Reset</span>
            <span v-else>
              <i class="fa-solid fa-spinner fa-spin"></i> Mengirim...
            </span>
          </button>
        </form>

        <div class="links-section">
          <router-link to="/login-user" class="forgot-password">
            <i class="fa-solid fa-arrow-left icon"></i> Kembali ke login
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/auth.css'
import kucingImage from '@/assets/images/kucing.svg'
import backgroundImage from '@/assets/images/background.jpg'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)

function handleReset() {
  if (!email.value) {
    alert('Harap masukkan email')
    return
  }

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    alert('Link reset password telah dikirim ke email Anda')
    router.push('/login-user')
  }, 1000)
}
</script>


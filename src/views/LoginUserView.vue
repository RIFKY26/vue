<template>
  <main class="login-container"> 
    <!-- Panel Kiri -->
    <div class="left-panel" :style="{ '--bg-image': `url(${backgroundImage})` }">
      <img :src="kucing" alt="Kucing Lucu" class="cat-illustration">
      <h2 class="tagline">Mulailah bergabung bersama pecinta kucing</h2>
    </div>

    <!-- Panel Kanan -->
    <div class="right-panel">
      <div class="login-form-wrapper">
        <h1>Selamat datang kembali,</h1>
        <p class="subtitle"><span class="action-text">Masuk</span> untuk melanjutkan</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="input-group">
            <i class="fa-solid fa-at icon"></i>
            <input 
              type="email" 
              v-model="formData.email" 
              placeholder="Email" 
              required
            >
          </div>

          <!-- Password -->
          <div class="input-group password-group">
            <i class="fa-solid fa-lock icon"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.password" 
              placeholder="Kata Sandi" 
              required
            >
            <i 
              :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              class="eye-icon" 
              @click="togglePassword"
            ></i>
          </div>

          <!-- Checkbox -->
          <div class="checkbox-group">
            <input type="checkbox" id="remember-me" v-model="formData.rememberMe">
            <label for="remember-me">Ingat Saya</label>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Masuk</span>
            <span v-else>
              <i class="fa-solid fa-spinner fa-spin"></i> Memproses...
            </span>
          </button>
        </form>

        <!-- Links -->
        <div class="links-section">
          <router-link to="/forgot-password-user" class="forgot-password">
            <i class="fa-solid fa-key icon"></i> Lupa Kata Sandi?
          </router-link>
          <p class="register-link">
            Belum punya akun? <router-link to="/register-user">Daftar</router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/css/auth.css'
import kucing from '@/assets/images/kucing.svg'
import backgroundImage from '@/assets/images/background.jpg'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const isLoading = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

function handleLogin() {
  if (!formData.value.email || !formData.value.password) {
    alert('Harap isi email dan kata sandi')
    return
  }

  isLoading.value = true

  // Simulasi proses login
  setTimeout(() => {
    isLoading.value = false
    // Simpan status autentikasi
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('userEmail', formData.value.email)
    // Redirect ke dashboard setelah login berhasil
    router.push('/app/home')
  }, 1000)
}
</script>

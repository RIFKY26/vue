<template>
  <main class="pilihan-login-container">
    <div class="login-box">
      <h2 class="login-title">Login</h2>
      <img :src="kucingImage" alt="Ilustrasi Kucing Lucu" class="cat-image">
      <p class="description">
        Silakan pilih salah satu akun yang sesuai dengan peran Anda untuk melanjutkan proses login!
      </p>
      <div class="button-group">
        <button class="btn btn-cat-lover" @click="goToUserLogin">Pecinta Kucing</button>
        <button class="btn btn-shelter" @click="goToShelterLogin">Shelter</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import '@/assets/css/PilihanLogin.css'
import kucingImage from '@/assets/images/kucing.svg'

const router = useRouter()

function goToUserLogin() {
  router.push('/login-user')
}

function goToShelterLogin() {
  // Shelter login belum tersedia
  alert('Fitur login Shelter akan segera tersedia!')
}
</script>


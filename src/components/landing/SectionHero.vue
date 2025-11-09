<script setup>
import { useRouter } from 'vue-router'
import cakar from '@/assets/images/landing/cakar.png'
import kucing from '@/assets/images/landing/kucing.png'

const router = useRouter()

function goToLogin() {
  router.push('/auth')
}

function goToRegister() {
  router.push('/register-user')
}
</script>

<template>
  <section class="hero-section" id="beranda">
    <div class="container hero-content">
      <div class="hero-text">
        <h1>
          <span class="line1">AdoptMeow</span> <br />
          <span class="line2">Temukan Rumah</span> <br />
          <span class="line3">Selamatkan Nyawa</span>
        </h1>
        <p>
          AdoptMeow Hadir Untuk Memudahkan Siapa Saja Yang Ingin Mengadopsi Kucing Terlantar. Kami Juga Menghubungkan Relawan dan Komunitas Mereka Kepada Kucing-Kucing Terlantar Mereka Kembali Lewat Adopsi.
        </p>
        <div class="hero-buttons">
          <a href="#" @click.prevent="goToLogin" class="btn btn-primary">Mulai Beradopsi</a>
          <a href="#" @click.prevent="goToRegister" class="btn btn-secondary">Bergabunglah</a>
        </div>
      </div>
      <div class="hero-image-container">
        <img :src="cakar" alt="Dekorasi cakar kucing" class="paw-print-decor paw-1" />
        <img :src="kucing" alt="Seekor kucing utama" class="main-cat" />
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>


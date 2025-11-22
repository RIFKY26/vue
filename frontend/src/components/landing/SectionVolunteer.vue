<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToRegister() {
  router.push('/register-user')
}
</script>

<template>
  <section class="save-more-section" id="relawan">
    <div class="container">
      <h2>Bersama Kita Bisa Menyelamatkan Lebih Banyak Nyawa</h2>
      <p>Kucing tidak hanya butuh makanan, tapi juga kasih sayang dan tempat aman. Dengan adopsi dan laporan, kita bisa bekerja sama dan berdua.</p>
      <a href="#" @click.prevent="goToRegister" class="btn btn-secondary">Selamatkan</a>
    </div>
  </section>
</template>

<style scoped>
</style>


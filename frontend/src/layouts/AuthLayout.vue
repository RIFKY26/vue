<template>
  <div class="auth-layout">
    <div class="auth-card">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted, onUnmounted } from 'vue'; // <-- 1. Impor

onMounted(() => {
  // 2. Bersihkan class layout lain
  document.body.classList.remove('dashboard-layout', 'sidebar-collapsed');
  // 3. Tambahkan class khusus untuk body halaman auth (opsional)
  document.body.classList.add('auth-body');
})

onUnmounted(() => {
  // 4. Bersihkan class saat meninggalkan layout ini
  document.body.classList.remove('auth-body');
})
</script>


<style module>
@import '@/assets/login.css';
</style>
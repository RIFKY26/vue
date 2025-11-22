<template>
  <div class="dashboard-layout">
    <div class="mobile-overlay" @click="toggleSidebar"></div>
    <SidebarAdopter v-if="auth.isAdopter" />
    <SidebarShelter v-else-if="auth.isShelter" />
    <div class="main-content-wrapper">
      <Header @toggle-sidebar="toggleSidebar" />
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import SidebarAdopter from '@/components/SidebarAdopter.vue'
import SidebarShelter from '@/components/SidebarShelter.vue'
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(isSidebarOpen, (open) => {
  document.body.classList.toggle('sidebar-collapsed', !open)
})

onMounted(() => {
  if (window.innerWidth < 992) {
    isSidebarOpen.value = false
    document.body.classList.add('sidebar-collapsed')
  }
})
</script>

<!-- ✅ Hanya layout ini yang import CSS dashboard -->
<style>
@import '@/assets/style.css';
</style>

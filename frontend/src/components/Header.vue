<template>
  <header class="header">
    
    <div class="left-side">
      <button class="hamburger-btn" @click="$emit('toggleSidebar')">
        <i class="fa-solid fa-bars"></i>
      </button>
      <span class="breadcrumb">{{ $route.meta.breadcrumb || 'BERANDA' }}</span>
    </div>
      
    <div class="right-side">
      <i class="fa-solid fa-message"></i>
      <i class="fa-solid fa-user-circle"></i>
    </div>

  </header>
</template>

<script setup>
defineEmits(['toggleSidebar'])
</script>
<template>
  <aside class="sidebar">
    <div class="sidebar-header">AdoptMeow</div>
    <nav>
      <h3>Menu Utama Shelter</h3>
      <ul>
        <li><RouterLink to="/shelter/beranda"><i class="fa-solid fa-house"></i> Beranda</RouterLink></li>
        <li><RouterLink to="/shelter/laporan"><i class="fa-solid fa-clipboard-list"></i> Laporan</RouterLink></li>
        <li><RouterLink to="/shelter/adopsi"><i class="fa-solid fa-paw"></i> Adopsi</RouterLink></li>
        <li><RouterLink to="/shelter/donasi"><i class="fa-solid fa-hand-holding-dollar"></i> Donasi</RouterLink></li>
      </ul>
      <h3>Pengaturan</h3>
      <ul>
        <li><RouterLink to="/shelter/profil"><i class="fa-solid fa-shield-cat"></i> Profil Shelter</RouterLink></li>
        <li><a href="#"><i class="fa-solid fa-right-from-bracket"></i> Keluar</a></li>
      </ul>
    </nav>
  </aside>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
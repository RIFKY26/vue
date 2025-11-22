// 📁 src/store/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // STATE: Simpan peran pengguna. Ganti 'adopter' jadi 'shelter' untuk menguji
  const userRole = ref('adopter')

  // GETTERS: Cara mudah mengecek peran
  const isAdopter = computed(() => userRole.value === 'adopter')
  const isShelter = computed(() => userRole.value === 'shelter')

  // ACTIONS: Fungsi untuk mengubah state (dipakai saat login/logout)
  function loginAsAdopter() {
    userRole.value = 'adopter'
  }
  function loginAsShelter() {
    userRole.value = 'shelter'
  }
  function logout() {
    userRole.value = null
  }

  return { userRole, isAdopter, isShelter, loginAsAdopter, loginAsShelter, logout }
})

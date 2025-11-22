import { ref } from 'vue'

// Global state untuk dark mode
const isDarkMode = ref(false)

// Load dark mode dari localStorage saat pertama kali
if (typeof window !== 'undefined') {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark-mode')
  }
}

export function useDarkMode() {
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}


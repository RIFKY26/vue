import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 3. Impor Cangkang Aplikasi (App.vue) dan Peta Situs (Router)
import App from './App.vue'
import router from './router'

// 4. Buat aplikasi
const app = createApp(App)

// 5. Beritahu Vue untuk MENGGUNAKAN Pinia dan Router
app.use(createPinia()) // (Ini akan mengaktifkan Pinia)
app.use(router) // (Ini akan mengaktifkan Router)

// 6. Tampilkan aplikasi di layar
app.mount('#app')

import { createRouter, createWebHistory } from 'vue-router'
import LandingPageView from '../views/LandingPageView.vue'

// Simulasi authentication state (dalam aplikasi nyata, ini akan dari store/API)
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Landing Page (Homepage) - Public
    { 
      path: '/', 
      name: 'landing', 
      component: LandingPageView,
      meta: { requiresAuth: false, layout: 'landing' }
    },

    // Halaman autentikasi - Public
    {
      path: '/auth',
      name: 'pilih-login',
      component: () => import('../views/auth/PilihLoginView.vue'),
      meta: { layout: 'auth', requiresAuth: false }
    },
    {
      path: '/login-user',
      name: 'login-user',
      component: () => import('../views/LoginUserView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/login-shelter',
      name: 'login-shelter',
      component: () => import('../views/auth/LoginShelterView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/register-user',
      name: 'register-user',
      component: () => import('../views/RegistrasiUserView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/register-shelter',
      name: 'register-shelter',
      component: () => import('../views/auth/RegistrasiShelterView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/forgot-password-user',
      name: 'forgot-password-user',
      component: () => import('../views/auth/LupaPasswordUserView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/forgot-password-shelter',
      name: 'forgot-password-shelter',
      component: () => import('../views/auth/LupaPasswordShelterView.vue'),
      meta: { layout: 'auth' }
    },

    { 
      path: '/adopsi', 
      name: 'adopsi', 
      component: () => import('../views/AdopsiView.vue'),
      meta: { requiresAuth: true }
    },
    
    {
      path: '/adopsi/:id',
      name: 'adopsi-detail',
      component: () => import('../views/FormAdopsiView.vue'),
      meta: { requiresAuth: true }
    },

    { 
      path: '/donasi', 
      name: 'donasi', 
      component: () => import('../views/DonasiView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/donasi/:id', 
      name: 'donasi-detail',
      component: () => import('../views/DonasiDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pembayaran/:id',
      name: 'pembayaran-donasi',
      component: () => import('../views/PembayaranDonasiView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/lapor', 
      name: 'lapor', 
      component: () => import('../views/LaporView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/form-lapor', 
      name: 'form-lapor', 
      component: () => import('../views/FormLaporView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/peringkat', 
      name: 'peringkat', 
      component: () => import('../views/PeringkatView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/rawat-kucing', 
      name: 'rawat-kucing', 
      component: () => import('../views/RawatKucingView.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/profil', 
      name: 'profil', 
      component: () => import('../views/ProfilView.vue'),
      meta: { requiresAuth: true }
    },
    // Dashboard/Home setelah login
    { 
      path: '/app/home', 
      name: 'app-home', 
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Route Guard - Memastikan user harus login untuk mengakses halaman aplikasi
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !isAuthenticated()) {
    // Redirect ke halaman login jika belum login
    next('/auth')
  } else if (to.path === '/auth' && isAuthenticated()) {
    // Jika sudah login dan mencoba akses halaman auth, redirect ke dashboard
    next('/app/home')
  } else {
    next()
  }
})

export default router

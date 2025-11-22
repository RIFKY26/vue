import { createRouter, createWebHistory } from 'vue-router'
import LandingPageView from '../views/LandingPageView.vue'

// 🌟 Cek apakah user punya token (berarti sudah login)
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ============================================================
    // PUBLIC PAGES (TIDAK PERLU LOGIN)
    // ============================================================
    {
      path: '/',
      name: 'landing',
      component: LandingPageView,
      meta: { requiresAuth: false, layout: 'landing' },
    },

    {
      path: '/auth',
      name: 'pilih-login',
      component: () => import('../views/auth/PilihLoginView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },

    {
      path: '/login-user',
      name: 'login-user',
      component: () => import('../views/LoginUserView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },

    {
      path: '/register-user',
      name: 'register-user',
      component: () => import('../views/RegistrasiUserView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },

    // ============================================================
    // PRIVATE PAGES (WAJIB LOGIN)
    // ============================================================
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/adopsi',
      name: 'adopsi',
      component: () => import('../views/AdopsiView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/adopsi/:id',
      name: 'adopsi-detail',
      component: () => import('../views/FormAdopsiView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/donasi',
      name: 'donasi',
      component: () => import('../views/DonasiView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/donasi/:id',
      name: 'donasi-detail',
      component: () => import('../views/DonasiDetailView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/pembayaran/:id',
      name: 'pembayaran-donasi',
      component: () => import('../views/PembayaranDonasiView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/lapor',
      name: 'lapor',
      component: () => import('../views/LaporView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/form-lapor',
      name: 'form-lapor',
      component: () => import('../views/FormLaporView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/peringkat',
      name: 'peringkat',
      component: () => import('../views/PeringkatView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/rawat-kucing',
      name: 'rawat-kucing',
      component: () => import('../views/RawatKucingView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/ProfilView.vue'),
      meta: { requiresAuth: true },
    },

    // ============================================================
    // 404 fallback → selalu kembali ke landing
    // ============================================================
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ==================================================================
// 🔥 ROUTER GUARD PALING FINAL (INIT MOHON PAKAI INI)
// ==================================================================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  // 🔥 Jika halaman butuh login & user belum login → redirect login
  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login-user')
  }

  next()
})


export default router

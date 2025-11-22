<template>
  <main class="login-container">
    <div class="left-panel">
      <div class="pattern-overlay"></div>
      <img :src="catImage" alt="Kucing Lucu" class="cat-illustration">
      <h2 class="tagline">Mulailah bergabung bersama shelter</h2>
    </div>

    <div class="right-panel">
      <div class="login-form-wrapper">
        <h1>Selamat datang kembali,</h1>
        <p class="subtitle"><span class="action-text">Masuk</span> untuk melanjutkan</p>

        <form class="login-form">
          <div class="input-group">
            <i class="fas fa-at icon"></i>
            <input type="email" placeholder="Email" required>
          </div>
          <div class="input-group password-group">
            <i class="fas fa-lock icon"></i>
            <input type="password" placeholder="Kata Sandi" required>
            <i class="fas fa-eye eye-icon"></i>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="remember-me">
            <label for="remember-me">Ingat Saya</label>
          </div>
          <button type="submit" class="login-button">Masuk</button>
        </form>

        <div class="links-section">
          <router-link to="/forgot-password-shelter" class="forgot-password">
            <i class="fas fa-key icon"></i> Lupa Kata Sandi?
          </router-link>
          <p class="register-link">
            Belum punya akun? <router-link to="/register-shelter">Daftar</router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import '@/assets/css/auth.css'

export default {
  name: 'LoginShelterView',
  data() {
    return {
      catImage: 'https://i.imgur.com/gTUKs4H.png'
    }
  }
}
</script>


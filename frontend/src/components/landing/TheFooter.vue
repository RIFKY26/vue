<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDonasi() {
  router.push('/auth')
}

function goToRegister() {
  router.push('/register-user')
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer>
    <div class="footer-content-wrapper">
      <div class="footer-grid">
        <div class="footer-about">
          <h3>AdoptMeow</h3>
          <p>AdoptMeow adalah Aplikasi Adopsi Kucing yang menghubungkan Pelapor, Adopter, dan Relawan. Aplikasi ini dirancang untuk memudahkan proses adopsi kucing terlantar dengan cepat, mudah, dan gratis. Lebih dari itu, kami ingin membangun komunitas peduli.</p>
          <a href="#" @click.prevent="goToDonasi" class="btn btn-primary">Berdonasi</a>
          <a href="#" @click.prevent="goToRegister" class="btn btn-secondary">Bergabung</a>
        </div>

        <div class="footer-contact">
          <h4>Kontak Kami</h4>
          <div class="contact-item">
            <i class="fa-solid fa-phone"></i>
            <span>088229059233</span>
          </div>
          <div class="contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span>adoptmeow@email.com</span>
          </div>
          <div class="contact-item">
            <i class="fa-brands fa-instagram"></i>
            <span>@adoptmeow</span>
          </div>
        </div>

        <div class="footer-nav">
          <h4>Navigasi</h4>
          <ul>
            <li><a href="#beranda" @click.prevent="scrollToSection('beranda')">Beranda</a></li>
            <li><a href="#tentang-kami" @click.prevent="scrollToSection('tentang-kami')">Tentang Kami</a></li>
            <li><a href="#panduan" @click.prevent="scrollToSection('panduan')">Panduan</a></li>
            <li><a href="#relawan" @click.prevent="scrollToSection('relawan')">Relawan</a></li>
          </ul>
        </div>
      </div>

      <p class="copyright">© 2025 AdoptMeow - Kelompok 27</p>
    </div>
  </footer>
</template>

<style scoped>
</style>


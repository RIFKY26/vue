<template>
  <main class="login-container">
    <div class="left-panel" :style="{ '--bg-image': `url(${backgroundImage})` }">
      <img :src="kucingImage" alt="Kucing Lucu" class="cat-illustration">
      <h2 class="tagline">Mulailah bergabung sebagai pecinta kucing</h2>
    </div>

    <div class="right-panel">
      <div class="login-form-wrapper">
        <h1>Halo selamat datang!</h1>
        <p class="subtitle">
          <span class="action-text">Daftar</span>, dan bergabung bersama kami
        </p>

        <!-- FORM REGISTER -->
        <form @submit.prevent="handleRegister" class="login-form">

          <div class="input-group">
            <i class="fa-solid fa-at icon"></i>
            <input
              type="email"
              v-model="formData.email"
              placeholder="Email"
              required
            />
          </div>

          <div class="input-group">
            <i class="fa-solid fa-phone icon"></i>
            <input
              type="tel"
              v-model="formData.phone"
              placeholder="No Telepon"
              required
            />
          </div>

          <div class="input-group">
            <i class="fa-solid fa-user icon"></i>
            <input
              type="text"
              v-model="formData.name"
              placeholder="Nama"
              required
            />
          </div>

          <div class="input-group password-group">
            <i class="fa-solid fa-lock icon"></i>
            <input
              :type="showPassword1 ? 'text' : 'password'"
              v-model="formData.password"
              placeholder="Kata Sandi"
              required
            />
            <i
              :class="showPassword1 ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              class="eye-icon"
              @click="togglePassword1"
            ></i>
          </div>

          <div class="input-group password-group">
            <i class="fa-solid fa-lock icon"></i>
            <input
              :type="showPassword2 ? 'text' : 'password'"
              v-model="formData.confirmPassword"
              placeholder="Konfirmasi Kata Sandi"
              required
            />
            <i
              :class="showPassword2 ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              class="eye-icon"
              @click="togglePassword2"
            ></i>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Daftar</span>
            <span v-else>
              <i class="fa-solid fa-spinner fa-spin"></i> Memproses...
            </span>
          </button>

        </form>

        <div class="links-section">
          <p class="register-link">
            Sudah punya akun? <router-link to="/login-user">Masuk</router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import "@/assets/css/auth.css";
import kucingImage from "@/assets/images/kucing.svg";
import backgroundImage from "@/assets/images/background.jpg";

const router = useRouter();

const formData = ref({
  email: "",
  phone: "",
  name: "",
  password: "",
  confirmPassword: ""
});

const showPassword1 = ref(false);
const showPassword2 = ref(false);
const isLoading = ref(false);

function togglePassword1() {
  showPassword1.value = !showPassword1.value;
}

function togglePassword2() {
  showPassword2.value = !showPassword2.value;
}

import api from "@/services/api";

async function handleRegister() {
  if (!formData.value.email || !formData.value.phone || !formData.value.name ||
      !formData.value.password || !formData.value.confirmPassword) {
    alert("Harap lengkapi semua field");
    return;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    alert("Password tidak cocok");
    return;
  }

  isLoading.value = true;

  try {
    // Kita gunakan email sebagai username default jika user tidak menginput username terpisah
    await api.post("/auth/signup", {
      username: formData.value.email,
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone,
      name: formData.value.name
    });

    alert("Registrasi berhasil! Silakan login");
    router.push("/login-user");

  } catch (error) {
    // Menangkap pesan error dari backend
    const msg = error.response?.data?.error || error.response?.data?.message || "Terjadi kesalahan";
    alert(msg);
  }

  isLoading.value = false;
}

</script>

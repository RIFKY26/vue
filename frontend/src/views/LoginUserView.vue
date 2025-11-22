<template>
  <main class="login-container">
    <div class="left-panel" :style="{ '--bg-image': `url(${backgroundImage})` }">
      <img :src="kucing" alt="Kucing Lucu" class="cat-illustration">
      <h2 class="tagline">Mulailah bergabung bersama pecinta kucing</h2>
    </div>

    <div class="right-panel">
      <div class="login-form-wrapper">
        <h1>Selamat datang kembali,</h1>
        <p class="subtitle"><span class="action-text">Masuk</span> untuk melanjutkan</p>

        <!-- FORM LOGIN -->
        <form @submit.prevent="handleLogin" class="login-form">

          <div class="input-group">
            <i class="fa-solid fa-at icon"></i>
            <input
              type="email"
              v-model="formData.email"
              placeholder="Email"
              required
            />
          </div>

          <div class="input-group password-group">
            <i class="fa-solid fa-lock icon"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              placeholder="Kata Sandi"
              required
            />
            <i
              :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              class="eye-icon"
              @click="togglePassword"
            ></i>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <span v-if="!isLoading">Masuk</span>
            <span v-else>
              <i class="fa-solid fa-spinner fa-spin"></i> Memproses...
            </span>
          </button>

        </form>

        <div class="links-section">
          <p class="register-link">
            Belum punya akun? <router-link to="/register-user">Daftar</router-link>
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
import kucing from "@/assets/images/kucing.svg";
import backgroundImage from "@/assets/images/background.jpg";

const router = useRouter();

const formData = ref({
  email: "",
  password: ""
});

const showPassword = ref(false);
const isLoading = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

import api from "@/services/api";

async function handleLogin() {
  if (!formData.value.email || !formData.value.password) {
    alert("Email dan password wajib diisi!");
    return;
  }

  isLoading.value = true;

  try {
    const res = await api.post("/auth/login", {
      username: formData.value.email,
      password: formData.value.password
    });

    // Simpan token
    localStorage.setItem("token", res.data.token);

    // Simpan user jika diperlukan
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Login berhasil!");

    router.push("/home");

  } catch (error) {
    alert(error.response?.data?.message || "Login gagal");
  }

  isLoading.value = false;
}

</script>

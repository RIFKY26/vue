<template>
    <main>
      <div class="main-header">
        <h1>Pengisian Formulir Adopsi</h1>
        <span class="breadcrumb">ADOPSI / PENGISIAN FORMULIR</span>
      </div>
  
      <div v-if="!currentCat">
        <h2>Kucing Tidak Ditemukan</h2>
      </div>
  
      <div v-else class="adoption-container">
        <div class="cat-detail-card">
          <h4>Identitas Kucing</h4>
          <img :src="currentCat.image" alt="Foto Kucing" class="main-pic">
          <h3>{{ currentCat.name }}</h3>
          <div class="cat-info-tags">
            <span class="tag">
              <i :class="currentCat.tags.genderIcon"></i>
              <span>{{ currentCat.tags.gender }}</span>
            </span>
            <span class="tag">
              <i class="fa-solid fa-paw"></i>
              <span>{{ currentCat.tags.breed }}</span>
            </span>
            <span class="tag">
              <i class="fa-solid fa-heart-pulse"></i>
              <span>{{ currentCat.tags.health }}</span>
            </span>
          </div>
          <div class="shelter-info">
            <img :src="currentCat.shelter.avatar" alt="Avatar Shelter" class="shelter-logo" />
            <div class="shelter-details">
              <span class="shelter-name">{{ currentCat.shelter.name }}</span>
              <span class="shelter-location">
                <i class="fa-solid fa-map-marker-alt"></i>
                {{ currentCat.shelter.location }}
              </span>
            </div>
          </div>
          <p>{{ currentCat.description }}</p>
          <button @click="openChat" class="btn-contact">
            <i class="fa-solid fa-comments"></i> Hubungi Shelter
          </button>
        </div>
  
        <div class="adoption-form-card">
          <div class="form-tabs">
            <button :class="{ active: currentStep === 'informasi' }">Informasi</button>
            <button :class="{ active: currentStep === 'verifikasi' }">Verifikasi</button>
            <button :class="{ active: currentStep === 'adopsi' }">Adopsi</button>
          </div>
  
          <div class="form-content">
            <div v-if="currentStep === 'informasi'" class="form-step active">
              <h4>JELASKAN ALASAN ADOPSI KUCING INI</h4>
              <form @submit.prevent="submitForm">
                <div class="form-question">
                  <label>Apakah sebelumnya sudah pernah merawat kucing?</label>
                  <div class="radio-group">
                    <label><input type="radio" name="pernah-rawat" value="pernah" v-model="formData.pernahRawat" required> Pernah</label>
                    <label><input type="radio" name="pernah-rawat" value="belum" v-model="formData.pernahRawat"> Belum</label>
                  </div>
                </div>
                <div class="form-question">
                  <label>Penghasilan apakah cukup untuk merawat kucing?</label>
                  <div class="radio-group">
                    <label><input type="radio" name="cukup-uang" value="cukup" v-model="formData.cukupUang" required> Cukup</label>
                    <label><input type="radio" name="cukup-uang" value="tidak" v-model="formData.cukupUang"> Tidak</label>
                  </div>
                </div>
                <div class="form-question">
                  <label>Apakah ada waktu luang untuk merawat kucing?</label>
                  <div class="radio-group">
                    <label><input type="radio" name="ada-waktu" value="ada" v-model="formData.adaWaktu" required> Ada</label>
                    <label><input type="radio" name="ada-waktu" value="tidak" v-model="formData.adaWaktu"> Tidak</label>
                  </div>
                </div>
                <div class="form-question">
                  <label for="alasan-adopsi">Alasan untuk mengadopsi kucing ini?</label>
                  <textarea id="alasan-adopsi" v-model="formData.alasan" required></textarea>
                </div>
                <button type="submit" class="btn-submit">Ajukan</button>
              </form>
            </div>
  
            <div v-if="currentStep === 'verifikasi'" class="form-step active">
              <h4>SHELTER SEDANG MEMVERIFIKASI ANDA</h4>
              <ul class="verification-timeline">
                <li class="completed">Menerima Formulir Adopsi</li>
                <li class="active">Meninjau Formulir Adopsi</li>
                <li>Menyetujui Formulir Adopsi</li>
                <li>Adopsi disetujui</li>
              </ul>
              <button @click="goToStep('adopsi')" class="btn-submit">Lanjutkan Adopsi (Simulasi)</button>
            </div>
  
            <div v-if="currentStep === 'adopsi'" class="form-step active">
              <h4>SELAMAT ANDA BERHASIL MENGADOPSI KUCING INI</h4>
              <p>SELANJUTNYA SILAHKAN HUBUNGI SHELTER...</p>
              <img src="../assets/images/kucing.svg" alt="Kucing lucu" class="success-cat-img">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat Window untuk komunikasi langsung dengan shelter -->
      <ChatWindow 
        :isOpen="isChatOpen"
        :shelterName="chatShelterName"
        :shelterAvatar="chatShelterAvatar"
        @close="closeChat"
      />
    </main>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ChatWindow from '../components/ChatWindow.vue'
  import { useChat } from '../composables/useChat'
  
  // --- 1. DATA REAKTIF ---
  const route = useRoute(); // Mengambil info rute
  const catId = route.params.id; // Mengambil :id dari URL
  
  const { setSelectedChat } = useChat()
  const currentStep = ref('informasi'); // Mengontrol langkah form
  const isChatOpen = ref(false); // Mengontrol chat window
  
  // Computed untuk shelter name dan avatar
  const chatShelterName = computed(() => {
    return currentCat.value?.shelter?.name || ''
  })
  
  const chatShelterAvatar = computed(() => {
    return currentCat.value?.shelter?.avatar || ''
  })
  
  const formData = ref({
    pernahRawat: null,
    cukupUang: null,
    adaWaktu: null,
    alasan: ''
  });
  
  // --- 2. SIMULASI DATABASE KUCING (dari form.js lama) ---
  const catDatabase = ref({
    "Mochi": {
        name: "Mochi",
        image: "/image/adopsi/kucing 1.png",
        tags: { gender: "Betina", genderIcon: 'fa-solid fa-venus', breed: "Persia", health: "Sehat" },
        shelter: { name: "Rumah Kucing BDG", location: "Bandung", avatar: "/image/adopsi/image.png" },
        description: "Kucing cantik, sehat, dan bersih. Cocok untuk kamu yang ingin sahabat baru di rumah."
    },
    "Leo": {
        name: "Leo",
        image: "/image/adopsi/kucing 2.png",
        tags: { gender: "Jantan", genderIcon: 'fa-solid fa-mars', breed: "British", health: "Sehat" },
        shelter: { name: "Meow Shelter", location: "Jakarta", avatar: "/image/adopsi/image.png" },
        description: "Leo sangat aktif dan suka bermain. Mencari rumah yang bisa mengajaknya bermain."
    },
    "Kiko": {
        name: "Kiko",
        image: "/image/adopsi/kucing 3.png",
        tags: { gender: "Jantan", genderIcon: 'fa-solid fa-mars', breed: "Domestik", health: "Sehat" },
        shelter: { name: "Paw Friends", location: "Yogyakarta", avatar: "/image/adopsi/image.png" },
        description: "Kiko adalah kucing yang mandiri dan suka menjelajah."
    }
  });
  
  // --- 3. COMPUTED PROPERTY ---
  // Otomatis mencari kucing yang benar berdasarkan catId dari URL
  const currentCat = computed(() => {
    return catDatabase.value[catId];
  });
  
  // --- 4. METHODS (FUNGSI) ---
  function goToStep(stepName) {
    currentStep.value = stepName;
  }
  
  function submitForm() {
    // Validasi sederhana
    if (!formData.value.pernahRawat || !formData.value.cukupUang || !formData.value.adaWaktu || !formData.value.alasan) {
      alert("Harap isi semua pertanyaan sebelum mengajukan.");
      return;
    }
  
    // Jika lolos validasi, pindah ke langkah verifikasi
    console.log('Formulir diajukan:', formData.value);
    goToStep('verifikasi');
  }
  
  function openChat() {
    // Update global state dengan shelter dari kucing yang dipilih
    if (currentCat.value?.shelter) {
      setSelectedChat(null, {
        name: currentCat.value.shelter.name,
        avatar: currentCat.value.shelter.avatar
      })
    }
    isChatOpen.value = true;
  }
  
  function closeChat() {
    isChatOpen.value = false;
  }
  
  </script>
  
  <style scoped>
    /* CSS untuk halaman ini sudah ada di main.css (global) */
  </style>
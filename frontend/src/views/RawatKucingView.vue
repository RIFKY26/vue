<template>
    <main>
      <div class="main-header">
        <h1>Rawat Kucing</h1>
        <span class="breadcrumb">RAWAT KUCING / RAWAT KUCING</span>
      </div>
  
      <div class="care-dashboard-grid">
        <div class="left-column">
          <div class="cat-identity-card">
            <div class="card-content">
              <div class="cat-details">
                <div class="cat-identity-box"> 
                  <div class="cat-name">
                    <button @click="prevCat" class="cat-nav-btn"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2>{{ currentCat.name }}</h2>
                    <button @click="nextCat" class="cat-nav-btn"><i class="fa-solid fa-chevron-right"></i></button>
                    <span class="tag friendly">{{ currentCat.tag }}</span>
                  </div>
                  <div class="cat-info">
                    <span><i :class="currentCat.genderIcon"></i> {{ currentCat.gender }}</span>
                    <span><i class="fa-solid fa-paw"></i> {{ currentCat.breed }}</span>
                    <span><i class="fa-solid fa-calendar-days"></i> {{ currentCat.age }}</span>
                  </div>
                </div>
              </div>
              <img :src="currentCat.image" alt="Ilustrasi Kucing">
            </div>
          </div>
  
          <div id="reminder-container" class="reminder-card">
            <div class="card-header">
              <h3>Pengingat Merawat Kucing</h3>
              <button @click="openModal()" id="addReminderBtn" class="btn-icon">+</button>
            </div>
            <div id="reminder-list">
              <div v-for="reminder in currentCat.reminders" :key="reminder.id" class="reminder-item">
                <div class="reminder-info">
                  <span>{{ reminder.title }}</span>
                  <p>{{ reminder.frequency }} - {{ reminder.time }}</p>
                </div>
                <div class="reminder-actions">
                  <label class="switch">
                    <input type="checkbox" v-model="reminder.checked" class="reminder-toggle">
                    <span class="slider"></span>
                  </label>
                  <button @click="openModal(reminder)" class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                  <button @click="deleteReminder(reminder.id)" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div> 
        
        <div class="right-column">
          <div class="activity-card">
            <div class="card-header">
              <h3>Aktivitas Kucingmu</h3>
              <button @click="openActivityModal()" class="btn-icon">+</button>
            </div>
            <p class="date-label">Senin, 24 Nov 2025</p>
            <div class="activity-list">
              <div v-for="activity in currentCat.activities" :key="activity.id" class="activity-item">
                <div class="activity-details">
                  <div class="activity-date-box">
                    <span>{{ activity.day }}</span>{{ activity.month }}
                  </div>
                  <div class="activity-info">
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.details }}, {{ activity.time }}</p>
                  </div>
                </div>
                <button @click="toggleAlarm(activity)" :class="['alarm-toggle', { active: activity.alarm }]">
                  <i class="fa-solid fa-bell"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  
    <!-- Modal untuk Pengingat -->
    <div v-if="isModalOpen" id="reminderModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">{{ modalTitle }}</h3>
          <button @click="closeModal" id="modalCloseBtn" class="modal-close">&times;</button>
        </div>
        <form @submit.prevent="saveReminder" id="reminderForm" class="modal-body">
          <input type="hidden" v-model="editableReminder.id">
          <div class="form-group">
            <label for="reminderTitle">Nama Pengingat</label>
            <input type="text" id="reminderTitle" v-model="editableReminder.title" placeholder="Contoh: Memberi makan pagi" required>
          </div>
          <div class="form-group">
            <label for="reminderTime">Waktu</label>
            <input type="time" id="reminderTime" v-model="editableReminder.time" required>
          </div>
          <div class="form-group">
            <label for="reminderFrequency">Frekuensi</label>
            <select id="reminderFrequency" v-model="editableReminder.frequency">
              <option value="harian">Harian</option>
              <option value="mingguan">Mingguan</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" id="saveReminderBtn" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal untuk Aktivitas -->
    <div v-if="isActivityModalOpen" class="modal-overlay" @click.self="closeActivityModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ activityModalTitle }}</h3>
          <button @click="closeActivityModal" class="modal-close">&times;</button>
        </div>
        <form @submit.prevent="saveActivity" class="modal-body">
          <input type="hidden" v-model="editableActivity.id">
          <div class="form-group">
            <label for="activityTitle">Judul Aktivitas</label>
            <input type="text" id="activityTitle" v-model="editableActivity.title" placeholder="Contoh: Kontrol Dokter" required>
          </div>
          <div class="form-group">
            <label for="activityDetails">Detail Aktivitas</label>
            <input type="text" id="activityDetails" v-model="editableActivity.details" placeholder="Contoh: Cek kesehatan rutin" required>
          </div>
          <div class="form-group">
            <label for="activityDate">Tanggal</label>
            <input type="date" id="activityDate" v-model="editableActivity.date" required>
          </div>
          <div class="form-group">
            <label for="activityTime">Waktu</label>
            <input type="time" id="activityTime" v-model="editableActivity.timeInput" required>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="editableActivity.alarm">
              Aktifkan Pengingat
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // --- 1. DATA REAKTIF ---
  const currentCatIndex = ref(0);
  const isModalOpen = ref(false);
  const modalTitle = ref('');
  const editableReminder = ref({});
  
  // Data untuk modal aktivitas
  const isActivityModalOpen = ref(false);
  const activityModalTitle = ref('Tambah Aktivitas Baru');
  const editableActivity = ref({}); 
  
  // --- 2. DATABASE SIMULASI (DATA ASLI) ---
  const allCatsData = ref([
      {
          id: "Leo", 
          name: "Leo", 
          tag: "Active", 
          gender: "Jantan", 
          breed: "British", 
          age: "8 bln", 
          image: "/image/adopsi/Group 9738.png",
          activities: [ 
              { id: 1, title: "Kontrol Dokter", details: "Cek kesehatan rutin", time: "Pukul 10:00", day: "25", month: "Nov", alarm: true } 
          ],
          reminders: [
              { id: 1, title: "Memberi Makan Pagi", time: "08:00", frequency: "harian", checked: true },
              { id: 2, title: "Memberi Vitamin", time: "08:00", frequency: "harian", checked: false }
          ]
      },
      {
          id: "Mochi", 
          name: "Mochi", 
          tag: "Friendly", 
          gender: "Betina", 
          breed: "Persia", 
          age: "1 thn", 
          image: "/image/adopsi/Group 9738.png    ",
          activities: [
              { id: 2, title: "Vaksinasi Kucing", details: "Vaksinasi kucing ke klinik", time: "Pukul 08:00", day: "24", month: "Nov", alarm: true },
              { id: 3, title: "Grooming", details: "Jadwal mandi dan potong kuku", time: "Pukul 14:00", day: "28", month: "Nov", alarm: false }
          ],
          reminders: [ 
              { id: 4, title: "Memberi Makan Sore", time: "17:00", frequency: "harian", checked: true } 
          ]
      }
  ]);
  
  // --- 3. COMPUTED PROPERTIES ---
  const currentCat = computed(() => {
    const cat = allCatsData.value[currentCatIndex.value];
    return {
      ...cat,
      genderIcon: cat.gender === 'Jantan' ? 'fa-solid fa-mars' : 'fa-solid fa-venus'
    };
  });
  
  // --- 4. METHODS (FUNGSI) ---
  function nextCat() {
    currentCatIndex.value = (currentCatIndex.value + 1) % allCatsData.value.length;
  }
  
  function prevCat() {
    currentCatIndex.value = (currentCatIndex.value - 1 + allCatsData.value.length) % allCatsData.value.length;
  }
  
  function toggleAlarm(activity) {
    // Kita bisa mengubah 'activity' karena 'activity' adalah referensi langsung ke objek di dalam 'allCatsData'
    activity.alarm = !activity.alarm;
  }
  
  function openModal(reminder = null) {
    if (reminder) {
      modalTitle.value = 'Edit Pengingat';
      editableReminder.value = { ...reminder }; 
    } else {
      modalTitle.value = 'Tambah Pengingat Baru';
      editableReminder.value = { title: '', time: '08:00', frequency: 'harian', checked: false };
    }
    isModalOpen.value = true;
  }
  
  function closeModal() {
    isModalOpen.value = false;
  }
  
  function saveReminder() {
    // ===== PERBAIKAN DI SINI =====
    // Kita harus mengubah 'allCatsData.value', bukan 'currentCat.value'
    const cat = allCatsData.value[currentCatIndex.value]; 
    
    if (editableReminder.value.id) {
      // UPDATE
      const index = cat.reminders.findIndex(r => r.id === editableReminder.value.id);
      if (index > -1) {
        // Simpan status 'checked' yang lama
        const oldCheckedStatus = cat.reminders[index].checked;
        cat.reminders[index] = { ...editableReminder.value, checked: oldCheckedStatus };
      }
    } else {
      // CREATE
      editableReminder.value.id = Date.now(); 
      cat.reminders.push(editableReminder.value);
    }
    closeModal();
    // Tidak perlu memanggil renderReminders(), Vue akan melakukannya secara otomatis
  }
  
  function deleteReminder(reminderId) {
    if (confirm("Apakah Anda yakin ingin menghapus pengingat ini?")) {
      // ===== PERBAIKAN DI SINI =====
      // Kita juga harus mengubah 'allCatsData.value'
      const cat = allCatsData.value[currentCatIndex.value];
      cat.reminders = cat.reminders.filter(r => r.id !== reminderId);
      // Vue akan otomatis mendeteksi perubahan ini dan me-render ulang
    }
  }

  // Fungsi untuk modal aktivitas
  function openActivityModal(activity = null) {
    if (activity) {
      activityModalTitle.value = 'Edit Aktivitas';
      // Format tanggal untuk input date (YYYY-MM-DD)
      const date = new Date();
      date.setDate(parseInt(activity.day));
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const monthIndex = monthNames.indexOf(activity.month);
      if (monthIndex !== -1) {
        date.setMonth(monthIndex);
      }
      const year = new Date().getFullYear();
      date.setFullYear(year);
      
      editableActivity.value = {
        ...activity,
        date: date.toISOString().split('T')[0],
        timeInput: activity.time.replace('Pukul ', '').substring(0, 5) // Extract HH:MM from "Pukul 10:00"
      };
    } else {
      activityModalTitle.value = 'Tambah Aktivitas Baru';
      const today = new Date();
      editableActivity.value = {
        title: '',
        details: '',
        date: today.toISOString().split('T')[0],
        timeInput: '10:00',
        alarm: false
      };
    }
    isActivityModalOpen.value = true;
  }

  function closeActivityModal() {
    isActivityModalOpen.value = false;
    editableActivity.value = {};
  }

  function saveActivity() {
    const cat = allCatsData.value[currentCatIndex.value];
    
    // Parse tanggal dan waktu
    const selectedDate = new Date(editableActivity.value.date + 'T00:00:00');
    const day = selectedDate.getDate().toString();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = monthNames[selectedDate.getMonth()];
    const time = `Pukul ${editableActivity.value.timeInput}`;
    
    if (editableActivity.value.id) {
      // UPDATE aktivitas yang ada
      const index = cat.activities.findIndex(a => a.id === editableActivity.value.id);
      if (index > -1) {
        cat.activities[index] = {
          id: editableActivity.value.id,
          title: editableActivity.value.title,
          details: editableActivity.value.details,
          time,
          day,
          month,
          alarm: editableActivity.value.alarm || false
        };
      }
    } else {
      // CREATE aktivitas baru
      const newActivity = {
        id: Date.now(),
        title: editableActivity.value.title,
        details: editableActivity.value.details,
        time,
        day,
        month,
        alarm: editableActivity.value.alarm || false
      };
      cat.activities.push(newActivity);
      // Sort activities by date (convert to comparable format)
      cat.activities.sort((a, b) => {
        const monthNamesFull = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const year = new Date().getFullYear();
        const monthIndexA = monthNamesFull.indexOf(a.month);
        const monthIndexB = monthNamesFull.indexOf(b.month);
        const dateA = new Date(year, monthIndexA, parseInt(a.day));
        const dateB = new Date(year, monthIndexB, parseInt(b.day));
        return dateA - dateB;
      });
    }
    
    closeActivityModal();
  }
  </script>
  
  <style scoped>
    /* Kosongkan, karena semua style sudah ada di main.css */
    @import '@/assets/css/pages/rawat.css';
  </style>
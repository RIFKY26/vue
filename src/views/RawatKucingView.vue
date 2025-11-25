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
import { ref, computed, onMounted } from 'vue'
import axios from "axios"

// --- 1. DATA REAKTIF ---
const currentCatIndex = ref(0);
const isModalOpen = ref(false);
const modalTitle = ref('');
const editableReminder = ref({});

// Modal aktivitas
const isActivityModalOpen = ref(false);
const activityModalTitle = ref('Tambah Aktivitas Baru');
const editableActivity = ref({}); 

// --- 2. DATA KUCING DARI BACKEND ---
const allCatsData = ref([])

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/rawat/kucing")
    const cats = res.data

    for (const cat of cats) {
      const reminders = await axios.get(`http://localhost:3000/api/rawat/kucing/${cat.id_kucing}/reminders`)
      const activities = await axios.get(`http://localhost:3000/api/rawat/kucing/${cat.id_kucing}/aktivitas`)

      cat.reminders = reminders.data
      cat.activities = activities.data
    }

    allCatsData.value = cats.map(c => ({
      id: c.id_kucing,

      // NAMA KUCING SESUAI BACKEND
      name: c.nama_kucing,  
      tag: c.kondisi,

      gender: c.jenis_kelamin,
      breed: c.jenis_kucing,
      age: c.usia,

      // FOTO SESUAI DB
      image: `http://localhost:3000/image/${c.foto}`,

      reminders: c.reminders,
      activities: c.activities
    }))

  } catch (err) {
    console.error("ERROR LOAD:", err)
  }
})


// --- 3. CURRENT CAT ---
const currentCat = computed(() => {
  if (!allCatsData.value.length) return {}

  const cat = allCatsData.value[currentCatIndex.value]

  return {
    ...cat,
    genderIcon:
      cat.gender && cat.gender.toLowerCase() === "jantan"
        ? "fa-solid fa-mars"
        : "fa-solid fa-venus",
  }
})


// --- 4. BUTTON NEXT / PREV ---
function nextCat() {
  currentCatIndex.value = (currentCatIndex.value + 1) % allCatsData.value.length;
}

function prevCat() {
  currentCatIndex.value = (currentCatIndex.value - 1 + allCatsData.value.length) % allCatsData.value.length;
}

// --- 5. PENGINGAT (REMINDERS) ---
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
  const cat = allCatsData.value[currentCatIndex.value];
  
  if (editableReminder.value.id) {
    const index = cat.reminders.findIndex(r => r.id === editableReminder.value.id);
    if (index > -1) {
      const oldCheckedValue = cat.reminders[index].checked;
      cat.reminders[index] = { ...editableReminder.value, checked: oldCheckedValue };
    }
  } else {
    editableReminder.value.id = Date.now();
    cat.reminders.push(editableReminder.value);
  }

  closeModal();
}

function deleteReminder(id) {
  const cat = allCatsData.value[currentCatIndex.value];
  cat.reminders = cat.reminders.filter(r => r.id !== id);
}

// --- 6. AKTIVITAS ---
function openActivityModal(activity = null) {
  if (activity) {
    activityModalTitle.value = 'Edit Aktivitas';

    editableActivity.value = {
      ...activity,
      date: new Date().toISOString().split("T")[0],
      timeInput: activity.time.replace("Pukul ", "")
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
}

function saveActivity() {
  const cat = allCatsData.value[currentCatIndex.value];

  const selectedDate = new Date(editableActivity.value.date + "T00:00:00");
  const day = selectedDate.getDate().toString();
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const month = monthNames[selectedDate.getMonth()];
  const time = `Pukul ${editableActivity.value.timeInput}`;

  if (editableActivity.value.id) {
    const index = cat.activities.findIndex(a => a.id === editableActivity.value.id);
    if (index > -1) {
      cat.activities[index] = {
        id: editableActivity.value.id,
        title: editableActivity.value.title,
        details: editableActivity.value.details,
        day,
        month,
        time,
        alarm: editableActivity.value.alarm || false
      };
    }
  } else {
    cat.activities.push({
      id: Date.now(),
      title: editableActivity.value.title,
      details: editableActivity.value.details,
      day,
      month,
      time,
      alarm: editableActivity.value.alarm || false
    });
  }

  closeActivityModal();
}

function toggleAlarm(activity) {
  activity.alarm = !activity.alarm;
}

</script>

  
  <style scoped>
    /* Kosongkan, karena semua style sudah ada di main.css */
    @import '@/assets/css/pages/rawat.css';
  </style>
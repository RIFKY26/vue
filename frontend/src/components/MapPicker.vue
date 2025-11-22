<template>
  <div class="map-container">
    <input
      type="text"
      v-model="searchQuery"
      class="search-bar"
      placeholder="Cari lokasi..."
      @input="searchLocation"
    />

    <ul v-if="suggestions.length" class="suggestions">
      <li
        v-for="item in suggestions"
        :key="item.place_id"
        @click="selectSuggestion(item)"
      >
        {{ item.display_name }}
      </li>
    </ul>

    <button @click="useCurrentLocation" type="button" class="location-button">
      📍 Gunakan Lokasi Saya
    </button>

    <div id="map" class="map"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- FIX ICON LEAFLET agar tidak error saat bundling ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});
// --------------------------------------------------------

const emit = defineEmits(["update:location"]);

const map = ref(null);
const marker = ref(null);
const searchQuery = ref("");
const suggestions = ref([]);

// --- 1. Inisialisasi MAP & Marker ---
onMounted(() => {
  // Koordinat default: Jakarta (-6.2, 106.8)
  map.value = L.map("map").setView([-6.2, 106.8], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value);

  // Inisialisasi marker di posisi default dan dapat di-drag
  marker.value = L.marker([-6.2, 106.8], { draggable: true }).addTo(map.value);

  // Event drag marker: ketika selesai di-drag, panggil reverseGeocode
  marker.value.on("dragend", (e) => {
    const { lat, lng } = e.target.getLatLng();
    reverseGeocode(lat, lng);
  });
});

// --- 2. Autocomplete Search (API Nominatim OpenStreetMap) ---
async function searchLocation() {
  if (searchQuery.value.length < 3) {
    suggestions.value = [];
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${searchQuery.value}&format=json&addressdetails=1&limit=5`;

  try {
    const res = await fetch(url);
    suggestions.value = await res.json();
  } catch (error) {
    console.error("Error fetching search results:", error);
  }
}

// ---- 3. Saat user klik lokasi hasil pencarian (Select Suggestion) ----
function selectSuggestion(item) {
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);

  // Pindahkan peta dan marker
  map.value.setView([lat, lon], 17);
  marker.value.setLatLng([lat, lon]);

  suggestions.value = [];
  searchQuery.value = item.display_name;

  // Kirim data lokasi ke parent component
  emit("update:location", {
    lat,
    lon,
    alamat: item.display_name,
  });
}

// --- 4. Reverse Geocoding (geser marker/klik lokasi → dapat alamat) ---
async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    searchQuery.value = data.display_name;

    // Kirim data lokasi ke parent component
    emit("update:location", {
      lat,
      lon: lng,
      alamat: data.display_name,
    });
  } catch (error) {
    console.error("Error performing reverse geocode:", error);
    // Jika gagal, set alamat sementara
    searchQuery.value = `Lokasi: Lat ${lat}, Lng ${lng}`;
  }
}

// --- 5. Gunakan Lokasi Saya (HTML Geolocation API) ---
function useCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung oleh browser Anda.");
    return;
  }

  searchQuery.value = "Mencari lokasi Anda...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Pindahkan Map dan Marker
      map.value.setView([latitude, longitude], 17);
      marker.value.setLatLng([latitude, longitude]);

      // Reverse Geocode untuk mendapatkan alamat dan mengisi form
      reverseGeocode(latitude, longitude);

      // Pemberitahuan (opsional)
      // alert(`Lokasi berhasil didapatkan: Lat ${latitude}, Lng ${longitude}`);
    },
    (error) => {
      console.error("Error getting location:", error);
      searchQuery.value = ""; // Bersihkan pesan loading

      let errorMessage = "Gagal mendapatkan lokasi.";
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = "Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "Informasi lokasi tidak tersedia.";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "Waktu tunggu permintaan lokasi habis.";
      }
      alert(errorMessage);
    },
    {
      // Opsi untuk akurasi yang lebih baik
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  /* Tinggi total container disesuaikan */
  min-height: 400px;
}

.search-bar {
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #bbb;
  border-radius: 8px;
  font-size: 14px;
}

/* Style Tombol Lokasi */
.location-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
  width: 100%; /* Agar sejajar dengan search bar */
}

.location-button:hover {
  background-color: #0056b3;
}

/* Style Suggestions */
.suggestions {
  position: absolute;
  top: 48px; /* Di bawah search bar */
  z-index: 999;
  background: white;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.suggestions li:last-child {
  border-bottom: none;
}

.suggestions li:hover {
  background: #f5f5f5;
}

/* Style Map */
.map {
  width: 100%;
  height: 350px;
  border-radius: 10px;
  margin-bottom: 15px;
}
</style>

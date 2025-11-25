<template>
  <main>
    <div class="main-header">
      <h1>Pembayaran Donasi</h1>
      <span class="breadcrumb">DONASI / BAYAR</span>
    </div>

    <div v-if="loading" class="text-center">Memuat data transaksi...</div>

    <div v-else-if="campaign" class="payment-container">

      <div class="payment-form-card">
        <h3>Lengkapi Pembayaran</h3>
        <form @submit.prevent="processPayment">

          <div class="form-group">
            <label>Pilih Nominal</label>
            <div class="quick-amounts">
              <button type="button" v-for="amt in [20000, 50000, 100000, 200000]"
                :key="amt"
                :class="{ active: donor.amount === amt }"
                @click="donor.amount = amt">
                {{ formatRupiahSimple(amt) }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Atau Input Nominal Lain (Rp)</label>
            <input v-model="donor.amount" type="number" min="10000" placeholder="Min. 10.000" required>
          </div>

          <div class="form-group">
            <label>Nama Donatur (Opsional)</label>
            <input v-model="donor.name" type="text" placeholder="Isi nama atau biarkan kosong (Hamba Allah)">
          </div>

          <div class="form-group">
            <label>Pesan Dukungan (Opsional)</label>
            <textarea v-model="donor.message" rows="2" placeholder="Tulis doa atau dukungan..."></textarea>
          </div>

          <div class="form-group">
            <label>Metode Pembayaran</label>
            <select v-model="donor.methodId" :disabled="paymentMethods.length === 0" required>
              <option disabled value="">Metode belum tersedia</option>
              <option
                v-for="metode in paymentMethods"
                :key="metode.id_metode"
                :value="metode.id_metode"
              >
                {{ metode.metode_pembayaran }}
              </option>
            </select>
            <small v-if="paymentMethods.length === 0" class="text-muted">
              Metode pembayaran belum tersedia. Hubungi admin.
            </small>
          </div>

          <button type="submit" class="btn btn-confirm" :disabled="isProcessing">
            {{ isProcessing ? 'Memproses...' : 'Bayar Sekarang' }}
          </button>
        </form>
      </div>

      <div class="campaign-summary-card">
        <h3>Ringkasan Donasi</h3>
        <img :src="getImageUrl(campaign.foto)" class="summary-img">
        <h4>{{ campaign.judul }}</h4>
        <p>Target: {{ formatRupiah(campaign.target_donasi) }}</p>
        <hr>
        <div class="total-row">
          <span>Total Bayar:</span>
          <span class="total-amount">{{ formatRupiah(donor.amount || 0) }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DonasiService from '@/services/donasiService';

const route = useRoute();
const router = useRouter();
const campaign = ref(null);
const loading = ref(true);
const isProcessing = ref(false);
const SERVER_URL = 'http://localhost:3000';
const paymentMethods = ref([]);

const donor = ref({
  amount: '',
  name: '',
  message: '',
  methodId: ''
});

// 1. Load Data Donasi berdasarkan ID di URL
const fetchCampaignInfo = async () => {
  try {
    const id = route.params.id;
    const response = await DonasiService.getById(id);
    campaign.value = response.data;
  } catch (error) {
    console.error("Error load campaign:", error);
    alert("Program donasi tidak ditemukan.");
    router.push('/donasi');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCampaignInfo();
  fetchPaymentMethods();
});

const fetchPaymentMethods = async () => {
  try {
    const { data } = await DonasiService.getMetodePembayaran();
    paymentMethods.value = Array.isArray(data) ? data : [];
    if (paymentMethods.value.length > 0 && !donor.value.methodId) {
      donor.value.methodId = paymentMethods.value[0].id_metode;
    }
  } catch (error) {
    console.error("Gagal memuat metode pembayaran:", error);
  }
};

// 2. Proses Bayar
const processPayment = async () => {
  const nominal = Number(donor.value.amount);

  if (nominal < 10000) {
    alert("Minimal donasi Rp 10.000");
    return;
  }

  if (!donor.value.methodId) {
    alert("Silakan pilih metode pembayaran.");
    return;
  }

  isProcessing.value = true;
  try {
    // Payload sesuai backend
    const payload = {
      id_donasi: campaign.value.id_donasi,
      nominal,
      id_metode: donor.value.methodId,
      nama_donatur: donor.value.name || 'Hamba Allah',
      pesan: donor.value.message
    };

    await DonasiService.bayar(payload);

    alert("Terima kasih! Pembayaran berhasil.");
    router.push(`/donasi/${campaign.value.id_donasi}`); // Balik ke detail

  } catch (error) {
    console.error("Gagal bayar:", error);
    alert("Gagal memproses pembayaran.");
  } finally {
    isProcessing.value = false;
  }
};

// Helpers
const getImageUrl = (filename) => filename ? `${SERVER_URL}/public/image/donasi/${filename}` : '';
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
const formatRupiahSimple = (num) => (num / 1000) + 'rb';
</script>
  <style scoped>
    @import '@/assets/css/pages/donasi.css';
@import '@/assets/pembayaran-donasi.css';
  </style>

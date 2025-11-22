<template>
    <main>
      <div class="main-header">
        <h1>Pembayaran Donasi</h1>
        <span class="breadcrumb">DONASI / PEMBAYARAN</span>
      </div>
  
    <div class="payment-container">
      <!-- Left Column: Campaign Info & Form -->
      <div class="payment-left">
        <!-- Campaign Info Card -->
        <div class="campaign-info-card" v-if="campaign">
          <img :src="campaign.image" :alt="campaign.title" class="campaign-image">
          <div class="campaign-info-content">
            <h3>{{ campaign.title }}</h3>
            <div class="campaign-shelter">
              <img :src="campaign.shelter.avatar" alt="Shelter" class="shelter-avatar">
              <div>
                <div class="shelter-name">{{ campaign.shelter.name }}</div>
                <div class="shelter-location">
                  <i class="fa-solid fa-map-marker-alt"></i>
                  {{ campaign.shelter.location }}
                </div>
              </div>
            </div>
            <div class="campaign-progress">
              <div class="progress-info">
                <span>Terkumpul <strong>{{ campaign.terkumpulFormatted }}</strong></span>
                <span>Target <strong>{{ campaign.targetFormatted }}</strong></span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{ width: campaign.progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Donor Information Form -->
        <div class="payment-section">
          <div class="section-header">
            <i class="fa-solid fa-user"></i>
            <h4>Data Donatur</h4>
          </div>
          <div class="input-group">
            <i class="fa-solid fa-user"></i>
            <input 
              type="text" 
              v-model="donor.name" 
              placeholder="Nama Donatur (Bisa Anonim)"
              :class="{ 'error': errors.name }"
            >
          </div>
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>
  
        <!-- Donation Amount -->
        <div class="payment-section">
          <div class="section-header">
            <i class="fa-solid fa-money-bill-wave"></i>
            <h4>Nominal Donasi</h4>
          </div>
          
          <!-- Quick Amount Buttons -->
          <div class="quick-amounts">
            <button 
              v-for="amount in quickAmounts" 
              :key="amount"
              @click="selectAmount(amount)"
              :class="{ 'active': donor.amount === amount }"
              class="quick-amount-btn"
            >
              {{ formatRupiah(amount) }}
            </button>
          </div>

          <!-- Custom Amount Input -->
          <div class="input-group amount-input">
            <span class="input-prefix">Rp</span>
            <input 
              type="number" 
              v-model.number="donor.amount" 
              placeholder="Masukkan nominal donasi"
              min="10000"
              :class="{ 'error': errors.amount }"
              @input="validateAmount"
            >
          </div>
          <div v-if="errors.amount" class="error-message">{{ errors.amount }}</div>
          <div class="amount-hint">
            <i class="fa-solid fa-info-circle"></i>
            Minimum donasi: Rp 10.000
          </div>
        </div>
  
        <!-- Payment Method -->
        <div class="payment-section">
          <div class="section-header">
            <i class="fa-solid fa-credit-card"></i>
          <h4>Metode Pembayaran</h4>
          </div>
          
          <div class="payment-methods">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              @click="selectPaymentMethod(method.id)"
              :class="{ 'active': selectedPaymentMethod === method.id }"
              class="payment-method-card"
            >
              <img :src="method.icon" :alt="method.name" class="payment-icon">
              <div class="payment-method-info">
                <div class="payment-method-name">{{ method.name }}</div>
                <div class="payment-method-desc">{{ method.description }}</div>
              </div>
              <i class="fa-solid fa-check-circle check-icon"></i>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          @click="processPayment" 
          class="btn-payment"
          :disabled="!isFormValid || isProcessing"
        >
          <span v-if="!isProcessing">
            <i class="fa-solid fa-lock"></i>
            Bayar Donasi
          </span>
          <span v-else>
            <i class="fa-solid fa-spinner fa-spin"></i>
            Memproses...
          </span>
        </button>
      </div>

      <!-- Right Column: Payment Summary -->
      <div class="payment-right">
        <div class="summary-card">
          <h4>Ringkasan Pembayaran</h4>
          
          <div class="summary-item">
            <span>Program Donasi</span>
            <span class="summary-value">{{ campaign?.title || '-' }}</span>
          </div>
          
          <div class="summary-item">
            <span>Nominal Donasi</span>
            <span class="summary-value amount-value">
              {{ donor.amount ? formatRupiah(donor.amount) : 'Rp 0' }}
            </span>
          </div>
          
          <div class="summary-item">
            <span>Metode Pembayaran</span>
            <span class="summary-value">
              {{ selectedPaymentMethodName || 'Belum dipilih' }}
            </span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-total">
            <span>Total Pembayaran</span>
            <span class="total-amount">
              {{ donor.amount ? formatRupiah(donor.amount) : 'Rp 0' }}
            </span>
          </div>

          <!-- Security Badge -->
          <div class="security-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Pembayaran aman dan terenkripsi</span>
          </div>
        </div>

        <!-- QR Code Display (if QRIS selected) -->
        <div v-if="selectedPaymentMethod === 'qris' && showQRCode" class="qr-code-section">
          <div class="qr-code-card">
            <h5>Scan QR Code untuk Membayar</h5>
            <div class="qr-code-placeholder">
              <i class="fa-solid fa-qrcode"></i>
              <p>QR Code akan muncul setelah Anda mengisi form</p>
            </div>
            <div class="qr-instructions">
              <p><strong>Cara membayar:</strong></p>
              <ol>
                <li>Buka aplikasi e-wallet atau mobile banking Anda</li>
                <li>Scan QR code di atas</li>
                <li>Masukkan nominal yang tertera</li>
                <li>Konfirmasi pembayaran</li>
              </ol>
            </div>
          </div>
        </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import qrisIcon from '@/assets/images/donasi/pembayaran/image2.png'
import bankIcon from '@/assets/images/donasi/pembayaran/image1.png'
import walletIcon from '@/assets/images/donasi/pembayaran/image3.png'
  
const route = useRoute()
const router = useRouter()
const campaignId = route.params.id

// Donor data
  const donor = ref({
    name: '',
    amount: null
})

// Form validation
const errors = ref({
  name: '',
  amount: ''
})

const isProcessing = ref(false)
const selectedPaymentMethod = ref('qris')
const showQRCode = ref(false)

// Quick amount options
const quickAmounts = [50000, 100000, 250000, 500000, 1000000]

// Payment methods
const paymentMethods = [
  {
    id: 'qris',
    name: 'QRIS',
    description: 'Bayar dengan QR Code',
    icon: qrisIcon
  },
  {
    id: 'bank-transfer',
    name: 'Transfer Bank',
    description: 'BCA, Mandiri, BNI, BRI',
    icon: bankIcon
  },
  {
    id: 'e-wallet',
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, LinkAja',
    icon: walletIcon
  }
]

// Campaign data (simulated)
const campaign = ref(null)

// Format Rupiah
const formatRupiah = (number) => {
  if (!number) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(number)
}

// Load campaign data
onMounted(() => {
  // Simulated campaign data - in real app, fetch from API
  const donationDatabase = {
    'pakan-kucing': {
      id: 'pakan-kucing',
      title: 'Bantu Pakan & Perawatan Kucing Jalanan',
      image: '/image/donasi/Rectangle 23853 (1).png',
      shelter: {
        name: 'Rumah Kucing Bahagia',
        location: 'Jakarta Utara',
        avatar: '/image/donasi/image.png'
      },
      terkumpul: 200000,
      target: 200000
    },
    'rawat-kucing': {
      id: 'rawat-kucing',
      title: 'Rawat Kucing Sakit Terlantar',
      image: '/image/donasi/Rectangle 23853.png',
      shelter: {
        name: 'Meow Shelter',
        location: 'Jakarta',
        avatar: '/image/donasi/image.png'
      },
      terkumpul: 4800000,
      target: 5000000
    }
  }

  const data = donationDatabase[campaignId]
  if (data) {
    campaign.value = {
      ...data,
      progress: (data.terkumpul / data.target) * 100,
      terkumpulFormatted: formatRupiah(data.terkumpul),
      targetFormatted: formatRupiah(data.target)
    }
  }
})

// Select quick amount
function selectAmount(amount) {
  donor.value.amount = amount
  validateAmount()
}

// Select payment method
function selectPaymentMethod(methodId) {
  selectedPaymentMethod.value = methodId
  if (methodId === 'qris' && donor.value.amount) {
    showQRCode.value = true
  }
}

// Validate amount
function validateAmount() {
  if (!donor.value.amount) {
    errors.value.amount = 'Masukkan nominal donasi'
    return false
  }
  if (donor.value.amount < 10000) {
    errors.value.amount = 'Minimum donasi adalah Rp 10.000'
    return false
  }
  errors.value.amount = ''
  return true
}

// Validate form
function validateForm() {
  let isValid = true

  // Validate name (optional but if filled, must be valid)
  if (donor.value.name && donor.value.name.length < 3) {
    errors.value.name = 'Nama minimal 3 karakter'
    isValid = false
  } else {
    errors.value.name = ''
  }

  // Validate amount
  if (!validateAmount()) {
    isValid = false
  }

  return isValid
}

// Computed properties
const isFormValid = computed(() => {
  return donor.value.amount && 
         donor.value.amount >= 10000 &&
         selectedPaymentMethod.value
})

const selectedPaymentMethodName = computed(() => {
  const method = paymentMethods.find(m => m.id === selectedPaymentMethod.value)
  return method ? method.name : ''
})

// Process payment
function processPayment() {
  if (!validateForm()) {
    return
  }

  isProcessing.value = true

  // Simulate payment processing
  setTimeout(() => {
    isProcessing.value = false
    alert('Pembayaran berhasil! Terima kasih atas donasi Anda.')
    router.push('/donasi')
  }, 2000)
}
  </script>
  
  <style scoped>
    @import '@/assets/css/pages/donasi.css';
@import '@/assets/pembayaran-donasi.css';
  </style>

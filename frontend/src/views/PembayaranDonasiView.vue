<template>
  <main>
    <div class="main-header">
      <h1>Pembayaran Donasi</h1>
      <span class="breadcrumb">DONASI / PEMBAYARAN</span>
    </div>

    <div v-if="loading" class="text-center p-5">
      Memuat data transaksi...
    </div>

    <div v-else-if="!campaign" class="text-center p-5">
      Program donasi tidak ditemukan.
    </div>

    <div v-else class="payment-container">
      <div class="payment-left">
        <div class="campaign-info-card">
          <img :src="campaign.image" :alt="campaign.title" class="campaign-image" />
          <div class="campaign-info-content">
            <h3>{{ campaign.title }}</h3>
            <div class="campaign-shelter">
              <img :src="campaign.shelter.avatar" alt="Shelter" class="shelter-avatar" />
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
              :class="{ error: errors.name }"
            />
          </div>
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <i class="fa-solid fa-money-bill-wave"></i>
            <h4>Nominal Donasi</h4>
          </div>

          <div class="quick-amounts">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              @click="selectAmount(amount)"
              :class="{ active: donor.amount === amount }"
              class="quick-amount-btn"
            >
              {{ formatRupiah(amount) }}
            </button>
          </div>

          <div class="input-group amount-input">
            <span class="input-prefix">Rp</span>
            <input
              type="number"
              v-model.number="donor.amount"
              placeholder="Masukkan nominal donasi"
              min="10000"
              :class="{ error: errors.amount }"
              @input="validateAmount"
            />
          </div>
          <div v-if="errors.amount" class="error-message">{{ errors.amount }}</div>
          <div class="amount-hint">
            <i class="fa-solid fa-info-circle"></i>
            Minimum donasi: Rp 10.000
          </div>
        </div>

        <div class="payment-section">
          <div class="section-header">
            <i class="fa-solid fa-credit-card"></i>
            <h4>Metode Pembayaran</h4>
          </div>

          <div v-if="paymentMethods.length === 0" class="empty-payment-method">
            Metode pembayaran belum tersedia. Silakan hubungi admin.
          </div>
          <div v-else class="payment-methods">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              @click="selectPaymentMethod(method.id)"
              :class="{ active: selectedPaymentMethod === method.id }"
              class="payment-method-card"
            >
              <img :src="method.icon" :alt="method.name" class="payment-icon" />
              <div class="payment-method-info">
                <div class="payment-method-name">{{ method.name }}</div>
                <div class="payment-method-desc">{{ method.description }}</div>
              </div>
              <i class="fa-solid fa-check-circle check-icon"></i>
            </div>
          </div>
        </div>

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

      <div class="payment-right">
        <div class="summary-card">
          <h4>Ringkasan Pembayaran</h4>

          <div class="summary-item">
            <span>Program Donasi</span>
            <span class="summary-value">{{ campaign.title }}</span>
          </div>

          <div class="summary-item">
            <span>Nominal Donasi</span>
            <span class="summary-value amount-value">
              {{ donor.amount ? formatRupiah(donor.amount) : "Rp 0" }}
            </span>
          </div>

          <div class="summary-item">
            <span>Metode Pembayaran</span>
            <span class="summary-value">
              {{ selectedPaymentMethodName || "Belum dipilih" }}
            </span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-total">
            <span>Total Pembayaran</span>
            <span class="total-amount">
              {{ donor.amount ? formatRupiah(donor.amount) : "Rp 0" }}
            </span>
          </div>

          <div class="security-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Pembayaran aman dan terenkripsi</span>
          </div>
        </div>

        <div v-if="showQRCode" class="qr-code-section">
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
import DonasiService from '@/services/donasiService'
import qrisIcon from '@/assets/images/donasi/pembayaran/image2.png'
import bankIcon from '@/assets/images/donasi/pembayaran/image1.png'
import walletIcon from '@/assets/images/donasi/pembayaran/image3.png'

const route = useRoute()
const router = useRouter()
const SERVER_URL = 'http://localhost:3000'

const loading = ref(true)
const isProcessing = ref(false)
const campaign = ref(null)
const donor = ref({ name: '', amount: null, message: '' })
const errors = ref({ name: '', amount: '' })
const quickAmounts = [50000, 100000, 250000, 500000, 1000000]
const paymentMethods = ref([])
const selectedPaymentMethod = ref(null)

const methodMeta = {
  qris: {
    icon: qrisIcon,
    description: 'Bayar dengan QR code semua bank & e-wallet'
  },
  'transfer-bank': {
    icon: bankIcon,
    description: 'BCA, Mandiri, BRI, BNI'
  },
  'e-wallet': {
    icon: walletIcon,
    description: 'GoPay, OVO, DANA, LinkAja'
  }
}

const formatRupiah = (number) => {
  if (!number) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(number)
}

const buildImageUrl = (filename) => {
  if (!filename) {
    return 'https://placehold.co/800x400?text=Donasi'
  }
  return `${SERVER_URL}/public/image/donasi/${filename}`
}

const buildShelterAvatar = (filename) => {
  if (!filename) {
    return 'https://placehold.co/60x60?text=S'
  }
  return `${SERVER_URL}/public/image/shelter/${filename}`
}

const mapCampaign = (data) => {
  const terkumpul = Number(data.terkumpul || 0)
  const target = Number(data.target_donasi || 0)
  const progress = target > 0 ? Math.min((terkumpul / target) * 100, 100) : 0

  return {
    id: data.id_donasi,
    title: data.judul,
    image: buildImageUrl(data.foto),
    terkumpul,
    target,
    terkumpulFormatted: formatRupiah(terkumpul),
    targetFormatted: formatRupiah(target),
    progress,
    shelter: {
      name: data.shelter?.name || 'AdoptMeow Official',
      location: data.shelter?.location || 'Indonesia',
      avatar: buildShelterAvatar(data.shelter?.avatar)
    }
  }
}

const getMethodSlug = (name = '') => {
  const lower = name.toLowerCase()
  if (lower.includes('qris')) return 'qris'
  if (lower.includes('wallet')) return 'e-wallet'
  if (lower.includes('transfer')) return 'transfer-bank'
  return lower.replace(/\s+/g, '-')
}

const fetchCampaign = async () => {
  const { id } = route.params
  const response = await DonasiService.getById(id)
  campaign.value = mapCampaign(response.data)
}

const fetchPaymentMethods = async () => {
  const { data } = await DonasiService.getMetodePembayaran()
  paymentMethods.value = (data || []).map((item) => {
    const slug = getMethodSlug(item.metode_pembayaran)
    const meta = methodMeta[slug] || methodMeta['transfer-bank']
    return {
      id: item.id_metode,
      name: item.metode_pembayaran,
      slug,
      icon: meta.icon,
      description: meta.description
    }
  })

  if (!selectedPaymentMethod.value && paymentMethods.value.length > 0) {
    selectedPaymentMethod.value = paymentMethods.value[0].id
  }
}

const initPage = async () => {
  try {
    await Promise.all([fetchCampaign(), fetchPaymentMethods()])
  } catch (error) {
    console.error('Gagal memuat data pembayaran:', error)
    alert('Tidak dapat memuat data pembayaran. Silakan coba lagi.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initPage()
})

const selectAmount = (amount) => {
  donor.value.amount = amount
  validateAmount()
}

const selectPaymentMethod = (methodId) => {
  selectedPaymentMethod.value = methodId
}

const validateAmount = () => {
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

const validateForm = () => {
  let isValid = true

  if (donor.value.name && donor.value.name.length < 3) {
    errors.value.name = 'Nama minimal 3 karakter'
    isValid = false
  } else {
    errors.value.name = ''
  }

  if (!validateAmount()) {
    isValid = false
  }

  if (!selectedPaymentMethod.value) {
    isValid = false
  }

  return isValid
}

const selectedPaymentMethodInfo = computed(() =>
  paymentMethods.value.find((method) => method.id === selectedPaymentMethod.value)
)

const selectedPaymentMethodName = computed(
  () => selectedPaymentMethodInfo.value?.name || ''
)

const showQRCode = computed(() => selectedPaymentMethodInfo.value?.slug === 'qris')

const isFormValid = computed(() => {
  return (
    !!donor.value.amount &&
    donor.value.amount >= 10000 &&
    !!selectedPaymentMethod.value &&
    paymentMethods.value.length > 0
  )
})

const processPayment = async () => {
  if (!validateForm() || !campaign.value) {
    return
  }

  isProcessing.value = true
  try {
    await DonasiService.bayar({
      id_donasi: campaign.value.id,
      nominal: donor.value.amount,
      id_metode: selectedPaymentMethod.value,
      nama_donatur: donor.value.name || 'Hamba Allah',
      pesan: donor.value.message
    })

    alert('Terima kasih! Pembayaran berhasil.')
    router.push(`/donasi/${campaign.value.id}`)
  } catch (error) {
    console.error('Gagal memproses pembayaran:', error)
    alert('Gagal memproses pembayaran. Coba lagi nanti.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
@import '@/assets/css/pages/donasi.css';
@import '@/assets/pembayaran-donasi.css';
</style>

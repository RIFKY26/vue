<template>
  <div class="chat-window-container" :class="{ 'open': isOpen }">
    <div class="chat-window-header">
      <div class="chat-window-user">
        <img :src="shelterAvatar" :alt="shelterName">
        <div>
          <div class="chat-window-name">{{ shelterName }}</div>
          <div class="chat-window-status">Online</div>
        </div>
      </div>
      <button @click="closeChat" class="close-btn">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :class="{ 'sent': message.sender === 'user', 'received': message.sender === 'shelter' }"
      >
        <div class="message-content">{{ message.text }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
    
    <div class="chat-input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        type="text" 
        placeholder="Ketik pesan..."
        class="chat-input"
      >
      <button @click="sendMessage" class="send-btn">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
  
  <!-- Overlay untuk click outside -->
  <div v-if="isOpen" class="chat-overlay" @click="closeChat"></div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useChat } from '../composables/useChat'

const props = defineProps({
  isOpen: Boolean,
  shelterName: String,
  shelterAvatar: String
})

const emit = defineEmits(['close'])

const { setSelectedChat } = useChat()
const newMessage = ref('')
const messagesContainer = ref(null)

// Simulasi pesan awal
const messages = ref([
  {
    id: 1,
    text: `Halo! Ada yang ingin ditanyakan?`,
    sender: 'shelter',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
])

function closeChat() {
  emit('close')
  setSelectedChat(null, null)
}

// Click outside handler - tidak perlu karena overlay sudah handle
// Overlay akan handle close saat diklik

// Tidak perlu event listener karena overlay sudah handle close

// Update global state saat chat dibuka
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.shelterName) {
    setSelectedChat(null, {
      name: props.shelterName,
      avatar: props.shelterAvatar
    })
  }
})

function sendMessage() {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: messages.value.length + 1,
    text: newMessage.value,
    sender: 'user',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  
  messages.value.push(message)
  newMessage.value = ''
  
  // Auto scroll ke bawah
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
  
  // Simulasi balasan dari shelter (setelah 2 detik)
  setTimeout(() => {
    const reply = {
      id: messages.value.length + 1,
      text: 'Terima kasih atas pesan Anda. Kami akan membalas segera.',
      sender: 'shelter',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    messages.value.push(reply)
    
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }, 2000)
}

// Auto scroll saat chat dibuka
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }
})
</script>

<style scoped>
.chat-window-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 420px;
  max-height: 70vh;
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateY(100%) scale(0.9);
  opacity: 0;
  transition: all 0.3s ease-in-out;
  border: 1px solid var(--border-color);
}

.chat-window-container.open {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: block;
  cursor: pointer;
  backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .chat-window-container {
    width: calc(100% - 30px);
    height: calc(100vh - 100px);
    max-height: 75vh;
    bottom: 15px;
    right: 15px;
  }
}

.chat-window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--blue-light);
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;
}

.chat-window-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-window-user img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.chat-window-name {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-dark);
  line-height: 1.2;
}

.chat-window-status {
  font-size: 11px;
  color: var(--text-light);
  line-height: 1.2;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-light);
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-dark);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--bg-light);
  min-height: 0;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  word-wrap: break-word;
}

.message.sent {
  align-self: flex-end;
}

.message.received {
  align-self: flex-start;
}

.message-content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.sent .message-content {
  background-color: var(--secondary-color);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background-color: var(--white);
  color: var(--text-dark);
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
  padding: 0 5px;
}

.chat-input-area {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border-color);
  background-color: var(--white);
  border-radius: 0 0 12px 12px;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  outline: none;
}

.chat-input:focus {
  border-color: var(--secondary-color);
}

.send-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  flex-shrink: 0;
  font-size: 13px;
}

.send-btn:hover {
  background-color: var(--blue-dark);
}

/* Dark mode */
.dark-mode .chat-window-container {
  background-color: #1F2937;
  border-color: var(--border-color);
}

.dark-mode .chat-window-header {
  background-color: #1E3A8A;
}

.dark-mode .chat-messages {
  background-color: #111827;
}

.dark-mode .message.received .message-content {
  background-color: #1F2937;
  color: var(--text-dark);
}

.dark-mode .chat-input {
  background-color: #111827;
  border-color: var(--border-color);
  color: var(--text-dark);
}

.dark-mode .chat-input-area {
  background-color: #1F2937;
  border-top-color: var(--border-color);
}
</style>


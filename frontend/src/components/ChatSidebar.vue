<template>
  <aside class="chat-sidebar" :class="{ 'open': isOpen }" ref="chatSidebarRef">
    <div class="chat-sidebar-header">
      <h3>Chat dengan Shelter</h3>
      <button @click="closeChat" class="close-btn">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
    
    <div class="chat-list">
      <div 
        v-for="chat in chatList" 
        :key="chat.id"
        class="chat-item"
        :class="{ 'active': selectedChat?.id === chat.id }"
        @click="selectChat(chat)"
      >
        <img :src="chat.shelterAvatar" :alt="chat.shelterName" class="chat-avatar">
        <div class="chat-info">
          <div class="chat-name">{{ chat.shelterName }}</div>
          <div class="chat-preview">{{ chat.lastMessage }}</div>
        </div>
        <div class="chat-meta">
          <span class="chat-time">{{ chat.lastTime }}</span>
          <span v-if="chat.unreadCount > 0" class="unread-badge">{{ chat.unreadCount }}</span>
        </div>
      </div>
      
      <div v-if="chatList.length === 0" class="no-chats">
        <i class="fa-solid fa-comments"></i>
        <p>Belum ada chat</p>
      </div>
    </div>
    
    <!-- Chat Window -->
    <div v-if="selectedChat" class="chat-window">
      <div class="chat-window-header">
        <div class="chat-window-user">
          <img :src="selectedChat.shelterAvatar" :alt="selectedChat.shelterName">
          <div>
            <div class="chat-window-name">{{ selectedChat.shelterName }}</div>
            <div class="chat-window-status">Online</div>
          </div>
        </div>
      </div>
      
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="message in selectedChat.messages" 
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
    
    <div v-else class="no-chat-selected">
      <i class="fa-solid fa-comment-dots"></i>
      <p>Pilih chat untuk memulai percakapan</p>
    </div>
  </aside>
  
  <!-- Overlay untuk click outside -->
  <div v-if="isOpen" class="chat-overlay" @click="closeChat"></div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useChat } from '../composables/useChat'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const { setSelectedChat, selectedChatId, selectedShelter } = useChat()
const selectedChat = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)
const chatSidebarRef = ref(null)

// Simulasi data chat
const chatList = ref([
  {
    id: 1,
    shelterName: 'Rumah Kucing BDG',
    shelterAvatar: 'https://i.imgur.com/5D63UyY.jpg',
    lastMessage: 'Terima kasih atas minat Anda untuk mengadopsi Mochi!',
    lastTime: '10:30',
    unreadCount: 2,
    messages: [
      { id: 1, text: 'Halo! Saya tertarik untuk mengadopsi Mochi.', sender: 'user', time: '09:00' },
      { id: 2, text: 'Halo! Terima kasih atas minat Anda. Mochi adalah kucing yang sangat ramah.', sender: 'shelter', time: '09:15' },
      { id: 3, text: 'Apakah Mochi sudah divaksin?', sender: 'user', time: '09:20' },
      { id: 4, text: 'Ya, Mochi sudah divaksin lengkap dan sehat.', sender: 'shelter', time: '09:25' },
      { id: 5, text: 'Terima kasih atas minat Anda untuk mengadopsi Mochi!', sender: 'shelter', time: '10:30' }
    ]
  },
  {
    id: 2,
    shelterName: 'Meow Shelter',
    shelterAvatar: 'https://i.imgur.com/k2gW25y.jpg',
    lastMessage: 'Kapan Anda bisa datang untuk melihat Leo?',
    lastTime: 'Kemarin',
    unreadCount: 0,
    messages: [
      { id: 1, text: 'Halo, saya ingin tahu lebih lanjut tentang Leo.', sender: 'user', time: '14:00' },
      { id: 2, text: 'Halo! Leo adalah kucing yang sangat aktif dan suka bermain.', sender: 'shelter', time: '14:15' },
      { id: 3, text: 'Kapan Anda bisa datang untuk melihat Leo?', sender: 'shelter', time: '15:00' }
    ]
  }
])

function closeChat() {
  emit('close')
  selectedChat.value = null
  setSelectedChat(null, null)
}

function selectChat(chat) {
  selectedChat.value = chat
  // Reset unread count
  chat.unreadCount = 0
  // Update global state untuk sinkronisasi dengan ChatWindow
  setSelectedChat(chat.id, {
    name: chat.shelterName,
    avatar: chat.shelterAvatar
  })
}

// Click outside handler
function handleClickOutside(event) {
  // Jangan tutup jika klik di sidebar utama atau chat button
  if (event.target.closest('.sidebar') || event.target.closest('.chat-link-btn')) {
    return
  }
  if (props.isOpen && chatSidebarRef.value && !chatSidebarRef.value.contains(event.target)) {
    closeChat()
  }
}

// Load chat yang dipilih dari global state saat sidebar dibuka
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && selectedChatId.value) {
    const chat = chatList.value.find(c => c.id === selectedChatId.value)
    if (chat) {
      selectedChat.value = chat
    }
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function sendMessage() {
  if (!newMessage.value.trim() || !selectedChat.value) return
  
  const message = {
    id: selectedChat.value.messages.length + 1,
    text: newMessage.value,
    sender: 'user',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  
  selectedChat.value.messages.push(message)
  selectedChat.value.lastMessage = newMessage.value
  selectedChat.value.lastTime = 'Baru saja'
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
      id: selectedChat.value.messages.length + 1,
      text: 'Terima kasih atas pesan Anda. Kami akan membalas segera.',
      sender: 'shelter',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    selectedChat.value.messages.push(reply)
    selectedChat.value.lastMessage = reply.text
    selectedChat.value.lastTime = 'Baru saja'
    
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }, 2000)
}

// Auto scroll saat chat dipilih
watch(selectedChat, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.chat-sidebar {
  position: fixed;
  right: -400px;
  top: 0;
  width: 400px;
  height: 100vh;
  background-color: var(--white);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  transition: right 0.3s ease-in-out;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.chat-sidebar.open {
  right: 0;
}

.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: block;
  cursor: pointer;
}

@media (max-width: 768px) {
  .chat-sidebar {
    width: 100%;
    max-width: 400px;
  }
}

.chat-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--blue-light);
}

.chat-sidebar-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-dark);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  border-bottom: 1px solid var(--border-color);
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.chat-item:hover {
  background-color: var(--bg-light);
}

.chat-item.active {
  background-color: var(--blue-light);
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.chat-preview {
  font-size: 12px;
  color: var(--text-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.chat-time {
  font-size: 11px;
  color: var(--text-light);
}

.unread-badge {
  background-color: var(--secondary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.no-chats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-light);
  text-align: center;
}

.no-chats i {
  font-size: 48px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.chat-window {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
}

.chat-window-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--blue-light);
}

.chat-window-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-window-user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-window-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-dark);
}

.chat-window-status {
  font-size: 12px;
  color: var(--text-light);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message.sent {
  align-self: flex-end;
}

.message.received {
  align-self: flex-start;
}

.message-content {
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.message.sent .message-content {
  background-color: var(--secondary-color);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-content {
  background-color: var(--bg-light);
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
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--white);
}

.chat-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  outline: none;
}

.chat-input:focus {
  border-color: var(--secondary-color);
}

.send-btn {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: var(--blue-dark);
}

.no-chat-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--text-light);
  text-align: center;
  padding: 40px;
}

.no-chat-selected i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.3;
}

/* Dark mode */
.dark-mode .chat-sidebar {
  background-color: #1F2937;
  border-left-color: var(--border-color);
}

.dark-mode .chat-sidebar-header {
  background-color: #1E3A8A;
}

.dark-mode .chat-item:hover,
.dark-mode .chat-item.active {
  background-color: #111827;
}

.dark-mode .chat-window {
  background-color: #1F2937;
}

.dark-mode .chat-window-header {
  background-color: #1E3A8A;
}

.dark-mode .message.received .message-content {
  background-color: #111827;
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


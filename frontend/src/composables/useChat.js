import { ref } from 'vue'

// Global state untuk chat yang dipilih
const selectedChatId = ref(null)
const selectedShelter = ref(null)

export function useChat() {
  function setSelectedChat(chatId, shelter) {
    selectedChatId.value = chatId
    selectedShelter.value = shelter
  }
  
  function clearSelectedChat() {
    selectedChatId.value = null
    selectedShelter.value = null
  }
  
  return {
    selectedChatId,
    selectedShelter,
    setSelectedChat,
    clearSelectedChat
  }
}


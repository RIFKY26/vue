<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activePanel = ref('beranda')
const panelStyle = ref({ left: '0px', width: '70px' })

const updatePanelPosition = (targetId) => {
  nextTick(() => {
    const activeLink = document.querySelector(`.nav-links a[href="#${targetId}"]`)
    if (activeLink) {
      const linkRect = activeLink.getBoundingClientRect()
      const navLinksRect = document.querySelector('.nav-links ul').getBoundingClientRect()
      const left = linkRect.left - navLinksRect.left
      const width = linkRect.width
      panelStyle.value = {
        left: `${left}px`,
        width: `${width}px`
      }
    }
  })
}

onMounted(() => {
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav-links a')
  const navbarHeight = 60

  const removeActiveClass = () => {
    navLinks.forEach(link => link.classList.remove('active'))
  }

  const updateActiveLink = () => {
    let current = ''
    const scrollPosition = window.scrollY
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbarHeight - 5
      const sectionHeight = section.clientHeight
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || ''
      }
    })

    removeActiveClass()
    if (current) {
      const activeLink = document.querySelector(`.nav-links a[href="#${current}"]`)
      if (activeLink) {
        activeLink.classList.add('active')
        activePanel.value = current
        updatePanelPosition(current)
      }
    } else {
      const homeLink = document.querySelector('.nav-links a[href="#beranda"]')
      if (homeLink) {
        homeLink.classList.add('active')
        activePanel.value = 'beranda'
        updatePanelPosition('beranda')
      }
    }
  }

  window.addEventListener('scroll', updateActiveLink)
  window.addEventListener('resize', () => {
    if (activePanel.value) {
      updatePanelPosition(activePanel.value)
    }
  })
  
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      const href = this.getAttribute('href')
      if (href.startsWith('#')) {
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
        activePanel.value = targetId
        updatePanelPosition(targetId)
      }
      removeActiveClass()
      this.classList.add('active')
    })
  })
  
  updateActiveLink()
  updatePanelPosition('beranda')

  // cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateActiveLink)
    window.removeEventListener('resize', updatePanelPosition)
  })
})

function goToDonasi() {
  router.push('/auth')
}

function goToRegister() {
  router.push('/register-user')
}
</script>

<template>
  <header class="navbar">
    <div class="container">
      <nav class="nav-links">
        <ul>
          <li>
            <a href="#beranda" id="link-beranda" :class="{ active: activePanel === 'beranda' }">Beranda</a>
          </li>
          <li>
            <a href="#tentang-kami" id="link-tentang-kami" :class="{ active: activePanel === 'tentang-kami' }">Tentang Kami</a>
          </li>
          <li>
            <a href="#panduan" id="link-panduan" :class="{ active: activePanel === 'panduan' }">Panduan</a>
          </li>
          <li>
            <a href="#relawan" id="link-relawan" :class="{ active: activePanel === 'relawan' }">Relawan</a>
          </li>
        </ul>
        <div class="active-panel" :style="panelStyle"></div>
      </nav>
      <div class="nav-buttons">
        <a href="#" @click.prevent="goToDonasi" class="btn btn-primary">Berdonasi</a>
        <a href="#" @click.prevent="goToRegister" class="btn btn-secondary">Bergabung</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>


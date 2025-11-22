<script setup>
import TheNavbar from '@/components/landing/TheNavbar.vue'
import TheFooter from '@/components/landing/TheFooter.vue'
import SectionHero from '@/components/landing/SectionHero.vue'
import SectionWhy from '@/components/landing/SectionWhy.vue'
import SectionHow from '@/components/landing/SectionHow.vue'
import SectionVolunteer from '@/components/landing/SectionVolunteer.vue'
import SectionPartners from '@/components/landing/SectionPartners.vue'
import '@/assets/css/landing.css'
</script>

<template>
  <div class="landing-page">
    <TheNavbar />
    <main>
      <SectionHero />
      <SectionWhy />
      <SectionHow />
      <SectionVolunteer />
      <SectionPartners />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>


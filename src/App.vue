<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template lang="pug">
Header
main
  Toast
  RouterView
Footer
</template>

<style scoped lang="scss">
main {
  padding: 30px 120px;
  width: 100%;
  max-width: 1600px;
}
</style>

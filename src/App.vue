<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template lang="pug">
div.app-container
  Header
  main
    Toast
    ConfirmPopup
    .app-content
      RouterView
  Footer
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    overflow-y: scroll;
    /* Modern scrollbar styling */
    &::-webkit-scrollbar {
      width: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #a0a0a0;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;

    .app-content {
      display: flex;
      flex-direction: column;
      padding: 30px 120px;
      width: 100%;
      max-width: 1600px;
      flex: 1;

    }
  }
}
</style>

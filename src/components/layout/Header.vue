<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template lang="pug">
header
  .logo
  nav
    RouterLink.nav-item(:to="{ name: 'calculator' }") Calculator
    RouterLink.nav-item(:to="{ name: 'ingredients' }") Ingredients 
</template>

<style scoped lang="scss">
header {
  --header-color: #2747c8;
  --header-height: 55px;
  padding: 0 20px;
  background-color: var(--header-color);
  display: flex;
  align-items: flex-start;
  height: var(--header-height);
  overflow: visible;
  width: 100%;

  .logo {
    margin-top: 10px;
    margin-right: 10px;
    background-image: url('@/assets/Sub-Calc-Logo.png');
    --logo-size: 100px;
    height: var(--logo-size);
    width: var(--logo-size);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 100%;
    border: 3px solid var(--header-color);
  }

  nav {
    height: var(--header-height);
    display: flex;
    align-items: center;
    .nav-item {
      font-size: 1.3rem;
      padding: 2px 15px;
      border-radius: 10px;
      color: #ffffff;

      &:hover {
        text-decoration: none;
      }

      &.router-link-active {
        background-color: #c4eaf833
      }
    }
  }
}
</style>
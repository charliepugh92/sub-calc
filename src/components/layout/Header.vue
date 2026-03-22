<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import RestaurantSwitcher from './RestaurantSwitcher.vue'

const menuOpen = ref(false)
const router = useRouter()

router.afterEach(() => { menuOpen.value = false })
</script>

<template lang="pug">
header
  .logo
  nav.desktop-nav
    RouterLink.nav-item(:to="{ name: 'calculator' }") Calculator
    RouterLink.nav-item(:to="{ name: 'ingredients' }") Ingredients
  .right-actions
    RestaurantSwitcher
    button.hamburger(@click="menuOpen = !menuOpen" :class="{ open: menuOpen }" aria-label="Menu")
      span
      span
      span

.mobile-menu(v-if="menuOpen")
  RouterLink.mobile-nav-item(:to="{ name: 'calculator' }") Calculator
  RouterLink.mobile-nav-item(:to="{ name: 'ingredients' }") Ingredients
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
  position: relative;
  z-index: 101;

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
    flex-shrink: 0;

    @media (max-width: 640px) { --logo-size: 68px; margin-top: 6px; }
  }

  .desktop-nav {
    height: var(--header-height);
    display: flex;
    align-items: center;

    .nav-item {
      font-size: 1.3rem;
      padding: 2px 15px;
      border-radius: 10px;
      color: #ffffff;

      &:hover { text-decoration: none; }
      &.router-link-active { background-color: #c4eaf833; }
    }

    @media (max-width: 640px) { display: none; }
  }

  .right-actions {
    margin-left: auto;
    align-self: center;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px;
    height: 36px;
    padding: 6px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    cursor: pointer;

    span {
      display: block;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: transform 0.22s ease, opacity 0.22s ease;
      transform-origin: center;
    }

    &.open {
      span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      span:nth-child(2) { opacity: 0; }
      span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }

    @media (max-width: 640px) { display: flex; }
  }
}

.mobile-menu {
  display: none;

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 55px;
    left: 0;
    right: 0;
    z-index: 100;
    background: #1f3aaa;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: slideDown 0.22s ease;
  }

  .mobile-nav-item {
    padding: 16px 24px;
    color: rgba(255,255,255,0.9);
    font-size: 1.15rem;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    text-decoration: none;

    &:last-child { border-bottom: none; }
    &:hover { background: rgba(255,255,255,0.08); color: #fff; }
    &.router-link-active { background: rgba(255,255,255,0.12); color: #fff; }
  }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import type { nutritionItem } from '../../stores/nutrition'
const { item } = defineProps<{ item: nutritionItem }>()
</script>

<template lang="pug">
.nutrition-label
  header Nutrition Facts
</template>

<style scoped lang="scss">
</style>

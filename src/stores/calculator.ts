import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCalculatorStore = defineStore('counter', () => {
  const items = ref([])

  return { items }
})

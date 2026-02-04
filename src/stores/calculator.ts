import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { nutritionFacts, nutritionItem, nutritionItemCategory } from './nutrition'

export enum sandwichType {
  sixInch = '6 Inch',
  footlong = 'Footlong',
  wrap = 'Wrap',
  salad = 'Salad',
}

export interface sandwichItem {
  item: nutritionItem;
  multiplier: number;
}

export interface sandwich {
  type: sandwichType;
  items: sandwichItem[];
}

const useCalculatorStore = defineStore('calculator', () => {
  const sandwich = ref({
    type: sandwichType.sixInch,
    items: [],
  } as sandwich)

  const perItemMultiplier = computed(() => {
    switch (sandwich.value.type) {
      case sandwichType.sixInch:
        return 1
      case sandwichType.footlong:
        return 2
      case sandwichType.wrap:
        return 1
      case sandwichType.salad:
        return 1
    }
  })

  const itemSummary = computed(() => {
    const summary  = {
      servingSize: 0,
      calories: 0,
      totalFat: 0,
      satFat: 0,
      transFat: 0,
      chol: 0,
      sodium: 0,
      carb: 0,
      fiber: 0,
      sugar: 0,
      addedSugar: 0,
      protein: 0,
      vitA: 0,
      vitC: 0,
      calcium: 0,
      iron: 0,
    } as nutritionFacts

    sandwich.value.items.forEach(({ item, multiplier }) => {
      const nutrition = item.nutrition
      const itemMultiplier = multiplier * perItemMultiplier.value

      summary.servingSize += nutrition.servingSize * itemMultiplier
      summary.calories += nutrition.calories * itemMultiplier
      summary.totalFat += nutrition.totalFat * itemMultiplier
      summary.satFat += nutrition.satFat * itemMultiplier
      summary.transFat += nutrition.transFat * itemMultiplier
      summary.chol += nutrition.chol * itemMultiplier
      summary.sodium += nutrition.sodium * itemMultiplier
      summary.carb += nutrition.carb * itemMultiplier
      summary.fiber += nutrition.fiber * itemMultiplier
      summary.sugar += nutrition.sugar * itemMultiplier
      summary.addedSugar += nutrition.addedSugar * itemMultiplier
      summary.protein += nutrition.protein * itemMultiplier
      summary.vitA += nutrition.vitA * itemMultiplier
      summary.vitC += nutrition.vitC * itemMultiplier
      summary.calcium += nutrition.calcium * itemMultiplier
      summary.iron += nutrition.iron * itemMultiplier
    })

    return summary
  })

  function removeItemFromSandwich(itemId: string) {
    sandwich.value.items = sandwich.value.items.filter(
      ({ item }) => item.id != itemId,
    )
  }

  function replaceCategoryItem(category: nutritionItemCategory, newItem: nutritionItem) {
    const existingIndex = sandwich.value.items.findIndex(
      ({ item }) => item.id.startsWith(`${category}-`),
    )

    if (existingIndex == -1) {
      sandwich.value.items.push({ item: newItem, multiplier: 1 })
    } else {
      sandwich.value.items[existingIndex] = { item: newItem, multiplier: 1 }
    }
  }

  function addItemToSandwich(newItem: nutritionItem) {
    sandwich.value.items.push({ item: newItem, multiplier: 1 })
  }

  return { sandwich, itemSummary, removeItemFromSandwich, replaceCategoryItem, addItemToSandwich }
})

export default useCalculatorStore
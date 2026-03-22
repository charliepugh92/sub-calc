import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import useNutritionStore from './nutrition'
import type { nutritionFacts, nutritionItem } from '@/types/nutrition'
import type { ComponentModifier } from '@/types/restaurant'

export interface OrderItem {
  item: nutritionItem
  multiplier: number
  modifierKey?: string
  isForced?: boolean
}

export type sandwichItem = OrderItem

const useCalculatorStore = defineStore('calculator', () => {
  const nutritionStore = useNutritionStore()

  const sandwichType = computed(() =>
    Object.fromEntries(
      nutritionStore.restaurantData.options.map(o => [o.key, o.name])
    ) as Record<string, string>
  )

  const sandwich = ref({
    type: nutritionStore.restaurantData.options[0]!.name,
    items: [] as OrderItem[],
  })

  const selectedOrderOption = computed(
    () => nutritionStore.restaurantData.options.find(
      (option) => option.name === sandwich.value.type,
    )!,
  )

  function findItemById(id: string): nutritionItem | undefined {
    for (const items of Object.values(nutritionStore.items)) {
      const found = items.find(item => item.id === id)
      if (found) return found
    }
  }

  watch(
    () => sandwich.value.type,
    () => {
      const components = selectedOrderOption.value?.components ?? []

      sandwich.value.items = sandwich.value.items.filter(o => !o.isForced)

      components
        .filter(c => c.type === 'force' && c.forcedOption)
        .forEach(c => {
          const item = findItemById(c.forcedOption!)
          if (item) sandwich.value.items.push({ item, multiplier: 1, isForced: true })
        })
    },
    { immediate: true },
  )

  const itemSummary = computed(() => {
    const summary = {} as Record<string, number>
    const components = selectedOrderOption.value?.components ?? []
    const baseModifier = selectedOrderOption.value?.baseModifier ?? 1
    const validCategories = new Set(components.map(c => c.category))
    const categoryBaseMultipliers = new Map(
      components.map(c => [c.category, c.baseMultipler ?? 1])
    )

    sandwich.value.items.forEach(({ item, multiplier, modifierKey, isForced }: OrderItem) => {
      const category = item.id.split('-')[0] ?? ''
      if (!isForced && !validCategories.has(category)) return

      const componentModifiers = components.find(c => c.category === category)?.modifiers
      let effectiveMultiplier: number
      if (isForced || !componentModifiers?.length) {
        effectiveMultiplier = 1
      } else {
        const validMod = componentModifiers.find(m => m.key === modifierKey)
        const defaultMod = componentModifiers.find(m => m.default) ?? componentModifiers[0]
        effectiveMultiplier = validMod?.multiplier ?? defaultMod?.multiplier ?? 1
      }

      const nutrition = item.nutrition as Record<string, undefined | number>
      const componentMultiplier = categoryBaseMultipliers.get(category) ?? 1
      const itemMultiplier = effectiveMultiplier * baseModifier * componentMultiplier

      Object.keys(nutrition).forEach((key) => {
        if (nutrition[key] !== undefined) {
          summary[key] ??= 0
          summary[key] += nutrition[key]! * itemMultiplier
        }
      })
    })

    return summary as nutritionFacts
  })

  function removeItemFromSandwich(itemId: string) {
    sandwich.value.items = sandwich.value.items.filter(
      ({ item }) => item.id !== itemId,
    )
  }

  function replaceCategoryItem(category: string, newItem: nutritionItem, multiplier = 1, modifierKey?: string) {
    const existingIndex = sandwich.value.items.findIndex(
      ({ item }) => item.id.startsWith(`${category}-`),
    )
    const orderItem: OrderItem = { item: newItem, multiplier, modifierKey }

    if (existingIndex === -1) {
      sandwich.value.items.push(orderItem)
    } else {
      sandwich.value.items[existingIndex] = orderItem
    }
  }

  function addItemToSandwich(newItem: nutritionItem, multiplier = 1, modifierKey?: string) {
    sandwich.value.items.push({ item: newItem, multiplier, modifierKey })
  }

  function updateItemModifier(itemId: string, modifier: ComponentModifier) {
    const orderItem = sandwich.value.items.find(({ item }) => item.id === itemId)
    if (orderItem) {
      orderItem.multiplier = modifier.multiplier
      orderItem.modifierKey = modifier.key
    }
  }

  return { sandwich, sandwichType, selectedOrderOption, itemSummary, removeItemFromSandwich, replaceCategoryItem, addItemToSandwich, updateItemModifier }
})

export default useCalculatorStore

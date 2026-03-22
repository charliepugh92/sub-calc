import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { nutritionItem } from '@/types/nutrition';
import type { RestaurantData, RestaurantOption } from '@/types/restaurant';

import subwayNutritionData from '../utils/restaurant-nutrition-files/subway'

export enum defaultRestaurants {
  subway = 'subway',
}

export const nutritionItemCategory = {
  bread: 'bread',
  protein: 'protein',
  cheese: 'cheese',
  vegetable: 'vegetable',
  condiment: 'condiment',
  spice: 'spice',
} as const

const useNutritionStore = defineStore('nutrition', () => {
  const restaurantNutritionFiles = ref<Record<string, RestaurantData>>({
    [defaultRestaurants.subway]: subwayNutritionData as RestaurantData,
  })

  const selectedRestaurant = ref(defaultRestaurants.subway as string)
  const restaurantData = computed(() => restaurantNutritionFiles.value[selectedRestaurant.value]!)
  const items = ref<Record<string, nutritionItem[]>>(restaurantData.value.ingredients)

  const supportedRestaurants = computed(() => Object.keys(restaurantNutritionFiles.value))
  const restaurantOptions = computed(() =>
    Object.entries(restaurantNutritionFiles.value).map(([key, data]) => ({
      key,
      name: data.name,
      logo: data.logo,
    }))
  )
  const nutritionItemCategories = computed(() => Object.keys(restaurantData.value.ingredients))
  
  function selectRestaurant(restaurant: string) {
    if (restaurantNutritionFiles.value[restaurant]) {
      selectedRestaurant.value = restaurant
      items.value = restaurantData.value.ingredients
    }
  }

  function updateRestaurantInfo(updates: { name?: string; logo?: string }) {
    Object.assign(restaurantNutritionFiles.value[selectedRestaurant.value]!, updates)
  }

  function saveOption(option: RestaurantOption) {
    const options = restaurantNutritionFiles.value[selectedRestaurant.value]!.options
    const idx = options.findIndex(o => o.key === option.key)
    if (idx === -1) options.push(option)
    else options[idx] = option
  }

  function removeOption(key: string) {
    const current = restaurantNutritionFiles.value[selectedRestaurant.value]!
    current.options = current.options.filter(o => o.key !== key)
  }

  function addIngredientCategory(category: string) {
    if (items.value[category]) return
    items.value = { ...items.value, [category]: [] }
    restaurantNutritionFiles.value[selectedRestaurant.value]!.ingredients[category] = []
  }

  function removeIngredientCategory(category: string) {
    const newItems = { ...items.value }
    delete newItems[category]
    items.value = newItems
    delete restaurantNutritionFiles.value[selectedRestaurant.value]!.ingredients[category]
  }

  function addRestaurant(name: string, logo: string) {
    const key = name.toLowerCase().replace(/\s+/g, '-')
    restaurantNutritionFiles.value[key] = { name, logo, options: [], ingredients: {} }
    selectRestaurant(key)
  }

  const saveItem = function(category: string, item: nutritionItem) {
    if (!nutritionItemCategories.value.includes(category)) return

    const temp = items.value
    const categoryItems = temp[category]!
    const existingIndex = categoryItems.findIndex((check) => check.id == item.id)
    
    if (existingIndex == -1) {
      item.id = `${category}-${item.name.toLowerCase().replace(/\s+/g, '-')}`
      categoryItems.push(item)
    } else {
      categoryItems[existingIndex] = item
    }

    items.value = temp
  }

  const removeItem = function(category: string, id: string) {
    if (!nutritionItemCategories.value.includes(category)) return
  
    items.value = {
      ...items.value,
      [category]: items.value[category]!.filter((item) => item.id != id),
    }
  }

  const dataExport = computed(
    () => JSON.stringify(restaurantData.value, null, 2),
  )

  function importData(data: string) {
    try {
      const parsed = JSON.parse(data) as RestaurantData
      restaurantNutritionFiles.value[selectedRestaurant.value] = parsed
      items.value = parsed.ingredients
      return true
    } catch {
      return false
    }
  }

  return { items, saveItem, removeItem, restaurantData, importData, dataExport, supportedRestaurants, restaurantOptions, selectedRestaurant, selectRestaurant, addRestaurant, updateRestaurantInfo, saveOption, removeOption, addIngredientCategory, removeIngredientCategory }
})

export default useNutritionStore
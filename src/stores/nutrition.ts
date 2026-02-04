import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import nutritionItems from '../assets/nutrition.json'
import { addSyntheticTrailingComment } from 'typescript';

export interface nutritionItem {
  id: string;
  name: string;
  nutrition: nutritionFacts;
}

export interface nutritionFacts {
  servingSize: number;
  calories: number;
  totalFat: number;
  satFat: number;
  transFat: number;
  chol: number;
  sodium: number;
  carb: number;
  fiber: number;
  sugar: number;
  addedSugar: number;
  protein: number;
  vitA: number;
  vitC: number;
  calcium: number;
  iron: number;
}

export enum nutritionItemCategory {
  bread = 'bread',
  condiment = 'condiment',
  spice = 'spice',
  vegetable = 'vegetable',
  cheese = 'cheese',
  protein = 'protein',
}

const useNutritionStore = defineStore('nutrition', () => {
  const items = ref(nutritionItems as Record<nutritionItemCategory, nutritionItem[]>)

  const saveItem = function(category: nutritionItemCategory, item: nutritionItem) {
    const temp = items.value
    const categoryItems = temp[category]
    const existingIndex = categoryItems.findIndex((check) => check.id == item.id)
    
    if (existingIndex == -1) {
      categoryItems.push(item)
    } else {
      categoryItems[existingIndex] = item
    }

    items.value = temp
  }

  const removeItem = function(category: nutritionItemCategory, id: string) {
    const temp = items.value

    temp[category] = temp[category].filter(
      (item) => item.id != id,
    )

    items.value = temp
  }

  return { items, saveItem, removeItem }
})

export default useNutritionStore
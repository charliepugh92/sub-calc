<script setup lang="ts">
import { ref, computed } from 'vue'
import useNutritionStore, { nutritionItemCategory, type nutritionItem } from '@/stores/nutrition'
import useCalculatorStore, { sandwichType, type sandwichItem } from '@/stores/calculator'
import { useToast } from 'primevue/usetoast'
import NutritionFacts from '@/components/ingredients/NutritionFacts.vue'
import SelectButton from 'primevue/selectbutton'
import IngredientDisplay from '@/components/ingredients/IngredientDisplay.vue'

const toast = useToast()
const nutritionStore = useNutritionStore()
const calculatorStore = useCalculatorStore()

const categoryItems = computed(() => {
  const categoryItems = {} as Record<nutritionItemCategory, { label: string; value: string }[]>
  for (const category in nutritionItemCategory) {
    categoryItems[category as nutritionItemCategory] = nutritionStore.items[category as nutritionItemCategory].map(
      (item) => ({
        label: item.name,
        value: item.id,
      }),
    )
  }
  return categoryItems
})

function itemIsIncluded(itemId: string): boolean {
  return calculatorStore.sandwich.items.some(({ item }: sandwichItem) => item.id === itemId)
}

function handleSelection(category: nutritionItemCategory, item: nutritionItem) {
  if (itemIsIncluded(item.id)) {
    calculatorStore.removeItemFromSandwich(item.id)
  } else {
    if (category === nutritionItemCategory.bread) {
      calculatorStore.replaceCategoryItem(category, item)
    } else {
      calculatorStore.addItemToSandwich(item)
    }
  }
}
</script>

<template lang="pug">
.calculator-view
  .ingredient-selections
    .section
      header Sandwich Type
      SelectButton(
        v-model="calculatorStore.sandwich.type"
        :options="Object.values(sandwichType)"
      )
    .section
      header Bread
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.bread]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.bread, item)"
          )
    .section
      header Proteins
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.protein]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.protein, item)"
          )
    .section
      header Cheese
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.cheese]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.cheese, item)"
          )
    .section
      header Veggies
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.vegetable]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.vegetable, item)"
          )
    .section
      header Sauces
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.condiment]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.condiment, item)"
          )
    .section
      header Spices
      .selections
        .selection(
          v-for="item in nutritionStore.items[nutritionItemCategory.spice]"
          :key="item.id"
        )
          IngredientDisplay(
            :item="item"
            size="slim"
            :highlight="itemIsIncluded(item.id)"
            v-on:click="handleSelection(nutritionItemCategory.spice, item)"
          )
  .nutrition-summary
    NutritionFacts(
      servingDescription="Whole Sandwich"
      :nutrition="calculatorStore.itemSummary"
    )
</template>

<style scoped lang="scss">
.calculator-view {
  display: flex;
  flex: 1;
  gap: 20px;

  .ingredient-selections {
    flex: 1 1 0;

    .section {
      margin-bottom: 24px;

      .selections {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 12px;

        .selection:hover {
          cursor: pointer;
        }
      }
    }
  }

  .nutrition-summary {
    align-self: flex-start;
    position: sticky;
    top: 30px;
    width: 340px;
    flex-shrink: 1;
  }
}
</style>

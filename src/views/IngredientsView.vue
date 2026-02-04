<script setup lang="ts">
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import IngredientDisplay from '@/components/ingredients/IngredientDisplay.vue'
import useNutritionCalculator, { type nutritionItem, nutritionItemCategory } from '@/stores/nutrition'
import { capitalize } from '@/utils'
import { ref, computed } from 'vue'

const nutritionCalculator = useNutritionCalculator()

const selectedCategory = ref(nutritionItemCategory.bread)
const selectedCategoryItems = computed(() => nutritionCalculator.items[selectedCategory.value])
const createIngredientLabel = computed(() => `Add ${capitalize(selectedCategory.value)}`)
const categoryLabeler = (category: string) => `${capitalize(category)}s`

function startImport() {

}

function exportItems() {

}

function resetForm() {

}

function editItem(item: nutritionItem) {
  itemForm.value = { ...item }
}

function createItem() {

}

function submitItem() {

}

const itemForm = ref({
  id: '',
  name: '',
  nutrition: {
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
  },
} as nutritionItem)
</script>

<template lang="pug">
.page-header
  .page-title Ingredient Editor
  .actions
    Button(
      v-on:click="startImport"
      icon="pi pi-file-import"
      iconPos="right"
      severity="info"
      label="Import"
      size="large"
    )
    Button(
      v-on:click="exportItems"
      icon="pi pi-file-export"
      iconPos="right"
      severity="info"
      label="Export"
      size="large"
    )
SelectButton.category-selector(
  v-model="selectedCategory"
  :options="Object.keys(nutritionCalculator.items)"
  :optionLabel="categoryLabeler"
  fluid
)
.ingredients
  Button.createItemButton(
    v-on:click="createItem"
    icon="pi pi-plus"
    icon-pos="bottom"
    size="large"
    :label="createIngredientLabel"
    severity="secondary"
  )
  IngredientDisplay(
    v-for="item in selectedCategoryItems"
    :item="item"
    :enable-editor="true"
  )
  .no-items(v-if="selectedCategoryItems.length == 0") No {{ selectedCategory }}s listed.
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .page-title {
    font-size: 3rem;
  }

  .actions {
    margin-left: auto;
    justify-self: flex-end;

    button {
      margin: 0 5px;
      font-weight: bold;
    }
  }
}
.category-selector {
  margin: 20px 0;
}

.ingredients {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  .no-items {
    height: 200px;
    grid-column: span 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

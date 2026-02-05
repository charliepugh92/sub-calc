<script setup lang="ts">
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Dialog from 'primevue/dialog'
import IngredientDisplay from '@/components/ingredients/IngredientDisplay.vue'
import IngredientForm from '@/components/ingredients/IngredientForm.vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import useNutritionCalculator, { type nutritionItem, nutritionItemCategory } from '@/stores/nutrition'
import { capitalize } from '@/utils'
import { ref, computed } from 'vue'
import { readConfigFile } from 'typescript'

const nutritionCalculator = useNutritionCalculator()

const selectedCategory = ref(nutritionItemCategory.bread)
const selectedCategoryItems = computed(() => nutritionCalculator.items[selectedCategory.value])
const createIngredientLabel = computed(() => `Add ${capitalize(selectedCategory.value)}`)
const categoryLabeler = (category: string) => `${capitalize(category)}s`

const toast = useToast()

function copyExportToClipboard() {
  navigator.clipboard.writeText(nutritionCalculator.dataExport).then(() => {
    toast.add({ severity: 'success', summary: 'Export Copied to Clipboard', life: 2000 })
  })
}

const showExportDialog = ref(false)
const showImportDialog = ref(false)
const showItemFormDialog = ref(false)

const importText = ref('')

function handleImport() {
  try {
    nutritionCalculator.importData(importText.value)
    toast.add({ severity: 'success', summary: 'Import Successful', life: 2000 })
    showImportDialog.value = false
    importText.value = ''
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Import Failed', detail: (e as Error).message, life: 4000 })
  }
}

function resetForm() {
  itemForm.value = {
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
  }
}

function editItem(item: nutritionItem) {
  itemForm.value = {
    ...item,
    nutrition: { ...item.nutrition },
  }
  showItemFormDialog.value = true
}

function submitItem() {
  nutritionCalculator.saveItem(selectedCategory.value, itemForm.value)
  toast.add({ severity: 'success', summary: 'Ingredient Saved', life: 2000 })
  showItemFormDialog.value = false
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
      v-on:click="showImportDialog = true"
      icon="pi pi-file-import"
      iconPos="right"
      severity="info"
      label="Import"
      size="large"
    )
    Button(
      v-on:click="showExportDialog = true"
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
    v-on:click="showItemFormDialog = true"
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
    v-on:edit="editItem(item)"
    v-on:remove="nutritionCalculator.removeItem(selectedCategory, item.id)"
    :key="item.id"
  )
  .no-items(v-if="selectedCategoryItems.length == 0") No {{ selectedCategory }}s listed.
  Dialog(
    v-model:visible="showImportDialog"
    modal
    style="width: 700px; max-width: 90vw;"
    header="Import Ingredients"
  )
    .import-content
      textarea(
        v-model="importText"
        placeholder="Paste exported ingredients JSON here"
        style="width: 100%; height: 300px;"
      )
      .import-actions
        Button(
          icon="pi pi-check"
          label="Import"
          severity="success"
          @click="handleImport"
          style="margin-top: 1rem; margin-right: 1rem;"
        )
Dialog(
  v-model:visible="showExportDialog"
  modal
  style="width: 700px; max-width: 90vw;"
  header="Export Ingredients"
)
  .export-content
    textarea(
      readonly
      style="width: 100%; height: 300px;"
    ) {{ nutritionCalculator.dataExport }}
    .copy-export
      Button(
        icon="pi pi-copy"
        label="Copy to Clipboard"
        severity="success"
        @click="copyExportToClipboard"
        style="margin-top: 1rem;"
      )
Dialog(
  v-model:visible="showItemFormDialog"
  modal
  style="width: 700px; max-width: 90vw;"
  :header="itemForm.id ? 'Edit Ingredient' : 'Add Ingredient'"
  @hide="resetForm"
)
  IngredientForm(
    :formData="itemForm"
    v-on:submit="submitItem"
    v-on:cancel="showItemFormDialog = false"
  )
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

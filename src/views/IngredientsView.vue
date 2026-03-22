<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import IngredientDisplay from '@/components/ingredients/IngredientDisplay.vue'
import IngredientForm from '@/components/ingredients/IngredientForm.vue'
import OptionEditorDialog from '@/components/restaurant/OptionEditorDialog.vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import useNutritionStore, { nutritionItemCategory } from '@/stores/nutrition'
import type { nutritionItem } from '@/types/nutrition'
import type { RestaurantOption } from '@/types/restaurant'
import { capitalize } from '@/utils'

const store = useNutritionStore()
const toast = useToast()
const confirm = useConfirm()

// ── Info tab ──────────────────────────────────────────────────────────────────

const infoName = ref(store.restaurantData.name)
const infoLogo = ref(store.restaurantData.logo)

watch(() => store.selectedRestaurant, () => {
  infoName.value = store.restaurantData.name
  infoLogo.value = store.restaurantData.logo
})

function saveInfo() {
  store.updateRestaurantInfo({ name: infoName.value, logo: infoLogo.value })
  toast.add({ severity: 'success', summary: 'Restaurant info saved', life: 2000 })
}

// ── Options tab ───────────────────────────────────────────────────────────────

const showOptionEditor = ref(false)
const editingOption = ref<RestaurantOption | null>(null)

function openNewOption() {
  editingOption.value = null
  showOptionEditor.value = true
}

function openEditOption(option: RestaurantOption) {
  editingOption.value = option
  showOptionEditor.value = true
}

function onOptionSaved(option: RestaurantOption) {
  store.saveOption(option)
  toast.add({ severity: 'success', summary: 'Option saved', life: 2000 })
}

function confirmRemoveOption(option: RestaurantOption) {
  confirm.require({
    message: `Remove option "${option.name}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Remove', severity: 'danger' },
    accept: () => {
      store.removeOption(option.key)
      toast.add({ severity: 'success', summary: 'Option removed', life: 2000 })
    },
  })
}

// ── Ingredients tab ───────────────────────────────────────────────────────────

const selectedCategory = ref<string>(nutritionItemCategory.bread)
const selectedCategoryItems = computed(() => store.items[selectedCategory.value])
const createIngredientLabel = computed(() => `Add ${capitalize(selectedCategory.value)}`)
const categoryLabeler = (category: string) => `${capitalize(category)}s`

const showAddCategory = ref(false)
const newCategoryName = ref('')

function addCategory() {
  const name = newCategoryName.value.trim().toLowerCase()
  if (!name) return
  store.addIngredientCategory(name)
  selectedCategory.value = name
  newCategoryName.value = ''
  showAddCategory.value = false
}

function confirmRemoveCategory() {
  const count = selectedCategoryItems.value?.length ?? 0
  confirm.require({
    message: count
      ? `"${selectedCategory.value}" has ${count} ingredient${count > 1 ? 's' : ''}. Remove anyway?`
      : `Remove category "${selectedCategory.value}"?`,
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Remove', severity: 'danger' },
    accept: () => {
      const categories = Object.keys(store.items)
      const fallback = categories.find(c => c !== selectedCategory.value) ?? ''
      store.removeIngredientCategory(selectedCategory.value)
      if (fallback) selectedCategory.value = fallback
      toast.add({ severity: 'success', summary: 'Category removed', life: 2000 })
    },
  })
}

const showImportDialog = ref(false)
const showExportDialog = ref(false)
const showItemFormDialog = ref(false)
const importText = ref('')

function copyExportToClipboard() {
  navigator.clipboard.writeText(store.dataExport).then(() => {
    toast.add({ severity: 'success', summary: 'Copied to clipboard', life: 2000 })
  })
}

function handleImport() {
  try {
    store.importData(importText.value)
    toast.add({ severity: 'success', summary: 'Import successful', life: 2000 })
    showImportDialog.value = false
    importText.value = ''
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Import failed', detail: (e as Error).message, life: 4000 })
  }
}

function resetForm() {
  itemForm.value = {
    id: '',
    name: '',
    nutrition: {
      servingSize: 0, calories: 0, totalFat: 0, satFat: 0, transFat: 0,
      chol: 0, sodium: 0, carb: 0, fiber: 0, sugar: 0, addedSugar: 0,
      protein: 0, vitA: 0, vitC: 0, calcium: 0, iron: 0,
    },
  }
}

function editItem(item: nutritionItem) {
  itemForm.value = { ...item, nutrition: { ...item.nutrition } }
  showItemFormDialog.value = true
}

function submitItem() {
  store.saveItem(selectedCategory.value, itemForm.value)
  toast.add({ severity: 'success', summary: 'Ingredient saved', life: 2000 })
  showItemFormDialog.value = false
}

const itemForm = ref({
  id: '',
  name: '',
  nutrition: {
    servingSize: 0, calories: 0, totalFat: 0, satFat: 0, transFat: 0,
    chol: 0, sodium: 0, carb: 0, fiber: 0, sugar: 0, addedSugar: 0,
    protein: 0, vitA: 0, vitC: 0, calcium: 0, iron: 0,
  },
} as nutritionItem)
</script>

<template lang="pug">
.page-header
  .page-title Restaurant Editor
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

Tabs(value="ingredients")
  TabList
    Tab(value="info") Info
    Tab(value="options") Options
    Tab(value="ingredients") Ingredients
  TabPanels
    //- ── Info ──────────────────────────────────────────────────────────────
    TabPanel(value="info")
      .info-form
        .info-logo-preview
          img(v-if="infoLogo" :src="infoLogo" alt="Restaurant logo")
          .logo-placeholder(v-else)
            i.pi.pi-shop
        .info-fields
          FloatLabel(variant="on")
            InputText(id="info-name" v-model="infoName")
            label(for="info-name") Restaurant Name
          FloatLabel(variant="on")
            InputText(id="info-logo" v-model="infoLogo")
            label(for="info-logo") Logo URL
          Button(label="Save" icon="pi pi-check" @click="saveInfo")

    //- ── Options ───────────────────────────────────────────────────────────
    TabPanel(value="options")
      .options-toolbar
        Button(label="Add Option" icon="pi pi-plus" @click="openNewOption")
      .options-list(v-if="store.restaurantData.options.length")
        .option-row(v-for="option in store.restaurantData.options" :key="option.key")
          .option-info
            span.option-name {{ option.name }}
            span.option-meta key: {{ option.key }} · base: {{ option.baseModifier }}x · {{ option.components.length }} component{{ option.components.length !== 1 ? 's' : '' }}
          .option-components
            span.component-chip(v-for="comp in option.components" :key="comp.category")
              | {{ comp.label }}
              span.type-badge(:class="comp.type") {{ comp.type[0] }}
          .option-actions
            Button(icon="pi pi-pencil" text rounded @click="openEditOption(option)")
            Button(icon="pi pi-trash" text rounded severity="danger" @click="confirmRemoveOption(option)")
      .empty-options(v-else) No options defined. Add one to allow users to build orders.

    //- ── Ingredients ───────────────────────────────────────────────────────
    TabPanel(value="ingredients")
      .category-toolbar
        SelectButton.category-selector(
          v-model="selectedCategory"
          :options="Object.keys(store.items)"
          :optionLabel="categoryLabeler"
          :allowEmpty="false"
        )
        .add-category(v-if="!showAddCategory")
          Button(icon="pi pi-plus" text rounded @click="showAddCategory = true")
          Button(
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            v-tooltip.top="'Remove category'"
            @click="confirmRemoveCategory"
          )
        .add-category-inline(v-else)
          InputText(v-model="newCategoryName" placeholder="Category name" size="small" @keydown.enter="addCategory" autofocus)
          Button(icon="pi pi-check" text rounded @click="addCategory")
          Button(icon="pi pi-times" text rounded severity="secondary" @click="showAddCategory = false; newCategoryName = ''")
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
          v-on:remove="store.removeItem(selectedCategory, item.id)"
          :key="item.id"
        )
        .no-items(v-if="!selectedCategoryItems?.length") No {{ selectedCategory }}s listed.

//- ── Dialogs ───────────────────────────────────────────────────────────────

OptionEditorDialog(
  v-model:visible="showOptionEditor"
  :option="editingOption"
  :available-categories="Object.keys(store.items)"
  @save="onOptionSaved"
)

Dialog(
  v-model:visible="showImportDialog"
  modal
  style="width: 700px; max-width: 90vw;"
  header="Import Restaurant"
)
  .import-content
    textarea(
      v-model="importText"
      placeholder="Paste exported restaurant JSON here"
      style="width: 100%; height: 300px;"
    )
    .import-actions
      Button(
        icon="pi pi-check"
        label="Import"
        severity="success"
        @click="handleImport"
        style="margin-top: 1rem;"
      )

Dialog(
  v-model:visible="showExportDialog"
  modal
  style="width: 700px; max-width: 90vw;"
  header="Export Restaurant"
)
  .export-content
    textarea(readonly style="width: 100%; height: 300px;") {{ store.dataExport }}
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
  margin-bottom: 16px;

  .page-title {
    font-size: 3rem;

    @media (max-width: 640px) { font-size: 1.8rem; }
  }

  .actions {
    margin-left: auto;
    display: flex;
    gap: 6px;

    button {
      font-weight: bold;
    }

    @media (max-width: 640px) {
      gap: 4px;

      // Shrink buttons: hide label, keep icon
      :deep(.p-button-label) { display: none; }
      :deep(.p-button-icon) { margin: 0; }
    }
  }
}

// ── Info tab ────────────────────────────────────────────────────────────────

.info-form {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  padding: 24px 0;
  max-width: 640px;

  @media (max-width: 640px) { flex-direction: column; gap: 16px; align-items: center; }

  .info-logo-preview {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 12px;
    border: 1px solid var(--p-surface-200);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--p-surface-50);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .logo-placeholder {
      font-size: 2.5rem;
      color: var(--p-text-muted-color);
    }
  }

  .info-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

// ── Options tab ─────────────────────────────────────────────────────────────

.options-toolbar {
  margin-bottom: 16px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
    gap: 10px;
  }

  .option-info {
    display: flex;
    flex-direction: column;
    min-width: 180px;

    @media (max-width: 640px) { min-width: 0; flex: 1; }

    .option-name {
      font-weight: 600;
      font-size: 1rem;
    }

    .option-meta {
      font-size: 0.75rem;
      color: var(--p-text-muted-color);
      margin-top: 2px;
    }
  }

  .option-components {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;

    @media (max-width: 640px) { width: 100%; flex: none; }
  }

  .option-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
}

.component-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 99px;
  background: var(--p-surface-100);
  font-size: 0.78rem;
  font-weight: 500;

  .type-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;

    &.single { background: #dbeafe; color: #1d4ed8; }
    &.multiple { background: #dcfce7; color: #15803d; }
    &.force { background: #fef9c3; color: #a16207; }
  }
}

.empty-options {
  color: var(--p-text-muted-color);
  padding: 32px;
  text-align: center;
  border: 1px dashed var(--p-surface-300);
  border-radius: 10px;
}

// ── Ingredients tab ─────────────────────────────────────────────────────────

.category-toolbar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 16px 0;
  overflow-x: auto;
  padding-bottom: 4px;

  .category-selector {
    flex-shrink: 0;

    @media (max-width: 640px) {
      flex-shrink: 1;
      :deep(.p-selectbutton) { flex-wrap: wrap; }
    }
  }

  .add-category-inline {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.ingredients {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }

  .no-items {
    height: 200px;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

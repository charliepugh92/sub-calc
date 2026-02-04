<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import SpeedDial, { type MenuItem } from 'primevue/speeddial'
import Dialog from 'primevue/dialog'
import type { nutritionItem } from '@/stores/nutrition'
import NutritionFacts from './NutritionFacts.vue'

const toast = useToast();

const { item, enableEditor = false } = defineProps<{
  item: nutritionItem
  enableEditor?: boolean
}>()

const speedDialItems = [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      toast.add({ severity: 'secondary', summary: 'Edit Clicked', life: 1500 })
    },
  },
  {
    label: 'View',
    icon: 'pi pi-eye',
    command: () => {
      viewingIngredient.value = true
    },
  },
  {
    label: 'Remove',
    icon: 'pi pi-trash',
    command: () => {
      toast.add({ severity: 'secondary', summary: 'Delete Clicked', life: 1500 })
    }
  }
] as MenuItem[]

const viewingIngredient = ref(false)
</script>

<template lang="pug">
.item-display
  SpeedDial.item-display-menu(
    v-if="enableEditor"
    :model="speedDialItems"
    direction="left"
    style="position: absolute; top: 10px; right: 10px;"
    :tooltip-options="{ position: 'bottom' }"
  )
  .name {{ item.name }}
  .detail-group.calories
    .label Calories
    .value {{ item.nutrition.calories }}
  .macros
    .macro-group.protein
      .label Protein
      .value {{ item.nutrition.protein }}g
    .macro-group.carbs
      .label Carbs
      .value {{ item.nutrition.carb }}g
    .macro-group.fat
      .label Fat
      .value {{ item.nutrition.totalFat }}g
Dialog(
  v-model:visible="viewingIngredient"
  modal
  :header="item.name"
  :style="{ width: '30rem' }"
)
  NutritionFacts(:item="item")
</template>

<style scoped lang="scss">
.item-display {
  height: 200px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px 20px;
  display: grid;
  grid-template-rows: auto auto auto;
  position: relative;

  .name {
    width: 100%;
    font-size: 1.8rem;
  }

  .calories {
    font-size: 1.3rem;
    display: flex;
    gap: 10px;
    align-items: center;

    .label {
      font-weight: 300;
    }

    .value {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  .macros {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    .macro-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.2rem;

      .label {
        font-weight: 300;
      }

      .value {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }
}
</style>

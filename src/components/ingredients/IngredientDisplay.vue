<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import SpeedDial from 'primevue/speeddial'
import Dialog from 'primevue/dialog'
import type { nutritionItem } from '@/stores/nutrition'
import NutritionFacts from './NutritionFacts.vue'

const toast = useToast();

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'click'): void
}>()

const {
  item,
  enableEditor = false,
  size = 'default',
  highlight = false,
} = defineProps<{
  item: nutritionItem
  enableEditor?: boolean
  size: 'default' | 'slim'
  highlight: boolean
}>()

const speedDialItems = [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      emit('edit')
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
]

const viewingIngredient = ref(false)

const styleClass = computed(() => {
  return [
    size === 'slim' ? 'size-slim' : '',
    highlight ? 'highlighted' : '',
  ].join(' ')
})
</script>

<template lang="pug">
.item-display(
  :class="styleClass"
  v-on:click="emit('click')"
)
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
  NutritionFacts(:nutrition="item.nutrition")
</template>

<style scoped lang="scss">
.item-display {
  &.size-slim {
    height: 125px;
    padding: 5px 10px;
    grid-template-rows: auto auto;

    .name {
      font-size: clamp(0.8rem, 1.5rem, 1.2vw);
    }

    .calories {
      font-size: 1.1rem;

      .label {
        font-weight: 300;
      }

      .value {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
    .macros {
      .macro-group {
        font-size: 1rem;

        .label {
          font-weight: 300;
        }

        .value {
          font-size: 1rem;
          font-weight: bold;
        }
      }
    }
  }

  height: 200px;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px 20px;
  display: grid;
  grid-template-rows: auto auto auto;
  position: relative;
  transition: box-shadow 0.3s, border-color 0.3s;

  &.highlighted {
    border-color: #007ad9;
    box-shadow: 0 0 10px #007ad9;
  }

  .name {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    font-size: clamp(1rem, 2rem, 1.5vw);
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

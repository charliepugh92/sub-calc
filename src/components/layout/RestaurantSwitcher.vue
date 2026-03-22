<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import useNutritionStore from '@/stores/nutrition'

const nutritionStore = useNutritionStore()

const showModal = ref(false)
const showNewForm = ref(false)
const newName = ref('')
const newLogo = ref('')

const currentRestaurant = () =>
  nutritionStore.restaurantOptions.find(r => r.key === nutritionStore.selectedRestaurant)

function select(key: string) {
  nutritionStore.selectRestaurant(key)
  showModal.value = false
}

function submitNew() {
  if (!newName.value.trim()) return
  nutritionStore.addRestaurant(newName.value.trim(), newLogo.value.trim())
  newName.value = ''
  newLogo.value = ''
  showNewForm.value = false
  showModal.value = false
}

function cancelNew() {
  newName.value = ''
  newLogo.value = ''
  showNewForm.value = false
}
</script>

<template lang="pug">
button.switcher-btn(@click="showModal = true")
  img.current-logo(
    v-if="currentRestaurant()?.logo"
    :src="currentRestaurant()?.logo"
    :alt="currentRestaurant()?.name"
  )
  span {{ currentRestaurant()?.name ?? 'Select Restaurant' }}
  i.pi.pi-chevron-down

Dialog(
  v-model:visible="showModal"
  modal
  header="Restaurants"
  :style="{ width: '480px' }"
  @hide="cancelNew"
)
  .restaurant-grid
    button.restaurant-card(
      v-for="r in nutritionStore.restaurantOptions"
      :key="r.key"
      :class="{ active: r.key === nutritionStore.selectedRestaurant }"
      @click="select(r.key)"
    )
      img.card-logo(v-if="r.logo" :src="r.logo" :alt="r.name")
      .card-placeholder(v-else)
        i.pi.pi-shop
      span.card-name {{ r.name }}
      i.pi.pi-check.check-icon(v-if="r.key === nutritionStore.selectedRestaurant")

    template(v-if="!showNewForm")
      button.restaurant-card.add-card(@click="showNewForm = true")
        .card-placeholder
          i.pi.pi-plus
        span.card-name New Restaurant

    .new-restaurant-form(v-else)
      FloatLabel(variant="on")
        InputText(id="new-name" v-model="newName" autofocus)
        label(for="new-name") Restaurant Name
      FloatLabel(variant="on")
        InputText(id="new-logo" v-model="newLogo")
        label(for="new-logo") Logo URL (optional)
      .form-actions
        Button(label="Cancel" severity="secondary" size="small" @click="cancelNew")
        Button(label="Create" size="small" :disabled="!newName.trim()" @click="submitNew")
</template>

<style scoped lang="scss">
.switcher-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .current-logo {
    height: 22px;
    width: 22px;
    object-fit: contain;
    border-radius: 4px;
  }

  .pi-chevron-down {
    font-size: 0.7rem;
    opacity: 0.8;
  }
}

.restaurant-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 4px;
}

.restaurant-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1.5px solid var(--p-surface-200);
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  position: relative;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--p-primary-300);
    background: var(--p-primary-50);
  }

  &.active {
    border-color: var(--p-primary-500);
    background: var(--p-primary-50);
  }

  &.add-card {
    border-style: dashed;
    color: var(--p-text-muted-color);

    &:hover {
      border-color: var(--p-primary-400);
      color: var(--p-primary-500);
      background: var(--p-primary-50);
    }
  }

  .card-logo {
    height: 48px;
    width: 48px;
    object-fit: contain;
    border-radius: 8px;
  }

  .card-placeholder {
    height: 48px;
    width: 48px;
    border-radius: 8px;
    background: var(--p-surface-100);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--p-text-muted-color);
  }

  .card-name {
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
  }

  .check-icon {
    position: absolute;
    top: 8px;
    right: 10px;
    color: var(--p-primary-500);
    font-size: 0.75rem;
  }
}

.new-restaurant-form {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1.5px solid var(--p-surface-200);
  border-radius: 10px;

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>

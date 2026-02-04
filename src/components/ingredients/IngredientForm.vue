<script setup lang="ts">
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { nutritionItem } from '@/stores/nutrition';

const { formData } = defineProps<{
  formData: nutritionItem
}>()

const emit = defineEmits(['submit', 'cancel'])

function handleSubmit() {
  if (validateForm()) {
    emit('submit', formData)
  }
}

const errorMessages = ref({} as Record<string, string>)
function validateForm() {
  const errors = {} as Record<string, string>
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Ingredient name is required.'
  }
  if (
    formData.nutrition.servingSize === undefined ||
    formData.nutrition.servingSize === null ||
    isNaN(formData.nutrition.servingSize) ||
    formData.nutrition.servingSize < 0
  ) {
    errors.servingSize = 'Serving size is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.calories === undefined ||
    formData.nutrition.calories === null ||
    isNaN(formData.nutrition.calories) ||
    formData.nutrition.calories < 0
  ) {
    errors.calories = 'Calories are required and must be 0 or greater.'
  }
  if (
    formData.nutrition.totalFat === undefined ||
    formData.nutrition.totalFat === null ||
    isNaN(formData.nutrition.totalFat) ||
    formData.nutrition.totalFat < 0
  ) {
    errors.totalFat = 'Total fat is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.satFat === undefined ||
    formData.nutrition.satFat === null ||
    isNaN(formData.nutrition.satFat) ||
    formData.nutrition.satFat < 0
  ) {
    errors.satFat = 'Saturated fat is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.transFat === undefined ||
    formData.nutrition.transFat === null ||
    isNaN(formData.nutrition.transFat) ||
    formData.nutrition.transFat < 0
  ) {
    errors.transFat = 'Trans fat is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.chol === undefined ||
    formData.nutrition.chol === null ||
    isNaN(formData.nutrition.chol) ||
    formData.nutrition.chol < 0
  ) {
    errors.chol = 'Cholesterol is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.sodium === undefined ||
    formData.nutrition.sodium === null ||
    isNaN(formData.nutrition.sodium) ||
    formData.nutrition.sodium < 0
  ) {
    errors.sodium = 'Sodium is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.carb === undefined ||
    formData.nutrition.carb === null ||
    isNaN(formData.nutrition.carb) ||
    formData.nutrition.carb < 0
  ) {
    errors.carb = 'Total carbohydrates are required and must be 0 or greater.'
  }
  if (
    formData.nutrition.fiber === undefined ||
    formData.nutrition.fiber === null ||
    isNaN(formData.nutrition.fiber) ||
    formData.nutrition.fiber < 0
  ) {
    errors.fiber = 'Dietary fiber is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.sugar === undefined ||
    formData.nutrition.sugar === null ||
    isNaN(formData.nutrition.sugar) ||
    formData.nutrition.sugar < 0
  ) {
    errors.sugar = 'Total sugars are required and must be 0 or greater.'
  }
  if (
    formData.nutrition.addedSugar === undefined ||
    formData.nutrition.addedSugar === null ||
    isNaN(formData.nutrition.addedSugar) ||
    formData.nutrition.addedSugar < 0
  ) {
    errors.addedSugar = 'Added sugars are required and must be 0 or greater.'
  }
  if (
    formData.nutrition.protein === undefined ||
    formData.nutrition.protein === null ||
    isNaN(formData.nutrition.protein) ||
    formData.nutrition.protein < 0
  ) {
    errors.protein = 'Protein is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.vitA === undefined ||
    formData.nutrition.vitA === null ||
    isNaN(formData.nutrition.vitA) ||
    formData.nutrition.vitA < 0
  ) {
    errors.vitA = 'Vitamin A is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.vitC === undefined ||
    formData.nutrition.vitC === null ||
    isNaN(formData.nutrition.vitC) ||
    formData.nutrition.vitC < 0
  ) {
    errors.vitC = 'Vitamin C is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.calcium === undefined ||
    formData.nutrition.calcium === null ||
    isNaN(formData.nutrition.calcium) ||
    formData.nutrition.calcium < 0
  ) {
    errors.calcium = 'Calcium is required and must be 0 or greater.'
  }
  if (
    formData.nutrition.iron === undefined ||
    formData.nutrition.iron === null ||
    isNaN(formData.nutrition.iron) ||
    formData.nutrition.iron < 0
  ) {
    errors.iron = 'Iron is required and must be 0 or greater.'
  }

  errorMessages.value = errors
  return Object.keys(errors).length === 0
}
</script>

<template lang="pug">
form.ingredient-form(@submit.prevent="handleSubmit")
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="name"
        type="text"
        v-model="formData.name"
        required
        autofocus
      )
      label(for="name") Name
  .form-group
    FloatLabel(variant="on")
      InputText(  
        id="servingSize"
        type="number"
        v-model.number="formData.nutrition.servingSize"
        min="0"
        required
      )
      label(for="servingSize") Serving Size (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="calories"
        type="number"
        v-model.number="formData.nutrition.calories"
        min="0"
        required
      )
      label(for="calories") Calories
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="totalFat"
        type="number"
        v-model.number="formData.nutrition.totalFat"
        min="0"
        required
      )
      label(for="totalFat") Total Fat (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="saturatedFat"
        type="number"
        v-model.number="formData.nutrition.satFat"
        min="0"
        required
      )
      label(for="saturatedFat") Saturated Fat (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="transFat"
        type="number"
        v-model.number="formData.nutrition.transFat"
        min="0"
        required
      )
      label(for="transFat") Trans Fat (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="cholesterol"
        type="number"
        v-model.number="formData.nutrition.chol"
        min="0"
        required
      )
      label(for="cholesterol") Cholesterol (mg)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="sodium"
        type="number"
        v-model.number="formData.nutrition.sodium"
        min="0"
        required
      )
      label(for="sodium") Sodium (mg)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="carbohydrates"
        type="number"
        v-model.number="formData.nutrition.carb"
        min="0"
        required
      )
      label(for="carbohydrates") Total Carbohydrates (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="dietaryFiber"
        type="number"
        v-model.number="formData.nutrition.fiber"
        min="0"
        required
      )
      label(for="dietaryFiber") Dietary Fiber (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="totalSugars"
        type="number"
        v-model.number="formData.nutrition.sugar"
        min="0"
        required
      )
      label(for="totalSugars") Total Sugars (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="addedSugars"
        type="number"
        v-model.number="formData.nutrition.addedSugar"
        min="0"
        required
      )
      label(for="addedSugars") Added Sugars (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="protein"
        type="number"
        v-model.number="formData.nutrition.protein"
        min="0"
        required
      )
      label(for="protein") Protein (g)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="vitaminA"
        type="number"
        v-model.number="formData.nutrition.vitA"
        min="0"
        required
      )
      label(for="vitaminA") Vitamin A (mcg)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="vitaminC"
        type="number"
        v-model.number="formData.nutrition.vitC"
        min="0"
        required
      )
      label(for="vitaminC") Vitamin C (mg)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="calcium"
        type="number"
        v-model.number="formData.nutrition.calcium"
        min="0"
        required
      )
      label(for="calcium") Calcium (mg)
  .form-group
    FloatLabel(variant="on")
      InputText(
        id="iron"
        type="number"
        v-model.number="formData.nutrition.iron"
        min="0"
        required
      )
      label(for="iron") Iron (mg)
  .form-actions
    Button(
      label="Cancel"
      class="p-button-secondary"
      @click.prevent="emit('cancel')"
    ) Cancel
    Button(
      label="Save"
      type="submit"
      class="p-button-primary"
      @click.prevent="handleSubmit()"
    ) Save
</template>

<style scoped lang="scss">
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;

  input {
    width: 100%;
  }
}

form {
  padding-top: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
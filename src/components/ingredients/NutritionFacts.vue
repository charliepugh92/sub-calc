<script setup lang="ts">
import { computed } from 'vue'
import type { nutritionFacts } from '../../stores/nutrition'

const {
  nutrition,
  servingDescription = '6" sub portion',
} = defineProps<{ nutrition: nutritionFacts, servingDescription: string }>()

</script>

<template lang="pug">
.nutrition-label
  header Nutrition Facts
.section
  .label Serving Size:
  .value {{ servingDescription }} (about {{ nutrition.servingSize }}g)
hr
.section.calories
  .row
    .nutrient Calories
    .value.font-bold {{ nutrition.calories }}
hr
.section
  .row
    .nutrient Total Fat
    .value {{ nutrition.totalFat }}g
  .row.sub-nutrient
    .nutrient Saturated Fat
    .value {{ nutrition.satFat }}g
  .row.sub-nutrient
    .nutrient Trans Fat
    .value {{ nutrition.transFat }}g
  .row.sub-nutrient
    .nutrient Cholesterol
    .value {{ nutrition.chol }}mg
  .row
    .nutrient Sodium
    .value {{ nutrition.sodium }}mg
  .row
    .nutrient Total Carbohydrate
    .value {{ nutrition.carb }}g
  .row.sub-nutrient
    .nutrient Dietary Fiber
    .value {{ nutrition.fiber }}g
  .row.sub-nutrient
    .nutrient Total Sugars
    .value {{ nutrition.sugar }}g
  .row.sub-nutrient
    .nutrient Added Sugars
    .value {{ nutrition.addedSugar }}g
  .row
    .nutrient Protein
    .value {{ nutrition.protein }}g
.section.vitamins
  .row
    .nutrient Vitamin A
    .value {{ nutrition.vitA }}%
  .row
    .nutrient Vitamin C
    .value {{ nutrition.vitC }}%
  .row
    .nutrient Calcium
    .value {{ nutrition.calcium }}%
  .row
    .nutrient Iron
    .value {{ nutrition.iron }}%
</template>

<style scoped lang="scss">
.nutrition-label {
  width: 100%;
  background: #fff;
  margin-bottom: 12px;
  font-family: 'Arial Narrow', Arial, sans-serif;
  color: #000;
  box-sizing: border-box;
}

.font-bold {
  font-weight: bold !important;
}

.calories {

  .nutrient, .value {
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.nutrition-label header {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 1px;
  border-bottom: 8px solid #000;
  padding-bottom: 4px;
  margin-bottom: 8px;
  text-align: left;
}

.section.vitamins {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 40px;
  border-top: 1px solid #bbb;
  margin-top: 8px;
  padding-top: 8px;

  .row {
    border-bottom: none;
    padding: 0;
    margin: 0;
  }
}

.section {
  margin-bottom: 8px;
}

.label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 2px;
}

hr {
  border: none;
  border-top: 2px solid #000;
  margin: 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1rem;
  border-bottom: 1px solid #bbb;
  padding: 2px 0;
}

.nutrient {
  font-weight: bold;
}

.value {
  font-weight: normal;
}

.row .nutrient {
  margin-right: 8px;
}

.row:last-child {
  border-bottom: none;
}

.row.sub-nutrient {
  font-size: 0.95rem;
  font-weight: normal;
  padding-left: 16px;
}
</style>

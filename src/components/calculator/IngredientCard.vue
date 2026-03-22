<script setup lang="ts">
import type { nutritionItem } from '@/types/nutrition'
import type { ComponentModifier } from '@/types/restaurant'

const props = defineProps<{
  item: nutritionItem
  modifiers?: ComponentModifier[]
  selected?: boolean
  activeModifierKey?: string
  baseMultiplier?: number
}>()

function display(value: number | undefined): number {
  return Math.round((value ?? 0) * (props.baseMultiplier ?? 1))
}

const emit = defineEmits<{
  select: []
  'modifier-change': [modifier: ComponentModifier]
}>()

function handleModifierClick(e: MouseEvent, modifier: ComponentModifier) {
  e.stopPropagation()
  emit('modifier-change', modifier)
}
</script>

<template lang="pug">
.ingredient-row(:class="{ selected }" @click="emit('select')")
  .row-indicator
  .row-name {{ item.name }}
  .row-modifiers(v-if="modifiers?.length && selected")
    button.modifier-pill(
      v-for="mod in modifiers"
      :key="mod.key"
      :class="{ active: selected && activeModifierKey === mod.key }"
      @click="handleModifierClick($event, mod)"
    ) {{ mod.short }}
  .row-nutrients
    .nutrient.calories
      span.value {{ display(item.nutrition.calories) }}
      span.unit cal
    .nutrient
      span.value {{ display(item.nutrition.protein) }}
      span.unit g P
    .nutrient
      span.value {{ display(item.nutrition.carb) }}
      span.unit g C
    .nutrient
      span.value {{ display(item.nutrition.totalFat) }}
      span.unit g F
</template>

<style scoped lang="scss">
.ingredient-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.12s;

  &:hover:not(.selected) {
    background: var(--p-surface-50); // overridden per-parity by parent
  }

  &.selected {
    background: rgba(39, 71, 200, 0.1);
    border-left: 3px solid #2747c8;
    padding-left: 9px;

    .row-indicator {
      background: #2747c8;
      border-color: #2747c8;
    }

    .row-name {
      color: #2747c8;
      font-weight: 700;
    }

    .nutrient.calories .value {
      color: #2747c8;
    }
  }

  .row-indicator {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 1.5px solid var(--p-surface-400);
    flex-shrink: 0;
    transition: background 0.12s, border-color 0.12s;
  }

  .row-name {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .row-modifiers {
    display: flex;
    gap: 4px;
    flex-shrink: 0;

    .modifier-pill {
      padding: 2px 8px;
      border-radius: 99px;
      border: 1px solid var(--p-surface-300);
      background: transparent;
      font-size: 0.62rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--p-text-muted-color);
      line-height: 1.5;
      transition: background 0.12s, border-color 0.12s, color 0.12s;

      &:hover {
        border-color: var(--p-primary-400);
        color: var(--p-primary-500);
      }

      &.active {
        background: var(--p-primary-500);
        border-color: var(--p-primary-500);
        color: #fff;
      }
    }
  }

  .row-nutrients {
    display: flex;
    gap: 4px;
    flex-shrink: 0;

    .nutrient {
      display: flex;
      align-items: baseline;
      gap: 2px;
      width: 64px;
      justify-content: flex-end;

      .value {
        font-size: 1rem;
        font-weight: 600;
        transition: color 0.12s;
      }

      .unit {
        font-size: 0.7rem;
        color: var(--p-text-muted-color);
        font-weight: 500;
      }
    }

    @media (max-width: 640px) {
      gap: 2px;

      .nutrient {
        width: 48px;
        .value { font-size: 0.85rem; }
        .unit { font-size: 0.58rem; }
      }

      // Hide carbs & fat on small screens, keep calories & protein
      .nutrient:nth-child(3),
      .nutrient:nth-child(4) { display: none; }
    }
  }
}
</style>

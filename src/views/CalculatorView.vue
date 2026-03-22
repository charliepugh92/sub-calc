<script setup lang="ts">
import { computed, ref } from 'vue'
import useNutritionStore from '@/stores/nutrition'
import useCalculatorStore from '@/stores/calculator'
import NutritionFacts from '@/components/ingredients/NutritionFacts.vue'
import IngredientCard from '@/components/calculator/IngredientCard.vue'
import SelectButton from 'primevue/selectbutton'
import type { nutritionItem } from '@/types/nutrition'
import type { ComponentModifier } from '@/types/restaurant'

const nutritionStore = useNutritionStore()
const calculatorStore = useCalculatorStore()

const visibleComponents = computed(() =>
  calculatorStore.selectedOrderOption?.components.filter(c => c.type !== 'force') ?? []
)

const collapsedCategories = ref(new Set<string>())
const drawerExpanded = ref(false)

function onCollapseEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = '0'
  e.offsetHeight
  e.style.height = `${e.scrollHeight}px`
}

function onCollapseAfterEnter(el: Element) {
  (el as HTMLElement).style.height = 'auto'
}

function onCollapseLeave(el: Element) {
  const e = el as HTMLElement
  e.style.height = `${e.scrollHeight}px`
  e.offsetHeight
  e.style.height = '0'
}

function toggleCategory(category: string) {
  if (collapsedCategories.value.has(category)) {
    collapsedCategories.value.delete(category)
  } else {
    collapsedCategories.value.add(category)
  }
}

function itemIsIncluded(itemId: string): boolean {
  return calculatorStore.sandwich.items.some(({ item }) => item.id === itemId)
}

function getActiveModifierKey(itemId: string): string | undefined {
  return calculatorStore.sandwich.items.find(({ item }) => item.id === itemId)?.modifierKey
}

function getDefaultModifier(category: string): ComponentModifier | undefined {
  const mods = calculatorStore.selectedOrderOption?.components.find(c => c.category === category)?.modifiers
  return mods?.find(m => m.default) ?? mods?.[0]
}

function handleSelection(category: string, item: nutritionItem, componentType: string) {
  if (itemIsIncluded(item.id)) {
    calculatorStore.removeItemFromSandwich(item.id)
  } else {
    const defaultMod = getDefaultModifier(category)
    if (componentType === 'single') {
      calculatorStore.replaceCategoryItem(category, item, defaultMod?.multiplier ?? 1, defaultMod?.key)
    } else {
      calculatorStore.addItemToSandwich(item, defaultMod?.multiplier ?? 1, defaultMod?.key)
    }
  }
}

function handleModifierChange(category: string, item: nutritionItem, modifier: ComponentModifier, componentType: string) {
  if (!itemIsIncluded(item.id)) {
    if (componentType === 'single') {
      calculatorStore.replaceCategoryItem(category, item, modifier.multiplier, modifier.key)
    } else {
      calculatorStore.addItemToSandwich(item, modifier.multiplier, modifier.key)
    }
  } else {
    calculatorStore.updateItemModifier(item.id, modifier)
  }
}
</script>

<template lang="pug">
.calculator-view
  .ingredient-selections
    .selections-header
      h2 Build Your Order
      SelectButton(
        v-model="calculatorStore.sandwich.type"
        :options="Object.values(calculatorStore.sandwichType)"
        :allowEmpty="false"
      )
    .category-section(
      v-for="component in visibleComponents"
      :key="component.category"
    )
      .category-label(@click="toggleCategory(component.category)")
        span {{ component.label }}
        i.pi.pi-chevron-down(:class="{ collapsed: collapsedCategories.has(component.category) }")
      Transition(name="collapse" @enter="onCollapseEnter" @after-enter="onCollapseAfterEnter" @leave="onCollapseLeave")
        .ingredient-list(v-if="!collapsedCategories.has(component.category)")
          IngredientCard(
            v-for="item in nutritionStore.items[component.category]"
            :key="item.id"
            :item="item"
            :modifiers="component.modifiers"
            :baseMultiplier="(component.baseMultipler ?? 1) * (calculatorStore.selectedOrderOption?.baseModifier ?? 1)"
            :selected="itemIsIncluded(item.id)"
            :activeModifierKey="getActiveModifierKey(item.id)"
            @select="handleSelection(component.category, item, component.type)"
            @modifier-change="(mod) => handleModifierChange(component.category, item, mod, component.type)"
          )
  .nutrition-summary
    NutritionFacts(
      servingDescription="Whole Sandwich"
      :nutrition="calculatorStore.itemSummary"
    )

.nutrition-drawer(:class="{ expanded: drawerExpanded }")
  .drawer-handle(@click="drawerExpanded = !drawerExpanded")
    .drawer-macros
      .drawer-macro
        span.val {{ Math.round(calculatorStore.itemSummary.calories ?? 0) }}
        span.lbl cal
      .drawer-macro
        span.val {{ Math.round(calculatorStore.itemSummary.protein ?? 0) }}
        span.lbl g P
      .drawer-macro
        span.val {{ Math.round(calculatorStore.itemSummary.carb ?? 0) }}
        span.lbl g C
      .drawer-macro
        span.val {{ Math.round(calculatorStore.itemSummary.totalFat ?? 0) }}
        span.lbl g F
    i.pi(:class="drawerExpanded ? 'pi-chevron-down' : 'pi-chevron-up'")
  .drawer-content
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
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  .ingredient-selections {
    flex: 1 1 0;
    min-width: 0;

    @media (max-width: 1024px) { width: 100%; }

    .selections-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--p-surface-200);

      h2 {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--p-text-muted-color);
        margin: 0;
      }

    }

    .category-section {
      margin-bottom: 20px;

      .category-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--p-text-muted-color);
        margin-bottom: 6px;
        padding: 0 2px;
        cursor: pointer;
        user-select: none;

        i { font-size: 0.65rem; transition: transform 0.22s ease; }
        i.collapsed { transform: rotate(-90deg); }

        &:hover { color: var(--p-text-color); }
      }

      .collapse-enter-active,
      .collapse-leave-active {
        transition: height 0.22s ease;
        overflow: hidden;
      }

      .ingredient-list {
        border: 1px solid var(--p-surface-200);
        border-radius: 8px;
        overflow: hidden;

        :deep(.ingredient-row:nth-child(odd)) {
          background: rgba(39, 71, 200, 0.09);
        }

        :deep(.ingredient-row:nth-child(even)) {
          background: var(--p-surface-50);
        }

        :deep(.ingredient-row:nth-child(odd):hover:not(.selected)) {
          background: rgba(39, 71, 200, 0.15);
        }

        :deep(.ingredient-row:nth-child(even):hover:not(.selected)) {
          background: var(--p-surface-50);
        }

        .ingredient-row:not(:last-child) {
          border-bottom: 1px solid var(--p-surface-200);
        }
      }
    }
  }

  .nutrition-summary {
    align-self: flex-start;
    position: sticky;
    top: 30px;
    width: 320px;
    flex-shrink: 0;
    background: #fff;
    border: 1px solid var(--p-surface-200);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    @media (max-width: 1024px) { display: none; }
  }
}

// Mobile sticky nutrition drawer — outside .calculator-view so it escapes the flex context
.nutrition-drawer {
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: #fff;
    border-top: 2px solid var(--p-surface-200);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    max-height: 60px;
    overflow: hidden;
    transition: max-height 0.3s ease;

    &.expanded {
      max-height: 80vh;
      overflow-y: auto;
    }
  }

  .drawer-handle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    cursor: pointer;
    flex-shrink: 0;

    &:hover { background: var(--p-surface-50); }

    .drawer-macros {
      display: flex;
      gap: 20px;
    }

    .drawer-macro {
      display: flex;
      align-items: baseline;
      gap: 3px;

      .val {
        font-size: 1.1rem;
        font-weight: 700;
        color: #2747c8;
      }

      .lbl {
        font-size: 0.65rem;
        font-weight: 600;
        color: var(--p-text-muted-color);
      }
    }

    i {
      color: var(--p-text-muted-color);
      font-size: 0.85rem;
      transition: transform 0.3s ease;
    }
  }

  .drawer-content {
    padding: 0 16px 16px;
  }
}

// Prevent last ingredient being hidden behind drawer on mobile
@media (max-width: 1024px) {
  .calculator-view {
    padding-bottom: 76px;
  }
}
</style>

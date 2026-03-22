<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import FloatLabel from 'primevue/floatlabel'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import type { RestaurantOption, OptionComponent, ComponentModifier } from '@/types/restaurant'

const props = defineProps<{
  option: RestaurantOption | null
  visible: boolean
  availableCategories: string[]
}>()

const emit = defineEmits<{
  'update:visible': [v: boolean]
  save: [option: RestaurantOption]
}>()

const typeOptions: OptionComponent['type'][] = ['single', 'multiple', 'force']

const form = ref<RestaurantOption>(emptyOption())
const keyManuallyEdited = ref(false)

function emptyOption(): RestaurantOption {
  return { name: '', key: '', baseModifier: 1, components: [] }
}

function emptyComponent(): OptionComponent {
  return { label: '', category: '', type: 'multiple' }
}

function emptyModifier(): ComponentModifier {
  return { key: '', label: '', short: '', multiplier: 1 }
}

watch(() => props.option, (opt) => {
  keyManuallyEdited.value = false
  form.value = opt ? JSON.parse(JSON.stringify(opt)) : emptyOption()
}, { immediate: true })

watch(() => form.value.name, (name) => {
  if (!keyManuallyEdited.value) {
    form.value.key = name.toLowerCase().replace(/\s+/g, '-')
  }
})

watch(() => form.value.key, (_key, _old) => {
  if (form.value.name && form.value.key !== form.value.name.toLowerCase().replace(/\s+/g, '-')) {
    keyManuallyEdited.value = true
  }
})

function addComponent() {
  form.value.components.push(emptyComponent())
}

function removeComponent(idx: number) {
  form.value.components.splice(idx, 1)
}

function addModifier(comp: OptionComponent) {
  comp.modifiers ??= []
  comp.modifiers.push(emptyModifier())
}

function removeModifier(comp: OptionComponent, idx: number) {
  comp.modifiers!.splice(idx, 1)
  if (!comp.modifiers!.length) delete comp.modifiers
}

function onModifierLabelChange(mod: ComponentModifier) {
  if (!mod.key || mod.key === mod.label.toLowerCase().replace(/\s+/g, '-')) {
    mod.key = mod.label.toLowerCase().replace(/\s+/g, '-')
  }
}

function onTypeChange(comp: OptionComponent) {
  if (comp.type === 'force') {
    delete comp.modifiers
    delete comp.baseMultipler
  } else {
    delete comp.forcedOption
  }
}

function save() {
  emit('save', JSON.parse(JSON.stringify(form.value)))
  emit('update:visible', false)
}
</script>

<template lang="pug">
Dialog(
  :visible="visible"
  @update:visible="emit('update:visible', $event)"
  modal
  :header="option ? `Edit Option: ${option.name}` : 'New Option'"
  :style="{ width: '90vw', maxWidth: '860px' }"
)
  .option-editor
    .basics-row
      FloatLabel(variant="on")
        InputText(id="opt-name" v-model="form.name")
        label(for="opt-name") Name
      FloatLabel(variant="on")
        InputText(id="opt-key" v-model="form.key")
        label(for="opt-key") Key
      FloatLabel(variant="on")
        InputNumber(inputId="opt-base-modifier" v-model="form.baseModifier" :min="0" :step="0.5")
        label(for="opt-base-modifier") Base Modifier

    .components-section
      .section-header
        span.section-title Components
        Button(label="Add Component" icon="pi pi-plus" size="small" @click="addComponent")

      .empty-state(v-if="!form.components.length") No components yet. Add one to define the selection categories for this option.

      .component-card(v-for="(comp, ci) in form.components" :key="ci")
        .component-header
          FloatLabel(variant="on")
            InputText(:id="`comp-label-${ci}`" v-model="comp.label")
            label(:for="`comp-label-${ci}`") Label
          FloatLabel(variant="on")
            Select(
              :inputId="`comp-cat-${ci}`"
              v-model="comp.category"
              :options="availableCategories"
              editable
            )
            label(:for="`comp-cat-${ci}`") Category
          FloatLabel(variant="on")
            Select(
              :inputId="`comp-type-${ci}`"
              v-model="comp.type"
              :options="typeOptions"
              @change="onTypeChange(comp)"
            )
            label(:for="`comp-type-${ci}`") Type
          FloatLabel(variant="on" v-if="comp.type !== 'force'")
            InputNumber(:inputId="`comp-mult-${ci}`" v-model="comp.baseMultipler" :min="0" :step="0.5" placeholder="1")
            label(:for="`comp-mult-${ci}`") Base Multiplier
          Button(icon="pi pi-trash" text rounded severity="danger" @click="removeComponent(ci)")

        .force-option(v-if="comp.type === 'force'")
          FloatLabel(variant="on")
            InputText(:id="`comp-forced-${ci}`" v-model="comp.forcedOption")
            label(:for="`comp-forced-${ci}`") Forced Option ID

        .modifiers-section(v-if="comp.type !== 'force'")
          .modifiers-header
            span Modifiers
            Button(label="Add Modifier" icon="pi pi-plus" text size="small" @click="addModifier(comp)")
          .modifier-row(v-for="(mod, mi) in (comp.modifiers ?? [])" :key="mi")
            FloatLabel(variant="on")
              InputText(:id="`mod-label-${ci}-${mi}`" v-model="mod.label" @input="onModifierLabelChange(mod)")
              label(:for="`mod-label-${ci}-${mi}`") Label
            FloatLabel(variant="on")
              InputText(:id="`mod-key-${ci}-${mi}`" v-model="mod.key")
              label(:for="`mod-key-${ci}-${mi}`") Key
            FloatLabel(variant="on")
              InputText(:id="`mod-short-${ci}-${mi}`" v-model="mod.short")
              label(:for="`mod-short-${ci}-${mi}`") Short
            FloatLabel(variant="on")
              InputNumber(:inputId="`mod-mult-${ci}-${mi}`" v-model="mod.multiplier" :min="0" :step="0.5")
              label(:for="`mod-mult-${ci}-${mi}`") Multiplier
            .default-toggle
              Checkbox(:inputId="`mod-default-${ci}-${mi}`" v-model="mod.default" :binary="true")
              label(:for="`mod-default-${ci}-${mi}`") Default
            Button(icon="pi pi-trash" text rounded severity="danger" @click="removeModifier(comp, mi)")

  template(#footer)
    Button(label="Cancel" severity="secondary" @click="emit('update:visible', false)")
    Button(label="Save Option" icon="pi pi-check" @click="save")
</template>

<style scoped lang="scss">
.option-editor {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basics-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 16px;

  @media (max-width: 720px) { grid-template-columns: 1fr; }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .section-title {
    font-size: 1rem;
    font-weight: 600;
  }
}

.empty-state {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  padding: 16px;
  text-align: center;
  border: 1px dashed var(--p-surface-300);
  border-radius: 8px;
}

.component-card {
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1.5fr auto;
  gap: 12px;
  align-items: center;

  // Stack all fields; delete button pins top-right (immune to v-if shifts)
  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;

    > :not(button:last-child) { grid-column: 1; }
    > button:last-child { grid-column: 2; grid-row: 1; align-self: start; margin-top: 6px; }
  }
}

.force-option {
  max-width: 340px;
}

.modifiers-section {
  border-top: 1px solid var(--p-surface-100);
  padding-top: 12px;
}

.modifiers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--p-text-muted-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.modifier-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr auto auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;

  // Stack all fields; delete button pins top-right
  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;

    > :not(button:last-child) { grid-column: 1; }
    > button:last-child { grid-column: 2; grid-row: 1; align-self: start; margin-top: 6px; }
  }

  .default-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    white-space: nowrap;
  }
}
</style>

import type { nutritionItem } from './nutrition';

export interface RestaurantData {
  options: RestaurantOption[]
  ingredients: Record<string, nutritionItem[]>
  name: string
  logo: string
}

export interface RestaurantOption {
  name: string
  key: string
  components: OptionComponent[]
  baseModifier: number
}

export interface OptionComponent {
  label: string
  category: string
  type: 'single'|'multiple'|'force'
  forcedOption?: string
  options?: string[]
  modifiers?: ComponentModifier[]
  baseMultipler?: number
}

export interface ComponentModifier {
  key: string
  label: string
  short: string
  multiplier: number
  default?: boolean
}
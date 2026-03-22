export interface nutritionItem {
  id: string
  name: string
  nutrition: nutritionFacts
}

export interface nutritionFacts {
  servingSize?: number
  calories?: number
  totalFat?: number
  satFat?: number
  transFat?: number
  chol?: number
  sodium?: number
  carb?: number
  fiber?: number
  sugar?: number
  addedSugar?: number
  protein?: number
  vitA?: number
  vitC?: number
  calcium?: number
  iron?: number
}
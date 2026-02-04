import { createRouter, createWebHistory } from 'vue-router'
import CalculatorView from '../views/CalculatorView.vue'
import IngredientsView from '../views/IngredientsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'calculator',
      component: CalculatorView,
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: IngredientsView,
    }
  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/Test.vue')
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('../views/Result.vue')
    },
    {
      path: '/poster',
      name: 'Poster',
      component: () => import('../views/Poster.vue')
    }
  ]
})

export default router 
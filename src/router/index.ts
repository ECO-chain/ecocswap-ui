import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/info',
    name: 'Information',
    component: () => import(/* webpackChunkName: "info" */ '../views/Info.vue'),
  },
  {
    path: '/stat',
    name: 'Statistics',
    component: () => import(/* webpackChunkName: "stat" */ '../views/Stat.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

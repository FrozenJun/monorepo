import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DashboardRoutes from '../views/dashboard/index.route'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home',
  },
  ...DashboardRoutes,
  {
    name: '404',
    path: '/:chapters*',
    redirect: '/home',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router

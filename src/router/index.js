import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import MachinesCreate from '../pages/MachinesCreate.vue'
import Analytical from '../pages/Analytical.vue'
import PMSchedule from '../pages/PMSchedule.vue'
import ExportPdf from '../pages/ExportPdf.vue'
import UserProfile from '../pages/UserProfile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/machines/create', component: MachinesCreate },
  { path: '/analytics', component: Analytical },
  { path: '/pm-schedule', component: PMSchedule },
  { path: '/export-pdf', component: ExportPdf },
  { path: '/profile', component: UserProfile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
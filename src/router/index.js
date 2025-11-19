import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import DairyCheckPage from '../pages/DairyCheckPage.vue'
import MachinesCreate from '../pages/MachinesCreate.vue'
import Analytical from '../pages/Analytical.vue'
import PMSchedule from '../pages/PMSchedule.vue'
import ExportPdf from '../pages/ExportPdf.vue'
import UserProfile from '../pages/UserProfile.vue'
import RequestList from '../pages/RequestList.vue'
import RequestForm from '../pages/RequestForm.vue'
import ChecklistNext from '../pages/ChecklistNext.vue'




const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  {
    path: '/dairy-check/:equipmentName',
    name: 'DairyCheckPage',
    component: DairyCheckPage,
    props: true
  },
  { path: '/machines/create', component: MachinesCreate },
  { path: '/analytics', component: Analytical },
  { path: '/pm-schedule', component: PMSchedule },
  { path: '/export-pdf', component: ExportPdf },
  { path: '/profile', component: UserProfile },
  { path: '/requests', component: RequestList },
  { path: '/requests/new', component: RequestForm },
  {
    path: '/checklist-next',
    name: 'ChecklistNext',
    component: ChecklistNext
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
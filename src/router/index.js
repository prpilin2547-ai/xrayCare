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
import Dashboarddmin from '../pages-admin/Dashboarddmin.vue'
import DashboardEN from '../page-engineer/DashboardEN.vue'
import AnalyticalEN from '../page-engineer/AnalyticalEN.vue'
import RequestEN from '../page-engineer/RequestEN.vue'
import Adminuseraccount from '../pages-admin/Adminuseraccount.vue'
import ChecklistNext from '../pages/ChecklistNext.vue'
import MonthlyCheckPage from '../pages/MonthlyCheckPage.vue'
import F10LightCheckPage from '../pages/F10LightCheckPage.vue' 
import MonthlyCheckAll from '../pages/MonthlyCheckAll.vue'
import F12 from '../pages/F12.vue'
import F9ProtectiveClothesForm from '../pages/F9ProtectiveClothesForm.vue'






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
  { path: '/admindashboard', component: Dashboarddmin },
  { path: '/engineerdashboard', component: DashboardEN },
  { path: '/analyticalen', component: AnalyticalEN },
  { path: '/requesten', component: RequestEN },
  { path: '/adminuseraccount', component: Adminuseraccount }
  { path: '/requests/new', component: RequestForm },
  {
    path: '/checklist-next',
    name: 'ChecklistNext',
    component: ChecklistNext
  },
  {
  path: '/monthly-check',
  name: 'MonthlyCheck',
  component: MonthlyCheckPage
},
{   
    path: '/monthly-check-light',
    name: 'MonthlyCheckLight',
    component: F10LightCheckPage,
    props: true     // เพื่อส่งข้อมูลเครื่องจาก Dashboard ได้
  },
   {
    path: '/monthly-check-all',
    name: 'MonthlyCheckAll',
    component: MonthlyCheckAll,
    props: true      // ส่งค่า selectedDevice, currentUserName ได้
  },
  {
    path: '/f12',
    name: 'F12',
    component: F12
  },
  {
    path: '/f9',
    name: 'F9ProtectiveClothesForm',
    component: F9ProtectiveClothesForm
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
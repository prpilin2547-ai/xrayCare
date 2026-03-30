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
import F11 from '../pages/F11.vue'
import F13 from '../pages/F13.vue'
import QCFormsHub from '../pages/QCFormsHub.vue'
import AdminAnalytical from '../pages-admin/AdminAnalytical.vue'
import XrayF1Print from '../formprint/XrayF1Print.vue'
import XrayF2Print from '../formprint/XrayF2Print.vue'
import XrayF1PrintMonthly from '../formprint/XrayF1PrintMonthly.vue'
import XrayF2PrintMonthly from '../formprint/XrayF2PrintMonthly.vue'
import XrayF3Print from '../formprint/XrayF3Print.vue'
import XrayF4Print from '../formprint/XrayF4Print.vue'
import XrayF5Print from '../formprint/XrayF5Print.vue'
import XrayF6Print from '../formprint/XrayF6Print.vue'
import XrayF71Print from '../formprint/XrayF71Print.vue'
import XrayF9Print from '../formprint/XrayF9Print.vue'
import XrayF10Print from '../formprint/XrayF10Print.vue'
import XrayF11Print from '../formprint/XrayF11Print.vue'
import XrayF12Print from '../formprint/XrayF12Print.vue'
import XrayF13Print from '../formprint/XrayF13Print.vue'
import CustomFormBuilder from '../pages/CustomFormBuilder.vue'


// Role constants
const ALL_ROLES = ['admin', 'radiological technologist', 'engineer']
const ADMIN = ['admin']
const TECH = ['radiological technologist']
const ENGINEER = ['engineer']
const ADMIN_TECH = ['admin', 'radiological technologist']
const ADMIN_ENGINEER = ['admin', 'engineer']

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },

  // === MAIN pages (Tech + Admin) ===
  { path: '/dashboard', component: Dashboard, meta: { roles: TECH } },
  { path: '/dairy-check/:equipmentName', name: 'DairyCheckPage', component: DairyCheckPage, props: true, meta: { roles: ADMIN_TECH } },
  { path: '/machines/create', component: MachinesCreate, meta: { roles: ADMIN_TECH } },
  { path: '/analytics', component: Analytical, meta: { roles: ADMIN_TECH } },
  { path: '/pm-schedule', component: PMSchedule, meta: { roles: ADMIN_TECH } },
  { path: '/export-pdf', component: ExportPdf, meta: { roles: ADMIN_TECH } },
  { path: '/requests', component: RequestList, meta: { roles: ADMIN_TECH } },
  { path: '/requests/new', component: RequestForm, meta: { roles: ADMIN_TECH } },
  { path: '/checklist-next', name: 'ChecklistNext', component: ChecklistNext, meta: { roles: ADMIN_TECH } },
  { path: '/monthly-check', name: 'MonthlyCheck', component: MonthlyCheckPage, meta: { roles: ADMIN_TECH } },
  { path: '/monthly-check-light', name: 'MonthlyCheckLight', component: F10LightCheckPage, props: true, meta: { roles: ADMIN_TECH } },
  { path: '/monthly-check-all', name: 'MonthlyCheckAll', component: MonthlyCheckAll, props: true, meta: { roles: ADMIN_TECH } },
  { path: '/f12', name: 'F12', component: F12, meta: { roles: ADMIN_TECH } },
  { path: '/f9', name: 'F9ProtectiveClothesForm', component: F9ProtectiveClothesForm, meta: { roles: ADMIN_TECH } },
  { path: '/f11', name: 'F11Page', component: F11, meta: { roles: ADMIN_TECH } },
  { path: '/f13', name: 'F13', component: F13, meta: { roles: ADMIN_TECH } },
  { path: '/qc-forms', name: 'QCFormsHub', component: QCFormsHub, meta: { roles: ADMIN_TECH } },
  { path: '/custom-form-builder', name: 'CustomFormBuilder', component: CustomFormBuilder, meta: { roles: ADMIN_TECH } },
  { path: '/custom-forms/:id', name: 'CustomFormView', component: CustomFormBuilder, props: true, meta: { roles: ADMIN_TECH } },

  // === ADMIN pages ===
  { path: '/admindashboard', component: Dashboarddmin, meta: { roles: ADMIN } },
  { path: '/adminuseraccount', component: Adminuseraccount, meta: { roles: ADMIN } },
  { path: '/adminanalytical', component: AdminAnalytical, meta: { roles: ADMIN } },

  // === ENGINEER pages ===
  { path: '/engineerdashboard', component: DashboardEN, meta: { roles: ENGINEER } },
  { path: '/analyticalen', component: AnalyticalEN, meta: { roles: ADMIN_ENGINEER } },
  { path: '/requesten', component: RequestEN, meta: { roles: ADMIN_ENGINEER } },

  // === Shared pages (all roles) ===
  { path: '/profile', component: UserProfile, meta: { roles: ALL_ROLES } },

  // === Print pages (all roles) ===
  { path: '/formprint/xray-f1', name: 'XrayF1Print', component: XrayF1Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f2', name: 'XrayF2Print', component: XrayF2Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f1-monthly', name: 'XrayF1PrintMonthly', component: XrayF1PrintMonthly, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f2-monthly', name: 'XrayF2PrintMonthly', component: XrayF2PrintMonthly, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f3', name: 'XrayF3Print', component: XrayF3Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f4', name: 'XrayF4Print', component: XrayF4Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f5', name: 'XrayF5Print', component: XrayF5Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f6', name: 'XrayF6Print', component: XrayF6Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f71', name: 'XrayF71Print', component: XrayF71Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f72', name: 'XrayF72Print', component: XrayF71Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f81', name: 'XrayF81Print', component: XrayF71Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f82', name: 'XrayF82Print', component: XrayF71Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f9', name: 'XrayF9Print', component: XrayF9Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f10', name: 'XrayF10Print', component: XrayF10Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f11', name: 'XrayF11Print', component: XrayF11Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f12', name: 'XrayF12Print', component: XrayF12Print, props: true, meta: { roles: ALL_ROLES } },
  { path: '/formprint/xray-f13', name: 'XrayF13Print', component: XrayF13Print, props: true, meta: { roles: ALL_ROLES } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getRoleHome(position) {
  if (position === 'admin') return '/admindashboard'
  if (position === 'engineer') return '/engineerdashboard'
  return '/dashboard'
}

const publicPaths = ['/login']
router.beforeEach((to, _from, next) => {
  const isPublic = publicPaths.includes(to.path)
  let user
  try {
    user = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
  } catch {
    user = {}
  }
  const isLoggedIn = !!(user && user.username)
  const position = (user.position || '').toLowerCase()

  if (isPublic) {
    if (isLoggedIn) return next(getRoleHome(position))
    return next()
  }

  if (!isLoggedIn) return next('/login')

  const allowedRoles = to.meta.roles
  if (allowedRoles && !allowedRoles.includes(position)) {
    return next(getRoleHome(position))
  }

  next()
})

export default router

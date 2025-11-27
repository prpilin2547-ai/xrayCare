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
import XrayF3Print from '../formprint/XrayF3Print.vue'
import XrayF4Print from '../formprint/XrayF4Print.vue'
import XrayF5Print from '../formprint/XrayF5Print.vue'
import XrayF6Print from '../formprint/XrayF6Print.vue'
import XrayF71Print from '../formprint/XrayF71Print.vue'
import XrayF72Print from '../formprint/XrayF72Print.vue'
import XrayF81Print from '../formprint/XrayF81Print.vue'
import XrayF82Print from '../formprint/XrayF82Print.vue'
import XrayF9Print from '../formprint/XrayF9Print.vue'
import XrayF10Print from '../formprint/XrayF10Print.vue'
import XrayF11Print from '../formprint/XrayF11Print.vue'
import XrayF12Print from '../formprint/XrayF12Print.vue'
import XrayF13Print from '../formprint/XrayF13Print.vue'


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
  { path: '/adminuseraccount', component: Adminuseraccount },
  { path: '/adminanalytical', component: AdminAnalytical },

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
    props: true
  },

  {
    path: '/monthly-check-all',
    name: 'MonthlyCheckAll',
    component: MonthlyCheckAll,
    props: true
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
  },

  {
    path: '/f11',
    name: 'F11Page',
    component: F11
  },

  {
    path: '/f13',
    name: 'F13',
    component: F13
  },

  {
    path: '/qc-forms',
    name: 'QCFormsHub',
    component: QCFormsHub
  },

  {
    path: '/formprint/xray-f1',
    name: 'XrayF1Print',
    component: XrayF1Print,
    props: true
  },
  {
    path: '/formprint/xray-f2',
    name: 'XrayF2Print',
    component: XrayF2Print,
    props: true
  },
  {
    path: '/formprint/xray-f3',
    name: 'XrayF3Print',
    component: XrayF3Print,
    props: true
  },
  {
    path: '/formprint/xray-f4',
    name: 'XrayF4Print',
    component: XrayF4Print,
    props: true
  },
  {
    path: '/formprint/xray-f5',
    name: 'XrayF5Print',
    component: XrayF5Print,
    props: true
  },
  {
    path: '/formprint/xray-f6',
    name: 'XrayF6Print',
    component: XrayF6Print,
    props: true
  },
  {
    path: '/formprint/xray-f71',
    name: 'XrayF71Print',
    component: XrayF71Print,
    props: true
  },
  {
    path: '/formprint/xray-f72',
    name: 'XrayF72Print',
    component: XrayF72Print,
    props: true
  },
  {
    path: '/formprint/xray-f81',
    name: 'XrayF81Print',
    component: XrayF81Print,
    props: true
  },
  {
    path: '/formprint/xray-f82',
    name: 'XrayF82Print',
    component: XrayF82Print,
    props: true
  },
  {
    path: '/formprint/xray-f9',
    name: 'XrayF9Print',
    component: XrayF9Print,
    props: true
  },
  {
    path: '/formprint/xray-f10',
    name: 'XrayF10Print',
    component: XrayF10Print,
    props: true
  },
  {
    path: '/formprint/xray-f11',
    name: 'XrayF11Print',
    component: XrayF11Print,
    props: true
  },
  {
    path: '/formprint/xray-f12',
    name: 'XrayF12Print',
    component: XrayF12Print,
    props: true
  },
  {
    path: '/formprint/xray-f13',
    name: 'XrayF13Print',
    component: XrayF13Print,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

<template>
  <div class="layout-root">
    <TopBar
      :role="userRole"
      :username="userName"
      :hospital-name="hospitalName"
      :hospital-id="hospitalId"
      :is-super-admin="isSuperAdmin"
      :hospitals="hospitals"
      class="topbar-fixed"
      @toggle-sidebar="toggleSidebar"
      @switch-hospital="onSwitchHospital"
    />

    <div class="layout-body">
      <SidebarNav
        :active="activeMenu"
        :open="sidebarOpen"
        :role="userRole"
        @navigate="onNavigate"
        @close="sidebarOpen = false"
        class="sidebar-slot"
        :class="{ 'sidebar-desktop': !isMobile }"
      />
      <main class="layout-content" :class="{ 'content-full': isMobile }">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoredUser } from '../../api/client'
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'

const route = useRoute()
const router = useRouter()

const userName = ref('')
const userRole = ref('Tech')
const hospitalName = ref('')
const hospitalId = ref(null)
const isSuperAdmin = ref(false)
const hospitals = ref([])
const sidebarOpen = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

function onResize() {
  windowWidth.value = window.innerWidth
  if (windowWidth.value > 1024) {
    sidebarOpen.value = false
  }
}

function refreshFromStorage() {
  const stored = getStoredUser()
  if (stored) {
    if (stored.username) userName.value = stored.username
    if (stored.position) userRole.value = stored.position
    if (stored.hospitalName) hospitalName.value = stored.hospitalName
    if (stored.hospitalId != null) hospitalId.value = stored.hospitalId
    isSuperAdmin.value = stored.isSuperAdmin === true
  }
}

async function loadHospitalsForSuperAdmin() {
  const stored = getStoredUser()
  if (!stored?.isSuperAdmin) return
  try {
    const { API_BASE } = await import('../../api/client')
    const res = await fetch(`${API_BASE}/GetHospitals`)
    if (res.ok) {
      const list = await res.json()
      hospitals.value = Array.isArray(list) ? list : []
    }
  } catch (e) {
    console.warn('Load hospitals for switch failed', e)
  }
}

function onSwitchHospital({ id, name }) {
  const stored = getStoredUser()
  if (!stored) return
  const updated = { ...stored, hospitalId: id, hospitalName: name || '' }
  localStorage.setItem('xraycare-user', JSON.stringify(updated))
  hospitalName.value = name || ''
  hospitalId.value = id
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
    if (stored.position) userRole.value = stored.position
    if (stored.hospitalName) hospitalName.value = stored.hospitalName
    if (stored.hospitalId != null) hospitalId.value = stored.hospitalId
    if (stored.isSuperAdmin === true) {
      isSuperAdmin.value = true
      loadHospitalsForSuperAdmin()
    }
  } catch (e) {
    console.error('Cannot read user from localStorage', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const isMobile = computed(() => windowWidth.value <= 1024)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

const activeMenu = computed(() => {
  if (route.path.startsWith('/dashboard')) return 'dashboard'
  if (route.path.startsWith('/machines')) return 'equipment'
  if (route.path.startsWith('/analytics')) return 'analytical'
  if (route.path.startsWith('/pm-schedule')) return 'pm'
  if (route.path.startsWith('/export-pdf')) return 'export'
  if (route.path.startsWith('/profile')) return 'profile'
  if (route.path.startsWith('/requests')) return 'request'
  if (route.path.startsWith('/admindashboard')) return 'admindashboard'
  if (route.path.startsWith('/engineerdashboard')) return 'engineerdashboard'
  if (route.path.startsWith('/analyticalen')) return 'engineeranalytical'
  if (route.path.startsWith('/requesten')) return 'engineerrequest'
  if (route.path.startsWith('/adminuseraccount')) return 'adminuseraccount'
  if (route.path.startsWith('/qc-forms')) return 'additionalforms'
  if (route.path.startsWith('/adminanalytical')) return 'adminanalytical'
  if (route.path.startsWith('/custom-form-builder')) return 'additionalforms'
  if (route.path.startsWith('/f9') || route.path.startsWith('/f11') || route.path.startsWith('/f12') || route.path.startsWith('/f13')) return 'additionalforms'
  if (route.path.startsWith('/monthly-check') || route.path.startsWith('/checklist-next') || route.path.startsWith('/dairy-check')) return 'dashboard'
  return ''
})

const onNavigate = (menu) => {
  switch (menu) {
    case 'dashboard': router.push('/dashboard'); break
    case 'equipment': router.push('/machines/create'); break
    case 'checklist': router.push('/dashboard'); break
    case 'pm': router.push('/pm-schedule'); break
    case 'export': router.push('/export-pdf'); break
    case 'analytical': router.push('/analytics'); break
    case 'request': router.push('/requests'); break
    case 'profile': router.push('/profile'); break
    case 'admindashboard': router.push('/admindashboard'); break
    case 'engineerdashboard': router.push('/engineerdashboard'); break
    case 'engineeranalytical': router.push('/analyticalen'); break
    case 'engineerrequest': router.push('/requesten'); break
    case 'adminuseraccount': router.push('/adminuseraccount'); break
    case 'additionalforms': router.push('/qc-forms'); break
    case 'adminanalytical': router.push('/adminanalytical'); break
    case 'logout':
      localStorage.removeItem('xraycare-user')
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  background: var(--bg-body, #f0f2f5);
}

.topbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.layout-body {
  display: flex;
  padding-top: var(--topbar-h, 60px);
  min-height: 100vh;
  background: var(--bg-body, #f0f4f8);
}

.sidebar-desktop {
  position: fixed;
  top: var(--topbar-h, 60px);
  left: 0;
  bottom: 0;
  width: var(--sidebar-w, 260px);
  height: calc(100vh - var(--topbar-h, 60px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 90;
}

.layout-content {
  flex: 1;
  margin-left: var(--sidebar-w, 260px);
  padding: 28px 32px 40px;
  overflow-y: auto;
  background: var(--bg-body, #f0f4f8);
  min-height: calc(100vh - var(--topbar-h, 60px));
}

.layout-content.content-full {
  margin-left: 0;
}

/* ====== TABLET (<= 1024px) ====== */
@media (max-width: 1024px) {
  .layout-content {
    margin-left: 0;
    padding: 20px 20px 32px;
  }
}

/* ====== MOBILE (<= 640px) ====== */
@media (max-width: 640px) {
  .layout-body {
    padding-top: 52px;
  }

  .layout-content {
    padding: 16px 12px 24px;
  }
}
</style>

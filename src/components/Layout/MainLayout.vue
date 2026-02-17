<template>
  <div class="layout-root">
    <!-- พื้นหลังเทาเข้มด้านนอก -->
    <div class="layout-shell m-nav">
      <TopBar :role="userRole" :username="userName" class="fixed-top"/>
      <!-- แถบบนสีม่วง -->
      <!-- ส่วนล่าง: sidebar + เนื้อหา -->
      <div class="layout-body">
        <SidebarNav :active="activeMenu" @navigate="onNavigate" class="" />
        <main class="layout-content">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'

const route = useRoute()
const router = useRouter()

/* ---------- อ่านข้อมูลผู้ใช้จาก localStorage ---------- */
const userName = ref('')
const userRole = ref('Tech')

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
    if (stored.position) userRole.value = stored.position
  } catch (e) {
    console.error('Cannot read user from localStorage', e)
  }
})

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
    case 'checklist': router.push('/dashboard'); break // ยังเป็น mock
    case 'pm': router.push('/pm-schedule'); break
    case 'export': router.push('/export-pdf'); break
    case 'analytical': router.push('/analytics'); break
    case 'request': router.push('/requests'); break // ยังเป็น mock
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
  background: #111111;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: flex-start; */
}

.layout-shell {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.layout-body {
  display: flex;
  flex: 1;
}

.layout-content {
  flex: 1;
  padding: 24px 32px 32px;
}

.m-nav {
  margin-top: 56px;
}
</style>

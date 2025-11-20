<template>
  <div class="layout-root">
    <!-- พื้นหลังเทาเข้มด้านนอก -->
    <div class="layout-shell">
      <!-- แถบบนสีม่วง -->
      <TopBar :role="role" />

      <!-- ส่วนล่าง: sidebar + เนื้อหา -->
      <div class="layout-body">
        <SidebarNav
          :active="activeMenu"
          @navigate="onNavigate"
        />
        <main class="layout-content">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'

const route = useRoute()
const router = useRouter()
const role = 'Tech' // mock; ค่อยไปผูกกับ auth ทีหลัง

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
  return ''
})

const onNavigate = (menu) => {
  switch (menu) {
    case 'dashboard': router.push('/dashboard'); break
    case 'equipment': router.push('/machines/create'); break
    case 'checklist': router.push('/dashboard'); break // ยังเป็น mock
    case 'pm':        router.push('/pm-schedule'); break
    case 'export':    router.push('/export-pdf'); break
    case 'analytical':router.push('/analytics'); break
    case 'request':   router.push('/requests'); break // ยังเป็น mock
    case 'profile':   router.push('/profile'); break
    case 'admindashboard': router.push('/admindashboard'); break
    case 'engineerdashboard': router.push('/engineerdashboard'); break
    case 'logout':    router.push('/login'); break
    case 'engineeranalytical': router.push('/analyticalen'); break
    case 'engineerrequest': router.push('/requesten'); break
    case 'adminuseraccount': router.push('/adminuseraccount'); break
  }
}
</script>

<style scoped>
.layout-root {
  min-height: 100vh;
  background: #111111; /* เทาเข้มด้านนอกเหมือน mockup */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.layout-shell {
  width: 100%;
  /* max-width: 1440px; */
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
</style>

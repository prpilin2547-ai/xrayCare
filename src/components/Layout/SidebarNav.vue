<template>
  <div>
    <!-- Mobile overlay backdrop -->
    <Transition name="fade">
      <div v-if="open" class="sidebar-overlay" @click="$emit('close')"></div>
    </Transition>

    <Transition name="slide">
      <aside v-show="isVisible" class="sidebar" :class="{ 'sidebar-mobile': isMobileMode }">
        <nav class="menu">
          <div class="menu-section">
            <span class="section-label">MAIN</span>
            <ul>
              <li :class="{ active: active === 'dashboard' }" @click="handleNav('dashboard')">
                <div class="menu-icon"><i class="fa-solid fa-house"></i></div>
                <span>Dashboard</span>
              </li>
              <li :class="{ active: active === 'equipment' }" @click="handleNav('equipment')">
                <div class="menu-icon"><i class="fa-solid fa-laptop-medical"></i></div>
                <span>Equipment</span>
              </li>
              <li :class="{ active: active === 'pm' }" @click="handleNav('pm')">
                <div class="menu-icon"><i class="fa-solid fa-calendar-check"></i></div>
                <span>PM Schedule</span>
              </li>
              <li :class="{ active: active === 'export' }" @click="handleNav('export')">
                <div class="menu-icon"><i class="fa-solid fa-file-export"></i></div>
                <span>Export PDF</span>
              </li>
              <li :class="{ active: active === 'analytical' }" @click="handleNav('analytical')">
                <div class="menu-icon"><i class="fa-solid fa-chart-column"></i></div>
                <span>Analytical</span>
              </li>
              <li :class="{ active: active === 'request' }" @click="handleNav('request')">
                <div class="menu-icon"><i class="fa-solid fa-wrench"></i></div>
                <span>Request</span>
              </li>
              <li :class="{ active: active === 'additionalforms' }" @click="handleNav('additionalforms')">
                <div class="menu-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                <span>QC Forms</span>
              </li>
            </ul>
          </div>

          <div class="menu-section">
            <span class="section-label">ADMIN</span>
            <ul>
              <li :class="{ active: active === 'admindashboard' }" @click="handleNav('admindashboard')">
                <div class="menu-icon"><i class="fa-solid fa-gauge-high"></i></div>
                <span>Admin Dashboard</span>
              </li>
              <li :class="{ active: active === 'adminuseraccount' }" @click="handleNav('adminuseraccount')">
                <div class="menu-icon"><i class="fa-solid fa-users-gear"></i></div>
                <span>User Accounts</span>
              </li>
              <li :class="{ active: active === 'adminanalytical' }" @click="handleNav('adminanalytical')">
                <div class="menu-icon"><i class="fa-solid fa-chart-pie"></i></div>
                <span>Admin Analytics</span>
              </li>
            </ul>
          </div>

          <div class="menu-section">
            <span class="section-label">ENGINEER</span>
            <ul>
              <li :class="{ active: active === 'engineerdashboard' }" @click="handleNav('engineerdashboard')">
                <div class="menu-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
                <span>Engineer Dashboard</span>
              </li>
              <li :class="{ active: active === 'engineeranalytical' }" @click="handleNav('engineeranalytical')">
                <div class="menu-icon"><i class="fa-solid fa-chart-line"></i></div>
                <span>Engineer Analytics</span>
              </li>
              <li :class="{ active: active === 'engineerrequest' }" @click="handleNav('engineerrequest')">
                <div class="menu-icon"><i class="fa-solid fa-ticket"></i></div>
                <span>Engineer Request</span>
              </li>
            </ul>
          </div>
        </nav>

        <div class="sidebar-bottom">
          <button class="btn-logout" @click="handleNav('logout')">
            <div class="menu-icon"><i class="fa-solid fa-arrow-right-from-bracket"></i></div>
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  active: {
    type: String,
    default: ''
  },
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate', 'close'])

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

function onResize() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const isMobileMode = computed(() => windowWidth.value <= 1024)
const isVisible = computed(() => {
  if (!isMobileMode.value) return true
  return props.open
})

function handleNav(menu) {
  emit('navigate', menu)
  if (isMobileMode.value) {
    emit('close')
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w, 260px);
  background: var(--bg-sidebar, #111827);
  display: flex;
  flex-direction: column;
  padding: 20px 12px 16px;
  overflow-y: auto;
}

.sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  padding-top: 20px;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 199;
}

.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4b5563;
  padding: 0 12px;
  margin-bottom: 6px;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.85rem;
  font-weight: 500;
  color: #9ca3af;
  cursor: pointer;
  margin-bottom: 2px;
  position: relative;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.menu-icon {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.menu li:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
}

.menu li.active {
  background: linear-gradient(135deg, rgba(108, 60, 224, 0.2), rgba(139, 92, 246, 0.12));
  color: #c4b5fd;
  font-weight: 600;
}

.menu li.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: var(--radius-full, 9999px);
  background: linear-gradient(180deg, #8b5cf6, #6c3ce0);
}

.menu li.active .menu-icon {
  color: #a78bfa;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-logout {
  width: 100%;
  padding: 9px 12px;
  border-radius: var(--radius-sm, 8px);
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: #9ca3af;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.btn-logout:hover .menu-icon {
  color: #f87171;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-leave-active {
  transition: transform 200ms ease-in;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}

/* ====== MOBILE (<= 640px) ====== */
@media (max-width: 640px) {
  .sidebar {
    width: 280px;
    padding-top: 16px;
  }

  .menu li {
    padding: 10px 12px;
    font-size: 0.9rem;
  }

  .menu-icon {
    font-size: 0.9rem;
  }
}
</style>

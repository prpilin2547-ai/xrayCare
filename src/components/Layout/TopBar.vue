<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="hamburger-btn" @click="$emit('toggle-sidebar')" aria-label="Toggle menu">
        <i class="fa-solid fa-bars"></i>
      </button>
      <div class="brand-group">
        <div class="brand-icon">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="brand-text">
          <span class="brand-name">X-RayCare</span>
          <span class="brand-tag">QC Management</span>
        </div>
      </div>
    </div>
    <div class="topbar-right">
      <div v-if="hospitalName" class="hospital-wrap">
        <button
          v-if="isSuperAdmin && hospitals.length > 0"
          type="button"
          class="hospital-badge hospital-badge-btn"
          @click="toggleHospitalDropdown"
          aria-haspopup="listbox"
          :aria-expanded="showHospitalDropdown"
        >
          <i class="fa-solid fa-hospital"></i>
          <span>{{ hospitalName }}</span>
          <i class="fa-solid fa-chevron-down dropdown-chevron"></i>
        </button>
        <div v-else class="hospital-badge">
          <i class="fa-solid fa-hospital"></i>
          <span>{{ hospitalName }}</span>
        </div>
        <div v-if="showHospitalDropdown" class="hospital-dropdown" role="listbox">
          <button
            v-for="h in hospitals"
            :key="h.id"
            type="button"
            class="hospital-dropdown-item"
            :class="{ active: h.id === currentHospitalId }"
            @click="selectHospital(h)"
          >
            <span>{{ h.name }}</span>
            <i v-if="h.id === currentHospitalId" class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
      <div class="user-chip">
        <div class="user-avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="user-info">
          <span class="user-name">{{ displayUsername }}</span>
          <span class="user-role">{{ displayRole }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['toggle-sidebar', 'switch-hospital'])

const props = defineProps({
  role: {
    type: String,
    default: 'Tech'
  },
  username: {
    type: String,
    default: ''
  },
  hospitalName: {
    type: String,
    default: ''
  },
  hospitalId: {
    type: Number,
    default: null
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  hospitals: {
    type: Array,
    default: () => []
  }
})

const showHospitalDropdown = ref(false)
const displayUsername = computed(() => props.username || 'Username')
const displayRole = computed(() => props.role || 'Tech')
const currentHospitalId = computed(() => props.hospitalId)

function toggleHospitalDropdown() {
  showHospitalDropdown.value = !showHospitalDropdown.value
}

function selectHospital(h) {
  emit('switch-hospital', { id: h.id, name: h.name })
  showHospitalDropdown.value = false
}

function onDocumentClick(e) {
  const wrap = document.querySelector('.hospital-wrap')
  if (wrap && !wrap.contains(e.target)) showHospitalDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.topbar {
  height: var(--topbar-h, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-topbar, linear-gradient(135deg, #0C4A6E 0%, #0369A1 50%, #0284C7 100%));
  color: #ffffff;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-btn {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast, 150ms);
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.brand-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #7DD3FC;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.brand-tag {
  font-size: 0.65rem;
  font-weight: 500;
  opacity: 0.6;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.2;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hospital-wrap {
  position: relative;
}

.hospital-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
}

.hospital-badge-btn {
  border: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
  transition: background 0.15s;
}
.hospital-badge-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dropdown-chevron {
  margin-left: 4px;
  font-size: 0.65rem;
  opacity: 0.8;
  transition: transform 0.2s;
}
.hospital-badge-btn[aria-expanded="true"] .dropdown-chevron {
  transform: rotate(180deg);
}

.hospital-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  min-width: 180px;
  max-height: 280px;
  overflow-y: auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  color: #1e293b;
  z-index: 200;
}

.hospital-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: none;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  color: #334155;
  transition: background 0.1s;
}
.hospital-dropdown-item:hover {
  background: #f1f5f9;
}
.hospital-dropdown-item.active {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 600;
}
.hospital-dropdown-item i {
  margin-left: 8px;
  color: #0284c7;
}

.hospital-badge i {
  opacity: 0.9;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  border-radius: var(--radius-full, 9999px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: default;
  transition: background var(--transition-fast, 150ms);
}

.user-chip:hover {
  background: rgba(255, 255, 255, 0.15);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #BAE6FD;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.2;
}

.user-role {
  font-size: 0.65rem;
  opacity: 0.65;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* ====== TABLET (<= 1024px) ====== */
@media (max-width: 1024px) {
  .hamburger-btn {
    display: flex;
  }

  .topbar {
    padding: 0 16px;
  }

  .brand-tag {
    display: none;
  }
}

/* ====== MOBILE (<= 640px) ====== */
@media (max-width: 640px) {
  .topbar {
    padding: 0 12px;
    height: 52px;
  }

  .brand-icon {
    width: 32px;
    height: 32px;
    font-size: 0.85rem;
  }

  .brand-name {
    font-size: 1rem;
  }

  .brand-group {
    gap: 8px;
  }

  .user-info {
    display: none;
  }

  .user-chip {
    padding: 4px;
    border-radius: 50%;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
  }

  .hamburger-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>

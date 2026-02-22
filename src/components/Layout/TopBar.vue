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
import { computed } from 'vue'

defineEmits(['toggle-sidebar'])

const props = defineProps({
  role: { 
    type: String,
    default: 'Tech'
  },
  username: {
    type: String,
    default: ''
  }
})

const displayUsername = computed(() => props.username || 'Username')
const displayRole = computed(() => props.role || 'Tech')
</script>

<style scoped>
.topbar {
  height: var(--topbar-h, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bg-topbar, linear-gradient(135deg, #1e1145 0%, #3b1f8e 50%, #6c3ce0 100%));
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
  color: #c4b5fd;
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
  color: #e0d7ff;
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

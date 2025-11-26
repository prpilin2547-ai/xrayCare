<template>
  <aside class="sidebar">
    <nav class="menu">
      <ul>
        <li :class="{ active: active === 'dashboard' }" @click="$emit('navigate', 'dashboard')">
          <i class="fa-solid fa-chart-line"></i>
          <span>Dashboard</span>
        </li>
        <li :class="{ active: active === 'equipment' }" @click="$emit('navigate', 'equipment')">
          <i class="fa-solid fa-laptop"></i>
          <span>Equipment</span>
        </li>

        <li :class="{ active: active === 'pm' }" @click="$emit('navigate', 'pm')">
          <i class="fa-solid fa-calendar"></i>
          <span>PM Schedule</span>
        </li>
        <li :class="{ active: active === 'export' }" @click="$emit('navigate', 'export')">
          <i class="fa-solid fa-file-lines"></i>
          <span>Export PDF</span>
        </li>
        <li :class="{ active: active === 'analytical' }" @click="$emit('navigate', 'analytical')">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Analytical</span>
        </li>
        <li :class="{ active: active === 'request' }" @click="$emit('navigate', 'request')">
          <i class="fa-solid fa-code-pull-request"></i>
          <span>Request</span>
        </li>
        <li :class="{ active: active === 'admindashboard' }" @click="$emit('navigate', 'admindashboard')">
          <i class="fa-solid fa-chart-line"></i>
          <span>Admin Dashboard</span>
        </li>
        <li :class="{ active: active === 'adminuseraccount' }" @click="$emit('navigate', 'adminuseraccount')">
          <i class="fa-solid fa-user"></i>
          <span>Admin UserAccount</span>
        </li>
        <li :class="{ active: active === 'adminanalytical' }" @click="$emit('navigate', 'adminanalytical')">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Admin Analytical</span>
        </li>

        <li :class="{ active: active === 'engineerdashboard' }" @click="$emit('navigate', 'engineerdashboard')">
          <i class="fa-solid fa-chart-line"></i>
          <span>Engineer Dashboard</span>
        </li>
        <li :class="{ active: active === 'engineeranalytical' }" @click="$emit('navigate', 'engineeranalytical')">
          <i class="fa-solid fa-chart-simple"></i>
          <span>Engineer Analytical</span>
        </li>
        <li :class="{ active: active === 'engineerrequest' }" @click="$emit('navigate', 'engineerrequest')">
          <i class="fa-solid fa-code-pull-request"></i>
          <span>Engineer Request</span>
        </li>

        <!-- เมนูใหม่ Additional Forms -->
        <li :class="{ active: active === 'additionalforms' }" @click="$emit('navigate', 'additionalforms')">
          <i class="fa-solid fa-list-check"></i>
          <span>Additional Forms</span>
        </li>
      </ul>
    </nav>
    <div class="sidebar-bottom">
      <button class="btn-logout" @click="$emit('navigate', 'logout')">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Log out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  active: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* (สไตล์เดิมทั้งหมดของคุณ ไม่ได้แก้ไข) */
.sidebar {
  width: 220px;
  background: #f3f3f3;
  border-right: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  padding: 18px 10px 12px;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #111827;
  cursor: pointer;
  margin-bottom: 4px;
  position: relative;
}

/* เส้นสีม่วงด้านซ้ายเวลา active */
.menu li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 3px;
  border-radius: 999px;
  background: transparent;
}

.menu li:hover {
  background: #e5e5e5;
}

.menu li.active {
  background: #e5e5e5;
  font-weight: 600;
}

.menu li.active::before {
  background: #5b2dbf;
}

.icon {
  width: 18px;
  text-align: center;
  font-size: 0.9rem;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #d4d4d4;
}

.btn-logout {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: none;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #111827;
}

.btn-logout:hover {
  background: #e5e5e5;
}
</style>

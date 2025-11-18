<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="brand">x-raycare</span>
    </div>
    <div class="topbar-right">
      <i class="fa-solid fa-circle-user"></i>
      <span class="user-text">Username ({{ role }})</span>
    </div>
  </header>
</template>

<script setup>
defineProps({
  role: {
    type: String,
    default: 'Tech'
  }
})
</script>

<style scoped>
.topbar {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #5b2dbf; /* purple เข้ม */
  color: #ffffff;
}

.brand {
  font-size: 2rem;
  font-weight: 800;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #ffffff;
}

.user-text {
  font-size: 0.9rem;
}
</style>

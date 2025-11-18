<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">PM Schedule</h2>

      <div class="selected-date-card">
        <div class="date-icon">📅</div>
        <div class="date-text">
          <p class="date-main">7 มกราคม 2022</p>
          <p class="date-sub">วันศุกร์</p>
        </div>
      </div>

      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn">&lt;</button>
          <span class="month-title">January 2022</span>
          <button class="nav-btn">&gt;</button>
        </div>

        <div class="calendar-grid">
          <div class="weekday" v-for="d in weekdays" :key="d">
            {{ d }}
          </div>

          <div
            v-for="cell in daysGrid"
            :key="cell.key"
            class="day-cell"
            :class="{
              'is-empty': !cell.day,
              'is-selected': cell.day === 7,
              'has-tag': cell.day === 18
            }"
          >
            <div class="day-number">
              <span v-if="cell.day">{{ cell.day }}</span>
            </div>
            <div v-if="cell.day === 18" class="tag">
              Monthly check
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// January 2022 starts on Saturday (index 6), 31 days
const daysGrid = computed(() => {
  const cells = []
  const startDay = 6
  const totalDays = 31

  for (let i = 0; i < startDay; i++) {
    cells.push({ key: `empty-${i}`, day: null })
  }
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ key: `day-${d}`, day: d })
  }
  return cells
})
</script>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.page-title {
  margin: 0;
}

.selected-date-card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  background: #f9fafb;
  max-width: 260px;
}

.date-icon {
  font-size: 1.4rem;
}

.date-main {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
}

.date-sub {
  margin: 0;
  font-size: 0.86rem;
  color: #6b7280;
}

.calendar-card {
  margin-top: 4px;
  background: white;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  padding: 12px 16px 16px;
  max-width: 480px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
}

.month-title {
  font-weight: 600;
}

.nav-btn {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: white;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 0.8rem;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding: 4px 0;
}

.day-cell {
  min-height: 40px;
  border-radius: 10px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.day-cell.is-empty {
  background: transparent;
}

.day-number span {
  font-size: 0.85rem;
}

.day-cell.is-selected {
  border: 1px solid #111827;
}

.has-tag .day-number span {
  margin-bottom: 2px;
}

.tag {
  margin-top: 2px;
  padding: 2px 4px;
  border-radius: 999px;
  font-size: 0.7rem;
  background: #dbeafe;
  color: #1d4ed8;
}

.gear-icon {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 1rem;
}
</style>
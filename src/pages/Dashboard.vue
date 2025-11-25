<template>
  <MainLayout>
    <div class="page">
      <!-- Header Dashboard -->
      <div class="dashboard-header-row">
        <h2 class="page-title">Dashboard</h2>
        <div class="toggle-wrapper">
          <label class="toggle-label">
            <input type="checkbox" v-model="hasMachines" />
            <span>แสดงตัวอย่างเมื่อมีเครื่องลงทะเบียนแล้ว</span>
          </label>
        </div>
      </div>

      <!-- สรุปข้อมูลด้านบน -->
      <div class="cards-row">
        <div class="card summary-card">
          <p class="card-label date">DATE</p>
          <p class="card-value">{{ displayDate }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label purple">EQUIPMENT</p>
          <p class="card-value">{{ hasMachines ? '4' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label orange">PENDING</p>
          <p class="card-value">{{ hasMachines ? '4' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label blue">REPAIR REQUESTS</p>
          <p class="card-value">{{ hasMachines ? '-' : '-' }}</p>
        </div>
      </div>

      <!-- CHECKLIST -->
      <div class="checklist-header">
        <div class="left">
          <span class="dot-blue"></span>
          <span class="checklist-text">CHECKLIST</span>
        </div>
        <button class="btn-add">
          <span class="btn-add-icon">＋</span>
        </button>
      </div>

      <!-- ตาราง -->
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Equipment (Brand/Model)</th>
              <th>Room</th>
              <th>Caretaker</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-if="hasMachines">
            <tr v-for="row in sampleRows" :key="row.no">
              <td>{{ row.no }}</td>
              <td class="equipment-cell" @click="goToDairyCheck(row.equipment)">
                {{ row.equipment }}
              </td>
              <td>{{ row.room }}</td>
              <td>{{ row.caretaker }}</td>
              <td class="status pending">รอดำเนินการ</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="n in 4" :key="n">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Monthly Check -->
      <div class="monthly-box">
        <div class="monthly-left">
          <span class="monthly-icon">📅</span>
          <div>
            <p class="monthly-title">Monthly check</p>
            <p class="monthly-date">
              {{ hasMachines ? '15 Nov 2025' : '-' }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
// ใช้ ref & router ตามปกติ
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

// toggle แสดง / ไม่แสดงข้อมูลตัวอย่าง
const router = useRouter()
const hasMachines = ref(true)

// วันที่แสดง
const displayDate = '10 Nov 2025'

// ข้อมูลตัวอย่าง
const sampleRows = [
  { no: 1, equipment: 'Shimazu', room: '1', caretaker: 'ศุภกร' },
  { no: 2, equipment: 'Carestream', room: '2', caretaker: 'พรไพลิน' },
  { no: 3, equipment: 'Konica', room: '3', caretaker: 'เบญจรัตน์' },
  { no: 4, equipment: 'Toshiba', room: '4', caretaker: 'ขยัน' }
]

// ฟังก์ชันไปหน้า DairyCheckPage
function goToDairyCheck(equipmentName) {
  router.push({
    name: 'DairyCheckPage',
    params: { equipmentName }
  })
}
</script>

<style scoped>
/* --------- Layout หลัก --------- */
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
}

/* toggle ส่วนบน */
.toggle-wrapper {
  font-size: 0.82rem;
  color: #6b7280;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* --------- Cards --------- */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
}

/* text labels ใน summary card */
.summary-card .card-label {
  font-size: 0.78rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.summary-card .card-label.date {
  color: #db2777;
}

/* ⭐ แก้ไขแล้ว: ต้องมีจุดหน้า .summary-card */
.summary-card .card-label.purple {
  color: var(--purple-main); /* ใช้ตัวแปรสีจาก Root */
}

.summary-card .card-label.orange {
  color: #f97316;
}

.summary-card .card-label.blue {
  color: #2563eb;
}

.summary-card .card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

/* --------- Checklist header --------- */
.checklist-header {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-blue {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #3b82f6;
}

.btn-add {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --------- ตาราง --------- */
.table-card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px 16px;
  border: 1px solid #e5e7eb;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 6px 4px;
}

tbody tr:nth-child(even) {
  background: #f9fafb;
}

.equipment-cell {
  cursor: pointer;
  color: #2563eb;
  text-decoration: underline;
}

.equipment-cell:hover {
  color: #1d4ed8;
}

/* --------- Monthly Box --------- */
.monthly-box {
  display: inline-flex;
  width: 150px;      /* ต้อง fix width ไม่ให้ยืดเกิน */
  background: #fee2e2;
  border-radius: 14px;
  padding: 4px 8px;
  align-items: center;
}

.monthly-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monthly-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

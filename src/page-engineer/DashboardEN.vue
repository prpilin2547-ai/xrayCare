<template>
  <MainLayout>
    <!-- engineer dash -->
    <div class="page">
      <h2 class="page-title">Dashboard</h2>

      <div class="cards-row">
        <div class="card summary-card">
          <p class="card-label pink">DATE</p>
          <p class="card-value">{{ displayDate }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label blue">EQUIPMENT</p>
          <p class="card-value">{{ hasMachines ? '4' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label red">PENDING REPAIR</p>
          <p class="card-value">{{ hasPendingrepair ? '2' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label orange">IN PROGRESS</p>
          <p class="card-value">{{ hasProgress ? '1' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label green">COMPLETED</p>
          <p class="card-value">{{ hasCompleted ? '1' : '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Request Section Header -->
    <div class="request-section">
      <div class="left">
        <span class="dot-blue"></span>
        <span class="checklist-text">REQUESTS</span>
      </div>
    </div>

    <!-- TABLE (เหมือน CHECKLIST ใน Dashboard.vue) -->
    <div class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>อุปกรณ์ (ยี่ห้อ/รุ่น)</th>
            <th>ห้องตรวจ</th>
            <th>สถานะการแจ้งซ่อม</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in repairRequests" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.room }}</td>
            <td class="status pending">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

const displayDate = '10 Nov 2025';

// mock flag สำหรับตัวเลข cards
const hasMachines = ref(true);
const hasPendingrepair = ref(true);
const hasProgress = ref(true);
const hasCompleted = ref(true);

const repairRequests = ref([
  { id: 1, name: 'X-ray general shimazu รุ่น xxx', room: '1', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 2, name: 'X-ray general carestream รุ่น xxx', room: '2', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 3, name: 'X-ray general konica รุ่น xxx', room: '3', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 4, name: 'X-ray general toshiba รุ่น xxx', room: '4', status: 'อยู่ระหว่างดำเนินการ' }
]);
</script>

<style scoped>
/* PAGE + CARDS */
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-title {
  margin: 0;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
}

.summary-card .card-label {
  font-size: 0.78rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.summary-card .card-label.pink {
  color: #db2777;
}

.summary-card .card-label.blue {
  color: #0037ff;
}

.summary-card .card-label.red {
  color: #ff0000;
}

.summary-card .card-label.orange {
  color: #f97316;
}

.summary-card .card-label.green {
  color: #0eb54b;
}

.summary-card .card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* REQUEST SECTION HEADER */
.request-section {
  margin-top: 20px;
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

.checklist-text {
  font-weight: 600;
  font-size: 0.9rem;
}

/* TABLE (เหมือน Dashboard.vue) */
.table-card {
  margin-top: 20px;
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
  text-align: left;
  padding: 6px 4px;
}

thead tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) {
  background: #f9fafb;
}

.status.pending {
  color: #f97316;
}
</style>
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

    <!-- Request Table -->
    <div class="request-section">
      <div class="left">
        <span class="dot-blue"></span>
        <span class="checklist-text">REQUEST</span>
      </div>
    </div>


    <!-- ทำให้ดูเหมือน table-card ของ CHECKLIST -->
    <div class="table-responsive request-table-card">
      <table class="table request-table">
        <thead>
          <tr>
            <th style="width: 10%;">ลำดับ</th>
            <th style="width: 40%;">อุปกรณ์ (ยี่ห้อ/รุ่น)</th>
            <th style="width: 20%;">ห้องตรวจ</th>
            <th style="width: 30%;">สถานะการแจ้งซ่อม</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in repairRequests" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.room }}</td>
            <td class="text-warning-custom">{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

// State สำหรับเปลี่ยนหน้า (ถ้ายังไม่ได้ใช้จริงก็ปล่อยไว้ได้)
const currentView = ref('dashboard');

// ตัวอย่าง summary cards (ตอนนี้ยังไม่ได้ใช้ใน template นี้)
const summaryCards = [
  { title: 'Date', value: '19 Nov', colorClass: 'text-magenta' },
  { title: 'Equipment', value: '5 Units', colorClass: 'text-purple' },
  { title: 'Pending', value: '2 Tasks', colorClass: 'text-orange' },
  { title: 'Repair Requests', value: '1 New', colorClass: 'text-blue' }
];

const displayDate = '10 Nov 2025';

// mock flag สำหรับตัวเลข cards (คุณจะไปผูกกับ data จริงภายหลังได้)
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
/* Font Setup */
.font-thai {
  font-family: 'Prompt', sans-serif;
}

/* Layout Sizing */
.app-container {
  height: 100vh;
  overflow: hidden;
}

/* Header Bar */
.header-bar {
  height: 60px;
  background-color: #4A148C;
}

.bg-header-purple {
  background-color: #4A148C;
}

/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #F8F9FA;
  border-right: 1px solid #dee2e6;
}

.nav-link {
  color: #333;
  margin-bottom: 5px;
  border-radius: 5px;
}

.nav-link.active {
  background-color: #e9ecef;
  color: #000;
  font-weight: 600;
}

/* Analytical Active State */
.nav-link.analytical-link.active {
  border-left: 5px solid #4A148C;
  background-color: #e2e6ea;
}

/* Text Colors for Summary Cards */
.text-magenta {
  color: #D81B60;
}

.text-purple {
  color: #6A1B9A;
}

.text-orange {
  color: #fd7e14;
}

.text-blue {
  color: #0d6efd;
}

.text-purple-theme {
  color: #4A148C;
}

/* Background Colors */
.bg-off-white {
  background-color: #f8f9fa;
}

.bg-light-pink {
  background-color: #F8D7DA;
}

.bg-orange {
  background-color: #fd7e14;
}

.bg-green {
  background-color: #198754;
}

.bg-pink {
  background-color: #D81B60;
}

/* Dashboard: Monthly Button */
.btn-monthly {
  background-color: #F8D7DA;
  border: none;
  transition: all 0.3s;
}

.btn-monthly:hover {
  background-color: #f1b0b7;
}

/* User Account: Title Indicator */
.circle-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #0d6efd;
}

/* User Account: Custom Grey Table */
.custom-grey-table thead th,
.custom-grey-table tbody td {
  background-color: #e9ecef;
  border: 1px solid white;
  vertical-align: middle;
}

/* Analytical: Chart Dot Legend */
.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}

/* PAGE + CARDS */
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

/* ================== REQUEST TABLE (ให้เหมือน CHECKLIST TABLE) ================== */

.request-section {
  margin-top: 20px;
  margin-bottom: 20px;
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

/* จุดสีน้ำเงินเล็ก ๆ หน้า REQUESTS */
.title-dot {
  color: #3b82f6;
  font-size: 1.1rem;
  line-height: 1;
}

/* card หุ้ม table ให้คล้าย .table-card */
.request-table-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px 16px;
  border: 1px solid #e5e7eb;
}

/* table ภายในให้เหมือน .table ของ checklist */
.request-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

/* บังคับให้เส้นขอบเป็นสีเทาอ่อนแทนดำ (override border-dark ของ bootstrap) */
.request-table th,
.request-table td {
  border: 1px solid #e5e7eb !important;
  text-align: left;
  /* ให้ align left เหมือน checklist */
  padding: 6px 4px;
  vertical-align: middle;
}

/* header row */
.request-table thead tr {
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.request-table thead th {
  font-weight: 600;
  color: #374151;
}

/* zebra stripe */
.request-table tbody tr:nth-child(even) {
  background: #f9fafb;
}

/* status สีส้ม (แบบ pending) */
.request-table .text-warning-custom {
  color: #f97316;
  font-weight: 600;
}

/* ซ่อน scrollbar แนวนอนถ้าไม่จำเป็น (optional) */
.request-table-card::-webkit-scrollbar {
  height: 6px;
}

.request-title {
  font-size: 0.9rem;
  /* ปรับให้เล็กลง (จะเล็กกว่า h3 ปกติ) */
  font-weight: 600;
  /* คงความหนาไว้เหมือนเดิม */
}
</style>
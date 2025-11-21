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
                <div class="d-flex align-items-center mb-3">
                    <span class="title-dot me-2">●</span>
                    <h3 class="fw-600 m-2">REQUESTS</h3>
                </div>

                <div class="table-responsive">
                    <table class="table table-bordered border-dark text-center align-middle request-table">
                        <thead>
                            <tr>
                                <th style="width: 10%;">ลำดับ</th>
                                <th style="width: 40%;">อุปกรณ์ (ยี่ห้อ/รุ่น)</th>
                                <th style="width: 20%;">ห้องตรวจ</th>
                                <th style="width: 30%;">สถานะการแจ้งซ่อม</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            <tr v-for="(item, index) in repairRequests" :key="item.id">
                                <td>{{ index + 1 }}</td>
                                <td class="text-center">{{ item.name }}</td>
                                <td>{{ item.room }}</td>
                                <td class="text-warning-custom">{{ item.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
    </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

// State สำหรับเปลี่ยนหน้า
const currentView = ref('dashboard');

// Mock Data: Dashboard Summary Cards
const summaryCards = [
  { title: 'Date', value: '19 Nov', colorClass: 'text-magenta' },
  { title: 'Equipment', value: '5 Units', colorClass: 'text-purple' },
  { title: 'Pending', value: '2 Tasks', colorClass: 'text-orange' },
  { title: 'Repair Requests', value: '1 New', colorClass: 'text-blue' }
];

const displayDate = '10 Nov 2025'

const repairRequests = ref([
  { id: 1, name: 'X-ray general shimazu รุ่น xxx', room: '1', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 2, name: 'X-ray general carestream รุ่น xxx', room: '2', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 3, name: 'X-ray general konica รุ่น xxx', room: '3', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 4, name: 'X-ray general toshiba รุ่น xxx', room: '4', status: 'อยู่ระหว่างดำเนินการ' },
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

/* 1.2.1 & 1.1.2 Header Bar */
.header-bar {
  height: 60px;
  background-color: #4A148C; /* Deep Purple */
}
.bg-header-purple {
  background-color: #4A148C;
}

/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #F8F9FA; /* Light Grey */
  border-right: 1px solid #dee2e6;
}

.nav-link {
  color: #333;
  margin-bottom: 5px;
  border-radius: 5px;
}

.nav-link.active {
  background-color: #e9ecef; /* Slightly darker grey */
  color: #000;
  font-weight: 600;
}

/* Analytical Active State (Special case with purple border) */
.nav-link.analytical-link.active {
  border-left: 5px solid #4A148C;
  background-color: #e2e6ea;
}

/* Text Colors for Summary Cards */
.text-magenta { color: #D81B60; }
.text-purple  { color: #6A1B9A; }
.text-orange  { color: #fd7e14; }
.text-blue    { color: #0d6efd; }
.text-purple-theme { color: #4A148C; }

/* Background Colors for Analytical Charts & Pills */
.bg-off-white { background-color: #f8f9fa; }
.bg-light-pink { background-color: #F8D7DA; }
.bg-orange { background-color: #fd7e14; }
.bg-green { background-color: #198754; }
.bg-pink { background-color: #D81B60; }

/* Dashboard: Monthly Button */
.btn-monthly {
  background-color: #F8D7DA; /* Light Pink */
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
  background-color: #0d6efd; /* Blue */
}

/* User Account: Custom Grey Table */
.custom-grey-table thead th, 
.custom-grey-table tbody td {
  background-color: #e9ecef; /* Grey Cell Background */
  border: 1px solid white;   /* White Grid Lines */
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

/* --- Request Table Styles --- */
        .title-dot {
            color: #007bff; /* สีฟ้า */
            font-size: 1.2rem;
            line-height: 1;
        }

        .request-table {
            border-width: 1px;
        }

        .request-table thead th {
            background-color: #90CAF9; /* สีฟ้าอ่อน */
            color: #000;
            font-weight: 600;
            border-bottom: 1px solid #000;
            padding: 12px;
        }

        .request-table tbody td {
            padding: 12px;
            font-size: 1rem;
        }

        .text-warning-custom {
            color: #FF9800; /* สีส้มเหลือง */
            font-weight: 500;
        }

        /* Responsive */
        @media (max-width: 960px) {
            .cards-row {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
</style>
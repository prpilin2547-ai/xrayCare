<template>
  <MainLayout>
    <!-- engineer dash -->
    <div class="page">
      <div class="dashboard-header-row">
        <div>
          <h2 class="page-title">Dashboard</h2>
          <p class="page-subtitle">Overview of repair requests and equipment</p>
        </div>
      </div>

      <div class="cards-row">
        <div class="card summary-card">
          <div class="card-icon-wrap icon-pink">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="card-content">
            <p class="card-label pink">DATE</p>
            <p class="card-value">{{ displayDate }}</p>
          </div>
        </div>
        <div class="card summary-card">
          <div class="card-icon-wrap icon-purple">
            <i class="fa-solid fa-laptop-medical"></i>
          </div>
          <div class="card-content">
            <p class="card-label blue">EQUIPMENT</p>
            <p class="card-value">{{ hasMachines ? equipmentCount : '-' }}</p>
          </div>
        </div>
        <div class="card summary-card">
          <div class="card-icon-wrap icon-red">
            <i class="fa-solid fa-hourglass-half"></i>
          </div>
          <div class="card-content">
            <p class="card-label red">PENDING REPAIR</p>
            <p class="card-value">{{ hasPendingrepair ? pendingRepairCount : '-' }}</p>
          </div>
        </div>
        <div class="card summary-card">
          <div class="card-icon-wrap icon-amber">
            <i class="fa-solid fa-screwdriver-wrench"></i>
          </div>
          <div class="card-content">
            <p class="card-label orange">IN PROGRESS</p>
            <p class="card-value">{{ hasProgress ? inProgressCount : '-' }}</p>
          </div>
        </div>
        <div class="card summary-card">
          <div class="card-icon-wrap icon-green">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="card-content">
            <p class="card-label green">COMPLETED</p>
            <p class="card-value">{{ hasCompleted ? completedCount : '-' }}</p>
          </div>
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
            <th>No.</th>
            <th>Equipment (Brand/Model)</th>
            <th>Room</th>
            <th>Reporter</th>
            <th>Repair Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in repairRequests" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.equipment || '-' }}</td>
            <td>{{ item.room || '-' }}</td>
            <td>{{ item.reporterName || '-' }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(item.statusText)">{{ item.statusText || '-' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

const API_BASE = '/api/Xraycare';

/* ---------------- Data จาก API ---------------- */
const machines = ref([]);
const repairRequests = ref([]);
const loading = ref(false);

// Abbreviated month names for displayDate
const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Display current date in format: "18 Dec 2025"
const displayDate = computed(() => {
  const now = new Date();
  const day = now.getDate();
  const month = monthNamesShort[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
});

/* Summary card computed */
const hasMachines = computed(() => machines.value.length > 0);
const equipmentCount = computed(() => machines.value.length);

const PENDING_STATUSES = ['รอซ่อม', 'PENDING'];
const PROGRESS_STATUSES = ['อยู่ระหว่างดำเนินการ', 'กำลังซ่อม', 'IN PROGRESS'];
const COMPLETED_STATUSES = ['ดำเนินการแล้ว', 'ซ่อมเสร็จ', 'COMPLETED'];

const hasPendingrepair = computed(() =>
  repairRequests.value.some(r => PENDING_STATUSES.includes(r.statusText))
);
const hasProgress = computed(() =>
  repairRequests.value.some(r => PROGRESS_STATUSES.includes(r.statusText))
);
const hasCompleted = computed(() =>
  repairRequests.value.some(r => COMPLETED_STATUSES.includes(r.statusText))
);

const pendingRepairCount = computed(() =>
  repairRequests.value.filter(r => PENDING_STATUSES.includes(r.statusText)).length
);
const inProgressCount = computed(() =>
  repairRequests.value.filter(r => PROGRESS_STATUSES.includes(r.statusText)).length
);
const completedCount = computed(() =>
  repairRequests.value.filter(r => COMPLETED_STATUSES.includes(r.statusText)).length
);

/* Status class helper */
function getStatusClass(status) {
  if (!status) return '';
  if (PENDING_STATUSES.includes(status)) return 'status-waiting';
  if (PROGRESS_STATUSES.includes(status)) return 'status-progress';
  if (COMPLETED_STATUSES.includes(status)) return 'status-completed';
  return 'status-waiting';
}

/* ---------- โหลดข้อมูลจาก API ---------- */
async function loadMachines() {
  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`);
    if (!res.ok) throw new Error('โหลดข้อมูลเครื่องไม่สำเร็จ');
    const data = await res.json();
    machines.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadMachines error:', e);
    machines.value = [];
  }
}

async function loadRepairRequests() {
  try {
    const res = await fetch(`${API_BASE}/GetAllRepairRequests`);
    if (!res.ok) throw new Error('โหลดข้อมูลแจ้งซ่อมไม่สำเร็จ');
    const data = await res.json();
    repairRequests.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadRepairRequests error:', e);
    repairRequests.value = [];
  }
}

onMounted(async () => {
  loading.value = true;
  await Promise.all([loadMachines(), loadRepairRequests()]);
  loading.value = false;
});
</script>

<style scoped>
/* PAGE + HEADER */
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main, #0f172a);
}

.page-subtitle {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
  font-weight: 400;
}

/* ====== SUMMARY CARDS ====== */
.cards-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.summary-card {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: default;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover, 0 8px 25px rgba(0, 0, 0, 0.1));
}

.card-icon-wrap {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md, 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.icon-pink {
  background: linear-gradient(135deg, #fce4ec, #f8bbd0);
  color: #c2185b;
}

.icon-purple {
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  color: #0284C7;
}

.icon-red {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.icon-amber {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #ea580c;
}

.icon-green {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #16a34a;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.card-label.pink { color: #db2777; }
.card-label.blue { color: #2563eb; }
.card-label.red { color: #dc2626; }
.card-label.orange { color: #ea580c; }
.card-label.green { color: #16a34a; }

.card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

@media (max-width: 1024px) {
  .cards-row { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .table-card { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { min-width: 500px; }
}

@media (max-width: 768px) {
  .cards-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .page-title { font-size: 1.3rem; }
  .card-value { font-size: 1.2rem; }
  .card-icon-wrap { width: 40px; height: 40px; font-size: 0.95rem; }
}

@media (max-width: 640px) {
  .cards-row { grid-template-columns: 1fr; }
  .summary-card { padding: 14px 16px; }
}

/* REQUEST SECTION HEADER - เว้นระยะบนล่างเท่ากัน */
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
  border-radius: var(--radius-full, 9999px);
  background: #3b82f6;
}

.checklist-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
}

/* TABLE */
.table-card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.table thead {
  background: #f8fafc;
}

.table th {
  padding: 12px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  text-align: left;
}

/* ลบเอฟเฟกต์ hover สีเทาที่หัวคอลัมน์ (Repair Status เป็นต้น) */
.table thead th:hover {
  background: #f8fafc;
}

.table td {
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
}

.table tbody tr {
  transition: background var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.table tbody tr:hover {
  background: #f8fafc;
}

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.4;
}

.status-badge.status-waiting { background: #fef2f2; color: #dc2626; }
.status-badge.status-progress { background: #fff7ed; color: #ea580c; }
.status-badge.status-completed { background: #f0fdf4; color: #16a34a; }
</style>
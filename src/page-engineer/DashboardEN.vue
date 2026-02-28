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
          <p class="card-value">{{ hasMachines ? equipmentCount : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label red">PENDING REPAIR</p>
          <p class="card-value">{{ hasPendingrepair ? pendingRepairCount : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label orange">IN PROGRESS</p>
          <p class="card-value">{{ hasProgress ? inProgressCount : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label green">COMPLETED</p>
          <p class="card-value">{{ hasCompleted ? completedCount : '-' }}</p>
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
            <td class="status" :class="getStatusClass(item.statusText)">{{ item.statusText || '-' }}</td>
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
  if (PENDING_STATUSES.includes(status)) return 'pending';
  if (PROGRESS_STATUSES.includes(status)) return 'in-progress';
  if (COMPLETED_STATUSES.includes(status)) return 'completed';
  return 'pending';
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
/* PAGE + CARDS */
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  margin: 0;
  color: var(--text-main, #0f172a);
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.card.summary-card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  padding: 18px 20px;
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  transition: all var(--transition-base, 250ms cubic-bezier(0.4, 0, 0.2, 1));
}

.card.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover, 0 8px 25px rgba(0, 0, 0, 0.1));
}

.card-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.card-label.pink,
.card-label.date {
  color: #db2777;
}

.card-label.blue {
  color: #2563eb;
}

.card-label.red {
  color: #dc2626;
}

.card-label.orange {
  color: #ea580c;
}

.card-label.green {
  color: #16a34a;
}

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
@media (max-width: 640px) {
  .cards-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .summary-card { padding: 14px 16px; }
  .card-value { font-size: 1.2rem; }
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

/* Status badges: รอซ่อม=แดง, อยู่ระหว่างดำเนินการ=ส้ม, ดำเนินการแล้ว=เขียว */
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.status.pending,
.status[class*="pending"] {
  background: #fef2f2;
  color: #dc2626;
}

.status.in-progress,
.status[class*="progress"] {
  background: #fff7ed;
  color: #ea580c;
}

.status.completed,
.status[class*="completed"] {
  background: #f0fdf4;
  color: #16a34a;
}
</style>
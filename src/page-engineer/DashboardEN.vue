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
            <th>Repair Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in repairRequests" :key="item.id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.equipment || '-' }}</td>
            <td>{{ item.room || '-' }}</td>
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
  margin-top: 25px;
  margin-bottom: 25px;
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
  color: #ff0000;
}

.status.in-progress {
  color: #f97316;
}

.status.completed {
  color: #0eb54b;
}
</style>
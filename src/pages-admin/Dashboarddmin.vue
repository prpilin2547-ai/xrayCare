<template>
  <MainLayout>
    <div class="dashboard-container">
      
      <!-- ========================================= -->
      <!-- PART 1: ADMIN DASHBOARD (ด้านบน) -->
      <!-- ========================================= -->
      <div id="admin-section" class="section-container pb-3"> <!-- ลด padding ด้านล่าง -->
        
        <div class="dashboard-header-row">
          <h2 class="page-title">Dashboard (Tech)</h2>
          <div class="toggle-wrapper">
            <label class="toggle-label">
              <input type="checkbox" v-model="hasMachines" />
              <span>แสดงตัวอย่างเมื่อมีเครื่องลงทะเบียนแล้ว</span>
            </label>
          </div>
        </div>

        <!-- Admin Summary Cards -->
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

        <!-- Checklist Header (ต้นแบบสีฟ้า) -->
        <div class="section-header-blue mt-4 mb-2">
          <div class="left">
            <span class="dot-blue"></span>
            <span class="header-text-blue">CHECKLIST</span>
          </div>
          <button class="btn-add">
            <span class="btn-add-icon">＋</span>
          </button>
        </div>

        <!-- Checklist Table (Admin มีกล่องขาว table-card) -->
        <div class="table-card">
          <div class="table-responsive">
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
                <tr v-for="row in adminChecklistRows" :key="row.no">
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
                  <td colspan="5" class="text-center">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Monthly Check Box -->
        <div class="monthly-box mt-3">
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
      
      <!-- ลบเส้นประ (hr) ออกตามข้อ 2 -->

      <!-- ========================================= -->
      <!-- PART 2: ENGINEER DASHBOARD (ด้านล่าง) -->
      <!-- ========================================= -->
      <div id="engineer-section" class="section-container pt-0"> <!-- ลด padding ด้านบนให้ชิดกัน -->
        
        <h2 class="page-title mb-3">Dashboard (Engineer)</h2>

        <!-- Engineer Summary Cards -->
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
            <p class="card-value">{{ hasMachines ? '2' : '-' }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label orange">IN PROGRESS</p>
            <p class="card-value">{{ hasMachines ? '1' : '-' }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label green">COMPLETED</p>
            <p class="card-value">{{ hasMachines ? '1' : '-' }}</p>
          </div>
        </div>

        <!-- Request Header (แก้ข้อ 1: ใช้ Style สีฟ้าเหมือน Checklist) -->
        <div class="section-header-blue mt-4 mb-3">
          <div class="left">
            <span class="dot-blue"></span>
            <span class="header-text-blue">REQUESTS</span>
          </div>
        </div>

        <!-- Request Table (Engineer) -->
        <!-- แก้ข้อ 4: ลบ class "table-card" ออก เพื่อเอากล่องขาวออก -->
        <div class="table-responsive">
          <table class="table table-bordered border-dark request-table">
            <thead>
              <tr>
                <!-- แก้ข้อ 5: จัดกึ่งกลาง (text-center) อยู่ใน CSS แล้ว -->
                <th style="width: 10%;">ลำดับ</th>
                <th style="width: 40%;">อุปกรณ์ (ยี่ห้อ/รุ่น)</th>
                <th style="width: 20%;">ห้องตรวจ</th>
                <th style="width: 30%;">สถานะการแจ้งซ่อม</th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="(item, index) in engineerRequests" :key="item.id">
                <td>{{ index + 1 }}</td>
                <!-- ชื่ออุปกรณ์จัดชิดซ้ายเหมือนเดิมเพื่อความสวยงาม หรือจะกลางก็ได้ตามใจชอบ แต่ตามโจทย์คือกลางทั้งหมด -->
                <td class="text-center">{{ item.name }}</td> 
                <td>{{ item.room }}</td>
                <td class="text-warning-custom">{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- แก้ข้อ 3: ลบปุ่มเลื่อนขึ้นลงสีม่วงออก (Floating Buttons removed) -->

    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/Layout/MainLayout.vue';

const router = useRouter();

// --- Shared State ---
const displayDate = '10 Nov 2025';
const hasMachines = ref(true);

// --- Admin Data ---
const adminChecklistRows = [
  { no: 1, equipment: 'Shimazu', room: '1', caretaker: 'ศุภกร' },
  { no: 2, equipment: 'Carestream', room: '2', caretaker: 'พรไพลิน' },
  { no: 3, equipment: 'Konica', room: '3', caretaker: 'เบญจรัตน์' },
  { no: 4, equipment: 'Toshiba', room: '4', caretaker: 'ขยัน' }
];

// --- Engineer Data ---
const engineerRequests = ref([
  { id: 1, name: 'X-ray general shimazu รุ่น xxx', room: '1', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 2, name: 'X-ray general carestream รุ่น xxx', room: '2', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 3, name: 'X-ray general konica รุ่น xxx', room: '3', status: 'อยู่ระหว่างดำเนินการ' },
  { id: 4, name: 'X-ray general toshiba รุ่น xxx', room: '4', status: 'อยู่ระหว่างดำเนินการ' },
]);

// --- Methods ---
function goToDairyCheck(equipmentName) {
  console.log('Go to:', equipmentName);
}
</script>

<style scoped>
/* Layout */
.dashboard-container {
  padding-bottom: 40px;
}

.section-container {
  padding: 10px 0;
}

/* Header Row */
.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-weight: bold;
  color: #333;
}

/* Toggle Switch */
.toggle-wrapper {
  font-size: 0.9rem;
  color: #6b7280;
}
.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* Cards Row */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

/* Responsive Grid for Engineer Cards (5 cards) */
#engineer-section .cards-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));
}

.card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Card Labels Colors */
.summary-card .card-label { font-size: 0.78rem; font-weight: 600; margin: 0 0 4px; }
.card-label.date { color: #db2777; }
.card-label.purple { color: #6A1B9A; }
.card-label.orange { color: #f97316; }
.card-label.blue { color: #2563eb; }
.card-label.pink { color: #db2777; }
.card-label.red { color: #dc2626; }
.card-label.green { color: #16a34a; }

.card-value { margin: 0; font-size: 1.4rem; font-weight: 700; }

/* --- Section Header Blue Style (ใช้ร่วมกันทั้ง Admin/Engineer) --- */
.section-header-blue {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left { display: flex; align-items: center; gap: 8px; }
.dot-blue { 
  width: 10px; 
  height: 10px; 
  border-radius: 50%; 
  background: #3b82f6; /* สีฟ้า */
}
.header-text-blue { 
  font-weight: 600; 
  font-size: 1.1rem; 
  color: #000; /* สีดำปกติตามรูป หรือถ้าอยากได้ฟ้าให้เปลี่ยนเป็น #3b82f6 */
}

/* Add Button */
.btn-add {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: #ef4444; color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.btn-add-icon { font-size: 1.2rem; line-height: 1; }

/* Table Styling (General) */
.table-card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px 16px;
  border: 1px solid #e5e7eb;
}
.table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
th, td { text-align: left; padding: 10px 8px; }
thead tr { border-bottom: 1px solid #e5e7eb; }
tbody tr:nth-child(even) { background: #f9fafb; }

.status.pending { color: #f97316; font-weight: 500; }
.equipment-cell { cursor: pointer; color: #2563eb; text-decoration: underline; }

/* --- Request Table Specifics (Engineer) --- */
/* แก้ข้อ 5: จัดกึ่งกลางทั้งหมด */
.request-table th, 
.request-table td { 
    text-align: center !important; 
    vertical-align: middle !important;
}
.request-table th { 
    background-color: #90CAF9; 
    color: black; 
    border: 1px solid #333; 
}
.request-table td { 
    border: 1px solid #ccc; 
}
.text-warning-custom { color: #f97316; font-weight: 500; }

/* Monthly Box */
.monthly-box {
  display: inline-flex;
  width: 180px;
  background: #fee2e2;
  border-radius: 14px;
  padding: 8px 12px;
  align-items: center;
}
.monthly-left { display: flex; align-items: center; gap: 10px; }
.monthly-icon { font-size: 1.5rem; }
.monthly-title { margin: 0; font-size: 0.9rem; font-weight: 600; }
.monthly-date { margin: 0; font-size: 0.85rem; color: #6b7280; }

/* Responsive */
@media (max-width: 960px) {
  .cards-row, #engineer-section .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
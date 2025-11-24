<template>
  <MainLayout>
    <div class="page">
      <div class="dashboard-header-row">
        <h2 class="page-title">Dashboard</h2>
        <!-- <div class="toggle-wrapper">
          <label class="toggle-label">
            <input type="checkbox" v-model="hasMachines" />
            <span>แสดงตัวอย่างเมื่อมีเครื่องลงทะเบียนแล้ว</span>
          </label>
        </div> -->
      </div>

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

      <div class="checklist-header">
        <div class="left">
          <span class="dot-blue"></span>
          <span class="checklist-text">CHECKLIST</span>
        </div>
        <!-- ทำปุ่มบวกให้คลิกได้และไปหน้า MachinesCreate -->
        <button class="btn-add" @click="goToMachinesCreate">
          <span class="btn-add-icon">＋</span>
        </button>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Equipment (Brand/Model)</th>
              <th>Room</th>
              <th>Caretaker</th>
              <th>Status</th>
              <!-- เพิ่มหัวคอลัมน์ปุ่ม CHECK -->
              <th>CHECK</th>
            </tr>
          </thead>
          <tbody v-if="hasMachines">
            <tr v-for="row in sampleRows" :key="row.no">
              <td>{{ row.rid }}</td>
              <!-- เอา @click ออกจากชื่อเครื่อง -->
              <td>
                {{ row.machine_name }}
              </td>
              <td>{{ row.room }}</td>
              <td>{{ row.caretaker }}</td>
              <td class="status pending">รอดำเนินการ</td>
              <!-- ปุ่ม CHECK สำหรับไปหน้า DairyCheckPage พร้อมสไตล์สีฟ้า -->
              <td>
                <button
                  @click="goToDairyCheck(row.equipment)"
                  style="
                    background: #2563eb;
                    color: #ffffff;
                    border: none;
                    border-radius: 6px;
                    padding: 4px 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                  "
                >
                  CHECK
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="n in 4" :key="n">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <!-- คอลัมน์ CHECK ตอนยังไม่มีข้อมูล -->
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <div class="monthly-box">
        <div class="monthly-left"> -->
          <!-- <span class="monthly-icon">📅</span> -->
          <!-- <div> -->
            <!-- <p class="monthly-title">Monthly check</p> -->
            <!-- <p class="monthly-date">
              {{ hasMachines ? '15 Nov 2025' : '-' }}
            </p> -->
          <!-- </div> -->
        </div>
      <!-- </div>
    </div> -->
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'
import common from '../js/Commonfunction.js'

const router = useRouter()
const hasMachines = ref(true)

onMounted(() => {
  if (hasMachines.value) {
    //getallmachines()
  }
})

const displayDate = '10 Nov 2025'

const sampleRows = ref([
  {
    no: 1,
    rid: '001',
    equipment: 'XRay-Alpha',
    machine_name: 'X-Ray Machine (BrandA/ModelX)',
    room: 'Room 101',
    caretaker: 'John Doe'
  },
  {
    no: 2,
    rid: '002',
    equipment: 'XRay-Beta',
    machine_name: 'X-Ray Machine (BrandB/ModelY)',
    room: 'Room 102',
    caretaker: 'Jane Smith'
  },
  {
    no: 3,
    rid: '003',
    equipment: 'XRay-Gamma',
    machine_name: 'X-Ray Machine (BrandC/ModelZ)',
    room: 'Room 103',
    caretaker: 'Mike Johnson'
  },
  {
    no: 4,
    rid: '004',
    equipment: 'XRay-Delta',
    machine_name: 'X-Ray Machine (BrandD/ModelW)',
    room: 'Room 104',
    caretaker: 'Emily Davis'
  }
])

// function getallmachines() {
//   common.CallWebAPI(
//     'api/Xraycare/GetAllMachines',
//     'GET',
//     null,
//     (data) => {
//       sampleRows.value = data;
//       console.log('Fetched machines:', data)
//     },
//     (error) => {
//       console.error('Error fetching machines:', error)
//     }
//   )
// }
function goToDairyCheck(equipmentName) {
  router.push({
    name: 'DairyCheckPage',
    params: { equipmentName }
    
  })
}

function goToMachinesCreate() {
  router.push('/machines/create')
}

</script>

<style scoped>
/* เดิมทั้งหมด ไม่แก้ไข */
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

.summary-card .card-label {
  font-size: 0.78rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.summary-card .card-label.date {
  color: #db2777;
}

.summary-card .card-label.purple {
  color: var(--purple-main);
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

.checklist-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-add {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-icon {
  font-size: 1.2rem;
}

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

.equipment-cell {
  cursor: pointer;
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.equipment-cell:hover {
  color: #1d4ed8;
}

/* Monthly check box */
.monthly-box {
  display: inline-flex;  /* ให้กล่องมีขนาดตามเนื้อหา */
  width: 150px;           /* กันการขยายเอง */
  background: #fee2e2;
  border-radius: 14px;
  padding: 4px 8px;      /* ลด padding ให้ดูพอดีกับข้อความ */
  align-items: center;
}


.monthly-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monthly-icon {
  font-size: 1.2rem;
}

.monthly-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.monthly-date {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

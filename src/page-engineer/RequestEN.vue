<template>
  <MainLayout>
    <div class="page">
      <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
      <div v-if="!selectedItem">
        <!-- หัวข้อระบบแจ้งซ่อม -->
        <div class="section-header">
          <span class="section-title">ระบบแจ้งซ่อม </span>
        </div>

        <!-- ตารางแจ้งซ่อม -->
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>อุปกรณ์</th>
                <th>ห้องตรวจ</th>
                <th>วันที่ได้รับแจ้ง</th>
                <th>รายละเอียด</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ getEquipmentText(item) }}</td>
                <td>{{ getRoomText(item) }}</td>
                <td>{{ item.requestDate || '-' }}</td>
                <td>{{ item.detail }}</td>
                <td class="status" :class="getStatusCellClass(item.statusText)">
                  {{ item.statusText }}
                </td>
                <!-- ✅ คอลัมน์ใหม่: ลิงก์ "ตรวจสอบ" -->
                <td>
                  <span class="detail-link" @click="openDetail(item)">
                    ตรวจสอบ
                  </span>
                </td>
                <!-- ✅ คอลัมน์ใหม่: ลบ -->
                <td>
                  <span class="delete-link" @click="deleteItem(item.id)">
                    ลบ
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================== VIEW 2 : รายละเอียดแจ้งซ่อม ================== -->
      <div v-else class="repair-detail-page">
        <!-- Header Title -->
        <div class="page-header">
          <div class="blue-dot"></div>
          <h2 class="page-title">รายละเอียดแจ้งซ่อม</h2>
          <!-- ปุ่มกากบาทมุมขวาบน -->
          <i class="bi bi-x-circle close-modal-btn" @click="closeDetail"></i>
        </div>


        <!-- Main Content Box -->
        <div class="main-box">
          <!-- Orange Header -->
          <div class="box-header">
            <div class="header-label">อุปกรณ์</div>
            <div class="header-value">
              {{ getEquipmentWithRoom(selectedItem) }}
            </div>
          </div>


          <!-- Grey Body -->
          <div class="box-body">
            <!-- Details -->
            <div class="mb-3">
              <strong>รายละเอียด</strong>
              <ul class="content-list">
                <li>{{ selectedItem.detail }}</li>
              </ul>
            </div>

            <!-- Remarks (ตัวอย่าง fix ไว้ตามภาพ) -->
            <div class="mb-3">
              <strong>หมายเหตุ</strong>
              <ul class="content-list">
                <li>{{ selectedItem.remarks || '-' }}</li>
              </ul>
            </div>

            <!-- วันที่ได้รับแจ้ง (ใหม่) -->
            <div class="mb-3">
              <strong>วันที่ได้รับแจ้ง</strong>
              <ul class="content-list">
                <li>{{ selectedItem.requestDate || '-' }}</li>
              </ul>
            </div>

            <!-- Action Area inside Box -->
            <div class="inner-actions">
              <!-- ปุ่มไฟล์ภาพ -->
              <button class="btn btn-file shadow-sm" @click="openImageModal">
                ไฟล์ภาพ
                <i class="bi bi-camera-fill ms-2"></i>
              </button>

              <!-- ปุ่มสถานะแบบ Dropdown -->
              <div class="status-dropdown">
                <button class="btn-status-base shadow-sm dropdown-toggle" :class="statusClass" @click="toggleDropdown">
                  {{ currentStatus }}
                </button>

                <!-- เมนูตัวเลือก -->
                <ul v-if="dropdownOpen" class="dropdown-menu-custom">
                  <li @click="selectStatus('รอซ่อม')">รอซ่อม</li>
                  <li @click="selectStatus('อยู่ระหว่างดำเนินการ')">อยู่ระหว่างดำเนินการ</li>
                  <li @click="selectStatus('ดำเนินการแล้ว')">ดำเนินการแล้ว</li>
                </ul>
              </div>

              <!-- (code แก้ไขสถานะเดิม เก็บไว้ตามที่มี) -->
              <div v-if="isEditingStatus" class="status-selector-container bg-white border border-dark p-2 shadow-sm">
                <ul class="list-unstyled m-0">
                  <li>
                    <div class="dropdown-item p-2" @click="changeStatus('รอซ่อม')">
                      รอซ่อม
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item p-2" @click="changeStatus('อยู่ระหว่างดำเนินการ')">
                      อยู่ระหว่างดำเนินการ
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item p-2" @click="changeStatus('ดำเนินการแล้ว')">
                      ดำเนินการแล้ว
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action Buttons -->
        <div class="footer-actions">
          <button class="btn btn-save shadow-sm" @click="saveData">
            บันทึก
          </button>
        </div>

        <!-- Image Modal -->
        <div v-if="showImageModal" class="modal-overlay">
          <div class="modal-card image-modal-card">
            <div class="modal-header bg-success text-white p-3 d-flex justify-content-between align-items-center">
              <h5 class="m-0">รูปภาพ</h5>
              <i class="bi bi-x-circle cursor-pointer fs-4" @click="closeImageModal"></i>
            </div>
            <div class="modal-body p-5 bg-light d-flex justify-content-center align-items-center"
              style="min-height: 300px">
              <div class="text-center">
                <img v-if="currentImageSrc" :src="currentImageSrc" alt="Request Image"
                  class="img-fluid shadow-sm mb-3" />
                <p class="text-muted" v-if="currentImageSrc">
                  รูปภาพที่แนบโดยนักรังสีการแพทย์
                </p>
                <p class="text-muted" v-else>
                  ยังไม่มีรูปภาพจากนักรังสี
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ================== END VIEW 2 ================== -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const API_BASE = '/api/Xraycare'

const dropdownOpen = ref(false)
const loading = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectStatus = (status) => {
  currentStatus.value = status
  dropdownOpen.value = false
}

// ------------- ข้อมูลในตาราง (จาก API) -------------
const items = ref([])

async function loadItems() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/GetAllRepairRequests`)
    if (!res.ok) throw new Error('โหลดรายการแจ้งซ่อมไม่สำเร็จ')
    const data = await res.json()
    items.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    items.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItems()

  // รอให้ DOM render เสร็จก่อนสร้างกราฟ
  setTimeout(() => {
    createChart()
  }, 100)
})

// item ที่ถูกเลือก (null = โหมดตาราง)
const selectedItem = ref(null)

// สถานะปัจจุบันของงานที่เปิดดู
const currentStatus = ref('รอซ่อม')
const isEditingStatus = ref(false)
const showImageModal = ref(false)
const currentImageSrc = ref('')

// เปิดหน้ารายละเอียดจากการคลิกตาราง
const openDetail = (item) => {
  selectedItem.value = item
  currentStatus.value = item.statusText
  isEditingStatus.value = false
}
// ปิดหน้ารายละเอียดด้วยปุ่มกากบาท
const closeDetail = () => {
  selectedItem.value = null          // กลับไปหน้าระบบแจ้งซ่อม
  dropdownOpen.value = false         // ปิดเมนู dropdown ถ้าเปิดอยู่
  isEditingStatus.value = false      // กัน state ค้าง (แม้ตอนนี้แทบไม่ใช้แล้ว)
  showImageModal.value = false       // เผื่อเคยเปิด modal รูป
}

// helper แสดงชื่ออุปกรณ์ (ตัด "ห้อง X" สำหรับข้อมูลเก่า)
const getEquipmentText = (item) => {
  if (item.room) return item.equipment
  return item.equipment.replace(/\s*ห้อง\s*\d+\s*$/, '')
}

// helper แสดงห้องตรวจ
const getRoomText = (item) => {
  if (item.room) return item.room
  const match = item.equipment.match(/ห้อง\s*\d+/)
  return match ? match[0] : ''
}

// *** ใหม่: ใช้สำหรับกล่องสีส้ม ***
const getEquipmentWithRoom = (item) => {
  if (!item) return ''
  const equip = getEquipmentText(item)
  const room = getRoomText(item)
  return room ? `${equip} ${room}` : equip
}

// class สีของปุ่มสถานะ
const statusClass = computed(() => {
  if (currentStatus.value === 'รอซ่อม') return 'status-waiting'
  if (currentStatus.value === 'อยู่ระหว่างดำเนินการ') return 'status-progress'
  if (currentStatus.value === 'ดำเนินการแล้ว') return 'status-completed'
  return 'status-waiting'
})

// toggle โหมดแก้ไขสถานะ (โค้ดเดิม)
const toggleEditStatus = () => {
  isEditingStatus.value = !isEditingStatus.value
}

// เลือกสถานะในกล่องด้านล่าง (โค้ดเดิม)
const changeStatus = (status) => {
  currentStatus.value = status
  isEditingStatus.value = false
}

// modal รูปภาพ (ใช้รูปจาก Request)
const openImageModal = () => {
  if (selectedItem.value && selectedItem.value.imageData) {
    currentImageSrc.value = selectedItem.value.imageData
  } else {
    currentImageSrc.value = ''
  }
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  currentImageSrc.value = ''
}

// บันทึกสถานะผ่าน API แล้วกลับไปหน้าระบบแจ้งซ่อม
const saveData = async () => {
  if (selectedItem.value) {
    try {
      const res = await fetch(`${API_BASE}/UpdateRepairStatus/${selectedItem.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusText: currentStatus.value })
      })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'บันทึกสถานะไม่สำเร็จ')
      }
      selectedItem.value.statusText = currentStatus.value
    } catch (e) {
      console.error(e)
      alert(e.message || 'บันทึกสถานะไม่สำเร็จ กรุณาลองใหม่')
      return
    }
  }
  selectedItem.value = null
  isEditingStatus.value = false
  showImageModal.value = false
}

const getStatusCellClass = (status) => {
  if (status === 'รอซ่อม') return 'status-waiting'
  if (status === 'อยู่ระหว่างดำเนินการ') return 'status-progress'
  if (status === 'ดำเนินการแล้ว') return 'status-completed'
  return ''
}

// ลบรายการแจ้งซ่อม
const deleteItem = async (id) => {
  if (!window.confirm('คุณต้องการลบรายการแจ้งซ่อมนี้ใช่หรือไม่?')) return

  try {
    const res = await fetch(`${API_BASE}/DeleteRepairRequest/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'ลบไม่สำเร็จ')
    }
    items.value = items.value.filter((i) => i.id !== id)
  } catch (e) {
    console.error(e)
    alert(e.message || 'ลบไม่สำเร็จ กรุณาลองใหม่')
  }
}

// ================== Chart Logic ==================
const chartCanvas = ref(null)
const selectedYear = ref(2568) // ปี พ.ศ. เริ่มต้น
let chartInstance = null

// สร้างรายการปีที่มีข้อมูล
const availableYears = computed(() => {
  const years = new Set()
  items.value.forEach(item => {
    if (item.requestDate) {
      // แยกปีจาก requestDate เช่น "14 ธ.ค. 2568"
      const yearMatch = item.requestDate.match(/(\d{4})/)
      if (yearMatch) {
        years.add(parseInt(yearMatch[1]))
      }
    }
  })
  // ถ้าไม่มีข้อมูล ให้แสดงปีปัจจุบัน
  if (years.size === 0) {
    years.add(2568)
  }
  return Array.from(years).sort((a, b) => b - a) // เรียงจากมากไปน้อย
})

// ฟังก์ชันแปลงเดือนไทยเป็นตัวเลข
const thaiMonthToNumber = (monthStr) => {
  const months = {
    'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
    'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
  }
  return months[monthStr] !== undefined ? months[monthStr] : -1
}

// คำนวณข้อมูลสำหรับกราฟ
const chartData = computed(() => {
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

  // หาชนิดเครื่องทั้งหมด
  const equipmentTypes = [...new Set(items.value.map(item => getEquipmentText(item)))]

  // สร้างโครงสร้างข้อมูลสำหรับแต่ละชนิดเครื่อง
  const datasets = equipmentTypes.map((equipment, index) => {
    const monthlyData = new Array(12).fill(0)

    // นับจำนวนครั้งที่เสียในแต่ละเดือน
    items.value.forEach(item => {
      if (getEquipmentText(item) === equipment && item.requestDate) {
        const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
        if (match) {
          const monthStr = match[2]
          const year = parseInt(match[3])
          const monthIndex = thaiMonthToNumber(monthStr)

          if (year === selectedYear.value && monthIndex !== -1) {
            monthlyData[monthIndex]++
          }
        }
      }
    })

    // สีสำหรับแต่ละชนิดเครื่อง
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)'
    ]

    return {
      label: equipment,
      data: monthlyData,
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.8', '1'),
      borderWidth: 1
    }
  })

  return {
    labels: monthNames,
    datasets: datasets
  }
})

// สร้าง/อัพเดทกราฟ
const createChart = () => {
  if (!chartCanvas.value) return

  // ทำลายกราฟเก่า
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')

  // ต้อง import Chart.js ก่อน
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is not loaded')
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Sarabun, sans-serif',
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: `จำนวนครั้งที่เครื่องเสียรายเดือน ปี ${selectedYear.value}`,
          font: {
            family: 'Sarabun, sans-serif',
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'เดือน',
            font: {
              family: 'Sarabun, sans-serif',
              size: 14
            }
          },
          ticks: {
            font: {
              family: 'Sarabun, sans-serif'
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'จำนวนครั้ง',
            font: {
              family: 'Sarabun, sans-serif',
              size: 14
            }
          },
          ticks: {
            stepSize: 1,
            font: {
              family: 'Sarabun, sans-serif'
            }
          }
        }
      }
    }
  })
}

// เมื่อเปลี่ยนปี ให้อัพเดทกราฟ
watch(selectedYear, () => {
  createChart()
})

// เมื่อข้อมูลเปลี่ยน ให้อัพเดทกราฟ
watch(items, () => {
  if (chartCanvas.value) {
    createChart()
  }
}, { deep: true })
</script>

<style scoped>
/* PAGE + SECTION HEADER */
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;
}

.section-header,
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main, #0f172a);
}

/* Page Header (detail view) */
.page-header {
  margin-bottom: 20px;
}

.blue-dot {
  width: 12px;
  height: 12px;
  background-color: #2563eb;
  border-radius: var(--radius-full, 9999px);
  margin-right: 10px;
}

.page-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
  color: var(--text-main, #0f172a);
}

.close-modal-btn {
  margin-left: auto;
  cursor: pointer;
  color: #dc3545;
  font-size: 1.5rem;
  transition: transform var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.close-modal-btn:hover {
  transform: scale(1.1);
}

/* TABLE */
.table-wrapper {
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
  text-align: center;
}

.table td {
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
}

.table tbody tr {
  transition: background var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.table tbody tr:hover {
  background: #f8fafc;
}

th:nth-child(1),
td:nth-child(1) {
  width: 60px;
  min-width: 60px;
}

th:nth-child(2),
td:nth-child(2) {
  width: 180px;
  min-width: 180px;
}

th:nth-child(3),
td:nth-child(3) {
  width: 100px;
  min-width: 100px;
}

th:nth-child(4),
td:nth-child(4) {
  width: 130px;
  min-width: 130px;
}

th:nth-child(5),
td:nth-child(5) {
  width: 150px;
  min-width: 150px;
}

th:nth-child(6),
td:nth-child(6) {
  width: 180px;
  min-width: 180px;
}

th:nth-child(7),
td:nth-child(7) {
  width: 100px;
  min-width: 100px;
}

th:nth-child(8),
td:nth-child(8) {
  width: 80px;
  min-width: 80px;
}

/* Status badges */
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.status.status-waiting,
.status.pending {
  background: #fff7ed;
  color: #c2410c;
}

.status.status-progress,
.status.in-progress {
  background: #eff6ff;
  color: #1d4ed8;
}

.status.status-completed,
.status.completed {
  background: #f0fdf4;
  color: #15803d;
}

/* Links */
.detail-link {
  color: var(--purple-main, #6c3ce0);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.detail-link:hover {
  color: var(--purple-soft, #8b5cf6);
}

.delete-link {
  color: #dc2626;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.delete-link:hover {
  color: #b91c1c;
}

/* MAIN BOX - Detail view */
.main-box {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.box-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-weight: 700;
  display: flex;
  min-height: 60px;
  align-items: center;
}

.header-label {
  width: 120px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 10px;
}

.header-value {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-weight: 500;
}

.box-body {
  padding: 20px;
  position: relative;
  min-height: 450px;
  height: 450px;
  background: var(--bg-card, #ffffff);
}

ul.content-list {
  list-style-type: none;
  padding-left: 10px;
}

ul.content-list li::before {
  content: '•';
  color: var(--text-main, #0f172a);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

/* Inner actions */
.inner-actions {
  position: absolute;
  bottom: 150px;
  right: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
}

/* File button */
.btn-file {
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-sm, 8px);
  padding: 8px 16px;
  cursor: pointer;
  color: var(--purple-main, #6c3ce0);
  font-weight: 600;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-file:hover {
  background: #f8fafc;
}

.btn-file i {
  color: var(--purple-main, #6c3ce0);
}

/* Status dropdown button */
.btn-status-base {
  border-radius: var(--radius-sm, 8px);
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  min-width: 180px;
  padding: 0 25px;
  white-space: nowrap;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-status-base.status-waiting {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.btn-status-base.status-progress {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

.btn-status-base.status-completed {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #86efac;
}

/* Status selector container */
.status-selector-container {
  position: absolute;
  bottom: 60px;
  right: 0;
  z-index: 20;
  border-radius: var(--radius-sm, 8px) !important;
  border: 1px solid var(--border-soft, #e2e8f0) !important;
}

.status-selector-container .dropdown-item {
  padding: 8px 12px;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition: background var(--transition-fast, 150ms);
}

.status-selector-container .dropdown-item:hover {
  background-color: #f1f5f9 !important;
}

/* Status dropdown menu */
.status-dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu-custom {
  position: absolute;
  top: 52px;
  left: 0;
  width: 180px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 0;
  background: var(--bg-card, #ffffff);
  list-style: none;
  margin: 0;
  z-index: 50;
  box-shadow: var(--shadow-card-hover, 0 8px 25px rgba(0, 0, 0, 0.1));
}

.dropdown-menu-custom li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background var(--transition-fast, 150ms);
}

.dropdown-menu-custom li:hover {
  background: #f8fafc;
}

/* Footer actions */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft, #e2e8f0);
}

/* Save button */
.btn-save {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 28px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-weight: 600;
  width: 160px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

/* Image modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal-card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 20px);
  padding: 20px;
  max-width: 600px;
  width: 92%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}

.repair-detail-page {
  position: relative;
}

/* Chart styles */
.chart-section {
  margin-top: 40px;
  padding: 20px;
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-main, #0f172a);
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.year-selector label {
  font-weight: 500;
  margin: 0;
  color: var(--text-secondary, #475569);
}

.year-selector select {
  width: 120px;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color var(--transition-fast, 150ms);
}

.year-selector select:hover {
  border-color: var(--text-muted, #94a3b8);
}

.year-selector select:focus {
  outline: none;
  border-color: var(--purple-main, #6c3ce0);
  box-shadow: 0 0 0 3px rgba(108, 60, 224, 0.15);
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

@media (max-width: 1024px) {
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { min-width: 600px; }
}
@media (max-width: 640px) {
  .section-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .main-box { border-radius: 12px; }
  .box-body { padding: 14px; }
  .footer-actions { flex-direction: column; }
  .btn-save { width: 100%; text-align: center; }
  .btn-file { width: 100%; text-align: center; }
  .image-modal-card { width: calc(100vw - 24px); }
}
</style>
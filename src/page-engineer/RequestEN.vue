<template>
  <MainLayout>
    <div class="page">
      <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
      <div v-if="!selectedItem">
        <!-- หัวข้อระบบแจ้งซ่อม -->
        <div class="section-header">
          <span class="section-title">ระบบแจ้งซ่อม</span>
        </div>

        <!-- ตารางแจ้งซ่อม -->
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>อุปกรณ์</th>
                <th>ห้องตรวจ</th>
                <th>รายละเอียด</th>
                <th>สถานะ</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ getEquipmentText(item) }}</td>
                <td>{{ getRoomText(item) }}</td>
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
                <li>ระบบล็อกติดขัด</li>
              </ul>
            </div>

            <!-- Action Area inside Box -->
            <div class="inner-actions">
              <!-- ปุ่มไฟล์ภาพ -->
              <button class="btn btn-file shadow-sm" @click="openImageModal">
                ไฟล์ภาพ
                <i class="bi bi-camera-fill bg-white rounded-1 ms-2 px-1"></i>
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
                  รูปภาพที่ส่งมาจากนักรังสี
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

const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectStatus = (status) => {
  currentStatus.value = status
  dropdownOpen.value = false
}

const STORAGE_KEY = 'repair_items'

// default ข้อมูลเริ่มต้น (อุปกรณ์ไม่มีคำว่า "ห้อง", แยก room ต่างหาก)
const defaultItems = [
  {
    id: 1,
    equipment: 'X-ray general รุ่น xxx',
    room: 'ห้อง 1',
    detail: 'ระบบล็อกและเบรก',
    statusText: 'รอซ่อม'
  }
]

// ------------- ข้อมูลในตาราง (อ่านจาก localStorage) -------------
const items = ref([...defaultItems])
const isUpdating = ref(false) // Flag to prevent recursive updates

const loadItems = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      isUpdating.value = true
      items.value = JSON.parse(stored)
      // Reset flag after DOM update cycle to ensure watcher doesn't trigger
      setTimeout(() => {
        isUpdating.value = false
      }, 0)
    } catch (e) {
      items.value = [...defaultItems]
    }
  }
}

onMounted(() => {
  loadItems()
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      loadItems()
    }
  })
  window.addEventListener('storage-local-update', loadItems)
})

// บันทึกกลับ localStorage เวลา Engineer เปลี่ยนสถานะแล้วกด "บันทึก"
watch(
  items,
  newItems => {
    if (isUpdating.value) return // Skip if updating from storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
      window.dispatchEvent(new Event('storage-local-update'))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  { deep: true }
)

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

// บันทึกแล้วอัปเดตตาราง + กลับไปหน้าระบบแจ้งซ่อม
const saveData = () => {
  if (selectedItem.value) {
    selectedItem.value.statusText = currentStatus.value
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
</script>

<style scoped>
/* เพิ่มแถบสีเทาเมื่อเอาเมาส์ไปวาง */
.status-selector-container .dropdown-item:hover {
  background-color: #e5e5e5 !important;
}

/* ---------- จากโค้ดเดิม ---------- */
.page {
  padding-top: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
}

/* ตาราง */
.table-wrapper {
  max-width: 800px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  padding: 10px 8px;
  text-align: center;
  border: 1px solid #9ca3af;
}

thead th {
  background: #93c5fd;
  font-weight: 600;
}

tbody td {
  background: #e5e5e5;
}

.status.pending {
  color: #ef4444;
  font-weight: 600;
}

.clickable-row {
  /* ไม่ต้องให้ทั้งแถวเป็น pointer แล้ว */
}

/* ✅ ลิงก์ "ตรวจสอบ" */
.detail-link {
  color: #2563eb;
  /* น้ำเงิน */
  text-decoration: underline;
  /* ขีดเส้นใต้ */
  cursor: pointer;
  /* เมาส์เป็นรูปมือ */
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.blue-dot {
  width: 12px;
  height: 12px;
  background-color: #007bff;
  border-radius: 50%;
  margin-right: 10px;
}

.page-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
}

/* Main Box */
.main-box {
  border: 1px solid #000;
  background-color: #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 40px;
}

/* Box Header */
.box-header {
  background-color: #ffcc99;
  border-bottom: 1px solid #000;
  display: flex;
  min-height: 60px;
}

.header-label {
  width: 120px;
  border-right: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  padding: 10px;
}

.header-value {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  font-weight: 400;
}

/* Box Body */
.box-body {
  padding: 30px;
  position: relative;
  min-height: 450px;
  height: 450px;
}

/* Lists */
ul.content-list {
  list-style-type: none;
  padding-left: 10px;
}

ul.content-list li::before {
  content: '•';
  color: black;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

/* Buttons Area */
.inner-actions {
  position: absolute;
  bottom: 150px;
  right: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-file {
  background-color: #9ebd6e;
  border: 1px solid #333;
  color: black;
  width: 140px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.btn-status-base {
  border: 1px solid #333;
  color: black;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  min-width: 180px;
  padding: 0 25px;
  white-space: nowrap;
}

/* Status Colors */
.status-waiting {
  background-color: #ff5c5c;
}

.status-progress {
  background-color: #ffb347;
}

.status-completed {
  background-color: #8be296;
}

/* กล่องเลือกสถานะ */
.status-selector-container {
  position: absolute;
  bottom: 60px;
  right: 0;
  z-index: 20;
}

/* Footer Buttons */
.footer-actions {
  margin-top: 80px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.btn-save {
  background-color: #8be296;
  border: 1px solid #333;
  color: black;
  width: 160px;
  height: 50px;
  font-size: 1.1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.image-modal-card {
  width: 600px;
  background: white;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.cursor-pointer {
  cursor: pointer;
}

/* ปุ่ม dropdown */
.status-dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

/* กล่องตัวเลือกด้านล่าง */
.dropdown-menu-custom {
  position: absolute;
  top: 52px;
  left: 0;
  width: 180px;
  border: 1px solid #999;
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 50;
  border-radius: 5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.dropdown-menu-custom li {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-menu-custom li:hover {
  background: #e8f0fe;
}

.repair-detail-page {
  position: relative;
}

/* ปุ่มกากบาทมุมขวาบน */
.close-modal-btn {
  margin-left: auto;
  /* ให้ปุ่มไปชิดขวาในบรรทัดเดียวกับหัวข้อ */
  cursor: pointer;
  color: #dc3545;
  font-size: 1.5rem;
  transition: 0.2s;
}


.close-modal-btn:hover {
  transform: scale(1.1);
}
</style>

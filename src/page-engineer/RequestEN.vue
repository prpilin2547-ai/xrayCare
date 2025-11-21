<template>
  <MainLayout>
    <div class="page">
      <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
      <div v-if="!selectedItem">
        <!-- หัวข้อระบบแจ้งซ่อม (1. เอาปุ่มบวกออก) -->
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
                <th>รายละเอียด</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                class="clickable-row"
                @click="openDetail(item)"
              >
                <td>{{ item.id }}</td>
                <td>{{ item.equipment }}</td>
                <td>{{ item.detail }}</td>
                <td
                  class="status"
                  :class="getStatusCellClass(item.statusText)"
                  >
                  {{ item.statusText }}
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
        </div>

        <!-- Main Content Box -->
        <div class="main-box">
          <!-- Orange Header -->
          <div class="box-header">
            <div class="header-label">อุปกรณ์</div>
            <div class="header-value">{{ selectedItem.equipment }}</div>
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
              <!-- ปุ่มไฟล์ภาพ (อยู่ตำแหน่งเดิมตลอด) -->
              <button class="btn btn-file shadow-sm" @click="openImageModal">
                ไฟล์ภาพ
                <i
                  class="bi bi-camera-fill bg-white rounded-1 ms-2 px-1"
                ></i>
              </button>

              <!-- แสดงสถานะปัจจุบัน -->
              <div class="status-display">
                <div
                    class="btn-status-base shadow-sm"
                    :class="statusClass"
                    >
                    {{ currentStatus }}
                    </div>
              </div>

              <!-- 3. แถบแก้ไขสถานะ แสดง "ด้านล่าง" ไม่ขึ้นด้านบน -->
              <div
                v-if="isEditingStatus"
                class="status-selector-container bg-white border border-dark p-2 shadow-sm"
              >
                <ul class="list-unstyled m-0">
                  <li>
                    <a
                      class="dropdown-item p-2"
                      href="#"
                      @click.prevent="changeStatus('รอซ่อม')"
                      >รอซ่อม</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item p-2"
                      href="#"
                      @click.prevent="changeStatus('อยู่ระหว่างดำเนินการ')"
                      >อยู่ระหว่างดำเนินการ</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item p-2"
                      href="#"
                      @click.prevent="changeStatus('ดำเนินการแล้ว')"
                      >ดำเนินการแล้ว</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Action Buttons -->
        <div class="footer-actions">
          <!-- ปุ่มแก้ไขสถานะ -->
          <button
            class="btn btn-edit-status shadow-sm"
            @click="toggleEditStatus"
          >
            {{ isEditingStatus ? 'ปิดการแก้ไข' : 'แก้ไขสถานะ' }}
          </button>
          <!-- 2 & 4. บันทึกแล้วกลับไปหน้าตาราง + ไม่มี alert localhost แล้ว -->
          <button class="btn btn-save shadow-sm" @click="saveData">
            บันทึก
          </button>
        </div>

        <!-- Image Modal -->
        <div v-if="showImageModal" class="modal-overlay">
          <div class="modal-card image-modal-card">
            <div
              class="modal-header bg-success text-white p-3 d-flex justify-content-between align-items-center"
            >
              <h5 class="m-0">รูปภาพ</h5>
              <i
                class="bi bi-x-circle cursor-pointer fs-4"
                @click="closeImageModal"
              ></i>
            </div>
            <div
              class="modal-body p-5 bg-light d-flex justify-content-center align-items-center"
              style="min-height: 300px"
            >
              <div class="text-center">
                <img
                  src="https://via.placeholder.com/400x300?text=X-Ray+Machine+Issue"
                  alt="Request Image"
                  class="img-fluid shadow-sm mb-3"
                />
                <p class="text-muted">รูปภาพที่ส่งมาจากนักรังสี</p>
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
import { ref, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

// ------------- ข้อมูลในตาราง (ตัวอย่าง) -------------
const items = ref([
  {
    id: 1,
    equipment: 'X-ray general รุ่น xxx ห้อง 1',
    detail: 'ระบบล็อกและเบรก',
    statusText: 'รอซ่อม'
  }
])

// item ที่ถูกเลือก (null = โหมดตาราง)
const selectedItem = ref(null)

// สถานะปัจจุบันของงานที่เปิดดู
const currentStatus = ref('รอซ่อม')
const isEditingStatus = ref(false)
const showImageModal = ref(false)

// เปิดหน้ารายละเอียดจากการคลิกตาราง
const openDetail = (item) => {
  selectedItem.value = item
  currentStatus.value = item.statusText
  isEditingStatus.value = false
}

// class สีของปุ่มสถานะ
const statusClass = computed(() => {
  if (currentStatus.value === 'รอซ่อม') return 'status-waiting'
  if (currentStatus.value === 'อยู่ระหว่างดำเนินการ') return 'status-progress'
  if (currentStatus.value === 'ดำเนินการแล้ว') return 'status-completed'
  return 'status-waiting'
})

// toggle โหมดแก้ไขสถานะ
const toggleEditStatus = () => {
  isEditingStatus.value = !isEditingStatus.value
}

// เลือกสถานะในกล่องด้านล่าง
const changeStatus = (status) => {
  currentStatus.value = status
  isEditingStatus.value = false
}

// modal รูปภาพ
const openImageModal = () => {
  showImageModal.value = true
}
const closeImageModal = () => {
  showImageModal.value = false
}

// 2 & 4. บันทึกแล้วอัปเดตตาราง + กลับไปหน้าระบบแจ้งซ่อม (ไม่มี alert)
const saveData = () => {
  if (selectedItem.value) {
    selectedItem.value.statusText = currentStatus.value
  }
  // รีเซ็ต state เพื่อกลับไปตาราง
  selectedItem.value = null
  isEditingStatus.value = false
  showImageModal.value = false
}

const getStatusCellClass = (status) => {
  if (status === 'รอซ่อม') return 'status-waiting'          // แดง
  if (status === 'อยู่ระหว่างดำเนินการ') return 'status-progress' // ส้ม
  if (status === 'ดำเนินการแล้ว') return 'status-completed'       // เขียว
  return ''
}
</script>

<style scoped>
/* ---------- จากโค้ดแถบ Request เดิม ---------- */
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
  cursor: pointer;
}

/* ---------- จากโค้ดแถบ Engineer Request เดิม ---------- */

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
  min-height: 300px;
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
  bottom: 30px;
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

/* 3. กล่องเลือกสถานะอยู่ด้านล่าง ไม่ดันปุ่มไฟล์ภาพ */
.status-selector-container {
position: absolute;
bottom: 60px;   /* ← ย้ายจากด้านล่างขึ้นไปอยู่เหนือปุ่มสถานะ */
right: 0;       /* ให้อยู่ตรงตำแหน่งปุ่มสถานะ */
z-index: 20;    /* อยู่ด้านหน้าสุดเหมือนเดิม */
}

/* Footer Buttons */
.footer-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
}

.btn-edit-status {
  background-color: #f4f85b; /* Yellow */
  border: 1px solid #333;
  color: black;
  width: 160px;
  height: 50px;
  font-size: 1.1rem;
}

.btn-save {
  background-color: #8be296; /* Green */
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
</style>

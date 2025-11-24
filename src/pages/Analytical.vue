<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Analytical</h2>

      <div class="panel">
        <div class="panel-header">
          <h3>สรุปสถานะการแจ้งซ่อม</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart">
            <div class="pie-chart">
              <div class="pie-circle"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass/Fail Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>Recurrent Failure Rate (RFR)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>สรุปสถานะการแจ้งซ่อม</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart bar-chart">
            <div class="bars">
              <div class="bar bar-failure"></div>
              <div class="bar bar-qc"></div>
              <div class="bar bar-rfr"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass/Fail Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>Recurrent Failure Rate (RFR)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-strip">
        <span class="summary-label">สรุป :</span>
        <span class="summary-text">
          แสดงตัวอย่างพื้นที่สำหรับสรุปผลวิเคราะห์ เช่น อัตราการเกิดปัญหา, แนวโน้มคุณภาพ QC และ RFR
        </span>
      </div>

      <!-- ========== HISTORY SECTION ========== -->
      <div class="panel">
        <div class="panel-header">
          <h3>ประวัติการทำรายการ</h3>
        </div>

        <div class="panel-body history-body">
          <!-- Search Filters -->
          <div class="history-filters">
            <input
              v-model="filters.device"
              class="history-input"
              placeholder="ค้นหาตามชื่อเครื่อง..."
            />

            <select v-model="filters.form" class="history-input">
              <option value="">เลือกแบบบันทึก</option>
              <option>dairy check</option>
              <option>monthly check(1 month)</option>
              <option>monthly check(3 month)</option>
              <option>monthly check(6 month)</option>
            </select>

            <input
              type="date"
              v-model="filters.date"
              class="history-input"
            />

            <button class="history-btn" @click="searchHistory">
              ค้นหา
            </button>
          </div>

          <!-- Table -->
          <div class="table-responsive mt-2">
            <table class="table table-bordered small history-table">
              <thead class="table-light text-center">
                <tr>
                  <th>วันที่</th>
                  <th>ผู้ทำ</th>
                  <th>เครื่อง</th>
                  <th>แบบบันทึก</th>
                  <th>ผล</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in history" :key="item.id">
                  <td>{{ item.timestamp }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.device }}</td>
                  <td class="fw-bold">{{ item.form }}</td>
                  <td>
                    <span :class="item.status === 'Pass' ? 'tag-pass' : 'tag-fail'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="openDetail(item)"
                    >
                      ดูเพิ่มเติม
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="history-pagination">
            <button class="page-btn" @click="prevPage" :disabled="page === 1">
              ‹
            </button>
            <span>หน้า {{ page }}</span>
            <button class="page-btn" @click="nextPage">
              ›
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="modal.open" class="modal-backdrop">
        <div class="modal-card">
          <h3 class="modal-title">รายละเอียดการทำรายการ</h3>

          <p><strong>วันที่:</strong> {{ modal.data.timestamp }}</p>
          <p><strong>ผู้ทำ:</strong> {{ modal.data.user }}</p>
          <p><strong>เครื่อง:</strong> {{ modal.data.device }}</p>
          <p><strong>แบบบันทึก:</strong> {{ modal.data.form }}</p>
          <p><strong>ผล:</strong> {{ modal.data.status }}</p>

          <div class="modal-section">
            <strong>ข้อมูลที่บันทึก</strong>
            <pre class="modal-json">{{ modal.data.values }}</pre>
          </div>

          <button class="modal-close" @click="modal.open = false">
            ปิด
          </button>
        </div>
      </div>
      <!-- ========== END HISTORY SECTION ========== -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const filters = ref({
  device: '',
  form: '',
  date: ''
})

const page = ref(1)

// ตัวอย่างข้อมูล dummy (ภายหลังสามารถเชื่อม API จริงได้)
const history = ref([
  {
    id: 1,
    timestamp: '2025-02-01 10:20',
    user: 'John Doe',
    device: 'X-Ray Model A / Room 101',
    form: 'F3',
    status: 'Pass',
    values: '{ "brightness": 220, "contrast": 180 }'
  },
  {
    id: 2,
    timestamp: '2025-02-03 09:10',
    user: 'Jane Smith',
    device: 'X-Ray Model B / Room 102',
    form: 'F7-1',
    status: 'Fail',
    values: '{ "alignment": "3.5°", "limit": "3°" }'
  }
])

const modal = ref({
  open: false,
  data: {}
})

const openDetail = (item) => {
  modal.value.data = item
  modal.value.open = true
}

// ตอนนี้แค่ mock ไว้ ภายหลังคุณเปลี่ยนมา call API ได้
const searchHistory = () => {
  console.log('ค้นหาด้วย filter:', filters.value)
}

const nextPage = () => {
  page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-title {
  margin: 0;
}

.panel {
  background: #f3f4f6;
  border-radius: 16px;
  overflow: hidden;
}

.panel-header {
  background: var(--purple-main);
  color: white;
  padding: 8px 14px;
}

.panel-header h3 {
  margin: 0;
  font-size: 0.98rem;
}

.panel-body {
  padding: 14px;
}

.panel-chart {
  display: flex;
  gap: 16px;
  align-items: center;
}

.pie-chart {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pie-circle {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: conic-gradient(
    #f97316 0 35%,
    #10b981 35% 75%,
    #ec4899 75% 100%
  );
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.legend-dot.failure {
  background: #f97316;
}

.legend-dot.qc {
  background: #10b981;
}

.legend-dot.rfr {
  background: #ec4899;
}

/* Bar chart mock */
.bar-chart {
  align-items: flex-end;
}

.bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding: 10px 0 4px;
}

.bar {
  width: 32px;
  border-radius: 8px 8px 0 0;
}

.bar-failure {
  height: 80px;
  background: #f97316;
}

.bar-qc {
  height: 120px;
  background: #10b981;
}

.bar-rfr {
  height: 60px;
  background: #ec4899;
}

.summary-strip {
  margin-top: 4px;
  padding: 10px 10px;
  border-radius: 12px;
  background: #fee2e2;
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
  width: 700px;
}

.summary-label {
  font-weight: 600;
}

/* ========== HISTORY SECTION STYLES ========== */
.history-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.history-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.history-input {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.history-btn {
  background: var(--purple-main);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.tag-pass {
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.tag-fail {
  background: #ef4444;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.history-pagination {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 6px;
}

.page-btn {
  background: #e5e7eb;
  border: none;
  padding: 4px 12px;
  border-radius: 6px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: white;
  width: 480px;
  max-width: 90vw;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.modal-json {
  background: #f3f4f6;
  padding: 8px;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  font-size: 0.8rem;
}

.modal-close {
  margin-top: 14px;
  padding: 8px 14px;
  background: var(--purple-main);
  color: white;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
}
</style>

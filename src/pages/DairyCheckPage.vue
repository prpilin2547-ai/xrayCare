<template>
  <MainLayout>
    <div class="checklist-page">
      <h1 class="page-title">CHECKLIST</h1>

      <div class="pill-row">
        <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div>
        <div class="pill">
          รุ่น {{ selectedDevice.model }}
        </div>
        <div class="pill">
          ห้อง {{ selectedDevice.room }}
        </div>
        <div class="pill">
          วันที่ : {{ todayText }}
        </div>
        <div class="pill">
          ผู้ทดสอบ : {{ currentUserName }}
        </div>
      </div>

      <div class="content-panel">
        <p class="section-label">Dairy check</p>

        <!-- ตารางหลัก -->
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  แบบบันทึก : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์
                </td>
              </tr>

              <tr class="row-header-columns">
                <td>รายการ</td>
                <td class="text-center">ผ่าน</td>
                <td class="text-center">ไม่ผ่าน</td>
                <td class="text-center">หมายเหตุ</td>
              </tr>

              <tr v-for="item in checklistItems" :key="item.id">
                <td class="cell-label">
                  {{ item.label }}
                </td>
                <td class="text-center">
                  <input type="radio" :name="`check-${item.id}`" value="pass" v-model="item.result" />
                </td>
                <td class="text-center">
                  <input type="radio" :name="`check-${item.id}`" value="fail" v-model="item.result" />
                </td>
                <td>
                  <textarea class="input-textarea" v-model="item.remark" placeholder="บันทึกหมายเหตุ..."></textarea>
                  <div class="mt-2">
          <label class="form-label small mb-1">แนบไฟล์ภาพ</label>
          <input
            type="file"
            class="form-control form-control-sm"
            @change="onFileChange"
          />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ตารางลบแผ่นเพลท -->
        <div class="table-wrapper mt-24">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  แบบบันทึก : การลบแผ่นเพลท แผนกเอกซเรย์
                </td>
              </tr>

              <tr class="row-header-columns">
                <td>รายการ</td>
                <td class="text-center">ผ่าน</td>
                <td class="text-center">ไม่ผ่าน</td>
                <td class="text-center">หมายเหตุ</td>
              </tr>

              <tr>
                <td class="cell-label">ผลการทดสอบ</td>
                <td class="text-center">
                  <input type="radio" name="plate-erase" value="pass" v-model="plateEraseResult" />
                </td>
                <td class="text-center">
                  <input type="radio" name="plate-erase" value="fail" v-model="plateEraseResult" />
                </td>
                <td>
                  <textarea class="input-textarea" v-model="plateEraseRemark" placeholder="บันทึกหมายเหตุ..."></textarea>
                  <div class="mt-2">
          <label class="form-label small mb-1">แนบไฟล์ภาพ</label>
          <input
            type="file"
            class="form-control form-control-sm"
            @change="onFileChange"
          />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่ม -->
        <div class="actions">
          <button class="btn-remark" @click="markAllPass">
            ผ่านทั้งหมด
          </button>

          <!-- ⭐ ปุ่มถัดไปทำงานเฉพาะวันที่ครบ 3 เดือน ⭐ -->
          <button v-if="isExactly3Months" class="btn btn-warning" @click="goNext">
            ถัดไป
          </button>

          <button v-else class="btn-save" @click="saveChecklist">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const props = defineProps({
  selectedDevice: {
    type: Object,
    default: () => ({
      name: 'เครื่องเอกซเรย์ทั่วไป',
      model: 'MODEL-XR-100',
      room: 'X-Ray Room 1'
    })
  },
  currentUserName: {
    type: String,
    default: 'Demo User'
  }
})

const router = useRouter()

// วันเริ่มต้นที่กำหนด
const startDate = ref(new Date("2025-08-21"))

// วันนี้
const today = ref(new Date())

// แสดงวันที่บน UI
const todayText = computed(() =>
  today.value.toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })
)

// วันครบ 3 เดือน
const threeMonthDate = computed(() => {
  const d = new Date(startDate.value)
  d.setMonth(d.getMonth() + 3)
  return d
})

// วันนี้ตรงกับวันที่ครบ 3 เดือนหรือไม่
const isExactly3Months = computed(() => {
  const t = today.value
  const m = threeMonthDate.value
  return (
    t.getFullYear() === m.getFullYear() &&
    t.getMonth() === m.getMonth() &&
    t.getDate() === m.getDate()
  )
})

function goNext() {
  router.push('/monthly-check')
}

// checklist
const checklistItems = ref([
  {
    id: 'powerCable',
    label: 'สายไฟ : ไม่พบรอยแตก ไม่บิดงอ ไม่พันเป็นปม และไม่มีอุปกรณ์ที่มีน้ำหนักมากวางทับสายไฟ',
    result: '',
    remark: '',
    file: null,
    fileName: ''
  },
  {
    id: 'lockBrake',
    label: 'ระบบล็อกและเบรก : ทำงานได้อย่างถูกต้อง',
    result: '',
    remark: '',
    file: null,
    fileName: ''
  },
  {
    id: 'tableTubeBucky',
    label: 'เตียง หลอดเอกซเรย์ และบักกี้ : เคลื่อนที่ได้อย่างราบเรียบ',
    result: '',
    remark: '',
    file: null,
    fileName: ''
  },
  {
    id: 'tubeWarmup',
    label: 'X-ray tube warm-up : ด้วยค่าเทคนิคที่บริษัทแนะนำ',
    result: '',
    remark: '',
    file: null,
    fileName: ''
  }
])

const plateEraseResult = ref('')
const plateEraseRemark = ref('')
const plateEraseFile = ref(null)
const plateEraseFileName = computed(() =>
  plateEraseFile.value ? plateEraseFile.value.name : ''
)

const onItemFileChange = (event, item) => {
  const file = event.target.files[0] || null
  item.file = file
  item.fileName = file ? file.name : ''
}

const onPlateEraseFileChange = (event) => {
  const file = event.target.files[0] || null
  plateEraseFile.value = file
}

const markAllPass = () => {
  checklistItems.value.forEach((item) => { item.result = 'pass' })
  plateEraseResult.value = 'pass'
}

const saveChecklist = () => {
  const payload = {
    device: props.selectedDevice,
    date: todayText.value,
    user: props.currentUserName,
    checklist: checklistItems.value,
    plateErase: {
      result: plateEraseResult.value,
      remark: plateEraseRemark.value,
      fileName: plateEraseFileName.value
    }
  }

  console.log('ข้อมูลที่ต้องบันทึก:', payload)
  router.push('/dashboard')
}
</script>

<style scoped>
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.pill {
  background: #ffb480;
  color: #111827;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.pill-main {
  background: #ffb480;
  color: #047857;
  font-weight: 700;
}

.content-panel {
  background: #ffffff;
  padding: 20px 24px 28px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

.section-label {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 12px;
}

.table-wrapper {
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table td {
  padding: 10px 12px;
  vertical-align: top;
  border-bottom: 1px solid #e5e7eb;
}

.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

.row-header-columns td {
  font-weight: 600;
  background: #f3f4f6;
}

.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #f9fafb;
}

.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #e5e7eb;
}

.cell-label {
  width: 70%;
}

.text-center {
  text-align: center;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-remark,
.btn-save {
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-remark {
  background: #ff6b81;
  color: #ffffff;
}

.btn-remark:hover {
  background: #e0556a;
}

.btn-save {
  background: #65d46e;
  color: #ffffff;
}

.btn-save:hover {
  background: #4fb759;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: #ffffff;
  border-radius: 10px;
  padding: 16px 18px 14px;
  width: 430px;
  max-width: 92%;
  box-shadow: 0 18px 32px rgba(0, 0, 0, 0.35);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.3rem;
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.input-textarea {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 0.9rem;
}

.mt-12 {
  margin-top: 12px;
}

.mt-24 {
  margin-top: 24px;
}

.file-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-save-popup {
  border-radius: 4px;
  border: none;
  padding: 6px 16px;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-cancel {
  background: #e5e7eb;
  color: #111827;
}

.btn-save-popup {
  background: #65d46e;
  color: #ffffff;
}

@media (max-width: 768px) {
  .checklist-page {
    padding: 16px;
  }

  .pill-row {
    gap: 8px;
  }

  .pill {
    font-size: 0.8rem;
  }
}
</style>

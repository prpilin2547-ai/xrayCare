<template>
  <!-- ใช้ MainLayout ครอบแทนการทำ sidebar / topbar เอง -->
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อ CHECKLIST -->
      <h1 class="page-title">อัตราการถ่ายภาพซ้ำ</h1>

      <!-- แถวแคปซูลสีส้มด้านบน -->
      <div class="pill-row">
        <!-- <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div> -->
        <!-- <div class="pill">
          รุ่น {{ selectedDevice.model }}
        </div> -->
        <!-- <div class="pill">
          ห้อง {{ selectedDevice.room }}
        </div> -->
        <div class="pill">
          วันที่ : {{ todayText }}
        </div>
        <div class="pill">
          ผู้บันทึก : {{ currentUserName }}
        </div>
      </div>

      <!-- กล่องเนื้อหาขาวตรงกลาง -->
      <div class="content-panel">
        <!-- ⭐ ตาราง : แบบบันทึก F12 อัตราการถ่ายภาพซ้ำ -->
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <!-- หัวตารางหลัก -->
              <tr class="row-header-main">
                <td colspan="2" class="text-center">
                  แบบบันทึก F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ
                </td>
              </tr>

              <!-- หัวคอลัมน์ -->
              <tr class="row-header-columns">
                <td>สาเหตุการปฏิเสธภาพ/การถ่ายซ้ำ</td>
                <td class="text-center">เลือก</td>
              </tr>

              <!-- รายการสาเหตุ 1–9 -->
              <tr v-for="reason in repeatReasons" :key="reason.id">
                <td class="cell-label">
                  {{ reason.index }}. {{ reason.label }}
                  <span v-if="reason.enLabel">({{ reason.enLabel }})</span>

                  <!-- ถ้าเป็น "อื่นๆ" ให้มีช่องกรอก -->
                  <div
                    v-if="reason.id === 'other' && selectedReason === 'other'"
                    class="mt-12"
                  >
                    <label class="field-label">ระบุสาเหตุเพิ่มเติม</label>
                    <input
                      type="text"
                      class="input-text"
                      v-model="otherReasonText"
                      placeholder="กรอกสาเหตุอื่นๆ..."
                    />
                  </div>
                </td>

                <td class="text-center">
                  <input
                    type="radio"
                    name="repeat-reason"
                    :value="reason.id"
                    v-model="selectedReason"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ⭐ จบตาราง F12 -->

        <!-- ปุ่มด้านล่างขวา -->
        <div class="actions">
          <!-- <button class="btn-remark" @click="openRemarkModal">
            หมายเหตุ
          </button> -->
          <button class="btn-save" @click="saveChecklist">
            บันทึก
          </button>
        </div>
      </div>
    </div>

    <!-- Popup หมายเหตุ -->
    <div
      v-if="showRemarkModal"
      class="modal-backdrop"
      @click.self="closeRemarkModal"
    >
      <div class="modal-box">
        <div class="modal-header">
          <h3>หมายเหตุ</h3>
          <button class="close-btn" @click="closeRemarkModal">×</button>
        </div>

        <div class="modal-body">
          <label class="field-label">รายละเอียดเพิ่มเติม</label>
          <textarea
            v-model="remarkText"
            class="input-textarea"
            placeholder="กรอกรายละเอียด..."
          ></textarea>

          <label class="field-label mt-12">แนบไฟล์รูปภาพ</label>
          <input type="file" accept="image/*" @change="onFileChange" />
          <p v-if="remarkFileName" class="file-name">
            ไฟล์ที่เลือก: {{ remarkFileName }}
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeRemarkModal">ยกเลิก</button>
          <button class="btn-save-popup" @click="saveRemark">บันทึก</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const route = useRoute()

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

// ⭐ F12 : รายการสาเหตุ
const repeatReasons = ref([
  { id: 'positioning', index: 1, label: 'การจัดท่าผู้ป่วย', enLabel: 'Positioning' },
  { id: 'exposureError', index: 2, label: 'ปริมาณรังสีที่ไม่เหมาะสม', enLabel: 'Exposure error' },
  { id: 'gridError', index: 3, label: 'ความผิดพลาดของกริด', enLabel: 'Grid error' },
  { id: 'systemError', index: 4, label: 'ความผิดพลาดของระบบ', enLabel: 'System error' },
  { id: 'artifact', index: 5, label: 'สิ่งแปลกปลอมในภาพ*', enLabel: 'Artifact' },
  { id: 'patientMotion', index: 6, label: 'การเคลื่อนไหวของผู้ป่วย', enLabel: 'Patient motion' },
  { id: 'testImage', index: 7, label: 'การทดสอบภาพ', enLabel: 'Test image' },
  { id: 'studyCanceled', index: 8, label: 'ยกเลิกเคส', enLabel: 'Study canceled' },
  { id: 'other', index: 9, label: 'อื่นๆ', enLabel: '' }
])

const selectedReason = ref('')
const otherReasonText = ref('')

const showRemarkModal = ref(false)
const remarkText = ref('')
const remarkFile = ref(null)

const remarkFileName = computed(() => remarkFile.value?.name || '')

const openRemarkModal = () => {
  showRemarkModal.value = true
}
const closeRemarkModal = () => {
  showRemarkModal.value = false
}

const onFileChange = (e) => {
  remarkFile.value = e.target.files[0] || null
}

const saveRemark = () => {
  console.log('หมายเหตุ:', remarkText.value)
  console.log('ไฟล์แนบ:', remarkFile.value)
  closeRemarkModal()
}

const saveChecklist = () => {
  console.log({
    device: props.selectedDevice,
    date: todayText.value,
    reason: selectedReason.value,
    otherText: otherReasonText.value,
    remark: remarkText.value
  })

  router.push('/dashboard')
}
</script>

<style scoped>
/* พื้นที่ทำงานหลักของหน้า (content ใน MainLayout) */
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

/* หัวข้อ CHECKLIST */
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

/* แถวแคปซูลด้านบน */
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
  color: #047857; /* เขียวตัวเครื่อง */
  font-weight: 700;
}

/* กล่องเนื้อหากลาง (พื้นขาวเหมือนกระดาษ) */
.content-panel {
  background: #ffffff;
  padding: 20px 24px 28px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

/* ตาราง */
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

/* แถวหัวบนสุดสีฟ้า */
.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

/* หัวคอลัมน์ */
.row-header-columns td {
  font-weight: 600;
  background: #f3f4f6;
}

/* สีพื้นสลับแถว ให้ดูลอย */
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

/* ปุ่มด้านล่างขวา */
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
  background: #ff6b81; /* แดงอมชมพู */
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

/* input text สำหรับ "อื่นๆ" */
.input-text {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
}

/* Popup หมายเหตุ */
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

/* responsive เล็กน้อย */
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

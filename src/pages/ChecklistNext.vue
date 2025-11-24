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

        <!-- ตาราง : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์ -->
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
                <td class="cell-label">{{ item.label }}</td>

                <td class="text-center">
                  <input
                    type="radio"
                    :name="`check-${item.id}`"
                    value="pass"
                    v-model="item.result"
                  />
                </td>

                <td class="text-center">
                  <input
                    type="radio"
                    :name="`check-${item.id}`"
                    value="fail"
                    v-model="item.result"
                  />
                </td>

                <td>
                  <textarea
                    class="input-textarea"
                    v-model="item.remark"
                    placeholder="บันทึกหมายเหตุ..."
                  ></textarea>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onItemFileChange($event, item)"
                  />
                  <p v-if="item.fileName" class="file-name">
                    ไฟล์ที่เลือก: {{ item.fileName }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ⭐ ตาราง : แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์ -->
        <div class="table-wrapper mt-24">
          <table class="check-table">
            <tbody>
              <!-- หัวตาราง -->
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  แบบบันทึก : การลบแผ่นเพลท แผนกเอกซเรย์
                </td>
              </tr>

              <!-- หัวคอลัมน์ -->
              <tr class="row-header-columns">
                <td>รายการ</td>
                <td class="text-center">ผ่าน</td>
                <td class="text-center">ไม่ผ่าน</td>
                <td class="text-center">หมายเหตุ</td>
              </tr>

              <!-- แถวรายการทดสอบ -->
              <tr>
                <td class="cell-label">
                  ผลการทดสอบ
                </td>
                <td class="text-center">
                  <input
                    type="radio"
                    name="plate-erase"
                    value="pass"
                    v-model="plateEraseResult"
                  />
                </td>
                <td class="text-center">
                  <input
                    type="radio"
                    name="plate-erase"
                    value="fail"
                    v-model="plateEraseResult"
                  />
                </td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="plateEraseRemark"
                    placeholder="บันทึกหมายเหตุ..."
                  ></textarea>
                  <input
                    type="file"
                    accept="image/*"
                    @change="onPlateEraseFileChange"
                  />
                  <p v-if="plateEraseFileName" class="file-name">
                    ไฟล์ที่เลือก: {{ plateEraseFileName }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ⭐ จบตาราง -->

        <!-- ปุ่มด้านล่างขวา -->
        <div class="actions">
          <!-- ปุ่มผ่านทั้งหมด ใช้สไตล์เดิมของปุ่มหมายเหตุ -->
          <button class="btn-remark" @click="markAllPass">
            ผ่านทั้งหมด
          </button>

          <!-- ปุ่มสีเหลือง: ถัดไป (เหมือนเดิม) -->
          <button class="btn-next" @click="goNext">
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
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

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

// เพิ่ม remark + file ให้แต่ละรายการ
const checklistItems = ref([
  {
    id: 'powerCable',
    label:
      'สายไฟ : ไม่พบรอยแตก ไม่บิดงอ ไม่พันเป็นปม และไม่มีอุปกรณ์ที่มีน้ำหนักมากวางทับสายไฟ',
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

// ผลและ remark การลบแผ่นเพลท
const plateEraseResult = ref('') // pass | fail
const plateEraseRemark = ref('')
const plateEraseFile = ref(null)
const plateEraseFileName = computed(() =>
  plateEraseFile.value ? plateEraseFile.value.name : ''
)

// เปลี่ยนไฟล์ของแต่ละรายการ checklist
const onItemFileChange = (event, item) => {
  const file = event.target.files[0] || null
  item.file = file
  item.fileName = file ? file.name : ''
}

// เปลี่ยนไฟล์ของการลบแผ่นเพลท
const onPlateEraseFileChange = (event) => {
  const file = event.target.files[0] || null
  plateEraseFile.value = file
}

// ปุ่ม "ผ่านทั้งหมด"
const markAllPass = () => {
  checklistItems.value.forEach((item) => {
    item.result = 'pass'
  })
  plateEraseResult.value = 'pass'
}

// ปุ่มถัดไป → ไปหน้า MonthlyCheckPage.vue
const goNext = () => {
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

  console.log('payload ก่อนไปหน้า MonthlyCheckPage:', payload)

  // เปลี่ยน path ให้ตรงกับ route ของ MonthlyCheckPage.vue ในโปรเจกต์คุณ
  router.push('/monthly-check')
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
}

.pill-main {
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
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
}

.check-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

.row-header-columns td {
  background: #f3f4f6;
  font-weight: 600;
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

.btn-remark {
  background: #ff6b81;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
}

/* ปุ่มถัดไป สีเหลือง (เหมือนเดิม) */
.btn-next {
  background: #f7c948;
  color: #111827;
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-weight: 600;
  cursor: pointer;
}

.btn-next:hover {
  background: #e0b63f;
}

/* ระยะห่างตารางใหม่จากตารางแรก */
.mt-24 {
  margin-top: 24px;
}

/* Modal styles เดิม (ยังคงไว้ แม้ไม่ได้ใช้แล้ว) */
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

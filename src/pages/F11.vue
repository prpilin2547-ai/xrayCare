<template>
  <!-- ใช้ MainLayout ครอบหน้าเหมือนตัวอย่างเดิม -->
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">แบบบันทึก F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย</h1>

      <!-- แคปซูลด้านบน -->
      <div class="pill-row">
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้บันทึก : {{ currentUserName }}</div>
      </div>

      <!-- กล่องเนื้อหากลาง -->
      <div class="content-panel">
        <!-- ================= ส่วนที่ A : ข้อมูลทั่วไปของการตรวจ ================= -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  ส่วนที่ A : ข้อมูลทั่วไปของการตรวจ
                </td>
              </tr>

              <!-- แถววันที่ / Exam ID -->
              <tr>
                <td class="cell-label">
                  วันที่ตรวจ<span class="required">*</span>
                </td>
                <td>
                  <input
                    type="date"
                    class="input-text"
                    v-model="formA.examDate"
                  />
                </td>
                <td class="cell-label">เลขที่การตรวจ / Exam ID</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="formA.examId"
                    placeholder="เว้นว่างได้"
                  />
                </td>
              </tr>

              <!-- ห้องตรวจ / HN -->
              <tr>
                <td class="cell-label">ห้องตรวจ / เครื่องเอกซเรย์</td>
                <td>
                  <select class="input-text" v-model="formA.room">
                    <option value="">-- เลือกห้องตรวจ --</option>
                    <option value="XR1">ห้องเอกซเรย์ 1</option>
                    <option value="XR2">ห้องเอกซเรย์ 2</option>
                    <option value="Mobile">Mobile</option>
                    <option value="C-arm">C-arm</option>
                  </select>
                </td>
                <td class="cell-label">
                  HN ผู้ป่วย<span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="formA.hn"
                    placeholder="เช่น 1234567"
                  />
                </td>
              </tr>

              <!-- ชื่อ - เพศ -->
              <tr>
                <td class="cell-label">
                  ชื่อ–สกุลผู้ป่วย<span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="formA.patientName"
                    placeholder="กรอกชื่อและนามสกุล"
                  />
                </td>
                <td class="cell-label">เพศ</td>
                <td>
                  <select class="input-text" v-model="formA.gender">
                    <option value="">-- เลือกเพศ --</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>
                  </select>
                </td>
              </tr>

              <!-- อายุ / น้ำหนัก -->
              <tr>
                <td class="cell-label">อายุ (ปี)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    class="input-text"
                    v-model.number="formA.age"
                  />
                </td>
                <td class="cell-label">น้ำหนัก (kg)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="formA.weight"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ================= ส่วนที่ B : ตารางวัดความหนา ================= -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="8" class="text-center">
                  ส่วนที่ B : ตารางบันทึกผลการวัดความหนาตามท่าตรวจ
                </td>
              </tr>

              <!-- หัวคอลัมน์ -->
              <tr class="row-header-columns">
                <td class="text-center">ลำดับ</td>
                <td>บริเวณฉายรังสี</td>
                <td class="text-center">kV</td>
                <td class="text-center">mAs</td>
                <td class="text-center">FTD (cm)</td>
                <td class="text-center">tp (cm)</td>
                <td class="text-center">ระยะ Bucky (cm)</td>
                <td>หมายเหตุ</td>
              </tr>

              <!-- แถวข้อมูล -->
              <tr v-for="(row, index) in examRows" :key="row.id">
                <td class="text-center">{{ index + 1 }}</td>

                <!-- บริเวณฉายรังสี + อื่น ๆ -->
                <td>
                  <select
                    class="input-text mb-4"
                    v-model="row.region"
                  >
                    <option value="">-- เลือกบริเวณฉายรังสี --</option>
                    <option value="Chest PA">Chest PA</option>
                    <option value="L-Spine AP">L-Spine AP</option>
                    <option value="L-Spine LAT">L-Spine LAT</option>
                    <option value="Abdomen AP">Abdomen AP</option>
                    <option value="Pelvis AP">Pelvis AP</option>
                    <option value="Skull AP/PA">Skull AP/PA</option>
                    <option value="Skull LAT">Skull LAT</option>
                    <option value="other">อื่น ๆ</option>
                  </select>

                  <div v-if="row.region === 'other'">
                    <label class="field-label">ระบุชื่อท่าตรวจ</label>
                    <input
                      type="text"
                      class="input-text"
                      v-model="row.regionOther"
                      placeholder="เช่น Hand AP, Foot LAT"
                    />
                  </div>
                </td>

                <!-- kV -->
                <td class="text-center">
                  <input
                    type="number"
                    min="40"
                    max="150"
                    class="input-text input-number"
                    v-model.number="row.kv"
                  />
                </td>

                <!-- mAs -->
                <td class="text-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    class="input-text input-number"
                    v-model.number="row.mas"
                  />
                </td>

                <!-- FTD -->
                <td class="text-center">
                  <input
                    type="number"
                    min="0"
                    class="input-text input-number"
                    v-model.number="row.ftd"
                  />
                </td>

                <!-- tp -->
                <td class="text-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    class="input-text input-number"
                    v-model.number="row.tp"
                  />
                </td>

                <!-- Bucky -->
                <td class="text-center">
                  <input
                    type="number"
                    min="0"
                    class="input-text input-number"
                    v-model.number="row.bucky"
                  />
                </td>

                <!-- หมายเหตุ + ปุ่มลบ -->
                <td>
                  <textarea
                    class="input-textarea small-textarea"
                    v-model="row.note"
                    placeholder="ไม่บังคับ"
                  ></textarea>
                  <button
                    class="btn-remove-row"
                    type="button"
                    @click="removeRow(index)"
                    v-if="examRows.length > 1"
                  >
                    ลบรายการ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่มเพิ่มรายการตรวจ -->
        <div class="actions mb-16">
          <button type="button" class="btn-remark" @click="addRow">
            เพิ่มรายการตรวจ
          </button>
        </div>

        <!-- ================= ส่วนที่ C : ข้อมูลผู้บันทึก ================= -->
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  ส่วนที่ C : ข้อมูลผู้บันทึก
                </td>
              </tr>

              <tr>
                <td class="cell-label">
                  ชื่อผู้ปฏิบัติงาน / รังสีเทคนิค<span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="formC.operatorName"
                  />
                </td>
                <td class="cell-label">เวลาเริ่มตรวจ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="formC.startTime"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">หมายเหตุเพิ่มเติม</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="formC.remark"
                    placeholder="ไม่บังคับ"
                  ></textarea>
                </td>
                <td class="cell-label">เวลาสิ้นสุดการตรวจ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="formC.endTime"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่มด้านล่าง -->
        <div class="actions">
          <button type="button" class="btn-remark" @click="resetForm">
            ล้างข้อมูล
          </button>
          <button type="button" class="btn-save" @click="saveForm">
            บันทึกข้อมูล
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

/* ========= ส่วนที่ A ========= */
const formA = ref({
  examDate: '',
  examId: '',
  room: '',
  hn: '',
  patientName: '',
  gender: '',
  age: null,
  weight: null
})

/* ========= ส่วนที่ B ========= */
let rowId = 1
const createEmptyRow = () => ({
  id: rowId++,
  region: '',
  regionOther: '',
  kv: null,
  mas: null,
  ftd: null,
  tp: null,
  bucky: null,
  note: ''
})

const examRows = ref([createEmptyRow()])

const addRow = () => {
  examRows.value.push(createEmptyRow())
}

const removeRow = (index) => {
  examRows.value.splice(index, 1)
}

/* ========= ส่วนที่ C ========= */
const formC = ref({
  operatorName: '',
  startTime: '',
  endTime: '',
  remark: ''
})

/* ========= การจัดการฟอร์ม ========= */
const resetForm = () => {
  formA.value = {
    examDate: '',
    examId: '',
    room: '',
    hn: '',
    patientName: '',
    gender: '',
    age: null,
    weight: null
  }
  formC.value = {
    operatorName: '',
    startTime: '',
    endTime: '',
    remark: ''
  }
  examRows.value = [createEmptyRow()]
}

/* ตรวจสอบค่า field ที่จำเป็นแบบง่าย ๆ */
const validateForm = () => {
  const errors = []

  if (!formA.value.examDate) errors.push('กรุณากรอกวันที่ตรวจ')
  if (!formA.value.hn) errors.push('กรุณากรอก HN ผู้ป่วย')
  if (!formA.value.patientName) errors.push('กรุณากรอกชื่อ–สกุลผู้ป่วย')
  if (!formC.value.operatorName)
    errors.push('กรุณากรอกชื่อผู้ปฏิบัติงาน/รังสีเทคนิค')

  if (errors.length) {
    alert(errors.join('\n'))
    return false
  }
  return true
}

const saveForm = () => {
  if (!validateForm()) return

  const payload = {
    formA: formA.value,
    examRows: examRows.value.map((r) => ({
      ...r,
      regionResolved: r.region === 'other' ? r.regionOther : r.region
    })),
    formC: formC.value
  }

  // ตอนนี้แค่ลอง log ข้อมูล ไม่มี backend
//   console.log('F11 payload :', payload)

  // หลังบันทึกเสร็จ ย้ายไปหน้า Dashboard
  router.push('/dashboard')
}
</script>

<style scoped>
/* layout หลักเหมือนตัวอย่าง */
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

/* หัวข้อบนสุด */
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

/* แคปซูลด้านบน */
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

/* กล่องเนื้อหากลาง */
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

/* แถวหัวหลัก */
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

/* สลับสีแถว */
.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #f9fafb;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #e5e7eb;
}

.cell-label {
  width: 20%;
}

.text-center {
  text-align: center;
}

/* input ต่าง ๆ */
.input-text {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.input-number {
  max-width: 90px;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.small-textarea {
  min-height: 60px;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #4b5563;
}

/* ปุ่มลบแถว */
.btn-remove-row {
  margin-top: 6px;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.8rem;
  background: #f97373;
  color: #ffffff;
  cursor: pointer;
}

.btn-remove-row:hover {
  background: #e15858;
}

/* ปุ่มด้านล่าง */
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

.required {
  color: #dc2626;
  margin-left: 2px;
}

.mb-16 {
  margin-bottom: 16px;
}

/* responsive */
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

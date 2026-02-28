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
        <div class="pill">เวลา : {{ currentTime }}</div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const API_BASE = '/api/Xraycare'

const props = defineProps({
  currentUserName: {
    type: String,
    default: ''
  }
})

const router = useRouter()

/* ---------- โหลดผู้ใช้จาก localStorage ---------- */
const userName = ref('')
const currentUserName = computed(() =>
  userName.value || props.currentUserName || 'Demo User'
)

const currentTime = ref('')
function updateTime() {
  const d = new Date()
  currentTime.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}
let timeInterval = null

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
  } catch (e) { /* ignore */ }
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

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

const saveForm = async () => {
  if (!validateForm()) return

  const payload = {
    formType: 'F11',
    machineName: '',
    room: formA.value.room || '',
    checkDate: `${todayText.value} ${currentTime.value}`,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      formA: formA.value,
      examRows: examRows.value.map((r) => ({
        ...r,
        regionResolved: r.region === 'other' ? r.regionOther : r.region
      })),
      formC: formC.value
    })
  }

  try {
    await fetch(`${API_BASE}/SaveChecklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error('SaveChecklist error:', e)
  }

  router.push('/dashboard')
}
</script>

<style scoped>
/* Page wrapper */
.checklist-page {
  padding: 0;
}

/* Page title */
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

/* Info pills */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.pill {
  background: #f1f5f9;
  color: var(--text-secondary, #475569);
  padding: 6px 16px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border-soft, #e2e8f0);
}

/* Content panel */
.content-panel {
  background: var(--bg-card, #ffffff);
  padding: 24px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
}

/* Table wrapper */
.table-wrapper {
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  border: 1px solid var(--border-soft, #e2e8f0);
}

/* Check table */
.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.check-table td,
.check-table th {
  padding: 10px 14px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
}

.row-header-main td {
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 0.85rem;
}

.row-header-columns td {
  font-weight: 600;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
}

.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #ffffff;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #f8fafc;
}

.cell-label {
  width: 20%;
  color: var(--text-secondary, #475569);
}

.text-center {
  text-align: center;
}

/* Text inputs */
.input-text,
.input-select {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
  transition: border-color 200ms, box-shadow 200ms;
}

.input-text:focus,
.input-select:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.input-number {
  max-width: 90px;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 12px;
  font-size: 0.85rem;
  transition: border-color 200ms, box-shadow 200ms;
}

.input-textarea:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.small-textarea {
  min-height: 60px;
}

.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
}

.mb-4 { margin-bottom: 4px; }

/* Add/Remove buttons */
.btn-remove-row {
  margin-top: 8px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  border-radius: var(--radius-sm, 8px);
  padding: 5px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
}

.btn-remove-row:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* Action buttons */
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-save {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 28px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16,185,129,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16,185,129,0.4);
}

.btn-remark {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(244,63,94,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-remark:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(244,63,94,0.4);
}

/* Required field indicator */
.required {
  color: #ef4444;
}

.mb-16 {
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .check-table { min-width: 500px; }
}
@media (max-width: 640px) {
  .checklist-page { padding: 0; }
  .pill-row { gap: 6px; }
  .pill { font-size: 0.75rem; padding: 5px 12px; }
  .content-panel { padding: 12px; border-radius: 12px; }
  .actions { flex-wrap: wrap; }
  .btn-save { padding: 8px 16px; font-size: 0.8rem; width: 100%; }
  .btn-remark { padding: 8px 16px; font-size: 0.8rem; }
  .btn-add { padding: 7px 14px; font-size: 0.78rem; }
  .input-text, .input-select { font-size: 0.8rem; padding: 6px 8px; }
}
</style>

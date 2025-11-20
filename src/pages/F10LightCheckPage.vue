<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อ -->
      <h1 class="page-title">CHECKLIST</h1>

      <!-- capsule ข้อมูลเครื่อง -->
      <div class="pill-row">
        <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div>
        <div class="pill">รุ่น {{ selectedDevice.model }}</div>
        <div class="pill">ห้อง {{ selectedDevice.room }}</div>
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้ทดสอบ : {{ currentUserName }}</div>
      </div>

      <!-- กล่องฟอร์มหลัก -->
      <div class="content-panel">
        <p class="section-label">Monthly check (1 month)</p>

        <!-- หัวข้อฟอร์มตามแบบบันทึก -->
        <div class="form-header-grid">
          <div class="field-row">
            <span>วันที่ :</span>
            <input v-model="formHeader.date" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>หน่วยงาน :</span>
            <input v-model="formHeader.department" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>ประเภทเครื่องเอกซเรย์ :</span>
            <input v-model="formHeader.xrayType" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>ตำบล :</span>
            <input v-model="formHeader.tambon" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>อำเภอ :</span>
            <input v-model="formHeader.amphur" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>จังหวัด :</span>
            <input v-model="formHeader.province" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>เครื่องเอกซเรย์ :</span>
            <input v-model="formHeader.xrayName" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>Model :</span>
            <input v-model="formHeader.model" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>S/N :</span>
            <input v-model="formHeader.serial" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>สมาร์ทโฟน ยี่ห้อ :</span>
            <input v-model="formHeader.phoneBrand" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>รุ่น :</span>
            <input v-model="formHeader.phoneModel" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>Application :</span>
            <input v-model="formHeader.application" class="input-underline" type="text" />
          </div>
          <div class="field-row">
            <span>Calibration :</span>
            <input v-model="formHeader.calibration" class="input-underline" type="text" />
          </div>
        </div>

        <!-- ตารางตามแบบฟอร์ม -->
        <div class="table-wrapper mt-16">
          <table class="check-table">
            <thead>
              <tr class="row-header-columns">
                <th class="col-trial">ครั้งที่</th>
                <th>ความสว่างแสงไฟ (Iav)</th>
                <th>Background(Ibg)</th>
              </tr>
            </thead>
            <tbody>
              <!-- 3 ครั้ง แต่ละครั้งมี 3 แถวเหมือนแบบฟอร์ม -->
              <template v-for="trial in measurements" :key="trial.id">
                <tr v-for="(row, idx) in trial.rows" :key="idx">
                  <!-- ครั้งที่ แสดงเฉพาะแถวแรก แล้ว rowspan=3 -->
                  <td
                    v-if="idx === 0"
                    class="text-center"
                    :rowspan="trial.rows.length"
                  >
                    {{ trial.id }}
                  </td>
                  <td>
                    <input
                      v-model="row.iav"
                      class="cell-input"
                      type="text"
                    />
                  </td>
                  <td>
                    <input
                      v-model="row.ibg"
                      class="cell-input"
                      type="text"
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- บรรทัด I_AV, I_BG(AV), I_LBD ตามแบบฟอร์ม -->
        <div class="formula-row">
          <span>I<sub>AV</sub> :</span>
          <input v-model="iavAvg" class="input-underline small" type="text" />
          <span class="formula-space"></span>
          <span>I<sub>BG(AV)</sub> :</span>
          <input v-model="ibgAvg" class="input-underline small" type="text" />
        </div>

        <div class="formula-row mt-8">
          <span>I<sub>LBD</sub> = I<sub>AV</sub> - I<sub>BG(AV)</sub> =</span>
          <input v-model="ilbd" class="input-underline medium" type="text" />
        </div>

        <!-- ปุ่ม -->
        <div class="actions">
          <button class="btn-remark" @click="openRemarkModal">
            หมายเหตุ
          </button>
          <button class="btn-save" @click="saveForm">
            บันทึก
          </button>
        </div>
      </div>
    </div>

    <!-- Modal หมายเหตุ -->
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
          <button class="btn-cancel" @click="closeRemarkModal">
            ยกเลิก
          </button>
          <button class="btn-save-popup" @click="saveRemark">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  initial: Object,
  currentUserName: String,
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

const emit = defineEmits(['save'])
const router = useRouter()

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

/* ส่วนหัวฟอร์ม */
const formHeader = ref({
  date: '',
  department: '',
  xrayType: '',
  tambon: '',
  amphur: '',
  province: '',
  xrayName: '',
  model: '',
  serial: '',
  phoneBrand: '',
  phoneModel: '',
  application: '',
  calibration: ''
})

/* ตารางวัดความสว่าง – 3 ครั้ง ครั้งละ 3 แถว */
const measurements = ref([
  {
    id: 1,
    rows: [
      { iav: '', ibg: '' },
      { iav: '', ibg: '' },
      { iav: '', ibg: '' }
    ]
  },
  {
    id: 2,
    rows: [
      { iav: '', ibg: '' },
      { iav: '', ibg: '' },
      { iav: '', ibg: '' }
    ]
  },
  {
    id: 3,
    rows: [
      { iav: '', ibg: '' },
      { iav: '', ibg: '' },
      { iav: '', ibg: '' }
    ]
  }
])

/* ค่า I_AV, I_BG(AV), I_LBD */
const iavAvg = ref('')
const ibgAvg = ref('')
const ilbd = ref('')

/* หมายเหตุ */
const showRemarkModal = ref(false)
const remarkText = ref('')
const remarkFile = ref(null)

const remarkFileName = computed(() =>
  remarkFile.value ? remarkFile.value.name : ''
)

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
  showRemarkModal.value = false
}

/* บันทึกฟอร์ม (frontend เท่านั้น) */
const saveForm = () => {
  // const payload = {
  //   device: props.selectedDevice,
  //   date: todayText.value,
  //   user: props.currentUserName,
  //   header: formHeader.value,
  //   measurements: measurements.value,
  //   iavAvg: iavAvg.value,
  //   ibgAvg: ibgAvg.value,
  //   ilbd: ilbd.value,
  //   remark: remarkText.value
  // }
  router.push('/dashboard')

  console.log('📄 F10 Light Intensity Check payload:', payload)
  alert('บันทึกข้อมูลบนหน้าเว็บเรียบร้อย (ยังไม่ส่งเข้า backend)')
}
</script>

<style scoped>
@import '../components/Forms/_formTableCommon.css';
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
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

/* หัวฟอร์ม */
.form-header-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 6px 18px;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-underline {
  flex: 1;
  border: none;
  border-bottom: 1px solid #9ca3af;
  padding: 2px 4px;
  font-size: 0.85rem;
  outline: none;
}

.input-underline.small {
  width: 120px;
  flex: 0 0 auto;
}

.input-underline.medium {
  width: 220px;
  flex: 0 0 auto;
}

/* ตาราง */
.table-wrapper {
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table th,
.check-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
}

.check-table th:last-child,
.check-table td:last-child {
  border-right: none;
}

.row-header-columns th {
  background: #f3f4f6;
  font-weight: 600;
}

.col-trial {
  width: 70px;
}

.cell-input {
  width: 100%;
  border: none;
  padding: 2px 4px;
  outline: none;
  font-size: 0.85rem;
}

/* formula */
.formula-row {
  margin-top: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.formula-space {
  width: 24px;
}

/* ปุ่ม */
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

/* modal */
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

.mt-8 {
  margin-top: 8px;
}

.mt-12 {
  margin-top: 12px;
}

.mt-16 {
  margin-top: 16px;
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

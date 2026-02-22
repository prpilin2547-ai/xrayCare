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
          <!-- <div class="field-row">
            <span>วันที่ :</span>
            <input v-model="formHeader.date" class="input-underline" type="text" />
          </div> -->
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
                <!-- ครั้งที่ คอลัมน์หลัก 1 คอลัมน์ -->
                <th class="col-trial" rowspan="2">ครั้งที่</th>
                <!-- I_AV แบ่งเป็น 2 คอลัมน์ย่อย -->
                <th colspan="2">ความสว่างแสงไฟ (I<sub>AV</sub>)</th>
                <!-- I_BG แบ่งเป็น 2 คอลัมน์ย่อย -->
                <th colspan="2">Background (I<sub>BG</sub>)</th>
              </tr>
              <!-- <tr class="row-header-columns">
                <th>1</th>
                <th>2</th>
                <th>1</th>
                <th>2</th>
              </tr> -->
            </thead>
            <tbody>
              <!-- ครั้งที่ 1 (2 แถวย่อย) -->
              <tr>
                <!-- ผสานเซลล์ในแนวตั้ง ครอบ 2 แถว -->
                <td class="text-center" rowspan="2">1</td>
                <td>
                  <input
                    v-model="measurements[0].rows[0].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[0].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[0].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[0].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="measurements[0].rows[1].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[1].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[1].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[0].rows[1].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>

              <!-- ครั้งที่ 2 (2 แถวย่อย) -->
              <tr>
                <td class="text-center" rowspan="2">2</td>
                <td>
                  <input
                    v-model="measurements[1].rows[0].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[0].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[0].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[0].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="measurements[1].rows[1].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[1].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[1].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[1].rows[1].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>

              <!-- ครั้งที่ 3 (2 แถวย่อย) -->
              <tr>
                <td class="text-center" rowspan="2">3</td>
                <td>
                  <input
                    v-model="measurements[2].rows[0].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[0].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[0].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[0].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input
                    v-model="measurements[2].rows[1].iav1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[1].iav2"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[1].ibg1"
                    class="cell-input"
                    type="text"
                  />
                </td>
                <td>
                  <input
                    v-model="measurements[2].rows[1].ibg2"
                    class="cell-input"
                    type="text"
                  />
                </td>
              </tr>
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

          <div class="mt-2">
          <label class="form-label small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
          <input
            type="file"
            class="form-control form-control-sm"
            @change="onFileChange"
          />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import { useRouter } from 'vue-router'

const API_BASE = '/api/Xraycare'

const props = defineProps({
  initial: Object,
  selectedDevice: {
    type: Object,
    default: () => ({ name: '', model: '', room: '' })
  },
  currentUserName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save'])
const router = useRouter()

/* ---------- โหลดข้อมูลเครื่องจาก API + ผู้ใช้จาก localStorage ---------- */
const deviceInfo = ref({ name: '', model: '', room: '' })
const userName = ref('')

const selectedDevice = computed(() =>
  deviceInfo.value.name ? deviceInfo.value : props.selectedDevice
)
const currentUserName = computed(() =>
  userName.value || props.currentUserName || 'Demo User'
)

onMounted(async () => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
  } catch (e) { /* ignore */ }

  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`)
    if (res.ok) {
      const machines = await res.json()
      if (machines.length > 0) {
        const m = machines[0]
        deviceInfo.value = {
          name: m.machineName,
          model: m.machineName,
          room: m.room || ''
        }
      }
    }
  } catch (e) {
    console.error('Failed to load machines', e)
  }
})

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
const saveForm = async () => {
  const payload = {
    formType: 'F10',
    machineName: selectedDevice.value.name || '',
    room: selectedDevice.value.room || '',
    checkDate: todayText.value,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      header: formHeader.value,
      measurements: measurements.value,
      iavAvg: iavAvg.value,
      ibgAvg: ibgAvg.value,
      ilbd: ilbd.value,
      remark: remarkText.value
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

.pill-main {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  color: #6d28d9;
  font-weight: 700;
  border-color: #c4b5fd;
}

/* Content panel */
.content-panel {
  background: var(--bg-card, #ffffff);
  padding: 24px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
}

/* Section label */
.section-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin-bottom: 16px;
}

/* Form header grid */
.form-header-grid {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 6px 18px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.input-underline {
  flex: 1;
  border: none;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  padding: 4px 0;
  font-size: 0.85rem;
  transition: border-color 200ms;
  background: transparent;
}

.input-underline:focus {
  border-color: var(--purple-soft, #8b5cf6);
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

/* Table wrapper */
.table-wrapper {
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.check-table th,
.check-table td {
  padding: 10px 14px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
}

.row-header-columns th {
  font-weight: 600;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.78rem;
}

.col-trial {
  width: 70px;
}

.cell-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 8px;
  font-size: 0.85rem;
  border-radius: var(--radius-sm, 8px);
  transition: border-color 200ms;
}

.cell-input:focus {
  border-color: var(--purple-soft, #8b5cf6);
  outline: none;
}

/* Formula row */
.formula-row {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 8px;
}

.formula-space {
  width: 24px;
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

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 20px);
  padding: 24px;
  width: 430px;
  max-width: 92%;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: var(--text-secondary, #475569);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
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
  border-color: var(--purple-soft, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
  outline: none;
}

.form-control,
.form-control-sm {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary, #475569);
}

.mb-1 { margin-bottom: 4px; }
.mt-2 { margin-top: 8px; }
.mt-8 { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }

.file-name {
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background: #f8fafc;
  color: var(--text-main, #0f172a);
}

.btn-save-popup {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
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

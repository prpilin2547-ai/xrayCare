<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว (F9)</h1>

      <!-- แคปซูลด้านบน -->
      <div class="pill-row">
        <div class="pill">
          วันที่ : {{ todayText }}
        </div>
        <div class="pill">
          ผู้บันทึก : {{ currentUserName }}
        </div>
      </div>

      <!-- กล่องเนื้อหาหลัก -->
      <div class="content-panel">
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <!-- หัวตารางหลัก -->
              <tr class="row-header-main">
                <td :colspan="items.length + 1" class="text-center">
                  แบบบันทึก F9 : แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว
                </td>
              </tr>

              <!-- แถวหัวคอลัมน์: รายการ / อุปกรณ์ -->
              <tr class="row-header-columns">
                <td>รายการ</td>
                <td
                  v-for="(item, index) in items"
                  :key="item.id"
                  class="text-center header-device-cell"
                >
                  <div>อุปกรณ์ที่ {{ index + 1 }}</div>
                  <div class="header-device-sub">
                    <button
                      v-if="items.length > 1"
                      type="button"
                      class="btn-remove-device"
                      @click="removeItem(index)"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>

              <!-- ===== ส่วนที่ 1: ข้อมูลอุปกรณ์ ===== -->
              <tr class="row-section">
                <td :colspan="items.length + 1">ส่วนที่ 1 : ข้อมูลอุปกรณ์</td>
              </tr>

              <!-- ประเภทการตรวจ -->
              <tr>
                <td class="cell-label">
                  ประเภทการตรวจ
                  <div class="field-caption">เลือกวิธีการตรวจสอบ</div>
                </td>
                <td v-for="item in items" :key="item.id + '-inspectType'">
                  <select
                    v-model="item.inspectType"
                    class="input-select"
                  >
                    <option value="" disabled>-- เลือกประเภทการตรวจ --</option>
                    <option value="visual">ตรวจภายนอกด้วยสายตา</option>
                    <option value="xray">ตรวจภายในด้วยรังสีเอกซ์</option>
                  </select>
                </td>
              </tr>

              <!-- หมายเลขอุปกรณ์ -->
              <tr>
                <td class="cell-label">
                  หมายเลขอุปกรณ์
                  <div class="field-caption">เช่น รหัสครุภัณฑ์ หรือหมายเลขกำกับ</div>
                </td>
                <td v-for="item in items" :key="item.id + '-deviceNumber'">
                  <input
                    type="text"
                    class="input-text"
                    v-model="item.deviceNumber"
                    placeholder="กรอกหมายเลขอุปกรณ์"
                  />
                </td>
              </tr>

              <!-- ชนิดอุปกรณ์ -->
              <tr>
                <td class="cell-label">ชนิดอุปกรณ์</td>
                <td v-for="item in items" :key="item.id + '-deviceType'">
                  <select
                    v-model="item.deviceType"
                    class="input-select"
                  >
                    <option value="" disabled>-- เลือกชนิดอุปกรณ์ --</option>
                    <option value="leadApron">เสื้อตะกั่ว</option>
                    <option value="radiationCloth">ผ้ากันรังสี</option>
                    <option value="collar">ปลอกคอ</option>
                    <option value="other">อื่น ๆ</option>
                  </select>
                </td>
              </tr>

              <!-- อายุการใช้งาน -->
              <tr>
                <td class="cell-label">
                  อายุการใช้งาน (ปี)
                  <div class="field-caption">ระบุจำนวนปีตั้งแต่เริ่มใช้งาน</div>
                </td>
                <td v-for="item in items" :key="item.id + '-yearsUsed'">
                  <input
                    type="number"
                    min="0"
                    class="input-text"
                    v-model.number="item.yearsUsed"
                    placeholder="จำนวนปี"
                  />
                </td>
              </tr>

              <!-- วันที่ตรวจสอบ -->
              <tr>
                <td class="cell-label">วันที่ตรวจสอบ</td>
                <td v-for="item in items" :key="item.id + '-inspectDate'">
                  <input
                    type="date"
                    class="input-text"
                    v-model="item.inspectDate"
                  />
                </td>
              </tr>

              <!-- ===== ส่วนที่ 2: ผลการตรวจสอบ ===== -->
              <tr class="row-section">
                <td :colspan="items.length + 1">ส่วนที่ 2 : ผลการตรวจสอบ</td>
              </tr>

              <!-- ชนิดของความเสียหาย -->
              <tr>
                <td class="cell-label">ชนิดของความเสียหาย</td>
                <td v-for="item in items" :key="item.id + '-damageType'">
                  <select
                    v-model="item.damageType"
                    class="input-select"
                  >
                    <option value="" disabled>-- เลือกชนิดความเสียหาย --</option>
                    <option value="none">ไม่พบความเสียหาย</option>
                    <option value="crack">รอยหัก</option>
                    <option value="fracture">รอยแตก</option>
                    <option value="hole">รูทะลุ</option>
                    <option value="seamSplit">เส้นรอยต่อแยก</option>
                    <option value="other">อื่น ๆ</option>
                  </select>
                </td>
              </tr>

              <!-- ตำแหน่งที่พบ -->
              <tr>
                <td class="cell-label">
                  ตำแหน่งที่พบความเสียหาย
                  <div class="field-caption">
                    เช่น บริเวณไหล่ ซีกซ้าย ด้านใน เป็นต้น
                  </div>
                </td>
                <td v-for="item in items" :key="item.id + '-damagePosition'">
                  <input
                    type="text"
                    class="input-text"
                    v-model="item.damagePosition"
                    placeholder="ระบุตำแหน่งที่พบ (ถ้ามี)"
                  />
                </td>
              </tr>

              <!-- ขนาดของความเสียหาย -->
              <tr>
                <td class="cell-label">
                  ขนาดของความเสียหาย
                  <div class="field-caption">
                    เช่น ความยาว x ความกว้าง (ซม.)
                  </div>
                </td>
                <td v-for="item in items" :key="item.id + '-damageSize'">
                  <input
                    type="text"
                    class="input-text"
                    v-model="item.damageSize"
                    placeholder="เช่น 1 x 0.5 ซม."
                  />
                </td>
              </tr>

              <!-- ===== ส่วนที่ 3: การจัดเก็บและเจ้าหน้าที่ ===== -->
              <tr class="row-section">
                <td :colspan="items.length + 1">
                  ส่วนที่ 3 : การจัดเก็บและเจ้าหน้าที่
                </td>
              </tr>

              <!-- วิธีการจัดเก็บ -->
              <tr>
                <td class="cell-label">วิธีการจัดเก็บ</td>
                <td v-for="item in items" :key="item.id + '-storageMethod'">
                  <select
                    v-model="item.storageMethod"
                    class="input-select"
                  >
                    <option value="" disabled>-- เลือกวิธีการจัดเก็บ --</option>
                    <option value="hang">แขวน</option>
                    <option value="flat">วางราบ</option>
                    <option value="specialCabinet">ตู้เก็บพิเศษ</option>
                  </select>
                </td>
              </tr>

              <!-- ชื่อผู้ตรวจสอบ/ผู้บันทึก -->
              <tr>
                <td class="cell-label">ชื่อผู้ตรวจสอบ / ผู้บันทึก</td>
                <td v-for="item in items" :key="item.id + '-inspectorName'">
                  <input
                    type="text"
                    class="input-text"
                    v-model="item.inspectorName"
                    placeholder="กรอกชื่อผู้ตรวจสอบ / ผู้บันทึก"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่มเพิ่ม/ลบ และบันทึก -->
        <div class="actions actions-with-add">
          <button type="button" class="btn-add" @click="addItem">
            + เพิ่มอุปกรณ์
          </button>

          <div class="actions-right">
            <button type="button" class="btn-save" @click="saveChecklist">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
  } catch (e) { /* ignore */ }
})

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

let runningId = 1
const createEmptyItem = () => ({
  id: `item-${runningId++}`,
  inspectType: '',
  deviceNumber: '',
  deviceType: '',
  yearsUsed: null,
  inspectDate: '',
  damageType: '',
  damagePosition: '',
  damageSize: '',
  storageMethod: '',
  inspectorName: props.currentUserName || ''
})

const items = ref([createEmptyItem()])

const addItem = () => {
  items.value.push(createEmptyItem())
}

const removeItem = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

const saveChecklist = async () => {
  const payload = {
    formType: 'F9',
    machineName: '',
    room: '',
    checkDate: todayText.value,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      items: items.value
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
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  color: #0369A1;
  font-weight: 700;
  border-color: #7DD3FC;
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

.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns):not(.row-section) {
  background: #ffffff;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns):not(.row-section) {
  background: #f8fafc;
}

.cell-label {
  width: 28%;
  color: var(--text-secondary, #475569);
}

/* Section header rows */
.row-section td {
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  font-weight: 600;
  border-bottom: 1px solid #7dd3fc;
}

/* Field caption under labels */
.field-caption {
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 4px;
}

/* Device column headers */
.header-device-cell {
  min-width: 160px;
}

.header-device-sub {
  margin-top: 4px;
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

/* Action buttons */
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.actions-with-add {
  align-items: center;
}

.actions-right {
  margin-left: auto;
  display: flex;
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

.btn-add {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 8px 20px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(3,105,161,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3,105,161,0.4);
}

.btn-remove-device {
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

.btn-remove-device:hover {
  background: #fee2e2;
  border-color: #fca5a5;
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

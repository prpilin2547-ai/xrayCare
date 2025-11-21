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

const saveChecklist = () => {
  // ในที่นี้แค่ console.log แทนการส่ง backend
  console.log('บันทึกแบบฟอร์ม F9', {
    date: todayText.value,
    recorder: props.currentUserName,
    items: items.value
  })

  // เมื่อกดบันทึกให้เด้งไปหน้า Dashboard
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

/* หัวข้อหน้า */
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
  color: #047857;
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
.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns):not(.row-section) {
  background: #f9fafb;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns):not(.row-section) {
  background: #e5e7eb;
}

.cell-label {
  width: 28%;
}

/* แถวหัวแต่ละส่วน */
.row-section td {
  background: #e0f2fe;
  font-weight: 600;
  border-bottom: 1px solid #bfdbfe;
}

/* ข้อความอธิบายใต้หัวข้อ */
.field-caption {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
}

/* หัวคอลัมน์ของแต่ละอุปกรณ์ */
.header-device-cell {
  min-width: 160px;
}

.header-device-sub {
  margin-top: 4px;
}

/* input / select */
.input-text,
.input-select {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
  background: #ffffff;
}

/* ปุ่มด้านล่าง */
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.actions-with-add {
  align-items: center;
}

.actions-right {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

/* ปุ่มต่าง ๆ */
.btn-save,
.btn-add {
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-save {
  background: #65d46e;
  color: #ffffff;
}

.btn-save:hover {
  background: #4fb759;
}

.btn-add {
  background: #ffb480;
  color: #111827;
}

.btn-add:hover {
  background: #f59e63;
}

/* ปุ่มลบอุปกรณ์ในหัวคอลัมน์ */
.btn-remove-device {
  border: none;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  background: #f87171;
  color: #ffffff;
}

.btn-remove-device:hover {
  background: #ef4444;
}

/* Popup / field-label จากสไตล์เดิม (เผื่อใช้ต่อ) */
.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
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

  .header-device-cell {
    min-width: 120px;
  }
}
</style>

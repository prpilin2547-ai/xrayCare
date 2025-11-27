<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="3" class="text-center">
              แบบบันทึก F3 : การควบคุมคุณภาพของภาพ (Display monitor)
            </td>
          </tr>

          <!-- หัวตารางรวม -->
          <tr class="row-header-columns">
            <td>รายการตรวจสอบ</td>
            <td class="text-center">Pass (P)</td>
            <td class="text-center">Fail (F)</td>
          </tr>

          <!-- 1) คุณภาพของภาพพิมพ์โดยทั่วไป -->
          <tr class="row-section-title">
            <td colspan="3">คุณภาพของภาพพิมพ์โดยทั่วไป</td>
          </tr>
          <tr v-for="item in form.qualityItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- 2) ความคมชัดเบื้องต้น -->
          <tr class="row-section-title">
            <td colspan="3">ความบิดเบือนทั่วไป</td>
          </tr>
          <tr v-for="item in form.sharpnessItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- 3) ความส่องสว่าง (Luminance) -->
          <tr class="row-section-title">
            <td colspan="3">ความส่องสว่าง (Luminance)</td>
          </tr>
          <tr v-for="item in form.luminanceItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- 4) กลุ่มวัตถุทดสอบความชัดเจนเล็กๆ ของเห็นได้ -->
          <tr class="row-section-title">
            <td colspan="3">
              กลุ่มวัตถุทดสอบความชัดเจนเล็กๆ ของเห็นได้
              (ในมุมทั้ง 4 และตรงกลางของภาพ)
            </td>
          </tr>
          <tr v-for="item in form.objectGroupItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- 5) จำนวนวัตถุชิ้นขาวที่มองเห็น -->
          <tr class="row-section-title">
            <td colspan="3">
              จำนวนวัตถุชิ้นขาวที่มองเห็น
              (อย่างน้อย 11 ตัว หรืออ่านได้ถึง "QUALITY CONT")
            </td>
          </tr>
          <tr v-for="item in form.whiteObjectItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- 6) ลูกกลิ้งของเครื่องพิมพ์ -->
          <tr class="row-section-title">
            <td colspan="3">ลูกกลิ้งของเครื่องพิมพ์</td>
          </tr>
          <tr v-for="item in form.rollerItems" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- หมายเหตุ + ปุ่มด้านล่าง -->
    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุ (F3)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="กรอกรายละเอียดเพิ่มเติม..."
        ></textarea>

        <div class="mt-2">
          <label class="form-label text-small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
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

      <button
        v-if="isSixMonthsFromLast"
        class="btn btn-warning"
        @click="submitNext"
      >
        ถัดไป
      </button>

      <button
        v-else
        class="btn btn-warning"
        @click="submitNext"
      >
        ถัดไป
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String,
  // วันที่บันทึกล่าสุดของหน้า F3 เช่น '2025-01-01'
  lastRecordDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['next'])

const defaultForm = () => ({
  date: '',
  tester: props.currentUserName || '',

  // 1) คุณภาพของภาพพิมพ์โดยทั่วไป
  qualityItems: [
    { id: 'q-smear', label: 'ภาพไม่มีลายเปื้อน (Smear)', result: '' },
    { id: 'q-noArtifact', label: 'ไม่มีสิ่งแปลกปลอม', result: '' },
    { id: 'q-ramp', label: 'ภาพลดหลั่น (ramp) แบบต่อเนื่อง', result: '' }
  ],

  // 2) ความบิดเบือนทั่วไป
  sharpnessItems: [
    { id: 's-line', label: 'เส้นตรงต่อเนื่อง', result: '' },
    { id: 's-square', label: 'กรอบหรือช่องเป็นสี่เหลี่ยม', result: '' }
  ],

  // 3) ความส่องสว่าง (Luminance)
  luminanceItems: [
    { id: 'l-greyAll', label: 'กรอบที่มีระดับสีเทาวางซ้อนกัน', result: '' },
    { id: 'l-5pct', label: 'กรอบสีเทา 5% มองเห็นในพื้น', result: '' },
    { id: 'l-0pct', label: 'กรอบสีเทา 0%', result: '' },
    { id: 'l-95pct', label: 'กรอบสีเทา 95% มองเห็นในพื้น', result: '' },
    { id: 'l-100pct', label: 'กรอบสีเทา 100%', result: '' }
  ],

  // 4) กลุ่มวัตถุคอนทราสสูงขนาดเล็กสุดมองเห็นได้(ในมุมทั้ง 4 และตรงกลางของภาพ)
  objectGroupItems: [
    { id: 'o-outer', label: 'กลุ่มเส้นคู่แนวนอน', result: '' },
    { id: 'o-inner', label: 'กลุ่มเส้นคู่แนวตั้ง', result: '' },
  
  ],

  // 5) จำนวนตัวอักษรที่มองเห็น(อย่างน้อย 11 ตัว หรืออ่านได้ถึง "QUALITY CONT")
  whiteObjectItems: [
    { id: 'w-dark', label: 'ในพื้นที่มืด (Dark)', result: '' },
    { id: 'w-mid', label: 'ในพื้นที่ที่ระดับสีเทากลาง (Mid-grey)', result: '' },
    { id: 'w-light', label: 'ในพื้นที่สว่าง (Light)', result: '' }
  ],

  // 6) ลูกกลิ้งของเครื่องพิมพ์
  rollerItems: [
    { id: 'r-stick', label: 'ทำความสะอาด(ถ้าจำเป็น)', result: '' },
   
  ],

  remark: '',
  file: null,
  fileName: ''
})

const form = ref(props.initial || defaultForm())

const attachmentFileName = computed(() => form.value.fileName || '')

// ---------- เช็คครบ 6 เดือนจากวันที่บันทึกล่าสุด ----------
const lastDate = computed(() => {
  if (props.lastRecordDate) {
    return new Date(props.lastRecordDate)
  }
  return null
})

const currentCheckDate = computed(() => {
  if (form.value.date) {
    return new Date(form.value.date)
  }
  return new Date()
})

const isSixMonthsFromLast = computed(() => {
  const start = lastDate.value
  const current = currentCheckDate.value

  if (!start) return false

  const monthsDiff =
    (current.getFullYear() - start.getFullYear()) * 12 +
    (current.getMonth() - start.getMonth())

  return monthsDiff >= 0 && monthsDiff % 6 === 0
})

// ---------- อัพโหลดไฟล์ ----------
const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.file = file || null
  form.value.fileName = file ? file.name : ''
}

// กดปุ่ม (ทั้ง "ถัดไป" และ "บันทึก" ใช้ handler เดียว)
const submitNext = () => {
  emit('next', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';

.content-panel {
  background: #ffffff;
  padding: 18px 22px 22px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

.table-wrapper {
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
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

.row-section-title td {
  font-weight: 600;
  background: #e5e7eb;
}

/* สลับสีแถวข้อมูล (ไม่รวมหัวฟ้า / หัวคอลัมน์ / หัว section) */
.check-table
  tr:nth-child(odd):not(.row-header-main):not(.row-header-columns):not(
    .row-section-title
  ) {
  background: #f9fafb;
}
.check-table
  tr:nth-child(even):not(.row-header-main):not(.row-header-columns):not(
    .row-section-title
  ) {
  background: #e5e7eb33;
}

.cell-label {
  width: 70%;
}

.text-center {
  text-align: center;
}

.input-cell {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  padding: 4px 6px;
  font-size: 0.85rem;
  box-sizing: border-box;
}

/* remark + ปุ่ม */
.remark-actions {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
}

.remark-box {
  flex: 1;
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
  margin-top: 4px;
}

.file-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .remark-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

.text-small {
  font-size: 0.875em;
}
</style>

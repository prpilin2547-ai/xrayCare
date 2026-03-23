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

        <div class="file-attach-wrap mt-2">
          <label class="form-label text-small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
          <input type="file" accept="image/*" class="form-control form-control-sm" @change="onFileChange" />
          <div v-if="attachmentFileName" class="file-info mt-1">
            <span v-if="attachmentImageData" class="file-link" @click="openFilePreview(attachmentImageData)">{{ attachmentFileName }}</span>
            <span v-else class="file-label">{{ attachmentFileName }}</span>
            <button type="button" class="file-remove" @click="clearAttachment($event)">×</button>
          </div>
          <div v-if="attachmentImageData" class="img-preview-wrap mt-2">
            <img :src="attachmentImageData" alt="Preview" class="img-preview" />
          </div>
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

    <div v-if="showFilePreviewModal" class="file-modal-overlay" @click.self="closeFilePreview">
      <div class="file-modal-card">
        <div class="file-modal-header">
          <h5 class="file-modal-title">ไฟล์รูปภาพ</h5>
          <button type="button" class="file-modal-close" @click="closeFilePreview"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="file-modal-body">
          <img v-if="previewImageSrc" :src="previewImageSrc" alt="Preview" class="file-modal-img" />
          <p class="file-modal-caption">รูปภาพที่แนบมาพร้อมรายการ</p>
        </div>
      </div>
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
const attachmentImageData = ref('')
const showFilePreviewModal = ref(false)
const previewImageSrc = ref('')

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.file = file
  form.value.fileName = file.name
  const reader = new FileReader()
  reader.onload = (ev) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const maxSize = 800
      let w = img.width, h = img.height
      if (w > h) { if (w > maxSize) { h = (h * maxSize) / w; w = maxSize } }
      else { if (h > maxSize) { w = (w * maxSize) / h; h = maxSize } }
      canvas.width = w; canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)
      attachmentImageData.value = canvas.toDataURL('image/jpeg', 0.7)
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

const clearAttachment = (event) => {
  if (event) event.stopPropagation()
  form.value.file = null
  form.value.fileName = ''
  attachmentImageData.value = ''
}

const openFilePreview = (src) => {
  if (!src) return
  previewImageSrc.value = src
  showFilePreviewModal.value = true
}

const closeFilePreview = () => {
  showFilePreviewModal.value = false
  previewImageSrc.value = ''
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

.file-attach-wrap { position: relative; }
.file-info { display: inline-flex; align-items: center; gap: 6px; }
.file-link { text-decoration: underline; cursor: pointer; color: #0EA5E9; font-size: 0.85rem; }
.file-link:hover { color: #0369A1; }
.file-label { font-size: 0.85rem; color: #475569; }
.file-remove { border: none; background: none; color: #94a3b8; font-size: 18px; line-height: 1; cursor: pointer; }
.file-remove:hover { color: #dc2626; }
.img-preview-wrap { display: flex; }
.img-preview { max-width: 260px; max-height: 200px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.file-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(6px); z-index: 2070; display: flex; align-items: center; justify-content: center; padding: 20px; }
.file-modal-card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 56px rgba(0,0,0,0.22); max-width: 90vw; max-height: 90vh; width: 100%; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.file-modal-header { background: #198754; color: #fff; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; }
.file-modal-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
.file-modal-close { width: 36px; height: 36px; border: none; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; }
.file-modal-close:hover { background: rgba(255,255,255,0.3); }
.file-modal-body { padding: 24px; background: #f8fafc; min-height: 200px; max-height: calc(90vh - 120px); overflow: auto; display: flex; flex-direction: column; align-items: center; }
.file-modal-img { max-width: 100%; max-height: min(400px, 60vh); border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 16px; }
.file-modal-caption { margin: 0; font-size: 0.9rem; color: #64748b; }
</style>

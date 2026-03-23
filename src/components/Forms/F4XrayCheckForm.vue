<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="4" class="text-center">
              แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์ (ทุก 3 เดือน)
            </td>
          </tr>

          <!-- header info -->
          <!-- <tr>
            <td class="cell-label">เครื่องเอกซเรย์ที่ห้อง</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.room"
                class="input-cell"
                placeholder="เช่น ห้อง X-ray 1"
              />
            </td>
          </tr> -->
          <tr>
            <!-- <td class="cell-label">รุ่น</td>
            <td>
              <input type="text" v-model="form.model" class="input-cell" />
            </td> -->
            <!-- <td class="cell-label small">วันที่</td>
            <td>
              <input type="date" v-model="form.date" class="input-cell" />
            </td> -->
          </tr>
          <!-- <tr>
            <td class="cell-label">ผู้ทดสอบ</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.tester"
                class="input-cell"
                :placeholder="currentUserName"
              />
            </td>
          </tr> -->

          <tr class="row-header-columns">
            <td style="width: 40px">ลำดับที่</td>
            <td>รายการตรวจสอบ</td>
            <td class="text-center" style="width: 70px">ผ่าน (✓)</td>
            <td class="text-center" style="width: 180px">หมายเหตุ</td>
          </tr>

          <tr v-for="item in form.items" :key="item.id">
            <td class="text-center">{{ item.order }}</td>
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input type="checkbox" v-model="item.pass" />
            </td>
            <td>
              <input
                type="text"
                v-model="item.remark"
                class="input-cell"
                placeholder="ระบุถ้ามีข้อสังเกต"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- หมายเหตุ + ถัดไป -->
    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F4)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="สรุปผลการตรวจ / ข้อเสนอแนะ..."
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

        <p class="footnote">
          * ในระบบ DR ให้ทวนสอบค่าทางเทคนิคว่าถูกต้องเป็นปัจจุบัน<br />
          ** ไม่ต้องทดสอบสำหรับเครื่องเอกซเรย์เคลื่อนที่
        </p>
      </div>

      <button class="btn-next" @click="submitNext">
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
  currentUserName: String
})

const emit = defineEmits(['next'])

const defaultForm = () => ({
  room: '',
  model: '',
  date: '',
  tester: props.currentUserName || '',
  items: [
    {
      id: '1',
      order: 1,
      label:
        'สภาพสายไฟฟ้าไม่มีรอยแตก บิดงอหรือเป็นปมสาย และไม่ถูกอุปกรณ์ที่มีน้ำหนักกดทับสาย',
      pass: false,
      remark: ''
    },
    {
      id: '2',
      order: 2,
      label:
        'ระบบอินเตอร์ล็อคและเบรกทำงานอย่างถูกต้อง',
      pass: false,
      remark: ''
    },
    {
      id: '3',
      order: 3,
      label:
        'การเคลื่อนที่ของ เตียง หัวหลอดเอกชเรย์ และบัคกี้ เป็นไปอย่างราบรื่น',
      pass: false,
      remark: ''
    },
    {
      id: '4',
      order: 4,
      label:
        'สวิตช์แผงควบคุม ไฟแสดงสถานะต่างๆ และมิเตอร์แสดงค่าทางเทคนิคทำงานและมองเห็นอย่างชัดเจน',
      pass: false,
      remark: ''
    },
    {
      id: '5',
      order: 5,
      label:
        'แสงไฟจากคอลลิเมเตอร์มีความเข้มแสงเพียงพอต่อการปฏิบัติงานในขณะที่เปิดไฟห้องปฏิบัติการ และคอลลิเมเตอร์ปราศจากฝุ่น',
      pass: false,
      remark: ''
    },
    {
      id: '6',
      order: '6*',
      label:
        'มีแผนภูมิค่าทางเทคนิคที่ใช้อยู่ในปัจจุบันแสดงอยู่ใกล้แผงควบคุม',
      pass: false,
      remark: ''
    },
    {
      id: '7',
      order: 7,
      label:
        'ไม่มีน้ำมันระบายความร้อนรั่วรอบหลอดเอกซเรย์ ถังเครื่องกำเนิดไฟฟ้าแรงสูง และปราศจากฝุ่น',
      pass: false,
      remark: ''
    },
    {
      id: '8',
      order: 8,
      label: 'แผ่นรับภาพสะอาดและปราศจากสิ่งแปลกปลอม',
      pass: false,
      remark: ''
    },
    {
      id: '9',
      order: 9,
      label:
        'บนเวิร์กสเตชัน ให้แสดงภาพทางคลินิกล่าสุด ในภาพตรวจสอบเวลาและวันที่ รวมถึงการระบุสถานที่ และคำอธิบายประกอบอื่นๆถูกต้อง',
      pass: false,
      remark: ''
    },
    {
      id: '10',
      order: 10,
      label:
        'ที่หลอดเอกซเรย์และเครื่องกำเนิดไฟฟ้ามีป้ายบอกรุ่น หมายเลขซีเรียลอ่านได้ชัดเจน หรือมีการบันทึกเก็บไว้เป็นเอกสารคุณภาพ',
      pass: false,
      remark: ''
    },
    {
      id: '11',
      order: 11,
      label:
        'อุปกรณ์ป้องกันรังสี เช่น เสื้อตะกั่ว ไทรอยด์ชิลด์ อุปกรณ์กำบังรังสืบริเวณอวัยวะสืบพันธุ์ ไม่ชำรุดหรือฉีกขาดสะอาดและมีการจัดเก็บอย่างเหมาะสม',
      pass: false,
      remark: ''
    },
    {
      id: '12',
      order: '12**',
      label:
        'สามารถมองเห็นผู้ป่วยจากห้องควบคุมโดยไม่มีสิ่งกีดขวางบดบังผ่านจากช่องมองกระจก หรือมีระบบกล้องวงจรปิด',
      pass: false,
      remark: ''
    },
    {
      id: '13',
      order: '13**',
      label:
        'ป้ายและสัญลักษณ์เตือนภัยทางรังสีติดหน้าประตูและไฟเตือนขณะฉายรังสีหน้าห้องปฏิบัติการ',
      pass: false,
      remark: ''
    },
    {
      id: '14',
      order: '14**',
      label: 'ช่องหรือบักกี้ใส่คาสเซทและตัวล็อคทำงานปกติ',
      pass: false,
      remark: ''
    },
    {
      id: '15',
      order: '15**',
      label:
        'ศูนย์กลางลำรังสีกับเตียง ตัวเลขบอกระยะ SID หรือขนาดแสงไฟ ถูกต้อง',
      pass: false,
      remark: ''
    }
  ],
  remark: '',
  file: null,
  fileName: ''
})

const form = ref(props.initial || defaultForm())

const attachmentFileName = computed(() => form.value.fileName || '')

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

const submitNext = () => {
  emit('next', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';
/* ใช้ไฟล์รวม หรือคัดลอก style จาก F3 ก็ได้
   ถ้าไม่ใช้ @import ก็สามารถคัดลอก style จาก F3 มาได้เหมือนกัน */
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

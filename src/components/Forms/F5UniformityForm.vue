<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="3" class="text-center">
              แบบบันทึก F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)
            </td>
          </tr>

          <tr>
            <td class="cell-label">หมายเลขของแผ่นรับภาพ</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.cassetteNumber"
                class="input-cell"
              />
            </td>
          </tr>

          <tr class="row-header-columns">
            <td>ค่าขอบเขต / เกณฑ์ที่ต้องได้</td>
            <td class="text-center">Y</td>
            <td class="text-center">N</td>
          </tr>

          <tr v-for="item in form.criteria" :key="item.id">
            <td class="cell-label">{{ item.label }}</td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5c-${item.id}`"
                value="Y"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5c-${item.id}`"
                value="N"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- <tr>
            <td class="cell-label">วันที่</td>
            <td colspan="2">
              <input type="date" v-model="form.date" class="input-cell" />
            </td>
          </tr>
          <tr>
            <td class="cell-label">ผู้ทดสอบ</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.tester"
                class="input-cell"
                :placeholder="currentUserName"
              />
            </td>
          </tr> -->

          <tr class="row-header-columns">
            <td>การประเมินภาพ</td>
            <td class="text-center">Y</td>
            <td class="text-center">N</td>
          </tr>

          <tr v-for="item in form.imageChecks" :key="item.id">
            <td class="cell-label">{{ item.label }}</td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5i-${item.id}`"
                value="Y"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5i-${item.id}`"
                value="N"
                v-model="item.result"
              />
            </td>
          </tr>

          <tr>
            <td class="cell-label">ข้อคิดเห็น-ความดำ (heel effect etc?)</td>
            <td colspan="2">
              <input type="text" v-model="form.comment" class="input-cell" />
            </td>
          </tr>
          <tr>
            <td class="cell-label">การแก้ไข (ถ้าเป็นไปได้)</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.correction"
                class="input-cell"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F5)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="สรุปผลการประเมินภาพ..."
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
  cassetteNumber: '',
  criteria: [
    { id: 'uniform', label: 'ภาพปรากฏสม่ำเสมอ', result: '' },
    { id: 'noArtifact', label: 'ไม่มีสิ่งแปลกปลอม', result: '' }
  ],
  date: '',
  tester: props.currentUserName || '',
  imageChecks: [
    { id: 'uniformSeen', label: 'ภาพปรากฏสม่ำเสมอหรือไม่? (Y/N)', result: '' },
    { id: 'artifactSeen', label: 'มีสิ่งแปลกปลอมหรือไม่? (Y/N)', result: '' },
    { id: 'abnormal', label: 'อธิบายสิ่งแปลกปลอมหรือความผิดปกติ', result: '' }
  ],
  comment: '',
  correction: '',
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

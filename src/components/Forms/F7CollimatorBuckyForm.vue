<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        แบบบันทึก F7-2 : การทดสอบ Collimator and Beam Alignment <br/> 
        สำหรับ กรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)
      </h5>

      <!-- ขนาดหลอด (เลือกได้ 1 อัน) -->
      <div class="border rounded-3 p-3 mb-3">
        <div class="form-check small" v-for="opt in tubeSizeOptions" :key="opt.value">
          <input
            class="form-check-input"
            type="radio"
            :id="`tubeSize-${opt.value}`"
            :value="opt.value"
            v-model="form.tubeSize"
          />
          <label class="form-check-label" :for="`tubeSize-${opt.value}`">
            {{ opt.label }}
          </label>
        </div>

        <hr class="my-2" />

        <!-- วิธีทดสอบ (เลือกได้ 1 อัน) -->
        <div class="form-check small" v-for="opt in testMethodOptions" :key="opt.value">
          <input
            class="form-check-input"
            type="radio"
            :id="`testMethod-${opt.value}`"
            :value="opt.value"
            v-model="form.testMethod"
          />
          <label class="form-check-label" :for="`testMethod-${opt.value}`">
            {{ opt.label }}
          </label>
        </div>
      </div>

      <!-- ตารางความเหลื่อมล้ำ -->
      <div class="mb-1 small">
        ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 2 cm หรือ 2% ที่ SID 100 cm)<br />
        + หมายถึงลำรังสีมีขนาดใหญ่กว่าขอบเขตจริง  - หมายถึงลำรังสีมีขนาดเล็กกว่าขอบเขตจริง
      </div>

      <div class="table-responsive mb-3">
        <table class="table table-bordered align-middle small mb-0">
          <thead class="table-light text-center">
            <tr>
              <th class="w-50 text-start">ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ</th>
              <th class="w-10">Pass</th>
              <th class="w-10">Fail</th>
              <th class="w-30"><em>Note</em></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in form.lightMismatch" :key="row.id">
              <td>
                <div class="d-flex align-items-center justify-content-between gap-2">
                  <span>{{ row.label }}</span>
                  <div class="input-group input-group-sm" style="max-width: 140px;">
                    <input
                      v-model="row.value1"
                      type="text"
                      class="form-control form-control-sm text-end"
                    />
                    <span class="input-group-text small">cm</span>
                  </div>
                </div>
              </td>

              <td class="text-center">
                <input type="checkbox" class="form-check-input" v-model="row.pass" />
              </td>
              <td class="text-center">
                <input type="checkbox" class="form-check-input" v-model="row.fail" />
              </td>

              <td>
                <input
                  v-model="row.note"
                  type="text"
                  class="form-control form-control-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Beam Alignment -->
      <div class="mt-3 mb-1 small">
        Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
      </div>

      <div class="table-responsive mb-3">
        <table class="table table-bordered align-middle small mb-0">
          <thead class="table-light text-center">
            <tr>
              <th class="w-25">Beam Alignment</th>
              <th class="w-10">Pass</th>
              <th class="w-10">Fail</th>
              <th class="w-55"><em>Note</em></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in form.beamAlignment" :key="row.id">
              <td>
                <span>{{ row.label }}</span>
              </td>

              <td class="text-center">
                <input type="checkbox" class="form-check-input" v-model="row.pass" />
              </td>

              <td class="text-center">
                <input type="checkbox" class="form-check-input" v-model="row.fail" />
              </td>

              <td>
                <input
                  v-model="row.note"
                  type="text"
                  class="form-control form-control-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- หมายเหตุ + ปุ่ม ถัดไป (ใต้ textarea, ขวาสุด) -->
      <div class="mt-3">
        <label class="form-label small mb-1">หมายเหตุ</label>
        <textarea
          v-model="form.remark"
          rows="2"
          class="form-control form-control-sm mb-3"
          placeholder="บันทึกรายละเอียดเพิ่มเติม..."
        ></textarea>
        <div class="file-attach-wrap mt-2">
          <label class="form-label small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
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
      <br>

        <div class="d-flex justify-content-end">
          <button class="btn btn-warning btn-sm fw-semibold" @click="submitNext">
            ถัดไป
          </button>
        </div>
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
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String
})
const emit = defineEmits(['next'])

const tubeSizeOptions = [
  { value: 'small', label: 'หลอดใส่เล็ก' },
  { value: 'large', label: 'หลอดใส่ใหญ่' }
]

const testMethodOptions = [
  { value: 'tool', label: 'ทดสอบโดย Collimator/Beam alignment test tool' },
  { value: 'coins', label: 'ทดสอบโดย Coins for x-ray to light-beam alignment test' }
]

const defaultLightMismatch = () => [
  { id: 'anode', label: 'ด้านแอโนด', value1: '', pass: false, fail: false, note: '' },
  { id: 'cathode', label: 'ด้านแคโทด', value1: '', pass: false, fail: false, note: '' },
  { id: 'top', label: 'ด้านบน', value1: '', pass: false, fail: false, note: '' },
  { id: 'bottom', label: 'ด้านล่าง', value1: '', pass: false, fail: false, note: '' }
]
const defaultBeamAlignment = () => [
  { id: 'lt1_5', label: '< 1.5°', pass: false, fail: false, note: '' },
  { id: 'btw', label: '1.5° < X < 3°', pass: false, fail: false, note: '' },
  { id: 'ge3', label: '≥ 3°', pass: false, fail: false, note: '' }
]

const form = ref({
  machineName: '',
  machineModel: '',
  testDate: '',
  tester: props.currentUserName || '',
  tubeSize: '',
  testMethod: '',
  lightMismatch: defaultLightMismatch(),
  beamAlignment: defaultBeamAlignment(),
  remark: ''
})

function loadInitial () {
  const d = props.initial
  if (!d || typeof d !== 'object') return
  form.value.machineName = d.machineName ?? ''
  form.value.machineModel = d.machineModel ?? ''
  form.value.testDate = d.testDate ?? ''
  form.value.tester = d.tester ?? props.currentUserName ?? ''
  form.value.tubeSize = d.tubeSize === 'large' ? 'large' : (d.tubeSize || 'small')
  form.value.testMethod = d.testMethod === 'coins' ? 'coins' : (d.testMethod || 'tool')
  form.value.remark = d.remark ?? ''
  const orderLm = ['anode', 'cathode', 'top', 'bottom']
  if (Array.isArray(d.lightMismatch) && d.lightMismatch.length) {
    form.value.lightMismatch = orderLm.map(id => {
      const row = d.lightMismatch.find(r => r.id === id) || {}
      return {
        id,
        label: row.label ?? '',
        value1: row.value1 ?? '',
        pass: !!row.pass,
        fail: !!row.fail,
        note: row.note ?? ''
      }
    })
  }
  const orderBa = ['lt1_5', 'btw', 'ge3']
  if (Array.isArray(d.beamAlignment) && d.beamAlignment.length) {
    form.value.beamAlignment = orderBa.map(id => {
      const row = d.beamAlignment.find(r => r.id === id) || {}
      return {
        id,
        label: row.label ?? '',
        pass: !!row.pass,
        fail: !!row.fail,
        note: row.note ?? ''
      }
    })
  }
}
onMounted(loadInitial)
watch(() => props.initial, loadInitial, { deep: true })

const attachmentFileName = ref('')
const attachmentImageData = ref('')
const attachmentFile = ref(null)
const showFilePreviewModal = ref(false)
const previewImageSrc = ref('')

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  attachmentFile.value = file
  attachmentFileName.value = file.name
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
  attachmentFile.value = null
  attachmentFileName.value = ''
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

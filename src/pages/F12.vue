<template>
  <!-- ใช้ MainLayout ครอบแทนการทำ sidebar / topbar เอง -->
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อ CHECKLIST -->
      <h1 class="page-title">แบบบันทึก F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ</h1>

      <!-- แถวแคปซูลสีส้มด้านบน -->
      <div class="pill-row">
        <!-- <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div> -->
        <!-- <div class="pill">
          รุ่น {{ selectedDevice.model }}
        </div> -->
        <!-- <div class="pill">
          ห้อง {{ selectedDevice.room }}
        </div> -->
        <div class="pill">
          วันที่ : {{ todayText }}
        </div>
        <div class="pill">
          ผู้บันทึก : {{ currentUserName }}
        </div>
        <div class="pill">
          เวลา : {{ currentTime }}
        </div>
      </div>

      <!-- กล่องเนื้อหาขาวตรงกลาง -->
      <div class="content-panel">
        <!-- ⭐ ตาราง : แบบบันทึก F12 อัตราการถ่ายภาพซ้ำ -->
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <!-- หัวตารางหลัก -->
              <tr class="row-header-main">
                <td colspan="2" class="text-center">
                  แบบบันทึกอัตราการถ่ายภาพซ้ำ
                </td>
              </tr>

              <!-- หัวคอลัมน์ -->
              <tr class="row-header-columns">
                <td>สาเหตุการปฏิเสธภาพ/การถ่ายซ้ำ</td>
                <td class="text-center">เลือก</td>
              </tr>

              <!-- รายการสาเหตุ 1–9 -->
              <tr v-for="reason in repeatReasons" :key="reason.id">
                <td class="cell-label">
                  {{ reason.index }}. {{ reason.label }}
                  <span v-if="reason.enLabel">({{ reason.enLabel }})</span>

                  <!-- ถ้าเป็น "อื่นๆ" ให้มีช่องกรอก -->
                  <div
                    v-if="reason.id === 'other' && selectedReason === 'other'"
                    class="mt-12"
                  >
                    <label class="field-label">ระบุสาเหตุเพิ่มเติม</label>
                    <input
                      type="text"
                      class="input-text"
                      v-model="otherReasonText"
                      placeholder="กรอกสาเหตุอื่นๆ..."
                    />
                  </div>
                </td>

                <td class="text-center">
                  <input
                    type="radio"
                    name="repeat-reason"
                    :value="reason.id"
                    v-model="selectedReason"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ⭐ จบตาราง F12 -->

        <!-- ปุ่มด้านล่างขวา -->
        <div class="actions">
          <!-- <button class="btn-remark" @click="openRemarkModal">
            หมายเหตุ
          </button> -->
          <button class="btn-save" @click="saveChecklist">
            บันทึก
          </button>
        </div>
      </div>
    </div>

    <!-- Popup หมายเหตุ -->
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
          <div class="file-attach-wrap">
            <input type="file" accept="image/*" class="form-control form-control-sm" @change="onFileChange" />
            <div v-if="remarkFileName" class="file-info mt-1">
              <span v-if="remarkImageData" class="file-link" @click="openFilePreview(remarkImageData)">{{ remarkFileName }}</span>
              <span v-else class="file-label">{{ remarkFileName }}</span>
              <button type="button" class="file-remove" @click="clearRemarkFile($event)">×</button>
            </div>
            <div v-if="remarkImageData" class="img-preview-wrap mt-2">
              <img :src="remarkImageData" alt="Preview" class="img-preview" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="closeRemarkModal">ยกเลิก</button>
          <button class="btn-save-popup" @click="saveRemark">บันทึก</button>
        </div>
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
          <p class="file-modal-caption">รูปภาพที่แนบมาพร้อมรายการแจ้งซ่อม</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import { apiFetch } from '../api/client'

const props = defineProps({
  selectedDevice: {
    type: Object,
    default: () => ({ name: '', model: '', room: '' })
  },
  currentUserName: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const route = useRoute()

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

// ⭐ F12 : รายการสาเหตุ
const repeatReasons = ref([
  { id: 'positioning', index: 1, label: 'การจัดท่าผู้ป่วย', enLabel: 'Positioning' },
  { id: 'exposureError', index: 2, label: 'ปริมาณรังสีที่ไม่เหมาะสม', enLabel: 'Exposure error' },
  { id: 'gridError', index: 3, label: 'ความผิดพลาดของกริด', enLabel: 'Grid error' },
  { id: 'systemError', index: 4, label: 'ความผิดพลาดของระบบ', enLabel: 'System error' },
  { id: 'artifact', index: 5, label: 'สิ่งแปลกปลอมในภาพ*', enLabel: 'Artifact' },
  { id: 'patientMotion', index: 6, label: 'การเคลื่อนไหวของผู้ป่วย', enLabel: 'Patient motion' },
  { id: 'testImage', index: 7, label: 'การทดสอบภาพ', enLabel: 'Test image' },
  { id: 'studyCanceled', index: 8, label: 'ยกเลิกเคส', enLabel: 'Study canceled' },
  { id: 'other', index: 9, label: 'อื่นๆ', enLabel: '' }
])

const selectedReason = ref('')
const otherReasonText = ref('')

const showRemarkModal = ref(false)
const remarkText = ref('')
const remarkFile = ref(null)

const remarkFileName = computed(() => remarkFile.value?.name || '')

const remarkImageData = ref('')
const showFilePreviewModal = ref(false)
const previewImageSrc = ref('')

const openRemarkModal = () => {
  showRemarkModal.value = true
}
const closeRemarkModal = () => {
  showRemarkModal.value = false
}

const onFileChange = (e) => {
  const file = e.target.files[0] || null
  if (!file) return
  remarkFile.value = file
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
      remarkImageData.value = canvas.toDataURL('image/jpeg', 0.7)
    }
    img.src = ev.target.result
  }
  reader.readAsDataURL(file)
}

const clearRemarkFile = (event) => {
  if (event) event.stopPropagation()
  remarkFile.value = null
  remarkImageData.value = ''
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

const saveRemark = () => {
  console.log('หมายเหตุ:', remarkText.value)
  console.log('ไฟล์แนบ:', remarkFile.value)
  closeRemarkModal()
}

const saveChecklist = async () => {
  const payload = {
    formType: 'F12',
    machineName: '',
    room: '',
    checkDate: `${todayText.value} ${currentTime.value}`,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      reason: selectedReason.value,
      otherText: otherReasonText.value,
      remark: remarkText.value
    })
  }

  try {
    await apiFetch('/SaveChecklist', {
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
  width: 70%;
  color: var(--text-secondary, #475569);
}

.text-center {
  text-align: center;
}

/* Text inputs */
.input-text {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
  transition: border-color 200ms, box-shadow 200ms;
}

.input-text:focus {
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
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.mt-12 {
  margin-top: 12px;
}

.mt-2 { margin-top: 8px; }
.mt-1 { margin-top: 4px; }

.form-control,
.form-control-sm {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

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
.file-modal-close:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }
.file-modal-body { padding: 24px; background: #f8fafc; min-height: 200px; max-height: calc(90vh - 120px); overflow: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.file-modal-img { max-width: 100%; max-height: min(400px, 60vh); border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); margin-bottom: 16px; }
.file-modal-caption { margin: 0; font-size: 0.9rem; color: #64748b; }
</style>

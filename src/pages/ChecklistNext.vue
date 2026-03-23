<template>
  <MainLayout>
    <div class="checklist-page">
      <h1 class="page-title">CHECKLIST</h1>

      <div class="pill-row">
        <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div>
        <div class="pill">
          รุ่น {{ selectedDevice.model }}
        </div>
        <div class="pill">
          ห้อง {{ selectedDevice.room }}
        </div>
        <div class="pill">
          วันที่ : {{ todayText }}
        </div>
        <div class="pill">
          ผู้ทดสอบ : {{ currentUserName }}
        </div>
      </div>

      <div class="content-panel">
        <p class="section-label">Dairy check</p>

        <!-- ตาราง : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์ -->
        <div class="table-wrapper">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  แบบบันทึก : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์
                </td>
              </tr>

              <tr class="row-header-columns">
                <td>รายการ</td>
                <td class="text-center">ผ่าน</td>
                <td class="text-center">ไม่ผ่าน</td>
                <td class="text-center">หมายเหตุ</td>
              </tr>

              <tr v-for="item in checklistItems" :key="item.id">
                <td class="cell-label">{{ item.label }}</td>

                <td class="text-center">
                  <input
                    type="radio"
                    :name="`check-${item.id}`"
                    value="pass"
                    v-model="item.result"
                  />
                </td>

                <td class="text-center">
                  <input
                    type="radio"
                    :name="`check-${item.id}`"
                    value="fail"
                    v-model="item.result"
                  />
                </td>

                <td>
                  <textarea
                    class="input-textarea"
                    v-model="item.remark"
                    placeholder="บันทึกหมายเหตุ..."
                  ></textarea>
                  <div class="file-attach-wrap mt-2">
                    <label class="form-label small mb-1">แนบไฟล์ภาพ</label>
                    <input type="file" accept="image/*" class="form-control form-control-sm" @change="onItemFileChange($event, item)" />
                    <div v-if="item.fileName" class="file-info mt-1">
                      <span v-if="item.imageData" class="file-link" @click="openFilePreview(item.imageData)">{{ item.fileName }}</span>
                      <span v-else class="file-label">{{ item.fileName }}</span>
                      <button type="button" class="file-remove" @click="clearItemFile(item, $event)">×</button>
                    </div>
                    <div v-if="item.imageData" class="img-preview-wrap mt-2">
                      <img :src="item.imageData" alt="Preview" class="img-preview" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ⭐ ตาราง : แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์ -->
        <div class="table-wrapper mt-24">
          <table class="check-table">
            <tbody>
              <!-- หัวตาราง -->
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  แบบบันทึก : การลบแผ่นเพลท แผนกเอกซเรย์
                </td>
              </tr>

              <!-- หัวคอลัมน์ -->
              <tr class="row-header-columns">
                <td>รายการ</td>
                <td class="text-center">ผ่าน</td>
                <td class="text-center">ไม่ผ่าน</td>
                <td class="text-center">หมายเหตุ</td>
              </tr>

              <!-- แถวรายการทดสอบ -->
              <tr>
                <td class="cell-label">
                  ผลการทดสอบ
                </td>
                <td class="text-center">
                  <input
                    type="radio"
                    name="plate-erase"
                    value="pass"
                    v-model="plateEraseResult"
                  />
                </td>
                <td class="text-center">
                  <input
                    type="radio"
                    name="plate-erase"
                    value="fail"
                    v-model="plateEraseResult"
                  />
                </td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="plateEraseRemark"
                    placeholder="บันทึกหมายเหตุ..."
                  ></textarea>
                  <div class="file-attach-wrap mt-2">
                    <label class="form-label small mb-1">แนบไฟล์ภาพ</label>
                    <input type="file" accept="image/*" class="form-control form-control-sm" @change="onPlateEraseFileChange($event)" />
                    <div v-if="plateEraseFileName" class="file-info mt-1">
                      <span v-if="plateEraseImageData" class="file-link" @click="openFilePreview(plateEraseImageData)">{{ plateEraseFileName }}</span>
                      <span v-else class="file-label">{{ plateEraseFileName }}</span>
                      <button type="button" class="file-remove" @click="clearPlateEraseFile($event)">×</button>
                    </div>
                    <div v-if="plateEraseImageData" class="img-preview-wrap mt-2">
                      <img :src="plateEraseImageData" alt="Preview" class="img-preview" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- ⭐ จบตาราง -->

        <!-- ปุ่มด้านล่างขวา -->
        <div class="actions">
          <!-- ปุ่มผ่านทั้งหมด ใช้สไตล์เดิมของปุ่มหมายเหตุ -->
          <button class="btn-remark" @click="markAllPass">
            ผ่านทั้งหมด
          </button>

          <!-- ปุ่มสีเหลือง: ถัดไป (เหมือนเดิม) -->
          <button class="btn-next" @click="goNext">
            ถัดไป
          </button>
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
import { ref, computed, onMounted } from 'vue'
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

/* ---------- โหลดข้อมูลเครื่องจาก API ---------- */
const deviceInfo = ref({ name: '', model: '', room: '' })
const userName = ref('')

const selectedDevice = computed(() =>
  deviceInfo.value.name ? deviceInfo.value : props.selectedDevice
)
const currentUserName = computed(() =>
  userName.value || props.currentUserName || 'Demo User'
)

onMounted(async () => {
  // โหลด user จาก localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
  } catch (e) { /* ignore */ }

  // โหลดข้อมูลเครื่อง
  const equipName = route.params.equipmentName
  if (equipName) {
    try {
      const res = await apiFetch('/GetAllMachines')
      if (res.ok) {
        const list = await res.json()
        const found = list.find(m => m.machineName === equipName)
        if (found) {
          deviceInfo.value = {
            name: found.machineName || '',
            model: found.model || '',
            room: found.room || ''
          }
        }
      }
    } catch (e) { console.error('Load machine error:', e) }
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

// เพิ่ม remark + file ให้แต่ละรายการ
const checklistItems = ref([
  {
    id: 'powerCable',
    label:
      'สายไฟ : ไม่พบรอยแตก ไม่บิดงอ ไม่พันเป็นปม และไม่มีอุปกรณ์ที่มีน้ำหนักมากวางทับสายไฟ',
    result: '',
    remark: '',
    file: null,
    fileName: '',
    imageData: ''
  },
  {
    id: 'lockBrake',
    label: 'ระบบล็อกและเบรก : ทำงานได้อย่างถูกต้อง',
    result: '',
    remark: '',
    file: null,
    fileName: '',
    imageData: ''
  },
  {
    id: 'tableTubeBucky',
    label: 'เตียง หลอดเอกซเรย์ และบักกี้ : เคลื่อนที่ได้อย่างราบเรียบ',
    result: '',
    remark: '',
    file: null,
    fileName: '',
    imageData: ''
  },
  {
    id: 'tubeWarmup',
    label: 'X-ray tube warm-up : ด้วยค่าเทคนิคที่บริษัทแนะนำ',
    result: '',
    remark: '',
    file: null,
    fileName: '',
    imageData: ''
  }
])

// ผลและ remark การลบแผ่นเพลท
const plateEraseResult = ref('') // pass | fail
const plateEraseRemark = ref('')
const plateEraseFile = ref(null)
const plateEraseFileName = computed(() =>
  plateEraseFile.value ? plateEraseFile.value.name : ''
)

const plateEraseImageData = ref('')
const showFilePreviewModal = ref(false)
const previewImageSrc = ref('')

function compressImageToBase64(file, callback) {
  const reader = new FileReader()
  reader.onload = (e) => {
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
      callback(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => callback('')
    img.src = e.target.result
  }
  reader.onerror = () => callback('')
  reader.readAsDataURL(file)
}

const onItemFileChange = (event, item) => {
  const file = event.target.files[0] || null
  if (!file) return
  item.file = file
  item.fileName = file.name
  compressImageToBase64(file, (data) => { item.imageData = data })
}

const clearItemFile = (item, event) => {
  if (event) event.stopPropagation()
  item.file = null
  item.fileName = ''
  item.imageData = ''
}

const onPlateEraseFileChange = (event) => {
  const file = event.target.files[0] || null
  if (!file) return
  plateEraseFile.value = file
  compressImageToBase64(file, (data) => { plateEraseImageData.value = data })
}

const clearPlateEraseFile = (event) => {
  if (event) event.stopPropagation()
  plateEraseFile.value = null
  plateEraseImageData.value = ''
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

// ปุ่ม "ผ่านทั้งหมด"
const markAllPass = () => {
  checklistItems.value.forEach((item) => {
    item.result = 'pass'
  })
  plateEraseResult.value = 'pass'
}

// ปุ่มถัดไป → ไปหน้า MonthlyCheckPage.vue
const goNext = () => {
  const payload = {
    device: props.selectedDevice,
    date: todayText.value,
    user: props.currentUserName,
    checklist: checklistItems.value,
    plateErase: {
      result: plateEraseResult.value,
      remark: plateEraseRemark.value,
      fileName: plateEraseFileName.value
    }
  }

  console.log('payload ก่อนไปหน้า MonthlyCheckPage:', payload)

  // เปลี่ยน path ให้ตรงกับ route ของ MonthlyCheckPage.vue ในโปรเจกต์คุณ
  router.push('/monthly-check')
}
</script>

<style scoped>
.checklist-page {
  padding: 0;
  min-height: calc(100vh - 56px);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

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

.content-panel {
  background: var(--bg-card, #ffffff);
  padding: 24px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
}

.section-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin-bottom: 16px;
}

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

.check-table td {
  padding: 10px 14px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
}

.row-header-main td {
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
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

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-remark,
.btn-next {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 9px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-remark {
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  color: #fff;
  box-shadow: 0 2px 8px rgba(244,63,94,0.3);
}

.btn-remark:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(244,63,94,0.4);
}

.btn-next {
  background: linear-gradient(135deg, #f7c948, #e0b63f);
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(247,201,72,0.35);
}

.btn-next:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(247,201,72,0.45);
}

.mt-24 {
  margin-top: 24px;
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

.file-name {
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 4px;
}

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
  background: #fff;
  border-radius: var(--radius-lg, 16px);
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
  margin-bottom: 10px;
}

.modal-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main, #0f172a);
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
  color: var(--text-secondary, #475569);
}

.mt-12 {
  margin-top: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel,
.btn-save-popup {
  border-radius: var(--radius-sm, 8px);
  border: none;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.btn-cancel {
  background: #f1f5f9;
  color: var(--text-main, #0f172a);
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save-popup {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 2px 8px rgba(16,185,129,0.3);
}

.btn-save-popup:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16,185,129,0.4);
}

@media (max-width: 1024px) {
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .check-table { min-width: 500px; }
}
@media (max-width: 640px) {
  .checklist-page { padding: 0; }
  .page-title { font-size: 1.2rem; margin-bottom: 12px; }
  .pill-row { gap: 6px; }
  .pill { font-size: 0.75rem; padding: 5px 12px; }
  .content-panel { padding: 12px; border-radius: 12px; }
  .actions { flex-wrap: wrap; }
  .btn-remark, .btn-next { padding: 8px 16px; font-size: 0.8rem; flex: 1; min-width: 120px; text-align: center; }
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

.form-label { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary, #475569); }
.mb-1 { margin-bottom: 4px; }
.mt-2 { margin-top: 8px; }
.mt-1 { margin-top: 4px; }
.form-control,
.form-control-sm { width: 100%; border-radius: var(--radius-sm, 8px); border: 1px solid var(--border-soft, #e2e8f0); padding: 8px 12px; font-size: 0.85rem; }
</style>

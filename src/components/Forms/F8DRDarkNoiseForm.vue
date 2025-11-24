<!-- src/components/forms/F8DRDarkNoiseForm.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-1">
        แบบบันทึก F8-2 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR
      </h5>

      <!-- ========= 1) ข้อมูลพื้นฐาน ========= -->
      <div class="row g-2 mb-3 mt-2">
        <!-- <div class="col-12 col-md-4">
          <label class="form-label small mb-1">หมายเลขเครื่อง</label>
          <input
            v-model="basicInfo.machineNo"
            type="text"
            class="form-control form-control-sm"
            placeholder="เช่น XR-01"
          />
        </div> -->
        <!-- <div class="col-12 col-md-4">
          <label class="form-label small mb-1">วันที่ทดสอบ</label>
          <input
            v-model="basicInfo.testDate"
            type="date"
            class="form-control form-control-sm"
          />
        </div> -->
        <!-- <div class="col-12 col-md-4">
          <label class="form-label small mb-1">ชื่อผู้ทดสอบ</label>
          <input
            v-model="basicInfo.testerName"
            type="text"
            class="form-control form-control-sm"
            :placeholder="currentUserName || 'ชื่อผู้ทดสอบ'"
          />
        </div> -->
      </div>

      <!-- แถวหัวเล็ก + ปุ่มเพิ่มแถว -->
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="small text-muted">ตารางบันทึกผลการทดสอบ Dark Noise</span>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="addRow"
        >
          เพิ่มอุปกรณ์
        </button>
      </div>

      <!-- ========= 2) ตารางบันทึก Dark Noise ========= -->
      <div class="table-responsive mb-3">
        <table class="table table-bordered table-sm align-middle mb-0">
          <thead class="table-light text-center small">
            <tr>
              <th>FPD no.</th>
              <th>FPD size</th>
              <th>ID</th>
              <th>EI</th>
              <th>DDI</th>
              <th>Pixel mean</th>
              <th style="width: 70px;">ลบ</th>
            </tr>
          </thead>
          <tbody class="small">
            <tr v-for="(row, idx) in localRows" :key="row.id">
              <td>
                <input
                  v-model="row.fpdNo"
                  class="form-control form-control-sm"
                  type="text"
                />
              </td>
              <td>
                <select
                  v-model="row.fpdSize"
                  class="form-select form-select-sm"
                >
                  <option value="">เลือกขนาด</option>
                  <option value="14×17">14×17</option>
                  <option value="17×17">17×17</option>
                  <option value="other">อื่น ๆ</option>
                </select>
                <input
                  v-if="row.fpdSize === 'other'"
                  v-model="row.fpdSizeOther"
                  type="text"
                  class="form-control form-control-sm mt-1"
                  placeholder="ระบุขนาด FPD"
                />
              </td>
              <td>
                <input
                  v-model="row.imageId"
                  class="form-control form-control-sm"
                  type="text"
                />
              </td>
              <td>
                <input
                  v-model.number="row.ei"
                  class="form-control form-control-sm"
                  type="number"
                  step="0.01"
                />
              </td>
              <td>
                <input
                  v-model.number="row.ddi"
                  class="form-control form-control-sm"
                  type="number"
                  step="0.01"
                />
              </td>
              <td>
                <input
                  v-model.number="row.pixelMean"
                  class="form-control form-control-sm"
                  type="number"
                  step="0.01"
                />
              </td>
              <td class="text-center">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeRow(idx)"
                  :disabled="localRows.length === 1"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========= 3) หมายเหตุ + แนบไฟล์ ========= -->
      <div class="mt-3">
        <label class="form-label small mb-1">หมายเหตุ</label>
        <textarea
          v-model="remark"
          rows="2"
          class="form-control form-control-sm"
          placeholder="บันทึกรายละเอียดเพิ่มเติม..."
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

      <!-- ========= 4) ปุ่มด้านล่าง ========= -->
      <div
        class="mt-3 d-flex flex-column flex-md-row justify-content-end align-items-stretch align-items-md-center gap-2"
      >
        <!-- <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="resetForm"
        >
          ล้างข้อมูล
        </button> -->

        <!-- <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          @click="exportPdf"
        >
          ส่งออก PDF
        </button> -->

        <!-- ✅ ปุ่มบันทึกสีเขียว (เดิม) -->
        <button
          type="button"
          class="btn btn-success btn-sm fw-semibold"
          @click="emitSave"
        >
          บันทึก
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  initial: Object,
  currentUserName: String
})

const emit = defineEmits(['save'])
const router = useRouter()

// ---------- สร้างแถวเปล่า ----------
const createRow = (id) => ({
  id,
  fpdNo: '',
  fpdSize: '',
  fpdSizeOther: '',
  imageId: '',
  ei: null,
  ddi: null,
  pixelMean: null
})

const createRows = () =>
  Array.from({ length: 4 }).map((_, idx) => createRow(idx + 1))

// ---------- state ----------
const localRows = reactive(
  props.initial?.rows ? structuredClone(props.initial.rows) : createRows()
)

const basicInfo = reactive(
  props.initial?.basicInfo
    ? structuredClone(props.initial.basicInfo)
    : {
        machineNo: '',
        testDate: '',
        testerName: props.currentUserName || ''
      }
)

const remark = ref(props.initial?.remark || '')
const attachmentFile = ref(null)

const attachmentFileName = computed(() =>
  attachmentFile.value ? attachmentFile.value.name : ''
)

const nextId = ref(localRows.length + 1)

// sync เมื่อ initial เปลี่ยน
watch(
  () => props.initial,
  (val) => {
    if (!val) return
    if (val.rows) {
      localRows.splice(0, localRows.length, ...structuredClone(val.rows))
      nextId.value = localRows.length + 1
    }
    if (val.basicInfo) {
      Object.assign(basicInfo, structuredClone(val.basicInfo))
    }
    remark.value = val.remark || ''
  }
)

// ---------- จัดการแถว ----------
const addRow = () => {
  localRows.push(createRow(nextId.value++))
}

const removeRow = (index) => {
  if (localRows.length === 1) return
  localRows.splice(index, 1)
}

// ---------- file ----------
const onFileChange = (e) => {
  const file = e.target.files[0] || null
  attachmentFile.value = file
}

// ---------- reset & export ----------
const resetForm = () => {
  Object.assign(basicInfo, {
    machineNo: '',
    testDate: '',
    testerName: props.currentUserName || ''
  })
  localRows.splice(0, localRows.length, ...createRows())
  nextId.value = localRows.length + 1
  remark.value = ''
  attachmentFile.value = null
}

const exportPdf = () => {
  // frontend-only: ตอนนี้แค่ log ไว้
  const payload = buildPayload()
  console.log('Export PDF payload (frontend only):', payload)
  alert('ฟังก์ชันส่งออก PDF ยังเป็นตัวอย่าง (frontend-only)')
}

// ---------- บันทึก ----------
const buildPayload = () => ({
  basicInfo: { ...basicInfo },
  rows: localRows.map((r) => ({ ...r })),
  remark: remark.value,
  attachmentFileName: attachmentFileName.value
})

const emitSave = () => {
  const payload = buildPayload()
  emit('save', payload)

  // redirect ไปหน้า Dashboard (ตามเดิม)
  router.push('/dashboard')
}
</script>

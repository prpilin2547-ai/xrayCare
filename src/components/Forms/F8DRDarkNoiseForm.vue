<!-- src/components/forms/F8DRDarkNoiseForm.vue -->
<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-1">
        แบบบันทึก F8-2 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR
      </h5>
      <!-- <p class="text-muted mb-3">ความถี่ : ทุก 6 เดือน</p> -->

      <!-- ตาราง -->
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
            </tr>
          </thead>
          <tbody class="small">
            <tr v-for="row in localRows" :key="row.id">
              <td><input v-model="row.fpdNo" class="form-control form-control-sm" /></td>
              <td><input v-model="row.fpdSize" class="form-control form-control-sm" /></td>
              <td><input v-model="row.imageId" class="form-control form-control-sm" /></td>
              <td><input v-model="row.ei" class="form-control form-control-sm" /></td>
              <td><input v-model="row.ddi" class="form-control form-control-sm" /></td>
              <td><input v-model="row.pixelMean" class="form-control form-control-sm" /></td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- หมายเหตุ + ปุ่มบันทึก (ฟอร์มสุดท้าย) -->
      <div class="mt-3 d-flex flex-column flex-md-row align-items-start gap-2">
        <div class="flex-grow-1">
          <label class="form-label small mb-1">หมายเหตุ</label>
          <textarea v-model="remark" rows="2" class="form-control form-control-sm"
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."></textarea>
        </div>
        <div class="d-flex flex-column align-items-end gap-2 mt-2 mt-md-0">
          <!-- ✅ ปุ่มบันทึกสีเขียว -->
          <button type="button" class="btn btn-success btn-sm fw-semibold" @click="emitSave">
            บันทึก
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  initial: Object,
  currentUserName: String
})

const emit = defineEmits(['save'])
const router = useRouter()

const createRows = () =>
  Array.from({ length: 4 }).map((_, idx) => ({
    id: idx + 1,
    fpdNo: '',
    fpdSize: '',
    imageId: '',
    ei: '',
    ddi: '',
    pixelMean: ''
  }))

const localRows = reactive(
  props.initial?.rows ? structuredClone(props.initial.rows) : createRows()
)
const remark = ref(props.initial?.remark || '')

watch(
  () => props.initial,
  (val) => {
    if (!val) return
    if (val.rows) {
      localRows.splice(0, localRows.length, ...structuredClone(val.rows))
    }
    remark.value = val.remark || ''
  }
)

// บันทึก (frontend-only) -> emit ให้ parent เผื่อใช้ -> เด้งไป /dashboard
const emitSave = () => {
  const payload = {
    rows: structuredClone(localRows),
    remark: remark.value
  }

  // 1) frontend "save" action (placeholder)
  console.log('บันทึกข้อมูลเรียบร้อย (frontend)', payload)

  // 2) emit ให้ parent หากต้องการให้ parent ทำงานเพิ่มเติม
  emit('save', payload)

  // 3) redirect ไปหน้า Dashboard (frontend only)
  router.push('/dashboard')
}
</script>

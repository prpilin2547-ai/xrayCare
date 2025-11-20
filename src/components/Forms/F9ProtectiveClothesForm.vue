<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        แบบบันทึก F9 : การตรวจสอบคุณภาพเสื้อคลุมตะกั่วและหมวกตะกั่วและหมวกเสื้อคลุมตะกั่วด้วยรังสีเอกซ์
      </h5>
      <p class="text-muted mb-3">ความถี่ : ทุก 6 เดือน</p>

      <!-- ตารางส่วนที่ 1 -->
      <h6 class="small fw-semibold mb-2">
        การตรวจสอบลักษณะของระบบภายนอกด้วยสายตาและการคลำ
      </h6>
      <div class="table-responsive mb-3">
        <table class="table table-bordered table-sm align-middle mb-0">
          <thead class="table-light text-center small">
            <tr>
              <th>ลำดับที่</th>
              <th>หมายเลขอุปกรณ์</th>
              <th>ชนิดของอุปกรณ์</th>
              <th>อายุการใช้งาน</th>
              <th>วันที่ตรวจสอบ</th>
              <th>ชนิดของความชำรุดเสียหาย</th>
              <th>ตำแหน่ง</th>
              <th>ขนาด</th>
              <th>วิธีการจัดเก็บ</th>
              <th>ผู้บันทึก</th>
            </tr>
          </thead>
          <tbody class="small">
            <tr v-for="row in localBlock1" :key="row.no">
              <td class="text-center">{{ row.no }}</td>
              <td><input v-model="row.deviceNo" class="form-control form-control-sm" /></td>
              <td><input v-model="row.deviceType" class="form-control form-control-sm" /></td>
              <td><input v-model="row.age" class="form-control form-control-sm" /></td>
              <td><input v-model="row.date" class="form-control form-control-sm" /></td>
              <td><input v-model="row.damageType" class="form-control form-control-sm" /></td>
              <td><input v-model="row.position" class="form-control form-control-sm" /></td>
              <td><input v-model="row.size" class="form-control form-control-sm" /></td>
              <td><input v-model="row.storage" class="form-control form-control-sm" /></td>
              <td><input v-model="row.recorder" class="form-control form-control-sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ตารางส่วนที่ 2 -->
      <h6 class="small fw-semibold mb-2 mt-3">
        การตรวจสอบลักษณะภายในของระบบด้วยการถ่ายภาพรังสีเอกซ์หรือการทดสอบอื่นๆ
      </h6>
      <div class="table-responsive mb-3">
        <table class="table table-bordered table-sm align-middle mb-0">
          <thead class="table-light text-center small">
            <tr>
              <th>ลำดับที่</th>
              <th>หมายเลขอุปกรณ์</th>
              <th>ชนิดของอุปกรณ์</th>
              <th>อายุการใช้งาน</th>
              <th>วันที่ตรวจสอบ</th>
              <th>ชนิดของความชำรุดเสียหาย</th>
              <th>ตำแหน่ง</th>
              <th>ขนาด</th>
              <th>วิธีการจัดเก็บ</th>
              <th>ผู้บันทึก</th>
            </tr>
          </thead>
          <tbody class="small">
            <tr v-for="row in localBlock2" :key="row.no">
              <td class="text-center">{{ row.no }}</td>
              <td><input v-model="row.deviceNo" class="form-control form-control-sm" /></td>
              <td><input v-model="row.deviceType" class="form-control form-control-sm" /></td>
              <td><input v-model="row.age" class="form-control form-control-sm" /></td>
              <td><input v-model="row.date" class="form-control form-control-sm" /></td>
              <td><input v-model="row.damageType" class="form-control form-control-sm" /></td>
              <td><input v-model="row.position" class="form-control form-control-sm" /></td>
              <td><input v-model="row.size" class="form-control form-control-sm" /></td>
              <td><input v-model="row.storage" class="form-control form-control-sm" /></td>
              <td><input v-model="row.recorder" class="form-control form-control-sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- หมายเหตุ + ปุ่มบันทึก -->
      <div class="mt-3 d-flex flex-column flex-md-row align-items-start gap-2">
        <div class="flex-grow-1">
          <label class="form-label small mb-1">หมายเหตุ</label>
          <textarea
            v-model="remark"
            rows="3"
            class="form-control form-control-sm"
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
          ></textarea>
        </div>
        <div class="d-flex flex-column align-items-end gap-2 mt-2 mt-md-0">
          <button class="btn btn-success btn-sm fw-semibold" @click="emitSave">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String
})
const emit = defineEmits(['save'])

const createBlock = (offset) =>
  Array.from({ length: 3 }).map((_, idx) => ({
    no: idx + 1 + offset,
    deviceNo: '',
    deviceType: '',
    age: '',
    date: '',
    damageType: '',
    position: '',
    size: '',
    storage: '',
    recorder: props.currentUserName || ''
  }))

const localBlock1 = reactive(
  props.initial?.block1 ? structuredClone(props.initial.block1) : createBlock(0)
)
const localBlock2 = reactive(
  props.initial?.block2 ? structuredClone(props.initial.block2) : createBlock(0)
)
const remark = ref(props.initial?.remark || '')

watch(
  () => props.initial,
  (val) => {
    if (val) {
      if (val.block1) {
        localBlock1.splice(0, localBlock1.length, ...structuredClone(val.block1))
      }
      if (val.block2) {
        localBlock2.splice(0, localBlock2.length, ...structuredClone(val.block2))
      }
      remark.value = val.remark || ''
    }
  }
)

const emitSave = () => {
  emit('save', {
    block1: structuredClone(localBlock1),
    block2: structuredClone(localBlock2),
    remark: remark.value
  })
}
</script>

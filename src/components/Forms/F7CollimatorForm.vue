<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        แบบบันทึก F7-1 : การทดสอบ Collimator and Beam Alignment
      </h5>
      <!-- <p class="text-muted mb-3">ความถี่ : ทุก 6 เดือน</p> -->

      <!-- ข้อมูลทั่วไป -->
      <div class="mb-3 row g-2">
        <div class="col-md-6">
          <label class="form-label small mb-1">เครื่องเอกซเรย์ชื่อ</label>
          <input v-model="form.machineName" class="form-control form-control-sm" />
        </div>
        <div class="col-md-6">
          <label class="form-label small mb-1">รุ่น</label>
          <input v-model="form.machineModel" class="form-control form-control-sm" />
        </div>
      </div>

      <div class="mb-3 row g-2">
        <div class="col-md-6">
          <label class="form-label small mb-1">วัน/เดือน/ปี ที่ทดสอบ</label>
          <input v-model="form.testDate" class="form-control form-control-sm" />
        </div>
        <div class="col-md-6">
          <label class="form-label small mb-1">ผู้ทดสอบ</label>
          <input v-model="form.tester" class="form-control form-control-sm" />
        </div>
      </div>

      <!-- วิธีทดสอบ (radio) -->
      <div class="border rounded-3 p-3 mb-3">
        <div class="mb-2 fw-semibold small">ผู้ทดสอบ :</div>
        <div class="form-check small" v-for="opt in tubeOptions" :key="opt.value">
          <input
            class="form-check-input"
            type="radio"
            :id="`tube-${opt.value}`"
            :value="opt.value"
            v-model="form.tubeType"
          />
          <label class="form-check-label" :for="`tube-${opt.value}`">
            {{ opt.label }}
          </label>
        </div>
      </div>

      <!-- ตารางความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ -->
      <div class="table-responsive mb-3">
        <table class="table table-bordered align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <th class="w-25">ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ</th>
              <th class="text-center">Pass</th>
              <th class="text-center">Fail</th>
              <th class="text-center">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in form.lightMismatch" :key="row.id">
              <td>
                {{ row.label }} <span class="text-muted">cm</span>
              </td>
              <td class="text-center">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`lm-${row.id}`"
                  value="pass"
                  v-model="row.result"
                />
              </td>
              <td class="text-center">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`lm-${row.id}`"
                  value="fail"
                  v-model="row.result"
                />
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
      <div class="table-responsive mb-3 mt-3">
        <table class="table table-bordered align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <th colspan="4">
                Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
              </th>
            </tr>
            <tr>
              <th class="w-25">Beam Alignment</th>
              <th class="text-center">Pass</th>
              <th class="text-center">Fail</th>
              <th class="text-center">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in form.beamAlignment" :key="row.id">
              <td>{{ row.label }}</td>
              <td class="text-center">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`ba-${row.id}`"
                  value="pass"
                  v-model="row.result"
                />
              </td>
              <td class="text-center">
                <input
                  class="form-check-input"
                  type="radio"
                  :name="`ba-${row.id}`"
                  value="fail"
                  v-model="row.result"
                />
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

      <!-- หมายเหตุ + ปุ่มถัดไป -->
      <div class="mt-3 d-flex flex-column flex-md-row align-items-start gap-2">
        <div class="flex-grow-1">
          <label class="form-label small mb-1">หมายเหตุ</label>
          <textarea
            v-model="form.remark"
            rows="2"
            class="form-control form-control-sm"
            placeholder="บันทึกรายละเอียดเพิ่มเติม..."
          ></textarea>
        </div>
        <div class="d-flex flex-column align-items-end gap-2 mt-2 mt-md-0">
          <button class="btn btn-warning btn-sm fw-semibold" @click="submitNext">
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String
})
const emit = defineEmits(['next'])

const tubeOptions = [
  { value: 'small', label: 'หลอดใส่เล็ก' },
  { value: 'large', label: 'หลอดใส่ใหญ่' },
  { value: 'tool', label: 'ทดสอบโดย Collimator/Beam alignment test tool' },
  { value: 'coins', label: 'ทดสอบโดย Coins for x-ray to light-beam alignment test' }
]

const form = () => ({
  machineName: '',
  machineModel: '',
  testDate: '',
  tester: props.currentUserName || '',
  tubeType: '',
  lightMismatch: [
    { id: 'topLeft', label: 'ด้านบนโบก', result: '', note: '' },
    { id: 'topRight', label: 'ด้านบนโทค', result: '', note: '' },
    { id: 'left', label: 'ด้านขวา', result: '', note: '' },
    { id: 'right', label: 'ด้านล่าง', result: '', note: '' }
  ],
  beamAlignment: [
    { id: 'lt1_5', label: '< 1.5°', result: '', note: '' },
    { id: 'btw', label: '1.5° &lt; X &lt; 3°', result: '', note: '' },
    { id: 'ge3', label: '≥ 3°', result: '', note: '' }
  ],
  remark: ''
})

const submitNext = () => {
  emit('next', form.value)
}
</script>

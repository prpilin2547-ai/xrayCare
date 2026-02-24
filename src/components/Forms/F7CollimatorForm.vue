<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        แบบบันทึก F7-1 : การทดสอบ Collimator and Beam Alignment
      </h5>

      <!-- วิธีทดสอบ (2 radio groups) -->
      <div class="border rounded-3 p-3 mb-3">
        <!-- กลุ่ม 1: ขนาดหลอด -->
        <div class="form-check small" v-for="opt in tubeSizeOptions" :key="opt.value">
          <input class="form-check-input" type="radio" :id="`tubeSize-${opt.value}`" :value="opt.value"
            v-model="form.tubeSize" />
          <label class="form-check-label" :for="`tubeSize-${opt.value}`">
            {{ opt.label }}
          </label>
        </div>

        <hr class="my-2" />

        <!-- กลุ่ม 2: วิธีทดสอบ -->
        <div class="form-check small" v-for="opt in testMethodOptions" :key="opt.value">
          <input class="form-check-input" type="radio" :id="`testMethod-${opt.value}`" :value="opt.value"
            v-model="form.testMethod" />
          <label class="form-check-label" :for="`testMethod-${opt.value}`">
            {{ opt.label }}
          </label>
        </div>
      </div>

      <!-- ตารางความเหลื่อมล้ำ -->
      <div class="mb-1 small">
        ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 1 cm หรือ 1% ที่ SID 100 cm)<br />
        + หมายถึงลำรังสีมีขนาดใหญ่กว่าขอบเขตจริง - หมายถึงลำรังสีมีขนาดเล็กกว่าขอบเขตจริง
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
                    <input v-model="row.value1" type="text" class="form-control form-control-sm text-end" />
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
                <input v-model="row.note" type="text" class="form-control form-control-sm" />
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
                <input v-model="row.note" type="text" class="form-control form-control-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- หมายเหตุ + ปุ่มถัดไปอยู่ด้านขวาสุด -->
      <div class="mt-3">
        <label class="form-label small mb-1">หมายเหตุ</label>
        <textarea v-model="form.remark" rows="2" class="form-control form-control-sm mb-3"
          placeholder="บันทึกรายละเอียดเพิ่มเติม..."></textarea>
        <div class="mt-2">
          <label class="form-label text-small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
          <input type="file" class="form-control form-control-sm" @change="onFileChange" />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>
      </div>
      <br>

      <!-- ปุ่มถัดไปชิดขวา -->
      <div class="d-flex justify-content-end">
        <button class="btn btn-warning btn-sm fw-semibold" @click="submitNext">
          ถัดไป
        </button>
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
const onFileChange = (e) => {
  const file = e.target.files[0]
  attachmentFileName.value = file ? file.name : ''
}

const submitNext = () => {
  emit('next', form.value)
}
</script>

<style scoped>
.text-small {
  font-size: 0.875em;
}
</style>
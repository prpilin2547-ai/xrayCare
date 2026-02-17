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
      <br>

        <div class="d-flex justify-content-end">
          <button class="btn btn-warning btn-sm fw-semibold" @click="submitNext">
            ถัดไป
          </button>
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

const tubeSizeOptions = [
  { value: 'small', label: 'หลอดใส่เล็ก' },
  { value: 'large', label: 'หลอดใส่ใหญ่' }
]

const testMethodOptions = [
  { value: 'tool', label: 'ทดสอบโดย Collimator/Beam alignment test tool' },
  { value: 'coins', label: 'ทดสอบโดย Coins for x-ray to light-beam alignment test' }
]

const form = ref({
  machineName: '',
  machineModel: '',
  testDate: '',
  tester: props.currentUserName || '',
  tubeSize: '',
  testMethod: '',
  lightMismatch: [
    { id: 'anode', label: 'ด้านแอโนด', value1: '', pass: false, fail: false, note: '' },
    { id: 'cathode', label: 'ด้านแคโทด', value1: '', pass: false, fail: false, note: '' },
    { id: 'top', label: 'ด้านบน', value1: '', pass: false, fail: false, note: '' },
    { id: 'bottom', label: 'ด้านล่าง', value1: '', pass: false, fail: false, note: '' }
  ],
  beamAlignment: [
    { id: 'lt1_5', label: '< 1.5°', pass: false, fail: false, note: '' },
    { id: 'btw', label: '1.5° < X < 3°', pass: false, fail: false, note: '' },
    { id: 'ge3', label: '≥ 3°', pass: false, fail: false, note: '' }
  ],
  remark: ''
})

const submitNext = () => {
  emit('next', form.value)
}
</script>

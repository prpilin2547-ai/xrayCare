<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="4" class="text-center">
              แบบบันทึก F6 : ความคงที่ของค่าดัชนีปริมาณรังสี (Consistency of EI)
            </td>
          </tr>

          <tr>
            <td class="cell-label">ระบบที่ทดสอบ (CR/DR)</td>
            <td colspan="3">
              <input type="text" v-model="form.system" class="input-cell" />
            </td>
          </tr>
          <tr>
            <!-- <td class="cell-label">หมายเลขห้อง / หมายเลขเครื่อง</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.roomNumber"
                class="input-cell"
              />
            </td> -->
          </tr>
          <tr>
            <!-- <td class="cell-label">ชื่อเครื่องเอกซเรย์ / รุ่น</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.deviceName"
                class="input-cell"
              />
            </td> -->
          </tr>
          <tr>
            <td class="cell-label">Baseline EI (±10%)</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.baseline"
                class="input-cell"
              />
            </td>
          </tr>

          <!-- <tr>
            <td class="cell-label">วันที่ทำการทดสอบ</td>
            <td>
              <input type="date" v-model="form.date" class="input-cell" />
            </td>
            <td class="cell-label small">ผู้ทดสอบ</td>
            <td>
              <input
                type="text"
                v-model="form.tester"
                class="input-cell"
                :placeholder="currentUserName"
              />
            </td>
          </tr> -->

          <tr class="row-header-columns">
            <td>เทคนิคการถ่ายภาพ</td>
            <td class="text-center">EI จากเครื่อง</td>
            <td class="text-center">EI อ้างอิง</td>
            <td class="text-center">EI อยู่ในเกณฑ์ (P/F)</td>
          </tr>

          <tr v-for="row in form.eiRows" :key="row.id">
            <td class="cell-label">
              <input
                type="text"
                v-model="row.technique"
                class="input-cell"
                placeholder="เช่น Chest PA 110 kV 2 mAs"
              />
            </td>
            <td class="text-center">
              <input
                type="number"
                v-model.number="row.eiMeasured"
                class="input-cell"
              />
            </td>
            <td class="text-center">
              <input
                type="number"
                v-model.number="row.eiRef"
                class="input-cell"
              />
            </td>
            <td class="text-center">
              <select v-model="row.passFail" class="input-cell">
                <option value="">-</option>
                <option value="P">P</option>
                <option value="F">F</option>
              </select>
            </td>
          </tr>

          <tr>
            <td class="cell-label">ข้อคิดเห็น</td>
            <td colspan="3">
              <input type="text" v-model="form.comment" class="input-cell" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F6)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="ข้อสังเกตเพิ่มเติมเกี่ยวกับ EI..."
        ></textarea>

        <label class="field-label mt-8">แนบไฟล์รูปภาพ</label>
        <input type="file" accept="image/*" @change="onFileChange" />
        <p v-if="form.fileName" class="file-name">
          ไฟล์ที่เลือก: {{ form.fileName }}
        </p>
      </div>

      <!-- ปุ่มบันทึกสุดท้าย -->
      <button class="btn-save-final" @click="submitSave">
        บันทึก
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String
})

const emit = defineEmits(['save'])

const defaultForm = () => ({
  system: '',
  roomNumber: '',
  deviceName: '',
  baseline: '',
  date: '',
  tester: props.currentUserName || '',
  eiRows: [
    { id: 1, technique: '', eiMeasured: null, eiRef: null, passFail: '' },
    { id: 2, technique: '', eiMeasured: null, eiRef: null, passFail: '' },
    { id: 3, technique: '', eiMeasured: null, eiRef: null, passFail: '' }
  ],
  comment: '',
  remark: '',
  file: null,
  fileName: ''
})

const form = ref(props.initial || defaultForm())

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.file = file || null
  form.value.fileName = file ? file.name : ''
}

const submitSave = () => {
  emit('save', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';

.btn-save-final {
  border: none;
  border-radius: 6px;
  padding: 10px 26px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: #65d46e;
  color: #ffffff;
}

.btn-save-final:hover {
  background: #4fb759;
}
</style>

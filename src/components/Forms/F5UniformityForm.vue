<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="3" class="text-center">
              แบบบันทึก F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)
            </td>
          </tr>

          <tr>
            <td class="cell-label">หมายเลขของแผ่นรับภาพ</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.cassetteNumber"
                class="input-cell"
              />
            </td>
          </tr>

          <tr class="row-header-columns">
            <td>ค่าขอบเขต / เกณฑ์ที่ต้องได้</td>
            <td class="text-center">Y</td>
            <td class="text-center">N</td>
          </tr>

          <tr v-for="item in form.criteria" :key="item.id">
            <td class="cell-label">{{ item.label }}</td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5c-${item.id}`"
                value="Y"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5c-${item.id}`"
                value="N"
                v-model="item.result"
              />
            </td>
          </tr>

          <!-- <tr>
            <td class="cell-label">วันที่</td>
            <td colspan="2">
              <input type="date" v-model="form.date" class="input-cell" />
            </td>
          </tr>
          <tr>
            <td class="cell-label">ผู้ทดสอบ</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.tester"
                class="input-cell"
                :placeholder="currentUserName"
              />
            </td>
          </tr> -->

          <tr class="row-header-columns">
            <td>การประเมินภาพ</td>
            <td class="text-center">Y</td>
            <td class="text-center">N</td>
          </tr>

          <tr v-for="item in form.imageChecks" :key="item.id">
            <td class="cell-label">{{ item.label }}</td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5i-${item.id}`"
                value="Y"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f5i-${item.id}`"
                value="N"
                v-model="item.result"
              />
            </td>
          </tr>

          <tr>
            <td class="cell-label">ข้อคิดเห็น-ความคมชัดภาพ (heel effect etc?)</td>
            <td colspan="2">
              <input type="text" v-model="form.comment" class="input-cell" />
            </td>
          </tr>
          <tr>
            <td class="cell-label">การแก้ไข (ถ้าเป็นไปได้)</td>
            <td colspan="2">
              <input
                type="text"
                v-model="form.correction"
                class="input-cell"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F5)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="สรุปผลการประเมินภาพ..."
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

      <button class="btn-next" @click="submitNext">
        ถัดไป
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

const emit = defineEmits(['next'])

const defaultForm = () => ({
  cassetteNumber: '',
  criteria: [
    { id: 'uniform', label: 'ภาพปรากฏสม่ำเสมอ', result: '' },
    { id: 'noArtifact', label: 'ไม่มีสิ่งแปลกปลอม', result: '' }
  ],
  date: '',
  tester: props.currentUserName || '',
  imageChecks: [
    { id: 'uniformSeen', label: 'ภาพปรากฏสม่ำเสมอหรือไม่? (Y/N)', result: '' },
    { id: 'artifactSeen', label: 'มีสิ่งแปลกปลอมหรือไม่? (Y/N)', result: '' },
    { id: 'abnormal', label: 'อธิบายสิ่งแปลกปลอมหรือความผิดปกติ', result: '' }
  ],
  comment: '',
  correction: '',
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

const submitNext = () => {
  emit('next', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';
</style>

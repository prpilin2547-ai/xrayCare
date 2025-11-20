<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="3" class="text-center">
              แบบบันทึก F3 : การควบคุมคุณภาพของภาพ (Display monitor)
            </td>
          </tr>

          <!-- <tr>
            <td class="cell-label">วันที่</td>
            <td colspan="2">
              <input type="date" v-model="form.date" class="input-cell" />
            </td>
          </tr> -->
          <!-- <tr>
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
            <td>คุณภาพของภาพพิมพ์โดยทั่วไป</td>
            <td class="text-center">Pass (P)</td>
            <td class="text-center">Fail (F)</td>
          </tr>

          <tr v-for="item in form.items" :key="item.id">
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="P"
                v-model="item.result"
              />
            </td>
            <td class="text-center">
              <input
                type="radio"
                :name="`f3-${item.id}`"
                value="F"
                v-model="item.result"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- หมายเหตุ + ถัดไป -->
    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุ (F3)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="กรอกรายละเอียดเพิ่มเติม..."
        ></textarea>

        <label class="field-label mt-8">แนบไฟล์รูปภาพ</label>
        <input type="file" accept="image/*" @change="onFileChange" />
        <p v-if="form.fileName" class="file-name">
          ไฟล์ที่เลือก: {{ form.fileName }}
        </p>
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
  date: '',
  tester: props.currentUserName || '',
  items: [
    { id: 'smear', label: 'ภาพไม่มีรอยเบลอ (Smear)', result: '' },
    { id: 'noArtifact', label: 'ไม่มีสิ่งแปลกปลอม', result: '' },
    { id: 'ramp', label: 'ภาพลาดชัน (ramp) แสดงระดับสัญญาณต่อเนื่อง', result: '' },
    { id: 'line', label: 'เส้นตรงต่อเนื่อง ไม่ขาดหาย', result: '' },
    { id: 'square', label: 'กรอบหรือช่องเป็นสี่เหลี่ยมชัดเจน', result: '' },
    { id: 'luminance', label: 'ความสว่าง (Luminance) เหมาะสม', result: '' },
    { id: '0pct', label: 'กรอบลึก 0% มองเห็นในพื้นหลัง', result: '' },
    { id: '5pct', label: 'กรอบลึก 5% มองเห็นในพื้นหลัง', result: '' },
    { id: '95pct', label: 'กรอบลึก 95% มองเห็นในพื้นหลัง', result: '' },
    { id: '100pct', label: 'กรอบลึก 100% แสดงสัญญาณเต็มที่', result: '' },
    { id: 'highContrast', label: 'กลุ่มวัตถุคอนทราสสูงขนาดเล็กมองเห็นได้ในมุมต่าง ๆ', result: '' },
    { id: 'lowContrast', label: 'กลุ่มวัตถุคอนทราสต่ำมองเห็นได้', result: '' },
    { id: 'uniformity', label: 'กลุ่มช่องเท่ากันมีความสม่ำเสมอ', result: '' },
    {
      id: 'qualityCont',
      label: 'จำนวนตัวอักษรที่มองเห็นได้ (อย่างน้อย 11 ตัว หรืออ่านได้ถึง "QUALITY CONT")',
      result: ''
    }
  ],
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
.content-panel {
  background: #ffffff;
  padding: 18px 22px 22px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

.table-wrapper {
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: top;
}

.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

.row-header-columns td {
  font-weight: 600;
  background: #f3f4f6;
}

.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #f9fafb;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #e5e7eb;
}

.cell-label {
  width: 60%;
}

.text-center {
  text-align: center;
}

.input-cell {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  padding: 4px 6px;
  font-size: 0.85rem;
  box-sizing: border-box;
}

/* remark + ปุ่ม */
.remark-actions {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-end;
}

.remark-box {
  flex: 1;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #4b5563;
}

.input-textarea {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 0.9rem;
  margin-top: 4px;
}

.mt-8 {
  margin-top: 8px;
}

.file-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

.btn-next {
  border: none;
  border-radius: 6px;
  padding: 10px 26px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: #f7c948;
  color: #111827;
}

.btn-next:hover {
  background: #e0b63f;
}

@media (max-width: 768px) {
  .remark-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-next {
    align-self: flex-end;
  }
}
</style>

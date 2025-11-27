<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <!-- SECTION 0 : HEADER -->
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="4" class="text-center">
              แบบบันทึก F6 : ความคงที่ของค่าดัชนีปริมาณรังสี (Consistency of Exposure Index)
              <!-- <div class="section-subtitle">
                ความถี่ : ทุก 3 เดือน
              </div> -->
            </td>
          </tr>

          <!-- SECTION 1 : ข้อมูลสำหรับระบบ CR / DR -->
          <tr>
  <td colspan="4" class="cell-section-title">
    ข้อมูลสำหรับระบบ
    <select v-model="form.systemType" class="input-cell" style="margin-left: 8px; width: 120px;">
      <option value="">- เลือกระบบ -</option>
      <option value="CR">CR</option>
      <option value="DR">DR</option>
    </select>
  </td>
</tr>

          <tr>
            <td class="cell-label">หมายเลขคาสเซท :</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.cassetteNumber"
                class="input-cell"
              />
            </td>
          </tr>
          <tr>
            <td class="cell-label">หมายเลขเครื่องอ่าน :</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.readerNumber"
                class="input-cell"
              />
            </td>
          </tr>

          <!-- SECTION 2 : ข้อมูลเครื่องเอกซเรย์
          <tr>
            <td colspan="4" class="cell-section-title">
              ข้อมูลเครื่องเอกซเรย์
            </td>
          </tr>
          <tr>
            <td class="cell-label">ยี่ห้อ</td>
            <td>
              <input
                type="text"
                v-model="form.xrayBrand"
                class="input-cell"
              />
            </td>
            <td class="cell-label">รุ่น</td>
            <td>
              <input
                type="text"
                v-model="form.xrayModel"
                class="input-cell"
              />
            </td>
          </tr>
          <tr>
            <td class="cell-label">หมายเลขเครื่อง</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.xraySerial"
                class="input-cell"
              />
            </td>
          </tr> -->

          <!-- SECTION 3 : ขอบเขต และข้อมูลเบื้องต้น -->
          <tr>
            <td colspan="4" class="cell-section-title">
              ขอบเขต
            </td>
          </tr>
          <tr>
            <td colspan="4" class="cell-readonly">
              ค่าความต่างจากค่าอ้างอิงพื้นฐาน (Baseline) ต้องน้อยกว่า ± 10%
            </td>
          </tr>
         <tr>
  <td colspan="4">
    <div class="ei-unit-row">
      <span class="ei-unit-label">
        ข้อมูลเบื้องต้น : ระบุหน่วยของตัวชี้บอกปริมาณรังสี เช่น ฟูจิใช้ S, EI คือ
      </span>
      <input
        type="text"
        v-model="form.eiUnitInfo"
        class="ei-unit-input"
      />
    </div>
  </td>
</tr>
        </tbody>
      </table>

     <!-- SECTION 4 : เทคนิคประมวลผลภาพ + ตารางผลการทดสอบ -->
<div class="section-block">
  <!-- หัวข้อ + เส้นประ + ช่องกรอก -->
  <div class="processing-row">
    <span class="processing-label">
      เทคนิคประมวลผลภาพ
    </span>
    <input
      type="text"
      v-model="form.processingTechnique"
      class="processing-input"
      placeholder="เช่น Chest PA – Adult – Standard processing"
    />
  </div>

  <div class="table-scroll">
    <table class="check-table mt-2">
      <thead>
        <tr class="row-header-columns">
          <td class="text-center">วันที่ทำการทดสอบ</td>
          <td class="text-center">อ้างอิง</td>
          <td class="text-center">ขอบเขตล่าง</td>
          <td class="text-center">ขอบเขตบน</td>
          <td class="text-center action-col"></td>
        </tr>
      </thead>

      <tbody>
        <!-- 1 block = 5 แถว ตามแบบฟอร์ม -->
        <template v-for="(row, index) in form.testRows" :key="row.id">
          <tr>
  <td>
    <div class="cell-row-inline">
      <!-- <label class="cell-label-inline">วันที่ทำการทดสอบ</label> -->
      <input
        type="date"
        v-model="row.date"
        class="input-cell input-inline"
      />
    </div>
  </td>

  <td>
    <!-- <input
      type="number"
      v-model.number="row.ref"
      class="input-cell input-inline"
    /> -->
  </td>

  <td>
    <!-- <input
      type="number"
      v-model.number="row.lower"
      class="input-cell input-inline"
    /> -->
  </td>

  <td>
    <!-- <input
      type="number"
      v-model.number="row.upper"
      class="input-cell input-inline"
    /> -->
  </td>

  <td></td>
</tr>

         <!-- แถว 2 : EI -->
<tr>
  <td class="cell-label">
    EI
  </td>

  <!-- คอลัมน์ อ้างอิง -->
  <td>
    <input
      type="number"
      v-model.number="row.ei_ref"
      class="input-cell"
    />
  </td>

  <!-- คอลัมน์ ขอบเขตล่าง -->
  <td>
    <input
      type="number"
      v-model.number="row.ei_lower"
      class="input-cell"
    />
  </td>

  <!-- คอลัมน์ ขอบเขตบน -->
  <td>
    <input
      type="number"
      v-model.number="row.ei_upper"
      class="input-cell"
    />
  </td>

  <td></td>
</tr>

          <!-- แถว 3 : EI จากเครื่อง -->
<tr>
  <td class="cell-label">
    EI จากเครื่อง
  </td>

  <td>
    <input
      type="number"
      v-model.number="row.eiMeasured_ref"
      class="input-cell"
    />
  </td>

  <td>
    <input
      type="number"
      v-model.number="row.eiMeasured_lower"
      class="input-cell"
    />
  </td>

  <td>
    <input
      type="number"
      v-model.number="row.eiMeasured_upper"
      class="input-cell"
    />
  </td>

  <td></td>
</tr>


         <!-- แถว 4 : EI อยู่ในเกณฑ์ (P/F) -->
<tr>
  <td class="cell-label">
    EI อยู่ในเกณฑ์ (P/F)
  </td>

  <!-- ช่อง อ้างอิง -->
  <td>
    <select v-model="row.passFail_ref" class="input-cell">
      <option value="">-</option>
      <option value="P">P</option>
      <option value="F">F</option>
    </select>
  </td>

  <!-- ช่อง ขอบเขตล่าง -->
  <td>
    <select v-model="row.passFail_lower" class="input-cell">
      <option value="">-</option>
      <option value="P">P</option>
      <option value="F">F</option>
    </select>
  </td>

  <!-- ช่อง ขอบเขตบน -->
  <td>
    <select v-model="row.passFail_upper" class="input-cell">
      <option value="">-</option>
      <option value="P">P</option>
      <option value="F">F</option>
    </select>
  </td>

  <td></td>
</tr>


          <!-- แถว 5 : ข้อคิดเห็น + ปุ่มลบ -->
          <tr>
            <td class="cell-label">
              ข้อคิดเห็น
            </td>
            <td colspan="3">
              <input
                type="text"
                v-model="row.comment"
                class="input-cell"
              />
            </td>
            <td class="text-center action-col">
              <button
                type="button"
                class="btn-row-remove"
                @click="removeTestRow(index)"
              >
                ลบ
              </button>
            </td>
          </tr>
        </template>

        <!-- แถวเพิ่มบล็อกใหม่ -->
        <tr>
          <td colspan="5" class="text-right">
            <button
              type="button"
              class="btn-row-add"
              @click="addTestRow"
            >
              + เพิ่มแถว
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      <!-- SECTION 5 : ปริมาณรังสีที่ใช้สำหรับทดสอบ -->
      <div class="section-block">
        <div class="section-title">
          ปริมาณรังสีที่ใช้สำหรับทดสอบ
        </div>
        <p class="section-description">
          ปริมาณรังสีที่ใช้สำหรับทดสอบ (กรณีศูนย์วิทยาศาสตร์การแพทย์ ดำเนินการวัดให้พร้อมตรวจรวมตามมาตรฐานเครื่องเอกซเรย์ประจำปี)
        </p>

        <table class="check-table mt-2">
          <thead>
            <tr class="row-header-columns">
              <td class="text-center">เทคนิคการถ่ายภาพ</td>
              <td class="text-center">kV</td>
              <td class="text-center">mAs</td>
              <td class="text-center">Dose (mGy)</td>
              <td class="text-center action-col"></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in form.doseRows" :key="row.id">
              <td>
                <input
                  type="text"
                  v-model="row.technique"
                  class="input-cell"
                />
              </td>
              <td>
                <input
                  type="number"
                  v-model.number="row.kv"
                  class="input-cell"
                />
              </td>
              <td>
                <input
                  type="number"
                  v-model.number="row.mas"
                  class="input-cell"
                />
              </td>
              <td>
                <input
                  type="number"
                  v-model.number="row.dose"
                  class="input-cell"
                />
              </td>
              <td class="text-center action-col">
                <button
                  type="button"
                  class="btn-row-remove"
                  @click="removeDoseRow(index)"
                >
                  ลบ
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-right">
                <button
                  type="button"
                  class="btn-row-add"
                  @click="addDoseRow"
                >
                  + เพิ่มแถว
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ***** ห้ามแก้ส่วนนี้: remark + ปุ่มบันทึก ***** -->
    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F6)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="ข้อสังเกตเพิ่มเติมเกี่ยวกับ EI..."
        ></textarea>

        <div class="mt-2">
          <label class="form-label text-small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
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

const createEmptyTestRow = (id) => ({
  id,
  date: '',
  ref: null,
  lower: null,
  upper: null,
  ei: null,
  eiMeasured: null,
  passFail: '',
  comment: ''
})

const createEmptyDoseRow = (id) => ({
  id,
  technique: '',
  kv: null,
  mas: null,
  dose: null
})

const defaultForm = () => ({
  // เดิม
  system: '',
  systemType: '',
  processingTechnique: '', 
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
  // ใหม่ตามแบบฟอร์ม F6
  cassetteNumber: '',
  readerNumber: '',
  xrayBrand: '',
  xrayModel: '',
  xraySerial: '',
  eiUnitInfo: '',
  testRows: [createEmptyTestRow(1)],
  doseRows: [createEmptyDoseRow(1)],
  // ส่วนหมายเหตุ/ไฟล์
  remark: '',
  file: null,
  fileName: ''
})

// รวม default + initial (ถ้ามี)
const form = ref({
  ...defaultForm(),
  ...(props.initial || {})
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.file = file || null
  form.value.fileName = file ? file.name : ''
}

const addTestRow = () => {
  const nextId =
    (form.value.testRows[form.value.testRows.length - 1]?.id || 0) + 1
  form.value.testRows.push(createEmptyTestRow(nextId))
}

const removeTestRow = (index) => {
  if (form.value.testRows.length <= 1) return
  form.value.testRows.splice(index, 1)
}

const addDoseRow = () => {
  const nextId =
    (form.value.doseRows[form.value.doseRows.length - 1]?.id || 0) + 1
  form.value.doseRows.push(createEmptyDoseRow(nextId))
}

const removeDoseRow = (index) => {
  if (form.value.doseRows.length <= 1) return
  form.value.doseRows.splice(index, 1)
}

const submitSave = () => {
  emit('save', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';

.section-subtitle {
  margin-top: 4px;
  font-size: 0.9rem;
  font-weight: 400;
}

.cell-section-title {
  font-weight: 600;
  background-color: #f5f5f5;
}

.cell-readonly {
  font-size: 0.9rem;
}

.section-block {
  margin-top: 16px;
}

.section-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.section-description {
  font-size: 0.9rem;
  margin-top: 4px;
}

.cell-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inline-input {
  flex: 1;
}

.mt-2 {
  margin-top: 8px;
}

.text-right {
  text-align: right;
}

.action-col {
  width: 70px;
}

.btn-row-add,
.btn-row-remove {
  border-radius: 4px;
  border: none;
  padding: 4px 10px;
  font-size: 0.8rem;
  cursor: pointer;
}

.btn-row-add {
  background: #e0f4ff;
}

.btn-row-remove {
  background: #ffe0e0;
}

.btn-row-add:hover {
  opacity: 0.9;
}

.btn-row-remove:hover {
  opacity: 0.9;
}

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

.text-small {
  font-size: 0.875em;
}
.ei-unit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap; /* บังคับให้อยู่บรรทัดเดียว */
}

.ei-unit-label {
  flex-shrink: 0; /* ป้องกันข้อความโดนบีบ */
  font-weight: 500;
}

.ei-unit-input {
  flex: 1; /* ยืดให้เต็มที่ */
  min-width: 250px; /* ความยาวขั้นต่ำ */
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>

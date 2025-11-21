```vue
<template>
  <!-- ใช้ MainLayout ครอบหน้าเหมือนตัวอย่างเดิม -->
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">
        แบบบันทึก F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์ : B-mode QC Test
      </h1>

      <!-- แคปซูลด้านบน -->
      <div class="pill-row">
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้บันทึก : {{ currentUserName }}</div>
      </div>

      <!-- กล่องเนื้อหาหลัก -->
      <div class="content-panel">
        <!-- =============== ส่วนที่ 1 : ข้อมูลเครื่องและการตั้งค่า =============== -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  ส่วนที่ 1 : ข้อมูลเครื่องและการตั้งค่า
                </td>
              </tr>

              <tr>
                <td class="cell-label">
                  วันที่ทดสอบ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="date"
                    class="input-text"
                    v-model="deviceForm.testDate"
                  />
                </td>
                <td class="cell-label">
                  ผู้ตรวจสอบ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.tester"
                    placeholder="กรอกชื่อผู้ตรวจสอบ"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">
                  ชื่อเครื่องอัลตราซาวด์ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.machineName"
                    placeholder="เช่น US-1 ห้อง ER"
                  />
                </td>
                <td class="cell-label">รุ่น</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.model"
                    placeholder="เช่น LOGIQ P9"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">เลขเครื่อง / Asset ID</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.assetId"
                    placeholder="ถ้ามี"
                  />
                </td>
                <td class="cell-label">แผนก / กลุ่มงาน</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.department"
                    placeholder="เช่น รังสีวิทยา"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">อายุเครื่อง (ปี)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    class="input-text"
                    v-model.number="deviceForm.ageYear"
                  />
                </td>
                <td class="cell-label">Probe</td>
                <td>
                  <select class="input-text" v-model="deviceForm.probeType">
                    <option value="">-- เลือกชนิด Probe --</option>
                    <option value="Convex">Convex</option>
                    <option value="Linear">Linear</option>
                    <option value="Endocavitary">Endocavitary</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>
                  </select>
                  <input
                    v-if="deviceForm.probeType === 'อื่น ๆ'"
                    type="text"
                    class="input-text mt-8"
                    v-model="deviceForm.probeOther"
                    placeholder="ระบุชนิด Probe"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Phantom</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.phantom"
                    placeholder="ยี่ห้อ/รุ่น Phantom"
                  />
                </td>
                <td class="cell-label">ความถี่ที่ใช้ (MHz)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="deviceForm.frequencyMHz"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Power</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.power"
                  />
                </td>
                <td class="cell-label">TGC</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.tgc"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Gain</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.gain"
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- =============== ส่วนที่ 2 : ผลการทดสอบ B-mode QC =============== -->

        <!-- 2.1 Image Uniformity -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 1 : Image Uniformity
                </td>
              </tr>

              <tr class="row-header-columns">
                <td class="cell-label">รายการทดสอบ</td>
                <td>Baseline</td>
                <td>ผลครั้งนี้</td>
                <td>หมายเหตุ</td>
              </tr>

              <tr>
                <td class="cell-label">Vertical band</td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.verticalBaseline"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.verticalCurrent"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
                <td rowspan="3">
                  <textarea
                    class="input-textarea"
                    v-model="imageUniformity.remark"
                    placeholder="บันทึกเพิ่มเติม (ถ้ามี)"
                  ></textarea>
                </td>
              </tr>

              <tr>
                <td class="cell-label">Horizontal band</td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.horizontalBaseline"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.horizontalCurrent"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td class="cell-label">Artifacts</td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.artifactBaseline"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
                <td>
                  <select
                    class="input-text"
                    v-model="imageUniformity.artifactCurrent"
                  >
                    <option value="">เลือก</option>
                    <option value="ปรากฏ">ปรากฏ</option>
                    <option value="ไม่ปรากฏ">ไม่ปรากฏ</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะ Image Uniformity</td>
                <td colspan="3">
                  <select
                    class="input-text"
                    v-model="imageUniformity.status"
                  >
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.2 Depth of Penetration -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 2 : Depth of Penetration
                </td>
              </tr>

              <tr>
                <td class="cell-label">Depth baseline (cm)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="depthTest.baseline"
                  />
                </td>
                <td class="cell-label">Depth measured (cm)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="depthTest.measured"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะ</td>
                <td>
                  <select class="input-text" v-model="depthTest.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
                <td class="cell-label">หมายเหตุ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="depthTest.remark"
                    placeholder="บันทึกเพิ่มเติม"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.3 Vertical Distance Accuracy -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 3 : Vertical Distance Accuracy
                </td>
              </tr>

              <tr class="row-header-columns">
                <td class="cell-label">รายการ</td>
                <td>ค่า (mm)</td>
                <td colspan="2">รายละเอียด</td>
              </tr>

              <tr>
                <td class="cell-label">Actual distance</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="verticalAcc.actualDistance"
                  />
                </td>
                <td class="cell-label">Error รวม (mm หรือ %)</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="verticalAcc.totalError"
                    placeholder="เช่น 1.2 mm หรือ 2%"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Measured segment 1</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="verticalAcc.segment1"
                  />
                </td>
                <td class="cell-label">Measured segment 2</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="verticalAcc.segment2"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะ</td>
                <td>
                  <select class="input-text" v-model="verticalAcc.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
                <td class="cell-label">หมายเหตุ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="verticalAcc.remark"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.4 Horizontal Distance Accuracy (โครงสร้างเหมือน Vertical) -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 4 : Horizontal Distance Accuracy
                </td>
              </tr>

              <tr class="row-header-columns">
                <td class="cell-label">รายการ</td>
                <td>ค่า (mm)</td>
                <td colspan="2">รายละเอียด</td>
              </tr>

              <tr>
                <td class="cell-label">Actual distance</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="horizontalAcc.actualDistance"
                  />
                </td>
                <td class="cell-label">Error รวม (mm หรือ %)</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="horizontalAcc.totalError"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Measured segment 1</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="horizontalAcc.segment1"
                  />
                </td>
                <td class="cell-label">Measured segment 2</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="horizontalAcc.segment2"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะ</td>
                <td>
                  <select class="input-text" v-model="horizontalAcc.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
                <td class="cell-label">หมายเหตุ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="horizontalAcc.remark"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.5 Lateral Resolution -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 5 : Lateral Resolution
                </td>
              </tr>

              <tr class="row-header-columns">
                <td class="cell-label">ตำแหน่ง</td>
                <td>Baseline (mm)</td>
                <td>Measured (mm)</td>
                <td>หมายเหตุ</td>
              </tr>

              <tr v-for="pos in ['Near', 'Mid', 'Far']" :key="pos">
                <td class="cell-label">{{ pos }}</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="lateralRes.baseline[pos]"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="lateralRes.measured[pos]"
                  />
                </td>
                <td
                  v-if="pos === 'Near'"
                  :rowspan="3"
                >
                  <textarea
                    class="input-textarea"
                    v-model="lateralRes.remark"
                  ></textarea>
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะรวม</td>
                <td colspan="3">
                  <select class="input-text" v-model="lateralRes.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.6 Axial Resolution -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 6 : Axial Resolution
                </td>
              </tr>

              <tr class="row-header-columns">
                <td class="cell-label">ตำแหน่ง</td>
                <td>Baseline (mm)</td>
                <td>Measured (mm)</td>
                <td>หมายเหตุ</td>
              </tr>

              <tr v-for="pos in ['Near', 'Mid', 'Far']" :key="pos">
                <td class="cell-label">{{ pos }}</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="axialRes.baseline[pos]"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="axialRes.measured[pos]"
                  />
                </td>
                <td
                  v-if="pos === 'Near'"
                  :rowspan="3"
                >
                  <textarea
                    class="input-textarea"
                    v-model="axialRes.remark"
                  ></textarea>
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะรวม</td>
                <td colspan="3">
                  <select class="input-text" v-model="axialRes.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2.7 Image Geometry & Gray Scale -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                  หัวข้อ 7 : Image Geometry & Gray Scale
                </td>
              </tr>

              <tr>
                <td class="cell-label">Cyst height baseline (mm)</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="geometry.cystHeightBaseline"
                  />
                </td>
                <td class="cell-label">Cyst height measured (mm)</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="geometry.cystHeightMeasured"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Cyst width baseline (mm)</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="geometry.cystWidthBaseline"
                  />
                </td>
                <td class="cell-label">Cyst width measured (mm)</td>
                <td>
                  <input
                    type="number"
                    step="0.1"
                    class="input-text"
                    v-model.number="geometry.cystWidthMeasured"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Image homogeneity</td>
                <td>
                  <select
                    class="input-text"
                    v-model="geometry.homogeneity"
                  >
                    <option value="">-- เลือก --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="มี band">มี band</option>
                    <option value="มี artifact">มี artifact</option>
                  </select>
                </td>
                <td class="cell-label">Dead zone (mm)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="geometry.deadZone"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">สถานะรวม</td>
                <td>
                  <select class="input-text" v-model="geometry.status">
                    <option value="">-- เลือกสถานะ --</option>
                    <option value="ปกติ">ปกติ</option>
                    <option value="Action level">Action level</option>
                    <option value="Defect level">Defect level</option>
                  </select>
                </td>
                <td class="cell-label">หมายเหตุ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="geometry.remark"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- =============== ส่วนที่ 3 : สรุปผล =============== -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">ส่วนที่ 3 : สรุปผล</td>
              </tr>

              <tr>
                <td class="cell-label">ผลสรุปการทดสอบ</td>
                <td>
                  <select class="input-text" v-model="summary.result">
                    <option value="">-- เลือกผลสรุป --</option>
                    <option value="ผ่าน">ผ่าน</option>
                    <option value="เฝ้าระวัง">เฝ้าระวัง</option>
                    <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                  </select>
                </td>
                <td class="cell-label">เวลาเริ่มทดสอบ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="summary.startTime"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">ข้อเสนอแนะ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="summary.recommendation"
                  ></textarea>
                </td>
                <td class="cell-label">เวลาสิ้นสุดทดสอบ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="summary.endTime"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่มด้านล่าง -->
        <div class="actions">
          <button type="button" class="btn-remark" @click="resetForm">
            ล้างแบบฟอร์ม
          </button>
          <button type="button" class="btn-save" @click="saveForm">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const props = defineProps({
  currentUserName: {
    type: String,
    default: 'Demo User'
  }
})

const router = useRouter()

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

/* ---------- ส่วนที่ 1 : ข้อมูลเครื่อง ---------- */
const deviceForm = ref({
  testDate: '',
  machineName: '',
  model: '',
  assetId: '',
  department: '',
  ageYear: null,
  probeType: '',
  probeOther: '',
  phantom: '',
  frequencyMHz: null,
  power: '',
  tgc: '',
  gain: '',
  tester: ''
})

/* ---------- 2.1 Image Uniformity ---------- */
const imageUniformity = ref({
  verticalBaseline: '',
  verticalCurrent: '',
  horizontalBaseline: '',
  horizontalCurrent: '',
  artifactBaseline: '',
  artifactCurrent: '',
  status: '',
  remark: ''
})

/* ---------- 2.2 Depth of Penetration ---------- */
const depthTest = ref({
  baseline: null,
  measured: null,
  status: '',
  remark: ''
})

/* ---------- 2.3 Vertical Distance Accuracy ---------- */
const verticalAcc = ref({
  actualDistance: null,
  segment1: null,
  segment2: null,
  totalError: '',
  status: '',
  remark: ''
})

/* ---------- 2.4 Horizontal Distance Accuracy ---------- */
const horizontalAcc = ref({
  actualDistance: null,
  segment1: null,
  segment2: null,
  totalError: '',
  status: '',
  remark: ''
})

/* ---------- 2.5 Lateral Resolution ---------- */
const lateralRes = ref({
  baseline: { Near: null, Mid: null, Far: null },
  measured: { Near: null, Mid: null, Far: null },
  status: '',
  remark: ''
})

/* ---------- 2.6 Axial Resolution ---------- */
const axialRes = ref({
  baseline: { Near: null, Mid: null, Far: null },
  measured: { Near: null, Mid: null, Far: null },
  status: '',
  remark: ''
})

/* ---------- 2.7 Image Geometry & Gray Scale ---------- */
const geometry = ref({
  cystHeightBaseline: null,
  cystHeightMeasured: null,
  cystWidthBaseline: null,
  cystWidthMeasured: null,
  homogeneity: '',
  deadZone: null,
  status: '',
  remark: ''
})

/* ---------- ส่วนที่ 3 : สรุปผล ---------- */
const summary = ref({
  result: '',
  recommendation: '',
  startTime: '',
  endTime: ''
})

/* ---------- ฟังก์ชันช่วย ---------- */
const resetForm = () => {
  deviceForm.value = {
    testDate: '',
    machineName: '',
    model: '',
    assetId: '',
    department: '',
    ageYear: null,
    probeType: '',
    probeOther: '',
    phantom: '',
    frequencyMHz: null,
    power: '',
    tgc: '',
    gain: '',
    tester: ''
  }

  imageUniformity.value = {
    verticalBaseline: '',
    verticalCurrent: '',
    horizontalBaseline: '',
    horizontalCurrent: '',
    artifactBaseline: '',
    artifactCurrent: '',
    status: '',
    remark: ''
  }

  depthTest.value = {
    baseline: null,
    measured: null,
    status: '',
    remark: ''
  }

  verticalAcc.value = {
    actualDistance: null,
    segment1: null,
    segment2: null,
    totalError: '',
    status: '',
    remark: ''
  }

  horizontalAcc.value = {
    actualDistance: null,
    segment1: null,
    segment2: null,
    totalError: '',
    status: '',
    remark: ''
  }

  lateralRes.value = {
    baseline: { Near: null, Mid: null, Far: null },
    measured: { Near: null, Mid: null, Far: null },
    status: '',
    remark: ''
  }

  axialRes.value = {
    baseline: { Near: null, Mid: null, Far: null },
    measured: { Near: null, Mid: null, Far: null },
    status: '',
    remark: ''
  }

  geometry.value = {
    cystHeightBaseline: null,
    cystHeightMeasured: null,
    cystWidthBaseline: null,
    cystWidthMeasured: null,
    homogeneity: '',
    deadZone: null,
    status: '',
    remark: ''
  }

  summary.value = {
    result: '',
    recommendation: '',
    startTime: '',
    endTime: ''
  }
}

/* ตรวจ field จำเป็นแบบง่าย ๆ */
const validateForm = () => {
  const errors = []

  if (!deviceForm.value.testDate) errors.push('กรุณากรอกวันที่ทดสอบ')
  if (!deviceForm.value.machineName)
    errors.push('กรุณากรอกชื่อเครื่องอัลตราซาวด์')
  if (!deviceForm.value.tester) errors.push('กรุณากรอกชื่อผู้ตรวจสอบ')

  if (errors.length) {
    alert(errors.join('\n'))
    return false
  }
  return true
}

/* บันทึกแล้วไปหน้า Dashboard */
const saveForm = () => {
  if (!validateForm()) return

  const payload = {
    deviceForm: deviceForm.value,
    imageUniformity: imageUniformity.value,
    depthTest: depthTest.value,
    verticalAcc: verticalAcc.value,
    horizontalAcc: horizontalAcc.value,
    lateralRes: lateralRes.value,
    axialRes: axialRes.value,
    geometry: geometry.value,
    summary: summary.value
  }

  console.log('F13 payload :', payload)

  router.push('/dashboard')
}
</script>

<style scoped>
/* พื้นที่ทำงานหลักของหน้า (content ใน MainLayout) */
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

/* หัวข้อหลัก */
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

/* แถวแคปซูลด้านบน */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.pill {
  background: #ffb480;
  color: #111827;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

/* กล่องเนื้อหากลาง */
.content-panel {
  background: #ffffff;
  padding: 20px 24px 28px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

/* ตาราง */
.table-wrapper {
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table td {
  padding: 10px 12px;
  vertical-align: top;
  border-bottom: 1px solid #e5e7eb;
}

/* แถวหัวข้อใหญ่สีน้ำเงิน */
.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

/* หัวคอลัมน์ */
.row-header-columns td {
  font-weight: 600;
  background: #f3f4f6;
}

/* สีพื้นสลับแถว */
.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #f9fafb;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #e5e7eb;
}

.cell-label {
  width: 25%;
}

.text-center {
  text-align: center;
}

/* Input พื้นฐาน */
.input-text {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mt-8 {
  margin-top: 8px;
}

/* ปุ่มด้านล่าง */
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-remark,
.btn-save {
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-remark {
  background: #ff6b81;
  color: #ffffff;
}

.btn-remark:hover {
  background: #e0556a;
}

.btn-save {
  background: #65d46e;
  color: #ffffff;
}

.btn-save:hover {
  background: #4fb759;
}

/* responsive เล็กน้อย */
@media (max-width: 768px) {
  .checklist-page {
    padding: 16px;
  }
  .pill-row {
    gap: 8px;
  }
  .pill {
    font-size: 0.8rem;
  }
}
</style>
```

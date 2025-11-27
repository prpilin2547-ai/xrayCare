<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + แผ่น A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะหายไปตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F7-1
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ===== หัวฟอร์ม ===== -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F7-1 : การทดสอบ Collimator and Beam Alignment
          </div>
          <div class="title-sub">
            ความถี่ : {{ header.frequency }}
          </div>

          <div class="title-sub machine-row">
            เครื่องเอกซเรย์ยี่ห้อ
            <span class="underline medium">
              {{ header.machineBrand }}
            </span>
            รุ่น
            <span class="underline medium">
              {{ header.machineModel }}
            </span>
            ห้อง
            <span class="underline short">
              {{ header.roomNo }}
            </span>
          </div>
        </div>

        <!-- ===== กล่องข้อมูลวันที่ / ผู้ทดสอบ ===== -->
        <table class="box-table">
          <tr>
            <td class="label-cell">วันที่ทดสอบ :</td>
            <td class="value-cell">
              <span class="underline long">
                {{ header.testDate }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="label-cell">ผู้ทดสอบ :</td>
            <td class="value-cell">
              <span class="underline long">
                {{ header.tester }}
              </span>
            </td>
          </tr>
        </table>

        <!-- ===== ส่วนเลือกอุปกรณ์ที่ใช้ทดสอบ ===== -->
        <table class="box-table">
          <tr>
            <td class="label-cell top-align">อุปกรณ์ที่ใช้ทดสอบ :</td>
            <td class="value-cell">
              <div class="option-row">
                <span class="bullet">
                  {{ header.deviceType === 'small-tube' ? '●' : '○' }}
                </span>
                หลอดใสเล็ก
              </div>
              <div class="option-row">
                <span class="bullet">
                  {{ header.deviceType === 'large-tube' ? '●' : '○' }}
                </span>
                หลอดใสใหญ่
              </div>
              <div class="option-row">
                <span class="bullet">
                  {{ header.deviceType === 'test-tool' ? '●' : '○' }}
                </span>
                ทดสอบโดย Collimator / Beam alignment test tool
              </div>
              <div class="option-row">
                <span class="bullet">
                  {{ header.deviceType === 'coins' ? '●' : '○' }}
                </span>
                ทดสอบโดย Coins for x-ray to light-beam alignment test
              </div>
            </td>
          </tr>
        </table>

        <!-- หมายเหตุเกณฑ์ความเบี่ยงเบน -->
        <div class="note-block">
          ความเบี่ยงเบนระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 1 cm หรือ 1% ที่ SID 100 cm)<br />
          * หมายถึงลำรังสีมีขนาดเท่ากับช่องแสงตามมาตรฐาน หมายถึงลำรังสีมีขนาดเล็กกว่าขนาดเขตจริง
        </div>

        <!-- ===== ตารางความเบี่ยงเบนระหว่างลำรังสีกับลำแสงไฟ ===== -->
        <table class="main-table">
          <thead>
            <tr>
              <th class="col-pos">ตำแหน่ง</th>
              <th class="col-offset">ค่าเบี่ยงเบน (cm)</th>
              <th class="col-pass">Pass</th>
              <th class="col-fail">Fail</th>
              <th class="col-note">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in misalignmentRows" :key="row.key">
              <td class="align-left">
                {{ row.label }}
              </td>
              <td>
                {{ row.value }}
              </td>
              <td>
                <span v-if="row.result === 'P'">✓</span>
              </td>
              <td>
                <span v-if="row.result === 'F'">✓</span>
              </td>
              <td class="align-left">
                {{ row.note }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ===== Beam Alignment ===== -->
        <div class="beam-title">
          Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
        </div>

        <table class="main-table">
          <thead>
            <tr>
              <th class="col-pos">Beam Alignment</th>
              <th class="col-pass">Pass</th>
              <th class="col-fail">Fail</th>
              <th class="col-note">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in beamRows" :key="row.key">
              <td class="align-left">{{ row.label }}</td>
              <td>
                <span v-if="row.result === 'P'">✓</span>
              </td>
              <td>
                <span v-if="row.result === 'F'">✓</span>
              </td>
              <td class="align-left">
                {{ row.note }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ช่องลงชื่อ -->
        <div class="sign-block">
          ลงชื่อ...............................................................ผู้ทดสอบ<br />
          (...........................................................................)<br />
          ตำแหน่ง..............................................................
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ----------------------- Header + ข้อมูลทั่วไป -----------------------
const header = ref({
  frequency: 'ทุก 6 เดือน',
  machineBrand: '',
  machineModel: '',
  roomNo: '',
  testDate: '',
  tester: '',
  deviceType: '', // 'small-tube' | 'large-tube' | 'test-tool' | 'coins'
})

// ----------------------- ข้อมูลความเบี่ยงเบน ------------------------
// โครงข้อมูลดิบจากฐาน (ตัวอย่างเริ่มต้น)
const misalignment = ref({
  topIn: { offset: '', result: '', note: '' },
  bottomIn: { offset: '', result: '', note: '' },
  left: { offset: '', result: '', note: '' },
  right: { offset: '', result: '', note: '' },
})

// แปลงเป็น array สำหรับ v-for
const misalignmentRows = computed(() => [
  {
    key: 'topIn',
    label: 'ด้านบนในกรอบ',
    value: misalignment.value.topIn.offset,
    result: misalignment.value.topIn.result,
    note: misalignment.value.topIn.note,
  },
  {
    key: 'bottomIn',
    label: 'ด้านล่างในกรอบ',
    value: misalignment.value.bottomIn.offset,
    result: misalignment.value.bottomIn.result,
    note: misalignment.value.bottomIn.note,
  },
  {
    key: 'left',
    label: 'ด้านซ้าย',
    value: misalignment.value.left.offset,
    result: misalignment.value.left.result,
    note: misalignment.value.left.note,
  },
  {
    key: 'right',
    label: 'ด้านขวา',
    value: misalignment.value.right.offset,
    result: misalignment.value.right.result,
    note: misalignment.value.right.note,
  },
])

// ----------------------- ข้อมูล Beam Alignment ----------------------
const beamAlignment = ref({
  lt1_5: { result: '', note: '' }, // < 1.5°
  btw1_5_3: { result: '', note: '' }, // 1.5° ≤ X < 3°
  gte3: { result: '', note: '' }, // ≥ 3°
})

const beamRows = computed(() => [
  {
    key: 'lt1_5',
    label: '< 1.5°',
    result: beamAlignment.value.lt1_5.result,
    note: beamAlignment.value.lt1_5.note,
  },
  {
    key: 'btw1_5_3',
    label: '1.5° ≤ X < 3°',
    result: beamAlignment.value.btw1_5_3.result,
    note: beamAlignment.value.btw1_5_3.note,
  },
  {
    key: 'gte3',
    label: '≥ 3°',
    result: beamAlignment.value.gte3.result,
    note: beamAlignment.value.gte3.note,
  },
])

// ----------------------- พิมพ์ -----------------------
function handlePrint () {
  window.print()
}

// ----------------------- ดึงข้อมูลจากฐาน -----------------------
// ปรับ URL และ mapping ให้ตรงกับ backend ของคุณ
onMounted(async () => {
  const id = route.params.id

  // ตัวอย่างโครง API (comment ไว้ให้ไปต่อเอง)
  /*
  const res = await fetch(`/api/f7-1/${id}`)
  const data = await res.json()

  header.value = {
    frequency: data.frequency || 'ทุก 6 เดือน',
    machineBrand: data.machineBrand,
    machineModel: data.machineModel,
    roomNo: data.roomNo,
    testDate: data.testDate,         // แปลงรูปแบบวันที่เป็น dd/MM/yyyy ก่อนก็ได้
    tester: data.tester,
    deviceType: data.deviceType,     // 'small-tube' | 'large-tube' | 'test-tool' | 'coins'
  }

  misalignment.value = data.misalignment
  beamAlignment.value = data.beamAlignment
  */
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลังนอก */
.print-root {
  background: #111827;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม Print */
.print-toolbar {
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 16px;
}

/* A4 */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 180mm;
  padding: 18mm 0 16mm;
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: left;
  margin-bottom: 6mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
  text-align: left;
  margin-bottom: 2mm;
}

.title-sub {
  font-size: 14pt;
  margin-bottom: 2mm;
}

.machine-row {
  margin-top: 2mm;
}

/* เส้นกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short {
  min-width: 25mm;
}
.medium {
  min-width: 35mm;
}
.long {
  min-width: 60mm;
}

/* ตารางกรอบบน */
.box-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 4mm;
  font-size: 13pt;
}

.box-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 2mm;
}

.label-cell {
  width: 35mm;
  vertical-align: top;
}

.value-cell {
  vertical-align: top;
}

.top-align {
  vertical-align: top;
}

/* อุปกรณ์ทดสอบ */
.option-row {
  display: flex;
  align-items: center;
  gap: 3mm;
  line-height: 1.3;
}

.bullet {
  display: inline-block;
  width: 8mm;
}

/* หมายเหตุข้อความ */
.note-block {
  margin: 2mm 0 4mm;
  font-size: 13pt;
}

/* ตารางหลักด้านล่าง */
.main-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13pt;
  margin-bottom: 4mm;
}

.main-table th,
.main-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  text-align: center;
  vertical-align: middle;
}

.col-pos {
  width: 55mm;
}
.col-offset {
  width: 25mm;
}
.col-pass,
.col-fail {
  width: 18mm;
}
.col-note {
  width: auto;
}

.align-left {
  text-align: left;
}

/* Beam title */
.beam-title {
  margin: 4mm 0 2mm;
  font-size: 14pt;
}

/* ลงชื่อ */
.sign-block {
  margin-top: 8mm;
  font-size: 14pt;
}

/* การพิมพ์ */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-toolbar {
    display: none;
  }
  .print-root {
    background: #ffffff;
    padding: 0;
  }
  .sheet-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
  }
}
</style>

<template>
  <!-- หน้าโล่งสำหรับปริ้น -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะถูกซ่อนตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      style="margin-right:6px;"
    >
      <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"/>
    </svg>
      Print
    </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F7-2 : การทดสอบ Collimator and Beam Alignment
          </div>
          <div class="title-sub">
            สำหรับ DR ติดกับ Bucky (ไม่สามารถถอดออกได้)
          </div>
        </div>

        <!-- ความถี่ + ข้อมูลเครื่อง -->
        <div class="meta-block">
          <div class="meta-row">
            ความถี่ :
            <span class="underline short">
              {{ header.frequency }}
            </span>
          </div>

          <div class="meta-row">
            เครื่องเอกซเรย์ยี่ห้อ
            <span class="underline mid">
              {{ header.machineBrand }}
            </span>
            รุ่น
            <span class="underline mid">
              {{ header.machineModel }}
            </span>
          </div>
        </div>

        <!-- ตารางส่วนบน (วันที่ / ผู้ทดสอบ / อุปกรณ์ทดสอบ) -->
        <table class="f7-table top-table">
          <tbody>
            <tr>
              <td class="col-label">
                วัน/เดือน/ปี ที่ทดสอบ :
              </td>
              <td class="col-fill">
                {{ header.testDate }}
              </td>
            </tr>
            <tr>
              <td class="col-label">
                ผู้ทดสอบ :
              </td>
              <td class="col-fill">
                {{ header.testerName }}
              </td>
            </tr>
            <tr>
              <td class="col-label">
                อุปกรณ์ทดสอบ :
              </td>
              <td class="col-fill">
                <div class="tool-line">
                  <span class="tool-mark">
                    {{ header.toolType === 'small-tube' ? '●' : '○' }}
                  </span>
                  หลอดใสเล็ก
                </div>
                <div class="tool-line">
                  <span class="tool-mark">
                    {{ header.toolType === 'large-tube' ? '●' : '○' }}
                  </span>
                  หลอดใสใหญ่
                </div>
                <div class="tool-line">
                  <span class="tool-mark">
                    {{ header.toolType === 'collimator-tool' ? '●' : '○' }}
                  </span>
                  ทดสอบโดย Collimator/Beam alignment test tool
                </div>
                <div class="tool-line">
                  <span class="tool-mark">
                    {{ header.toolType === 'coins' ? '●' : '○' }}
                  </span>
                  ทดสอบโดย Coins for x-ray to light-beam alignment test
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ข้อความเกณฑ์ -->
        <div class="note-block">
          ความเบี่ยงเบนระหว่างลำรังสีกับลำแสงไฟ
          (ไม่เกิน ± 2 cm หรือ 2% ที่ SID 100 cm)<br />
          + หมายถึงลำรังสีมีขนาดเท่ากับช่องแสงมาตรฐาน
          − หมายถึงลำรังสีมีขนาดเล็กกว่าขนาดเขตจริง
        </div>

        <!-- ตารางค่าความเบี่ยงเบน -->
        <table class="f7-table">
          <thead>
            <tr>
              <th class="col-pos">ความเบี่ยงเบนระหว่างลำรังสีกับลำแสงไฟ</th>
              <th class="col-width">ค่าเบี่ยงเบน (cm)</th>
              <th class="col-small">Pass</th>
              <th class="col-small">Fail</th>
              <th class="col-note">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in deviationRows" :key="row.key">
              <td class="align-left">{{ row.label }}</td>
              <td>{{ deviations[row.key]?.value ?? '' }}</td>
              <td>
                <span v-if="deviations[row.key]?.result === 'pass'">✓</span>
              </td>
              <td>
                <span v-if="deviations[row.key]?.result === 'fail'">✗</span>
              </td>
              <td class="align-left">
                {{ deviations[row.key]?.note ?? '' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Beam Alignment -->
        <div class="beam-header">
          Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
        </div>

        <table class="f7-table">
          <thead>
            <tr>
              <th class="col-pos">Beam Alignment</th>
              <th class="col-small">Pass</th>
              <th class="col-small">Fail</th>
              <th class="col-note">Note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in beamRows" :key="row.key">
              <td class="align-left">
                {{ row.label }}
              </td>
              <td>
                <span v-if="beamAlignment[row.key]?.result === 'pass'">✓</span>
              </td>
              <td>
                <span v-if="beamAlignment[row.key]?.result === 'fail'">✗</span>
              </td>
              <td class="align-left">
                {{ beamAlignment[row.key]?.note ?? '' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ลายเซ็น -->
        <div class="sign-block">
          ลงชื่อ............................................................ ผู้ทดสอบ<br />
          (.........................................................................)<br />
          ตำแหน่ง............................................................
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// header จากฐานข้อมูล
const header = ref({
  frequency: 'ทุก 6 เดือน',
  machineBrand: '',
  machineModel: '',
  testDate: '',
  testerName: '',
  toolType: '', // 'small-tube' | 'large-tube' | 'collimator-tool' | 'coins'
})

// ค่าความเบี่ยงเบน 4 ตำแหน่ง
// key จะตรงกับข้อมูลที่ backend ส่งมา เช่น top, bottom, left, right
const deviations = ref({
  // ตัวอย่างโครง:
  // top:    { value: '0.5', result: 'pass', note: '' },
  // bottom: { value: '0.3', result: 'pass', note: '' },
})

// Beam alignment 3 ช่วง
const beamAlignment = ref({
  // low:  { result: 'pass', note: '' },
  // mid:  { result: '',     note: '' },
  // high: { result: '',     note: '' },
})

// ใช้สำหรับวน table
const deviationRows = [
  { key: 'top', label: 'ด้านบนในภาพ' },
  { key: 'bottom', label: 'ด้านล่างในภาพ' },
  { key: 'left', label: 'ด้านซ้าย' },
  { key: 'right', label: 'ด้านขวา' },
]

const beamRows = [
  { key: 'low', label: '< 1.5°' },
  { key: 'mid', label: '1.5° ≤ X < 3°' },
  { key: 'high', label: '≥ 3°' },
]

// สั่งพิมพ์
function handlePrint() {
  window.print()
}

// โหลดข้อมูลจากฐาน
onMounted(async () => {
  const id = route.params.id

  // *** แก้ URL/โครงข้อมูลให้ตรง backend ของคุณ ***
  // ตัวอย่างโครง JSON ที่คาดหวัง:
  // {
  //   "header": {
  //     "frequency": "ทุก 6 เดือน",
  //     "machineBrand": "...",
  //     "machineModel": "...",
  //     "testDate": "01/11/2568",
  //     "testerName": "น.ส.รังสี ผู้ทดสอบ",
  //     "toolType": "collimator-tool"
  //   },
  //   "deviations": {
  //     "top":    { "value": "0.5", "result": "pass", "note": "" },
  //     "bottom": { "value": "0.7", "result": "pass", "note": "" },
  //     "left":   { "value": "1.0", "result": "fail", "note": "เกินเกณฑ์" },
  //     "right":  { "value": "0.3", "result": "pass", "note": "" }
  //   },
  //   "beamAlignment": {
  //     "low":  { "result": "pass", "note": "" },
  //     "mid":  { "result": "",     "note": "" },
  //     "high": { "result": "",     "note": "" }
  //   }
  // }

  // try {
  //   const res = await fetch(`/api/print/f7-2/${id}`)
  //   const data = await res.json()
  //   header.value = { ...header.value, ...data.header }
  //   deviations.value = data.deviations || {}
  //   beamAlignment.value = data.beamAlignment || {}
  // } catch (e) {
  //   console.error('โหลดข้อมูล F7-2 ไม่สำเร็จ', e)
  // }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

.print-root {
  background: #e5e7eb;   /* เทาอ่อนแบบภาพที่หนึ่ง */
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}


/* ปุ่ม print */
.print-toolbar {
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #ffffff;
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
  padding: 18mm 0 18mm;
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  font-size: 16pt;
}

/* Meta block */
.meta-block {
  margin-left: 10mm;
  margin-top: 6mm;
  margin-bottom: 6mm;
  font-size: 14pt;
}

.meta-row {
  margin-bottom: 3mm;
}

/* underline */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short {
  min-width: 40mm;
}
.mid {
  min-width: 40mm;
}

/* ตารางบน */
.f7-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f7-table th,
.f7-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.top-table .col-label {
  width: 40mm;
  text-align: left;
}
.top-table .col-fill {
  text-align: left;
}

/* อุปกรณ์ทดสอบ */
.tool-line {
  display: flex;
  align-items: center;
  gap: 2mm;
  line-height: 1.2;
}
.tool-mark {
  display: inline-block;
  width: 10mm;
}

/* คอลัมน์ตารางหลัก */
.col-pos {
  width: 55mm;
}
.col-width {
  width: 30mm;
}
.col-small {
  width: 18mm;
}
.col-note {
  width: 45mm;
}

.align-left {
  text-align: left;
}

/* เกณฑ์ข้อความ */
.note-block {
  margin-top: 4mm;
  margin-bottom: 4mm;
  font-size: 13pt;
}

/* Beam header */
.beam-header {
  margin-top: 6mm;
  margin-bottom: 2mm;
  font-size: 14pt;
  font-weight: 700;
}

/* ลายเซ็น */
.sign-block {
  margin-top: 10mm;
  text-align: left;
  font-size: 14pt;
}

/* พอเข้าสู่โหมดพิมพ์ */
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

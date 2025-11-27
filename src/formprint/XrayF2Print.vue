<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม print + A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะหายไปตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        <span class="print-icon">🖨</span>
        <span class="print-text">Print</span>
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <!-- บรรทัดแรก: หัวฟอร์มตัวหนา 18 pt ชิดซ้าย -->
          <div class="title-main">
            แบบบันทึก F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)
          </div>

          <!-- เว้น 1 บรรทัด แล้วให้ 2 บรรทัดถัดไปอยู่กลางหน้า -->
          <div class="title-center-block">
            <div class="title-sub">
              แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์
            </div>
            <div class="title-sub">
              ปีงบประมาณ พ.ศ.
              <span class="underline inline">
                {{ record.fiscalYear }}
              </span>
            </div>
          </div>
        </div>

        <!-- เว้น 1 บรรทัด แล้วแสดงความถี่ + หมายเลข IP ชิดซ้าย ตรงกับหัวข้อหลัก -->
        <div class="meta-inline">
          <span>ความถี่ :</span>
          <span class="underline meta-short">
            {{ record.frequency }}
          </span>

          <span class="meta-gap"></span>

          <span>หมายเลข IP</span>
          <span class="underline meta-long">
            {{ record.ipNumber }}
          </span>
        </div>

        <!-- ตาราง 3 ชุด (เหมือนภาพ) -->
        <div
          v-for="(section, index) in monthSections"
          :key="index"
          class="month-block"
        >
          <table class="f2-table">
            <thead>
              <tr>
                <th class="col-left">เดือน/รายการ/วันที่</th>
                <th
                  v-for="d in 20"
                  :key="d"
                  class="col-day"
                >
                  {{ d }}
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- แถวที่ 1 : เดือน ............ -->
              <tr>
                <td class="col-left align-left">
                  <div class="cell-left-wrapper">
                    เดือน
                    <span class="dotted-line">
                      {{ section.monthLabel || '..................' }}
                    </span>
                  </div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'m-' + d"
                  class="col-day"
                >
                  &nbsp;
                </td>
              </tr>

              <!-- แถวที่ 2 : ผลการทดสอบ Pass / Fail -->
              <tr>
                <td class="col-left align-left">
                  <div class="cell-left-wrapper">
                    <div>ผลการทดสอบ</div>
                    <div>Pass (✓) / Fail (✗)</div>
                  </div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'r-' + d"
                  class="col-day"
                >
                  <span v-if="section.results[d] === 'pass'">✓</span>
                  <span v-else-if="section.results[d] === 'fail'">✗</span>
                </td>
              </tr>

              <!-- แถวที่ 3 : สภาพผิดปกติของแผ่นหรือด้านบนบนภาพ -->
              <tr>
                <td class="col-left align-left">
                  <div class="cell-left-wrapper multi-line">
                    <div>สภาพผิดปกติ</div>
                    <div>ของแผ่น</div>
                    <div>หรือด้านบนบนภาพ</div>
                  </div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'a-' + d"
                  class="col-day align-left"
                >
                  {{ section.appearance[d] || '' }}
                </td>
              </tr>

              <!-- แถวที่ 4 : ผู้ตรวจสอบ -->
              <tr>
                <td class="col-left align-left">
                  <div class="cell-left-wrapper">
                    ผู้ตรวจสอบ
                  </div>
                </td>
                <td
                  colspan="20"
                  class="align-left"
                >
                  <span class="bottom-line">
                    {{ section.inspector || record.inspector }}
                  </span>
                </td>
              </tr>

              <!-- แถวที่ 5 : ผลการตรวจสอบ (สรุป) -->
              <tr>
                <td class="col-left align-left">
                  <div class="cell-left-wrapper">
                    ผลการตรวจสอบ
                  </div>
                </td>
                <td
                  colspan="20"
                  class="align-left"
                >
                  {{ section.summaryResult || record.summaryResult }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ---------------------------
// ข้อมูลหัวฟอร์ม (ดึงมาจากการบันทึกจริง)
// ---------------------------
const record = ref({
  fiscalYear: '...............', // ปีงบประมาณ พ.ศ.
  frequency: 'ทุกวัน',           // ความถี่
  ipNumber: '..................', // หมายเลข IP
  inspector: '..............................', // ผู้ตรวจสอบ
  summaryResult: '................................................' // ผลการตรวจสอบ
})

// ---------------------------
// 3 ชุดตารางตามภาพ
// ---------------------------
const monthSections = ref([
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' },
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' },
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' }
])

function handlePrint () {
  // เปิด dialog พิมพ์ของ browser (Chrome/Edge)
  window.print()
}

// โหลดข้อมูลจริงจาก backend
onMounted(async () => {
  const id = route.params.id

  // ตัวอย่างโครง API — แก้ URL และโครงให้ตรงกับ backend ของคุณ
  // const res = await fetch(`/api/f2/${id}`)
  // const data = await res.json()
  //
  // record.value = {
  //   fiscalYear: data.fiscalYear,
  //   frequency: data.frequency,
  //   ipNumber: data.ipNumber,
  //   inspector: data.inspector,
  //   summaryResult: data.summaryResult
  // }
  //
  // monthSections.value = data.sections
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ใช้ TH Sarabun ให้ทั้งหน้า */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลังนอก A4 */
.print-root {
  background: #111827;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม print แบบเดียวกับภาพที่ 1 */
.print-toolbar {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.btn-print {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  background: #f9fafb;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  cursor: pointer;
  font-size: 16px;
}

.btn-print:hover {
  background: #e5e7eb;
}

.print-icon {
  font-size: 18px;
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
  padding: 18mm 0 14mm;
  font-size: 16pt; /* ข้อความทั่ว ๆ ไป 16 pt */
}

/* Header */
.header-main {
  margin-bottom: 8mm;
}

/* หัวฟอร์มหลัก 18 pt ชิดซ้าย */
.title-main {
  font-weight: 700;
  font-size: 18pt;
  text-align: left;
  margin-bottom: 4mm; /* เว้น 1 บรรทัด */
}

/* บล็อกกลางสำหรับ 2 บรรทัดถัดไป */
.title-center-block {
  text-align: center;
}

.title-sub {
  margin-bottom: 2mm;
  font-size: 16pt;
}

/* ความถี่ + หมายเลข IP ชิดซ้าย ตรงกับหัวข้อหลัก */
.meta-inline {
  margin-top: 8mm;  /* เว้น 1 บรรทัดจากหัวฟอร์ม */
  margin-bottom: 6mm;
  font-size: 16pt;
  text-align: left;
}

.meta-short {
  min-width: 35mm;
  margin-left: 4px;
}

.meta-long {
  min-width: 60mm;
  margin-left: 4px;
}

.meta-gap {
  display: inline-block;
  width: 16mm;
}

/* เส้นสำหรับกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.inline {
  min-width: 40mm;
}

/* ตารางหลัก */
.month-block {
  margin-bottom: 12mm; /* ระยะห่างระหว่าง 3 กรอบให้เท่ากัน */
}

.f2-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 16pt;
}

.f2-table th,
.f2-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

/* คอลัมน์ซ้ายให้ข้อความชิดซ้ายแต่จัดกึ่งกลางแนวตั้งด้วย flex */
.col-left {
  width: 48mm;
  text-align: left;
}

.col-day {
  width: 7mm;
}

.align-left {
  text-align: left;
}

/* wrapper ในเซลล์ซ้ายเพื่อให้ข้อความอยู่กลางเซลล์แนวตั้ง */
.cell-left-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.multi-line div {
  line-height: 1.2;
}

/* เส้นปะหลังคำว่า เดือน .......... */
.dotted-line {
  display: inline-block;
  min-width: 32mm;
}

/* เส้นใต้ยาวสำหรับชื่อผู้ตรวจสอบ */
.bottom-line {
  display: inline-block;
  min-width: 90mm;
  border-bottom: 0.4pt solid #000;
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

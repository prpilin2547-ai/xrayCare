<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม print + A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะหายไปตอนสั่งพิมพ์) -->
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
          <path
            d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"
          />
        </svg>
        Print
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <!-- บรรทัดแรก -->
          <div class="title-main">
            แบบบันทึก F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)
          </div>

          <!-- 2 บรรทัดกลาง -->
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

        <!-- ความถี่ + หมายเลข IP -->
        <div class="meta-inline">
          <div class="meta-row-inline">
            <span>ความถี่ :</span>
            <!-- ยังใช้ class meta-short แต่ไปตัดเส้นใน CSS -->
            <span class="underline meta-short">
              {{ record.frequency }}
            </span>
          </div>

          <div class="meta-row-inline">
            <span>หมายเลข IP</span>
            <span class="underline meta-long">
              {{ record.ipNumber }}
            </span>
          </div>
        </div>

        <!-- ตาราง 3 ชุด -->
        <div
          v-for="(section, index) in monthSections"
          :key="index"
          class="month-block"
        >
          <table class="f2-table">
            <thead>
              <tr>
                <th class="col-left">
                  เดือน/รายการ/วันที่
                </th>
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
  <!-- แถวที่ 1 : เดือน -->
  <tr>
    <!-- คอลัมน์ซ้าย -->
    <td class="col-left align-center">
      เดือน
      <div>
        <span class="dotted-line">{{ section.monthLabel }}</span>
      </div>
    </td>

    <!-- คอลัมน์วันที่ -->
    <td
      v-for="d in 20"
      :key="'m-' + d"
      class="col-day"
    >
      &nbsp;
    </td>
  </tr>

  <!-- แถวที่ 2 : ผลการทดสอบ -->
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

  <!-- แถวที่ 3 : สภาพผิดปกติ -->
  <tr>
    <td class="col-left align-left">
      <div class="cell-left-wrapper multi-line">
        <div>สภาพผิดปกติ</div>
        <div>ของแผ่น</div>
        <div>หรือตำแหน่งบนภาพ</div>
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

    <td colspan="20" class="align-left">
      <span class="bottom-line">{{ section.inspector || record.inspector }}</span>
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

const record = ref({
  fiscalYear: '',      // ปีงบประมาณ พ.ศ.
  frequency: 'ทุกวัน',
  ipNumber: '',
  inspector: '',
  summaryResult: ''
})

const monthSections = ref([
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' },
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' },
  { monthLabel: '', results: {}, appearance: {}, inspector: '', summaryResult: '' }
])

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  // โหลดจาก backend ถ้ามี
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt !important;
}

/* พื้นหลังหน้า */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม Print */
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
  width: 172mm;              /* แคบลงให้ขยับเข้าเหมือนต้นฉบับ */
  padding: 18mm 0 14mm;
}

/* หัวฟอร์ม */
.title-main {
  font-weight: 700;
  font-size: 13pt !important;
  text-align: left;
  margin-bottom: 4mm;
}

.title-center-block {
  text-align: center;
}

.title-sub {
  margin-bottom: 2mm;
}

/* ความถี่ + หมายเลข IP */
.meta-inline {
  margin-top: 8mm;
  margin-bottom: 6mm;
  text-align: left;
  margin-left: 0 !important;     /* ← เลื่อนมาชิดซ้าย */
  padding-left: 2mm !important;  /* ← กันไม่ให้ชิดเกินไป */
}


.meta-row-inline {
  margin-bottom: 2mm;
}

/* *** แก้: meta-short ไม่ให้มีเส้นใต้ทุกวัน *** */
.meta-short {
  min-width: 28mm;
  margin-left: 4px;
  border-bottom: none !important;  /* ตัดเส้นใต้ */
}

/* ยังให้หมายเลข IP มีเส้นอยู่ตามเดิม */
.meta-long {
  min-width: 50mm;
  margin-left: 4px;
}

/* เส้นกรอกข้อมูล (ทั่วไป) */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.inline {
  min-width: 20mm;
}

/* ตาราง */
.month-block {
  margin-bottom: 12mm;
}

.f2-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.f2-table th,
.f2-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

/* หัวคอลัมน์ซ้ายให้จัดกลาง แต่แถวอื่นชิดซ้าย */
.col-left {
  width: 42mm;               /* แคบลงให้ใกล้ต้นฉบับ */
}

.f2-table td.col-left {
  text-align: left;
}

.col-day {
  width: 7mm;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center !important;
  vertical-align: middle !important;
}

.cell-left-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.multi-line div {
  line-height: 1.2;
}

.dotted-line {
  display: inline-block;
  min-width: 30mm;
}

/* *** แก้: bottom-line ไม่ให้มีเส้นใต้ในช่องผู้ตรวจสอบ *** */
.bottom-line {
  display: inline-block;
  min-width: 90mm;
  border-bottom: none !important;  /* ตัดเส้นใต้ทั้งหมด */
}

/* Print mode */
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

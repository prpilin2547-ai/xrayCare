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
    <!-- รวมคอลัมน์ 1–2 แล้ว -->
    <th class="col-left" colspan="2">เดือน/รายการ/วันที่</th>

    <!-- คอลัมน์ 3–22 = ตัวเลข 1–20 -->
    <th
      v-for="d in 20"
      :key="'hd-' + d"
      class="col-day"
    >
      {{ d }}
    </th>
  </tr>
</thead>

<tbody>
  <!-- แถวที่ 2 -->
  <tr>
    <td class="col-month" rowspan="3">
      <div class="month-wrapper">
      <div class="month-label">เดือน</div>
    <span class="underline month-line">{{ section.monthLabel }}</span>
  </div>
</td>


    <!-- คอลัมน์ที่ 2 -->
    <td class="col-second">
      ผลการทดสอบ<br>Pass (✓) / Fail (✗)
    </td>

    <!-- คอลัมน์วันที่ -->
    <td v-for="d in 20" :key="'r2-'+d" class="col-day">&nbsp;</td>
  </tr>

  <!-- แถวที่ 3 -->
  <tr>
    <!-- คอลัมน์ที่ 1 ไม่ต้องมี (ถูก rowspan ไว้แล้ว) -->

    <td class="col-second">
      สภาพผิดปกติ<br>
      ของแผ่น<br>
      หรือตำแหน่งบนภาพ
    </td>

    <td v-for="d in 20" :key="'r3-'+d" class="col-day">&nbsp;</td>
  </tr>

  <!-- แถวที่ 4 -->
  <tr>
    <!-- คอลัมน์ที่ 1 ไม่ต้องมี -->

    <td class="col-second">
      ผู้ตรวจสอบ
    </td>

    <td class="col-day align-left" colspan="20">
    &nbsp;
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
  font-size: 11pt !important;
  text-align: left;
  margin-bottom: 4mm;
}

.title-center-block {
  text-align: center;
  margin-top: 10mm;   /* ← ขยับลง (ปรับได้ 3–6mm ตามต้องการ) */
}

.title-sub {
  margin-bottom: 2mm;
}

.title-center-block .title-sub {
  font-weight: 700;
}

/* ความถี่ + หมายเลข IP */
.meta-inline {
  margin-top: 8mm;
  margin-bottom: 6mm;
  text-align: left;
  margin-left: 0 !important;     /* ← เลื่อนมาชิดซ้าย */
  padding-left: 2mm !important;  /* ← กันไม่ให้ชิดเกินไป */
}


  /* ความถี่ : ตัวหนา */
.meta-row-inline span:first-child {
  font-weight: 700;
  margin-bottom: 2mm;
}

/* *** แก้: meta-short ไม่ให้มีเส้นใต้ทุกวัน *** */
.meta-short {
  min-width: 28mm;
  margin-left: 4px;
  border-bottom: none !important;  /* ตัดเส้นใต้ */
  font-weight: 400 !important;
}

/* ยังให้หมายเลข IP มีเส้นอยู่ตามเดิม */
.meta-long {
  min-width: 50mm;
  margin-left: 4px;
  font-weight: 400;
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
  padding: 1mm 0.5mm;
  vertical-align: middle;
  text-align: center;
}

/* หัวคอลัมน์ซ้ายให้จัดกลาง แต่แถวอื่นชิดซ้าย */
.col-left {
  width: 36mm;               /* แคบลงให้ใกล้ต้นฉบับ */
}

.f2-table td.col-left {
  text-align: left;
}

.col-day {
  width: 5.2mm !important;
  padding: 0.5mm 0 !important;
}

/* คอลัมน์ที่ 2 ของสามแถว ให้ความกว้างเท่ากัน */
.col-second {
  width: 28mm !important;
  text-align: left !important;
  padding-left: 2mm !important;
  vertical-align: top !important; /* ให้ข้อความเริ่มบนเหมือนต้นฉบับ */
  line-height: 1.2;
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

.month-label {
  font-weight: 700;
}

.dotted-line {
  display: inline-block;
  min-width: 18mm;
}

/* *** แก้: bottom-line ไม่ให้มีเส้นใต้ในช่องผู้ตรวจสอบ *** */
.bottom-line {
  display: inline-block;
  min-width: 90mm;
  border-bottom: none !important;  /* ตัดเส้นใต้ทั้งหมด */
}

/* คอลัมน์เดือน (แถวที่ 1) */
.col-month {
  width: 24mm !important;     /* ← ลดขนาดลงจาก 36mm */
  vertical-align: middle !important;
  text-align: center !important;
  padding: 0 !important;
}

/* กล่องภายใน ให้จัดกลางทั้งแนวตั้งและแนวนอน */
.month-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;    /* กึ่งกลางแนวตั้ง */
  align-items: center;        /* กึ่งกลางแนวนอน */
  height: 100%;
  gap: 2mm;
}

/* เส้นดำใต้เดือน */
.month-line {
  border-bottom: 0.4pt solid #000;
  min-width: 12mm;            /* ← สั้นลงตามที่ต้องการ */
  display: inline-block;
  margin-top: 1mm;
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

<template>
  <div class="print-root">

    <!-- แถบปุ่มด้านบน (จะหายไปตอนสั่งปริ้น) -->
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

    <!-- A4 หนึ่งหน้า -->
    <div class="sheet-a4">
      <!-- ส่วนเนื้อหาด้านขวา (ตัวแบบฟอร์มจริง) -->
      <div class="form-area">
        <!-- แถบหัวสีเทาแนวนอนด้านบน (แบบบันทึก) -->
        <div class="form-main-title">
          แบบบันทึก
        </div>

        <!-- ข้อมูลหัวฟอร์มตามต้นฉบับ PDF -->
        <div class="form-meta">
          <div class="meta-row">
            <span class="meta-strong">
              {{ record.formCode }}
            </span>
          </div>
          <div class="meta-row">
            <span class="label-bold">ความถี่ : </span>
            <span>{{ record.frequency }}</span>
          </div>
          <div class="meta-row">
            <span class="label-bold">เครื่องเอกซเรย์ :</span>
            <span class="underline underline-long">
              <!-- เว้นให้เขียนเองบนกระดาษ -->
            </span>
            <span class="meta-label label-bold">เดือน :</span>
            <span class="underline underline-short">
              <!-- เว้นให้เขียนเองบนกระดาษ -->
            </span>
          </div>

          <!-- ตารางใหม่ 7 แถว 32 คอลัมน์ -->
<div class="table-wrapper">
  <table class="qc-table">
  <colgroup>
    <col class="col-item-width" />
    <col v-for="i in 31" :key="'c'+i" class="col-day-width" />
  </colgroup>

  <tbody>

    <!-- ====================== แถว 1 ====================== -->
<tr>
  <td class="bold-cell">วันที่ :</td>
  <td colspan="10"></td>
  <td colspan="8" class="bold-cell">ผู้ทดสอบ :</td>
  <td colspan="13"></td>
</tr>

    <!-- ====================== แถว 2 ====================== -->
    <tr>
      <td rowspan="2" class="bold-cell">รายการตรวจสอบ</td>
      <td colspan="31" class="bold-cell">
        ผลการตรวจสอบ Pass (✓) Fail (✗) ของวันที่
      </td>
    </tr>

    <!-- ====================== แถว 3 ====================== -->
    <tr>
      <td v-for="d in 31" :key="'day'+d">{{ d }}</td>
    </tr>

    <!-- ====================== แถว 4 ====================== -->
    <tr>
      <td>
        <span class="bold-only">สายไฟ :</span>
        <span> ไม่พบรอยแตก ไม่บิดงอ ไม่พันเป็นปม และไม่มีอุปกรณ์ที่มีน้ำหนักมากวางทับสายไฟ</span>
      </td>
      <td v-for="i in 31" :key="'r4c'+i"></td>
    </tr>

    <!-- ====================== แถว 5 ====================== -->
    <tr>
      <td>
        <span class="bold-only">ระบบล็อกและเบรก :</span>
        <span> ทำงานได้อย่างถูกต้อง</span>
      </td>
      <td v-for="i in 31" :key="'r5c'+i"></td>
    </tr>

    <!-- ====================== แถว 6 ====================== -->
    <tr>
      <td>
        <span class="bold-only">เตียง หลอดเอกซเรย์ และบักกี้ :</span>
        <span> เคลื่อนที่ได้อย่างราบเรียบ</span>
      </td>
      <td v-for="i in 31" :key="'r6c'+i"></td>
    </tr>

    <!-- ====================== แถวใหม่ (แถวสุดท้าย) ====================== -->
    <tr>
      <td>
        <span class="bold-only">X-ray tube warm-up :</span>
        <span> ด้วยค่าเทคนิคที่บริษัทแนะนำ</span>
      </td>
      <td v-for="i in 31" :key="'lastRow'+i"></td>
    </tr>

  </tbody>
</table>
</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

/**
 * หน้านี้เอาไว้ render เป็น A4 แล้วใช้ window.print()
 * ให้ main app เปิด route นี้เป็นหน้าต่างเปล่า (ไม่มี side menu)
 */

const route = useRoute();

const record = ref({
  id: route.params.id || "F1-001",
  formCode: "แบบบันทึก F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์",
  frequency: "ทุกวันก่อนเริ่มปฏิบัติงาน",
  machineName: "X-Ray Room 1 (Shimadzu XXX)",
  monthName: "พฤศจิกายน",
  yearBe: 2568,
  testerName: "นพ. ตัวอย่าง ผู้ทดสอบ",
  printDate: "",
  rows: [
    {
      name: "สายไฟ : ไม่พบบวม ไม่คดงอ ไม่มีรอยไหม้ และไม่มีน้ำหนักทับสาย",
      resultsByDay: { 1: "pass", 2: "pass" }
    },
    {
      name: "ระบบล็อกและเบรก : ทำงานได้อย่างถูกต้อง",
      resultsByDay: { 1: "pass" }
    },
    {
      name: "เตียง หลอดเอกซเรย์ และบักกี้ : เคลื่อนที่ได้อย่างราบเรียบ",
      resultsByDay: { 1: "pass" }
    },
    {
      name: "X-ray tube warm-up : ตั้งค่าตามคำแนะนำผู้ผลิต",
      resultsByDay: { 1: "pass" }
    }
  ]
});

function handlePrint() {
  window.print();
}

onMounted(() => {
  // const id = route.params.id;
  // fetch(`/api/xray-check/${id}`) ...
});
</script>

<style scoped>
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  font-size: 11pt !important;
  font-weight: 400;
}

/* ----------------- พื้นฐานหน้า ----------------- */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* แถบปุ่มด้านบน */
.print-toolbar {
  margin-bottom: 8px;
}

.bold-only {
  font-weight: 700 !important;
}

.btn-print {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

/* ----------------- A4 sheet (แนวนอน) ----------------- */
.sheet-a4 {
  width: 297mm;          /* ด้านยาวของ A4 */
  height: 210mm;         /* ด้านสั้นของ A4 */
  background: white;
  box-shadow: 0 0 4mm rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  font-family: "TH Sarabun New", Tahoma, sans-serif;
}

.sheet-inner {
  width: 185mm;
  padding: 28mm 0 16mm;   /* เพิ่มด้านบนจาก 18mm → 28mm */
}

/* ----------------- form area ----------------- */
.form-area {
  flex: 1;
  padding: 20mm 8mm 8mm 8mm;   /* เพิ่มด้านบนจาก 8mm → 20mm */
  display: flex;
  flex-direction: column;
}

/* แถบหัวสีเทา "แบบบันทึก" แนวนอน */
.form-main-title {
  background: #e5e5e5;
  text-align: center;
  padding: 3mm 0;
  font-weight: 700;
  margin-bottom: 5mm;
  font-size: 11pt !important;
}

/* ข้อมูลหัวฟอร์มแนวนอน */
.form-meta {
  font-size: 11pt;
  margin-bottom: 3mm;
}

.meta-row {
  margin-bottom: 1.2mm;
}

.meta-strong {
  font-weight: 700;
}

.label-bold {
  font-weight: 700 !important;
}

.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11pt !important;
  margin-top: 10mm;
}

.qc-table td,
.qc-table th {
  font-size: 11pt !important;
  border: 0.4pt solid #000;
  padding: 1mm 0.5mm;
  text-align: center;
  vertical-align: middle;
}

.col-item {
  width: 55mm;
  text-align: left;
  padding-left: 2mm;
  line-height: 1.2;
}

/* คอลัมน์ที่ 1 (รายการตรวจสอบ) */
.col-item-width {
  width: 55mm;              /* ตายตัว */
}

.col-day {
  width: calc((100% - 55mm) / 31); /* (ความกว้างทั้งหมด - คอลัมน์รายการ) / 31 ช่อง */
  text-align: center;
  padding: 1mm 0;
}

/* คอลัมน์วันที่ 1–31 */
.col-day-width {
  width: calc((100% - 55mm) / 31);
}

.col-day-head {
  font-weight: bold;
}

.meta-label {
  margin-left: 8mm;
}

/* เส้นขีดเติมคำตอบ */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
  display: inline-block;
}

.underline-short {
  min-width: 50mm;
}

.underline-long {
  min-width: 95mm;
}

.underline-small {
  min-width: 22mm;
}

.underline-wide {
  min-width: 60mm;
}

/* ตารางหัว "วันที่ / ผู้ทดสอบ" ให้ชิดกับตารางใหญ่ */
.qc-meta-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5mm;  /* ชิดกับตารางหลักมากขึ้น */
  font-size: 11pt;
}

.qc-table td,
.qc-table th {
  border: 0.4pt solid #000;
  padding: 1mm 0.5mm;
  text-align: center;
  vertical-align: middle;
  font-size: 11pt !important;
}

.qc-table td span,
.qc-table th span {
  font-size: 11pt !important;
}

.qc-meta-table td {
  border: 0.4pt solid #000;
  padding: 0.8mm 1.5mm;
}

.qc-meta-date {
  width: 40%;
}

.qc-meta-tester {
  width: 60%;
}

/* เพิ่มความเฉพาะเจาะจง: ตัวหนังสือในช่องรายการตรวจสอบชิดซ้ายจริง ๆ */
.qc-table td.col-item {
  text-align: left;
  padding-left: 2mm;
}

.bold-cell {
  font-weight: 700 !important;
}


/* ลบกรอบรอบแถว วันที่ / ผู้ทดสอบ */
.no-border-row td {
  border: none !important;
}

/* ลดขนาดช่องวันที่ช่องแรกเท่านั้น */
.first-day {
  width: 3mm !important;
  max-width: 3mm !important;
  min-width: 3mm !important;
}

/* แถวที่ 2 คอลัมน์ที่ 1 : รายการตรวจสอบ ชิดบน แต่กึ่งกลางแนวนอน */
.qc-table tr:nth-child(2) td:first-child {
  vertical-align: top !important;
  padding-top: 1mm !important;
  text-align: center !important;
}

/* แถวที่ 2 คอลัมน์ที่ 1 : รายการตรวจสอบ ชิดบน แต่กึ่งกลางแนวนอน */
.qc-table tr:nth-child(2) td:first-child {
  vertical-align: top !important;
  padding-top: 1mm !important;
  text-align: center !important;
}

/* คอลัมน์ที่ 1 แถวที่ 3–6 : ข้อความชิดซ้าย */
.qc-table tr:nth-child(4) td:first-child,
.qc-table tr:nth-child(5) td:first-child,
.qc-table tr:nth-child(6) td:first-child,
.qc-table tr:nth-child(7) td:first-child {
  text-align: left !important;
  padding-left: 2mm !important;
}

/* ----------------- print CSS ----------------- */
@page {
  size: A4 landscape;
  margin: 10mm;
}

@media print {
  .print-root {
    padding: 0;
    background: white;
  }

  .sheet-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
  }

  .print-toolbar {
    display: none;
  }

  .title-main {
  font-size: 16pt !important;
  font-weight: 700;
}

}
</style>


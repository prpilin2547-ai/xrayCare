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
            <span>ความถี่ : </span>
            <span>{{ record.frequency }}</span>
          </div>
          <div class="meta-row">
            <span>เครื่องเอกซเรย์ :</span>
            <span class="underline underline-long">
              <!-- เว้นให้เขียนเองบนกระดาษ -->
            </span>
            <span class="meta-label">เดือน :</span>
            <span class="underline underline-short">
              <!-- เว้นให้เขียนเองบนกระดาษ -->
            </span>
          </div>
        </div>

        <!-- แถว "วันที่ / ผู้ทดสอบ" แนวนอน (ชิดกับตารางหลัก) -->
        <table class="qc-meta-table">
          <tr>
            <td class="qc-meta-date">
              วันที่ :
              <span class="underline underline-small">
                <!-- เว้นให้เขียนเองบนกระดาษ -->
              </span>
            </td>
            <td class="qc-meta-tester">
              ผู้ทดสอบ :
              <span class="underline underline-wide">
                <!-- เว้นให้เขียนเองบนกระดาษ -->
              </span>
            </td>
          </tr>
        </table>

        <!-- ตารางหลัก -->
        <div class="table-wrapper">
          <table class="qc-table">
            <thead>
              <!-- แถวชื่อหัวกลุ่ม -->
              <tr>
                <th class="col-item" rowspan="2">
                  รายการตรวจสอบ
                </th>
                <th class="col-days-group" colspan="31">
                  ผลการตรวจสอบ Pass (✓)  Fail (✗) ของวันที่
                </th>
              </tr>
              <!-- แถวเลขวันที่ 1–31 -->
              <tr>
                <th
                  v-for="d in 31"
                  :key="'head-day-' + d"
                  class="col-day col-day-head"
                >
                  {{ d }}
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- แถวรายการตรวจสอบจริง -->
              <tr v-for="(row, idx) in record.rows" :key="'row-' + idx">
                <td class="col-item">
                  {{ row.name }}
                </td>
                <td
                  v-for="d in 31"
                  :key="'row-' + idx + '-day-' + d"
                  class="col-day"
                >
                  <span v-if="row.resultsByDay[d] === 'pass'">✓</span>
                  <span v-else-if="row.resultsByDay[d] === 'fail'">✗</span>
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
  width: 297mm;        /* กว้างเท่าด้านยาวของ A4 */
  min-height: 210mm;   /* สูงเท่าด้านสั้นของ A4 */
  background: white;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.15);
  display: flex;
  font-family: "TH Sarabun New", "Tahoma", sans-serif;
  font-size: 10.5pt;   /* ฟอนต์หลักหน้า */
}

/* ----------------- form area ----------------- */
.form-area {
  flex: 1;
  padding: 8mm 8mm 8mm 8mm;  /* ลด padding เพื่อให้ตารางกว้างขึ้น */
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
  min-width: 35mm;
}

.underline-long {
  min-width: 70mm;
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
  font-size: 10pt;
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

/* ----------------- Table ----------------- */
.table-wrapper {
  flex: 1;
}

/* ลดขนาดตัวอักษรในตารางหลักอีกเล็กน้อยให้ตัวเลขไม่เบียดกัน */
.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 7.8pt;
}

.qc-table th,
.qc-table td {
  border: 0.4pt solid #000;
  padding: 0.7mm 0.7mm;   /* ลด padding ใน cell */
  vertical-align: middle;
  text-align: center;
  line-height: 1.1;       /* ให้บรรทัดเตี้ยลงเล็กน้อย */
}

/* หัวคอลัมน์วันที่ให้เป็นตัวบางและอยู่กึ่งกลางช่อง */
.qc-table th.col-day-head {
  font-weight: 400;   /* ไม่ bold */
  text-align: center;
}

/* คอลัมน์ข้อความ (ให้ชิดซ้ายของช่อง) */
.col-item {
  width: 50mm;        /* หดลงเล็กน้อย เพื่อเพิ่มพื้นที่ให้ช่องวันที่ */
  text-align: left;
}

/* เพิ่มความเฉพาะเจาะจง: ตัวหนังสือในช่องรายการตรวจสอบชิดซ้ายจริง ๆ */
.qc-table td.col-item {
  text-align: left;
  padding-left: 2mm;
}

/* กลุ่มหัววันที่ */
.col-days-group {
  text-align: center;
}

/* คอลัมน์วัน: ให้กว้างขึ้นเล็กน้อยและตัวเลขอยู่กึ่งกลาง */
.col-day {
  width: 6.2mm;       /* ขยายจาก 6mm นิดหน่อย */
  text-align: center;
}

/* ----------------- print CSS ----------------- */
@page {
  size: A4 landscape;  /* แนวนอน */
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
}
</style>


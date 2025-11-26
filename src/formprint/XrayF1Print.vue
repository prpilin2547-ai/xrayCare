<template>
  <!-- หน้าพิเศษสำหรับปริ้นเท่านั้น: ไม่มีเมนู ไม่มี MainLayout -->
  <div class="print-root">

    <!-- แถบปุ่มด้านบน (จะหายไปตอนสั่งปริ้น) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 Print
      </button>
    </div>

    <!-- A4 หนึ่งหน้า -->
    <div class="sheet-a4">
      <!-- เนื้อหาเลียนแบบไฟล์ PDF ตามรูป -->

      <!-- แถบเทาแนวตั้งด้านซ้าย -->
      <div class="left-strip">
        <div class="left-strip-inner">
          <div class="vertical-text main-title">
            แบบบันทึก
          </div>
          <div class="vertical-text sub-title">
            คุณภาพของเครื่องเอกซเรย์วินิจฉัยทางการแพทย์
          </div>
          <div class="page-number">
            60
          </div>
        </div>
      </div>

      <!-- ส่วนเนื้อหาด้านขวา (ตัวแบบฟอร์มจริง) -->
      <div class="form-area">

        <!-- ส่วนหัวฟอร์ม (ข้อมูลจากการบันทึก) -->
        <div class="header-block">
          <div class="header-row">
            <span class="label">เครื่องเอกซเรย์ :</span>
            <span class="value underline">{{ record.machineName }}</span>
          </div>
          <div class="header-row">
            <span class="label">เดือน :</span>
            <span class="value underline">{{ record.month }} {{ record.year }}</span>

            <span class="label center-label">วันที่ :</span>
            <span class="value underline small">
              {{ record.day }}
            </span>
          </div>
          <div class="header-row">
            <span class="label">ผู้ทดสอบ :</span>
            <span class="value underline">{{ record.testerName }}</span>

            <span class="label center-label">ผลการตรวจสอบ :</span>
            <span class="value underline small">
              {{ record.result }}
            </span>
          </div>
        </div>

        <!-- ตารางหลัก (โครงคล้ายรูป) -->
        <div class="table-wrapper">
          <table class="qc-table">
            <thead>
              <tr>
                <th class="col-no" rowspan="2">ลำดับ</th>
                <th class="col-item" rowspan="2">
                  รายการทดสอบ / จุดที่ตรวจสอบ
                </th>
                <th class="col-result" rowspan="2">
                  ผลการตรวจสอบ<br />
                  Pass (✓) / Fail (✗)<br />
                  ของวันที่
                </th>
                <!-- คอลัมน์วันที่ 1-31 -->
                <th
                  v-for="d in 31"
                  :key="d"
                  class="col-day"
                >
                  {{ d }}
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- แถวตัวอย่าง (คุณจะใส่รายชื่อรายการจริงเองได้) -->
              <tr v-for="(row, idx) in rows" :key="idx">
                <td class="col-no">{{ idx + 1 }}</td>
                <td class="col-item">
                  {{ row.name }}
                </td>
                <td class="col-result">
                  <!-- เฉพาะวันตาม record.day ให้แสดง ✓ หรือ ✗ -->
                  <span v-if="row.days[record.day] === 'pass'">✓</span>
                  <span v-else-if="row.days[record.day] === 'fail'">✗</span>
                </td>

                <!-- ช่องวันที่ 1-31 -->
                <td
                  v-for="d in 31"
                  :key="d"
                  class="col-day"
                >
                  <span v-if="row.days[d] === 'pass'">✓</span>
                  <span v-else-if="row.days[d] === 'fail'">✗</span>
                </td>
              </tr>

              <!-- เติมแถวเปล่าให้เต็มเหมือนแบบฟอร์ม -->
              <tr v-for="n in blankRowCount" :key="'blank-' + n">
                <td class="col-no">&nbsp;</td>
                <td class="col-item">&nbsp;</td>
                <td class="col-result">&nbsp;</td>
                <td
                  v-for="d in 31"
                  :key="'b-' + n + '-' + d"
                  class="col-day"
                >
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

/**
 * หน้านี้เอาไว้ render เป็น A4 แล้วใช้ window.print()
 * ให้ main app เปิด route นี้เป็นหน้าต่างเปล่า (ไม่มี side menu)
 */

const route = useRoute();

// ข้อมูลที่ดึงมาจากการบันทึกจริง (ตัวอย่าง mock)
// คุณเปลี่ยนส่วนนี้เป็นการ fetch จาก API หรือ Pinia store ได้
const record = ref({
  id: route.params.id || "F1-001",
  machineName: "X-Ray Room 1 (Brand/Model)",
  month: "พฤศจิกายน",
  year: 2568,
  day: 26,
  testerName: "นพ. ตัวอย่าง ผู้ทดสอบ",
  result: "Pass"
});

// ตัวอย่างโครงรายการทดสอบ (ให้เลียนแบบรายการในเล่มจริงเอาเอง)
const rows = ref([
  {
    name: "1. ความสม่ำเสมอของคุณภาพภาพรังสี",
    days: { 26: "pass" }
  },
  {
    name: "2. การทำงานของแผงตรวจจับรังสี",
    days: { 26: "pass" }
  },
  {
    name: "3. การตรวจสอบเครื่องกำเนิดรังสี",
    days: { 26: "pass" }
  }
]);

// ให้ตารางยาวเหมือนแบบฟอร์ม (เช่นเอา 12 แถว)
const targetRowCount = 12;
const blankRowCount = computed(() =>
  Math.max(0, targetRowCount - rows.value.length)
);

function handlePrint() {
  // เปิด dialog ปริ้นของ browser (Chrome/Google)
  window.print();
}

// ถ้าต้องโหลดข้อมูลจาก API จริง ให้ใช้ onMounted
onMounted(() => {
  // ตัวอย่างการอ่าน id จาก route:
  // const id = route.params.id;
  // แล้วไป fetch(`/api/xray-check/${id}`) ...
});
</script>

<style scoped>
/* ----------------- พื้นฐานหน้า ----------------- */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
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

/* ----------------- A4 sheet ----------------- */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: white;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.15);
  display: flex;
  font-family: "Th Sarabun New", "Tahoma", sans-serif;
  font-size: 11pt;
}

/* แถบเทาด้านซ้าย */
.left-strip {
  width: 28mm;
  background: #e5e5e5;
  position: relative;
  border-right: 0.4pt solid #999;
}

.left-strip-inner {
  position: absolute;
  inset: 16mm 6mm 16mm 6mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: center;
}

.main-title {
  font-weight: 700;
  font-size: 14pt;
}

.sub-title {
  font-size: 10pt;
}

.page-number {
  width: 18mm;
  height: 18mm;
  border-radius: 999px;
  border: 0.6pt solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10pt;
}

/* ----------------- form area ----------------- */
.form-area {
  flex: 1;
  padding: 18mm 10mm 10mm 10mm;
  display: flex;
  flex-direction: column;
}

/* header ข้อมูลเครื่อง, เดือน, ผู้ทดสอบ */
.header-block {
  margin-bottom: 8mm;
  font-size: 11pt;
}

.header-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 2mm;
}

.header-row .label {
  min-width: 30mm;
}

.header-row .center-label {
  margin-left: 10mm;
  min-width: 24mm;
}

.header-row .value {
  flex-grow: 1;
}

.header-row .value.small {
  min-width: 24mm;
  flex: 0 0 auto;
}

.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
}

/* ----------------- Table ----------------- */
.table-wrapper {
  flex: 1;
}

.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 9pt;
}

.qc-table th,
.qc-table td {
  border: 0.4pt solid #000;
  padding: 1mm 1mm;
  vertical-align: middle;
  text-align: center;
}

/* คอลัมน์ */
.col-no {
  width: 6mm;
}

.col-item {
  width: 55mm;
  text-align: left;
}

.col-result {
  width: 30mm;
}

.col-day {
  width: 6mm;
}

/* ----------------- print CSS ----------------- */
@page {
  size: A4 portrait;
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

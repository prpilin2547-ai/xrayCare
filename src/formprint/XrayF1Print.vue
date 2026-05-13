<template>
  <div class="print-root xray-f1-print-page">

    <!-- แถบปุ่มด้านบน (จะหายไปตอนสั่งปริ้น) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
          style="margin-right:6px;">
          <path
            d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z" />
        </svg>
        Print
      </button>
    </div>

      <!-- แผ่นฟอร์ม A4 -->
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
            <span class="underline underline-long">{{ record.machineName }}{{ record.room ? ' (' + record.room + ')' :
              '' }}</span>
            <span class="meta-label label-bold">เดือน :</span>
            <span class="underline underline-short">{{ formatMonthOnly(record.checkDate) || '' }}</span>
          </div>

          <!-- ตาราง F1 แบบรายวัน (แสดงเฉพาะวันที่ของ record) -->
          <div class="table-wrapper table-daily">
            <table class="qc-table qc-table-daily">
              <colgroup>
                <col class="col-item-width" />
                <col class="col-result-width" />
              </colgroup>

              <tbody>
                <tr>
                  <td class="bold-cell">วันที่ :</td>
                  <td class="bold-cell">ผู้ทดสอบ :</td>
                </tr>
                <tr>
                  <td>{{ (record.checkDate) || record.checkDate }}</td>
                  <td>{{ record.testerName }}</td>
                </tr>
                <tr>
                  <td class="bold-cell">รายการตรวจสอบ</td>
                  <td class="bold-cell">ผลการตรวจสอบ Pass (✓) Fail (✗)</td>
                </tr>
                <tr v-for="(row, ri) in record.rows" :key="'row-' + ri">
                  <td>
                    <template v-if="(row.label || '').indexOf(' : ') >= 0">
                      <span class="bold-only">{{ (row.label || '').split(' : ')[0] }} :</span>
                      <span> {{ (row.label || '').split(' : ').slice(1).join(' : ') }}</span>
                    </template>
                    <span v-else>{{ row.label }}</span>
                  </td>
                  <td class="day-cell">{{ getDailyResult(row) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ส่วน F2 : การลบแผ่นเพลท (จาก jsonData.plateErase) แบบรูปที่ 2 -->
          <div v-if="record.plateErase" class="f2-section">
            <div class="f2-header-block">
              <div class="f2-main-title">แบบบันทึก F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)</div>
              <div class="f2-subtitle">แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์</div>
              <div class="f2-meta-row">
                <span class="f2-meta-left">ความถี่ : ทุกวัน</span>
                <span class="f2-meta-right">ปีงบประมาณ พ.ศ. <span class="f2-underline">{{ record.plateErase.fiscalYear
                  ||
                    '____________' }}</span></span>
              </div>
              <div class="f2-meta-row">
                <span class="f2-meta-left">หมายเลข IP <span class="f2-underline">{{ record.plateErase.ipNumber ||
                    '____________'
                    }}</span></span>
              </div>
            </div>
            <table class="f2-table">
              <thead>
                <tr>
                  <th class="f2-col-item">รายการ</th>
                  <th class="f2-col-pass">ผ่าน</th>
                  <th class="f2-col-fail">ไม่ผ่าน</th>
                  <th class="f2-col-remark">สภาพผิดปกติของแผ่นหรือตำแหน่งบนภาพ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="f2-col-item">ผลการทดสอบ</td>
                  <td class="f2-col-pass">{{ record.plateErase.result === 'pass' ? '✓' : '' }}</td>
                  <td class="f2-col-fail">{{ record.plateErase.result === 'fail' ? '✗' : '' }}</td>
                  <td class="f2-col-remark">
                    <span class="f2-remark-text">{{ record.plateErase.remark || '–' }}</span>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

/**
 * หน้านี้เอาไว้ render เป็น A4 แล้วใช้ window.print()
 * ให้ main app เปิด route นี้เป็นหน้าต่างเปล่า (ไม่มี side menu)
 */

const route = useRoute();

import { apiFetch } from '../api/client';

const defaultRecord = () => ({
  id: null,
  formCode: "แบบบันทึก F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์",
  frequency: "ทุกวันก่อนเริ่มปฏิบัติงาน",
  machineName: "",
  room: "",
  checkDate: "",
  checkDayOfMonth: null,
  monthName: "",
  yearBe: null,
  testerName: "",
  printDate: "",
  rows: [],
  plateErase: null
});

function parseDayOfMonth(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split(/[/\s-]/).filter(Boolean);
  if (parts.length < 3) {
    const day = parseInt(parts[0], 10);
    return (day >= 1 && day <= 31) ? day : null;
  }
  const first = parseInt(parts[0], 10);
  const third = parseInt(parts[2], 10);
  if (first >= 1 && first <= 31) return first;
  if (third >= 1 && third <= 31) return third;
  return null;
}

function getDailyResult(row) {
  const r = (row.result || '').toLowerCase();
  if (r === 'pass') return '✓';
  if (r === 'fail') return '✗';
  return '–';
}

/** แปลงวันที่เต็มเป็นเฉพาะเดือน+ปี (MM/YYYY) สำหรับช่อง "เดือน :" */
function formatMonthOnly(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.trim().split(/[/\s-]/).filter(Boolean);
  if (parts.length < 3) return dateStr.trim();
  const a = parseInt(parts[0], 10);
  const b = parseInt(parts[1], 10);
  const c = parseInt(String(parts[2]).replace(/\D/g, '').slice(0, 4), 10);
  if (a >= 1 && a <= 31 && b >= 1 && b <= 12) {
    return `${String(b).padStart(2, '0')}/${c > 0 ? c : 2569}`;
  }
  if (a >= 1 && a <= 12 && b >= 1 && b <= 31 && c > 2400) {
    return `${String(a).padStart(2, '0')}/${c}`;
  }
  return dateStr.trim();
}

const record = ref(defaultRecord());

function handlePrint() {
  installPrintPageStyle({ moveToEnd: true });
  window.print();
}

/** ทับ @page ของ printLayout เฉพาะตอนอยู่หน้านี้ + คลาย #app/.small ไม่ให้บีบ/ชิดขวาใน preview */
const PRINT_STYLE_ID = "xray-f1-print-page-style";

function installPrintPageStyle(options = {}) {
  const moveToEnd = options.moveToEnd === true;
  if (typeof document === "undefined") return;
  if (moveToEnd) {
    removePrintPageStyle();
  } else if (document.getElementById(PRINT_STYLE_ID)) {
    return;
  }
  const el = document.createElement("style");
  el.id = PRINT_STYLE_ID;
  el.textContent = `
@page { size: A4 portrait; margin: 0 !important; }
@media print {
  html, body {
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #app, #app > .small {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
  }
  /* ไม่ใช้ flex ตอนพิมพ์ — กันบีบ + กล่องเต็มความกว้างจริงของหน้า */
  .xray-f1-print-page {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    min-height: 0 !important;
  }
  .xray-f1-print-page .print-toolbar {
    display: none !important;
  }
  .xray-f1-print-page .form-area {
    display: block !important;
    width: 100% !important;
    max-width: none !important;
    min-height: 297mm !important;
    height: auto !important;
    max-height: none !important;
    aspect-ratio: auto !important;
    margin: 0 !important;
    padding: 14mm 10mm !important;
    box-sizing: border-box !important;
    overflow: visible !important;
  }
  .xray-f1-print-page .table-wrapper,
  .xray-f1-print-page .qc-table,
  .xray-f1-print-page .f2-table {
    width: 100% !important;
    max-width: none !important;
  }
  .xray-f1-print-page .qc-table,
  .xray-f1-print-page .qc-table td,
  .xray-f1-print-page .qc-table th,
  .xray-f1-print-page .f2-table,
  .xray-f1-print-page .f2-table td,
  .xray-f1-print-page .f2-table th {
    font-size: 18pt !important;
    line-height: 1.35 !important;
  }
  .xray-f1-print-page .qc-table td,
  .xray-f1-print-page .qc-table th,
  .xray-f1-print-page .f2-table td,
  .xray-f1-print-page .f2-table th {
    padding: 3mm 3.5mm !important;
  }
  .xray-f1-print-page .form-main-title {
    font-size: 26pt !important;
    padding: 4mm 0 !important;
  }
  .xray-f1-print-page .form-meta,
  .xray-f1-print-page .f2-meta-row {
    font-size: 19pt !important;
  }
  .xray-f1-print-page .meta-strong {
    font-size: 20pt !important;
  }
  .xray-f1-print-page .f2-main-title {
    font-size: 19pt !important;
  }
  .xray-f1-print-page .f2-subtitle {
    font-size: 18pt !important;
  }
  .xray-f1-print-page .f2-table thead th {
    font-size: 18pt !important;
  }
}`;
  document.head.appendChild(el);
}

function removePrintPageStyle() {
  document.getElementById(PRINT_STYLE_ID)?.remove();
}

onMounted(async () => {
  installPrintPageStyle();
  const id = route.query.id;
  if (!id) return;
  try {
    const res = await apiFetch(`/GetChecklistRecord/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    record.value = {
      ...defaultRecord(),
      id: data.id,
      formCode: "แบบบันทึก F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์",
      frequency: "ทุกวันก่อนเริ่มปฏิบัติงาน",
      machineName: data.machineName || "",
      room: data.room || "",
      checkDate: data.checkDate || "",
      checkDayOfMonth: parseDayOfMonth(data.checkDate),
      testerName: data.tester || "",
      printDate: data.checkDate || ""
    };
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData);
        if (parsed.checklist && Array.isArray(parsed.checklist)) {
          record.value.rows = parsed.checklist.map(item => ({
            label: typeof item === 'string' ? item : (item.label || item.name || item.text || ''),
            result: (item && (item.result || item.resultByDay)) || ''
          }));
        }
        if (parsed.plateErase && typeof parsed.plateErase === 'object') {
          record.value.plateErase = {
            result: parsed.plateErase.result || '',
            remark: parsed.plateErase.remark || ''
          };
        }
      } catch (_) { }
    }
  } catch (e) {
    console.error('Load checklist record error:', e);
  }
});

onBeforeUnmount(() => {
  removePrintPageStyle();
});
</script>

<style src="./printLayout.css"></style>
<style scoped>
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  font-size: 14pt !important;
  font-weight: 400;
  box-sizing: border-box;
}

/* ----------------- พื้นฐานหน้า ----------------- */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
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

/* ----------------- form-area = ขนาดเท่ากับ A4 แนวตั้ง พื้นที่พิมพ์ (190mm × 277mm) ----------------- */
.form-area {
  width: 190mm;
  height: 277mm;
  min-width: 0;
  aspect-ratio: 190 / 277;
  max-width: 100%;
  max-height: 100%;
  padding: 10mm;
  display: flex;
  flex-direction: column;
  background: white;
  overflow: hidden;
  box-sizing: border-box;
}

/* แถบหัวสีเทา "แบบบันทึก" แนวนอน */
.form-main-title {
  background: #e5e5e5;
  text-align: center;
  padding: 2.5mm 0;
  font-weight: 700;
  margin-bottom: 3mm;
  font-size: 16pt !important;
}

/* ข้อมูลหัวฟอร์มแนวนอน */
.form-meta {
  font-size: 14pt;
  margin-bottom: 2mm;
}

.meta-row {
  margin-bottom: 1.2mm;
}

.meta-strong {
  font-size: 15pt !important;
  font-weight: 700;
}

.label-bold {
  font-weight: 700 !important;
}

.table-wrapper {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt !important;
  margin-top: 6mm;
}

.qc-table td,
.qc-table th {
  font-size: 14pt !important;
  border: 1px solid #000;
  padding: 1mm 0.5mm;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-word;
}

.col-item {
  width: 55mm;
  text-align: left;
  padding-left: 2mm;
  line-height: 1.2;
}

/* คอลัมน์ที่ 1 (รายการตรวจสอบ) */
.col-item-width {
  width: 55%;
  min-width: 0;
}

.col-day {
  width: calc((100% - 55mm) / 31);
  /* (ความกว้างทั้งหมด - คอลัมน์รายการ) / 31 ช่อง */
  text-align: center;
  padding: 1mm 0;
}

/* คอลัมน์วันที่ 1–31 (ใช้กับตารางแบบเดือน) */
.col-day-width {
  width: calc((100% - 55mm) / 31);
}

/* ตาราง F1 แบบรายวัน */
.table-daily .qc-table-daily {
  table-layout: fixed;
}

.col-result-width {
  width: 45%;
  min-width: 0;
  text-align: center;
}

.day-cell {
  text-align: center;
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
  min-width: 35mm;
}

.underline-long {
  min-width: 60mm;
  max-width: 100%;
}

.underline-small {
  min-width: 22mm;
}

.underline-wide {
  min-width: 60mm;
}

/* ส่วน F2 : การลบแผ่นเพลท */
.f2-section {
  margin-top: 5mm;
  border: 1px solid #000;
  border-radius: 2mm;
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
}

.f2-header-block {
  background: #fff;
  color: #000;
  padding: 3mm 4mm;
  border-bottom: 1px solid #000;
}

.f2-main-title {
  font-weight: 700;
  font-size: 14pt !important;
  text-align: center;
  margin-bottom: 1.5mm;
  line-height: 1.25;
}

.f2-subtitle {
  font-size: 13pt !important;
  text-align: center;
  margin-bottom: 2mm;
}

.f2-meta-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3mm;
  font-size: 13pt !important;
  margin-top: 1.5mm;
}

.f2-meta-left {
  flex: 1;
}

.f2-meta-right {
  flex: 1;
  text-align: right;
}

.f2-underline {
  border-bottom: 0.4pt solid #000;
  padding: 0 1mm;
}

.f2-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt !important;
  background: #fff;
}

.f2-table th,
.f2-table td {
  border: 1px solid #000;
  padding: 1.5mm 2mm;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.f2-table thead th {
  background: #fff;
  color: #000;
  font-weight: 700;
  text-align: center;
  font-size: 13pt !important;
  line-height: 1.2;
}

.f2-col-item {
  width: 22%;
  min-width: 0;
  text-align: left;
}

.f2-col-pass {
  width: 10%;
  min-width: 0;
  text-align: center;
}

.f2-col-fail {
  width: 10%;
  min-width: 0;
  text-align: center;
}

.f2-col-remark {
  width: 58%;
  min-width: 0;
  text-align: left;
}

.f2-remark-text {
  display: block;
  min-height: 6mm;
  word-wrap: break-word;
  word-break: break-word;
}


/* ตารางหัว "วันที่ / ผู้ทดสอบ" ให้ชิดกับตารางใหญ่ */
.qc-meta-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.5mm;
  /* ชิดกับตารางหลักมากขึ้น */
  font-size: 11pt;
}

/* ตัวอักษรในตารางทั้งหมด = 14pt */
.qc-table td,
.qc-table th {
  border: 1px solid #000;
  padding: 1mm 0.5mm;
  text-align: center;
  vertical-align: middle;
  font-size: 14pt !important;
}

/* span ภายในตารางให้เป็น 14pt ด้วย */
.qc-table td span,
.qc-table th span {
  font-size: 14pt !important;
}


.qc-meta-table td {
  border: 1px solid #000;
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

/* คอลัมน์ที่ 1 แถวรายการตรวจสอบ : ข้อความชิดซ้าย */
.qc-table tr:nth-child(4) td:first-child,
.qc-table tr:nth-child(5) td:first-child,
.qc-table tr:nth-child(6) td:first-child,
.qc-table tr:nth-child(7) td:first-child {
  text-align: left !important;
  padding-left: 2mm !important;
}

/* ----------------- print CSS -----------------
   ขนาดเต็มหน้า + ขยายตัวหนังสือถูกใส่ใน installPrintPageStyle() (ไม่ผ่าน scoped) เพื่อชนทุก global sheet
   ที่นี่เหลือเฉพาะสิ่งที่ inject ไม่ครอบ */
@media print {
  /* บังคับให้ขอบตารางแสดงชัดตอนพิมพ์ */
  .qc-table,
  .qc-table td,
  .qc-table th,
  .f2-table,
  .f2-table td,
  .f2-table th,
  .qc-meta-table td {
    border: 1px solid #000 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .f2-section,
  .f2-header-block {
    border-color: #000 !important;
    border-width: 1px !important;
  }
}
</style>

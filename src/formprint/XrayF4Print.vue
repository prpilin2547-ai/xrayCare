<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + หน้ากระดาษ A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะไม่แสดงตอนสั่งพิมพ์) -->
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
        <!-- ================= หัวฟอร์ม ================= -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์
          </div>

          <div class="title-sub">
            ความถี่ : ทุก 3 เดือน
          </div>

          <div class="title-sub header-row-inline">
            เครื่องเอกซเรย์ รุ่น
            <span class="underline long">
              {{ header.machineName }}
            </span>
          </div>

          <div class="title-sub header-row-inline">
            วันที่
            <span class="underline short">
              {{ header.qcDate }}
            </span>
            ผู้ทดสอบ
            <span class="underline short">
              {{ header.testerName }}
            </span>
          </div>
        </div>

        <!-- ================= ตารางตรวจสอบ ================= -->
        <table class="f4-table">
          <thead>
            <tr>
              <th class="col-no">ลำดับที่</th>
              <th class="col-desc">รายการตรวจสอบ</th>
              <th class="col-pass">ผ่าน (✓)</th>
              <th class="col-fail">ไม่ผ่าน (✗)</th>
              <th class="col-remark">หมายเหตุ</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in rows" :key="row.no">
              <td class="col-no">{{ row.no }}</td>
              <td class="col-desc align-left">
                {{ row.description }}
              </td>
              <td class="col-pass">
                <span v-if="row.result === 'P'">✓</span>
              </td>
              <td class="col-fail">
                <span v-if="row.result === 'F'">✗</span>
              </td>
              <td class="col-remark align-left">
                {{ row.remark }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- หมายเหตุเพิ่มเติมตามที่ระบุ -->
        <div class="note-block">
          <div class="note-line">
            *ในระบบ DR ให้ทวนสอบค่าทางเทคนิคว่าถูกต้องเป็นปัจจุบัน
          </div>
          <div class="note-line">
            **ไม่ต้องทดสอบสำหรับเครื่องเอกซเรย์เคลื่อนที่
          </div>
        </div>

        <!-- หมายเหตุท้ายฟอร์ม (จาก backend ถ้ามี) -->
        <div class="footer-note" v-if="footerNote">
          {{ footerNote }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// --------- หัวฟอร์ม (ข้อมูลจากฐาน) ----------
const header = ref({
  machineName: '..................................................',
  qcDate: '........../............/..........',
  testerName: '...................................',
  testerPosition: '.................................'
})

// --------- ตารางรายการตรวจสอบ (ข้อมูลจากฐาน) ----------
const rows = ref([
  { no: 1, description: 'สภาพความมั่นคงของขาตั้งและตู้คอนโซล', result: '', remark: '' },
  { no: 2, description: 'ระบบเบรกหรือกลไกล็อกของหลอดเอกซเรย์', result: '', remark: '' },
  { no: 3, description: 'การเคลื่อนที่ของหลอดเอกซเรย์ โต๊ะผู้ป่วย และบักกี้', result: '', remark: '' },
  { no: 4, description: 'แผงควบคุมและปุ่มสั่งงานทำงานได้ถูกต้อง', result: '', remark: '' },
  { no: 5, description: 'สัญญาณเตือน ขณะเริ่มเปิดลำรังสีทำงานปกติ', result: '', remark: '' },
  { no: 6, description: 'สายไฟและปลั๊กอยู่ในสภาพดี ไม่มีชำรุดหรือร้อนผิดปกติ', result: '', remark: '' },
  { no: 7, description: 'อุปกรณ์เสริม (ตะแกรงกริด/ตัวรองผู้ป่วย) พร้อมใช้งาน', result: '', remark: '' },
  { no: 8, description: 'จอภาพแสดงผลภาพเอกซเรย์สว่างชัดเจน', result: '', remark: '' },
  { no: 9, description: 'เครื่องวัดระยะ SID และอุปกรณ์จัดท่าพร้อมใช้งาน', result: '', remark: '' },
  { no: 10, description: 'บริเวณรอบเครื่องเอกซเรย์โล่ง ปลอดภัย', result: '', remark: '' }
])

const footerNote = ref('')

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  if (!id) return
  // โหลดข้อมูลจริงค่อยใส่ภายหลังจาก backend
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ใช้ TH Sarabun ให้ทั้งหน้า */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม print */
.print-toolbar {
  margin-bottom: 18px;
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
  padding: 18mm 0 14mm;
  font-size: 14pt;
}

/* Header – ทำให้ระยะห่างระหว่างบรรทัดเท่ากัน */
.header-main {
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
  margin-bottom: 3mm;  /* ระยะระหว่างบรรทัด 1–2 */
}

.title-sub {
  font-size: 14pt;
  margin-bottom: 3mm;  /* ระยะระหว่างบรรทัด 2–3 และ 3–4 */
}

.header-row-inline {
  display: flex;
  align-items: center;
  gap: 4mm;
}

/* เส้น underline */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short {
  min-width: 35mm;
}

.long {
  min-width: 60mm;
}

/* ตาราง F4 */
.f4-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f4-table th,
.f4-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.col-no {
  width: 12mm;
}

.col-desc {
  width: 90mm;
}

.col-pass,
.col-fail {
  width: 18mm;
}

.col-remark {
  width: auto;
}

.align-left {
  text-align: left;
}

/* หมายเหตุที่เพิ่มเข้ามา */
.note-block {
  margin-top: 4mm;
  font-size: 12pt;
}

.note-line {
  line-height: 1.2;
}

/* หมายเหตุท้ายฟอร์ม (จาก backend) */
.footer-note {
  margin-top: 3mm;
  font-size: 12pt;
}

/* สำหรับการพิมพ์ */
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

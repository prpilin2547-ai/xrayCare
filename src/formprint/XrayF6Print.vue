<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม Print + กระดาษ A4 -->
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

    <!-- กระดาษ A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ================= หัวฟอร์ม ================= -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F6 : ความคงที่ของค่าดัชนีปริมาณรังสี
            (Consistency of Exposure Index)
          </div>
          <div class="title-sub">
            ความถี่ : ทุก 3 เดือน
          </div>
        </div>

        <table class="f6-table">
  <tbody>

    <!-- ================= กลุ่ม CR/DR ================= -->
    <tr>
      <td colspan="4" class="align-left multi-line-cell">
        <div>ข้อมูลสำหรับระบบ CR / DR</div>

        <div>
          หมายเลขคาสเซท CR / DR :
          <span class="full-underline"></span>
        </div>

        <div>
          หมายเลขเครื่องอ่าน CR / DR :
          <span class="full-underline"></span>
        </div>
      </td>
    </tr>

    <!-- ================= กลุ่มข้อมูลเครื่องเอกซเรย์ ================= -->
    <tr>
      <td colspan="4" class="align-left multi-line-cell">
        <div>ข้อมูลเครื่องเอกซเรย์</div>

        <div>
          ยี่ห้อ : <span class="full-underline"></span>
          รุ่น : <span class="short-line full-underline"></span>
          หมายเลขเครื่อง : <span class="short-line full-underline"></span>
        </div>
      </td>
    </tr>

    <!-- ================= ขอบเขต ================= -->
    <tr>
      <td colspan="4" class="align-left multi-line-cell">
        <div>ขอบเขต</div>
        <div>ค่าแตกต่างจากค่าอ้างอิงพื้นฐาน (Baseline) น้อยกว่า ± 10%</div>
      </td>
    </tr>

    <!-- ================= ข้อมูลเบื้องต้น ================= -->
    <tr>
      <td colspan="4" class="align-left">
        ข้อมูลเบื้องต้น : ระบุเทอมของตัวชี้บอกปริมาณรังสี เช่น ฟูจิ ใช้ S, EI คือ
        <span class="underline short">{{ record.eiType }}</span>
      </td>
    </tr>

    <!-- ================= เทคนิคประมวลผลภาพ ================= -->
    <tr>
      <td colspan="4" class="align-left">
        เทคนิคประมวลผลภาพ :
        <span class="underline long"></span>
      </td>
    </tr>

    <!-- ================= ตาราง EI ================= -->
    <tr class="ei-header">
      <th>วันที่ทำการทดสอบ</th>
      <th>อ้างอิง</th>
      <th>ขอบเขตล่าง</th>
      <th>ขอบเขตบน</th>
    </tr>

    <!-- EI -->
<tr>
  <td class="align-left">EI</td>
  <td></td>
  <td></td>
  <td></td>
</tr>

<tr>
  <td class="align-left">EI จากเครื่อง</td>
  <td></td>
  <td></td>
  <td></td>
</tr>

<!-- ผสานเซลล์ตามที่ต้องการ -->
<tr>
  <td class="align-left" colspan="2">EI อยู่ในเกณฑ์ (P/F)</td>
  <td></td>
  <td></td>
</tr>

<tr>
  <td class="align-left" colspan="2">ข้อคิดเห็น</td>
  <td></td>
  <td></td>
</tr>


    <!-- ================= ปริมาณรังสี ================= -->
    <tr class="section-header">
      <td colspan="4" class="align-left">
        ปริมาณรังสีที่ใช้สำหรับการทดสอบ
        (กรณีศูนย์วิทยาศาสตร์การแพทย์ ดำเนินการวัดให้พร้อมตรวจมาตรฐานเครื่องเอกซเรย์ประจำปี)
      </td>
    </tr>

    <!-- เทคนิค -->
    <tr>
      <td class="align-left">
        เทคนิคการถ่ายภาพ<br />{{ record.technique }}
      </td>
      <td class="align-left">
        kV<br />{{ record.kv }}
      </td>
      <td class="align-left">
        mAs<br />{{ record.mas }}
      </td>
      <td class="align-left">
        Dose (mGy)<br />{{ record.dose }}
      </td>
    </tr>

    <!-- แถวว่าง -->
    <tr class="empty-row">
      <td></td><td></td><td></td><td></td>
    </tr>

  </tbody>
</table>

        <!-- ================= ลายเซ็น ================= -->
        <div class="signature-block">
          <div class="sig-line">
            ลงชื่อ .................................................. ผู้ทดสอบ
          </div>
          <div class="sig-line">
            ( {{ record.testerName || '........................................' }} )
          </div>
          <div class="sig-line">
            ตำแหน่ง ..........................................................
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ---------- โครงข้อมูลที่จะดึงจากฐาน ----------
const record = ref({
  // ข้อมูลระบบ CR/DR
  stationNo: '....................',
  plateNo: '....................',

  // ห้องเอกซเรย์
  roomName: '....................',
  floor: '',
  machineNo: '',

  // ข้อมูล EI
  eiType: '',

  // ตาราง EI
  eiRows: [
    { date: '', eiImage: '', eiConsole: '', eiBaseline: '', remark: '' },
    { date: '', eiImage: '', eiConsole: '', eiBaseline: '', remark: '' },
    { date: '', eiImage: '', eiConsole: '', eiBaseline: '', remark: '' }
  ],

  // เทคนิคการถ่ายภาพ
  technique: '',
  kv: '',
  mas: '',
  dose: '',

  // ลายเซ็น
  testerName: ''
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  // ดึงข้อมูลจริงจาก backend ถ้ามี
  // const res = await fetch(`/api/print/f6/${id}`)
  // const data = await res.json()
  // record.value = {...data}
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt !important;
  font-weight: 400;
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
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  background: #fff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 11pt !important;
}

/* กระดาษ A4 */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 180mm;
  padding: 18mm 0 14mm;
  font-size: 11pt !important;
}

/* หัวฟอร์ม – ชิดซ้าย */
.header-main {
  text-align: left;
  margin-bottom: 8mm;
}

/* title-main = 13 pt เท่านั้น */
.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 13pt !important;
}

.title-sub {
  margin-bottom: 2mm;
  font-size: 11pt !important;
}

/* เส้นกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
  font-size: 11pt !important;
}

.long { min-width: 70mm; }
.mid  { min-width: 40mm; }
.short{ min-width: 25mm; }

.f6-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.f6-table td, .f6-table th {
  border: 1px solid #000;
  padding: 2mm;
  width: 25%;       /* ทุกแถวเท่ากัน 4 คอลัมน์ */
  vertical-align: middle;
}

.ei-header th {
  font-weight: bold;
}

.multi-line-cell div {
  margin-bottom: 1mm;
}

.f6-table th {
  width: 25% !important;   /* 4 คอลัมน์แบ่งเท่ากัน */
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  vertical-align: middle;
  text-align: center;
  font-size: 11pt !important;
}

/* ความกว้างคอลัมน์ EI แบบสัดส่วน 40 / 20 / 20 / 20 */
.col-date {
  width: 40% !important;
}

.col-center {
  width: 20% !important;
}

.col-comment { width: auto; }

.align-left {
  text-align: left !important;
}

/* แถวหัวข้อแต่ละกลุ่ม */
.section-header td {
  font-weight: 700;
}

/* แถวหัวตาราง EI */
.ei-header th {
  font-weight: 700;
}

/* ลายเซ็น – ชิดขอบขวาให้ตรงกับขอบตาราง */
.signature-block {
  margin-top: 12mm;
  text-align: right;
  font-size: 11pt !important;
}

.sig-line {
  margin-bottom: 3mm;
  font-size: 11pt !important;
}

/* การพิมพ์ */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-toolbar { display: none; }
  .print-root { background: #fff; padding: 0; }
  .sheet-a4 { box-shadow: none; width: auto; min-height: auto; }
}

.multi-line-cell {
  padding: 3mm 2mm;
  line-height: 1.4;
}

/* เส้นขีดเต็มตาราง */
.full-underline {
  display: inline-block;
  border-bottom: 0.4pt solid #000;
  width: 120mm;   /* ปรับให้ยาวสุดตาราง */
  height: 4mm;
  vertical-align: middle;
}

.multi-line-cell {
  padding: 3mm 2mm;
  line-height: 1.4;
}

/* เส้นยาวปกติ */
.full-underline {
  display: inline-block;
  border-bottom: 0.4pt solid #000;
  width: 40mm;     /* เส้นยาวของ "ยี่ห้อ" */
  height: 4mm;
  vertical-align: middle;
}

/* เส้นสั้นสำหรับ รุ่น / หมายเลขเครื่อง */
.short-line {
  width: 25mm;      /* ปรับได้ */
}

.multi-line-cell {
  padding: 3mm 2mm;
  line-height: 1.4;
}

.empty-row td {
  height: 10mm;
}


</style>

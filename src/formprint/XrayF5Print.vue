<template>
  <div class="print-root">
    <!-- ปุ่ม Print -->
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

    <!-- กระดาษ A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)
          </div>
          <div class="title-sub">
            ความถี่ : {{ record.frequency || 'ทุก 3 เดือน' }}
          </div>
          <div class="title-sub">
            หมายเลขของแผ่นรับภาพ
            <span class="underline long">
              {{ record.plateNo }}
            </span>
          </div>
        </div>

        <!-- กล่องสรุปภาพรวมด้านบน -->
        <table class="summary-box">
          <tr>
            <td class="align-left">
              ค่าขอบเขต<br />
              ภาพปรากฏสม่ำเสมอ<br />
              ไม่มีสิ่งแปลกปลอม
            </td>
          </tr>
        </table>

        <table class="f5-table">
  <tbody>

    <!-- วันที่ (ล้างค่าในช่อง) -->
    <tr>
      <td class="col-label">วันที่</td>
      <td class="col-right-4" colspan="4"></td>
    </tr>

    <!-- ผู้ทดสอบ (ล้างค่าในช่อง) -->
    <tr>
      <td class="col-label">ผู้ทดสอบ</td>
      <td class="col-right-4" colspan="4"></td>
    </tr>

    <!-- ช่องข้อความ 3 บรรทัดรวมเป็นช่องเดียว / ไม่มีเส้นแบ่งแนวนอนใต้แถว -->
    <tr>
      <td class="col-label merged-text">
        ภาพปรากฏสม่ำเสมอหรือไม่? (Y/N)<br />
        มีสิ่งแปลกปลอมหรือไม่? (Y/N)<br />
        อธิบาย–สิ่งแปลกปลอม
      </td>


      <!-- ช่องขวาแบ่ง 4 ช่อง -->
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>

    <!-- ข้อคิดเห็น (1 แถว) -->
    <tr>
      <td class="col-label">ข้อคิดเห็น–ความดำภาพ (heel effect etc?)</td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>

    <!-- การแก้ไข -->
    <tr>
      <td class="col-label">การแก้ไข (ถ้าเป็นไปได้)</td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>

  </tbody>
</table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// โครงข้อมูล F5 (ยังเก็บไว้เผื่อใช้ต่อในอนาคต แม้ตอนนี้ไม่แสดงในช่องขวา)
const record = ref({
  frequency: 'ทุก 3 เดือน',
  plateNo: '',
  result: {
    date: '',
    tester: '',
    uniformYN: '',
    artifactYN: '',
    artifactDesc: '',
    comment: '',
    action: ''
  }
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id

  // ตัวอย่าง mock (ลบออกเมื่อใช้ข้อมูลจริง)
  record.value = {
    frequency: 'ทุก 3 เดือน',
    plateNo: "",
    result: {
      date: '27/11/2568',
      tester: 'รังสีเทคนิค ตัวอย่าง',
      uniformYN: 'Y',
      artifactYN: 'N',
      artifactDesc: '-',
      comment: 'ภาพสม่ำเสมอดี heel effect ตามปกติ',
      action: 'บันทึกค่าตรวจตามรอบปกติ'
    }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ TH Sarabun ทั้งหน้า + ขนาดพื้นฐาน 11pt + ระยะห่างบรรทัดเท่ากัน */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt;
  font-weight: 400;
  line-height: 1.4;
}

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
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 11pt;
}

/* กระดาษ A4 */
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
}

/* HEADER – ชิดซ้าย */
.header-main {
  text-align: left;
  margin-bottom: 8mm;
}

/* คำว่า “แบบบันทึก F5 …” = 13pt */
.title-main {
  font-weight: 700;
  font-size: 13pt;
  margin-bottom: 2mm;
  text-align: left;
}

/* ความถี่ / หมายเลขแผ่น = 11pt */
.title-sub {
  font-size: 11pt;
  margin-bottom: 2mm;
  text-align: left;
}

/* underline */
.underline {
  border-bottom: 0.4pt solid #000;
  display: inline-block;
  min-height: 6mm;
  padding: 0 2mm;
}
.long {
  min-width: 60mm;
}

/* กล่องสรุปด้านบน */
.summary-box {
  width: 100%;
  border-collapse: collapse;
  border: 0.4pt solid #000;
  margin-bottom: 8mm;
}

.summary-box td {
  padding: 4mm;
  text-align: left;
  line-height: 2.5; /* เพิ่มระยะห่างบรรทัดในกล่องนี้ให้มากขึ้น */
}

/* ตาราง F5 */
.f5-table {
  width: 100%;
  border-collapse: collapse;
}

.f5-table td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;
  vertical-align: middle;
}

/* ป้ายกำกับกว้างขึ้น เพื่อให้ข้อความยาวอยู่บรรทัดเดียว */
.col-label {
  width: 90mm;
}

.col-content {
  width: auto;
}

.align-left {
  text-align: left;
}

/* print */
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
  .merged-text {
  line-height: 2.5 !important;   /* ระยะห่างเท่ากับ summary-box */
}


}
</style>

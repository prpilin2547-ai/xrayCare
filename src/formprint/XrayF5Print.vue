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
      <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"/>
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

        <!-- ตารางผลการตรวจ -->
        <table class="f5-table">
          <tbody>
            <tr>
              <td class="col-label">วันที่</td>
              <td class="col-content">
                {{ record.result.date }}
              </td>
            </tr>

            <tr>
              <td class="col-label">ผู้ทดสอบ</td>
              <td class="col-content">
                {{ record.result.tester }}
              </td>
            </tr>

            <tr>
              <td class="col-label">ภาพปรากฏสม่ำเสมอหรือไม่? (Y/N)</td>
              <td class="col-content">
                {{ record.result.uniformYN }}
              </td>
            </tr>

            <tr>
              <td class="col-label">มีสิ่งแปลกปลอมหรือไม่? (Y/N)</td>
              <td class="col-content">
                {{ record.result.artifactYN }}
              </td>
            </tr>

            <tr>
              <td class="col-label">อธิบายสิ่งแปลกปลอม</td>
              <td class="col-content">
                {{ record.result.artifactDesc }}
              </td>
            </tr>

            <tr>
              <td class="col-label">ข้อคิดเห็น–ความผิดปกติ (heel effect etc.)</td>
              <td class="col-content">
                {{ record.result.comment }}
              </td>
            </tr>

            <tr>
              <td class="col-label">การแก้ไข (ถ้าเป็นไปได้)</td>
              <td class="col-content">
                {{ record.result.action }}
              </td>
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

// โครงข้อมูล F5
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

  // TODO: ให้ backend ส่งข้อมูลในโครงนี้ หรือ map ค่าให้ตรง
  // const res = await fetch(`/api/f5/${id}`)
  // const data = await res.json()
  //
  // record.value.frequency = data.frequency        // "ทุก 3 เดือน"
  // record.value.plateNo = data.plateNo
  // record.value.result = {
  //   date: data.dateText,
  //   tester: data.testerName,
  //   uniformYN: data.uniformYN,
  //   artifactYN: data.artifactYN,
  //   artifactDesc: data.artifactDesc,
  //   comment: data.comment,
  //   action: data.action
  // }

  // MOCK ตัวอย่าง (ลบเมื่อเชื่อม API จริง)
  record.value = {
    frequency: 'ทุก 3 เดือน',
    plateNo: 'IP-01',
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

* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

.print-root {
  background: #e5e7eb;   /* เทาอ่อนแบบภาพที่หนึ่ง */
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
  font-size: 16px;
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
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
  margin-bottom: 2mm;
}

.title-sub {
  font-size: 15pt;
  margin-bottom: 2mm;
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

/* กล่องสรุปบน */
.summary-box {
  width: 100%;
  border-collapse: collapse;
  border: 0.4pt solid #000;
  margin-bottom: 8mm;
  font-size: 14pt;
}

.summary-box td {
  padding: 4mm;
  text-align: left;
}

/* ตาราง F5 */
.f5-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14pt;
}

.f5-table td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;
  vertical-align: middle;
}

.col-label {
  width: 70mm;
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
}
</style>

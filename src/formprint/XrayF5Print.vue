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

    <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <!-- หัวฟอร์ม -->
<div class="header-main">
  <div class="title-main">
    แบบบันทึก F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)
  </div>

  <!-- ความถี่ : -->
  <div class="title-sub">
    <span class="bold-text">ความถี่ :</span>
    {{ record.frequency || 'ทุก 3 เดือน' }}
  </div>

  <!-- หมายเลขของแผ่นรับภาพ -->
  <div class="title-sub">
    <span class="bold-text">หมายเลขของแผ่นรับภาพ</span>
    <span class="underline long">
      {{ record.plateNo }}
    </span>
  </div>
</div>

<!-- กล่องสรุปภาพรวมด้านบน -->
<table class="summary-box">
  <tr>
    <td class="align-left">
      <span class="bold-text">ค่าขอบเขต</span><br />
      <span class="bold-text">ภาพปรากฏสม่ำเสมอ</span><br />
      <span class="bold-text">ไม่มีสิ่งแปลกปลอม</span>
    </td>
  </tr>
</table>

<!-- ตารางหลัก F5 -->
<table class="f5-table">
  <tbody>
    <!-- วันที่ -->
    <tr>
      <td class="col-label">
        <span class="bold-text">วันที่</span>
      </td>
      <td class="col-right-4" colspan="4"></td>
    </tr>

    <!-- ผู้ทดสอบ -->
    <tr>
      <td class="col-label">
        <span class="bold-text">ผู้ทดสอบ</span>
      </td>
      <td class="col-right-4" colspan="4"></td>
    </tr>

    <!-- 3 บรรทัดรวมเป็นช่องเดียว -->
    <tr>
      <td class="col-label merged-text">
        <span class="bold-text">ภาพปรากฏสม่ำเสมอหรือไม่? (Y/N)</span><br />
        <span class="bold-text">มีสิ่งแปลกปลอมหรือไม่? (Y/N)</span><br />
        <span class="bold-text">อธิบาย–สิ่งแปลกปลอม</span>
      </td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>

    <!-- ข้อคิดเห็น -->
    <tr>
      <td class="col-label">
        <span class="bold-text">ข้อคิดเห็น–ความดำภาพ (heel effect etc?)</span>
      </td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>

    <!-- การแก้ไข -->
    <tr>
      <td class="col-label">
        <span class="bold-text">การแก้ไข (ถ้าเป็นไปได้)</span>
      </td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
      <td class="small-box"></td>
    </tr>
  </tbody>
</table>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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

import { apiFetch } from '../api/client'

onMounted(async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  try {
    const res = await apiFetch(`/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    record.value.result.date = data.checkDate || ''
    record.value.result.tester = data.tester || ''
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData)
        if (parsed.frequency !== undefined) record.value.frequency = parsed.frequency
        if (parsed.plateNo !== undefined) record.value.plateNo = parsed.plateNo
        if (parsed.result && typeof parsed.result === 'object') Object.assign(record.value.result, parsed.result)
      } catch (_) {}
    }
  } catch (e) {
    console.error('Load checklist record error:', e)
  }
  // ค่าเริ่มต้นถ้าไม่มีจาก API
  if (!record.value.result.date) {
    record.value.result = {
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

<style src="./printLayout.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt;
  font-weight: 400;
  line-height: 1.4;
}

/* HEADER – ชิดซ้ายติดขอบเนื้อหา */
.header-main {
  text-align: left;
  margin-bottom: 8mm;
}

/* คำว่า “แบบบันทึก F5 …” = 13pt (ตัวเดียวที่ใหญ่กว่า) */
.title-main {
  font-weight: 700;
  font-size: 18pt;   /* ยกเว้นบรรทัดนี้ */
  margin-bottom: 2mm;
  text-align: left;
}

/* ความถี่ / หมายเลขแผ่น = 11pt และชิดซ้าย */
.title-sub {
  font-size: 16pt;
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
  line-height: 2.5;
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

/* ป้ายกำกับกว้างขึ้น */
.col-label {
  width: 90mm;
}

.col-right-4 {
  width: auto;
}

.small-box {
  width: auto;
  border: 0.4pt solid #000;
}

.align-left {
  text-align: left;
}
.merged-text {
    line-height: 2.5 !important; /* ระยะห่างเท่ากับ summary-box */
  }
  .bold-text {
  font-weight: 700 !important;
}


@media print {
  .f5-table td, .summary-box td { border: 1px solid #000 !important; }
}
</style>


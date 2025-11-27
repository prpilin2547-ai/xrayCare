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

        <!-- กล่องข้อมูลระบบ CR / DR -->
        <div class="info-box">
          <div class="info-row">
            ข้อมูลสำหรับระบบ CR / DR
          </div>
          <div class="info-row">
            หมายเลขสถานีของระบบ CR / DR :
            <span class="underline long">
              {{ record.stationNo }}
            </span>
          </div>
          <div class="info-row">
            หมายเลขแผ่นรับภาพของระบบ CR / DR :
            <span class="underline long">
              {{ record.plateNo }}
            </span>
          </div>
        </div>

        <!-- กล่องข้อมูลห้องเอกซเรย์ + Baseline -->
        <div class="info-box">
          <div class="info-row">
            ข้อมูลด้านห้องเอกซเรย์
          </div>
          <div class="info-row">
            ชื่อห้อง :
            <span class="underline mid">
              {{ record.roomName }}
            </span>
            ชั้น :
            <span class="underline short">
              {{ record.floor }}
            </span>
            หมายเลขเครื่อง :
            <span class="underline short">
              {{ record.machineNo }}
            </span>
          </div>

          <div class="info-row">
            ขอบเขต :
            ค่าความคลาดเคลื่อนจากค่าอ้างอิงพื้นฐาน (Baseline)
            ต้องไม่เกิน ± 10%
          </div>

          <div class="info-row">
            ข้อมูล EI เบื้องต้น :
            ระบุค่าดัชนีปริมาณรังสีที่ใช้ เช่น S#, LgM, EI คือ
            <span class="underline short">
              {{ record.eiType }}
            </span>
          </div>
        </div>

        <!-- ================= ตารางหลัก (EI) ================= -->
        <table class="f6-table">
          <thead>
            <tr>
              <th class="col-date">วันที่ทำการทดสอบ</th>
              <th class="col-center">EI (จากภาพ)</th>
              <th class="col-center">EI จากเครื่อง</th>
              <th class="col-center">EI อ้างอิงเบื้องต้น (P/F)</th>
              <th class="col-comment">ข้อคิดเห็น</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in record.eiRows"
              :key="'ei-row-' + idx"
            >
              <td class="col-date align-left">
                {{ row.date || '' }}
              </td>
              <td class="col-center">
                {{ row.eiImage || '' }}
              </td>
              <td class="col-center">
                {{ row.eiConsole || '' }}
              </td>
              <td class="col-center">
                {{ row.eiBaseline || '' }}
              </td>
              <td class="col-comment align-left">
                {{ row.remark || '' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ================= ตารางเทคนิคการถ่ายภาพ ================= -->
        <div class="exposure-block">
          <div class="info-row">
            ปริมาณรังสีที่ใช้สำหรับการทดสอบ
            (กรณีมีผู้ป่วยทดแทนมาตรฐาน หรือใช้แฟนท่อมมาตรฐาน)
          </div>

          <table class="expo-table">
            <thead>
              <tr>
                <th>เทคนิคการถ่ายภาพ</th>
                <th>kV</th>
                <th>mAs</th>
                <th>Dose (mGy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="align-left">
                  {{ record.technique || '' }}
                </td>
                <td>{{ record.kv || '' }}</td>
                <td>{{ record.mas || '' }}</td>
                <td>{{ record.dose || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

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

  // ตาราง EI (อย่างน้อย 3–5 แถว)
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
  // เปิด dialog พิมพ์ของเบราว์เซอร์ (Google Chrome / Edge)
  window.print()
}

// ดึงข้อมูลจากฐาน ตาม id ที่ส่งมาใน URL
onMounted(async () => {
  const id = route.params.id

  // 🔁 ตัวอย่างการดึงข้อมูล — ปรับ URL / โครง JSON ให้ตรงกับ backend ของคุณ
  // const res = await fetch(`/api/print/f6/${id}`)
  // const data = await res.json()
  // record.value = {
  //   stationNo: data.stationNo,
  //   plateNo: data.plateNo,
  //   roomName: data.roomName,
  //   floor: data.floor,
  //   machineNo: data.machineNo,
  //   eiType: data.eiType,
  //   eiRows: data.eiRows,
  //   technique: data.technique,
  //   kv: data.kv,
  //   mas: data.mas,
  //   dose: data.dose,
  //   testerName: data.testerName
  // }
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
  font-size: 16px;
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
  font-size: 14pt;
}

/* หัวฟอร์ม */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  margin-bottom: 2mm;
  font-size: 16pt;
}

/* กล่องข้อมูล */
.info-box {
  border: 0.4pt solid #000;
  padding: 3mm 4mm;
  margin-bottom: 4mm;
}

.info-row {
  margin-bottom: 2mm;
}

/* เส้นกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.long {
  min-width: 70mm;
}
.mid {
  min-width: 40mm;
}
.short {
  min-width: 25mm;
}

/* ตาราง EI */
.f6-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
  margin-top: 4mm;
}

.f6-table th,
.f6-table td {
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.col-date {
  width: 32mm;
}

.col-center {
  width: 28mm;
}

.col-comment {
  width: auto;
}

.align-left {
  text-align: left;
}

/* ตารางเทคนิคการถ่ายภาพ */
.exposure-block {
  margin-top: 6mm;
}

.expo-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
  margin-top: 2mm;
}

.expo-table th,
.expo-table td {
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  text-align: center;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 12mm;
  text-align: center;
  font-size: 14pt;
}

.sig-line {
  margin-bottom: 3mm;
}

/* การพิมพ์ */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-toolbar {
    display: none;
  }

  .print-root {
    background: #fff;
    padding: 0;
  }

  .sheet-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
  }
}
</style>

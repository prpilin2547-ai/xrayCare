<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม Print + A4 -->
  <div class="print-root">
    <!-- ปุ่มพิมพ์ (จะหายไปตอนสั่ง Print) -->
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
        <!-- ส่วนหัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F10 : แบบบันทึกการตรวจสอบความสว่างแสงไฟ
          </div>
          <div class="title-sub">
            ความถี่ : ทุก 1 เดือน
          </div>
        </div>

        <!-- ข้อมูลเครื่อง / หน่วยงาน -->
        <div class="meta-block">
          <!-- แถว 1 : วันที่ / ประเภทเครื่องเอกซเรย์ -->
          <div class="meta-row meta-row-grid">
  <span class="meta-label">วันที่</span>
  <span class="underline long">{{ record.date }}</span>

  <span class="meta-label">ประเภทเครื่องเอกซเรย์</span>
  <span class="underline long">{{ record.deviceType }}</span>

  <span class="meta-label"></span>
  <span></span>
</div>


          <!-- แถว 2 : หน่วยงาน / ตำบล / อำเภอ / จังหวัด (อยู่บรรทัดเดียวกัน) -->
          <div class="meta-row meta-row-grid-4">
            <span class="meta-label">หน่วยงาน</span>
            <span class="underline mid">{{ record.department }}</span>

            <span class="meta-label">ตำบล</span>
            <span class="underline short-narrow">{{ record.location }}</span>

            <span class="meta-label">อำเภอ</span>
            <span class="underline short-narrow">{{ record.district }}</span>

            <span class="meta-label">จังหวัด</span>
            <span class="underline short">{{ record.province }}</span>
          </div>

          <!-- แถว 3 : เครื่องเอกซเรย์ / Model / S/N -->
          <div class="meta-row meta-row-grid">
            <span class="meta-label">เครื่องเอกซเรย์</span>
            <span class="underline mid">{{ record.deviceName }}</span>

            <span class="meta-label">Model :</span>
            <span class="underline short-narrow">{{ record.model }}</span>

            <span class="meta-label">S/N :</span>
            <span class="underline short">{{ record.serialNo }}</span>
          </div>

          <!-- แถว 4 : สมาร์ทโฟน ยี่ห้อ / รุ่น -->
          <div class="meta-row meta-row-grid">
            <span class="meta-label">สมาร์ทโฟน ยี่ห้อ</span>
            <span class="underline mid">{{ record.deviceName }}</span>

            <span class="meta-label">รุ่น :</span>
            <span class="underline short-narrow">{{ record.model }}</span>

            <span></span>
            <span></span>
          </div>

          <!-- แถว 5 : Application -->
          <div class="meta-row meta-row-grid">
            <span class="meta-label">Application :</span>
            <span class="underline long">{{ record.application }}</span>

            <span></span><span></span>
            <span></span><span></span>
          </div>

          <!-- แถว 6 : Calibration -->
          <div class="meta-row meta-row-grid">
            <span class="meta-label">Calibration :</span>
            <span class="underline long">{{ record.calibration }}</span>

            <span></span><span></span>
            <span></span><span></span>
          </div>
        </div>

<!-- ตารางค่าความสว่าง (เหมือน PDF ต้นฉบับ รูปที่ 1) -->
<!-- ตารางค่าความสว่าง -->
<table class="f10-table">
  <thead>
    <tr>
      <th class="col-run">ครั้งที่</th>
      <th class="col-iav">ความสว่างแสงไฟ (I<sub>AV</sub>)</th>
      <th class="col-bg">Background (I<sub>BG</sub>)</th>
    </tr>
  </thead>

  <tbody>
    <!-- แถวที่ 2: ครั้งที่ 1 -->
    <tr>
      <td class="col-run">1</td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
    </tr>

    <!-- แถวที่ 3: ครั้งที่ 2 -->
    <tr>
      <td class="col-run">2</td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
    </tr>

    <!-- แถวที่ 4: ครั้งที่ 3 -->
    <tr>
      <td class="col-run">3</td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
      <td>
        <div class="quad-box">
          <div></div><div></div>
          <div></div><div></div>
        </div>
      </td>
    </tr>
  </tbody>
</table>



        <!-- ส่วนคำนวณ IAV / IBG / ILBD -->
        <div class="formula-block">
          <div class="formula-row">
            I<sub>AV</sub> :
            <span class="underline formula">
              {{ record.iav }}
            </span>
          </div>

          <div class="formula-row">
            I<sub>BG(AV)</sub> :
            <span class="underline formula">
              {{ record.ibg }}
            </span>
          </div>

          <div class="formula-row">
            I<sub>LBD</sub> = I<sub>AV</sub> - I<sub>BG(AV)</sub> =
            <span class="underline formula-wide">
              {{ record.ilbd }}
            </span>
          </div>
        </div>

        <!-- ลายเซ็นผู้ทดสอบ -->
        <div class="signature-block">
          <div class="sig-row sig-row-name">
            ลงชื่อ.......................................................................ผู้ทดสอบ
          </div>
          <div class="sig-row sig-row-parenthesis">
            (...........................................................................)
          </div>
          <div class="sig-row">
            ตำแหน่ง.................................................................................
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

const record = ref({
  date: '',
  deviceType: '',
  department: '',
  location: '',
  district: '',
  province: '',
  deviceName: '',
  model: '',
  serialNo: '',
  application: '',
  calibration: '',
  runs: [
    { runNo: 1 },
    { runNo: 2 },
    { runNo: 3 }
  ],
  iav: '',
  ibg: '',
  ilbd: '',
  testerName: '',
  testerFullName: '',
  testerPosition: ''
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  if (!id) return
  // โหลดข้อมูลจริงค่อยใส่ภายหลัง
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ TH Sarabun ทั้งหน้า + ขนาดพื้นฐาน 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt;
  font-weight: 400;
}

/* ===== พื้นหลัง & ปุ่ม ===== */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

/* ===== แผ่น A4 ===== */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 180mm;
  padding: 18mm 0 14mm;
}

/* ===== HEADER & META ให้เว้นบรรทัดเท่ากัน ===== */
.header-main {
  text-align: left;
  margin-bottom: 0;
}

.title-main {
  font-weight: 700;
  font-size: 13pt;
  margin-bottom: 3mm;
}

.title-sub {
  font-size: 11pt;
  margin-bottom: 3mm;
}

.meta-block {
  margin-left: 0;
  margin-bottom: 6mm;
}

.meta-row {
  margin-bottom: 3mm;
}

.meta-row-grid {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr auto 1fr;
  column-gap: 3mm;
  align-items: flex-end;
}

.meta-row-grid-4 {
  display: grid;
  grid-template-columns: auto 1fr auto 18mm auto 18mm auto 25mm;
  column-gap: 3mm;
  align-items: flex-end;
}

.meta-label {
  white-space: nowrap;
}

.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.long { min-width: 40mm; }
.mid  { min-width: 40mm; }
.short { min-width: 20mm; }
.short-narrow { min-width: 5mm; }

/* ===== ตาราง F10 ===== */
/* ===== ตาราง F10 ===== */
.f10-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 10mm;
}

.f10-table th,
.f10-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  text-align: center;
  vertical-align: middle;
}

/* ความกว้างคอลัมน์ให้เหมือนฟอร์มรูปที่ 1 */
.col-run { width: 20mm; }
.col-iav { width: 80mm; }
.col-bg  { width: 80mm; }

/* เลขครั้งที่ อยู่กลางบล็อก */
.run-number {
  vertical-align: middle;
}


/* ===== block ค่าคำนวณ ===== */
.formula-block {
  margin-left: 10mm;
  margin-bottom: 10mm;
}

.formula-row {
  margin-bottom: 2mm;
}

.formula-block .underline {
  border-bottom: 0.4pt solid #000;
}

.formula {
  min-width: 40mm;
  display: inline-block;
}

.formula-wide {
  min-width: 60mm;
  display: inline-block;
}

/* ===== ลายเซ็น ===== */
.signature-block {
  margin-top: 10mm;
  text-align: right;
}

.sig-row {
  margin-bottom: 3mm;
}

.sig-row-parenthesis {
  text-indent: 3mm;
}

/* ===== PRINT ===== */
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
  .col-iav-group,
.col-bg-group {
  text-align: center;
  font-weight: 700;
}

.col-iav-half,
.col-bg-half {
  text-align: center;
  height: 8mm;
}

/* ความกว้างแบบสมมาตรเหมือนฟอร์มราชการ */
.col-iav { width: 80mm; }
.col-bg  { width: 80mm; }


  
  .equal-header {
  width: 50%;            /* กินพื้นที่ฝั่งขวา 50%-50% อย่างสมมาตร */
  text-align: center;
  font-weight: 700;
}
/* กล่องแบ่งเป็น 4 ช่อง ใน 1 เซลล์ (บน-ล่าง ซ้าย-ขวา) */
.quad-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 18mm;           /* ปรับได้ตามความสูงที่ต้องการ */
  gap: 0;
}

.quad-box > div {
  border: 0.4pt solid #000;
}


}
</style>

<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม Print + A4 -->
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
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F8-1 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR
          </div>
          <div class="title-sub">
            ความถี่ : {{ header.frequency }}
          </div>
        </div>

        <!-- ตารางหลัก ROI 80% -->
        <div class="table-wrapper">
          <table class="f81-table">
            <thead>
  <!-- แถวหัว 1: หัวหลัก -->
  <tr>
    <th rowspan="3" class="col-ip">IP no.</th>
    <th rowspan="3" class="col-ip">IP size</th>
    <th rowspan="3" class="col-ip">ID</th>
    <th rowspan="3" class="col-ip">Type</th>
    <th rowspan="3" class="col-ip">EI / S</th>

    <!-- ROI 80% ครอบ 8 ช่อง -->
    <th colspan="8" class="col-roi">
      ROI 80%
    </th>

    <!-- กลุ่มการแปรผล -->
    <th colspan="2" class="col-result-head">
      การแปรผล (P/F)
    </th>
  </tr>

  <!-- แถวหัว 2: PV / PVSD (ทั้งฝั่ง ROI และฝั่งผลการแปรผล) -->
  <tr>
    <!-- ROI: PV ครอบ 1 2 3 mean -->
    <th colspan="4" class="col-roi-sub">PV</th>
    <!-- ROI: PVSD ครอบ 4 5 6 mean -->
    <th colspan="4" class="col-roi-sub">PVSD</th>

    <!-- ผลการแปรผล: แค่ชื่อ PV / PVSD (ไม่มีจุดไข่ปลาแล้ว) -->
    <th class="col-result">PV</th>
    <th class="col-result">PVSD</th>
  </tr>

  <!-- แถวหัว 3: ตัวเลข + mean + จุดไข่ปลาในช่องว่างด้านล่าง -->
  <tr>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>mean</th>
    <th>4</th>
    <th>5</th>
    <th>6</th>
    <th>mean</th>
    <!-- ช่องว่างด้านล่างของ PV / PVSD -->
    <th>............</th>
    <th>............</th>
  </tr>
</thead>

            <tbody>
              <!-- แถวข้อมูลแต่ละ IP -->
              <tr
                v-for="(row, index) in rows"
                :key="index"
              >
                <td>{{ row.ipNo }}</td>
                <td>{{ row.ipSize }}</td>
                <td>{{ row.readerId }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.eiOrS }}</td>

                <!-- PV 1–3 + mean -->
                <td>{{ row.pv[0] || '' }}</td>
                <td>{{ row.pv[1] || '' }}</td>
                <td>{{ row.pv[2] || '' }}</td>
                <td>{{ row.pvMean || '' }}</td>

                <!-- PVSD 4–6 + mean -->
                <td>{{ row.pvsd[0] || '' }}</td>
                <td>{{ row.pvsd[1] || '' }}</td>
                <td>{{ row.pvsd[2] || '' }}</td>
                <td>{{ row.pvsdMean || '' }}</td>

                <!-- ผลการแปรผล P/F (ช่องว่างด้านล่างจะเป็นของแต่ละแถวเอง) -->
                <td>{{ row.pvResult || '' }}</td>
                <td>{{ row.pvsdResult || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- พื้นที่ลายเซ็นด้านล่าง ขวา -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ.............................................................ผู้ทดสอบ
          </div>
          <div class="sig-row">
            (............................................................)
          </div>
          <div class="sig-row">
            ตำแหน่ง.......................................................................
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

// ข้อมูลหัวฟอร์ม (ความถี่ ฯลฯ)
const header = ref({
  frequency: 'ทุก 6 เดือน', // ค่า default ตามแบบฟอร์ม
})

// ข้อมูลแถวตาราง (แต่ละ IP)
const rows = ref([
  { ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '', pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: '' },
  { ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '', pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: '' },
  { ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '', pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: '' },
  { ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '', pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: '' },
  { ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '', pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: '' },
])

// ปุ่มสั่งพิมพ์
const handlePrint = () => {
  window.print()
}

// ดึงข้อมูลจริงจากฐาน (ปรับ URL/โครง data ให้ตรง backend ของคุณ)
onMounted(async () => {
  const id = route.params.id
  // const res = await fetch(`/api/print/f8-1/${id}`)
  // const data = await res.json()
  // header.value.frequency = data.frequency || 'ทุก 6 เดือน'
  // rows.value = data.rows
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap');

/* ฟอนต์ทั้งหน้า = 11pt ตัวบาง */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt !important;
  font-weight: 400;
}

/* พื้นหลังเทาอ่อน */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Toolbar ปุ่ม Print */
.print-toolbar {
  margin-bottom: 18px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
}

/* แผ่น A4 */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 185mm;
  padding: 18mm 0 16mm;
}

/* Header – ชิดซ้าย */
.header-main {
  text-align: left;
  margin-bottom: 10mm;
}

/* ชื่อแบบบันทึกให้ 13pt หนา */
.title-main {
  font-weight: 700;
  font-size: 13pt !important;
  margin-bottom: 2mm;
}

/* ความถี่ – 11pt ตัวบาง */
.title-sub {
  font-weight: 400;
}

/* ตารางหลัก */
.table-wrapper {
  width: 100%;
}

.f81-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

/* หัวตาราง: ให้บางแต่ไม่ต้องสูงมาก */
.f81-table th {
  border: 0.4pt solid #000;
  padding: 1.2mm 0.8mm;
  vertical-align: middle;
  text-align: center;
  font-size: 11pt !important;
  font-weight: 400;
  white-space: nowrap;
}

/* ⭐ ช่องตาราง 5 แถวล่าง (tbody) ให้เท่ากับ f82-table = 3mm 2mm ⭐ */
.f81-table tbody td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;          /* ← ทำให้ช่องว่างด้านล่างทั้ง 5 แถวกว้าง/สูงเท่าตารางบน */
  vertical-align: middle;
  text-align: center;
  font-size: 11pt !important;
  font-weight: 400;
  white-space: nowrap;
}

/* คอลัมน์ซ้าย (IP/ID/Type/EI) */
.col-ip {
  padding-left: 0.8mm;
  padding-right: 0.8mm;
}

/* หัวกลุ่มผลการแปรผล */
.col-result-head {
  text-align: center;
}

/* คอลัมน์ PV / PVSD */
.col-result {
  padding-left: 0.9mm;
  padding-right: 0.9mm;
}

/* จุดไข่ปลาในหัว P/F */
.pf-head {
  font-size: 11pt;
  font-weight: 400;
}

/* ลายเซ็น */
.signature-block {
  width: 100%;
  margin-top: 14mm;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.sig-row {
  margin-bottom: 3mm;
  white-space: nowrap;
}

/* ตั้งค่าหน้ากระดาษตอนพิมพ์ */
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
  .col-roi {
  text-align: center;
}

.col-roi-sub {
  text-align: center;
  font-weight: 400;
}

.col-result-head,
.col-result {
  text-align: center;
}

}
</style>

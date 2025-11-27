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
      <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"/>
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
              <!-- บรรทัดหัวตาราง 1 -->
              <tr>
                <th rowspan="3" class="col-ip">IP no.</th>
                <th rowspan="3" class="col-ip">IP size</th>
                <th rowspan="3" class="col-ip">ID</th>
                <th rowspan="3" class="col-ip">Type</th>
                <th rowspan="3" class="col-ip">EI / S</th>

                <th colspan="8" class="col-roi">
                  ROI 80%
                </th>

                <th colspan="2" class="col-result">
                  การแปรผล (P/F)
                </th>
              </tr>

              <!-- บรรทัดหัวตาราง 2 -->
              <tr>
                <th colspan="4">PV</th>
                <th colspan="4">PVSD</th>
                <th rowspan="2">PV</th>
                <th rowspan="2">PVSD</th>
              </tr>

              <!-- บรรทัดหัวตาราง 3 -->
              <tr>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>mean</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>mean</th>
              </tr>
            </thead>

            <tbody>
              <!-- แถวข้อมูลแต่ละ IP -->
              <tr
                v-for="(row, index) in rows"
                :key="index"
              >
                <td class="align-center">{{ row.ipNo }}</td>
                <td class="align-center">{{ row.ipSize }}</td>
                <td class="align-center">{{ row.readerId }}</td>
                <td class="align-center">{{ row.type }}</td>
                <td class="align-center">{{ row.eiOrS }}</td>

                <!-- PV 1–3 + mean -->
                <td class="align-center">{{ row.pv[0] || '' }}</td>
                <td class="align-center">{{ row.pv[1] || '' }}</td>
                <td class="align-center">{{ row.pv[2] || '' }}</td>
                <td class="align-center">{{ row.pvMean || '' }}</td>

                <!-- PVSD 4–6 + mean -->
                <td class="align-center">{{ row.pvsd[0] || '' }}</td>
                <td class="align-center">{{ row.pvsd[1] || '' }}</td>
                <td class="align-center">{{ row.pvsd[2] || '' }}</td>
                <td class="align-center">{{ row.pvsdMean || '' }}</td>

                <!-- ผลการแปรผล P/F -->
                <td class="align-center">{{ row.pvResult || '' }}</td>
                <td class="align-center">{{ row.pvsdResult || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- พื้นที่ลายเซ็นด้านล่าง -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ.............................................................ผู้ทดสอบ
          </div>
          <div class="sig-row">
            (..........................................................................)
          </div>
          <div class="sig-row">
            ตำแหน่ง..............................................................
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
  // mock ไว้ให้เห็นโครง – เมื่อดึงจากฐานก็เขียนทับได้เลย
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],      // PV ตำแหน่ง 1–3
    pvMean: '',            // ค่าเฉลี่ย PV
    pvsd: ['', '', ''],    // PVSD ตำแหน่ง 4–6
    pvsdMean: '',          // ค่าเฉลี่ย PVSD
    pvResult: '',          // P หรือ F
    pvsdResult: '',        // P หรือ F
  },
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

  // ตัวอย่างโครงเรียก API (comment ไว้ให้)
  // const res = await fetch(`/api/print/f8-1/${id}`)
  // const data = await res.json()
  //
  // header.value = {
  //   frequency: data.frequency || 'ทุก 6 เดือน',
  // }
  //
  // rows.value = data.rows
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ใช้ฟอนต์ TH Sarabun ทั้งหน้า */
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
  font-size: 16px;
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
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 10mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  font-size: 16pt;
}

/* ตารางหลัก */
.table-wrapper {
  width: 100%;
}

.f81-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f81-table th,
.f81-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
}

.col-ip {
  width: 18mm;
}

.col-roi {
  text-align: center;
}

.col-result {
  text-align: center;
}

.align-center {
  text-align: center;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 14mm;
  font-size: 14pt;
}

.sig-row {
  margin-bottom: 3mm;
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
}
</style>

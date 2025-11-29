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

                <!-- ผลการแปรผล P/F -->
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
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],
    pvMean: '',
    pvsd: ['', '', ''],
    pvsdMean: '',
    pvResult: '',
    pvsdResult: '',
  },
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],
    pvMean: '',
    pvsd: ['', '', ''],
    pvsdMean: '',
    pvResult: '',
    pvsdResult: '',
  },
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],
    pvMean: '',
    pvsd: ['', '', ''],
    pvsdMean: '',
    pvResult: '',
    pvsdResult: '',
  },
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],
    pvMean: '',
    pvsd: ['', '', ''],
    pvsdMean: '',
    pvResult: '',
    pvsdResult: '',
  },
  {
    ipNo: '',
    ipSize: '',
    readerId: '',
    type: '',
    eiOrS: '',
    pv: ['', '', ''],
    pvMean: '',
    pvsd: ['', '', ''],
    pvsdMean: '',
    pvResult: '',
    pvsdResult: '',
  },
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

/* ใช้ฟอนต์ TH Sarabun ทั้งหน้า ตัวบางเป็นค่าเริ่มต้น */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 12pt;
  font-weight: 400; /* ตัวบาง */
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
  font-size: 12pt; /* ให้เท่ากับตัวอื่น */
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

/* ชื่อแบบบันทึกให้ใหญ่และหนา */
.title-main {
  font-weight: 700;        /* หนาเฉพาะบรรทัดนี้ */
  margin-bottom: 2mm;
  font-size: 14pt;         /* ใหญ่กว่าส่วนอื่น */
}

/* ความถี่ – หนาแต่ขนาด 12 */
.title-sub {
  font-size: 12pt;
  font-weight: 700;        /* หนาเฉพาะบรรทัดนี้ */
}

/* ตารางหลัก = 12 ตัวบาง */
.table-wrapper {
  width: 100%;
}

.f81-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12pt;
}

.f81-table th,
.f81-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
  font-size: 12pt;
  font-weight: 400;       /* บังคับให้หัวตารางก็เป็นตัวบาง */
}

/* ลายเซ็น = 12 ตัวบาง */
.signature-block {
  width: 100%;
  margin-top: 14mm;
  font-size: 12pt;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.sig-row {
  margin-bottom: 3mm;
  white-space: nowrap;
  font-weight: 400;
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

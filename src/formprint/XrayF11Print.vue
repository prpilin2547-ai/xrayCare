<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นเท่านั้น -->
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

    <!-- กระดาษ A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย
          </div>
        </div>

        <!-- ตารางหลักตามฟอร์ม -->
        <table class="f11-table">
          <thead>
            <tr>
              <th class="col-region">
                บริเวณฉายรังสี
              </th>
              <th class="col-small">
                ค่าความต่าง<br />
                ศักย์<br />
                (kV)
              </th>
              <th class="col-small">
                ค่ากระแสไฟฟ้า<br />
                กับเวลา<br />
                (mAs)
              </th>
              <th class="col-small">
                ระยะโฟกัสถึง<br />
                ตัวรับภาพ<br />
                (cm)<br />
                (FTD)
              </th>
              <th class="col-small">
                ความหนา<br />
                ของอวัยวะ<br />
                (cm)<br />
                (tₚ)
              </th>
              <th class="col-small">
                ระยะ<br />
                Bucky<br />
                (cm)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in record.rows"
              :key="index"
            >
              <td class="align-left">
                {{ row.region }}
              </td>
              <td>{{ row.kv }}</td>
              <td>{{ row.mas }}</td>
              <td>{{ row.ftd }}</td>
              <td>{{ row.tp }}</td>
              <td>{{ row.bucky }}</td>
            </tr>
          </tbody>
        </table>

        <!-- พื้นที่ว่างด้านล่าง (ให้ใกล้เคียง PDF) -->
        <div class="bottom-space"></div>

        <!-- ลายเซ็นผู้ตรวจสอบ -->
        <div class="sign-block">
          <div class="sign-inner">
            <div class="sign-line">
              ลงชื่อ..............................................................ผู้ทดสอบ
            </div>
            <div class="sign-line">
              (.................................................................)
            </div>
            <div class="sign-line">
              ตำแหน่ง.........................................................
            </div>
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
  id: route.params.id || null,
  rows: [
    { region: 'Chest PA',     kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'L-Spine AP',   kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'L-Spine LAT',  kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Abdomen AP',   kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Pelvis AP',    kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Skull AP/PA',  kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Skull LAT',    kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: '',             kv: '', mas: '', ftd: '', tp: '', bucky: '' }
  ]
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  if (!id) return
  // โหลดข้อมูลจริงจาก backend ถ้ามี
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

/* หน้า print */
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
  padding: 6px 20px;
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

/* เนื้อในกระดาษ */
.sheet-inner {
  width: 180mm;
  padding: 15mm 0 12mm;
}

/* หัวฟอร์ม */
.header-main {
  text-align: left;
  margin-bottom: 7mm;
}

.title-main {
  font-weight: 700;
  font-size: 13pt;
}

/* ตาราง F11 */
.f11-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11pt;
}

.f11-table th,
.f11-table td {
  border: 0.4pt solid #000;
  padding: 1mm 1mm;
  text-align: center;
  vertical-align: middle;
  height: 9mm;
}

/* คอลัมน์ตามฟอร์มราชการ */
.col-region {
  width: 45mm;
}

.col-small {
  width: 26mm;
}

.align-left {
  text-align: left;
  padding-left: 3mm;
}

/* พื้นที่ว่างก่อนลายเซ็น */
.bottom-space {
  height: 12mm;
}

/* ลายเซ็นชิดขวาเหมือนเดิม แต่ข้อความจัดชิดซ้ายภายในกล่อง */
.sign-block {
  margin-top: 6mm;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.sign-inner {
  width: 85mm;        /* กว้างกำหนดให้เหมือนช่องลายเซ็นในฟอร์มราชการ */
  text-align: left;   /* จัดบรรทัดให้ชิดซ้าย */
}

.sign-line {
  margin-bottom: 2mm;
  font-size: 11pt;
}

/* ให้วงเล็บ "(" ตรงกับตัว อ. ในคำว่า "ลงชื่อ" */
.sign-line-parenthesis {
  padding-left: 21mm;   /* ปรับตรงกับตำแหน่งตัว อ. */
}


/* ให้คำว่า "ตำแหน่ง" ตรงกับคำว่า "ลงชื่อ" (ตัว ล.) */
.sign-line-position {
  padding-left: 0mm;    /* ตรงกับบรรทัดแรก ไม่ต้องขยับเพิ่มเติม */
}


/* Print layout */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-toolbar {
    display: none;
  }

  .print-root {
    padding: 0;
    background: #ffffff;
  }

  .sheet-a4 {
    width: auto;
    min-height: auto;
    box-shadow: none;
  }
}
</style>

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
                ค่าความต่างศักย์<br />
                (kV)
              </th>
              <th class="col-small">
                ค่ากระแสไฟฟ้า<br />
                กับเวลา (mAs)
              </th>
              <th class="col-small">
                ระยะโฟกัสถึง<br />
                ตัวรับภาพ (cm)<br />
                (FTD)
              </th>
              <th class="col-small">
                ความหนา<br />
                ของอวัยวะ (cm)<br />
                (tₚ)
              </th>
              <th class="col-small">
                ระยะ<br />
                Bucky (cm)
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
              <td>
                {{ row.kv }}
              </td>
              <td>
                {{ row.mas }}
              </td>
              <td>
                {{ row.ftd }}
              </td>
              <td>
                {{ row.tp }}
              </td>
              <td>
                {{ row.bucky }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- พื้นที่ว่างด้านล่าง (ให้ใกล้เคียง PDF) -->
        <div class="bottom-space"></div>

        <!-- ลายเซ็นผู้ตรวจสอบ (จัดไปด้านขวาให้แนวกันทั้ง 3 บรรทัด) -->
        <div class="sign-block">
          <div class="sign-inner">
            <div class="sign-line">
              ลงชื่อ......................................................................................ผู้ทดสอบ
            </div>
            <div class="sign-line sign-line-parenthesis">
              (.....................................................................................)
            </div>
            <div class="sign-line">
              ตำแหน่ง..................................................................................
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

// โครงข้อมูลสำหรับ F11 (ตัวอย่างเริ่มต้น)
// ของจริงจะถูกแทนที่ด้วยข้อมูลจากฐาน
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
    // แถวว่างเผื่อกรอกเพิ่มเติม (เพิ่มใต้บรรทัดสุดท้ายอีก 1 แถว)
    { region: '',             kv: '', mas: '', ftd: '', tp: '', bucky: '' }
  ]
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id
  if (!id) return

  try {
    // const res = await fetch(`/api/prints/f11/${id}`)
    // const data = await res.json()
    // record.value = data
  } catch (err) {
    console.error('โหลดข้อมูล F11 ไม่สำเร็จ', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์: TH Sarabun New > Tahoma > sans-serif */
* {
  font-family: 'TH Sarabun New', Tahoma, sans-serif !important;
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
  padding: 6px 20px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 21px; /* เดิม 16px + ประมาณ 5 ระดับ */
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
  padding: 18mm 0 14mm;
  font-size: 16pt; /* เดิม 11pt + 5 ระดับ */
}

/* หัวฟอร์ม */
.header-main {
  text-align: left;   /* ให้หัวข้อชิดซ้าย */
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
}

/* ตารางหลัก */
.f11-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt; /* เดิม 9pt + 5 ระดับ */
}

.f11-table th,
.f11-table td {
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  text-align: center;
  vertical-align: middle;
  height: 11mm;
}

/* คอลัมน์แรกให้แคบลง (ลด 3mm) */
.col-region {
  width: 10mm;  /* เดิม 45mm -> ลด 3mm */
}

/* คอลัมน์อื่นลดลง 3mm เช่นกัน */
.col-small {
  width: 10mm;  /* เดิม 26mm -> ลด 3mm */
}

.align-left {
  text-align: left;
  padding-left: 3mm;
}

/* พื้นที่ว่างก่อนลายเซ็น (ใกล้เคียง PDF) */
.bottom-space {
  height: 18mm;
}

/* ลายเซ็นผู้ทดสอบ - จัดไปด้านขวา และให้ทั้งสามบรรทัดตรงกัน */
.sign-block {
  margin-top: 6mm;
  display: flex;
  justify-content: flex-end; /* ชิดขวาให้แนวเดียวกับตาราง */
  font-size: 16pt;           /* เดิม 11pt + 5 ระดับ */
}

.sign-inner {
  text-align: left;
}

.sign-line {
  margin-bottom: 2mm;
}

/* ขยับบรรทัดวงเล็บให้วงเล็บเปิดใกล้ตำแหน่งเดียวกับ "ชื่อ" */
.sign-line-parenthesis {
  text-indent: 5mm;
}

/* ตั้งค่าหน้ากระดาษตอน print */
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

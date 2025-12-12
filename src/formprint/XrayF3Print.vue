<template>
  <div class="print-root">
    <!-- ปุ่ม Print (จะไม่แสดงตอนสั่งพิมพ์) -->
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
            แบบบันทึก F3 : การควบคุมคุณภาพจอภาพ (Display monitor)
          </div>
          <div class="title-sub">
          <span class="bold-text">ความถี่ :</span>
            ทุก 3 เดือน (หรือ 1 เดือน)
          </div>

        </div>

        <!-- ตารางหลัก -->
        <table class="f3-table">
          <tbody>
            <tr>
              <td class="label-col right-label">
                <span class="bold-text">วันที่</span>
              </td>

              <td colspan="4" class="value-cell">
                {{ record.date }}
              </td>
            </tr>

            <!-- ผู้ทดสอบ -->
            <tr>
              <td class="label-col right-label">
                <span class="bold-text">ผู้ทดสอบ</span>
              </td>
  
              <td colspan="4" class="value-cell">
                {{ record.tester }}
              </td>
            </tr>


            <!-- Pass / Fail (ตัวหนา) -->
            <tr>
              <td colspan="5" class="center-cell bold-text">
                Pass (P) / Fail (F)
              </td>
            </tr>

            <!-- กลุ่ม : คุณภาพของภาพพิมพ์โดยทั่วไป -->
            <tr>
              <td colspan="5" class="section-title">
                คุณภาพของภาพพิมพ์โดยทั่วไป
              </td>
            </tr>

            <tr v-for="(item, idx) in printQualityRows" :key="'pq-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ความบิดเบือนทั่วไป -->
            <tr>
              <td colspan="5" class="section-title">
                ความบิดเบือนทั่วไป
              </td>
            </tr>

            <tr v-for="(item, idx) in clarityRows" :key="'cl-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ความส่องสว่าง (Luminance) -->
            <tr>
              <td colspan="5" class="section-title">
                ความส่องสว่าง (Luminance)
              </td>
            </tr>

<!-- แถว 1: กรอบที่มีระดับสีเทาวางซ้อนกัน -->
<tr>
  <td class="label-col">กรอบที่มีระดับสีเทาวางซ้อนกัน</td>
  <td class="check-cell"></td>
  <td class="check-cell"></td>
  <td class="check-cell"></td>
  <td class="check-cell"></td>
</tr>

<!-- แถว 2–3: กรอบสีเทา 5% + 0% (ผสานช่องว่างด้านขวาทั้ง 4 ช่อง) -->
<tr>
  <td class="label-col">กรอบสีเทา 5% มองเห็นในพื้น</td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
</tr>
<tr>
  <td class="label-col">กรอบสีเทา 0%</td>
</tr>

<!-- แถว 4–5: กรอบสีเทา 95% + 100% (ผสานช่องว่างด้านขวาทั้ง 4 ช่อง) -->
<tr>
  <td class="label-col">กรอบสีเทา 95% มองเห็นในพื้น</td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
  <td class="check-cell" rowspan="2"></td>
</tr>
<tr>
  <td class="label-col">กรอบสีเทา 100%</td>
</tr>

            <!-- กลุ่มวัตถุคอนทราสสูงขนาดเล็กสุดมองเห็นได้ -->
            <tr>
              <td colspan="5" class="section-title">
                กลุ่มวัตถุคอนทราสสูงขนาดเล็กสุดมองเห็นได้ (ในมุมทั้ง 4 และตรงกลางของภาพ)
              </td>
            </tr>

            <tr v-for="(item, idx) in smallGroupRows" :key="'sg-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- จำนวนตัวอักษรที่มองเห็น -->
            <tr>
              <td colspan="5" class="section-title">
                จำนวนตัวอักษรที่มองเห็น (อย่างน้อย 11 ตัว หรืออ่านได้ถึง “QUALITY CONT”)
              </td>
            </tr>

            <tr v-for="(item, idx) in textRows" :key="'tx-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ลูกกลิ้งของเครื่องพิมพ์ (ผสานเซลล์ + ชิดซ้าย + ตัวหนา) -->
            <tr>
              <td colspan="5" class="merged-left">
                ลูกกลิ้งของเครื่องพิมพ์
              </td>
            </tr>

            <!-- ทำความสะอาด (ถ้าจำเป็น) -->
            <tr>
              <td class="label-col">ทำความสะอาด (ถ้าจำเป็น)</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ข้อคิดเห็น (ผสานเซลล์ + ชิดซ้าย + ตัวหนาแค่ label) -->
            <tr>
              <td colspan="5" rowspan="2" class="merged-left">
                ข้อคิดเห็น
              </td>
          </tr>

          <tr>
            <!-- ไม่ต้องมี <td> ใด ๆ -->
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

// ข้อมูลที่ดึงมาจากการบันทึกจริง
const record = ref({
  date: '',
  tester: '',
  result: '',
  comment: ''
})

// แถวข้อความในแต่ละกลุ่ม (ตามฟอร์ม)
const printQualityRows = [
  'ภาพไม่มีลายเปื้อน (Smear)',
  'ไม่มีสิ่งแปลกปลอม',
  'ภาพลดหลั่น (ramp) แบบต่อเนื่อง'
]

const clarityRows = [
  'เส้นตรงต่อเนื่อง',
  'กรอบหรือช่องเป็นสี่เหลี่ยม'
]

const smallGroupRows = [
  'กลุ่มเส้นคู่แนวนอน',
  'กลุ่มเส้นคู่แนวตั้ง'
]

const textRows = [
  'ในพื้นที่มืด (Dark)',
  'ในพื้นที่สีเทาระดับกลาง (Mid-grey)',
  'ในพื้นที่สว่าง (Light)'
]

// โหลดข้อมูลจาก backend ตาม id
onMounted(async () => {
  const id = route.params.id
  // const res = await fetch(`/api/f3/${id}`)
  // const data = await res.json()
  // record.value = { ... }
})

function handlePrint () {
  window.print()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ตั้งค่าฟอนต์มาตรฐานทั้งหน้า = 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt !important;
  font-weight: 400;
}

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
  margin-bottom: 18px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 11pt !important;
}

/* A4 */
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
  padding: 15mm 0 15mm;
}

/* Header */
.header-main {
  margin-bottom: 6mm;
}

/* ★ title-main = 13pt ตามที่ต้องการ */
.title-main {
  font-weight: 700;
  font-size: 11pt !important; 
  margin-bottom: 2mm;
}

/* บรรทัดรอง → 11pt */
.title-sub {
  font-size: 11pt !important;
}

/* ตาราง */
.f3-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 11pt !important;
}

.f3-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 2mm;
  vertical-align: middle;
  font-size: 11pt !important;
}

.label-col {
  width: 65mm;
}

.check-cell {
  width: 25mm; /* ให้ 4 คอลัมน์ว่างมีขนาดใกล้เคียงกัน */
}

.center-cell {
  text-align: center;
}

/* หัวกลุ่มทุกอัน: ตัวหนา + ชิดซ้าย + ชิดขอบตาราง */
.section-title {
  font-weight: 700;
  text-align: left;
  padding-left: 2mm;
}

/* ตัวหนา */
.bold-text {
  font-weight: 700;
}

/* ช่องกรอกข้อมูล */
.value-cell {
  text-align: left;
}

/* ผสานเซลล์และชิดซ้าย (ลูกกลิ้ง/ข้อคิดเห็น) */
.merged-left {
  font-weight: 700;
  text-align: left !important;
  padding-left: 2mm !important;
  border: 0.4pt solid #000;
}

.underline {
  display: inline-block;
  border-bottom: 0.4pt solid #000;
  min-width: 50mm;
  min-height: 6mm;
}

/* Print */
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
  .right-label {
  text-align: right !important;
  padding-right: 3mm !important; /* เล็กน้อยให้สวยงาม */
}

/* คอลัมน์ label แถว วันที่ / ผู้ทดสอบ ให้ชิดขวา */
.right-label {
  text-align: right !important;
  padding-right: 3mm !important;
}

}
</style>

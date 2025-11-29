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
            ความถี่ : ทุก 3 เดือน (หรือ 1 เดือน)
          </div>
        </div>

        <!-- ตารางหลัก -->
        <table class="f3-table">
          <tbody>
            <!-- แถวว่างด้านบน (ตามแบบฟอร์ม) -->
            <tr>
              <td colspan="4" class="empty-row">&nbsp;</td>
            </tr>

            <!-- ลบแถวว่างด้านบนออก -->
            <!-- (ลบทั้ง block นี้)
          <tr>
           <td colspan="4" class="empty-row">&nbsp;</td>
          </tr>
            -->

            <!-- วันที่ -->
            <tr>
              <td class="label-col">วันที่</td>
              <td colspan="3" class="value-cell">
                {{ record.date }}
              </td>
            </tr>

            <!-- ผู้ทดสอบ -->
            <tr>
              <td class="label-col">ผู้ทดสอบ</td>
              <td colspan="3" class="value-cell">
                {{ record.tester }}
              </td>
            </tr>

            <!-- Pass / Fail -->
            <tr>
              <td colspan="4" class="center-cell">
                Pass (P) / Fail (F)
              </td>
            </tr>

            <!-- กลุ่ม : คุณภาพของภาพพิมพ์โดยทั่วไป -->
            <tr>
              <td colspan="4" class="section-title">
                คุณภาพของภาพพิมพ์โดยทั่วไป
              </td>
            </tr>

            <tr v-for="(item, idx) in printQualityRows" :key="'pq-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ความชัดเจนทั่วไป -->
            <tr>
              <td colspan="4" class="section-title">
                ความบิดเบือนทั่วไป
              </td>
            </tr>

            <tr v-for="(item, idx) in clarityRows" :key="'cl-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ความสว่างสว่าง (Luminance) -->
            <tr>
              <td colspan="4" class="section-title">
                ความส่องสว่าง (Luminance)
              </td>
            </tr>

            <tr v-for="(item, idx) in luminanceRows" :key="'lu-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- กลุ่มจุดควบคุมมาตรฐานขนาดเล็กจุดมองเห็นได้ -->
            <tr>
              <td colspan="4" class="section-title">
                กลุ่มวัตถุคอนทราสสูงขนาดเล็กสุดมองเห็นได้ (ในมุมทั้ง 4 และตรงกลางของภาพ)
              </td>
            </tr>

            <tr v-for="(item, idx) in smallGroupRows" :key="'sg-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- จำนวนตัวอักษรที่มองเห็น -->
            <tr>
              <td colspan="4" class="section-title">
                จำนวนตัวอักษรที่มองเห็น (อย่างน้อย 11 ตัว หรืออ่านได้ถึง “QUALITY CONT”)
              </td>
            </tr>

            <tr v-for="(item, idx) in textRows" :key="'tx-' + idx">
              <td class="label-col">{{ item }}</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ลูกศรชี้ของเครื่องพิมพ์ -->
            <tr>
              <td class="label-col">ลูกกลิ้งของเครื่องพิมพ์</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

        
           <!-- ข้อคิดเห็น -->
          <tr>
            <td class="label-col">ข้อคิดเห็น</td>
            <td colspan="3" class="value-cell">
              {{ record.comment }}
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
  'กรอบหรือช่องเป็นสีเหลี่ยม'
]

const luminanceRows = [
  'กรอบที่มีระดับสีเทาวางซ้อนกัน',
  'กรอบสีเทา 5% มองเห็นในพื้น',
  'กรอบสีเทา 0%',
  'กรอบสีเทา 95% มองเห็นในพื้น',
  'กรอบสีเทา 100%'
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

  // ตัวอย่าง (แก้ URL / โครง JSON ให้ตรงกับระบบจริงของคุณ)
  // const res = await fetch(`/api/f3/${id}`)
  // const data = await res.json()
  //
  // record.value = {
  //   date: data.date,
  //   tester: data.tester,
  //   result: data.result,
  //   comment: data.comment
  // }
})

function handlePrint () {
  // เปิด dialog print ของ browser (Chrome/Edge) = popup พิมพ์
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
  font-size: 13pt !important; 
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

.empty-row {
  height: 8mm;
}

.label-col {
  width: 70mm;
}

.check-cell {
  width: 30mm;
}

.center-cell {
  text-align: center;
}

.section-title {
  font-weight: 700;
}

/* ช่องกรอกข้อมูล */
.value-cell {
  text-align: left;
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
}
</style>

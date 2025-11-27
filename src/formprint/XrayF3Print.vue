<template>
  <div class="print-root">
    <!-- ปุ่ม Print (จะไม่แสดงตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F3
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

            <!-- วันที่ -->
            <tr>
              <td class="label-col">วันที่</td>
              <td colspan="3" class="value-cell">
                <span class="underline">{{ record.date }}</span>
              </td>
            </tr>

            <!-- ผู้ทดสอบ -->
            <tr>
              <td class="label-col">ผู้ทดสอบ</td>
              <td colspan="3" class="value-cell">
                <span class="underline">{{ record.tester }}</span>
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
                ความชัดเจนทั่วไป
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
                ความสว่างสว่าง (Luminance)
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
                กลุ่มจุดควบคุมมาตรฐานขนาดเล็กจุดมองเห็นได้ (ในมุมทั้ง 4 และตรงกลางของภาพ)
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
              <td class="label-col">ลูกศรชี้ของเครื่องพิมพ์</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ทิศทางของตัวอักษร (ถ้ามีใบ) -->
            <tr>
              <td class="label-col">ทิศทางของตัวอักษร (ถ้ามีใบ)</td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
              <td class="check-cell"></td>
            </tr>

            <!-- ผลการตรวจสอบ (ดึงจากการบันทึก) -->
            <tr>
              <td class="label-col">ผลการตรวจสอบ</td>
              <td colspan="3" class="value-cell">
                <span class="underline">
                  {{ record.result }}
                </span>
              </td>
            </tr>

            <!-- ข้อคิดเห็น -->
            <tr>
              <td class="label-col">ข้อคิดเห็น</td>
              <td colspan="3" class="value-cell">
                <span class="underline">
                  {{ record.comment }}
                </span>
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
  date: '...............',
  tester: '........................',
  result: '........................................',
  comment: ''
})

// แถวข้อความในแต่ละกลุ่ม (ตามฟอร์ม)
const printQualityRows = [
  'ภาพไม่มีเลือนเบลอ (Smear)',
  'ไม่มีสีเข้มปลายแฉก',
  'ภาพลำดับขั้น (ramp) แบบต่อเนื่อง'
]

const clarityRows = [
  'เส้นตรงต่อเนื่อง',
  'กรอบหรือช่องเป็นสีเทาสม่ำเสมอ'
]

const luminanceRows = [
  'กรอบที่มีระดับสีเทาทาวซ้อนกัน',
  'กรอบสีเทา 5% มองเห็นเป็นขั้น',
  'กรอบสีเทา 0%',
  'กรอบสีเทา 95% มองเห็นเป็นขั้น',
  'กรอบสีเทา 100%'
]

const smallGroupRows = [
  'กลุ่มจุดเล็กมุมบนขวา',
  'กลุ่มจุดเล็กมุมบนซ้าย',
  'กลุ่มจุดเล็กกลางภาพ'
]

const textRows = [
  'ในพื้นที่มืด (Dark)',
  'ในพื้นที่ที่มีค่าระดับกลาง (Mid-grey)',
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

/* ใช้ TH Sarabun ทั้งหน้า */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลังด้านนอก */
.print-root {
  background: #111827;
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
  font-size: 16px;
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
  font-size: 14pt;
}

/* Header */
.header-main {
  margin-bottom: 6mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
  margin-bottom: 2mm;
}

.title-sub {
  font-size: 14pt;
}

/* ตารางฟอร์ม */
.f3-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f3-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 2mm;
  vertical-align: middle;
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

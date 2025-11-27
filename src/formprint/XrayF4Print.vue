<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + หน้ากระดาษ A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะไม่แสดงตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F4
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ================= หัวฟอร์ม ================= -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์
          </div>

          <div class="title-sub">
            ความถี่ : ทุก 3 เดือน
          </div>

          <div class="title-sub header-row-inline">
            เครื่องเอกซเรย์ชื่อรุ่น
            <span class="underline long">
              {{ header.machineName }}
            </span>
          </div>

          <div class="title-sub header-row-inline">
            วันที่
            <span class="underline short">
              {{ header.qcDate }}
            </span>
            ผู้ทดสอบ
            <span class="underline short">
              {{ header.testerName }}
            </span>
            ตำแหน่ง
            <span class="underline short">
              {{ header.testerPosition }}
            </span>
          </div>
        </div>

        <!-- ================= ตารางตรวจสอบ ================= -->
        <table class="f4-table">
          <thead>
            <tr>
              <th class="col-no">ลำดับที่</th>
              <th class="col-desc">รายการตรวจสอบ</th>
              <th class="col-pass">ผ่าน (✓)</th>
              <th class="col-fail">ไม่ผ่าน (✗)</th>
              <th class="col-remark">หมายเหตุ</th>
            </tr>
          </thead>

          <tbody>
            <!-- วนตามรายการที่ดึงจากฐาน -->
            <tr v-for="row in rows" :key="row.no">
              <td class="col-no">{{ row.no }}</td>
              <td class="col-desc align-left">
                {{ row.description }}
              </td>
              <td class="col-pass">
                <span v-if="row.result === 'P'">✓</span>
              </td>
              <td class="col-fail">
                <span v-if="row.result === 'F'">✗</span>
              </td>
              <td class="col-remark align-left">
                {{ row.remark }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- หมายเหตุท้ายฟอร์ม (ตามต้นฉบับถ้ามี) -->
        <div class="footer-note" v-if="footerNote">
          {{ footerNote }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// --------- หัวฟอร์ม (ข้อมูลจากฐาน) ----------
const header = ref({
  machineName: '..................................................',
  qcDate: '........../............/..........',
  testerName: '...................................',
  testerPosition: '.................................'
})

// --------- ตารางรายการตรวจสอบ (ข้อมูลจากฐาน) ----------
/**
 * result: 'P' = ผ่าน, 'F' = ไม่ผ่าน, '' = ยังไม่กรอก
 */
const rows = ref([
  // ตัวอย่างโครง เพื่อให้เห็น layout ถ้ายังไม่ดึงจาก backend
  { no: 1, description: 'สภาพความมั่นคงของขาตั้งและตู้คอนโซล', result: '', remark: '' },
  { no: 2, description: 'ระบบเบรกหรือกลไกล็อกของหลอดเอกซเรย์', result: '', remark: '' },
  { no: 3, description: 'การเคลื่อนที่ของหลอดเอกซเรย์ โต๊ะผู้ป่วย และบักกี้', result: '', remark: '' },
  { no: 4, description: 'แผงควบคุมและปุ่มสั่งงานทำงานได้ถูกต้อง', result: '', remark: '' },
  { no: 5, description: 'สัญญาณเตือน ขณะเริ่มเปิดลำรังสีทำงานปกติ', result: '', remark: '' },
  { no: 6, description: 'สายไฟและปลั๊กอยู่ในสภาพดี ไม่มีชำรุดหรือร้อนผิดปกติ', result: '', remark: '' },
  { no: 7, description: 'อุปกรณ์เสริม (ตะแกรงกริด/ตัวรองผู้ป่วย) พร้อมใช้งาน', result: '', remark: '' },
  { no: 8, description: 'จอภาพแสดงผลภาพเอกซเรย์สว่างชัดเจน', result: '', remark: '' },
  { no: 9, description: 'เครื่องวัดระยะ SID และอุปกรณ์จัดท่าพร้อมใช้งาน', result: '', remark: '' },
  { no: 10, description: 'บริเวณรอบเครื่องเอกซเรย์โล่ง ปลอดภัย', result: '', remark: '' }
])

// ถ้ามีข้อความหมายเหตุส่วนท้ายฟอร์ม
const footerNote = ref('')

// เรียกตอนกดปุ่ม Print (จะเปิด popup print ของ browser / Google print dialog)
function handlePrint () {
  window.print()
}

// ดึงข้อมูลจากฐานเมื่อโหลดหน้า
onMounted(async () => {
  const id = route.params.id

  // ตัวอย่างโครง API – ปรับ URL & ฟิลด์ให้ตรงกับ backend ของคุณ
  //
  // const res = await fetch(`/api/xray/f4/${id}`)
  // const data = await res.json()
  //
  // header.value = {
  //   machineName: data.machineName,
  //   qcDate: data.qcDate,               // แนะนำส่งมาเป็นสตริง dd/mm/yyyy แล้ว format ที่ backend
  //   testerName: data.testerName,
  //   testerPosition: data.testerPosition
  // }
  //
  // rows.value = data.items              // [{ no, description, result: 'P'|'F'|'', remark }, ...]
  // footerNote.value = data.footerNote || ''

  // ถ้ายังไม่มี backend ให้ใช้ mock เดิมด้านบนไปก่อน
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ใช้ TH Sarabun ให้ทั้งหน้า */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลังนอก A4 */
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
  width: 180mm;
  padding: 18mm 0 14mm;
  font-size: 14pt;
}

/* Header */
.header-main {
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
  margin-bottom: 2mm;
}

.title-sub {
  font-size: 14pt;
  margin-bottom: 2mm;
}

.header-row-inline {
  display: flex;
  align-items: center;
  gap: 4mm;
}

/* เส้น underline */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short {
  min-width: 35mm;
}

.long {
  min-width: 60mm;
}

/* ตาราง F4 */
.f4-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f4-table th,
.f4-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.col-no {
  width: 12mm;
}

.col-desc {
  width: 90mm;
}

.col-pass,
.col-fail {
  width: 18mm;
}

.col-remark {
  width: auto;
}

.align-left {
  text-align: left;
}

/* หมายเหตุท้ายฟอร์ม */
.footer-note {
  margin-top: 4mm;
  font-size: 12pt;
}

/* สำหรับการพิมพ์ */
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

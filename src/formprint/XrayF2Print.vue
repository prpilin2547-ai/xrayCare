<template>
  <!-- พื้นหลังด้านนอก A4 -->
  <div class="print-root">
    <!-- ปุ่มพิมพ์ (ไม่แสดงตอนสั่ง print) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F2
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวกระดาษ -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)
          </div>
          <div class="title-sub">
            แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์
          </div>
          <div class="title-sub">
            ปีงบประมาณ พ.ศ.
            <span class="underline inline">{{ record.fiscalYear }}</span>
          </div>
        </div>

        <!-- ความถี่ + หมายเลข IP -->
        <div class="meta-block">
          <div class="meta-row">
            <span>ความถี่ :</span>
            <span class="underline long">{{ record.frequency }}</span>
          </div>
          <div class="meta-row">
            <span>หมายเลข IP</span>
            <span class="underline long">{{ record.ipNumber }}</span>
          </div>
        </div>

        <!-- ตาราง 3 ชุด เรียงลงมาเหมือนรูป -->
        <div
          v-for="(section, index) in monthSections"
          :key="index"
          class="month-block"
        >
          <table class="f2-table">
            <thead>
              <tr>
                <th class="col-left">
                  เดือน / รายการ / วันที่
                </th>
                <th
                  v-for="d in 20"
                  :key="d"
                  class="col-day"
                >
                  {{ d }}
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- แถว เดือน .......... -->
              <tr>
                <td class="col-left align-left">
                  <div class="row-label">เดือน</div>
                  <div class="month-line">
                    {{ section.monthLabel || '..................' }}
                  </div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'m-' + d"
                  class="col-day"
                >
                  &nbsp;
                </td>
              </tr>

              <!-- แถว ผลการทดสอบ Pass/Fail -->
              <tr>
                <td class="col-left align-left">
                  <div class="row-label">ผลการทดสอบ</div>
                  <div class="row-label">Pass (✓) / Fail (✗)</div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'r-' + d"
                  class="col-day"
                >
                  <span v-if="section.results[d] === 'pass'">✓</span>
                  <span v-else-if="section.results[d] === 'fail'">✗</span>
                </td>
              </tr>

              <!-- แถว สภาพลักษณะของแผ่น / ด้านบนภาพ -->
              <tr>
                <td class="col-left align-left">
                  <div class="row-label">สภาพผิดปกติ</div>
                  <div class="row-label">ของแผ่น</div>
                  <div class="row-label">หรือด้านบนภาพ</div>
                </td>
                <td
                  v-for="d in 20"
                  :key="'a-' + d"
                  class="col-day align-left"
                >
                  {{ section.appearance[d] || '' }}
                </td>
              </tr>

              <!-- แถว ผู้ตรวจสอบ -->
              <tr>
                <td class="col-left align-left">
                  ผู้ตรวจสอบ
                </td>
                <td colspan="20" class="align-left">
                  {{ section.inspector || record.inspector }}
                </td>
              </tr>

              <!-- แถว ผลการตรวจสอบ (สรุปจากการบันทึก) -->
              <tr>
                <td class="col-left align-left">
                  ผลการตรวจสอบ
                </td>
                <td colspan="20" class="align-left">
                  {{ section.summaryResult || record.summaryResult }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ข้อมูลหัวฟอร์ม (ดึงจากการบันทึกจริงได้ทีหลัง)
const record = ref({
  id: route.params.id || 'F2-001',
  fiscalYear: '2568',      // ปีงบประมาณ พ.ศ.
  frequency: 'ทุกวัน',     // ความถี่
  ipNumber: 'IP-01',       // หมายเลข IP
  inspector: '........................................',
  summaryResult: '........................................................'
})

// ตาราง 3 ชุด (แต่ละชุด 1 เดือน หรือ 1 แผ่นตามที่คุณออกแบบฐานข้อมูล)
const monthSections = ref([
  {
    monthLabel: '',        // เช่น 'มกราคม'
    results: {},           // { 1: 'pass', 2:'fail', ... }  วันที่ 1–20
    appearance: {},        // { 1: 'คราบ', 5: 'รอย', ... }
    inspector: '',
    summaryResult: ''
  },
  {
    monthLabel: '',
    results: {},
    appearance: {},
    inspector: '',
    summaryResult: ''
  },
  {
    monthLabel: '',
    results: {},
    appearance: {},
    inspector: '',
    summaryResult: ''
  }
])

function handlePrint () {
  // เปิด popup print ของ Chrome / Edge
  window.print()
}

// ดึงข้อมูลจริงจาก backend ได้ใน onMounted
onMounted(async () => {
  const id = route.params.id
  // ตัวอย่างโครง fetch (ปรับ URL/โครงสร้างตาม API จริง)
  // try {
  //   const res = await fetch(`/api/f2/${id}`)
  //   if (!res.ok) throw new Error('fetch error')
  //   const data = await res.json()
  //   record.value = { ...record.value, ...data.header }       // fiscalYear, frequency, ipNumber, summaryResult, inspector
  //   monthSections.value = data.sections                      // [{ monthLabel, results, appearance, inspector, summaryResult }, ...]
  // } catch (e) {
  //   console.error(e)
  // }
})
</script>

<style scoped>
/* พื้นหลังเทานอก A4 */
.print-root {
  background: #111827;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่มพิมพ์ด้านบน */
.print-toolbar {
  margin-bottom: 8px;
}

.btn-print {
  padding: 6px 18px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #ffffff;
  font-size: 0.9rem;
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
  width: 170mm; /* ให้มี margin เหมือนในเล่ม */
  padding: 18mm 0 14mm;
  font-family: "TH Sarabun New", Tahoma, sans-serif;
  font-size: 11pt;
}

/* หัวกระดาษ */
.header-main {
  text-align: center;
  margin-bottom: 6mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
}

.title-sub {
  margin-bottom: 2mm;
}

/* ความถี่ / หมายเลข IP */
.meta-block {
  margin-left: 25mm;
  margin-bottom: 6mm;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 4mm;
  margin-bottom: 2mm;
}

.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
}

.underline.inline {
  display: inline-block;
  min-width: 30mm;
}

.underline.long {
  min-width: 40mm;
}

/* แต่ละชุดเดือน */
.month-block {
  margin-bottom: 6mm;
}

/* ตาราง F2 */
.f2-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 9pt;
}

.f2-table th,
.f2-table td {
  border: 0.4pt solid #000;
  padding: 1mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.col-left {
  width: 42mm;
}

.col-day {
  width: 6mm;
}

.align-left {
  text-align: left;
}

.row-label {
  line-height: 1.2;
}

.month-line {
  margin-top: 1mm;
}

/* ตั้งค่าเวลาปริ้นจริง */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-root {
    background: #ffffff;
    padding: 0;
  }

  .sheet-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
  }

  .print-toolbar {
    display: none; /* ซ่อนปุ่มตอนปริ้น */
  }
}
</style>
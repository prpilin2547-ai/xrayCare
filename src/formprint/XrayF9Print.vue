<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม Print + A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะหายไปตอนสั่งพิมพ์) -->
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
            แบบบันทึก F9 : การตรวจสอบคุณภาพเสื้อคะท้วงและการขยายรอยแตกของเสื้อคะท้วงด้วยรังสีเอกซ์
          </div>
          <div class="title-sub">
            ความถี่ : {{ record.frequency }}
          </div>
        </div>

        <!-- ตารางชุดที่ 1 : ตรวจภายนอกด้วยสายตาและการคลำ -->
        <table class="f9-table">
          <thead>
            <tr>
              <th colspan="10" class="section-title">
                การตรวจสอบลักษณะภายนอกด้วยสายตาและการคลำ
              </th>
            </tr>
            <tr>
              <th class="col-no">ลำดับที่</th>
              <th>หมายเลขอุปกรณ์</th>
              <th>ชนิดของอุปกรณ์</th>
              <th>อายุการใช้งาน</th>
              <th>วันที่ตรวจสอบ</th>
              <th>ชนิดของความชำรุดเสียหาย</th>
              <th>ตำแหน่ง</th>
              <th>ขนาด</th>
              <th>วิธีการจัดเก็บ</th>
              <th>ผู้บันทึก</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in externalChecks"
              :key="'ext-' + idx"
            >
              <td class="col-no">{{ idx + 1 }}</td>
              <td>{{ row.equipmentNo }}</td>
              <td>{{ row.equipmentType }}</td>
              <td>{{ row.usageAge }}</td>
              <td>{{ row.checkDate }}</td>
              <td>{{ row.damageType }}</td>
              <td>{{ row.position }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.storageMethod }}</td>
              <td>{{ row.recorder }}</td>
            </tr>
            <!-- แถวว่างเผื่อกรอกเพิ่ม (ให้ layout เหมือน PDF) -->
            <tr v-for="n in emptyExternalRows" :key="'ext-empty-' + n">
              <td class="col-no">&nbsp;</td>
              <td colspan="9">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        <!-- ระยะห่างระหว่างสองตาราง -->
        <div class="table-gap"></div>

        <!-- ตารางชุดที่ 2 : ตรวจภายในด้วยรังสีเอกซ์ -->
        <table class="f9-table">
          <thead>
            <tr>
              <th colspan="10" class="section-title">
                การตรวจสอบภายในด้วยรังสีเอกซ์ในห้องตรวจทางรังสี/เครื่องเอกซเรย์ทั่วไป
              </th>
            </tr>
            <tr>
              <th class="col-no">ลำดับที่</th>
              <th>หมายเลขอุปกรณ์</th>
              <th>ชนิดของอุปกรณ์</th>
              <th>อายุการใช้งาน</th>
              <th>วันที่ตรวจสอบ</th>
              <th>ลักษณะความเสียหายที่พบ</th>
              <th>ตำแหน่ง</th>
              <th>ขนาด</th>
              <th>วิธีการจัดเก็บ</th>
              <th>ผู้บันทึก</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, idx) in internalChecks"
              :key="'int-' + idx"
            >
              <td class="col-no">{{ idx + 1 }}</td>
              <td>{{ row.equipmentNo }}</td>
              <td>{{ row.equipmentType }}</td>
              <td>{{ row.usageAge }}</td>
              <td>{{ row.checkDate }}</td>
              <td>{{ row.internalFinding }}</td>
              <td>{{ row.position }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.storageMethod }}</td>
              <td>{{ row.recorder }}</td>
            </tr>
            <!-- แถวว่างให้เต็มกรอบเหมือน PDF -->
            <tr v-for="n in emptyInternalRows" :key="'int-empty-' + n">
              <td class="col-no">&nbsp;</td>
              <td colspan="9">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        <!-- ลายเซ็นด้านล่าง -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ.................................................................ผู้ทดสอบ
          </div>
          <div class="sig-row">
            (.................................................................)
          </div>
          <div class="sig-row">
            ตำแหน่ง.............................................................
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ข้อมูลหัวฟอร์ม (ดึงจากฐานข้อมูล)
const record = ref({
  frequency: 'ทุก 6 เดือน'
})

// ตารางภายนอก
const externalChecks = ref([])
// ตารางภายใน
const internalChecks = ref([])

// จำนวนแถวขั้นต่ำให้กรอบดูเต็มเหมือน PDF
const minExternalRows = 3
const minInternalRows = 3

const emptyExternalRows = computed(() =>
  Math.max(0, minExternalRows - externalChecks.value.length)
)

const emptyInternalRows = computed(() =>
  Math.max(0, minInternalRows - internalChecks.value.length)
)

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id

  // ตัวอย่างการดึงข้อมูลจาก backend (ให้แก้ URL/field ให้ตรงของจริง)
  // const res = await fetch(`/api/f9/${id}`)
  // const data = await res.json()
  //
  // record.value = {
  //   frequency: data.frequency || 'ทุก 6 เดือน'
  // }
  //
  // externalChecks.value = data.externalChecks || []
  // internalChecks.value = data.internalChecks || []

  // *** ตัวอย่าง mock data เอาออกเมื่อเชื่อม API จริง ***
  externalChecks.value = [
    {
      equipmentNo: 'ตัวอย่าง 001',
      equipmentType: 'เสื้อคะท้วง',
      usageAge: '> 3 ปี',
      checkDate: '4/3/65',
      damageType: 'รอยหัก',
      position: 'บ่าขวา หน้า',
      size: '3×10 cm',
      storageMethod: 'ไม่แขวน',
      recorder: 'ประวัติรังสี'
    }
  ]

  internalChecks.value = [
    {
      equipmentNo: 'ตัวอย่าง 001',
      equipmentType: 'เสื้อคะท้วง',
      usageAge: '> 5 ปี',
      checkDate: '4/3/65',
      internalFinding: 'รอยร้าวยาว',
      position: 'อกหน้า',
      size: '3×10 cm',
      storageMethod: 'วางราบ',
      recorder: 'ประวัติรังสี'
    }
  ]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

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
  padding: 18mm 0 14mm;
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  margin-bottom: 2mm;
  font-size: 15pt;
}

/* ตาราง */
.f9-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f9-table th,
.f9-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.section-title {
  font-weight: 700;
  text-align: left;
  padding-left: 3mm;
}

.col-no {
  width: 12mm;
}

/* ระยะห่างระหว่างสองตาราง */
.table-gap {
  height: 8mm;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 10mm;
  font-size: 14pt;
}

.sig-row {
  margin-bottom: 3mm;
  text-align: right;
  padding-right: 20mm;
}

/* การพิมพ์ */
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

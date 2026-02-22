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
          <path
            d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"
          />
        </svg>
        Print
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F9 : การตรวจสอบคุณภาพเสื้อตะกั่วและการหารอยแตกของเสื้อตะกั่วด้วยรังสีเอกซ์
          </div>
          <div class="title-sub">
            <strong>ความถี่ :</strong>
            <span class="freq-value">{{ record.frequency }}</span>
          </div>
        </div>

        <!-- ตารางเดียว ต่อทั้งภายนอก + ภายใน -->
        <table class="f9-table">
          <thead>
  <!-- แถวหัวคอลัมน์ -->
  <tr class="header-top">
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
            <!-- หัวส่วนที่ 1 : ภายนอก -->
            <tr>
              <th colspan="10" class="section-title">
                การตรวจสอบลักษณะภายนอกด้วยสายตาและการคลำ
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- แถวตัวอย่าง ต.ย. ภายนอก -->
            <tr>
              <td class="col-no">ต.ย.</td>
              <td>{{ exampleExternal.equipmentNo || '' }}</td>
              <td>{{ exampleExternal.equipmentType || '' }}</td>
              <td>{{ exampleExternal.usageAge || '' }}</td>
              <td>{{ exampleExternal.checkDate || '' }}</td>
              <td>{{ exampleExternal.damageType || '' }}</td>
              <td>{{ exampleExternal.position || '' }}</td>
              <td>{{ exampleExternal.size || '' }}</td>
              <td>{{ exampleExternal.storageMethod || '' }}</td>
              <td>{{ exampleExternal.recorder || '' }}</td>
            </tr>

            <!-- ลำดับที่ 1 ภายนอก -->
            <tr>
              <td class="col-no row-top">1</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- ลำดับที่ 2 ภายนอก -->
            <tr>
              <td class="col-no row-top">2</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- แถวสุดท้ายว่าง ภายนอก -->
            <tr>
              <td class="col-no row-top">&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- หัวส่วนที่ 2 : ภายใน -->
            <tr>
              <td colspan="10" class="section-title">
                การตรวจสอบภายในด้วยรังสีเอกซ์ในห้องตรวจทางรังสี/เครื่องเอกซเรย์ทั่วไป
              </td>
            </tr>

            <!-- แถวตัวอย่าง ต.ย. ภายใน -->
            <tr>
              <td class="col-no">ต.ย.</td>
              <td>{{ exampleInternal.equipmentNo || '' }}</td>
              <td>{{ exampleInternal.equipmentType || '' }}</td>
              <td>{{ exampleInternal.usageAge || '' }}</td>
              <td>{{ exampleInternal.checkDate || '' }}</td>
              <td>{{ exampleInternal.internalFinding || '' }}</td>
              <td>{{ exampleInternal.position || '' }}</td>
              <td>{{ exampleInternal.size || '' }}</td>
              <td>{{ exampleInternal.storageMethod || '' }}</td>
              <td>{{ exampleInternal.recorder || '' }}</td>
            </tr>

            <!-- ลำดับที่ 1 ภายใน -->
            <tr>
              <td class="col-no row-top">1</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- ลำดับที่ 2 ภายใน -->
            <tr>
              <td class="col-no row-top">2</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <!-- แถวสุดท้ายว่าง ภายใน -->
            <tr>
              <td class="col-no row-top">&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <!-- ลายเซ็นด้านล่าง -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ........................................................ผู้ทดสอบ
          </div>
          <div class="sig-row">
            (...........................................................................)
          </div>
          <div class="sig-row">
            ตำแหน่ง.................................................................
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const record = ref({
  frequency: 'ทุก 6 เดือน'
})

const externalChecks = ref([])
const internalChecks = ref([])

/* ดึงแถวตัวอย่าง (ถ้ามี) สำหรับ ต.ย. */
const exampleExternal = computed(() => externalChecks.value[0] || {})
const exampleInternal = computed(() => internalChecks.value[0] || {})

function handlePrint () {
  window.print()
}

const API_BASE = '/api/Xraycare'

onMounted(async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  try {
    const res = await fetch(`${API_BASE}/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData)
        if (parsed.frequency !== undefined) record.value.frequency = parsed.frequency
        if (Array.isArray(parsed.externalChecks)) externalChecks.value = parsed.externalChecks
        if (Array.isArray(parsed.internalChecks)) internalChecks.value = parsed.internalChecks
      } catch (_) {}
    }
  } catch (e) {
    console.error('Load checklist record error:', e)
  }
  if (externalChecks.value.length === 0) {
    externalChecks.value = [{ equipmentNo: '', equipmentType: 'เสื้อตะกั่ว', usageAge: '', checkDate: '', damageType: '', position: '', size: '', storageMethod: '', recorder: '' }]
  }
  if (internalChecks.value.length === 0) {
    internalChecks.value = [{ equipmentNo: '', equipmentType: 'เสื้อตะกั่ว', usageAge: '', checkDate: '', internalFinding: '', position: '', size: '', storageMethod: '', recorder: '' }]
  }
})
</script>

<style src="./printLayout.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* FONT ทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt;
  font-weight: 400;
}

/* HEADER */
.header-main {
  text-align: left;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  margin-bottom: 2mm;
  font-size: 16pt;
  text-align: left;
}

/* TABLE */
.f9-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 16pt;
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
  text-align: left !important;
  padding-left: 3mm;
  font-size: 16pt;
}

.col-no {
  width: 12mm;
}

/* ลายเซ็น */
.signature-block {
  width: 100%;
  margin-top: 12mm;
  text-align: right !important;
  padding-right: 0mm !important;
}

.sig-row {
  margin-bottom: 3mm;
  white-space: nowrap;
  padding-right: 0 !important;
}
/* ความถี่ : ตัวหนา */
.title-sub strong {
  font-weight: 700;
}

/* ทุก 6 เดือน ตัวบาง */
.freq-value {
  font-weight: 400;
}


.title-sub span,
.title-sub *:not(:first-child) {
  font-weight: 400;
}

/* ทำให้หัวตาราง (เฉพาะแถวชื่อคอลัมน์) เป็นตัวหนา */
.f9-table thead tr:first-child th {
  font-weight: 700;
}
/* ทำให้หัวคอลัมน์ชิดด้านบน */
.f9-table thead tr.header-top th {
  vertical-align: top !important;
  padding-top: 1mm;      /* ชิดบนแบบสวย ไม่ติดขอบ */
  padding-bottom: 1.5mm;
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

  .section-title { text-align: left !important; padding-left: 3mm; }
  .f9-table td.row-top { vertical-align: top !important; padding-top: 1mm !important; }
}
</style>

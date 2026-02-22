<template>
  <!-- หน้าโล่ง ไม่มีเมนู -->
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
    <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            {{ record.formTitle }}
          </div>
          <div class="title-sub">
            <span class="freq-label">ความถี่ :</span>
            <span class="freq-value">{{ record.frequency }}</span>
          </div>
        </div>

        <!-- ตาราง Dark Noise DR -->
        <div class="table-wrapper">
          <table class="f82-table">
            <thead>
              <tr>
                <th class="col-fpd-no">FPD no.</th>
                <th class="col-fpd-size">FPD size</th>
                <th class="col-id">ID</th>
                <th class="col-ei">EI</th>
                <th class="col-ddi">DDI</th>
                <th class="col-pixel">Pixel<br />
                  mean</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in rowsForPrint"
                :key="'row-' + index"
              >
                <td>{{ row.fpdNo }}</td>
                <td>{{ row.fpdSize }}</td>
                <td>{{ row.id }}</td>
                <td>{{ row.ei }}</td>
                <td>{{ row.ddi }}</td>
                <td>{{ row.pixelMean }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ลายเซ็น -->
        <div class="signature-block">
          <div class="sig-line">
            ลงชื่อ............................................................ผู้ทดสอบ
          </div>
          <div class="sig-line">
            (..............................................................................)
          </div>
          <div class="sig-line">
            ตำแหน่ง.....................................................................
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ข้อมูลหัวฟอร์ม + ตาราง (ดึงจากฐาน)
const record = ref({
  formTitle:
    'แบบบันทึก F8-2 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR',
  frequency: 'ทุก 6 เดือน',
  rows: [
    // ตัวอย่างโครง (จะถูกแทนที่ด้วยข้อมูลจากฐาน)
    // {
    //   fpdNo: '1',
    //   fpdSize: '14x17 นิ้ว',
    //   id: 'DR-01',
    //   ei: '2000',
    //   ddi: '0',
    //   pixelMean: '150'
    // }
  ]
})

// ให้มีอย่างน้อย 5 แถว ถ้าฐานส่งมาน้อยกว่านี้ จะเติมแถวว่างให้ครบ
const rowsForPrint = computed(() => {
  const base = record.value.rows || []
  const total = 5
  const out = base.map(r => ({
    fpdNo: r.fpdNo || '',
    fpdSize: r.fpdSize || '',
    id: r.id || '',
    ei: r.ei || '',
    ddi: r.ddi || '',
    pixelMean: r.pixelMean || ''
  }))

  while (out.length < total) {
    out.push({
      fpdNo: '',
      fpdSize: '',
      id: '',
      ei: '',
      ddi: '',
      pixelMean: ''
    })
  }
  return out
})

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
        if (parsed.formTitle !== undefined) record.value.formTitle = parsed.formTitle
        if (parsed.frequency !== undefined) record.value.frequency = parsed.frequency
        if (Array.isArray(parsed.rows)) record.value.rows = parsed.rows
      } catch (_) {}
    }
  } catch (e) {
    console.error('Load checklist record error:', e)
  }
})
</script>

<style src="./printLayout.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ TH Sarabun ทั้งหน้า + ขนาดพื้นฐาน 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt;
  font-weight: 400;
}

/* ============================
   HEADER – ชิดซ้าย
   ============================ */
.header-main {
  text-align: left !important;
  margin-bottom: 4mm;
}

/* หัวข้อใหญ่ */
.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
  text-align: left !important;
}

/* ความถี่ */
.title-sub {
  font-size: 16pt;
  text-align: left !important;
}

/* ============================
   TABLE
   ============================ */
.table-wrapper {
  margin-bottom: 18mm;
}

.f82-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* เพิ่ม padding เพื่อให้แถวว่างทั้ง 5 แถว “สูงและกว้าง” เท่ากัน */
.f82-table th,
.f82-table td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;       /* ← เพิ่มความกว้างแถว */
  text-align: center;
  vertical-align: middle;
}

/* กำหนดความกว้างคอลัมน์ */
.col-fpd-no {
  width: 22mm;
}
.col-fpd-size {
  width: 35mm;
}
.col-id {
  width: 28mm;
}
.col-ei {
  width: 25mm;
}
.col-ddi {
  width: 25mm;
}
.col-pixel {
  width: 30mm;
}

/* ============================
   SIGNATURE – ชิดขวา
   ============================ */
.signature-block {
  margin-top: 20mm;
  font-size: 16pt;
  text-align: right !important;     /* ← ชิดขวาทั้งบล็อก */
  padding-right: 5mm;               /* ← ขยับชิดขวาแบบสวยงาม */
}

.sig-line {
  margin-bottom: 4mm;
}
/* ความถี่ : ตัวหนา */
.freq-label {
  font-weight: 700;
}

/* ทุก 6 เดือน = ตัวบาง */
.freq-value {
  font-weight: 400;
}

/* ลดความกว้างบน–ล่างของแถวแรก (หัวตาราง) เท่านั้น */
.f82-table thead th {
  padding-top: 1.5mm !important;
  padding-bottom: 1.5mm !important;
}


@media print {
  .f82-table th, .f82-table td { border: 1px solid #000 !important; }
}
</style>

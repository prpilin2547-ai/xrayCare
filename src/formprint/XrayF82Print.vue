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
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            {{ record.formTitle }}
          </div>
          <div class="title-sub">
            ความถี่ : {{ record.frequency }}
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
                <th class="col-pixel">Pixel mean</th>
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
            ลงชื่อ.................................................................ผู้ทดสอบ
          </div>
          <div class="sig-line">
            (.................................................................)
          </div>
          <div class="sig-line">
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

// โหลดข้อมูลจริงจาก backend
onMounted(async () => {
  const id = route.params.id

  try {
    // แก้ URL ให้ตรงกับ API ของคุณเอง
    // ตัวอย่างโครงข้อมูลที่คาดหวังจาก backend:
    // {
    //   formTitle: '...',
    //   frequency: 'ทุก 6 เดือน',
    //   rows: [
    //     { fpdNo, fpdSize, id, ei, ddi, pixelMean },
    //     ...
    //   ]
    // }
    const res = await fetch(`/api/print/f8-2/${id}`)
    if (res.ok) {
      const data = await res.json()
      if (data.formTitle) record.value.formTitle = data.formTitle
      if (data.frequency) record.value.frequency = data.frequency
      if (Array.isArray(data.rows)) record.value.rows = data.rows
    }
  } catch (err) {
    console.error('โหลดข้อมูล F8-2 ไม่สำเร็จ', err)
  }
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


/* ปุ่ม Print */
.print-toolbar {
  margin-bottom: 18px;
}

.btn-print {
  padding: 6px 18px;
  background: #fff;
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
  padding: 20mm 0 18mm;
  font-size: 14pt;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 10mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  font-size: 16pt;
}

/* ตาราง */
.table-wrapper {
  margin-bottom: 18mm;
}

.f82-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f82-table th,
.f82-table td {
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  text-align: center;
  vertical-align: middle;
}

/* กำหนดความกว้างคอลัมน์ให้ใกล้เคียงต้นฉบับ */
.col-fpd-no {
  width: 20mm;
}
.col-fpd-size {
  width: 30mm;
}
.col-id {
  width: 25mm;
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

/* ลายเซ็น */
.signature-block {
  margin-top: 20mm;
  font-size: 14pt;
}

.sig-line {
  margin-bottom: 4mm;
}

/* โหมดพิมพ์ */
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

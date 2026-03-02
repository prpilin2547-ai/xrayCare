<template>
  <div class="print-root">
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;">
          <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z" />
        </svg>
        Print
      </button>
    </div>

    <div class="form-area form-area--f1-monthly">
      <div class="form-main-title">แบบบันทึก</div>

      <div class="form-meta">
        <div class="meta-row">
          <span class="meta-strong">แบบบันทึก F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์</span>
        </div>
        <div class="meta-row">
          <span class="label-bold">ความถี่ : </span>
          <span>ทุกวันก่อนเริ่มปฏิบัติงาน</span>
        </div>
        <div class="meta-row">
          <span class="label-bold">เครื่องเอกซเรย์</span>
          <span class="underline underline-long">{{ machineName }}{{ room ? ' (' + room + ')' : '' }}</span>
          <span class="meta-label label-bold">เดือน</span>
          <span class="underline underline-short">{{ monthLabel }}</span>
        </div>
        <div class="meta-row">
          <span class="label-bold">วันที่:</span>
          <span class="underline underline-wide">{{ dateRangeText }}</span>
        </div>
      </div>

      <div class="table-wrapper table-monthly">
        <table class="qc-table qc-table-monthly">
          <colgroup>
            <col class="col-item-width" />
            <col v-for="d in daysInMonth" :key="d" class="col-day-width" />
          </colgroup>
          <thead>
            <tr>
              <th class="col-item">รายการตรวจสอบ</th>
              <th v-for="d in daysInMonth" :key="'h-' + d" class="col-day-head">{{ d }}</th>
            </tr>
            <tr class="sub-header">
              <td class="bold-cell left-label">ผู้ทดสอบ: {{ testerNames }}</td>
              <td :colspan="daysInMonth" class="bold-cell">ผลการตรวจสอบ Pass (✔) / Fail (✘) ของวันที่</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in rowLabels" :key="'row-' + ri">
              <td class="col-item left-label">{{ row }}</td>
              <td v-for="d in daysInMonth" :key="'c-' + d" class="col-day day-cell">{{ getCellResult(d, ri) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { apiFetch } from '../api/client'
const route = useRoute()

const ROW_LABELS = [
  'สายไฟ : ไม่พบรอยแตก ไม่บิดงอ ไม่พันเป็นปม และไม่มีอุปกรณ์ที่มีน้ำหนักมากวางทับสายไฟ',
  'ระบบล็อกและเบรก : ทำงานได้อย่างถูกต้อง',
  'เตียง หลอดเอกซเรย์ และบักกี้ : เคลื่อนที่ได้อย่างราบเรียบ',
  'X-ray tube warm-up : ด้วยค่าเทคนิคที่บริษัทแนะนำ'
]

const rowLabels = ref([...ROW_LABELS])
const machineName = ref('')
const room = ref('')
const monthLabel = ref('')
const dateRangeText = ref('')
const recordsByDay = ref({})
const testerNames = ref('')
const monthYear = ref({ month: 1, year: 2569 })
const daysInMonth = computed(() => {
  const y = monthYear.value.year - 543
  const m = monthYear.value.month
  const d = new Date(y, m, 0)
  return d.getDate()
})

function parseCheckDate(str) {
  if (!str || typeof str !== 'string') return null
  const trimmed = str.trim()
  const datePart = trimmed.split(/\s+/)[0] || trimmed
  const slashParts = datePart.split('/')
  if (slashParts.length >= 3) {
    const dd = parseInt(slashParts[0], 10)
    const mm = parseInt(slashParts[1], 10)
    const yyyy = parseInt(slashParts[2], 10)
    if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) {
      const year = yyyy > 2400 ? yyyy : yyyy + 543
      return { day: dd, month: mm, year }
    }
  }
  return null
}

function getCellResult(day, rowIndex) {
  const rec = recordsByDay.value[day]
  if (!rec || !rec.checklist || !rec.checklist[rowIndex]) return '–'
  const r = (rec.checklist[rowIndex].result || '').toLowerCase()
  if (r === 'pass') return '✔'
  if (r === 'fail') return '✗'
  return '–'
}

function handlePrint() {
  window.print()
}

onMounted(async () => {
  const monthParam = route.query.month
  const machineQuery = route.query.machine || ''
  if (!monthParam) return

  const [y, m] = monthParam.split('-').map(Number)
  if (!m || m < 1 || m > 12) return
  const yearBe = (y || new Date().getFullYear()) + 543
  monthYear.value = { month: m, year: yearBe }
  monthLabel.value = `${String(m).padStart(2, '0')}/${yearBe}`
  const days = new Date(y, m, 0).getDate()
  dateRangeText.value = `1 - ${days} ${monthParam}`

  let allRecords = []
  try {
    const res = await apiFetch('/GetAllChecklistRecords')
    if (!res.ok) return
    const data = await res.json()
    allRecords = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Load checklist records error:', e)
    return
  }

  const monthStart = new Date(y, m - 1, 1)
  const monthEnd = new Date(y, m, 0)
  const startTime = monthStart.getTime()
  const endTime = monthEnd.getTime() + 86400000

  let list = allRecords.filter(r => (r.formType || '') === 'F1_F2')
  list = list.filter(r => {
    const cd = parseCheckDate(r.checkDate || '')
    if (!cd) return false
    const dateObj = new Date(cd.year - 543, cd.month - 1, cd.day)
    const t = dateObj.getTime()
    return t >= startTime && t <= endTime
  })

  if (machineQuery && machineQuery.startsWith('machine-')) {
    const machineId = machineQuery.replace('machine-', '')
    const machinesRes = await apiFetch('/GetAllMachines')
    if (machinesRes.ok) {
      const machines = await machinesRes.json()
      const machine = (Array.isArray(machines) ? machines : []).find(m => String(m.id) === String(machineId))
      if (machine) {
        list = list.filter(r =>
          (r.machineName || '').trim() === (machine.machineName || '').trim() &&
          (r.room || '').trim() === (machine.room || '').trim()
        )
        machineName.value = machine.machineName || ''
        room.value = machine.room || ''
      }
    }
  }
  if (!machineName.value && list.length > 0) {
    machineName.value = list[0].machineName || ''
    room.value = list[0].room || ''
  }

  const byDay = {}
  const testers = new Set()
  list.forEach(r => {
    const cd = parseCheckDate(r.checkDate || '')
    if (cd) {
      byDay[cd.day] = r
      if (r.tester) testers.add(r.tester)
    }
    let parsed
    try {
      parsed = r.jsonData ? JSON.parse(r.jsonData) : {}
    } catch (_) {
      parsed = {}
    }
    if (parsed.checklist && Array.isArray(parsed.checklist)) {
      const row = parsed.checklist.map(item => ({
        label: typeof item === 'string' ? item : (item.label || item.name || item.text || ''),
        result: (item && (item.result || item.resultByDay)) || ''
      }))
      if (byDay[cd.day]) byDay[cd.day].checklist = row
    }
  })
  recordsByDay.value = byDay
  testerNames.value = [...testers].join(', ') || '–'
})
</script>

<style scoped>
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  font-size: 14pt !important;
  box-sizing: border-box;
}

/* หน้านี้ใช้ A4 แนวนอนเท่านั้น — ไม่ใช้ printLayout ร่วม เพื่อไม่ให้ถูก portrait/190mm บัง */
.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.print-toolbar { margin-bottom: 8px; }
.btn-print {
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.form-area--f1-monthly {
  width: 281mm;
  min-height: 194mm;
  padding: 6mm 8mm;
  background: white;
  overflow: visible;
}

.form-main-title {
  background: #e5e5e5;
  text-align: center;
  padding: 3mm 0;
  font-weight: 700;
  margin-bottom: 3mm;
  font-size: 20pt !important;
}

.form-meta { font-size: 15pt; margin-bottom: 2mm; }
.meta-row { margin-bottom: 1.2mm; }
.meta-strong { font-size: 16pt !important; font-weight: 700; }
.label-bold { font-weight: 700 !important; }
.meta-label { margin-left: 8mm; }
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
  display: inline-block;
}
.underline-short { min-width: 35mm; }
.underline-long { min-width: 60mm; }
.underline-wide { min-width: 60mm; }

.table-wrapper { overflow-x: auto; max-width: 100%; }
.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt !important;
  margin-top: 4mm;
}
.qc-table td, .qc-table th {
  border: 1px solid #000;
  padding: 1.2mm 0.6mm;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  word-break: break-word;
  font-size: 12pt !important;
}
.col-item-width { width: 48mm; }
.col-day-width { width: 5.5mm; min-width: 5mm; }
.col-item { text-align: left !important; padding-left: 2mm !important; }
.left-label { text-align: left !important; padding-left: 2mm !important; }
.bold-cell { font-weight: 700 !important; }
.day-cell { font-size: 12pt !important; }
</style>

<style>
/* บังคับ A4 แนวนอน เพื่อให้ตาราง 31 วันแสดงครบ */
@page {
  size: A4 landscape;
  size: 297mm 210mm;
  margin: 6mm;
}

@media print {
  /* บังคับความกว้างเอกสารให้ต้องใช้แนวตั้งแนวนอน */
  html, body, #app {
    overflow: visible !important;
    height: auto !important;
    min-width: 282mm !important;
    width: 282mm !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .print-root {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    overflow: visible !important;
    max-width: none !important;
    width: 282mm !important;
    min-width: 282mm !important;
    min-height: 0 !important;
    height: auto !important;
  }
  .form-area--f1-monthly {
    width: 280mm !important;
    min-width: 280mm !important;
    max-width: 280mm !important;
    min-height: 0 !important;
    height: auto !important;
    padding: 4mm 5mm !important;
    overflow: visible !important;
    box-sizing: border-box !important;
    page-break-inside: avoid;
  }
  .print-toolbar { display: none !important; }
  .table-wrapper {
    overflow: visible !important;
    max-width: none !important;
    width: 100% !important;
  }
  .qc-table-monthly {
    width: 100% !important;
    table-layout: fixed !important;
    page-break-inside: avoid;
  }
  .qc-table-monthly td, .qc-table-monthly th { border: 1px solid #000 !important; }
  /* ความกว้างคอลัมน์: รายการ 18%, 31 วัน = 82% (2.65% ต่อวัน) */
  .form-area--f1-monthly .col-item-width { width: 18% !important; }
  .form-area--f1-monthly .col-day-width { width: 2.65% !important; min-width: 0 !important; }
  /* ขนาดตัวอักษรเหมาะสม อ่านง่าย ครบ 31 วัน ในหนึ่งหน้าแนวนอน */
  .form-area--f1-monthly .form-main-title { font-size: 18pt !important; padding: 2.5mm 0 !important; }
  .form-area--f1-monthly .form-meta { font-size: 14pt !important; margin-bottom: 1.5mm !important; }
  .form-area--f1-monthly .meta-strong { font-size: 15pt !important; }
  .form-area--f1-monthly .meta-row { margin-bottom: 1mm !important; }
  .form-area--f1-monthly .qc-table-monthly { font-size: 12pt !important; margin-top: 2.5mm !important; line-height: 1.25 !important; }
  .form-area--f1-monthly .qc-table-monthly td,
  .form-area--f1-monthly .qc-table-monthly th { padding: 1mm 0.5mm !important; font-size: 12pt !important; line-height: 1.25 !important; }
  .form-area--f1-monthly .day-cell { font-size: 12pt !important; }
  .form-area--f1-monthly .col-day-head { font-size: 12pt !important; }
}

/* กรณีเลือกพิมพ์แนวตั้ง: ย่อพอดีหน้ากว้าง 190mm ยังอ่านได้ */
@media print and (orientation: portrait) {
  .print-root {
    transform: scale(0.68);
    transform-origin: top left;
    width: 282mm !important;
  }
  html, body, #app {
    width: 192mm !important;
    min-width: 192mm !important;
  }
}
</style>

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

    <div class="sheet-inner sheet-inner--flow">
      <div class="header-main">
        <div class="title-main">แบบบันทึก F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)</div>
        <div class="title-center-block">
          <div class="title-sub">แบบบันทึกการลบแผ่นเพลท แผนกเอกซเรย์</div>
          <div class="title-sub">
            ปีงบประมาณ พ.ศ.
            <span class="underline inline">{{ fiscalYear }}</span>
          </div>
        </div>
      </div>

      <div class="meta-inline">
        <div class="meta-row-inline">
          <span>ความถี่ :</span>
          <span class="meta-short">ทุกวัน</span>
        </div>
        <div class="meta-row-inline">
          <span>หมายเลข IP</span>
          <span class="underline meta-long">{{ ipNumber }}</span>
        </div>
      </div>

      <div v-for="(section, blockIndex) in daySections" :key="blockIndex" class="month-block">
        <table class="f2-table">
          <colgroup>
            <col class="col-month" />
            <col class="col-second" />
            <col v-for="d in section.days" :key="d" class="col-day" />
          </colgroup>
          <thead>
            <tr>
              <th class="col-left" colspan="2">เดือน/รายการ/วันที่</th>
              <th v-for="d in section.days" :key="'h-' + (section.start + d - 1)" class="col-day">{{ section.start + d - 1 }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-month" rowspan="2">
                <div class="month-wrapper">
                  <div class="month-label">เดือน</div>
                  <span class="underline month-line">{{ section.monthLabel }}</span>
                </div>
              </td>
              <td class="col-second">ผลการทดสอบ<br>Pass (✔) / Fail (✗)</td>
              <td v-for="d in section.days" :key="'r1-'+d" class="col-day">{{ getResult(d, blockIndex) }}</td>
            </tr>
            <tr>
              <td class="col-second">สภาพผิดปกติ<br>ของแผ่น<br>หรือตำแหน่งบนภาพ</td>
              <td v-for="d in section.days" :key="'r2-'+d" class="col-day cell-small">{{ getRemark(d, blockIndex) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="signature-block">
        <div class="sig-line">ลงชื่อ.........................................................ผู้ทดสอบ</div>
        <div class="sig-line">(...........................................................................)</div>
        <div class="sig-line">ตำแหน่ง...................................................................</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const API_BASE = '/api/Xraycare'
const route = useRoute()

const fiscalYear = ref('')
const ipNumber = ref('')
const monthLabel = ref('')
const plateByDay = ref({})
const daysInMonth = ref(31)
const daySections = computed(() => {
  const d = daysInMonth.value
  const s1 = { monthLabel: monthLabel.value, days: d >= 20 ? 20 : d, start: 1 }
  const s2 = { monthLabel: monthLabel.value, days: d > 20 ? d - 20 : 0, start: 21 }
  return s2.days > 0 ? [s1, s2] : [s1]
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
      return { day: dd, month: mm, year: yyyy > 2400 ? yyyy : yyyy + 543 }
    }
  }
  return null
}

function dayInSection(blockIndex, oneBasedColIndex) {
  const sec = daySections.value[blockIndex]
  if (!sec || oneBasedColIndex < 1 || oneBasedColIndex > sec.days) return null
  return sec.start + oneBasedColIndex - 1
}

function getResult(dayCol, blockIndex) {
  const day = dayInSection(blockIndex, dayCol)
  if (!day) return '–'
  const p = plateByDay.value[day]
  if (!p || !p.result) return '–'
  const r = (p.result || '').toLowerCase()
  if (r === 'pass') return '✔'
  if (r === 'fail') return '✗'
  return '–'
}

function getRemark(dayCol, blockIndex) {
  const day = dayInSection(blockIndex, dayCol)
  if (!day) return ''
  const p = plateByDay.value[day]
  return (p && p.remark) ? p.remark : ''
}

function getInspector(dayCol, blockIndex) {
  const day = dayInSection(blockIndex, dayCol)
  if (!day) return ''
  const p = plateByDay.value[day]
  return (p && p.tester) ? p.tester : ''
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
  fiscalYear.value = String(yearBe)
  monthLabel.value = `${String(m).padStart(2, '0')}/${yearBe}`
  const d = new Date(y, m, 0).getDate()
  daysInMonth.value = d

  let allRecords = []
  try {
    const res = await fetch(`${API_BASE}/GetAllChecklistRecords`)
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
    const machinesRes = await fetch(`${API_BASE}/GetAllMachines`)
    if (machinesRes.ok) {
      const machines = await machinesRes.json()
      const machine = (Array.isArray(machines) ? machines : []).find(m => String(m.id) === String(machineId))
      if (machine) {
        list = list.filter(r =>
          (r.machineName || '').trim() === (machine.machineName || '').trim() &&
          (r.room || '').trim() === (machine.room || '').trim()
        )
      }
    }
  }

  if (list.length > 0) {
    ipNumber.value = list[0].machineName ? `${list[0].machineName}${list[0].room ? ' (' + list[0].room + ')' : ''}` : '–'
  } else {
    ipNumber.value = '–'
  }

  const byDay = {}
  list.forEach(r => {
    const cd = parseCheckDate(r.checkDate || '')
    if (!cd) return
    let parsed = {}
    try {
      parsed = r.jsonData ? JSON.parse(r.jsonData) : {}
    } catch (_) {}
    const pe = parsed.plateErase || {}
    byDay[cd.day] = {
      result: pe.result || '',
      remark: pe.remark || '',
      tester: r.tester || ''
    }
  })
  plateByDay.value = byDay
})
</script>

<style src="./printLayout.css"></style>
<style scoped>
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  box-sizing: border-box;
}

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

.title-main {
  font-weight: 700;
  font-size: 22pt !important;
  text-align: left;
  margin-bottom: 1.5mm;
}

.title-center-block {
  text-align: center;
  margin-top: 4mm;
}

.title-sub { margin-bottom: 0.5mm; font-size: 17pt !important; }
.title-center-block .title-sub { font-weight: 700; }

.meta-inline {
  margin-top: 4mm;
  margin-bottom: 6mm;
  text-align: left;
  padding-left: 2mm;
  font-size: 16pt !important;
}

.meta-row-inline span:first-child { font-weight: 700; }
.meta-short { min-width: 28mm; margin-left: 4px; }
.meta-long { min-width: 50mm; margin-left: 4px; }
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}
.inline { min-width: 20mm; }

.month-block { margin-bottom: 12mm; }

.f2-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt !important;
  border-spacing: 0;
}

.f2-table th,
.f2-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 0.8mm;
  vertical-align: middle;
  text-align: center;
  box-sizing: border-box;
}

.col-left { width: 38mm; font-size: 14pt !important; }
.f2-table td.col-left { text-align: left; }
.col-day { min-width: 5.5mm; width: auto; padding: 1.2mm 0.6mm !important; font-size: 14pt !important; }
.col-second {
  width: 38mm !important;
  text-align: left !important;
  padding-left: 2mm !important;
  vertical-align: top !important;
  line-height: 1.3;
  font-size: 14pt !important;
}

.cell-small { text-align: left !important; padding-left: 1mm !important; font-size: 13pt !important; }

.col-month {
  width: 14mm !important;
  vertical-align: middle !important;
  text-align: center !important;
  padding: 1mm !important;
}
.f2-table td.col-month { vertical-align: middle !important; }

.month-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 0;
  gap: 2mm;
}

.month-label { font-weight: 700; font-size: 14pt !important; }
.month-line {
  border-bottom: 0.4pt solid #000;
  min-width: 12mm;
  display: inline-block;
  margin-top: 1mm;
}

.signature-block {
  margin-top: 10mm;
  text-align: right;
  font-size: 16pt !important;
  line-height: 1.8;
}
.sig-line {
  font-size: 16pt !important;
}

@page { size: A4 portrait; margin: 10mm; }
@media print {
  .print-root { padding: 0; background: white; }
  .print-toolbar { display: none; }
  .f2-table th, .f2-table td { border: 1px solid #000 !important; }
  .sheet-inner--flow .title-main { font-size: 22pt !important; }
  .sheet-inner--flow .title-sub { font-size: 17pt !important; }
  .sheet-inner--flow .meta-inline { font-size: 16pt !important; }
  .sheet-inner--flow .f2-table { font-size: 14pt !important; }
  .sheet-inner--flow .f2-table th,
  .sheet-inner--flow .f2-table td { padding: 1.5mm 0.8mm !important; font-size: 14pt !important; }
  .sheet-inner--flow .col-left { font-size: 14pt !important; }
  .sheet-inner--flow .col-day { font-size: 14pt !important; padding: 1mm 0.4mm !important; }
  .sheet-inner--flow .col-second { font-size: 14pt !important; line-height: 1.3 !important; }
  .sheet-inner--flow .cell-small { font-size: 13pt !important; }
  .sheet-inner--flow .month-label { font-size: 14pt !important; }
}
</style>

<style>
/* สไตล์พิมพ์ไม่ใช้ scoped + บังคับ scale 100% เพื่อไม่ให้เบราว์เซอร์ย่อข้อความ */
@media print {
  html, body {
    width: 210mm !important;
    min-width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    zoom: 1 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-root,
  .print-root > .sheet-inner.sheet-inner--flow {
    transform: none !important;
    zoom: 1 !important;
  }
  .print-root > .sheet-inner.sheet-inner--flow {
    width: 190mm !important;
    max-width: 190mm !important;
    min-width: 190mm !important;
    padding: 10mm !important;
    box-sizing: border-box !important;
  }
  .print-root > .sheet-inner.sheet-inner--flow .f2-table { width: 100% !important; table-layout: fixed !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-month { width: 15mm !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-second { width: 42mm !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-day { width: auto !important; min-width: 5mm !important; padding: 2.5mm 1.2mm !important; }
  .print-root > .sheet-inner.sheet-inner--flow .title-main { font-size: 28pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .title-sub { font-size: 20pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .meta-inline,
  .print-root > .sheet-inner.sheet-inner--flow .meta-inline * { font-size: 19pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .f2-table,
  .print-root > .sheet-inner.sheet-inner--flow .f2-table th,
  .print-root > .sheet-inner.sheet-inner--flow .f2-table td { font-size: 18pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-left { font-size: 18pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-day { font-size: 18pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .col-second { font-size: 18pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .cell-small { font-size: 17pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .month-label { font-size: 18pt !important; }
  .print-root > .sheet-inner.sheet-inner--flow .f2-table th,
  .print-root > .sheet-inner.sheet-inner--flow .f2-table td { padding: 2.5mm 1.2mm !important; }
  .print-root > .sheet-inner.sheet-inner--flow .signature-block { font-size: 18pt !important; margin-top: 10mm; }
  .print-root > .sheet-inner.sheet-inner--flow .sig-line { font-size: 18pt !important; }
}
</style>

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
            <!-- แถวตัวอย่าง ต.ย. ภายนอก (ไม่แสดงข้อมูล เว้นว่าง) -->
            <tr>
              <td class="col-no">ต.ย.</td>
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

            <!-- แถวข้อมูลจาก jsonData.items (inspectType = visual) เริ่มข้อ 1 -->
            <tr v-for="(row, idx) in externalRows" :key="'ext-' + idx">
              <td class="col-no row-top">{{ idx + 1 }}</td>
              <td>{{ row.deviceNumber || '' }}</td>
              <td>{{ labelDeviceType(row.deviceType) }}</td>
              <td>{{ row.yearsUsed ?? '' }}</td>
              <td>{{ formatDate(row.inspectDate) || '' }}</td>
              <td>{{ labelDamageType(row.damageType) }}</td>
              <td>{{ row.damagePosition || '' }}</td>
              <td>{{ row.damageSize || '' }}</td>
              <td>{{ labelStorageMethod(row.storageMethod) }}</td>
              <td>{{ row.inspectorName || '' }}</td>
            </tr>

            <!-- แถวว่าง ภายนอก -->
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

            <!-- แถวตัวอย่าง ต.ย. ภายใน (ไม่แสดงข้อมูล เว้นว่าง) -->
            <tr>
              <td class="col-no">ต.ย.</td>
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

            <!-- แถวข้อมูลจาก jsonData.items (inspectType = xray หรืออื่นๆ) เริ่มข้อ 1 -->
            <tr v-for="(row, idx) in internalRows" :key="'int-' + idx">
              <td class="col-no row-top">{{ idx + 1 }}</td>
              <td>{{ row.deviceNumber || '' }}</td>
              <td>{{ labelDeviceType(row.deviceType) }}</td>
              <td>{{ row.yearsUsed ?? '' }}</td>
              <td>{{ formatDate(row.inspectDate) || '' }}</td>
              <td>{{ labelDamageType(row.damageType) }}</td>
              <td>{{ row.damagePosition || '' }}</td>
              <td>{{ row.damageSize || '' }}</td>
              <td>{{ labelStorageMethod(row.storageMethod) }}</td>
              <td>{{ row.inspectorName || '' }}</td>
            </tr>

            <!-- แถวว่าง ภายใน -->
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

        <!-- ลายเซ็นด้านล่าง (เว้นช่องลงชื่อไว้ ไม่ใส่ชื่อ) -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ ........................................................ ผู้ทดสอบ
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
  frequency: 'ทุก 6 เดือน',
  checkDate: '',
  tester: '',
  machineName: '',
  room: ''
})

const externalChecks = ref([])
const internalChecks = ref([])

/* แถวที่แสดงในตาราง (ข้อมูลเริ่มจากข้อ 1 เป็นต้นไป ไม่รวมแถว ต.ย.) */
const externalRows = computed(() => externalChecks.value)
const internalRows = computed(() => internalChecks.value)

/** ชนิดของอุปกรณ์ (ตามฟอร์ม F9) */
function labelDeviceType (code) {
  if (!code) return ''
  const map = {
    leadApron: 'เสื้อตะกั่ว'
  }
  return map[String(code).trim()] || code
}

/** ชนิดของความชำรุดเสียหาย (ตามฟอร์ม F9) */
function labelDamageType (code) {
  if (!code) return ''
  const map = {
    hole: 'รูทะลุ',
    crack: 'รอยหัก'
  }
  return map[String(code).trim()] || code
}

/** วิธีการจัดเก็บ (ตามฟอร์ม F9) */
function labelStorageMethod (code) {
  if (!code) return ''
  const map = {
    hang: 'ไม้แขวน',
    flat: 'วางราบ',
    layFlat: 'วางราบ'
  }
  return map[String(code).trim()] || code
}

/** วันที่ ISO (YYYY-MM-DD) → DD/MM/YYYY (พ.ศ.) */
function formatDate (val) {
  if (val === undefined || val === null) return ''
  const s = String(val).trim()
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-')
    const thaiYear = Number.parseInt(y, 10) + 543
    return `${d}/${m}/${thaiYear}`
  }
  return s
}

function handlePrint () {
  window.print()
}

const API_BASE = '/api/Xraycare'

/** แปลง items จาก jsonData ให้ตรงกับช่องในฟอร์ม (ลำดับที่, หมายเลขอุปกรณ์, ชนิดของอุปกรณ์, อายุการใช้งาน, วันที่ตรวจสอบ, ชนิดของความชำรุดเสียหาย, ตำแหน่ง, ขนาด, วิธีการจัดเก็บ, ผู้บันทึก) */
function normalizeItems (items) {
  if (!Array.isArray(items)) return []
  return items.map(it => ({
    id: it.id,
    inspectType: it.inspectType,
    deviceNumber: it.deviceNumber ?? it.equipmentNo ?? '',
    deviceType: it.deviceType ?? it.equipmentType ?? '',
    yearsUsed: it.yearsUsed ?? it.usageAge ?? '',
    inspectDate: it.inspectDate ?? it.checkDate ?? '',
    damageType: it.damageType ?? '',
    damagePosition: it.damagePosition ?? it.position ?? '',
    damageSize: it.damageSize ?? it.size ?? '',
    storageMethod: it.storageMethod ?? '',
    inspectorName: it.inspectorName ?? it.recorder ?? ''
  }))
}

function applyRecordData (data) {
  if (!data) return
  if (data.checkDate) record.value.checkDate = data.checkDate
  if (data.tester) record.value.tester = data.tester
  if (data.machineName !== undefined) record.value.machineName = data.machineName
  if (data.room !== undefined) record.value.room = data.room

  let raw = data.jsonData
  if (raw === undefined || raw === null) return
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (parsed.frequency !== undefined) record.value.frequency = parsed.frequency

    if (Array.isArray(parsed.items)) {
      const normalized = normalizeItems(parsed.items)
      const external = normalized.filter(it => String(it.inspectType || '').toLowerCase() === 'visual')
      const internal = normalized.filter(it => String(it.inspectType || '').toLowerCase() !== 'visual')
      externalChecks.value = external.length ? external : [{ deviceNumber: '', deviceType: '', yearsUsed: '', inspectDate: '', damageType: '', damagePosition: '', damageSize: '', storageMethod: '', inspectorName: '' }]
      internalChecks.value = internal.length ? internal : [{ deviceNumber: '', deviceType: '', yearsUsed: '', inspectDate: '', damageType: '', damagePosition: '', damageSize: '', storageMethod: '', inspectorName: '' }]
    } else {
      if (Array.isArray(parsed.externalChecks)) externalChecks.value = normalizeItems(parsed.externalChecks)
      if (Array.isArray(parsed.internalChecks)) internalChecks.value = normalizeItems(parsed.internalChecks)
      if (externalChecks.value.length === 0) externalChecks.value = [{ deviceNumber: '', deviceType: '', yearsUsed: '', inspectDate: '', damageType: '', damagePosition: '', damageSize: '', storageMethod: '', inspectorName: '' }]
      if (internalChecks.value.length === 0) internalChecks.value = [{ deviceNumber: '', deviceType: '', yearsUsed: '', inspectDate: '', damageType: '', damagePosition: '', damageSize: '', storageMethod: '', inspectorName: '' }]
    }
  } catch (_) {}
}

onMounted(async () => {
  const id = route.query.id || route.params.id
  const stateRecord = history.state?.record

  if (stateRecord && (stateRecord.formType === 'F9' || stateRecord.jsonData)) {
    applyRecordData(stateRecord)
    return
  }

  if (!id) return
  try {
    const res = await fetch(`${API_BASE}/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    applyRecordData(data)
  } catch (e) {
    console.error('Load checklist record error:', e)
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
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* ข้อความยาวในช่องข้อมูลให้ขึ้นบรรทัดใหม่ (รวมข้อความไทยที่ไม่มีช่องว่าง) */
.f9-table td {
  word-break: break-all;
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

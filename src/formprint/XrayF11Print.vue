<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นเท่านั้น -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะถูกซ่อนตอนสั่งพิมพ์) -->
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

    <!-- กระดาษ A4 -->
    <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย
          </div>
        </div>

        <!-- ตารางหลักตามฟอร์ม -->
        <table class="f11-table">
          <thead>
            <tr>
              <th class="col-region">
                บริเวณฉายรังสี
              </th>
              <th class="col-small">
                ค่าความต่าง<br />
                ศักย์<br />
                (kV)
              </th>
              <th class="col-small">
                ค่ากระแสไฟฟ้า<br />
                กับเวลา<br />
                (mAs)
              </th>
              <th class="col-small">
                ระยะโฟกัสถึง<br />
                ตัวรับภาพ<br />
                (cm)<br />
                (FTD)
              </th>
              <th class="col-small">
                ความหนา<br />
                ของอวัยวะ<br />
                (cm)<br />
                (tₚ)
              </th>
              <th class="col-small">
                ระยะ<br />
                Bucky<br />
                (cm)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in examRows"
              :key="'row-' + index"
            >
              <td class="align-left">
                {{ row.regionDisplay }}
              </td>
              <td>{{ row.kv ?? '' }}</td>
              <td>{{ row.mas ?? '' }}</td>
              <td>{{ row.ftd ?? '' }}</td>
              <td>{{ row.tp ?? '' }}</td>
              <td>{{ row.bucky ?? '' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- พื้นที่ว่างด้านล่าง (ให้ใกล้เคียง PDF) -->
        <div class="bottom-space"></div>

        <!-- ลายเซ็นผู้ตรวจสอบ -->
        <div class="sign-block">
          <div class="sign-inner">
            <div class="sign-line">
              ลงชื่อ..............................................................ผู้ทดสอบ
            </div>
            <div class="sign-line">
              (.................................................................................)
            </div>
            <div class="sign-line">
              ตำแหน่ง.....................................................................
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

const record = ref({
  id: null,
  formA: {},
  formC: {},
  examRowsRaw: []
})

/** แถวตารางสำหรับแสดง (บริเวณฉายรังสี, kV, mAs, FTD, tₚ, Bucky) จาก jsonData.examRows */
const examRows = computed(() => {
  const raw = record.value.examRowsRaw
  if (!Array.isArray(raw) || raw.length === 0) {
    return [
      { regionDisplay: '', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
      { regionDisplay: '', kv: '', mas: '', ftd: '', tp: '', bucky: '' }
    ]
  }
  return raw.map(row => ({
    regionDisplay: row.regionResolved || row.region || row.regionOther || '',
    kv: row.kv,
    mas: row.mas,
    ftd: row.ftd,
    tp: row.tp,
    bucky: row.bucky
  }))
})

function handlePrint () {
  window.print()
}

import { apiFetch } from '../api/client'

/** อ่าน jsonData แล้วใส่ formA, examRows, formC ตามโครงสร้างตัวอย่าง */
function applyRecordData (data) {
  if (!data) return
  record.value.id = data.id ?? record.value.id

  let raw = data.jsonData
  if (raw === undefined || raw === null) return
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (parsed.formA) record.value.formA = parsed.formA
    if (parsed.formC) record.value.formC = parsed.formC
    if (Array.isArray(parsed.examRows)) {
      record.value.examRowsRaw = parsed.examRows
    } else if (Array.isArray(parsed.rows)) {
      record.value.examRowsRaw = parsed.rows.map(r => ({
        regionResolved: r.region,
        region: r.region,
        regionOther: r.regionOther || '',
        kv: r.kv,
        mas: r.mas,
        ftd: r.ftd,
        tp: r.tp,
        bucky: r.bucky,
        note: r.note
      }))
    }
  } catch (_) {}
}

onMounted(async () => {
  const id = route.query.id || route.params.id
  const stateRecord = history.state?.record

  if (stateRecord && (stateRecord.formType === 'F11' || stateRecord.jsonData)) {
    applyRecordData(stateRecord)
    return
  }

  if (!id) return
  try {
    const res = await apiFetch(`/GetChecklistRecord/${id}`)
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

/* ฟอนต์ TH Sarabun ทั้งหน้า + ขนาดพื้นฐาน 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt;
  font-weight: 400;
}

/* หัวฟอร์ม */
.header-main {
  text-align: left;
  margin-bottom: 7mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
}

/* ตาราง F11 */
.f11-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 16pt;
}

.f11-table th,
.f11-table td {
  border: 0.4pt solid #000;
  padding: 1mm 1mm;
  text-align: center;
  vertical-align: middle;
  height: 9mm;
}

/* ===== หัวตาราง F11 : ตัวหนา + ชิดบน ===== */
.f11-table thead th {
  font-weight: 700;          /* ตัวหนา */
  vertical-align: top;       /* ชิดด้านบนของช่อง */
  padding-top: 1mm;          /* ระยะจากขอบบนเล็กน้อย */
  padding-bottom: 0.5mm;     /* ลดด้านล่าง */
  line-height: 1.15;         /* บรรทัดชิดกันแบบฟอร์มราชการ */
}

/* ทำให้ชื่อบริเวณฉายรังสี ชิดขอบซ้ายของตาราง */
.f11-table tbody td.align-left {
  text-align: left !important;
  padding-left: 1mm !important;   /* ลดระยะจากขอบซ้าย */
}


/* คอลัมน์ตามฟอร์มราชการ */
.col-region {
  width: 45mm;
}

.col-small {
  width: 26mm;
}

.align-left {
  text-align: left;
  padding-left: 3mm;
}

/* พื้นที่ว่างก่อนลายเซ็น */
.bottom-space {
  height: 12mm;
}

/* ลายเซ็นชิดขวาเหมือนเดิม แต่ข้อความจัดชิดซ้ายภายในกล่อง */
.sign-block {
  margin-top: 6mm;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.sign-inner {
  width: 85mm;        /* กว้างกำหนดให้เหมือนช่องลายเซ็นในฟอร์มราชการ */
  text-align: left;   /* จัดบรรทัดให้ชิดซ้าย */
}

.sign-line {
  margin-bottom: 2mm;
  font-size: 16pt;
}

/* ให้วงเล็บ "(" ตรงกับตัว อ. ในคำว่า "ลงชื่อ" */
.sign-line-parenthesis {
  padding-left: 21mm;   /* ปรับตรงกับตำแหน่งตัว อ. */
}


/* ให้คำว่า "ตำแหน่ง" ตรงกับคำว่า "ลงชื่อ" (ตัว ล.) */
.sign-line-position {
  padding-left: 0mm;    /* ตรงกับบรรทัดแรก ไม่ต้องขยับเพิ่มเติม */
}


@media print {
  .f11-table th, .f11-table td { border: 1px solid #000 !important; }
}
</style>

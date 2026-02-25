<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นอย่างเดียว -->
  <div class="print-root">
    <!-- ปุ่ม Print (หายตอนสั่งพิมพ์) -->
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

    <!-- แผ่น A4 (เนื้อหายาวให้ต่อหลายหน้า) -->
    <div class="sheet-inner sheet-inner--flow">
        <!-- ===== หัวฟอร์ม ===== -->
        <div class="header-main align-with-table">
        <div class="title-main">
          แบบบันทึก F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวนด์ : B-mode QC Test
          </div>
        </div>


        <!-- ข้อมูลเครื่อง / ผู้ตรวจ (จาก jsonData.deviceForm) -->
        <div class="machine-block">
          <div class="machine-row">
            ยี่ห้อ <span class="underline long">{{ formData.deviceForm.machineName || '' }}</span>
            รุ่น <span class="underline long">{{ formData.deviceForm.model || '' }}</span>
            ผู้ตรวจสอบ <span class="underline long">{{ formData.deviceForm.tester || '' }}</span>
          <br>
          </div>
          <div class="machine-row">
            แผนก/กลุ่มงาน <span class="underline long">{{ formData.deviceForm.department || '' }}</span>
            อุณหภูมิห้อง <span class="underline long"></span>
            ความชื้นห้อง <span class="underline long"></span>
          <br>
          </div>
          <div class="machine-row">
            Probe ชนิด <span class="underline long">{{ formData.deviceForm.probeType || formData.deviceForm.probeOther || '' }}</span>
            ความถี่ <span class="underline long">{{ formData.deviceForm.frequencyMHz != null ? formData.deviceForm.frequencyMHz + ' MHz' : '' }}</span>
            Phantom <span class="underline long">{{ formData.deviceForm.phantom || '' }}</span>
          <br>
          </div>
          <div class="machine-row">
            Power <span class="underline long">{{ formData.deviceForm.power || '' }}</span>
            TGC <span class="underline long">{{ formData.deviceForm.tgc || '' }}</span>
            Gain <span class="underline long">{{ formData.deviceForm.gain || '' }}</span>
          </div>
        </div>

        <table class="qc-table">
  <thead>
  <tr class="force-left">
    <th>{{ formatDate(formData.deviceForm.testDate) || 'Test Date' }}</th>
    <th>baseline</th>
    <th>{{ formData.testData.testDates?.date1 ?? '' }}</th>
    <th>{{ formData.testData.testDates?.date2 ?? '' }}</th>
    <th>{{ formData.testData.testDates?.date3 ?? '' }}</th>
    <th>Action level</th>
    <th>Defect level</th>
  </tr>
</thead>
  <tbody>

<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    Image Uniformity
  </td>
</tr>


<tr>
  <td>Vertical band (y/n)</td>
  <td>{{ formData.testData.imageUniformity?.verticalBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.vertical1 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.vertical2 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.vertical3 ?? '' }}</td>

  <!-- คอลัมน์ 6 : Action level (ผสานแถว 3–4) -->
  <td rowspan="2">
    ≥ 4 dB or any change<br>
    from baseline
  </td>

  <!-- คอลัมน์ 7 : Defect level (ผสานแถว 3–4) -->
  <td rowspan="2">
    ≥ 6 dB or any change<br>
    from baseline
  </td>
</tr>


<tr>
  <td>Horizontal band (y/n)</td>
  <td>{{ formData.testData.imageUniformity?.horizontalBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.horizontal1 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.horizontal2 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.horizontal3 ?? '' }}</td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6 และ 7 -->
</tr>

<tr>
  <td>Artifacts (y/n)</td>
  <td>{{ formData.testData.imageUniformity?.artifactsBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.artifacts1 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.artifacts2 ?? '' }}</td>
  <td>{{ formData.testData.imageUniformity?.artifacts3 ?? '' }}</td>
  <td></td><td></td>
</tr>

<tr>
  <td><strong>Depth of Penetration (cm)</strong></td>
  <td>{{ formData.testData.depthPenetration?.baseline ?? '' }}</td>
  <td>{{ formData.testData.depthPenetration?.col1 ?? '' }}</td>
  <td>{{ formData.testData.depthPenetration?.col2 ?? '' }}</td>
  <td>{{ formData.testData.depthPenetration?.col3 ?? '' }}</td>

  <!-- คอลัมน์ที่ 6 : Action level -->
  <td>± 6 mm</td>

  <!-- คอลัมน์ที่ 7 : Defect level -->
  <td>± 10 mm</td>
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
  <strong>Vertical Distance Accuracy</strong>
  Actual distance {{ formData.testData.verticalDistance?.actualDistance ?? '………………………….' }} mm
</td>
</tr>


<tr>
  <td>(Pin 1-3) Measured (mm)</td>
  <td>{{ formData.testData.verticalDistance?.pin13Baseline ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin131 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin132 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin133 ?? '' }}</td>

  <!-- คอลัมน์ที่ 6 : Action level (rowspan 3) -->
  <td rowspan="3">± 1.5 mm or 1.5%</td>

  <!-- คอลัมน์ที่ 7 : Defect level (rowspan 3) -->
  <td rowspan="3">± 2.0 mm or 2%</td>
</tr>


<tr>
  <td>(Pin 3-5) Measured (mm)</td>
  <td>{{ formData.testData.verticalDistance?.pin35Baseline ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin351 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin352 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin353 ?? '' }}</td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Pin 6-8) Measured (mm)</td>
  <td>{{ formData.testData.verticalDistance?.pin68Baseline ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin681 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin682 ?? '' }}</td>
  <td>{{ formData.testData.verticalDistance?.pin683 ?? '' }}</td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Horizontal Distance Accuracy</strong>
    Actual distance {{ formData.testData.horizontalDistance?.actualDistance ?? '………………………….' }} mm
  </td>
</tr>


<tr>
  <td>(Near) Measured (mm)</td>
  <td>{{ formData.testData.horizontalDistance?.nearBaseline ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.near1 ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.near2 ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.near3 ?? '' }}</td>

  <!-- คอลัมน์ 6 -->
  <td rowspan="2">± 2.0 mm or 2%</td>

  <!-- คอลัมน์ 7 -->
  <td rowspan="2">± 3.0 mm or 3%</td>
</tr>

<tr>
  <td>(Far) Measured (mm)</td>
  <td>{{ formData.testData.horizontalDistance?.farBaseline ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.far1 ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.far2 ?? '' }}</td>
  <td>{{ formData.testData.horizontalDistance?.far3 ?? '' }}</td>
</tr>



<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Lateral Resolution</strong>
    Pin depth: Near={{ formData.testData.lateralResolution?.pinDepthNear ?? '………..…' }} mm, Mid={{ formData.testData.lateralResolution?.pinDepthMid ?? '………..……' }} mm, Far={{ formData.testData.lateralResolution?.pinDepthFar ?? '…..………' }} mm
  </td>
</tr>

<tr>
  <td>(Near) Measured (mm)</td>
  <td>{{ formData.testData.lateralResolution?.nearBaseline ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.near1 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.near2 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.near3 ?? '' }}</td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 15–17 -->
  <td colspan="2" rowspan="3">
    width &lt;1.5 mm, freq ≥ 5 MHz<br>
    width &lt;3 mm, 3.5 ≤ freq &lt; 5 MHz<br>
    width ≤4 mm, freq &lt; 3.5 MHz
  </td>
</tr>


<tr>
  <td>(Mid) Measured (mm)</td>
  <td>{{ formData.testData.lateralResolution?.midBaseline ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.mid1 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.mid2 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.mid3 ?? '' }}</td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Measured (mm)</td>
  <td>{{ formData.testData.lateralResolution?.farBaseline ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.far1 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.far2 ?? '' }}</td>
  <td>{{ formData.testData.lateralResolution?.far3 ?? '' }}</td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>

<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    Axial Resolution
  </td>
</tr>

<tr>
  <td>(Near) Measured (mm)</td>
  <td>{{ formData.testData.axialResolution?.nearBaseline ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.near1 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.near2 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.near3 ?? '' }}</td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 19–21 -->
  <td colspan="2" rowspan="3">
    <strong>Action level:</strong> 1 mm<br>
    or 2 mm if freq &lt; 4 MHz<br>
    <strong>Defect level &gt;1 mm</strong>
  </td>
</tr>


<tr>
  <td>(Mid) Measured (mm)</td>
  <td>{{ formData.testData.axialResolution?.midBaseline ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.mid1 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.mid2 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.mid3 ?? '' }}</td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Measured (mm)</td>
  <td>{{ formData.testData.axialResolution?.farBaseline ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.far1 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.far2 ?? '' }}</td>
  <td>{{ formData.testData.axialResolution?.far3 ?? '' }}</td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Image Geometry (Cyst Imaging)</strong>
    Actual diameter {{ formData.testData.imageGeometry?.actualDiameter ?? '……………….' }} mm
  </td>
</tr>

<tr>
  <td>(Near) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td>{{ formData.testData.imageGeometry?.nearCystBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.nearCyst1 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.nearCyst2 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.nearCyst3 ?? '' }}</td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 23–25 -->
  <td colspan="2" rowspan="3">
    Major distortion or any change from baseline<br>
    Height/Width ≥20%
  </td>
</tr>


<tr>
  <td>(Mid) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td>{{ formData.testData.imageGeometry?.midCystBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.midCyst1 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.midCyst2 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.midCyst3 ?? '' }}</td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td>{{ formData.testData.imageGeometry?.farCystBaseline ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.farCyst1 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.farCyst2 ?? '' }}</td>
  <td>{{ formData.testData.imageGeometry?.farCyst3 ?? '' }}</td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    No. of Gray Scale Objects
  </td>
</tr>

<tr>
  <td>Dead zone (mm)</td>
  <td>{{ formData.testData.grayScale?.deadZone ?? '' }}</td>
  <td>{{ formData.testData.grayScale?.deadZone1 ?? '' }}</td>
  <td>{{ formData.testData.grayScale?.deadZone2 ?? '' }}</td>
  <td>{{ formData.testData.grayScale?.deadZone3 ?? '' }}</td>

  <!-- ผสานคอลัมน์ที่ 6 และ 7 -->
  <td colspan="2">
    7 mm; freq 3 MHz<br>
    5 mm; 3 MHz &lt; freq &lt; 7 MHz<br>
    3 mm; freq 7 MHz
  </td>
</tr>


</tbody>
</table>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// โครงสร้าง jsonData ตัวอย่าง: deviceForm, testData, summary
const formData = ref({
  deviceForm: {},
  testData: { testDates: {}, imageUniformity: {}, depthPenetration: {}, verticalDistance: {}, horizontalDistance: {}, lateralResolution: {}, axialResolution: {}, imageGeometry: {}, grayScale: {} },
  summary: {}
})

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

function applyRecordData (data) {
  if (!data) return
  const raw = data.jsonData
  if (raw === undefined || raw === null) return
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (parsed.deviceForm) formData.value.deviceForm = parsed.deviceForm
    if (parsed.testData) formData.value.testData = { ...formData.value.testData, ...parsed.testData }
    if (parsed.summary) formData.value.summary = parsed.summary
  } catch (_) {}
}

onMounted(async () => {
  const id = route.query.id || route.params.id
  const stateRecord = history.state?.record
  if (stateRecord && (stateRecord.formType === 'F13' || stateRecord.jsonData)) {
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

/* ฟอนต์ทั้งหน้า = 11pt */
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  font-size: 16pt;
  font-weight: 400;
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

/* << ตัวเดียวที่ใหญ่กว่า = 13pt >> */
.title-main {
  font-weight: 700;
  font-size: 18pt;   /* ยกเว้นหัวข้อนี้ */
  margin-bottom: 2mm;
}

/* ที่เหลือกลับมาใช้ 11pt (มาจาก * อยู่แล้ว) */
.title-sub {
  /* ไม่ต้องกำหนด font-size เพิ่ม */
}

/* ข้อมูลเครื่อง */
.machine-block {
  margin-bottom: 6mm;
}

.machine-row {
  margin-bottom: 2mm;
}

.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
  display: inline-block;
}
.underline.short {
  min-width: 25mm;
}
.underline.long {
  min-width: 35mm;
}
.qc-table thead th {
  font-weight: 700;
}


/* ตาราง QC */
.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 6mm;
}

.qc-table th,
.qc-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1.5mm;
  vertical-align: top;
}

.qc-table td:first-child,
.qc-table th:first-child {
  width: 50mm !important;
  max-width: 50mm !important;
  min-width: 50mm !important;
}


.col-test {
  width: 35%;
}
.col-baseline {
  width: 23%;
}
.col-action {
  width: 21%;
}
.col-defect {
  width: 21%;
}

.align-left {
  text-align: left;
}

.group-row td {
  background: #f3f4f6;
  font-weight: 700;
}

.group-title {
  font-weight: 700;
}

/* หมายเหตุ */
.note-block {
  margin-bottom: 10mm;
}

.note-line {
  border-bottom: 0.4pt solid #000;
  height: 6mm;
  margin-top: 1mm;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 6mm;
}

.signature-line {
  margin-bottom: 3mm;
}

/* เพิ่มความกว้าง Action level */
.qc-table th:nth-child(6),
.qc-table td:nth-child(6) {
  width: 28mm !important;
}

/* เพิ่มความกว้าง Defect level */
.qc-table th:nth-child(7),
.qc-table td:nth-child(7) {
  width: 28mm !important;
}
/* บังคับให้ตัวอักษรทุกตัวในตารางมีขนาด 14pt */
.qc-table,
.qc-table th,
.qc-table td {
  font-size: 14pt !important;
}

/* ค่าเริ่มต้น: คอลัมน์ที่ 1 ชิดขอบขวาทุกแถว */
.qc-table tbody td:first-child {
  text-align: right;
  padding-right: 2mm;
}

/* ยกเว้นแถวหัวข้อ / group title ให้ชิดซ้าย */
.qc-table tr.no-right-align td:first-child {
  text-align: left !important;
  padding-right: 1.5mm;
}
/* บังคับชิดซ้าย เฉพาะแถวที่กำหนด */
.qc-table tr.force-left td:first-child,
.qc-table tr.force-left th {
  text-align: left !important;
  padding-left: 1.5mm;
}


@media print {
  .qc-table th, .qc-table td { border: 1px solid #000 !important; }
  /* ให้ตารางและเนื้อหาสามารถแบ่งข้ามหน้า A4 ได้ */
  .qc-table { page-break-inside: auto; }
  .sheet-inner--flow { overflow: visible !important; }
}
</style>

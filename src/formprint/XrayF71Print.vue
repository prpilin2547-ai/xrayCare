<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + แผ่น A4 -->
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

    <!-- แผ่น A4 หน้า 1: F7-1 -->
    <div class="sheet-inner">
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F7-1 : การทดสอบ Collimator and Beam Alignment
          </div>

          <div class="title-sub">
            <span class="bold-label">ความถี่ :</span>
            <span class="normal-text">{{ header.frequency }}</span>
          </div>


          <!-- เครื่องเอกซเรย์ยี่ห้อ / รุ่น อยู่นอกตาราง -->
          <div class="title-sub machine-row">
            <span class="bold-label">เครื่องเอกซเรย์ยี่ห้อ :</span>
            <span class="underline brand-line">{{ f71.machineName || header.machineBrand }}</span>
              รุ่น
            <span class="underline model-line">{{ f71.machineModel || header.machineModel }}</span>
          </div>
        </div>

       <table class="main-table">
  <colgroup>
    <col class="col-text" />
    <col class="col-cm" />
    <col class="col-pass" />
    <col class="col-fail" />
    <col class="col-note" />
  </colgroup>

  <tr>
    <td class="label-cell text-left" colspan="5">
      วัน/เดือน/ปี ที่ทดสอบ : <span class="underline short">{{ f71.testDate || header.testDate }}</span>
    </td>
  </tr>
  <tr>
    <td class="label-cell text-left" colspan="5">
      ผู้ทดสอบ : <span class="underline medium">{{ f71.tester || header.tester }}</span>
    </td>
  </tr>
  <tr>
    <td colspan="5" class="value-cell text-left">
      <span :class="{ 'option-checked': f71.tubeSize === 'small' }">{{ f71.tubeSize === 'small' ? '●' : '○' }}</span> หลอดไส้เล็ก<br />
      <span :class="{ 'option-checked': f71.tubeSize === 'large' }">{{ f71.tubeSize === 'large' ? '●' : '○' }}</span> หลอดไส้ใหญ่
    </td>
  </tr>
  <tr>
    <td class="align-left" colspan="5">
      <span :class="{ 'option-checked': f71.testMethod === 'tool' }">{{ f71.testMethod === 'tool' ? '●' : '○' }}</span> ทดสอบโดย Collimator / Beam alignment test tool<br />
      <span :class="{ 'option-checked': f71.testMethod === 'coins' }">{{ f71.testMethod === 'coins' ? '●' : '○' }}</span> ทดสอบโดย Coins for x-ray to light-beam alignment test
    </td>
  </tr>
  <tr>
    <td class="align-left note-row" colspan="5">
      <strong class="note-title">
        ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 1 cm หรือ 1% ที่ SID 100 cm)
      </strong><br />
      <span class="note-desc">
        + หมายถึงลำรังสีมีขนาดใหญ่กว่าขอบเขตจริง 
        - หมายถึงลำรังสีมีขนาดเล็กกว่าขอบเขตจริง
      </span>
    </td>
  </tr>
  <tr class="sub-header">
    <td class="center-item nowrap-header" colspan="2">ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ</td>
    <td>Pass</td>
    <td>Fail</td>
    <td>Note</td>
  </tr>
  <tr v-for="row in f71.lightMismatch" :key="'f71-lm-' + row.id">
    <td class="center-item">{{ row.label }}</td>
    <td class="cm-cell">{{ row.value1 ? row.value1 + ' cm' : 'cm' }}</td>
    <td class="pass-fail-cell">{{ row.pass ? '✓' : '' }}</td>
    <td class="pass-fail-cell">{{ row.fail ? '✓' : '' }}</td>
    <td class="note-cell">{{ row.note || '' }}</td>
  </tr>
  <tr>
    <td colspan="5">&nbsp;</td>
  </tr>
  <tr class="section-row">
    <td class="section-title" colspan="5">
      Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
    </td>
  </tr>
  <tr class="sub-header">
    <td class="col-beam-header" colspan="2">Beam Alignment</td>
    <td>Pass</td>
    <td>Fail</td>
    <td>Note</td>
  </tr>
  <tr v-for="(row, idx) in f71.beamAlignment" :key="'f71-ba-' + row.id">
    <td class="align-left" colspan="2">○ {{ row.label }}</td>
    <td class="pass-fail-cell">{{ row.pass ? '✓' : '' }}</td>
    <td class="pass-fail-cell">{{ row.fail ? '✓' : '' }}</td>
    <td class="note-cell">{{ row.note || '' }}</td>
  </tr>
</table>
    </div>

    <!-- แผ่น A4 หน้า 2: F7-2 (ถ้าเนื้อหาเกินหน้าก็ต่อหน้าใหม่ได้) -->
    <div class="sheet-inner sheet-inner--flow f72-print-sheet">
          <div class="header-main">
            <div class="title-main">
              แบบบันทึก F7-2 : การทดสอบ Collimator and Beam Alignment สำหรับ กรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)
            </div>
            <div class="title-sub">
              <span class="bold-label">ความถี่ :</span>
              <span class="normal-text">{{ header.frequency }}</span>
            </div>
            <div class="title-sub machine-row">
              <span class="bold-label">เครื่องเอกซเรย์ยี่ห้อ :</span>
              <span class="underline brand-line">{{ f72.machineName || header.machineBrand }}</span>
              รุ่น
              <span class="underline model-line">{{ f72.machineModel || header.machineModel }}</span>
            </div>
          </div>
          <table class="main-table">
            <colgroup>
              <col class="col-text" />
              <col class="col-cm" />
              <col class="col-pass" />
              <col class="col-fail" />
              <col class="col-note" />
            </colgroup>
            <tr>
              <td class="label-cell text-left" colspan="5">วัน/เดือน/ปี ที่ทดสอบ : <span class="underline short">{{ f72.testDate || header.testDate }}</span></td>
            </tr>
            <tr>
              <td class="label-cell text-left" colspan="5">ผู้ทดสอบ : <span class="underline medium">{{ f72.tester || header.tester }}</span></td>
            </tr>
            <tr>
              <td colspan="5" class="value-cell text-left">
                <span :class="{ 'option-checked': f72.tubeSize === 'small' }">{{ f72.tubeSize === 'small' ? '●' : '○' }}</span> หลอดไส้เล็ก<br />
                <span :class="{ 'option-checked': f72.tubeSize === 'large' }">{{ f72.tubeSize === 'large' ? '●' : '○' }}</span> หลอดไส้ใหญ่
              </td>
            </tr>
            <tr>
              <td class="align-left" colspan="5">
                <span :class="{ 'option-checked': f72.testMethod === 'tool' }">{{ f72.testMethod === 'tool' ? '●' : '○' }}</span> ทดสอบโดย Collimator / Beam alignment test tool<br />
                <span :class="{ 'option-checked': f72.testMethod === 'coins' }">{{ f72.testMethod === 'coins' ? '●' : '○' }}</span> ทดสอบโดย Coins for x-ray to light-beam alignment test
              </td>
            </tr>
            <tr>
              <td class="align-left note-row" colspan="5">
                <strong class="note-title">ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 2 cm หรือ 2% ที่ SID 100 cm)</strong><br />
                <span class="note-desc">+ หมายถึงลำรังสีมีขนาดใหญ่กว่าขอบเขตจริง - หมายถึงลำรังสีมีขนาดเล็กกว่าขอบเขตจริง</span>
              </td>
            </tr>
            <tr class="sub-header">
              <td class="center-item nowrap-header" colspan="2">ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ</td>
              <td>Pass</td>
              <td>Fail</td>
              <td>Note</td>
            </tr>
            <tr v-for="row in f72.lightMismatch" :key="'f72-lm-' + row.id">
              <td class="center-item">{{ row.label }}</td>
              <td class="cm-cell">{{ row.value1 ? row.value1 + ' cm' : 'cm' }}</td>
              <td class="pass-fail-cell">{{ row.pass ? '✓' : '' }}</td>
              <td class="pass-fail-cell">{{ row.fail ? '✓' : '' }}</td>
              <td class="note-cell">{{ row.note || '' }}</td>
            </tr>
            <tr class="f72-gap-row"><td colspan="5" class="f72-gap-cell"></td></tr>
            <tr class="section-row">
              <td class="section-title" colspan="5">Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา</td>
            </tr>
            <tr class="sub-header">
              <td class="col-beam-header" colspan="2">Beam Alignment</td>
              <td>Pass</td>
              <td>Fail</td>
              <td>Note</td>
            </tr>
            <tr v-for="row in f72.beamAlignment" :key="'f72-ba-' + row.id">
              <td class="align-left" colspan="2">○ {{ row.label }}</td>
              <td class="pass-fail-cell">{{ row.pass ? '✓' : '' }}</td>
              <td class="pass-fail-cell">{{ row.fail ? '✓' : '' }}</td>
              <td class="note-cell">{{ row.note || '' }}</td>
            </tr>
          </table>
    </div>

    <!-- แผ่น A4 หน้า 3: F8-1 -->
    <div class="sheet-inner">
          <div class="header-main">
            <div class="title-main">แบบบันทึก F8-1 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR</div>
            <div class="title-sub">
              <span class="bold-label">ความถี่ :</span>
              <span class="normal-text">{{ header.frequency }}</span>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="f81-table">
              <thead>
                <tr>
                  <th rowspan="3" class="col-ip">IP no.</th>
                  <th rowspan="3" class="col-ip">IP size</th>
                  <th rowspan="3" class="col-ip">ID</th>
                  <th rowspan="3" class="col-ip">Type</th>
                  <th rowspan="3" class="col-ip">EI / S</th>
                  <th colspan="8" class="col-roi">ROI 80%</th>
                  <th colspan="2" class="col-result-head">การแปรผล (P/F)</th>
                </tr>
                <tr>
                  <th colspan="4" class="col-roi-sub">PV</th>
                  <th colspan="4" class="col-roi-sub">PVSD</th>
                  <th class="col-result">PV</th>
                  <th class="col-result">PVSD</th>
                </tr>
                <tr>
                  <th>1</th><th>2</th><th>3</th><th>mean</th>
                  <th>4</th><th>5</th><th>6</th><th>mean</th>
                  <th>............</th>
                  <th>............</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in f81Rows" :key="'f81-' + index">
                  <td>{{ row.ipNo }}</td>
                  <td>{{ row.ipSize }}</td>
                  <td>{{ row.readerId }}</td>
                  <td>{{ row.type }}</td>
                  <td>{{ row.eiOrS }}</td>
                  <td>{{ row.pv[0] || '' }}</td>
                  <td>{{ row.pv[1] || '' }}</td>
                  <td>{{ row.pv[2] || '' }}</td>
                  <td>{{ row.pvMean || '' }}</td>
                  <td>{{ row.pvsd[0] || '' }}</td>
                  <td>{{ row.pvsd[1] || '' }}</td>
                  <td>{{ row.pvsd[2] || '' }}</td>
                  <td>{{ row.pvsdMean || '' }}</td>
                  <td>{{ row.pvResult || '' }}</td>
                  <td>{{ row.pvsdResult || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="signature-block">
            <div class="sig-row">ลงชื่อ.............................................................ผู้ทดสอบ</div>
            <div class="sig-row">(..............................................................................)</div>
            <div class="sig-row">ตำแหน่ง.......................................................................</div>
          </div>
    </div>

    <!-- แผ่น A4 หน้า 4: F8-2 -->
    <div class="sheet-inner">
          <div class="header-main">
            <div class="title-main">{{ f82FormTitle }}</div>
            <div class="title-sub">
              <span class="bold-label">ความถี่ :</span>
              <span class="normal-text">{{ header.frequency }}</span>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="f82-table">
              <thead>
                <tr>
                  <th class="col-fpd-no">FPD no.</th>
                  <th class="col-fpd-size">FPD size</th>
                  <th class="col-id">ID</th>
                  <th class="col-ei">EI</th>
                  <th class="col-ddi">DDI</th>
                  <th class="col-pixel">Pixel<br />mean</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in f82RowsForPrint" :key="'f82-' + index">
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
          <div class="signature-block">
            <div class="sig-line">ลงชื่อ............................................................ผู้ทดสอบ</div>
            <div class="sig-line">(..............................................................................)</div>
            <div class="sig-line">ตำแหน่ง.....................................................................</div>
          </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Header + ข้อมูลทั่วไป (ใช้ร่วม F7-1, F7-2)
const header = ref({
  frequency: 'ทุก 6 เดือน',
  machineBrand: '',
  machineModel: '',
  roomNo: '',
  testDate: '',
  tester: ''
})

// โครง F7 เริ่มต้น (lightMismatch: anode, cathode, top, bottom | beamAlignment: <1.5°, 1.5-3°, ≥3°)
const defaultLightMismatch = () => [
  { id: 'anode', label: 'ด้านแอโนด', value1: '', pass: false, fail: false, note: '' },
  { id: 'cathode', label: 'ด้านแคโทด', value1: '', pass: false, fail: false, note: '' },
  { id: 'top', label: 'ด้านบน', value1: '', pass: false, fail: false, note: '' },
  { id: 'bottom', label: 'ด้านล่าง', value1: '', pass: false, fail: false, note: '' }
]
const defaultBeamAlignment = () => [
  { id: 'lt1_5', label: '< 1.5°', pass: false, fail: false, note: '' },
  { id: 'btw', label: '1.5° < X < 3°', pass: false, fail: false, note: '' },
  { id: 'ge3', label: '≥ 3°', pass: false, fail: false, note: '' }
]
const defaultF7 = () => ({
  machineName: '',
  machineModel: '',
  testDate: '',
  tester: '',
  tubeSize: 'small',
  testMethod: 'tool',
  lightMismatch: defaultLightMismatch(),
  beamAlignment: defaultBeamAlignment(),
  remark: ''
})
const f71 = ref(defaultF7())
const f72 = ref(defaultF7())

// F8-1: แถวตาราง CR (Dark Noise) — แมปจากฟอร์ม F8CRDarkNoiseForm (imageId, eis, pv1–pv3, pvsd4–6, resultPv/resultPvsd)
function mapF81Row (r) {
  if (!r || typeof r !== 'object') return defaultF81Row()
  return {
    ipNo: r.ipNo ?? '',
    ipSize: r.ipSize ?? '',
    readerId: r.readerId ?? r.imageId ?? r.id ?? '',
    type: r.type ?? '',
    eiOrS: r.eiOrS ?? r.eis ?? r.ei ?? '',
    pv: Array.isArray(r.pv) ? r.pv : [r.pv1 ?? '', r.pv2 ?? '', r.pv3 ?? ''],
    pvMean: r.pvMean ?? '',
    pvsd: Array.isArray(r.pvsd) ? r.pvsd : [r.pvsd4 ?? '', r.pvsd5 ?? '', r.pvsd6 ?? ''],
    pvsdMean: r.pvsdMean ?? '',
    pvResult: r.pvResult ?? r.resultPv ?? '',
    pvsdResult: r.pvsdResult ?? r.resultPvsd ?? ''
  }
}
const defaultF81Row = () => ({
  ipNo: '', ipSize: '', readerId: '', type: '', eiOrS: '',
  pv: ['', '', ''], pvMean: '', pvsd: ['', '', ''], pvsdMean: '', pvResult: '', pvsdResult: ''
})
const f81Rows = ref([
  defaultF81Row(), defaultF81Row(), defaultF81Row(), defaultF81Row(), defaultF81Row()
])

// F8-2: หัวข้อฟอร์ม + แถวตาราง DR (Dark Noise)
const f82FormTitle = ref('แบบบันทึก F8-2 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR')
const f82Rows = ref([])

const f82RowsForPrint = computed(() => {
  const base = f82Rows.value || []
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
    out.push({ fpdNo: '', fpdSize: '', id: '', ei: '', ddi: '', pixelMean: '' })
  }
  return out
})

function handlePrint () {
  window.print()
}

import { apiFetch } from '../api/client'

function getLoggedInUser() {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    return stored.username || ''
  } catch (_) { return '' }
}

function resolveTester(saved) {
  if (saved && saved !== 'Demo User') return saved
  return getLoggedInUser() || saved || ''
}

function mapJsonToF7 (obj) {
  if (!obj || typeof obj !== 'object') return defaultF7()
  const lm = Array.isArray(obj.lightMismatch) && obj.lightMismatch.length
    ? obj.lightMismatch
    : defaultLightMismatch()
  const orderLm = ['anode', 'cathode', 'top', 'bottom']
  const sortedLm = orderLm.map(id => lm.find(m => m.id === id) || { id, label: '', value1: '', pass: false, fail: false, note: '' })
  const ba = Array.isArray(obj.beamAlignment) && obj.beamAlignment.length
    ? obj.beamAlignment
    : defaultBeamAlignment()
  const orderBa = ['lt1_5', 'btw', 'ge3']
  const sortedBa = orderBa.map(id => ba.find(b => b.id === id) || { id, label: '', pass: false, fail: false, note: '' })
  return {
    machineName: obj.machineName ?? '',
    machineModel: obj.machineModel ?? '',
    testDate: obj.testDate ?? '',
    tester: obj.tester ?? '',
    tubeSize: obj.tubeSize === 'large' ? 'large' : 'small',
    testMethod: obj.testMethod === 'coins' ? 'coins' : 'tool',
    lightMismatch: sortedLm,
    beamAlignment: sortedBa,
    remark: obj.remark ?? ''
  }
}

onMounted(async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  try {
    const res = await apiFetch(`/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    header.value.testDate = data.checkDate || ''
    header.value.tester = resolveTester(data.tester)
    header.value.machineBrand = data.machineName || ''
    const machineName = data.machineName || ''
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData)
        if (parsed.frequency !== undefined) header.value.frequency = parsed.frequency
        if (parsed.machineBrand !== undefined) header.value.machineBrand = parsed.machineBrand
        if (parsed.machineModel !== undefined) header.value.machineModel = parsed.machineModel
        if (parsed.roomNo !== undefined) header.value.roomNo = parsed.roomNo
        if (parsed.testDate !== undefined) header.value.testDate = parsed.testDate
        if (parsed.tester !== undefined) header.value.tester = resolveTester(parsed.tester)
        // F7_1 / F7_2
        if (parsed.F7_1) f71.value = mapJsonToF7(parsed.F7_1)
        if (parsed.F7_2) f72.value = mapJsonToF7(parsed.F7_2)

        // resolve tester ใน f71/f72 ให้ไม่เป็น "Demo User"
        f71.value.tester = resolveTester(f71.value.tester)
        f72.value.tester = resolveTester(f72.value.tester)

        // ดึง model จาก API machines
        let machineModel = ''
        try {
          const mRes = await apiFetch('/GetAllMachines')
          if (mRes.ok) {
            const machines = await mRes.json()
            const nameToMatch = (machineName || f71.value.machineName || header.value.machineBrand || '').trim()
            if (nameToMatch) {
              const found = machines.find(mx => (mx.machineName || '').trim() === nameToMatch)
              if (found) machineModel = found.model || ''
            }
          }
        } catch (_) {}

        // Header จาก F7_1 ถ้ายังไม่มี
        if (f71.value.machineName) header.value.machineBrand = f71.value.machineName
        header.value.machineModel = f71.value.machineModel || machineModel || header.value.machineModel
        if (f71.value.testDate) header.value.testDate = f71.value.testDate
        if (f71.value.tester) header.value.tester = f71.value.tester

        // เติม machineModel ให้ f71/f72 ด้วย (ใช้ค่าจาก API machines)
        if (!f71.value.machineModel) f71.value.machineModel = machineModel
        if (!f72.value.machineModel) f72.value.machineModel = machineModel
        // F8-1 (รองรับ F8_1.rows, F8_1 เป็น array, F8_1 เป็น object เดี่ยว จากฟอร์ม F8CRDarkNoiseForm)
        let rawF81 = []
        if (parsed.F8_1 != null) {
          if (Array.isArray(parsed.F8_1.rows)) rawF81 = parsed.F8_1.rows
          else if (Array.isArray(parsed.F8_1)) rawF81 = parsed.F8_1
          else if (typeof parsed.F8_1 === 'object' && (parsed.F8_1.ipNo != null || parsed.F8_1.imageId != null || parsed.F8_1.ipNo === '')) rawF81 = [parsed.F8_1]
        }
        if (rawF81.length) {
          f81Rows.value = rawF81.map(mapF81Row)
          while (f81Rows.value.length < 5) f81Rows.value.push(defaultF81Row())
        } else if (Array.isArray(parsed.f81Rows)) {
          f81Rows.value = parsed.f81Rows.map(mapF81Row)
          while (f81Rows.value.length < 5) f81Rows.value.push(defaultF81Row())
        } else if (Array.isArray(parsed.rows) && parsed.rows.length && ('ipNo' in (parsed.rows[0] || {}) || 'imageId' in (parsed.rows[0] || {}))) {
          f81Rows.value = parsed.rows.map(mapF81Row)
          while (f81Rows.value.length < 5) f81Rows.value.push(defaultF81Row())
        }
        // F8-2
        if (parsed.F8_2) {
          if (parsed.F8_2.basicInfo?.testerName) header.value.tester = resolveTester(parsed.F8_2.basicInfo.testerName)
          if (parsed.F8_2.basicInfo?.testDate) header.value.testDate = parsed.F8_2.basicInfo.testDate
          if (Array.isArray(parsed.F8_2.rows)) {
            f82Rows.value = parsed.F8_2.rows.map(r => {
              let size = r.fpdSize ?? ''
              if (size === 'other') {
                size = r.fpdSizeOther ? `อื่นๆ (${r.fpdSizeOther})` : 'อื่นๆ'
              }
              return {
                fpdNo: r.fpdNo ?? '',
                fpdSize: size,
                id: r.imageId ?? r.id ?? '',
                ei: r.ei != null ? String(r.ei) : '',
                ddi: r.ddi != null ? String(r.ddi) : '',
                pixelMean: r.pixelMean != null ? String(r.pixelMean) : ''
              }
            })
          }
        }
        if (parsed.formTitle !== undefined) f82FormTitle.value = parsed.formTitle
        if (Array.isArray(parsed.f82Rows)) f82Rows.value = parsed.f82Rows
        else if (Array.isArray(parsed.rows) && parsed.rows.length && 'fpdNo' in (parsed.rows[0] || {})) f82Rows.value = parsed.rows
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

/* ฟอนต์พื้นฐานทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt !important;   /* ✅ ถูกต้อง */
  font-weight: 400;
}

/* Header */
.header-main {
  text-align: left;
  margin-bottom: 6mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt !important;
  text-align: left;
  margin-bottom: 2mm;
}

.title-sub {
  margin-bottom: 2mm;
}

.machine-row {
  margin-top: 2mm;
}

/* เส้นกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short { min-width: 25mm; }
.medium { min-width: 35mm; }
.long { min-width: 60mm; }

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 4mm;
  margin-bottom: 6mm;
}

/* กำหนดสัดส่วนความกว้างแต่ละคอลัมน์
   - Fail แคบลง
   - Note กว้างขึ้น และอยู่ในตาราง */
.col-text { width: 15%; }  /* ข้อความหลัก */
.col-cm   { width: 20%; }  /* cm */
.col-pass { width: 10%; }  /* Pass */
.col-fail { width: 10%; }   /* Fail (ลดขนาดลง) */
.col-note { width: 25%; }  /* Note (กว้างขึ้น อยู่ในกรอบตาราง) */


.main-table td,
.main-table th {
  border: 0.4pt solid #000;
  padding: 1.5mm 2mm;
  vertical-align: middle;
  text-align: center;
  font-weight: 700;
}

/* ข้อความคำอธิบาย / label เป็นตัวบาง */
.label-cell {
  font-weight: 400;
}
/* ทำให้หัวข้อประโยคนี้หนามากขึ้น */
.note-row strong {
  font-weight: 700 !important;
  display: inline-block;
  margin-bottom: 1mm;
}

/* เพิ่มความสูงช่อง (บนล่าง) ของบรรทัดนี้ */
.note-row {
  padding-top: 3mm !important;
  padding-bottom: 3mm !important;
  line-height: 1.45;
}

.bold-label {
  font-weight: 700;
}

.normal-text {
  font-weight: 400;
}

/* แถวหัว section (บรรทัด Beam Alignment ต้องมีความเบี่ยงเบน...) */
/* ทำให้หัวข้อ section ชิดซ้ายของเซลล์จริงๆ */
.section-title {
  text-align: left !important;
  padding-left: 1mm !important;   /* ถ้าต้องการชิดสุดเปลี่ยนเป็น 0 */
  font-weight: 700;
}

/* ทำให้หัวคอลัมน์ Beam Alignment อยู่กลาง */
.col-beam-header {
  text-align: center !important;
  vertical-align: middle !important;
}

/* ทำให้ข้อความชิดขอบซ้ายของตารางมากขึ้น (ลด padding ซ้าย) */
.section-row .section-title {
  padding-left: 0.5mm !important; /* หรือ 0mm ถ้าอยากชิดสุดเลย */
}

/* ลบสีพื้นหัวตาราง */
.sub-header td {
  font-weight: 700;
  /* ไม่มี background แล้ว */
}

/* จัดข้อความซ้าย */
.text-left,
.align-left,
.left-cell {
  text-align: left !important;
  vertical-align: top !important;
}


/* ลายเซ็นชิดขวาเท่าขอบตาราง */
.sign-block {
  width: 100%;
  text-align: right;
  margin-top: 8mm;
}

/* ประโยคหัวข้อ = ตัวหนา */
.note-title {
  font-weight: 700 !important;
}

/* ประโยคอธิบาย + / - = ตัวบาง */
.note-desc {
  font-weight: 400 !important;
}
/* บังคับให้หัวข้อช่องนี้ไม่ตัดบรรทัด (อยู่บรรทัดเดียว) */
.nowrap-header {
  white-space: nowrap;
}
/* 1) ทำให้ข้อความหัวข้อและแถวด้านแอโนด/แคโทด/บน/ล่าง อยู่กึ่งกลางช่อง */
.center-item {
  text-align: center !important;
  vertical-align: middle !important;
  font-weight: 700 !important; /* คงความหนาของข้อความตามเดิม */
}

/* 2) ทำให้คำว่า cm อยู่ขวาและเป็นตัวบาง */
.cm-cell {
  text-align: right !important;
  font-weight: 400 !important;
  padding-right: 2mm !important;
}

.pass-fail-cell {
  text-align: center !important;
  font-weight: 400 !important;
}

.note-cell {
  text-align: left !important;
  font-weight: 400 !important;
}

.brand-line {
  min-width: 55mm;   /* ยี่ห้อ → ยาวขึ้น */
}

.model-line {
  min-width: 45mm;   /* รุ่น → ยาวขึ้น */
}

/* ทำให้คำว่า Note (ทั้ง 2 จุด) เป็นตัวบางและเอียงเท่านั้น */
.main-table th:last-child {
  font-weight: 400 !important;
  font-style: italic !important;
}

@media print {
  .main-table th, .main-table td { border: 1px solid #000 !important; }
}

/* F7-2: อนุญาตให้เนื้อหาเกิน 1 หน้าแล้วต่อหน้าใหม่ได้ มีขนาดเหมาะสม */
.sheet-inner--flow {
  height: auto !important;
  min-height: 277mm;
  max-height: none !important;
  overflow: visible !important;
  aspect-ratio: auto;
}
/* ตารางใน F7-2 ให้แบ่งหน้าพิมพ์ได้ และไม่ตัดแถว */
.sheet-inner--flow .main-table {
  page-break-inside: auto;
}
.sheet-inner--flow .main-table tr {
  page-break-inside: avoid;
  page-break-after: auto;
}
@media print {
  .sheet-inner--flow {
    height: auto !important;
    min-height: 277mm !important;
    max-height: none !important;
    overflow: visible !important;
    page-break-after: always;
    page-break-inside: auto;
  }
  .sheet-inner--flow .main-table tr {
    page-break-inside: avoid;
  }
}

/* F7-2 (DR+Bucky): ขยายแนวตั้งให้ใช้พื้นที่หน้า A4 มากขึ้น — ยังคงหนึ่งหน้าต่อฟอร์ม */
.f72-print-sheet .header-main {
  margin-bottom: 5mm;
}
.f72-print-sheet .title-main {
  font-size: 18pt !important;
  line-height: 1.28;
  margin-bottom: 2mm;
}
.f72-print-sheet .title-sub {
  margin-bottom: 1.8mm;
  line-height: 1.32;
}
.f72-print-sheet .machine-row {
  margin-top: 2mm;
}
.f72-print-sheet .main-table {
  margin-top: 3.5mm;
  margin-bottom: 0;
}
.f72-print-sheet .main-table td,
.f72-print-sheet .main-table th {
  padding: 2.6mm 2mm !important;
  font-size: 16pt !important;
  line-height: 1.38 !important;
}
.f72-print-sheet .note-row {
  padding-top: 4mm !important;
  padding-bottom: 4mm !important;
  line-height: 1.42;
}
.f72-print-sheet .note-row strong {
  margin-bottom: 1mm;
}
.f72-print-sheet .f72-gap-cell {
  padding: 2mm 2mm !important;
  line-height: 1.2 !important;
  font-size: 8pt !important;
}
.f72-print-sheet .section-row .section-title {
  padding-top: 2.2mm !important;
  padding-bottom: 2.2mm !important;
  line-height: 1.3 !important;
}
.f72-print-sheet .sub-header td {
  padding-top: 2.4mm !important;
  padding-bottom: 2.4mm !important;
}
.f72-print-sheet .align-left {
  vertical-align: middle !important;
}

@media print {
  .f72-print-sheet .header-main {
    margin-bottom: 4mm !important;
  }
  .f72-print-sheet .title-main {
    font-size: 17pt !important;
    margin-bottom: 1.5mm !important;
    line-height: 1.26 !important;
  }
  .f72-print-sheet .title-sub {
    margin-bottom: 1.4mm !important;
    line-height: 1.3 !important;
  }
  .f72-print-sheet .machine-row {
    margin-top: 1.5mm !important;
  }
  .f72-print-sheet .main-table {
    margin-top: 3mm !important;
  }
  .f72-print-sheet .main-table td,
  .f72-print-sheet .main-table th {
    padding: 2.2mm 1.6mm !important;
    font-size: 14.5pt !important;
    line-height: 1.34 !important;
  }
  .f72-print-sheet .note-row {
    padding-top: 3.2mm !important;
    padding-bottom: 3.2mm !important;
    line-height: 1.36 !important;
  }
  .f72-print-sheet .f72-gap-cell {
    padding: 1.8mm 1.6mm !important;
    font-size: 7pt !important;
  }
  .f72-print-sheet .section-row .section-title {
    padding-top: 1.8mm !important;
    padding-bottom: 1.8mm !important;
    line-height: 1.28 !important;
  }
  .f72-print-sheet .sub-header td {
    padding-top: 2mm !important;
    padding-bottom: 2mm !important;
  }
}

/* F8-1 ตาราง CR */
.table-wrapper {
  width: 100%;
  margin-bottom: 6mm;
}
.f81-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}
.f81-table thead th {
  border: 0.4pt solid #000;
  padding: 1.2mm 0.8mm;
  vertical-align: middle;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;
}
.f81-table tbody td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;
  vertical-align: middle;
  text-align: center;
  font-weight: 400;
  white-space: nowrap;
}
.col-ip { padding-left: 0.8mm; padding-right: 0.8mm; }
.col-roi { text-align: center; }
.col-roi-sub { text-align: center; font-weight: 400; }
.col-result-head { text-align: center; }
.col-result { padding-left: 0.9mm; padding-right: 0.9mm; }

/* F8-2 ตาราง DR */
.f82-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.f82-table th,
.f82-table td {
  border: 0.4pt solid #000;
  padding: 3mm 2mm;
  text-align: center;
  vertical-align: middle;
}
.f82-table thead th {
  padding-top: 1.5mm !important;
  padding-bottom: 1.5mm !important;
}
.col-fpd-no { width: 22mm; }
.col-fpd-size { width: 35mm; }
.col-id { width: 28mm; }
.col-ei { width: 25mm; }
.col-ddi { width: 25mm; }
.col-pixel { width: 30mm; }

/* ลายเซ็น F8-1 / F8-2 */
.signature-block {
  width: 100%;
  margin-top: 14mm;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}
.sig-row,
.sig-line {
  margin-bottom: 3mm;
  white-space: nowrap;
}

@media print {
  .f81-table th, .f81-table td { border: 1px solid #000 !important; }
  .f82-table th, .f82-table td { border: 1px solid #000 !important; }
}
</style>

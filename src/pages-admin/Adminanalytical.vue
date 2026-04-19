<template>
  <MainLayout>
    <div class="analytics-page container-fluid p-4">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">กำลังโหลดข้อมูลวิเคราะห์...</p>
      </div>

      <template v-else>
        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h4 class="fw-bold mb-1" style="color:#1e293b">
              <i class="bi bi-shield-check me-2 text-primary"></i>ศูนย์วิเคราะห์ความเสี่ยง
            </h4>
            <p class="text-muted mb-0" style="font-size:0.9rem">
              Risk Prevention Analytics — แผนกเอกซเรย์
            </p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <label class="fw-semibold text-muted" style="font-size:0.85rem">ปี พ.ศ.:</label>
            <select v-model="selectedYear" class="form-select form-select-sm" style="width:110px">
              <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="row g-3 mb-4">
          <div class="col-6 col-lg-3">
            <div class="kpi-card kpi-blue">
              <div class="kpi-icon"><i class="bi bi-display"></i></div>
              <div class="kpi-body">
                <div class="kpi-value">{{ machines.length }}</div>
                <div class="kpi-label">เครื่องเอกซเรย์ทั้งหมด</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="kpi-card" :class="qcPassRate >= 80 ? 'kpi-green' : qcPassRate >= 60 ? 'kpi-yellow' : 'kpi-red'">
              <div class="kpi-icon"><i class="bi bi-clipboard-check"></i></div>
              <div class="kpi-body">
                <div class="kpi-value">{{ qcPassRate }}<span class="kpi-unit">%</span></div>
                <div class="kpi-label">อัตราผ่าน QC ทั้งปี</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="kpi-card" :class="pendingRepairs === 0 ? 'kpi-green' : pendingRepairs <= 3 ? 'kpi-yellow' : 'kpi-red'">
              <div class="kpi-icon"><i class="bi bi-wrench-adjustable"></i></div>
              <div class="kpi-body">
                <div class="kpi-value">{{ pendingRepairs }}</div>
                <div class="kpi-label">แจ้งซ่อมรอดำเนินการ</div>
              </div>
            </div>
          </div>
          <div class="col-6 col-lg-3">
            <div class="kpi-card" :class="overallRiskClass">
              <div class="kpi-icon"><i class="bi bi-shield-exclamation"></i></div>
              <div class="kpi-body">
                <div class="kpi-value kpi-value-text">{{ overallRiskLabel }}</div>
                <div class="kpi-label">ระดับความเสี่ยงรวม</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly Trend Chart -->
        <div class="card shadow-sm mb-4 chart-card">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold m-0">
              <i class="bi bi-graph-up me-2 text-primary"></i>
              แนวโน้มการแจ้งซ่อมและผล QC รายเดือน — ปี {{ selectedYear }}
            </h6>
          </div>
          <div class="card-body">
            <div style="position:relative; height:380px">
              <canvas ref="trendChartRef"></canvas>
            </div>
          </div>
        </div>

        <!-- Two Charts Row -->
        <div class="row g-3 mb-4">
          <div class="col-lg-5">
            <div class="card shadow-sm h-100 chart-card">
              <div class="card-header bg-white py-3">
                <h6 class="fw-bold m-0">
                  <i class="bi bi-pie-chart me-2 text-primary"></i>สัดส่วนการแจ้งซ่อมตามเครื่อง
                </h6>
              </div>
              <div class="card-body d-flex align-items-center justify-content-center">
                <div style="position:relative; width:100%; max-width:320px; height:320px">
                  <canvas ref="machineDonutRef"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="card shadow-sm h-100 chart-card">
              <div class="card-header bg-white py-3">
                <h6 class="fw-bold m-0">
                  <i class="bi bi-bar-chart-steps me-2 text-primary"></i>สถานะการตรวจ QC ตามประเภทแบบฟอร์ม
                </h6>
              </div>
              <div class="card-body">
                <div style="position:relative; height:320px">
                  <canvas ref="formBarRef"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Machine Risk Assessment -->
        <h5 class="fw-bold mb-3" style="color:#1e293b">
          <i class="bi bi-heart-pulse me-2 text-danger"></i>การประเมินความเสี่ยงรายเครื่อง
        </h5>
        <div class="row g-3 mb-4">
          <div v-for="mr in machineRisks" :key="mr.machineId" class="col-md-6 col-xl-3">
            <div class="card shadow-sm h-100 risk-card" :style="{ borderTop: '4px solid ' + mr.color }">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 class="fw-bold mb-0" style="font-size:0.95rem">{{ mr.machineName }}</h6>
                    <small class="text-muted">{{ mr.room || '—' }}</small>
                  </div>
                  <span class="badge rounded-pill" :style="{ background: mr.color, color: '#fff' }">
                    {{ mr.riskLabel }}
                  </span>
                </div>

                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <small class="text-muted">คะแนนสุขภาพเครื่อง</small>
                    <small class="fw-bold">{{ mr.healthScore }}/100</small>
                  </div>
                  <div class="progress" style="height:8px; border-radius:4px">
                    <div class="progress-bar" role="progressbar"
                      :style="{ width: mr.healthScore + '%', background: mr.color }" />
                  </div>
                </div>

                <div class="row g-2 mb-3 text-center">
                  <div class="col-4">
                    <div class="stat-box">
                      <div class="stat-num">{{ mr.repairCount }}</div>
                      <div class="stat-label">แจ้งซ่อม</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-box">
                      <div class="stat-num">{{ mr.failCount }}</div>
                      <div class="stat-label">QC ไม่ผ่าน</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="stat-box">
                      <div class="stat-num">{{ mr.overdueCount }}</div>
                      <div class="stat-label">เกินกำหนด</div>
                    </div>
                  </div>
                </div>

                <!-- จุดที่ต้องระวัง — RFR Analysis -->
                <div class="caution-section mb-3">
                  <div class="caution-header">
                    <i class="bi bi-radioactive me-1"></i>จุดที่ต้องระวัง (อัตราการเสียซ้ำ)
                    <span class="caution-count" :class="'cnt-' + mr.rfrRiskLevel">
                      {{ mr.categoryBreakdown.length }}
                    </span>
                  </div>

                  <!-- Category Breakdown -->
                  <div v-if="mr.categoryBreakdown.length > 0" class="caution-list">
                    <div v-for="cat in mr.categoryBreakdown" :key="cat.key" class="rfr-row">
                      <div class="rfr-icon" :class="'rfri-' + cat.severity">
                        <i class="bi" :class="cat.icon"></i>
                      </div>
                      <div class="rfr-body">
                        <div class="rfr-title">
                          <span class="rfr-name">{{ cat.key }}</span>
                          <span class="rfr-tag" :class="'rtag-' + cat.severity">
                            {{ cat.severity === 'danger' ? 'วิกฤต' : cat.severity === 'warning' ? 'เฝ้าระวัง' : 'ติดตาม' }}
                          </span>
                        </div>
                        <div class="rfr-stats">
                          <span class="rfr-count">{{ cat.count }} ครั้ง</span>
                          <span class="rfr-sep">·</span>
                          <span class="rfr-pct" :class="'rpct-' + cat.severity">RFR {{ cat.rfr }}%</span>
                          <span v-if="cat.monthSpread >= 2" class="rfr-sep">·</span>
                          <span v-if="cat.monthSpread >= 2" class="rfr-recur">
                            <i class="bi bi-arrow-repeat"></i> ซ้ำ {{ cat.monthSpread }} เดือน
                          </span>
                        </div>
                        <div class="rfr-bar-track">
                          <div class="rfr-bar-fill" :class="'rbar-' + cat.severity"
                            :style="{ width: Math.min(cat.rfr, 100) + '%' }"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Summary -->
                    <div v-if="mr.topRFR" class="rfr-summary" :class="'rsum-' + mr.rfrRiskLevel">
                      <i class="bi" :class="mr.rfrRiskLevel === 'danger' ? 'bi-exclamation-octagon-fill' :
                        mr.rfrRiskLevel === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'"></i>
                      <span v-if="mr.rfrRiskLevel === 'danger'">
                        ปัญหาหลัก: <strong>{{ mr.topRFR.key }}</strong> (RFR {{ mr.topRFR.rfr }}%) — ต้องแก้ไขเร่งด่วน
                      </span>
                      <span v-else-if="mr.rfrRiskLevel === 'warning'">
                        เฝ้าระวัง: <strong>{{ mr.topRFR.key }}</strong> (RFR {{ mr.topRFR.rfr }}%) — ควรวางแผนป้องกัน
                      </span>
                      <span v-else>
                        ติดตาม: <strong>{{ mr.topRFR.key }}</strong> — ยังอยู่ในเกณฑ์ปกติ
                      </span>
                    </div>
                  </div>

                  <!-- No repair data -->
                  <div v-else class="rfr-empty">
                    <i class="bi bi-patch-check-fill"></i>
                    <span>ไม่พบการแจ้งซ่อมในปีนี้ — เครื่องอยู่ในสภาพดี</span>
                  </div>
                </div>

                <!-- Pending repairs badge -->
                <div v-if="mr.pendingCount > 0" class="pending-badge mb-2">
                  <i class="bi bi-tools me-1"></i>
                  รายการซ่อมค้าง <strong>{{ mr.pendingCount }}</strong> รายการ
                </div>

                <div class="alert p-2 mb-0" :class="mr.alertClass" style="font-size:0.8rem; border-radius:8px">
                  <i class="bi me-1" :class="mr.alertIcon"></i>
                  {{ mr.recommendation }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="machineRisks.length === 0" class="col-12">
            <div class="text-center py-5 text-muted">
              <i class="bi bi-inbox display-4 d-block mb-3"></i>
              ไม่พบข้อมูลเครื่องเอกซเรย์ในระบบ
            </div>
          </div>
        </div>

        <!-- QC Compliance Matrix -->
        <div class="card shadow-sm mb-4 chart-card">
          <div class="card-header bg-white py-3">
            <h6 class="fw-bold m-0">
              <i class="bi bi-table me-2 text-primary"></i>
              ตารางติดตามการตรวจ QC ตามกำหนด (Compliance Matrix)
            </h6>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0 compliance-table">
                <thead>
                  <tr>
                    <th class="ps-3" style="min-width:160px">เครื่อง</th>
                    <th v-for="ft in formTypeGroups" :key="ft.key" class="text-center" style="min-width:80px">
                      <div>{{ ft.shortLabel }}</div>
                      <div class="text-muted fw-normal" style="font-size:0.7rem">{{ ft.freqLabel }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in complianceRows" :key="row.machineId">
                    <td class="ps-3">
                      <div class="fw-semibold" style="font-size:0.88rem">{{ row.machineName }}</div>
                      <div class="text-muted" style="font-size:0.73rem">{{ row.room || '—' }}</div>
                    </td>
                    <td v-for="ft in formTypeGroups" :key="ft.key" class="text-center">
                      <span class="compliance-badge" :class="row.statuses[ft.key].badgeClass"
                        :title="row.statuses[ft.key].tooltip">
                        {{ row.statuses[ft.key].label }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="complianceRows.length === 0">
                    <td :colspan="formTypeGroups.length + 1" class="text-center py-4 text-muted">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card-footer bg-white px-3 py-2">
            <div class="d-flex gap-3 flex-wrap" style="font-size:0.78rem">
              <span><span class="compliance-badge badge-ok me-1">ปกติ</span> ตรวจตรงเวลา</span>
              <span><span class="compliance-badge badge-warn me-1">ใกล้ครบ</span> ใกล้กำหนดตรวจ</span>
              <span><span class="compliance-badge badge-overdue me-1">เกินกำหนด</span> เกินกำหนดแล้ว</span>
              <span><span class="compliance-badge badge-none me-1">—</span> ยังไม่เคยตรวจ</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import Chart from 'chart.js/auto'

import { apiFetch } from '../api/client'

const loading = ref(true)
const selectedYear = ref(new Date().getFullYear() + 543)
const machines = ref([])
const repairRequests = ref([])
const checklistRecords = ref([])

const trendChartRef = ref(null)
const machineDonutRef = ref(null)
const formBarRef = ref(null)
let trendChart = null
let donutChart = null
let formChart = null

const formTypeGroups = [
  { key: 'F1_F2', shortLabel: 'F1/F2', freqLabel: 'ทุกวัน', maxDays: 2 },
  { key: 'F10', shortLabel: 'F10', freqLabel: 'ทุกเดือน', maxDays: 45 },
  { key: 'F3_F6', shortLabel: 'F3-F6', freqLabel: '3 เดือน', maxDays: 100 },
  { key: 'F7_F8', shortLabel: 'F7/F8', freqLabel: '6 เดือน', maxDays: 200 },
]

const thaiMonthAbbr = {
  'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
  'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
}
const thaiMonthShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

// === DATE UTILITIES ===

function parseAnyDate(str) {
  if (!str || typeof str !== 'string') return null
  const s = str.trim()

  const thaiMatch = s.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})/)
  if (thaiMatch) {
    const day = parseInt(thaiMatch[1])
    const monthIdx = thaiMonthAbbr[thaiMatch[2]]
    const yearRaw = parseInt(thaiMatch[3])
    if (monthIdx !== undefined && day >= 1 && day <= 31) {
      const yearBE = yearRaw > 2400 ? yearRaw : yearRaw + 543
      const yearCE = yearRaw > 2400 ? yearRaw - 543 : yearRaw
      return { day, month: monthIdx, yearBE, date: new Date(yearCE, monthIdx, day) }
    }
  }

  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (slashMatch) {
    const day = parseInt(slashMatch[1])
    const month = parseInt(slashMatch[2]) - 1
    const yearRaw = parseInt(slashMatch[3])
    const yearBE = yearRaw > 2400 ? yearRaw : yearRaw + 543
    const yearCE = yearRaw > 2400 ? yearRaw - 543 : yearRaw
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return { day, month, yearBE, date: new Date(yearCE, month, day) }
    }
  }

  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const yearRaw = parseInt(isoMatch[1])
    const month = parseInt(isoMatch[2]) - 1
    const day = parseInt(isoMatch[3])
    const yearBE = yearRaw < 2400 ? yearRaw + 543 : yearRaw
    const yearCE = yearRaw < 2400 ? yearRaw : yearRaw - 543
    return { day, month, yearBE, date: new Date(yearCE, month, day) }
  }

  return null
}

function isRecordPassed(record) {
  if (!record.jsonData) return true
  try {
    const raw = JSON.stringify(JSON.parse(record.jsonData)).toLowerCase()
    return !raw.includes('"fail"')
  } catch {
    return true
  }
}

function matchMachine(record, machineName, room) {
  const rName = (record.equipment || record.machineName || '').trim()
  const rRoom = (record.room || '').trim()
  if (rName === machineName && rRoom === room) return true
  if (rName === machineName && (!rRoom || !room)) return true
  return false
}

function getLastCheckDate(machineName, room, formType) {
  let latest = null
  checklistRecords.value.forEach(r => {
    if ((r.machineName || '').trim() !== machineName) return
    if (room && (r.room || '').trim() !== room) return
    if ((r.formType || '') !== formType) return
    const d = parseAnyDate(r.checkDate)
    if (d && d.date && (!latest || d.date > latest)) latest = d.date
  })
  return latest
}

// === API FETCHING ===

async function fetchMachines() {
  try {
    const res = await apiFetch('/GetAllMachines')
    if (res.ok) machines.value = await res.json()
  } catch (e) { console.error('Fetch machines:', e) }
}

async function fetchRepairs() {
  try {
    const res = await apiFetch('/GetAllRepairRequests')
    if (res.ok) repairRequests.value = await res.json()
  } catch (e) { console.error('Fetch repairs:', e) }
}

async function fetchChecklists() {
  try {
    const res = await apiFetch('/GetAllChecklistRecords')
    if (res.ok) checklistRecords.value = await res.json()
  } catch (e) { console.error('Fetch checklists:', e) }
}

// === COMPUTED: AVAILABLE YEARS ===

const availableYears = computed(() => {
  const years = new Set()
  repairRequests.value.forEach(r => {
    const d = parseAnyDate(r.requestDate)
    if (d) years.add(d.yearBE)
  })
  checklistRecords.value.forEach(r => {
    const d = parseAnyDate(r.checkDate)
    if (d) years.add(d.yearBE)
  })
  if (years.size === 0) years.add(selectedYear.value)
  return Array.from(years).sort((a, b) => b - a)
})

// === COMPUTED: FILTERED DATA BY YEAR ===

const yearRepairs = computed(() =>
  repairRequests.value.filter(r => {
    const d = parseAnyDate(r.requestDate)
    return d && d.yearBE === selectedYear.value
  })
)

const yearChecklists = computed(() =>
  checklistRecords.value.filter(r => {
    const d = parseAnyDate(r.checkDate)
    return d && d.yearBE === selectedYear.value
  })
)

// === COMPUTED: KPI ===

const qcPassRate = computed(() => {
  const records = yearChecklists.value
  if (records.length === 0) return 100
  const passed = records.filter(r => isRecordPassed(r)).length
  return Math.round((passed / records.length) * 100)
})

const pendingRepairs = computed(() =>
  repairRequests.value.filter(r => {
    const st = (r.statusText || '').trim()
    return st === 'รอซ่อม' || st === 'รอดำเนินการ' || st === ''
  }).length
)

const overallRiskScore = computed(() => {
  const risks = machineRisks.value
  if (risks.length === 0) return 0
  return Math.round(risks.reduce((s, r) => s + (100 - r.healthScore), 0) / risks.length)
})

const overallRiskLabel = computed(() => {
  const s = overallRiskScore.value
  if (s <= 15) return 'ต่ำ'
  if (s <= 35) return 'ปานกลาง'
  if (s <= 55) return 'สูง'
  return 'วิกฤต'
})

const overallRiskClass = computed(() => {
  const s = overallRiskScore.value
  if (s <= 15) return 'kpi-green'
  if (s <= 35) return 'kpi-blue'
  if (s <= 55) return 'kpi-yellow'
  return 'kpi-red'
})

// === COMPUTED: MACHINE RISK ASSESSMENT ===

const machineRisks = computed(() => {
  return machines.value.map(m => {
    const name = (m.machineName || m.machine_name || m.Machine_name || '').trim()
    const room = (m.room || m.Room || '').trim()
    const id = m.id || m.rID || m.RID

    const repairCount = yearRepairs.value.filter(r => matchMachine(r, name, room)).length
    const pendingCount = repairRequests.value.filter(r => {
      const st = (r.statusText || '').trim()
      return matchMachine(r, name, room) && (st === 'รอซ่อม' || st === 'รอดำเนินการ' || st === '')
    }).length

    const machineChecks = yearChecklists.value.filter(r =>
      (r.machineName || '').trim() === name && (!room || (r.room || '').trim() === room)
    )
    const failCount = machineChecks.filter(r => !isRecordPassed(r)).length

    // เกินกำหนด: เฉพาะ Daily F1/F2 (F1_F2) เท่านั้น — ตรงคอลัมน์ F1/F2 ใน Compliance Matrix
    // - F10 / F3-F6 / F7-F8 ถ้ายังไม่เคยตรวจ (เครื่องหมาย —) ไม่นับเป็นเกินกำหนด
    // - ไม่บวกเมื่อมี QC แบบอื่นหรือแจ้งซ่อน (ยกเลิกเงื่อนไขเก่า)
    let overdueCount = 0
    const now = new Date()
    const dailyFt = formTypeGroups.find(ft => ft.key === 'F1_F2')
    if (dailyFt) {
      const lastDaily = getLastCheckDate(name, room, dailyFt.key)
      if (lastDaily) {
        const daysSince = Math.floor((now - lastDaily) / 86400000)
        if (daysSince > dailyFt.maxDays) overdueCount = 1
      }
    }

    let score = 100
    score -= Math.min(repairCount * 3, 30)
    score -= Math.min(pendingCount * 8, 24)
    score -= Math.min(failCount * 5, 25)
    score -= Math.min(overdueCount * 7, 21)
    score = Math.max(0, score)

    let riskLabel, color, alertClass, alertIcon, recommendation
    if (score >= 80) {
      riskLabel = 'ความเสี่ยงต่ำ'; color = '#059669'
      alertClass = 'alert-success'; alertIcon = 'bi-check-circle-fill'
      recommendation = 'เครื่องอยู่ในสภาพดี ดำเนินการบำรุงรักษาเชิงป้องกันตามปกติ'
    } else if (score >= 60) {
      riskLabel = 'ปานกลาง'; color = '#0d6efd'
      alertClass = 'alert-info'; alertIcon = 'bi-info-circle-fill'
      recommendation = `พบการแจ้งซ่อม ${repairCount} ครั้ง ควรเฝ้าระวังและตรวจเช็คเพิ่มเติม`
    } else if (score >= 40) {
      riskLabel = 'ความเสี่ยงสูง'; color = '#f59e0b'
      alertClass = 'alert-warning'; alertIcon = 'bi-exclamation-triangle-fill'
      recommendation = `เกินกำหนดตรวจ ${overdueCount} รายการ, QC ไม่ผ่าน ${failCount} ครั้ง — ควรเร่งดำเนินการตรวจสอบ`
    } else {
      riskLabel = 'วิกฤต'; color = '#dc2626'
      alertClass = 'alert-danger'; alertIcon = 'bi-exclamation-octagon-fill'
      recommendation = 'ความเสี่ยงสูงมาก! ควรหยุดใช้งานชั่วคราวและตรวจสอบเครื่องอย่างละเอียดทันที'
    }

    // === WARNING POINTS — RFR Analysis per repair category ===
    const repairCategories = [
      { key: 'สายไฟ', icon: 'bi-lightning-charge' },
      { key: 'ระบบล็อกและเบรก', icon: 'bi-lock' },
      { key: 'เตียง หลอดเอกซเรย์ และบักกี้', icon: 'bi-arrows-move' },
      { key: 'X-ray tube warm-up', icon: 'bi-thermometer-half' },
      { key: 'ส่วนอื่นเพิ่มเติม', icon: 'bi-three-dots' },
    ]

    const machineRepairList = yearRepairs.value.filter(r => matchMachine(r, name, room))
    const totalRepairs = machineRepairList.length

    const categoryBreakdown = repairCategories.map(cat => {
      const catRepairs = machineRepairList.filter(r => (r.detail || '').trim() === cat.key)
      const count = catRepairs.length
      const rfr = totalRepairs > 0 ? parseFloat(((count / totalRepairs) * 100).toFixed(1)) : 0

      // Count distinct months with this issue to detect recurrence
      const monthSet = new Set()
      catRepairs.forEach(r => {
        const d = parseAnyDate(r.requestDate)
        if (d) monthSet.add(d.month)
      })
      const monthSpread = monthSet.size

      let severity = 'safe'
      if (rfr >= 50 || count >= 4) severity = 'danger'
      else if (rfr >= 30 || count >= 2) severity = 'warning'
      else if (count >= 1) severity = 'info'

      return { ...cat, count, rfr, severity, monthSpread }
    }).filter(c => c.count > 0)
      .sort((a, b) => b.rfr - a.rfr)

    // Highest RFR category
    const topRFR = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null

    // Overall RFR risk level for this machine
    let rfrRiskLevel = 'safe'
    if (topRFR) {
      if (topRFR.rfr >= 50) rfrRiskLevel = 'danger'
      else if (topRFR.rfr >= 30) rfrRiskLevel = 'warning'
      else if (topRFR.count >= 1) rfrRiskLevel = 'info'
    }

    return {
      machineId: id, machineName: name, room, healthScore: score,
      repairCount, failCount, overdueCount,
      riskLabel, color, alertClass, alertIcon, recommendation,
      categoryBreakdown, topRFR, rfrRiskLevel, totalRepairs, pendingCount
    }
  })
})

// === COMPUTED: QC COMPLIANCE MATRIX ===

const complianceRows = computed(() => {
  const now = new Date()
  return machines.value.map(m => {
    const name = (m.machineName || m.machine_name || m.Machine_name || '').trim()
    const room = (m.room || m.Room || '').trim()
    const statuses = {}

    formTypeGroups.forEach(ft => {
      const lastDate = getLastCheckDate(name, room, ft.key)
      if (!lastDate) {
        statuses[ft.key] = { label: '—', badgeClass: 'badge-none', tooltip: 'ยังไม่เคยตรวจ' }
      } else {
        const daysSince = Math.floor((now - lastDate) / 86400000)
        const warnDays = Math.floor(ft.maxDays * 0.75)
        const dateStr = lastDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
        if (daysSince <= warnDays) {
          statuses[ft.key] = { label: 'ปกติ', badgeClass: 'badge-ok', tooltip: `ตรวจล่าสุด: ${dateStr}` }
        } else if (daysSince <= ft.maxDays) {
          statuses[ft.key] = { label: 'ใกล้ครบ', badgeClass: 'badge-warn', tooltip: `ตรวจล่าสุด: ${dateStr} (${daysSince} วัน)` }
        } else {
          statuses[ft.key] = { label: 'เกินกำหนด', badgeClass: 'badge-overdue', tooltip: `ตรวจล่าสุด: ${dateStr} (เกิน ${daysSince - ft.maxDays} วัน)` }
        }
      }
    })

    return { machineId: m.id, machineName: name, room, statuses }
  })
})

// === CHART RENDERING ===

function destroyCharts() {
  if (trendChart) { trendChart.destroy(); trendChart = null }
  if (donutChart) { donutChart.destroy(); donutChart = null }
  if (formChart) { formChart.destroy(); formChart = null }
}

function renderAllCharts() {
  destroyCharts()
  renderTrendChart()
  renderDonutChart()
  renderFormBarChart()
}

function renderTrendChart() {
  if (!trendChartRef.value) return

  const repairByMonth = new Array(12).fill(0)
  const failByMonth = new Array(12).fill(0)
  const checkByMonth = new Array(12).fill(0)

  yearRepairs.value.forEach(r => {
    const d = parseAnyDate(r.requestDate)
    if (d) repairByMonth[d.month]++
  })

  yearChecklists.value.forEach(r => {
    const d = parseAnyDate(r.checkDate)
    if (d) {
      checkByMonth[d.month]++
      if (!isRecordPassed(r)) failByMonth[d.month]++
    }
  })

  const failRateByMonth = checkByMonth.map((total, i) =>
    total > 0 ? parseFloat(((failByMonth[i] / total) * 100).toFixed(1)) : 0
  )

  trendChart = new Chart(trendChartRef.value, {
    type: 'bar',
    data: {
      labels: thaiMonthShort,
      datasets: [
        {
          label: 'จำนวนแจ้งซ่อม (ครั้ง)',
          data: repairByMonth,
          backgroundColor: 'rgba(59, 130, 246, 0.65)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'จำนวนตรวจ QC (ครั้ง)',
          data: checkByMonth,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y'
        },
        {
          label: 'อัตรา QC ไม่ผ่าน (%)',
          data: failRateByMonth,
          type: 'line',
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444',
          fill: true,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { family: 'Sarabun, sans-serif' } } },
        tooltip: {
          callbacks: {
            label(ctx) {
              const v = ctx.parsed.y
              return ctx.dataset.type === 'line'
                ? `${ctx.dataset.label}: ${v}%`
                : `${ctx.dataset.label}: ${v} ครั้ง`
            }
          }
        }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'จำนวน (ครั้ง)', font: { family: 'Sarabun, sans-serif' } } },
        y1: { position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false }, title: { display: true, text: 'อัตรา QC ไม่ผ่าน (%)', font: { family: 'Sarabun, sans-serif' } }, ticks: { callback: v => v + '%' } }
      }
    }
  })
}

function renderDonutChart() {
  if (!machineDonutRef.value) return

  const machineMap = {}
  yearRepairs.value.forEach(r => {
    const key = (r.equipment || r.machineName || 'ไม่ระบุ').trim()
    machineMap[key] = (machineMap[key] || 0) + 1
  })

  const labels = Object.keys(machineMap)
  const data = Object.values(machineMap)
  const palette = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#0EA5E9', '#ec4899', '#06b6d4', '#84cc16']

  if (labels.length === 0) {
    labels.push('ไม่มีข้อมูลแจ้งซ่อม')
    data.push(1)
  }

  donutChart = new Chart(machineDonutRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: palette.slice(0, labels.length), borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      plugins: {
        legend: { position: 'bottom', labels: { padding: 12, font: { size: 11, family: 'Sarabun, sans-serif' } } }
      }
    }
  })
}

function renderFormBarChart() {
  if (!formBarRef.value) return

  const labels = formTypeGroups.map(ft => ft.shortLabel)
  const passData = []
  const failData = []

  formTypeGroups.forEach(ft => {
    const records = yearChecklists.value.filter(r => (r.formType || '') === ft.key)
    const passed = records.filter(r => isRecordPassed(r)).length
    passData.push(passed)
    failData.push(records.length - passed)
  })

  formChart = new Chart(formBarRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'ผ่าน', data: passData, backgroundColor: 'rgba(16, 185, 129, 0.7)', borderRadius: 4 },
        { label: 'ไม่ผ่าน', data: failData, backgroundColor: 'rgba(239, 68, 68, 0.7)', borderRadius: 4 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { family: 'Sarabun, sans-serif' } } }
      },
      scales: {
        x: { stacked: true, beginAtZero: true, title: { display: true, text: 'จำนวนครั้ง', font: { family: 'Sarabun, sans-serif' } } },
        y: { stacked: true }
      }
    }
  })
}

// === LIFECYCLE ===

watch(selectedYear, () => {
  nextTick(() => renderAllCharts())
})

onMounted(async () => {
  await Promise.all([fetchMachines(), fetchRepairs(), fetchChecklists()])
  loading.value = false
  nextTick(() => renderAllCharts())
})
</script>

<style scoped>
.analytics-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* KPI Cards */
.kpi-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 14px;
  color: #fff;
  min-height: 90px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.kpi-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.kpi-green { background: linear-gradient(135deg, #10b981, #059669); }
.kpi-yellow { background: linear-gradient(135deg, #f59e0b, #d97706); }
.kpi-red { background: linear-gradient(135deg, #ef4444, #dc2626); }

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}
.kpi-body { flex: 1; min-width: 0; }
.kpi-value {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.1;
}
.kpi-value-text { font-size: 1.3rem; }
.kpi-unit { font-size: 1rem; font-weight: 600; opacity: 0.85; }
.kpi-label {
  font-size: 0.78rem;
  opacity: 0.9;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chart cards */
.chart-card {
  border-radius: 14px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  overflow: hidden;
}
.chart-card .card-header {
  border-bottom: 1px solid #e2e8f0 !important;
}

/* Risk cards */
.risk-card {
  border-radius: 14px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  transition: transform 0.2s, box-shadow 0.2s;
}
.risk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 4px;
}
.stat-num {
  font-weight: 700;
  font-size: 1.15rem;
  color: #1e293b;
}
.stat-label {
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 1px;
}

/* Caution / RFR Section */
.caution-section {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.caution-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px 12px;
  background: #f8fafc;
  font-size: 0.78rem;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}
.caution-count {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
}
.cnt-danger { background: #ef4444; }
.cnt-warning { background: #f59e0b; }
.cnt-info { background: #3b82f6; }
.cnt-safe { background: #10b981; }

.caution-list {
  max-height: 320px;
  overflow-y: auto;
}

/* RFR Row */
.rfr-row {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}
.rfr-row:last-child { border-bottom: none; }
.rfr-row:hover { background: #f8fafc; }

.rfr-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.rfri-danger { background: #fee2e2; color: #dc2626; }
.rfri-warning { background: #fef3c7; color: #d97706; }
.rfri-info { background: #dbeafe; color: #2563eb; }
.rfri-safe { background: #dcfce7; color: #059669; }

.rfr-body { flex: 1; min-width: 0; }

.rfr-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}
.rfr-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rfr-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}
.rtag-danger { background: #fee2e2; color: #991b1b; }
.rtag-warning { background: #fef3c7; color: #92400e; }
.rtag-info { background: #dbeafe; color: #1e40af; }

.rfr-stats {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 4px;
}
.rfr-count { font-weight: 600; }
.rfr-sep { color: #cbd5e1; }
.rfr-pct { font-weight: 700; }
.rpct-danger { color: #dc2626; }
.rpct-warning { color: #d97706; }
.rpct-info { color: #2563eb; }

.rfr-recur {
  color: #0284C7;
  font-weight: 600;
}

/* Mini RFR bar */
.rfr-bar-track {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}
.rfr-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}
.rbar-danger { background: linear-gradient(90deg, #ef4444, #dc2626); }
.rbar-warning { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.rbar-info { background: linear-gradient(90deg, #60a5fa, #3b82f6); }

/* RFR Summary */
.rfr-summary {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 12px;
  font-size: 0.74rem;
  line-height: 1.4;
  border-top: 1px solid #e2e8f0;
}
.rsum-danger { background: #fef2f2; color: #991b1b; }
.rsum-warning { background: #fffbeb; color: #92400e; }
.rsum-info { background: #eff6ff; color: #1e40af; }
.rsum-safe { background: #f0fdf4; color: #166534; }

/* Empty state */
.rfr-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
  font-size: 0.78rem;
  color: #059669;
  background: #f0fdf4;
}

/* Pending badge */
.pending-badge {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.76rem;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* Compliance Table */
.compliance-table th {
  background: #f8fafc;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  padding: 10px 8px;
}
.compliance-table td {
  padding: 10px 8px;
  font-size: 0.85rem;
  border-bottom: 1px solid #f1f5f9;
}
.compliance-table tbody tr:hover {
  background: #f8fafc;
}

.compliance-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge-ok {
  background: #dcfce7;
  color: #166534;
}
.badge-warn {
  background: #fef3c7;
  color: #92400e;
}
.badge-overdue {
  background: #fee2e2;
  color: #991b1b;
}
.badge-none {
  background: #f1f5f9;
  color: #94a3b8;
}

/* Progress bar */
.progress {
  background: #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .kpi-value { font-size: 1.4rem; }
  .kpi-icon { width: 40px; height: 40px; font-size: 1.1rem; }
  .kpi-card { padding: 14px 16px; min-height: 76px; }
}
</style>

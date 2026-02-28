<template>
  <MainLayout>
    <div class="container-fluid p-4 analytics-page">
      <!-- ========== ส่วนบน: ศูนย์วิเคราะห์ความเสี่ยง (จาก AnalyticalEN) ========== -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">กำลังโหลดข้อมูลวิเคราะห์...</p>
      </div>

      <template v-else>
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

                <div class="caution-section mb-3">
                  <div class="caution-header">
                    <i class="bi bi-radioactive me-1"></i>จุดที่ต้องระวัง (อัตราการเสียซ้ำ)
                    <span class="caution-count" :class="'cnt-' + mr.rfrRiskLevel">
                      {{ mr.categoryBreakdown.length }}
                    </span>
                  </div>

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

                  <div v-else class="rfr-empty">
                    <i class="bi bi-patch-check-fill"></i>
                    <span>ไม่พบการแจ้งซ่อมในปีนี้ — เครื่องอยู่ในสภาพดี</span>
                  </div>
                </div>

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

      <!-- ========== ประวัติการทำรายการ (ดึงข้อมูลจริงจากระบบ) ========== -->
      <div class="panel history-panel mt-4">
        <div class="panel-header">
          <h3 class="d-flex align-items-center gap-2">
            <i class="bi bi-clock-history"></i>
            ประวัติการทำรายการ
          </h3>
          <p class="panel-sub">รวมการบันทึกแบบฟอร์ม ระบบแจ้งซ่อม และรายการที่ส่งออก PDF</p>
        </div>

        <div class="panel-body history-body">
          <!-- Filters -->
          <div class="history-filters">
            <select v-model="historyFilters.type" class="history-input history-select">
              <option value="">ประเภทรายการ: ทั้งหมด</option>
              <option value="checklist">บันทึกแบบฟอร์ม / QC</option>
              <option value="repair">แจ้งซ่อม</option>
            </select>
            <select v-model="historyFilters.machine" class="history-input history-select">
              <option value="">เครื่อง: ทั้งหมด</option>
              <option v-for="m in machines" :key="'m-' + m.id" :value="'machine-' + m.id">
                {{ m.machineName }} ({{ m.room || '-' }})
              </option>
            </select>
            <input
              v-model="historyFilters.dateFrom"
              type="date"
              class="history-input"
              placeholder="จากวันที่"
            />
            <input
              v-model="historyFilters.dateTo"
              type="date"
              class="history-input"
              placeholder="ถึงวันที่"
            />
            <input
              v-model="historyFilters.search"
              class="history-input"
              placeholder="ค้นหา ผู้ทำ, เครื่อง, รายละเอียด..."
            />
            <button type="button" class="history-btn history-btn-search" @click="applyHistoryFilters">
              <i class="bi bi-search me-1"></i>ค้นหา
            </button>
            <button type="button" class="history-btn history-btn-outline history-btn-clear" @click="clearHistoryFilters">
              ล้างตัวกรอง
            </button>
          </div>

          <div v-if="historyLoading" class="history-loading">
            <div class="spinner-border text-primary" role="status"></div>
            <span>กำลังโหลดประวัติ...</span>
          </div>

          <template v-else>
            <div class="history-content">
            <!-- Table -->
            <div class="table-responsive mt-2">
              <table class="table history-table">
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>เวลาที่ทำ</th>
                    <th>ผู้ทำ</th>
                    <th>เครื่อง / ห้อง</th>
                    <th>ประเภทรายการ</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedHistory.length === 0">
                    <td colspan="6" class="text-center text-muted py-5">
                      <i class="bi bi-inbox display-6 d-block mb-2"></i>
                      ไม่พบรายการตามเงื่อนไข
                    </td>
                  </tr>
                  <tr v-else v-for="(item, idx) in paginatedHistory" :key="item.uid">
                    <td class="history-date">{{ item.displayDate }}</td>
                    <td class="history-time">{{ item.displayTime }}</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.machine }}</td>
                    <td>
                      <span class="history-type-badge" :class="item.type === 'repair' ? 'badge-repair' : 'badge-form'">
                        {{ item.typeLabel }}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="btn btn-sm btn-link p-0" @click="openHistoryDetail(item)">
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="historyFiltered.length > 0" class="history-pagination">
              <span class="history-pagination-summary">{{ historyPaginationSummary }}</span>
              <div class="history-pagination-btns">
                <button type="button" class="page-btn" :disabled="historyPage <= 1" @click="historyPage = Math.max(1, historyPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <span class="page-info">หน้า {{ historyPage }} / {{ historyTotalPages }}</span>
                <button type="button" class="page-btn" :disabled="historyPage >= historyTotalPages" @click="historyPage = Math.min(historyTotalPages, historyPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="historyModal.open && historyModal.data" class="modal-backdrop" @click.self="historyModal.open = false">
        <div class="modal-card modal-card-wide">
          <h3 class="modal-title">
            {{ historyModal.data.type === 'repair' ? 'รายละเอียดแจ้งซ่อม' : 'รายละเอียดการบันทึกแบบฟอร์ม' }}
          </h3>
          <div class="modal-body-inner">
            <p><strong>วันที่:</strong> {{ historyModal.data.displayDate }}</p>
            <p><strong>เวลาที่ทำ:</strong> {{ historyModal.data.displayTime }}</p>
            <p><strong>ผู้ทำ:</strong> {{ historyModal.data.user }}</p>
            <p><strong>เครื่อง / ห้อง:</strong> {{ historyModal.data.machine }}</p>
            <p><strong>ประเภทรายการ:</strong> {{ historyModal.data.typeLabel }}</p>
            <template v-if="historyModal.data.type === 'repair'">
              <p><strong>รายละเอียด:</strong> {{ historyModal.data.detail }}</p>
              <p v-if="historyModal.data.remarks"><strong>หมายเหตุ:</strong> {{ historyModal.data.remarks }}</p>
            </template>
          </div>
          <button type="button" class="modal-close" @click="historyModal.open = false">ปิด</button>
        </div>
      </div>
      <!-- ========== END HISTORY SECTION ========== -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/Layout/MainLayout.vue';
import Chart from 'chart.js/auto';

const API_BASE = '/api/Xraycare';
const router = useRouter();

// ---------- ศูนย์วิเคราะห์ความเสี่ยง (จาก AnalyticalEN) ----------
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

// === DATE UTILITIES (EN) ===
function parseAnyDate(str) {
  if (!str || typeof str !== 'string') return null
  const s = str.trim()
  const thaiMatch = s.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})/)
  if (thaiMatch) {
    const day = parseInt(thaiMatch[1])
    const monthIdx = thaiMonthAbbr[thaiMatch[2]]
    const yearRaw = parseInt(thaiMatch[3])
    if (monthIdx !== undefined && day >= 1 && day <= 31) {
      const yearCE = yearRaw > 2400 ? yearRaw - 543 : yearRaw
      return { day, month: monthIdx, yearBE: yearRaw > 2400 ? yearRaw : yearRaw + 543, date: new Date(yearCE, monthIdx, day) }
    }
  }
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (slashMatch) {
    const day = parseInt(slashMatch[1])
    const month = parseInt(slashMatch[2]) - 1
    const yearRaw = parseInt(slashMatch[3])
    const yearCE = yearRaw > 2400 ? yearRaw - 543 : yearRaw
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return { day, month, yearBE: yearRaw > 2400 ? yearRaw : yearRaw + 543, date: new Date(yearCE, month, day) }
    }
  }
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const yearRaw = parseInt(isoMatch[1])
    const month = parseInt(isoMatch[2]) - 1
    const day = parseInt(isoMatch[3])
    const yearCE = yearRaw < 2400 ? yearRaw : yearRaw - 543
    return { day, month, yearBE: yearRaw < 2400 ? yearRaw + 543 : yearRaw, date: new Date(yearCE, month, day) }
  }
  return null
}

function isRecordPassed(record) {
  if (!record.jsonData) return true
  try {
    const raw = JSON.stringify(JSON.parse(record.jsonData)).toLowerCase()
    return !raw.includes('"fail"')
  } catch { return true }
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

async function fetchMachines() {
  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`)
    if (res.ok) machines.value = await res.json()
  } catch (e) { console.error('Fetch machines:', e) }
}
async function fetchRepairs() {
  try {
    const res = await fetch(`${API_BASE}/GetAllRepairRequests`)
    if (res.ok) repairRequests.value = await res.json()
  } catch (e) { console.error('Fetch repairs:', e) }
}
async function fetchChecklists() {
  try {
    const res = await fetch(`${API_BASE}/GetAllChecklistRecords`)
    if (res.ok) checklistRecords.value = await res.json()
  } catch (e) { console.error('Fetch checklists:', e) }
}

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
    let overdueCount = 0
    const now = new Date()
    formTypeGroups.forEach(ft => {
      const lastCheck = getLastCheckDate(name, room, ft.key)
      if (lastCheck) {
        const daysSince = Math.floor((now - lastCheck) / 86400000)
        if (daysSince > ft.maxDays) overdueCount++
      } else if (machineChecks.length > 0 || repairCount > 0) overdueCount++
    })
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
    }).filter(c => c.count > 0).sort((a, b) => b.rfr - a.rfr)
    const topRFR = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null
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
        if (daysSince <= warnDays) statuses[ft.key] = { label: 'ปกติ', badgeClass: 'badge-ok', tooltip: `ตรวจล่าสุด: ${dateStr}` }
        else if (daysSince <= ft.maxDays) statuses[ft.key] = { label: 'ใกล้ครบ', badgeClass: 'badge-warn', tooltip: `ตรวจล่าสุด: ${dateStr} (${daysSince} วัน)` }
        else statuses[ft.key] = { label: 'เกินกำหนด', badgeClass: 'badge-overdue', tooltip: `ตรวจล่าสุด: ${dateStr} (เกิน ${daysSince - ft.maxDays} วัน)` }
      }
    })
    return { machineId: m.id, machineName: name, room, statuses }
  })
})

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
  const failRateByMonth = checkByMonth.map((total, i) => total > 0 ? parseFloat(((failByMonth[i] / total) * 100).toFixed(1)) : 0)
  trendChart = new Chart(trendChartRef.value, {
    type: 'bar',
    data: {
      labels: thaiMonthShort,
      datasets: [
        { label: 'จำนวนแจ้งซ่อม (ครั้ง)', data: repairByMonth, backgroundColor: 'rgba(59, 130, 246, 0.65)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
        { label: 'จำนวนตรวจ QC (ครั้ง)', data: checkByMonth, backgroundColor: 'rgba(16, 185, 129, 0.5)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 1, borderRadius: 4, yAxisID: 'y' },
        { label: 'อัตรา QC ไม่ผ่าน (%)', data: failRateByMonth, type: 'line', borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: '#ef4444', fill: true, tension: 0.3, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } }, tooltip: { callbacks: { label(ctx) { const v = ctx.parsed.y; return ctx.dataset.type === 'line' ? `${ctx.dataset.label}: ${v}%` : `${ctx.dataset.label}: ${v} ครั้ง` } } } },
      scales: { y: { beginAtZero: true }, y1: { position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false }, ticks: { callback: v => v + '%' } } }
    }
  })
}
function renderDonutChart() {
  if (!machineDonutRef.value) return
  const machineMap = {}
  yearRepairs.value.forEach(r => { const key = (r.equipment || r.machineName || 'ไม่ระบุ').trim(); machineMap[key] = (machineMap[key] || 0) + 1 })
  const labels = Object.keys(machineMap)
  const data = Object.values(machineMap)
  const palette = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#0EA5E9', '#ec4899', '#06b6d4', '#84cc16']
  if (labels.length === 0) { labels.push('ไม่มีข้อมูลแจ้งซ่อม'); data.push(1) }
  donutChart = new Chart(machineDonutRef.value, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: palette.slice(0, labels.length), borderWidth: 2, borderColor: '#fff' }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '55%', plugins: { legend: { position: 'bottom' } } }
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
    data: { labels, datasets: [
      { label: 'ผ่าน', data: passData, backgroundColor: 'rgba(16, 185, 129, 0.7)', borderRadius: 4 },
      { label: 'ไม่ผ่าน', data: failData, backgroundColor: 'rgba(239, 68, 68, 0.7)', borderRadius: 4 }
    ] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true, beginAtZero: true }, y: { stacked: true } } }
  })
}

watch(selectedYear, () => { nextTick(() => renderAllCharts()) })

onMounted(async () => {
  await Promise.all([fetchMachines(), fetchRepairs(), fetchChecklists()])
  loading.value = false
  nextTick(() => renderAllCharts())
})


// ---------- ประวัติการทำรายการ (ดึงข้อมูลจริง) ----------
const formTypeToLabel = {
  F1_F2: 'F1/F2 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์',
  F10: 'F10 : แบบบันทึกการตรวจสอบความสว่างแสงไฟ',
  F12: 'F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ',
  F3_F6: 'F3-F6 : การควบคุมคุณภาพจอภาพ / บันทึกการตรวจสอบเครื่อง',
  F7_F8: 'F7-F8 : Collimator / Dark noise CR/DR',
  F9: 'F9 : การตรวจสอบคุณภาพเสื้อตะกั่ว',
  F11: 'F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย',
  F13: 'F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์',
}
const formTypeToRoute = {
  F1_F2: 'XrayF1Print',
  F10: 'XrayF10Print',
  F12: 'XrayF12Print',
  F3_F6: 'XrayF3Print',
  F7_F8: 'XrayF71Print',
  F9: 'XrayF9Print',
  F11: 'XrayF11Print',
  F13: 'XrayF13Print',
}

const historyLoading = ref(false)
const historyFilters = ref({
  type: '',
  machine: '',
  dateFrom: '',
  dateTo: '',
  search: '',
})
const historyPage = ref(1)
const HISTORY_PAGE_SIZE = 20

/** ดึงเฉพาะเวลาจากสตริงวันที่ (เช่น "27/02/2569 19:39:27" -> "19:39:27") ถ้าไม่มีเวลาให้แสดง "00:00:00" เพื่อให้ทุกรายการมีเวลาในรูปแบบ HH:mm:ss */
function extractDisplayTime(str) {
  const fallback = '00:00:00'
  if (!str || typeof str !== 'string') return fallback
  const trimmed = str.trim()
  const parts = trimmed.split(/\s+/)
  for (let i = parts.length - 1; i >= 0; i--) {
    const timeMatch = parts[i].match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
    if (timeMatch) {
      const h = timeMatch[1].padStart(2, '0')
      const m = timeMatch[2]
      const s = (timeMatch[3] || '00').padStart(2, '0')
      return `${h}:${m}:${s}`
    }
  }
  return fallback
}

function parseCheckDateForSort(str) {
  if (!str || typeof str !== 'string') return 0
  const trimmed = str.trim()
  const datePart = (trimmed.split(/\s+/)[0] || trimmed).trim()
  const parts = datePart.split('/')
  if (parts.length >= 3) {
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const y = parseInt(parts[2], 10)
    const yAd = y > 2400 ? y - 543 : y
    let t = new Date(yAd, m, d).getTime()
    if (isNaN(t)) return 0
    const timePart = trimmed.split(/\s+/)[1]
    const timeMatch = timePart && timePart.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
    if (timeMatch) {
      const h = parseInt(timeMatch[1], 10)
      const min = parseInt(timeMatch[2], 10)
      const sec = parseInt(timeMatch[3] || '0', 10)
      t += (h * 3600 + min * 60 + sec) * 1000
    }
    return t
  }
  return 0
}

function parseRequestDateForSort(str) {
  if (!str || typeof str !== 'string') return 0
  const thaiMonths = { 'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11 }
  const thaiMatch = str.match(/(\d+)\s+([^\s]+)\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (thaiMatch) {
    const d = parseInt(thaiMatch[1], 10)
    const m = thaiMonths[thaiMatch[2]]
    const y = parseInt(thaiMatch[3], 10) - 543
    if (m !== undefined) {
      let t = new Date(y, m, d).getTime()
      if (isNaN(t)) return 0
      if (thaiMatch[4] != null) {
        const h = parseInt(thaiMatch[4], 10)
        const min = parseInt(thaiMatch[5], 10)
        const sec = parseInt(thaiMatch[6] || '0', 10)
        t += (h * 3600 + min * 60 + sec) * 1000
      }
      return t
    }
  }
  const slashMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
  if (slashMatch) {
    const d = parseInt(slashMatch[1], 10)
    const m = parseInt(slashMatch[2], 10) - 1
    const y = parseInt(slashMatch[3], 10)
    const yAd = y > 2400 ? y - 543 : y
    let t = new Date(yAd, m, d).getTime()
    if (isNaN(t)) return 0
    if (slashMatch[4] != null) {
      const h = parseInt(slashMatch[4], 10)
      const min = parseInt(slashMatch[5], 10)
      const sec = parseInt(slashMatch[6] || '0', 10)
      t += (h * 3600 + min * 60 + sec) * 1000
    }
    return t
  }
  return 0
}

const historyUnified = computed(() => {
  const list = []
  checklistRecords.value.forEach((r) => {
    const sortTime = parseCheckDateForSort(r.checkDate)
    list.push({
      uid: 'c-' + r.id,
      type: 'checklist',
      sortTime,
      displayDate: r.checkDate || '-',
      displayTime: extractDisplayTime(r.checkDate),
      user: r.tester || '-',
      machine: [r.machineName, r.room].filter(Boolean).join(' ') || '-',
      typeLabel: formTypeToLabel[r.formType] || r.formType || 'แบบฟอร์ม',
      status: getChecklistStatus(r),
      statusClass: null,
      detail: '',
      remarks: '',
      jsonPreview: (r.jsonData && typeof r.jsonData === 'string') ? r.jsonData.substring(0, 500) : (r.jsonData ? JSON.stringify(r.jsonData).substring(0, 500) : '-'),
      raw: r,
      canPrint: !!formTypeToRoute[r.formType],
      machineId: null,
    })
  })
  repairRequests.value.forEach((r) => {
    const sortTime = parseRequestDateForSort(r.requestDate) || 0
    list.push({
      uid: 'r-' + r.id,
      type: 'repair',
      sortTime,
      displayDate: r.requestDate || '-',
      displayTime: extractDisplayTime(r.requestDate),
      user: r.reporterName || r.tester || '-',
      machine: [r.equipment, r.room].filter(Boolean).join(' ') || '-',
      typeLabel: 'แจ้งซ่อม',
      status: r.statusText || '-',
      statusClass: (r.statusText === 'ดำเนินการแล้ว') ? 'success' : 'warning',
      detail: r.detail || '',
      remarks: r.remarks || '',
      jsonPreview: '',
      raw: r,
      canPrint: false,
      machineId: null,
    })
  })
  list.sort((a, b) => b.sortTime - a.sortTime)
  return list
})

function getChecklistStatus(r) {
  try {
    const parsed = r.jsonData ? JSON.parse(r.jsonData) : {}
    if (parsed.summaryResult) return parsed.summaryResult
    if (Array.isArray(parsed.checklist)) {
      const hasFail = parsed.checklist.some((x) => (x.result || '').toLowerCase() === 'fail')
      return hasFail ? 'Fail' : 'Pass'
    }
  } catch (_) {}
  return '-'
}

const historyFiltered = computed(() => {
  let list = historyUnified.value
  if (historyFilters.value.type === 'checklist') list = list.filter((x) => x.type === 'checklist')
  if (historyFilters.value.type === 'repair') list = list.filter((x) => x.type === 'repair')
  if (historyFilters.value.machine) {
    const mid = historyFilters.value.machine.replace('machine-', '')
    const m = machines.value.find((x) => String(x.id) === mid)
    if (m) {
      const name = (m.machineName || '').trim()
      const room = (m.room || '').trim()
      list = list.filter((x) => {
        const raw = x.raw
        if (x.type === 'checklist') return (raw.machineName || '').trim() === name && (raw.room || '').trim() === room
        return (raw.equipment || '').trim() === name && (raw.room || '').trim() === room
      })
    }
  }
  if (historyFilters.value.dateFrom) {
    const tFrom = new Date(historyFilters.value.dateFrom).getTime()
    list = list.filter((x) => x.sortTime >= tFrom)
  }
  if (historyFilters.value.dateTo) {
    const tTo = new Date(historyFilters.value.dateTo).getTime() + 86400000
    list = list.filter((x) => x.sortTime <= tTo)
  }
  if (historyFilters.value.search && historyFilters.value.search.trim()) {
    const q = historyFilters.value.search.trim().toLowerCase()
    list = list.filter((x) =>
      (x.user || '').toLowerCase().includes(q) ||
      (x.machine || '').toLowerCase().includes(q) ||
      (x.typeLabel || '').toLowerCase().includes(q) ||
      (x.detail || '').toLowerCase().includes(q) ||
      (x.status || '').toLowerCase().includes(q)
    )
  }
  return list
})

const historyTotalPages = computed(() => Math.max(1, Math.ceil(historyFiltered.value.length / HISTORY_PAGE_SIZE)))
const paginatedHistory = computed(() => {
  const list = historyFiltered.value
  const start = (historyPage.value - 1) * HISTORY_PAGE_SIZE
  return list.slice(start, start + HISTORY_PAGE_SIZE)
})
const historyPaginationSummary = computed(() => {
  const total = historyFiltered.value.length
  if (total === 0) return 'ไม่มีรายการ'
  const start = (historyPage.value - 1) * HISTORY_PAGE_SIZE + 1
  const end = Math.min(historyPage.value * HISTORY_PAGE_SIZE, total)
  return `แสดง ${start}–${end} จาก ${total} รายการ (เรียงจากล่าสุด)`
})

const historyModal = ref({ open: false, data: null })

function openHistoryDetail(item) {
  historyModal.value.data = item
  historyModal.value.open = true
}

function applyHistoryFilters() {
  historyPage.value = 1
}

function clearHistoryFilters() {
  historyFilters.value = { type: '', machine: '', dateFrom: '', dateTo: '', search: '' }
  historyPage.value = 1
}

function getMachineQueryFromRow(row) {
  if (!row.machineName && !row.room) return ''
  const m = machines.value.find(
    (mach) =>
      (mach.machineName || '').trim() === (row.machineName || '').trim() &&
      (mach.room || '').trim() === (row.room || '').trim()
  )
  return m ? 'machine-' + m.id : (row.machineName || '')
}

function goToHistoryPrint(item) {
  if (item.type !== 'checklist' || !item.raw) return
  const row = item.raw
  const routeName = formTypeToRoute[row.formType]
  if (!routeName) {
    alert('ไม่พบแบบฟอร์มสำหรับรายการนี้')
    return
  }
  const machineQuery = getMachineQueryFromRow(row)
  router.push({
    name: routeName,
    query: { id: row.id, machine: machineQuery, date: row.checkDate || '' },
  })
}

function closeModalAndPrint() {
  const data = historyModal.value.data
  if (data) goToHistoryPrint(data)
  historyModal.value.open = false
}

watch(
  () => [historyFilters.value.type, historyFilters.value.machine, historyFilters.value.dateFrom, historyFilters.value.dateTo, historyFilters.value.search],
  () => { historyPage.value = 1 }
)
</script>

<style scoped>
.analytics-page {
  max-width: 1400px;
  margin: 0 auto;
}

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
.kpi-value { font-size: 1.8rem; font-weight: 800; line-height: 1.1; }
.kpi-value-text { font-size: 1.3rem; }
.kpi-unit { font-size: 1rem; font-weight: 600; opacity: 0.85; }
.kpi-label { font-size: 0.78rem; opacity: 0.9; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chart-card {
  border-radius: 14px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  overflow: hidden;
}
.chart-card .card-header { border-bottom: 1px solid #e2e8f0 !important; }

.risk-card {
  border-radius: 14px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  transition: transform 0.2s, box-shadow 0.2s;
}
.risk-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); }

.stat-box { background: #f8fafc; border-radius: 8px; padding: 8px 4px; }
.stat-num { font-weight: 700; font-size: 1.15rem; color: #1e293b; }
.stat-label { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; }

.caution-section { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
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

.caution-list { max-height: 320px; overflow-y: auto; }
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
.rfr-title { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
.rfr-name { font-size: 0.78rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rfr-tag { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.rtag-danger { background: #fee2e2; color: #991b1b; }
.rtag-warning { background: #fef3c7; color: #92400e; }
.rtag-info { background: #dbeafe; color: #1e40af; }
.rfr-stats { display: flex; align-items: center; gap: 5px; font-size: 0.7rem; color: #64748b; margin-bottom: 4px; }
.rfr-count { font-weight: 600; }
.rfr-sep { color: #cbd5e1; }
.rfr-pct { font-weight: 700; }
.rpct-danger { color: #dc2626; }
.rpct-warning { color: #d97706; }
.rpct-info { color: #2563eb; }
.rfr-recur { color: #0284C7; font-weight: 600; }
.rfr-bar-track { height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
.rfr-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
.rbar-danger { background: linear-gradient(90deg, #ef4444, #dc2626); }
.rbar-warning { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.rbar-info { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
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
.rfr-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 12px;
  font-size: 0.78rem;
  color: #059669;
  background: #f0fdf4;
}
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
.compliance-table tbody tr:hover { background: #f8fafc; }
.compliance-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef3c7; color: #92400e; }
.badge-overdue { background: #fee2e2; color: #991b1b; }
.badge-none { background: #f1f5f9; color: #94a3b8; }
.progress { background: #e2e8f0; }

.chart-container {
  position: relative;
  margin: auto;
}

.placeholder-selected {
  color: var(--text-muted, #94a3b8);
}

/* Chart & card containers */
.card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.panel {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main, #0f172a);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.panel-sub {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
  font-weight: 400;
}

.history-type-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-form {
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-repair {
  background: #fef3c7;
  color: #b45309;
}

.tag-status {
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-status.tag-success {
  background: #f0fdf4;
  color: #15803d;
}

.tag-status.tag-warning {
  background: #fef3c7;
  color: #b45309;
}

.tag-status.tag-secondary {
  background: #f1f5f9;
  color: #475569;
}

.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--text-secondary, #64748b);
}

.history-pagination-summary {
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}

.history-pagination-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info {
  font-size: 0.85rem;
  color: var(--text-main, #0f172a);
}

.history-btn-outline {
  background: transparent !important;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.history-btn-outline:hover {
  background: #f8fafc !important;
  color: #0f172a;
}

.history-select {
  min-width: 180px;
}

.modal-card-wide {
  max-width: 560px;
}

.modal-body-inner {
  margin-bottom: 16px;
}

.modal-body-inner p {
  margin-bottom: 8px;
}

.history-date {
  white-space: nowrap;
}

.history-time {
  white-space: nowrap;
}

.panel-body {
  padding: 20px;
}

.history-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: center;
}

.history-input,
.history-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

.history-input {
  background: var(--bg-card, #fff);
}

.history-btn {
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
  flex-shrink: 0;
  min-width: 100px;
}

.history-btn-search {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  border: none;
}

.history-btn-search:hover {
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
}

.history-btn-clear {
  flex-shrink: 0;
}

.tag-pass {
  background: #f0fdf4;
  color: #15803d;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-fail {
  background: #fef2f2;
  color: #dc2626;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.history-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.page-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 12px;
  cursor: pointer;
  background: var(--bg-card, #fff);
  transition: all var(--transition-fast, 150ms);
}

.page-btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.page-btn.active {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  border-color: transparent;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-table {
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
}

.history-table th {
  background: #f8fafc;
  color: var(--text-secondary, #475569);
  font-weight: 600;
  font-size: 0.85rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 28px;
  max-width: 600px;
  width: 92%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.modal-title {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.modal-section {
  margin-top: 16px;
}

.modal-json {
  background: #f8fafc;
  padding: 12px;
  border-radius: var(--radius-sm, 8px);
  max-height: 180px;
  overflow-y: auto;
  font-size: 0.8rem;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.modal-close {
  margin-top: 20px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm, 8px);
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast, 150ms);
}

.modal-close:hover {
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
}

/* Machine summary cards hover */
.card.border-danger:hover,
.card.border-warning:hover,
.card.border-success:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* Form select modern styling */
.form-select {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .history-filters { flex-direction: column; }
  .history-input { width: 100%; }
}
@media (max-width: 640px) {
  .chart-container { padding: 12px; }
  .panel { border-radius: 12px; }
  .panel-header { padding: 12px 14px; font-size: 0.85rem; }
  .panel-body { padding: 14px; }
  .history-body { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .history-pagination { flex-wrap: wrap; gap: 4px; }
  .page-btn { padding: 5px 10px; font-size: 0.78rem; }
  .modal-card { width: calc(100vw - 24px); padding: 16px; }
}
</style>
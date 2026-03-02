<template>
  <MainLayout>
    <div class="page" @click="closeFloatingUI">
      <!-- รายการบันทึก Checklist (ตาราง + filter) -->
      <div class="table-section-wrapper">
        <div class="table-section-header">
          <span class="table-section-title">รายการบันทึก Checklist</span>
        </div>
        <div class="table-panel" @click.stop>
          <!-- แถบ Filter -->
          <div class="filter-bar">
            <div class="filter-group">
              <label>เครื่อง X-ray</label>
              <select v-model="filterMachine" class="filter-select">
                <option value="">ทั้งหมด</option>
                <option
                  v-for="(label, value) in machineOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>
            <div class="filter-group">
              <label>ประเภทแบบฟอร์ม</label>
              <select v-model="filterFormType" class="filter-select">
                <option value="">ทั้งหมด</option>
                <option
                  v-for="opt in formTypeOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="filter-group">
              <label>จากวันที่</label>
              <div class="filter-date-wrapper">
                <input
                  v-model="filterDateFrom"
                  type="text"
                  class="filter-input"
                  placeholder="DD/MM/YYYY"
                  maxlength="10"
                  readonly
                  @focus="openFilterCalendar('from')"
                />
                <button
                  type="button"
                  class="filter-date-icon"
                  title="เลือกจากวันที่"
                  @click.stop="openFilterCalendar('from')"
                >
                  <i class="fa-solid fa-calendar-days"></i>
                </button>
              </div>
            </div>
            <div class="filter-group">
              <label>ถึงวันที่</label>
              <div class="filter-date-wrapper">
                <input
                  v-model="filterDateTo"
                  type="text"
                  class="filter-input"
                  placeholder="DD/MM/YYYY"
                  maxlength="10"
                  readonly
                  @focus="openFilterCalendar('to')"
                />
                <button
                  type="button"
                  class="filter-date-icon"
                  title="เลือกถึงวันที่"
                  @click.stop="openFilterCalendar('to')"
                >
                  <i class="fa-solid fa-calendar-days"></i>
                </button>
              </div>
            </div>
            <button type="button" class="btn-clear-filter" @click="clearTableFilters">
              <i class="fa-solid fa-xmark icon-btn icon-btn-close"></i>
            </button>
          </div>

          <!-- ตาราง -->
          <div class="table-responsive">
            <table class="records-table">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>ประเภทแบบฟอร์ม</th>
                  <th>เครื่อง</th>
                  <th>ห้อง</th>
                  <th>วันที่ตรวจ</th>
                  <th>ผู้ตรวจ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingRecords">
                  <td colspan="7" class="text-center">กำลังโหลด...</td>
                </tr>
                <tr v-else-if="filteredRecords.length === 0">
                  <td colspan="7" class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
                    <span>ไม่มีรายการ</span>
                  </td>
                </tr>
                <tr
                  v-else
                  v-for="(row, idx) in paginatedRecords"
                  :key="row.id"
                >
                  <td>{{ getSeqOnPage(idx) }}</td>
                  <td>{{ getFormTypeLabel(row.formType) }}</td>
                  <td>{{ row.machineName || '-' }}</td>
                  <td>{{ row.room || '-' }}</td>
                  <td>{{ row.checkDate || '-' }}</td>
                  <td>{{ row.tester || '-' }}</td>
                  <td>
                    <button
                      type="button"
                      class="btn-preview-row"
                      @click="goToPrintFromRow(row)"
                    >
                      ตัวอย่างไฟล์
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="!loadingRecords && filteredRecords.length > 0" class="pagination-wrap">
            <div class="pagination-summary">{{ paginationSummary }}</div>
            <div class="pagination-controls">
              <button
                type="button"
                class="pagination-btn pagination-prev"
                :disabled="currentPage <= 1"
                aria-label="หน้าก่อน"
                @click="goToPage(currentPage - 1)"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <div class="pagination-pages">
                <template v-for="p in visiblePageNumbers" :key="p">
                  <span v-if="p === '...'" class="pagination-ellipsis">…</span>
                  <button
                    v-else
                    type="button"
                    class="pagination-btn pagination-num"
                    :class="{ active: p === currentPage }"
                    @click="goToPage(p)"
                  >
                    {{ p }}
                  </button>
                </template>
              </div>
              <button
                type="button"
                class="pagination-btn pagination-next"
                :disabled="currentPage >= totalPages"
                aria-label="หน้าถัดไป"
                @click="goToPage(currentPage + 1)"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Export รายเดือน (F1 / F2) -->
      <div class="table-section-wrapper monthly-export-section">
        <div class="table-section-header">
          <span class="table-section-title">Export PDF รายเดือน (F1 / F2)</span>
        </div>
        <div class="table-panel monthly-export-panel">
          <div class="filter-bar monthly-export-bar">
            <div class="filter-group">
              <label>แบบฟอร์ม</label>
              <select v-model="monthlyFormType" class="filter-select">
                <option value="">-- เลือกแบบฟอร์ม --</option>
                <option value="F1_MONTHLY">F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์ (รายเดือน)</option>
                <option value="F2_MONTHLY">F2 : การลบแผ่นเพลท (รายเดือน)</option>
              </select>
            </div>
            <div class="filter-group">
              <label>เดือน / ปี</label>
              <input
                v-model="monthlyMonth"
                type="month"
                class="filter-input monthly-month-input"
              />
            </div>
            <div class="filter-group">
              <label>เครื่อง X-ray</label>
              <select v-model="monthlyMachine" class="filter-select">
                <option value="">ทั้งหมด</option>
                <option
                  v-for="(label, value) in machineOptions"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </div>
            <button
              type="button"
              class="btn-export-monthly"
              :disabled="!monthlyFormType || !monthlyMonth"
              @click="goToMonthlyPrint"
            >
              ส่งออก PDF รายเดือน
            </button>
          </div>
        </div>
      </div>

      <!-- ปฏิทินสำหรับ filter วันที่ -->
      <div
        v-if="isFilterCalendarVisible"
        class="calendar-popup-overlay"
        @click="isFilterCalendarVisible = false"
      >
        <div class="calendar-popup-box" @click.stop>
          <div class="calendar-header">
            <button class="nav-btn" type="button" @click.stop="changeFilterMonth(-1)">&lt;</button>
            <span class="month-title">{{ filterCalMonthYear }}</span>
            <button class="nav-btn" type="button" @click.stop="changeFilterMonth(1)">&gt;</button>
          </div>
          <div class="calendar-grid">
            <div class="weekday" v-for="d in weekdays" :key="d">{{ d }}</div>
            <div
              v-for="cell in filterDaysGrid"
              :key="cell.key"
              class="day-cell"
              :class="{
                'is-empty': !cell.day,
                'is-today': cell.isToday,
                'is-selected': cell.isSelected
              }"
              @click="cell.day ? selectFilterDate(cell.date) : null"
            >
              <div class="day-number">
                <span v-if="cell.day">{{ cell.day }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import { apiFetch } from '../api/client'
const router = useRouter()

const machine = ref('')
// checklistType เก็บ id ของ "รายการย่อย" ที่เลือก (เลือกได้แค่ 1 อัน)
const checklistType = ref('')
/* ตั้งค่าเริ่มต้นเป็นวันที่ปัจจุบัน DD/MM/YYYY */
const todayNow = new Date()
const defaultDate = `${String(todayNow.getDate()).padStart(2, '0')}/${String(todayNow.getMonth() + 1).padStart(2, '0')}/${todayNow.getFullYear()}`
const date = ref(defaultDate)

const isCalendarVisible = ref(false)
const isChecklistDropdownOpen = ref(false)

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currentMonthYear = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

// ---------- X-ray machine options (โหลดจาก API) ----------
const machines = ref([])
// Export รายเดือน (F1/F2)
const monthlyFormType = ref('')
const monthlyMachine = ref('')
const _dm = new Date()
const monthlyMonth = ref(`${_dm.getFullYear()}-${String(_dm.getMonth() + 1).padStart(2, '0')}`)

const machineOptions = computed(() => {
  const opts = {}
  machines.value.forEach(m => {
    const key = `machine-${m.id}`
    const label = `${m.machineName} ห้อง ${m.room || '-'}`
    opts[key] = label
  })
  return opts
})

// ---------- ตารางรายการบันทึก Checklist ----------
const PAGE_SIZE = 20
const currentPage = ref(1)
const checklistRecords = ref([])
const loadingRecords = ref(false)
const filterMachine = ref('')
const filterFormType = ref('')
const filterDateFrom = ref('')
const filterDateTo = ref('')
const isFilterCalendarVisible = ref(false)
const filterCalendarTarget = ref('from') // 'from' | 'to'
const filterCalMonth = ref(today.getMonth())
const filterCalYear = ref(today.getFullYear())

const filterCalMonthYear = computed(() => {
  return `${monthNames[filterCalMonth.value]} ${filterCalYear.value}`
})

const filterSelectedDate = computed(() => {
  const val = filterCalendarTarget.value === 'from' ? filterDateFrom.value : filterDateTo.value
  return parseDateString(val)
})

const filterDaysGrid = computed(() => {
  const cells = []
  const firstDayOfMonth = new Date(filterCalYear.value, filterCalMonth.value, 1).getDay()
  const daysInMonth = new Date(filterCalYear.value, filterCalMonth.value + 1, 0).getDate()

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ key: `fe-${i}`, day: null, isToday: false, isSelected: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(filterCalYear.value, filterCalMonth.value, d)
    const isToday =
      d === today.getDate() &&
      filterCalMonth.value === today.getMonth() &&
      filterCalYear.value === today.getFullYear()
    let isSelected = false
    if (filterSelectedDate.value) {
      isSelected =
        d === filterSelectedDate.value.getDate() &&
        filterCalMonth.value === filterSelectedDate.value.getMonth() &&
        filterCalYear.value === filterSelectedDate.value.getFullYear()
    }
    cells.push({ key: `fd-${d}`, day: d, date: dateObj, isToday, isSelected })
  }
  const totalCells = 42
  const cellsToFill = totalCells - cells.length
  for (let i = 0; i < cellsToFill; i++) {
    cells.push({ key: `fp-${i}`, day: null, isToday: false, isSelected: false })
  }
  return cells.slice(0, 42)
})

function changeFilterMonth(delta) {
  const newDate = new Date(filterCalYear.value, filterCalMonth.value + delta, 1)
  filterCalMonth.value = newDate.getMonth()
  filterCalYear.value = newDate.getFullYear()
}

function openFilterCalendar(target) {
  filterCalendarTarget.value = target
  const val = target === 'from' ? filterDateFrom.value : filterDateTo.value
  const parsed = parseDateString(val)
  if (parsed) {
    filterCalMonth.value = parsed.getMonth()
    filterCalYear.value = parsed.getFullYear()
  } else {
    filterCalMonth.value = today.getMonth()
    filterCalYear.value = today.getFullYear()
  }
  isFilterCalendarVisible.value = true
}

function selectFilterDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  const str = `${day}/${month}/${year}`
  if (filterCalendarTarget.value === 'from') {
    filterDateFrom.value = str
  } else {
    filterDateTo.value = str
  }
  isFilterCalendarVisible.value = false
}

// formType จาก API (F1_F2, F10, ...) → label และ route พิมพ์
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

const formTypeOptions = computed(() => {
  const seen = new Set()
  const list = []
  checklistRecords.value.forEach(r => {
    const ft = r.formType || ''
    if (ft && !seen.has(ft)) {
      seen.add(ft)
      list.push({ value: ft, label: formTypeToLabel[ft] || ft })
    }
  })
  list.sort((a, b) => (a.label || '').localeCompare(b.label || ''))
  return list
})

const filteredRecords = computed(() => {
  let list = checklistRecords.value
  if (filterMachine.value) {
    const m = machines.value.find(mach => `machine-${mach.id}` === filterMachine.value)
    if (m) {
      list = list.filter(r => (r.machineName || '').trim() === (m.machineName || '').trim() && (r.room || '').trim() === (m.room || '').trim())
    }
  }
  if (filterFormType.value) {
    list = list.filter(r => (r.formType || '') === filterFormType.value)
  }
  if (filterDateFrom.value && filterDateFrom.value.trim()) {
    const fromDate = parseDateString(filterDateFrom.value.trim())
    if (fromDate) {
      const fromTime = fromDate.getTime()
      list = list.filter(r => {
        const cd = parseCheckDate(r.checkDate || '')
        if (!cd) return false
        return cd.getTime() >= fromTime
      })
    }
  }
  if (filterDateTo.value && filterDateTo.value.trim()) {
    const toDate = parseDateString(filterDateTo.value.trim())
    if (toDate) {
      const toTime = toDate.getTime()
      list = list.filter(r => {
        const cd = parseCheckDate(r.checkDate || '')
        if (!cd) return false
        return cd.getTime() <= toTime
      })
    }
  }
  return list
})

const totalRecords = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / PAGE_SIZE)))
const paginatedRecords = computed(() => {
  const list = filteredRecords.value
  const start = (currentPage.value - 1) * PAGE_SIZE
  return list.slice(start, start + PAGE_SIZE)
})
const paginationSummary = computed(() => {
  const total = totalRecords.value
  if (total === 0) return 'ไม่มีรายการ'
  const start = (currentPage.value - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage.value * PAGE_SIZE, total)
  return `แสดง ${start}–${end} จาก ${total} รายการ`
})

const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  if (cur <= 4) {
    for (let i = 1; i <= Math.min(5, total); i++) pages.push(i)
    if (total > 5) pages.push('...', total)
  } else if (cur >= total - 3) {
    pages.push(1, '...')
    for (let i = total - 4; i <= total; i++) if (i > 1) pages.push(i)
  } else {
    pages.push(1, '...', cur - 1, cur, cur + 1, '...', total)
  }
  return pages
})

function getSeqOnPage(idx) {
  return (currentPage.value - 1) * PAGE_SIZE + idx + 1
}

function goToPage(page) {
  const p = Math.max(1, Math.min(page, totalPages.value))
  currentPage.value = p
}

function getFormTypeLabel(formType) {
  return formTypeToLabel[formType] || formType || '-'
}

function clearTableFilters() {
  filterMachine.value = ''
  filterFormType.value = ''
  filterDateFrom.value = ''
  filterDateTo.value = ''
  currentPage.value = 1
}

watch([filterMachine, filterFormType, filterDateFrom, filterDateTo], () => {
  currentPage.value = 1
})

async function loadChecklistRecords() {
  loadingRecords.value = true
  try {
    const res = await apiFetch('/GetAllChecklistRecords')
    if (res.ok) {
      const data = await res.json()
      checklistRecords.value = Array.isArray(data) ? data : []
    } else {
      checklistRecords.value = []
    }
  } catch (e) {
    console.error('Load checklist records error:', e)
    checklistRecords.value = []
  } finally {
    loadingRecords.value = false
  }
}

function getMachineQueryFromRow(row) {
  if (!row.machineName && !row.room) return ''
  const m = machines.value.find(mach =>
    (mach.machineName || '').trim() === (row.machineName || '').trim() &&
    (mach.room || '').trim() === (row.room || '').trim()
  )
  return m ? `machine-${m.id}` : (row.machineName || '')
}

function goToPrintFromRow(row) {
  const routeName = formTypeToRoute[row.formType]
  if (!routeName) {
    alert('ไม่พบแบบฟอร์มสำหรับรายการนี้')
    return
  }
  const machineQuery = getMachineQueryFromRow(row)
  const dateQuery = row.checkDate || ''
  router.push({
    name: routeName,
    query: {
      id: row.id,
      machine: machineQuery,
      date: dateQuery,
    },
  })
}

onMounted(async () => {
  try {
    const res = await apiFetch('/GetAllMachines')
    if (res.ok) {
      const data = await res.json()
      machines.value = Array.isArray(data) ? data : []
    }
  } catch (e) {
    console.error('Load machines error:', e)
  }
  await loadChecklistRecords()
})

// ---------- Checklist groups & items ----------
const checklistGroups = [
  {
    id: 'daily',
    label: 'Daily check',
    items: [
      {
        id: 'daily-care-xray',
        label: 'F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์',
      },
      {
        id: 'daily-erasure-ip',
        label: 'F2 : การลบแผ่นเพลท (Erasure of Imaging Plate)',
      },
    ],
  },
  {
    id: '1m',
    label: '1 Month',
    items: [
      {
        id: '1m-lightbox',
        label: 'F10 : แบบบันทึกการตรวจสอบความสว่างแสงไฟ',
      },
      {
        id: '1m-repeat-rate',
        label: 'F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ',
      },
    ],
  },
  {
    id: '3m',
    label: '3 Months',
    items: [
      {
        id: '3m-display-qc',
        label: 'F3 : การควบคุมคุณภาพจอภาพ (Display monitor)',
      },
      {
        id: '3m-record-xray',
        label: 'F4 : การบันทึกการตรวจสอบเครื่องเอกซเรย์',
      },
      {
        id: '3m-uniformity',
        label: 'F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)',
      },
      {
        id: '3m-exposure-index',
        label:
          'F6 : ความคงที่ของค่าดัชนีปริมาณรังสี (Consistency of Exposure Index)',
      },
    ],
  },
  {
    id: '6m',
    label: '6 Months',
    items: [
      {
        id: '6m-collimator',
        label: 'F7-1 : การทดสอบ collimator and beam alignment',
      },
      {
        id: '6m-collimator-bucky',
        label:
          'F7-2 : การทดสอบ collimator and beam alignment สำหรับ กรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)',
      },
      {
        id: '6m-dark-noise-cr',
        label: 'F8-1 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR',
      },
      {
        id: '6m-dark-noise-dr',
        label: 'F8-2 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR',
      },
      {
        id: '6m-lead-apron',
        label:
          'F9 : การตรวจสอบคุณภาพเสื้อตะกั่วและหารอยแตกของเสื้อตะกั่วด้วยรังสีเอกซ์',
      },
    ],
  },
  {
    id: 'thickness',
    label: 'แบบบันทึกผลการวัดความหนาผู้ป่วย',
    items: [
      {
        id: 'thickness-main',
        label: 'F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย',
      },
    ],
  },
  {
    id: 'usg-bmode',
    label:
      'แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์ : B-mode QC Test',
    items: [
      {
        id: 'usg-bmode-main',
        label:
          'F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์ : B-mode QC Test',
      },
    ],
  },
]
// ✅ เดือนสำหรับ dropdown (มกราคม-ธันวาคม)
const thaiMonths = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

// ✅ เป็น true เมื่อมีการเลือก item ใดๆ ที่อยู่ในกลุ่ม Daily check
const isDailyMode = computed(() => {
  const dailyGroup = checklistGroups.find((g) => g.id === 'daily')
  if (!dailyGroup) return false
  const dailyIds = dailyGroup.items.map((i) => i.id)
  return dailyIds.includes(checklistType.value)
})

// ✅ dropdown เดือนผูกกับ date (เก็บเป็น "MM/YYYY")
const monthOnly = computed({
  get() {
    if (!isDailyMode.value) return ''
    const parts = date.value.split('/')
    return parts.length === 2 ? parts[0] : ''
  },
  set(mm) {
    const year = currentYear.value || today.getFullYear()
    date.value = mm ? `${mm}/${year}` : ''
  },
})

// ✅ ป้องกันปฏิทินเด้งค้าง ถ้าเปลี่ยนมาเป็น Daily mode
watch(isDailyMode, (val) => {
  if (val) isCalendarVisible.value = false
})


// ---------- date helper ----------
const parseDateString = (str) => {
  if (!str || typeof str !== 'string') return null
  const trimmed = str.trim()
  const parts = trimmed.split('/')
  if (parts.length !== 3) return null
  const [dd, mm, yyyy] = parts.map(Number)
  if (!dd || !mm || !yyyy) return null
  const d = new Date(yyyy, mm - 1, dd)
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return null
  }
  return d
}

/**
 * รองรับ checkDate จาก API: DD/MM/YYYY, DD/MM/YYYY HH:mm:ss,
 * DD/MM/พ.ศ. (ปี พ.ศ. >= 2400 แปลงเป็น ค.ศ.), YYYY-MM-DD
 */
const parseCheckDate = (str) => {
  if (!str || typeof str !== 'string') return null
  const trimmed = str.trim()
  const datePart = trimmed.split(/\s+/)[0] || trimmed

  const slashParts = datePart.split('/')
  if (slashParts.length >= 3) {
    const dd = parseInt(slashParts[0], 10)
    const mm = parseInt(slashParts[1], 10)
    let yyyy = parseInt(slashParts[2], 10)
    if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return null
    if (yyyy >= 2400) yyyy -= 543
    const d = new Date(yyyy, mm - 1, dd)
    if (!isNaN(d.getTime()) && d.getDate() === dd && d.getMonth() === mm - 1 && d.getFullYear() === yyyy) return d
  }

  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    let [, yyyy, mm, dd] = iso.map(Number)
    if (yyyy >= 2400) yyyy -= 543
    const d = new Date(yyyy, mm - 1, dd)
    if (!isNaN(d.getTime())) return d
  }

  const parsed = parseDateString(trimmed)
  if (parsed) return parsed
  return null
}

const selectedDate = computed(() => parseDateString(date.value))

const daysGrid = computed(() => {
  const cells = []
  const firstDayOfMonth = new Date(
    currentYear.value,
    currentMonth.value,
    1,
  ).getDay()
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate()

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({
      key: `empty-${i}`,
      day: null,
      isToday: false,
      isSelected: false,
    })
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear.value, currentMonth.value, d)

    const isToday =
      d === today.getDate() &&
      currentMonth.value === today.getMonth() &&
      currentYear.value === today.getFullYear()

    let isSelected = false
    if (selectedDate.value) {
      isSelected =
        d === selectedDate.value.getDate() &&
        currentMonth.value === selectedDate.value.getMonth() &&
        currentYear.value === selectedDate.value.getFullYear()
    }

    cells.push({
      key: `day-${d}`,
      day: d,
      date: dateObj,
      isToday,
      isSelected,
    })
  }

  const totalCells = 42
  const cellsToFill = totalCells - cells.length
  for (let i = 0; i < cellsToFill; i++) {
    cells.push({
      key: `empty-post-${i}`,
      day: null,
      isToday: false,
      isSelected: false,
    })
  }

  return cells.slice(0, 42)
})

const changeMonth = (delta) => {
  const newDate = new Date(currentYear.value, currentMonth.value + delta, 1)
  currentMonth.value = newDate.getMonth()
  currentYear.value = newDate.getFullYear()
}

const selectDate = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  date.value = `${day}/${month}/${year}`
  isCalendarVisible.value = false
}

const openCalendarFromInput = () => {
  const parsed = parseDateString(date.value)
  if (parsed) {
    currentMonth.value = parsed.getMonth()
    currentYear.value = parsed.getFullYear()
  } else {
    currentMonth.value = today.getMonth()
    currentYear.value = today.getFullYear()
  }
  isCalendarVisible.value = true
}

const onlyNumber = (e) => {
  const char = String.fromCharCode(e.which)
  if (!/[0-9]/.test(char)) {
    e.preventDefault()
  }
}

const formatDate = () => {
  let value = date.value.replace(/\D/g, '')
  value = value.substring(0, 8)

  if (value.length > 2 && value.length <= 4) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  } else if (value.length > 4) {
    value =
      value.substring(0, 2) +
      '/' +
      value.substring(2, 4) +
      '/' +
      value.substring(4)
  }

  date.value = value
}

// ---------- Single-select logic ----------
const toggleChecklistDropdown = () => {
  isChecklistDropdownOpen.value = !isChecklistDropdownOpen.value
}

const selectItem = (id) => {
  checklistType.value = checklistType.value === id ? '' : id
  isChecklistDropdownOpen.value = false
}

// เอา label ของรายการที่เลือกไปแสดง
const selectedItemLabel = computed(() => {
  if (!checklistType.value) return ''
  for (const group of checklistGroups) {
    const found = group.items.find((item) => item.id === checklistType.value)
    if (found) return found.label
  }
  return ''
})

// ---------- ตรวจว่าเลือก Daily check หรือไม่ ----------
const isDailyCheck = computed(() => {
  if (!checklistType.value) return false
  const dailyGroup = checklistGroups.find((g) => g.id === 'daily')
  if (!dailyGroup) return false
  return dailyGroup.items.some((item) => item.id === checklistType.value)
})

// เมื่อเปลี่ยนชนิด checklist → ปรับรูปแบบวันที่อัตโนมัติ
watch(isDailyCheck, (isDaily) => {
  const now = new Date()
  if (isDaily) {
    // แสดงแค่เดือน/ปี
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    date.value = `${mm}/${now.getFullYear()}`
  } else {
    // แสดง DD/MM/YYYY
    const dd = String(now.getDate()).padStart(2, '0')
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    date.value = `${dd}/${mm}/${now.getFullYear()}`
  }
})

// ---------- Month picker logic (สำหรับ Daily check) ----------
const monthPickerNames = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
]

const selectMonth = (monthIndex) => {
  const mm = String(monthIndex + 1).padStart(2, '0')
  date.value = `${mm}/${currentYear.value}`
  isCalendarVisible.value = false
}

// ปิด dropdown เมื่อคลิกพื้นหลัง
const closeFloatingUI = () => {
  isChecklistDropdownOpen.value = false
}

// ---------- Mapping checklist item → route name ----------
const checklistRouteMap = {
  'daily-care-xray': 'XrayF1Print',
  'daily-erasure-ip': 'XrayF2Print',
  '1m-lightbox': 'XrayF10Print',
  '1m-repeat-rate': 'XrayF12Print',
  '3m-display-qc': 'XrayF3Print',
  '3m-record-xray': 'XrayF4Print',
  '3m-uniformity': 'XrayF5Print',
  '3m-exposure-index': 'XrayF6Print',
  '6m-collimator': 'XrayF71Print',
  '6m-collimator-bucky': 'XrayF72Print',
  '6m-dark-noise-cr': 'XrayF81Print',
  '6m-dark-noise-dr': 'XrayF82Print',
  '6m-lead-apron': 'XrayF9Print',
  'thickness-main': 'XrayF11Print',
  'usg-bmode-main': 'XrayF13Print',
}

// ---------- ไปหน้า Print ตาม F ที่เลือก ----------
const goToXrayPrint = () => {
  if (!checklistType.value) {
    alert('กรุณาเลือก Checklist type ก่อน')
    return
  }

  const routeName = checklistRouteMap[checklistType.value]
  if (!routeName) {
    alert('ไม่พบแบบฟอร์มสำหรับรายการที่เลือก')
    return
  }

  router.push({
    name: routeName,
    query: {
      machine: machine.value,
      date: date.value,
    },
  })
}

// ส่งออก PDF รายเดือน (F1 หรือ F2) — เปิดหน้า print ตามเดือนที่เลือก
function goToMonthlyPrint() {
  if (!monthlyFormType.value || !monthlyMonth.value) {
    alert('กรุณาเลือกแบบฟอร์มและเดือน/ปี')
    return
  }
  const routeName = monthlyFormType.value === 'F1_MONTHLY' ? 'XrayF1PrintMonthly' : 'XrayF2PrintMonthly'
  router.push({
    name: routeName,
    query: {
      month: monthlyMonth.value,
      machine: monthlyMachine.value || undefined,
    },
  })
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--text-secondary, #475569);
  font-weight: 600;
}

.input-shell {
  border-radius: var(--radius-md, 12px);
  padding: 3px 4px;
  background: #f8fafc;
  border: 1px solid var(--border-soft, #e2e8f0);
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  position: relative;
}

.input-shell:focus-within {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  background: #fff;
}

.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: none;
  padding: 10px 32px 10px 14px;
  font-size: 0.85rem;
  background: transparent;
  cursor: pointer;
  outline: none;
  color: var(--text-main, #0f172a);
}

select option {
  color: var(--text-main, #0f172a);
}

select option[disabled] {
  color: var(--text-muted, #94a3b8);
}

select:disabled {
  cursor: not-allowed;
}

select.select-placeholder {
  color: var(--text-muted, #94a3b8);
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none !important;
}

select::-ms-expand {
  display: none;
}

.arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--purple-soft, #0EA5E9);
  pointer-events: none;
}

.multiselect-trigger {
  cursor: pointer;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.multiselect-display {
  width: 100%;
  padding: 8px 32px 8px 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.placeholder-checklist {
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
}

.chip {
  padding: 4px 12px;
  border-radius: var(--radius-full, 9999px);
  background: #E0F2FE;
  font-size: 0.78rem;
  color: var(--purple-main, #0369A1);
  font-weight: 600;
}

.multiselect-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  background: var(--bg-card, #fff);
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  box-shadow: var(--shadow-lg, 0 8px 30px rgba(0,0,0,0.12));
  padding: 8px 10px 10px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 50;
}

.multi-group + .multi-group {
  border-top: 1px solid var(--border-soft, #e2e8f0);
  margin-top: 6px;
  padding-top: 6px;
}

.multi-group-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 4px 4px 4px 2px;
}

.group-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-main, #0f172a);
}

.multi-items {
  margin-top: 4px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.multi-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-sm, 8px);
  transition: all var(--transition-fast, 150ms);
}

.multi-item:hover {
  background: #f1f5f9;
}

.item-label {
  font-size: 0.8rem;
  text-align: left;
  color: var(--text-secondary, #475569);
}

.radio-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid var(--border-soft, #e2e8f0);
  margin-top: 2px;
  box-sizing: border-box;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-dot-checked {
  border-color: var(--purple-main, #0369A1);
}

.radio-dot-checked::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--purple-main, #0369A1);
}

.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  padding-right: 2px;
}

.date-wrapper input {
  border: none;
  outline: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 14px;
  font-size: 0.85rem;
  flex: 1;
  background: transparent;
  color: var(--text-main, #0f172a);
}

.date-wrapper input::placeholder {
  color: var(--text-muted, #94a3b8);
}

.date-icon {
  border: none;
  background: #f1f5f9;
  border-radius: var(--radius-sm, 8px);
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 4px;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.date-icon:hover {
  background: #e2e8f0;
}

.btn-primary {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(3,105,161,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3,105,161,0.4);
}

.preview-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.calendar-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-popup-box {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 20px;
  width: 340px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.month-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 150ms);
}

.nav-btn:hover {
  background: #f1f5f9;
}

.month-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 4px 0;
}

.month-cell {
  padding: 10px 4px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: #f8fafc;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-secondary, #475569);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.month-cell:hover {
  background: #f1f5f9;
}

.month-cell.is-today {
  border: 2px solid var(--purple-main, #0369A1);
}

.month-cell.is-selected {
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 0.8rem;
  text-align: center;
}

.weekday {
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  font-size: 0.65rem;
  text-transform: uppercase;
  padding-bottom: 8px;
}

.day-cell {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.day-cell.is-empty {
  pointer-events: none;
}

.day-cell:not(.is-empty):hover {
  background: #f1f5f9;
}

.day-number span {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-cell.is-today .day-number span {
  border: 2px solid var(--purple-main, #0369A1);
  color: var(--purple-main, #0369A1);
  font-weight: 700;
}

.day-cell.is-selected .day-number span {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(3,105,161,0.35);
}

/* ---------- Export รายเดือน ---------- */
.monthly-export-section .filter-bar.monthly-export-bar {
  grid-template-columns: 1fr 1fr 1fr auto;
  align-items: end;
}

.monthly-month-input {
  padding: 8px 10px;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: var(--radius-sm, 8px);
  font-size: 0.9rem;
  min-width: 140px;
}

.btn-export-monthly {
  padding: 10px 20px;
  border-radius: var(--radius-md, 12px);
  border: none;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
}

.btn-export-monthly:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn-export-monthly:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- ตารางรายการบันทึก Checklist ---------- */
.table-section-wrapper {
  max-width: 960px;
  width: 100%;
  margin-top: 24px;
}

.table-section-header {
  padding: 12px 24px;
  border-radius: var(--radius-xl, 20px) var(--radius-xl, 20px) 0 0;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
}

.table-panel {
  background: var(--bg-card, #fff);
  border-radius: 0 0 var(--radius-xl, 20px) var(--radius-xl, 20px);
  padding: 20px;
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  border-top: none;
}

.filter-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  align-items: end;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.filter-group label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
}

.filter-date-wrapper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f8fafc;
  padding-right: 6px;
  transition: border-color 200ms, box-shadow 200ms;
}

.filter-date-wrapper:focus-within {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  background: #fff;
}

.filter-date-wrapper .filter-input {
  min-width: 0;
  flex: 1;
  border: none;
  background: transparent;
  padding-right: 8px;
}

.filter-date-wrapper .filter-input:focus {
  box-shadow: none;
}

.filter-date-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--purple-soft, #0EA5E9);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms;
}

.filter-date-icon:hover {
  background: #E0F2FE;
}

.filter-select,
.filter-input {
  min-width: 160px;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  font-size: 0.85rem;
  background: #f8fafc;
  transition: border-color 200ms, box-shadow 200ms;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  background: #fff;
}

.btn-clear-filter {
  padding: 8px 16px;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: var(--radius-sm, 8px);
  background: #fff;
  font-size: 0.82rem;
  color: var(--text-secondary, #475569);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.btn-clear-filter:hover {
  background: #f1f5f9;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* ---------- Pagination ---------- */
.pagination-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-soft, #e2e8f0);
}

.pagination-summary {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: var(--radius-md, 10px);
  background: #fff;
  color: var(--text-main, #0f172a);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #2563eb;
}

.pagination-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination-btn.pagination-num.active {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.pagination-btn.pagination-num.active:hover {
  filter: brightness(1.05);
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
}

@media (max-width: 560px) {
  .pagination-wrap {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .pagination-controls {
    justify-content: center;
  }
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.records-table thead {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.records-table th {
  padding: 12px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 0.78rem;
  color: #fff;
  white-space: nowrap;
}

.records-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: var(--text-secondary, #475569);
}

.records-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.records-table tbody tr:hover {
  background: #f1f5f9;
}

.text-center {
  text-align: center;
}

.empty-state {
  padding: 32px 16px !important;
  text-align: center;
  color: var(--text-muted, #94a3b8);
  font-size: 0.85rem;
}

.empty-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
  opacity: 0.5;
}

.btn-preview-row {
  padding: 6px 14px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(3,105,161,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-preview-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3,105,161,0.4);
}

@media (max-width: 640px) {
  .form-group { margin-bottom: 12px; }
  .form-group label { font-size: 0.8rem; }
  .input-shell input, .input-shell select, .select-wrapper select { font-size: 0.82rem; padding: 8px 10px; }
  .btn-primary { padding: 10px 16px; font-size: 0.85rem; width: 100%; }
  .table-section-wrapper { margin-top: 16px; }
  .table-panel { padding: 14px; border-radius: 0 0 12px 12px; }
  .filter-bar { grid-template-columns: 1fr; gap: 10px; }
  .filter-select, .filter-input { min-width: 0; width: 100%; }
  .records-table th, .records-table td { padding: 8px 10px; font-size: 0.78rem; }
  .btn-preview-row { padding: 5px 10px; font-size: 0.72rem; }
}
</style>

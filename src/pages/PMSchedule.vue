<template>
  <MainLayout>
    <div class="container-fluid page-top">
      <div class="row justify-content-center">
        <div class="col-12 text-center mb-3">
          <h2>PM Schedule</h2>
        </div>

        <div class="col-lg-6 col-md-8">
          <div class="pm-card position-relative">
            <!-- การ์ดวันที่ด้านบน -->
            <div class="card date-card mb-3 mx-auto">
              <div class="date-inner">
                <div class="calendar-icon">
                  📅
                </div>
                <div class="date-text">
                  <p class="mb-0 fw-semibold">{{ headerDateText }}</p>
                  <p class="mb-0 text-muted">{{ headerWeekdayText }}</p>
                </div>
              </div>
            </div>


            <!-- การ์ดปฏิทิน -->
            <div class="card calendar-card mx-auto mb-3">
              <div
                class="calendar-header d-flex justify-content-between align-items-center mb-3"
              >
                <button class="nav-btn rounded-circle" @click="goPrevMonth">
                  &lt;
                </button>

                <span class="fw-semibold">
                  {{ monthNames[currentMonth] }} {{ currentYear }}
                </span>

                <button class="nav-btn rounded-circle" @click="goNextMonth">
                  &gt;
                </button>
              </div>

              <div class="calendar-grid">
                <!-- หัวตารางวัน -->
                <div
                  v-for="d in weekdays"
                  :key="d"
                  class="weekday fw-semibold text-muted"
                >
                  {{ d }}
                </div>

                <!-- ช่องวันที่ -->
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="day-cell"
                  :class="{
                    empty: !cell.day,
                    today: isToday(cell.day)
                  }"
                  @click="cell.day && openDayPopup(cell)"
                >
                  <div v-if="cell.day" class="day-number">
                    <span>{{ cell.day }}</span>
                  </div>

                  <div
                    v-if="
                      hasMonthlyTag(cell) ||
                      isDailySpecialCell(cell) ||
                      getCustomTagLabel(cell)
                    "
                    class="tag-stack"
                  >
                    <span class="tag-star">★</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Popup วัน — fixed center modal -->
            <div
              v-if="showDayPopup"
              class="day-modal-overlay"
              @click="closeAllPopups"
            >
              <div class="popup-box popup-day text-start" @click.stop>
                <div
                  class="popup-header d-flex justify-content-between align-items-center"
                >
                  <h5 class="mb-0 fw-bold">
                    {{ dayPopupTitle }}
                  </h5>
                  <div class="d-flex align-items-center gap-2">
                    <button
                      class="icon-btn"
                      @click.stop="openSettingsPopup"
                      title="ตั้งค่ารอบ"
                    >
                      <i class="fa-solid fa-gear"></i>
                    </button>

                    <button
                      class="icon-btn icon-btn-close"
                      @click.stop="closeAllPopups"
                      title="ปิด"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <hr class="popup-divider">

                <div class="popup-content">
                  <!-- บรรทัดความถี่ -->
                  <p
                    v-if="dayPopupFrequencyText"
                    class="mb-1 text-danger fw-bold"
                  >
                    {{ dayPopupFrequencyText }}
                  </p>

                  <!-- บรรทัดวัน-เดือน-ปี -->
                  <p v-if="dayPopupDateText" class="mb-2">
                    {{ dayPopupDateText }}
                  </p>

                  <!-- กรณีพิเศษ Daily -->
                  <template v-if="isDailySpecial">
                    <p class="fw-bold mb-1">รายการเครื่องที่ยังไม่ได้ทำ</p>
                    <ul class="mb-0 popup-list">
                      <li v-for="(task, idx) in dayTasks" :key="idx">
                        <span class="task-text">{{ task }}</span>
                      </li>
                    </ul>
                  </template>

                  <!-- กรณีอื่น ๆ (Monthly / Event ทั่วไป) -->
                  <template v-else>
                    <div v-if="dayTasks.length" class="detail-header">
                      <p class="fw-bold mb-0">รายละเอียด</p>
                      <div class="detail-actions">
                        <button
                          class="icon-btn-sm icon-btn-sm-primary"
                          @click.stop="toggleAddPopup"
                          title="เพิ่มรายการ"
                        >
                          <i class="fa-solid fa-plus"></i>
                        </button>
                        <button
                          class="icon-btn-sm icon-btn-sm-danger"
                          @click.stop="confirmClearAll"
                          title="ลบรายการทั้งหมด"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>

                    <div v-else-if="!dayPopupMonthlyType" class="detail-header">
                      <p class="mb-0">ไม่มีรายการ</p>
                      <div class="detail-actions">
                        <button
                          class="icon-btn-sm icon-btn-sm-primary"
                          @click.stop="toggleAddPopup"
                          title="เพิ่มรายการ"
                        >
                          <i class="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>

                    <ul v-if="dayTasks.length" class="mb-0 popup-list">
                      <li v-for="(task, idx) in dayTasks" :key="idx">
                        <span class="task-text">{{ task }}</span>
                        <button
                          class="item-delete-btn"
                          @click.stop="removeTask(idx)"
                          title="ลบรายการนี้"
                        >
                          ✕
                        </button>
                      </li>
                    </ul>
                  </template>

                  <!-- กล่องเพิ่ม event (textarea หลายบรรทัด) -->
                  <div v-if="showAddPopup" class="add-box mt-3">
                    <textarea
                      v-model="newEventText"
                      rows="2"
                      class="form-control form-control-sm mb-2"
                      placeholder="ชื่อรายการ"
                    ></textarea>
                    <div class="d-flex justify-content-end gap-3">
                      <span class="add-action text-danger" @click="cancelAdd">
                        ยกเลิก
                      </span>
                      <span
                        class="add-action text-success"
                        @click="handleAddEvent"
                      >
                        เพิ่ม
                      </span>
                    </div>
                  </div>

                  <div class="popup-footer">
                    <button class="btn-popup-save" @click.stop="closeAllPopups">
                      <i class="fa-solid fa-check"></i> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Popup Settings รอบ Monthly กลางจอ -->
            <div
              v-if="showSettingsPopup"
              class="settings-modal"
              @click="closeAllPopups"
            >
              <div class="popup-box popup-settings text-start" @click.stop>
                <div class="popup-header d-flex justify-content-between align-items-start">
                  <h5 class="fw-bold mb-0">รอบการทำ Monthly Check</h5>
                  <button
                    class="icon-btn icon-btn-close"
                    @click.stop="showSettingsPopup = false"
                    title="ปิด"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <hr class="popup-divider">
                <div class="mb-3">
                  <label class="form-label mb-1">Type</label>
                  <select
                    v-model="settingsType"
                    class="form-select form-select-sm"
                  >
                    <option value="1m">1 month</option>
                    <option value="3m">3 months</option>
                    <option value="6m">6 months</option>
                  </select>
                </div>
                <div v-if="saveConfigError" class="mb-2 text-danger small">
                  {{ saveConfigError }}
                </div>
                <div class="text-end">
                  <span
                    v-if="!saveConfigLoading"
                    class="text-success fw-semibold save-text"
                    @click="handleSaveSettings"
                  >
                    Save
                  </span>
                  <span v-else class="text-muted small">กำลังบันทึก...</span>
                </div>
              </div>
            </div>
            <!-- จบส่วน Settings -->
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import { apiFetch } from '../api/client'
import { getHospitalUiState, loadAndMigrateHospitalUiState, saveHospitalPmCalendar } from '../api/hospitalUiState.js'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekdayFull = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
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
  'December'
]

const headerDateText = computed(() => {
  const d = today.getDate()
  const m = monthNames[today.getMonth()]
  const y = today.getFullYear()
  return `${d} ${m} ${y}`
})
const headerWeekdayText = computed(() => weekdayFull[today.getDay()])

/* ---------- calendar cells ---------- */
const calendarCells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ key: `p-${i}`, day: null, isPadding: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: `d-${d}`, day: d, isPadding: false })
  }
  const totalCells = 42
  const remain = totalCells - cells.length
  for (let i = 0; i < remain; i++) {
    cells.push({ key: `s-${i}`, day: null, isPadding: true })
  }
  return cells
})

const goPrevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else currentMonth.value--
}

const goNextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else currentMonth.value++
}

const isToday = (day) => {
  if (!day) return false
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

const getCellDate = (cell) => {
  if (!cell.day) return null
  return new Date(currentYear.value, currentMonth.value, cell.day)
}

const dateKey = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/* ---------- state: popup วัน ---------- */
const dayPopupDate = ref(null)
const showDayPopup = ref(false)
const showAddPopup = ref(false)
const showSettingsPopup = ref(false)

const showAnyPopup = computed(
  () => showDayPopup.value || showSettingsPopup.value
)

/* events ต่อวัน (custom เพิ่มเอง) */
const eventsByDate = ref({})
const newEventText = ref('')

/* key: YYYY-MM-DD -> array ของข้อความ task ที่ไม่ต้องแสดงในวันนั้น */
const hiddenMonthlyTasksByDate = ref({})

/* key: YYYY-MM-DD -> true ถ้าวันนั้นปิด Daily Check แล้ว */
const disabledDailyDates = ref({})

/* รอบ monthly: ใช้เป็น "กฎ" โดย key = วันที่เริ่มทำรอบนั้น */
const monthlyTypeByStartDate = ref({}) // key: YYYY-MM-DD -> '1m' | '3m' | '6m'
const configIdByStartDate = ref({}) // key: YYYY-MM-DD -> config RID (จาก API)
const formTypesByStartDate = ref({}) // key: YYYY-MM-DD -> string[] (จาก API)
const settingsType = ref('1m')
const saveConfigLoading = ref(false)
const saveConfigError = ref('')

/* label ของ form type (สำหรับแสดงใน popup) */
const FORM_TYPE_LABELS = {
  F1_F2: 'F1/F2',
  F10: 'F10',
  F12: 'F12',
  F3_F6: 'F3-F6',
  F7_F8: 'F7-F8',
  F9: 'F9',
  F11: 'F11',
  F13: 'F13'
}

/* วัน Daily Check พิเศษ: 28 November 2025 */
const DAILY_SPECIAL_DATES = [
  { year: 2025, month: 10, day: 28 } // 28 November 2025 (month index 0-based)
]

/* รายการที่ต้องทำสำหรับ Monthly ในแต่ละรอบ */
const MONTHLY_TASKS_MAP = {
  '1m': [
    '-การตรวจสอบความสว่างแสงไฟ'
  ],
  '3m': [
    '-การควบคุมคุณภาพจอภาพ',
    '-แบบบันทึกการตรวจสอบเครื่องเอกซเรย์',
    '-ความสม่ำเสมอของภาพ',
    '-ความคงที่ของค่าดัชนีปริมาณรังสี'
  ],
  '6m': [
    '-การทดสอบ Collimator and Beam Alignment',
    '-การทดสอบ Collimator and Beam Alignment สำหรับกรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)',
    '-การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ DR',
    '-การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ CR',
    '-การตรวจสอบคุณภาพเสื้อตะกั่วและหารอยแตกของเสื้อตะกั่วด้วยรังสีเอกซ์'
  ]
}

/* Form types ตาม Type (mockup): บันทึกอัตโนมัติเมื่อเลือก Type */
const FORM_TYPES_BY_SCHEDULE_TYPE = {
  '1m': ['F10'],
  '3m': ['F3_F6'],
  '6m': ['F7_F8', 'F9']
}

const formTypesLabelByType = computed(() => {
  const codes = FORM_TYPES_BY_SCHEDULE_TYPE[settingsType.value] || []
  return codes.map(c => FORM_TYPE_LABELS[c] || c).join(', ')
})

/* ---------- helpers ---------- */
const isDailySpecialDate = (date) => {
  if (!date) return false

  const dateYear = date.getFullYear()
  const dateMonth = date.getMonth()
  const dateDay = date.getDate()

  const isBaseSpecial = DAILY_SPECIAL_DATES.some(
    (s) => s.year === dateYear && s.month === dateMonth && s.day === dateDay
  )

  if (!isBaseSpecial) return false

  const key = dateKey(date)
  return !disabledDailyDates.value[key]
}

/** หาว่าที่ date นี้มี Monthly รอบไหนบ้าง จากกฎที่เคยตั้งไว้ */
const getMonthlyTypeForDate = (date) => {
  if (!date) return null
  const dateDay = date.getDate()
  const dateMonth = date.getMonth()
  const dateYear = date.getFullYear()

  const entries = Object.entries(monthlyTypeByStartDate.value)
  for (const [startKey, type] of entries) {
    const [y, m, d] = startKey.split('-').map((v) => parseInt(v, 10))
    const startYear = y
    const startMonth = m - 1
    const startDay = d

    const startDate = new Date(startYear, startMonth, startDay)

    if (date < startDate) continue
    if (dateDay !== startDay) continue

    const diffMonths =
      (dateYear - startYear) * 12 + (dateMonth - startMonth)

    if (diffMonths < 0) continue

    if (type === '1m' && diffMonths % 1 === 0) return type
    if (type === '3m' && diffMonths % 3 === 0) return type
    if (type === '6m' && diffMonths % 6 === 0) return type
  }
  return null
}

/* tag helpers */
const hasMonthlyTag = (cell) => {
  const date = getCellDate(cell)
  if (!date) return false
  return !!getMonthlyTypeForDate(date)
}

const isDailySpecialCell = (cell) => {
  const date = getCellDate(cell)
  return isDailySpecialDate(date)
}

/* ป้ายสรุป custom event สีเขียว: แสดง 7 ตัวแรก + ... */
const getCustomTagLabel = (cell) => {
  const date = getCellDate(cell)
  if (!date) return ''
  const key = dateKey(date)
  const list = eventsByDate.value[key] || []
  if (!list.length) return ''

  const firstText = (list[0] || '').trim()
  if (!firstText) return ''

  if (firstText.length <= 7) return firstText
  return firstText.slice(0, 7) + '...'
}

/* ---------- computed สำหรับ popup วัน ---------- */
const currentDayKey = computed(() =>
  dayPopupDate.value ? dateKey(dayPopupDate.value) : null
)

const isDailySpecial = computed(() => isDailySpecialDate(dayPopupDate.value))

const dayPopupMonthlyType = computed(() => {
  if (!dayPopupDate.value) return null
  return getMonthlyTypeForDate(dayPopupDate.value)
})

const dayEvents = computed(() => {
  if (!currentDayKey.value) return []
  return eventsByDate.value[currentDayKey.value] || []
})

const monthlyTasksForCurrentDay = computed(() => {
  if (!dayPopupMonthlyType.value) return []

  const base = MONTHLY_TASKS_MAP[dayPopupMonthlyType.value] || []
  if (!currentDayKey.value) return base

  const hidden = hiddenMonthlyTasksByDate.value[currentDayKey.value] || []
  return base.filter((text) => !hidden.includes(text))
})

const dayPopupTitle = computed(() => {
  if (isDailySpecial.value) return 'Daily Check'
  if (dayPopupMonthlyType.value) return 'Monthly Check'
  if (dayEvents.value.length) return 'รายละเอียด'
  return 'ไม่มีรายการ'
})

const dayPopupFrequencyText = computed(() => {
  if (isDailySpecial.value) return 'ทำประจำทุกวัน'
  if (!dayPopupMonthlyType.value) return ''
  if (dayPopupMonthlyType.value === '1m') return 'ทำประจำทุก 1 เดือน'
  if (dayPopupMonthlyType.value === '6m') return 'ทำประจำทุก 6 เดือน'
  return 'ทำประจำทุก 3 เดือน'
})

const dayPopupDateText = computed(() => {
  if (!dayPopupDate.value) return ''
  const d = dayPopupDate.value.getDate()
  const w = weekdayFull[dayPopupDate.value.getDay()]
  const m = monthNames[dayPopupDate.value.getMonth()]
  const y = dayPopupDate.value.getFullYear()
  return `${w} ${d} ${m} ${y}`
})

/* รายการที่ไม่ได้ทำของ Daily Check */
const dailySpecialTasks = [
  '- X-ray shimazu รุ่น AAA ห้อง 1'
]


/* รวมรายการของวันนั้น */
const dayTasks = computed(() => {
  if (isDailySpecial.value) return dailySpecialTasks
  return [...monthlyTasksForCurrentDay.value, ...dayEvents.value]
})

/* ---------- methods popup ---------- */
const openDayPopup = (cell) => {
  const date = getCellDate(cell)
  if (!date) return
  dayPopupDate.value = date
  showDayPopup.value = true
  showAddPopup.value = false
}

const toggleAddPopup = () => {
  showAddPopup.value = !showAddPopup.value
}

const cancelAdd = () => {
  newEventText.value = ''
  showAddPopup.value = false
}

const handleAddEvent = () => {
  if (!dayPopupDate.value) return
  const text = newEventText.value.trim()
  if (!text) return
  const key = dateKey(dayPopupDate.value)
  const old = eventsByDate.value[key] || []
  eventsByDate.value = {
    ...eventsByDate.value,
    [key]: [...old, text]
  }
  newEventText.value = ''
  showAddPopup.value = false
}

const removeTask = (idx) => {
  if (!currentDayKey.value) return
  const key = currentDayKey.value

  if (isDailySpecial.value) {
    return
  }

  const monthlyVisible = monthlyTasksForCurrentDay.value

  if (idx < monthlyVisible.length) {
    const taskText = monthlyVisible[idx]
    const hidden = hiddenMonthlyTasksByDate.value[key] || []

    if (!hidden.includes(taskText)) {
      hiddenMonthlyTasksByDate.value = {
        ...hiddenMonthlyTasksByDate.value,
        [key]: [...hidden, taskText]
      }
    }
    return
  }

  const eventIdx = idx - monthlyVisible.length
  const old = eventsByDate.value[key] || []
  const next = old.filter((_, i) => i !== eventIdx)
  eventsByDate.value = {
    ...eventsByDate.value,
    [key]: next
  }
}

/* ลบข้อมูลทั้งวัน (รองรับ Daily + Monthly) */
const confirmClearAll = async () => {
  if (!confirm('คุณต้องการลบรายการทั้งหมดหรือไม่?')) return
  await clearDayData()
}

async function clearDayData () {
  if (!dayPopupDate.value) return
  const date = dayPopupDate.value
  const key = dateKey(date)

  const { [key]: removedEvents, ...restEvents } = eventsByDate.value
  eventsByDate.value = restEvents

  if (isDailySpecialDate(date)) {
    disabledDailyDates.value = {
      ...disabledDailyDates.value,
      [key]: true
    }

    const { [key]: removedHidden, ...restHidden } = hiddenMonthlyTasksByDate.value
    hiddenMonthlyTasksByDate.value = restHidden

    return
  }

  const configId = configIdByStartDate.value[key]
  if (configId != null) {
    try {
      await apiFetch(`/DeleteScheduleConfig/${configId}`, { method: 'DELETE' })
    } catch (e) {
      console.error('Delete schedule config failed', e)
    }
    const { [key]: _removedId, ...restIds } = configIdByStartDate.value
    configIdByStartDate.value = restIds
    const { [key]: _removedFt, ...restFt } = formTypesByStartDate.value
    formTypesByStartDate.value = restFt
  }

  const { [key]: removedType, ...restTypes } = monthlyTypeByStartDate.value
  monthlyTypeByStartDate.value = restTypes

  const { [key]: removedHidden2, ...restHidden2 } = hiddenMonthlyTasksByDate.value
  hiddenMonthlyTasksByDate.value = restHidden2
}

/* settings popup */
const openSettingsPopup = () => {
  if (!dayPopupDate.value) return
  const currentType = getMonthlyTypeForDate(dayPopupDate.value)
  settingsType.value = currentType || '1m'
  saveConfigError.value = ''
  showSettingsPopup.value = true
}

function parseFormTypesFromApi (formTypesJson) {
  if (!formTypesJson || typeof formTypesJson !== 'string') return []
  try {
    const arr = JSON.parse(formTypesJson)
    return Array.isArray(arr) ? arr.filter(Boolean) : []
  } catch {
    return []
  }
}

async function loadScheduleConfigs () {
  try {
    const res = await apiFetch('/GetAllScheduleConfigs')
    if (!res.ok) return
    const list = await res.json()
    if (!Array.isArray(list)) return

    const types = {}
    const ids = {}
    const formTypes = {}
    for (const c of list) {
      const startDate = c.startDate || ''
      if (!startDate) continue
      types[startDate] = c.frequencyType || '1m'
      ids[startDate] = c.id
      formTypes[startDate] = parseFormTypesFromApi(c.formTypes)
    }
    monthlyTypeByStartDate.value = { ...monthlyTypeByStartDate.value, ...types }
    configIdByStartDate.value = { ...configIdByStartDate.value, ...ids }
    formTypesByStartDate.value = { ...formTypesByStartDate.value, ...formTypes }
  } catch (e) {
    console.error('Load schedule configs failed', e)
  }
}

async function handleSaveSettings () {
  if (!dayPopupDate.value) return
  const startKey = dateKey(dayPopupDate.value)
  saveConfigError.value = ''
  saveConfigLoading.value = true

  try {
    const body = {
      startDate: startKey,
      frequencyType: settingsType.value,
      description: '',
      formTypes: FORM_TYPES_BY_SCHEDULE_TYPE[settingsType.value] ?? []
    }
    const configId = configIdByStartDate.value[startKey]

    if (configId != null) {
      const res = await apiFetch(`/UpdateScheduleConfig/${configId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const text = await res.text()
        saveConfigError.value = text || 'อัปเดตไม่สำเร็จ'
        return
      }
    } else {
      const res = await apiFetch('/AddScheduleConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const text = await res.text()
        saveConfigError.value = text || 'บันทึกไม่สำเร็จ'
        return
      }
      const data = await res.json()
      configIdByStartDate.value = {
        ...configIdByStartDate.value,
        [startKey]: data.id
      }
    }

    monthlyTypeByStartDate.value = {
      ...monthlyTypeByStartDate.value,
      [startKey]: settingsType.value
    }
    formTypesByStartDate.value = {
      ...formTypesByStartDate.value,
      [startKey]: FORM_TYPES_BY_SCHEDULE_TYPE[settingsType.value] ?? []
    }
    showSettingsPopup.value = false
  } catch (e) {
    console.error('Save schedule config failed', e)
    saveConfigError.value = e.message || 'เกิดข้อผิดพลาด'
  } finally {
    saveConfigLoading.value = false
  }
}

const closeAllPopups = () => {
  showDayPopup.value = false
  showAddPopup.value = false
  showSettingsPopup.value = false
}

/* ---------- Hospital-wide PM calendar (API) ---------- */
const suppressPmRemoteSave = ref(true)
let pmSaveTimer = null

async function applyPmCalendarFromServer(state) {
  eventsByDate.value = { ...(state.pmEventsByDate || {}) }
  hiddenMonthlyTasksByDate.value = { ...(state.pmHiddenMonthlyTasks || {}) }
  disabledDailyDates.value = { ...(state.pmDisabledDailyDates || {}) }
  monthlyTypeByStartDate.value = {
    ...(state.pmMonthlyRules || {}),
    ...monthlyTypeByStartDate.value
  }
}

async function refreshPmCalendarFromServer() {
  try {
    suppressPmRemoteSave.value = true
    const state = await getHospitalUiState()
    await applyPmCalendarFromServer(state)
    await nextTick()
    suppressPmRemoteSave.value = false
  } catch (e) {
    console.error('refreshPmCalendarFromServer', e)
    suppressPmRemoteSave.value = false
  }
}

function schedulePersistPmCalendar() {
  if (suppressPmRemoteSave.value) return
  clearTimeout(pmSaveTimer)
  pmSaveTimer = setTimeout(async () => {
    try {
      await saveHospitalPmCalendar({
        pmEventsByDate: eventsByDate.value,
        pmMonthlyRules: monthlyTypeByStartDate.value,
        pmHiddenMonthlyTasks: hiddenMonthlyTasksByDate.value,
        pmDisabledDailyDates: disabledDailyDates.value
      })
    } catch (e) {
      console.error('saveHospitalPmCalendar', e)
    }
  }, 700)
}

function onPmVisibility() {
  if (document.hidden) return
  refreshPmCalendarFromServer()
}

onMounted(async () => {
  await loadScheduleConfigs()

  try {
    const state = await loadAndMigrateHospitalUiState()
    await applyPmCalendarFromServer(state)
  } catch (e) {
    console.error('load hospital PM calendar state', e)
  }

  await nextTick()
  suppressPmRemoteSave.value = false
  document.addEventListener('visibilitychange', onPmVisibility)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onPmVisibility)
  clearTimeout(pmSaveTimer)
})

watch(
  () => ({
    e: eventsByDate.value,
    m: monthlyTypeByStartDate.value,
    h: hiddenMonthlyTasksByDate.value,
    d: disabledDailyDates.value
  }),
  () => {
    schedulePersistPmCalendar()
  },
  { deep: true }
)
</script>

<style scoped>
.pm-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

.date-card,
.calendar-card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-xl, 20px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  max-width: 460px;
  width: 100%;
}

.date-card {
  padding: 16px 20px;
}

.calendar-card {
  padding: 18px 20px 22px;
}

.date-inner {
  display: flex;
  align-items: center;
}

.calendar-icon {
  font-size: 1rem;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md, 12px);
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0284C7;
  margin-right: 14px;
}

.date-text p {
  text-align: left;
  color: var(--text-main, #0f172a);
}

.date-text p:last-child {
  color: var(--text-muted, #94a3b8);
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.nav-btn:hover {
  background: #f1f5f9;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 0.78rem;
  justify-items: center;
}

.weekday {
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  padding-bottom: 8px;
}

.day-cell {
  position: relative;
  min-height: 42px;
  width: 100%;
  max-width: 50px;
  cursor: pointer;
  border-radius: var(--radius-sm, 8px);
  padding-top: 6px;
  padding-bottom: 20px;
  transition: all var(--transition-fast, 150ms);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-cell.empty {
  background: transparent;
  cursor: default;
}

.day-cell:not(.empty):hover {
  background: #f8fafc;
}

.day-number span {
  font-size: 0.9rem;
}

.day-cell.today .day-number span {
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
}

.tag-stack {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-star {
  font-size: 0.65rem;
  color: #3b82f6;
  line-height: 1;
}

.day-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-box {
  border-radius: var(--radius-xl, 20px);
  padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  position: relative;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.popup-day {
  background: var(--bg-card, #fff);
  width: 420px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}

.popup-settings {
  background: var(--bg-card, #fff);
  width: 380px;
  max-width: calc(100vw - 32px);
}

.popup-divider {
  border-color: var(--border-soft, #e2e8f0);
  margin: 12px 0 14px;
}

.popup-content p {
  font-size: 0.9rem;
}

.popup-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.popup-list li {
  font-size: 0.9rem;
  margin-bottom: 4px;
  position: relative;
  padding-left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-list li::before {
  content: '';
}

.task-text {
  flex: 1;
  margin-right: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f8fafc;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: var(--text-secondary, #475569);
  transition: all var(--transition-fast, 150ms);
}

.icon-btn:hover {
  background: #e2e8f0;
}

.icon-btn-danger {
  border-color: #fecaca;
  background: #fef2f2;
  color: #dc2626;
}

.icon-btn-danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.icon-btn-primary {
  border-color: #7DD3FC;
  background: #E0F2FE;
  color: var(--purple-main, #0369A1);
}

.icon-btn-primary:hover {
  background: #BAE6FD;
  border-color: #38BDF8;
}

.icon-btn-close {
  border-color: var(--border-soft, #e2e8f0);
  background: #f1f5f9;
  color: var(--text-muted, #94a3b8);
  font-size: 0.9rem;
}

.icon-btn-close:hover {
  background: #e2e8f0;
  color: var(--text-main, #0f172a);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn-sm {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  transition: all var(--transition-fast, 150ms);
}

.icon-btn-sm-danger {
  background: #fef2f2;
  color: #dc2626;
}

.icon-btn-sm-danger:hover {
  background: #fee2e2;
}

.icon-btn-sm-primary {
  background: #E0F2FE;
  color: var(--purple-main, #0369A1);
}

.icon-btn-sm-primary:hover {
  background: #BAE6FD;
}

.item-delete-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 0.8rem;
  cursor: pointer;
}

.add-box {
  background: #f8fafc;
  border-radius: var(--radius-md, 12px);
  padding: 12px;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.add-box textarea {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 10px;
  font-size: 0.85rem;
}

.add-action {
  font-size: 0.8rem;
  cursor: pointer;
}

.popup-footer {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft, #e2e8f0);
  display: flex;
  justify-content: flex-end;
}

.btn-popup-save {
  padding: 8px 24px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-popup-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.save-text {
  cursor: pointer;
}

.settings-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
}

.settings-modal .form-label,
.settings-modal .form-select {
  font-size: 0.85rem;
}

.settings-modal .form-select {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.form-types-mockup {
  font-size: 0.85rem;
}

.form-types-mockup .form-label-mockup {
  display: block;
  color: var(--text-muted, #64748b);
  margin-bottom: 4px;
}

.form-types-mockup .form-types-list {
  color: var(--text-main, #0f172a);
  font-weight: 500;
}

.page-top {
  padding-top: 1px !important;
}

.page-top h2 {
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

@media (max-width: 1024px) {
  .date-card, .calendar-card { max-width: 100%; }
}
@media (max-width: 640px) {
  .page-top h2 { font-size: 1.2rem; }
  .date-card { padding: 12px 14px; }
  .calendar-card { padding: 12px 14px 16px; }
  .calendar-grid { column-gap: 4px; row-gap: 6px; font-size: 0.75rem; }
  .day-cell { min-height: 36px; }
  .tag-pill { font-size: 0.45rem; padding: 0 3px; }
  .popup-day { width: calc(100vw - 32px); }
  .popup-settings { width: calc(100vw - 32px); max-width: 280px; }
}
</style>

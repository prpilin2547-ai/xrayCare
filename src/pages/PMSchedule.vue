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

                  <!-- stack แท็กต่าง ๆ ใต้ตัวเลขวัน -->
                  <div
                    v-if="
                      hasMonthlyTag(cell) ||
                      isDailySpecialCell(cell) ||
                      getCustomTagLabel(cell)
                    "
                    class="tag-stack"
                  >
                    <!-- Monthly check (ฟ้า) -->
                    <div
                      v-if="hasMonthlyTag(cell)"
                      class="tag-pill monthly-tag-blue"
                    >
                      <span class="star">★</span>
                      <span>Monthly Check</span>
                    </div>

                    <!-- Daily check (แดง) -->
                    <div
                      v-if="isDailySpecialCell(cell)"
                      class="tag-pill monthly-tag-red"
                    >
                      <span class="star">★</span>
                      <span>Daily Check</span>
                    </div>

                    <!-- custom event (เขียว) 7 ตัวอักษรแรก + ... -->
                    <div
                      v-if="getCustomTagLabel(cell)"
                      class="tag-pill custom-tag"
                    >
                      <span class="star">★</span>
                      <span>{{ getCustomTagLabel(cell) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- overlay ทั้งหมด -->
            <div
              v-if="showAnyPopup"
              class="popup-overlay"
              @click="closeAllPopups"
            ></div>

            <!-- Popup วัน (สีชมพู) + Add -->
            <div
              v-if="showDayPopup"
              class="popup-row"
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
                    <!-- settings -->
                    <button
                      class="icon-btn rounded-circle"
                      @click.stop="openSettingsPopup"
                    >
                      ⚙️
                    </button>

                    <!-- ปุ่มลบทั้ง Daily / Monthly + events ของวันนั้น -->
                    <button
                      class="icon-btn icon-btn-red rounded-circle"
                      @click.stop="clearDayData"
                      title="ลบข้อมูลของวันนี้"
                    >
                      🗑
                    </button>

                    <!-- plus -->
                    <button
                      class="icon-btn icon-btn-red rounded-circle"
                      @click.stop="toggleAddPopup"
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr class="popup-divider" />

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
                    <p v-if="dayTasks.length" class="fw-bold mb-1">
                      รายละเอียด
                    </p>

                    <p v-else-if="!dayPopupMonthlyType" class="mb-0">
                      ไม่มีรายการ
                    </p>

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
                        class="add-action text-secondary"
                        @click="handleAddEvent"
                      >
                        เพิ่ม
                      </span>
                    </div>
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
                <h5 class="fw-bold mb-2">รอบการทำ Monthly Check</h5>
                <hr class="popup-divider" />
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
                <div class="text-end">
                  <span
                    class="text-danger fw-semibold save-text"
                    @click="handleSaveSettings"
                  >
                    Save
                  </span>
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
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

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

/** key สำหรับเก็บใน localStorage */
const STORAGE_EVENTS_KEY = 'pmEventsByDate'
const STORAGE_RULES_KEY = 'pmMonthlyRules'
const STORAGE_HIDDEN_MONTHLY_KEY = 'pmHiddenMonthlyTasks'
const STORAGE_DAILY_DISABLED_KEY = 'pmDisabledDailyDates'

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
const settingsType = ref('1m')

/* วัน Daily Check พิเศษ: 28 November 2025 */
const DAILY_SPECIAL_DATES = [
  { year: 2025, month: 10, day: 28 } // 28 November 2025 (month index 0-based)
]

/* รายการที่ต้องทำสำหรับ Monthly ในแต่ละรอบ */
const MONTHLY_TASKS_MAP = {
  '1m': [
    '-การตรวจสอบความสว่างแสงไฟ',
    '-แบบบันทึกอัตราการถ่ายภาพซ้ำ'
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
const clearDayData = () => {
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
  showSettingsPopup.value = true
}

const handleSaveSettings = () => {
  if (!dayPopupDate.value) return
  const startKey = dateKey(dayPopupDate.value)
  monthlyTypeByStartDate.value = {
    ...monthlyTypeByStartDate.value,
    [startKey]: settingsType.value
  }
  showSettingsPopup.value = false
}

const closeAllPopups = () => {
  showDayPopup.value = false
  showAddPopup.value = false
  showSettingsPopup.value = false
}

/* ---------- localStorage ---------- */
onMounted(() => {
  try {
    const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY)
    if (savedEvents) {
      eventsByDate.value = JSON.parse(savedEvents)
    }
  } catch (e) {
    console.error('Cannot load events from storage', e)
  }

  try {
    const savedRules = localStorage.getItem(STORAGE_RULES_KEY)
    if (savedRules) {
      monthlyTypeByStartDate.value = JSON.parse(savedRules)
    }
  } catch (e) {
    console.error('Cannot load monthly rules from storage', e)
  }

  try {
    const savedHiddenMonthly = localStorage.getItem(STORAGE_HIDDEN_MONTHLY_KEY)
    if (savedHiddenMonthly) {
      hiddenMonthlyTasksByDate.value = JSON.parse(savedHiddenMonthly)
    }
  } catch (e) {
    console.error('Cannot load hidden monthly tasks from storage', e)
  }

  try {
    const savedDisabledDaily = localStorage.getItem(STORAGE_DAILY_DISABLED_KEY)
    if (savedDisabledDaily) {
      disabledDailyDates.value = JSON.parse(savedDisabledDaily)
    }
  } catch (e) {
    console.error('Cannot load disabled daily dates from storage', e)
  }
})

watch(
  eventsByDate,
  (val) => {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(val))
    } catch (e) {
      console.error('Cannot save events to storage', e)
    }
  },
  { deep: true }
)

watch(
  monthlyTypeByStartDate,
  (val) => {
    try {
      localStorage.setItem(STORAGE_RULES_KEY, JSON.stringify(val))
    } catch (e) {
      console.error('Cannot save monthly rules to storage', e)
    }
  },
  { deep: true }
)

watch(
  hiddenMonthlyTasksByDate,
  (val) => {
    try {
      localStorage.setItem(
        STORAGE_HIDDEN_MONTHLY_KEY,
        JSON.stringify(val)
      )
    } catch (e) {
      console.error('Cannot save hidden monthly tasks to storage', e)
    }
  },
  { deep: true }
)

watch(
  disabledDailyDates,
  (val) => {
    try {
      localStorage.setItem(
        STORAGE_DAILY_DISABLED_KEY,
        JSON.stringify(val)
      )
    } catch (e) {
      console.error('Cannot save disabled daily dates to storage', e)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.pm-card {
  background-color: transparent;
  border: none !important;
  box-shadow: none !important;
}

.date-card,
.calendar-card {
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #d4d4d4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  max-width: 420px;
  width: 100%;
}

.date-card {
  padding: 12px 24px;
}

.calendar-card {
  padding: 16px 24px 20px;
}

.date-inner {
  display: flex;
  align-items: center;
}

.calendar-icon {
  font-size: 1.6rem;
  margin-right: 12px;
}

.date-text p {
  text-align: left;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  line-height: 1;
  font-size: 0.9rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 16px;
  row-gap: 12px;
  font-size: 0.82rem;
  justify-items: center;
}

.weekday {
  padding: 4px 0;
}

.day-cell {
  min-height: 40px;
  border-radius: 12px;
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.day-cell.empty {
  background-color: transparent;
  cursor: default;
}

.day-number span {
  font-size: 0.9rem;
}

.day-cell.today .day-number span {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 2px solid #111827;
  align-items: center;
  justify-content: center;
}

/* stack แท็กทั้งหมดให้ไม่ทับกัน */
.tag-stack {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

/* pill base ทั้งฟ้า แดง เขียว */
.tag-pill {
  padding: 1px 6px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.6rem;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.tag-stack .star {
  margin-right: 4px;
  font-size: 0.6rem;
}

.monthly-tag-blue {
  background-color: #1d4ed8;
}

.monthly-tag-red {
  background-color: #dc2626;
}

.custom-tag {
  background-color: #16a34a;
}

/* overlay */
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 900;
}

/* popup base */
.popup-box {
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  position: relative;
}

.popup-row {
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 1000;
}

/* popup วันสีชมพู */
.popup-day {
  background-color: #f7c4d2;
  width: 360px;
}

.popup-divider {
  border-color: rgba(255, 255, 255, 0.9);
  opacity: 0.9;
  margin: 8px 0 10px;
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

/* ข้อความรายการ */
.task-text {
  flex: 1;
  margin-right: 8px;
}

/* ปุ่มไอคอน */
.icon-btn {
  width: 26px;
  height: 26px;
  border: none;
  background-color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
}

.icon-btn-red {
  background-color: #dc2626;
  color: #ffffff;
}

/* ปุ่มลบใน list */
.item-delete-btn {
  border: none;
  background: transparent;
  color: #dc2626;
  font-size: 0.8rem;
  cursor: pointer;
}

/* กล่อง Add */
.add-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 8px 10px;
}

.add-action {
  font-size: 0.8rem;
  cursor: pointer;
}

/* popup settings */
.popup-settings {
  background-color: #f7eeee;
  width: 260px;
}

.save-text {
  cursor: pointer;
}

/* กล่อง settings กลางจอ */
.settings-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.page-top {
  padding-top: 1px !important;
}

.page-top h2 {
  margin-top: 0;
  margin-bottom: 0px;
}

</style>

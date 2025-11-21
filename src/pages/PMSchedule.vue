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
              <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
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

                  <!-- แท็ก Monthly check (ฟ้า) -->
                  <div
                    v-if="hasMonthlyTag(cell)"
                    class="monthly-tag monthly-tag-blue"
                  >
                    <span class="star">★</span>
                    <span>Monthly Check</span>
                  </div>

                  <!-- แท็ก Daily (แดง) วันที่ 20/11/2025 -->
                  <div
                    v-if="isDailySpecialCell(cell)"
                    class="monthly-tag monthly-tag-red"
                  >
                    <span class="star">★</span>
                    <span>Daily Check</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- overlay -->
            <div v-if="showAnyPopup" class="popup-overlay" @click="closeAllPopups"></div>

            <!-- Popup วัน (สีชมพู) + Add -->
            <div v-if="showDayPopup" class="popup-row" @click.stop>
              <div class="popup-box popup-day text-start">
                <div class="popup-header d-flex justify-content-between align-items-center">
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

                    <!-- ปุ่มลบทั้ง Monthly + events ของวันนั้น // NEW -->
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

                  <!-- กรณีพิเศษ Daily วันที่ 20/11/2025 -->
                  <template v-if="isDailySpecial">
                    <p class="fw-bold mb-1">รายการที่ไม่ได้ทำ</p>
                    <ul class="mb-0 popup-list">
                      <li v-for="(task, idx) in dayTasks" :key="idx">
                        <span class="task-text">{{ task }}</span>
                      </li>
                    </ul>
                  </template>

                  <!-- กรณีอื่น ๆ -->
                  <template v-else>
                    <!-- ถ้ามีรายการจริง ๆ ก็แสดงหัวข้อ "รายการ" -->
                    <p v-if="dayTasks.length" class="fw-bold mb-1">รายการ</p>

                    <!-- ถ้ายังไม่มีรายการ และยังไม่ได้ตั้ง Monthly Check เลย ค่อยแสดง "ไม่มีรายการ" -->
                    <p v-else-if="!dayPopupMonthlyType" class="mb-0">ไม่มีรายการ</p>

                    <ul v-if="dayTasks.length" class="mb-0 popup-list">
                      <li
                        v-for="(task, idx) in dayTasks"
                        :key="idx"
                      >
                        <span class="task-text">{{ task }}</span>
                        <!-- ปุ่มลบ event ทีละรายการ // NEW -->
                        <button
                          class="item-delete-btn"
                          @click.stop="removeEvent(idx)"
                          title="ลบรายการนี้"
                        >
                          ✕
                        </button>
                      </li>
                    </ul>
                  </template>

                  <!-- กล่องเพิ่ม event -->
                  <div v-if="showAddPopup" class="add-box mt-3">
                    <input
                      v-model="newEventText"
                      type="text"
                      class="form-control form-control-sm mb-2"
                      placeholder="ชื่อรายการ"
                      @keyup.enter="handleAddEvent"
                    />
                    <div class="d-flex justify-content-end gap-3">
                      <span class="add-action text-danger" @click="cancelAdd">
                        ยกเลิก
                      </span>
                      <span class="add-action text-secondary" @click="handleAddEvent">
                        เพิ่ม
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Popup Settings รอบ Monthly -->
              <div
                v-if="showSettingsPopup"
                class="popup-box popup-settings text-start"
                @click.stop
              >
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
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
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

/* events ต่อวัน */
const eventsByDate = ref({})
const newEventText = ref('')

/* รอบ monthly ต่อวัน */
const monthlyTypeByDate = ref({}) // key: YYYY-MM-DD -> '1m' | '3m' | '6m'
const settingsType = ref('1m')

/* special date 20/11/2025 */
const DAILY_SPECIAL = {
  year: 2025,
  month: 10, // November (0-based)
  day: 20
}

const isDailySpecialDate = (date) => {
  if (!date) return false
  return (
    date.getFullYear() === DAILY_SPECIAL.year &&
    date.getMonth() === DAILY_SPECIAL.month &&
    date.getDate() === DAILY_SPECIAL.day
  )
}

/* tag helpers */
const hasMonthlyTag = (cell) => {
  const date = getCellDate(cell)
  if (!date) return false
  const key = dateKey(date)
  return !!monthlyTypeByDate.value[key]
}

const isDailySpecialCell = (cell) => {
  const date = getCellDate(cell)
  return isDailySpecialDate(date)
}

/* computed สำหรับ popup วัน */
const currentDayKey = computed(() =>
  dayPopupDate.value ? dateKey(dayPopupDate.value) : null
)

const isDailySpecial = computed(() => isDailySpecialDate(dayPopupDate.value))

const dayPopupMonthlyType = computed(() => {
  if (!currentDayKey.value) return null
  return monthlyTypeByDate.value[currentDayKey.value] || null
})

const dayPopupTitle = computed(() => {
  if (isDailySpecial.value) return 'Daily Check'
  if (dayPopupMonthlyType.value) return 'Monthly Check'
  if (dayEvents.value.length) return 'รายการ'
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

const dayEvents = computed(() => {
  if (!currentDayKey.value) return []
  return eventsByDate.value[currentDayKey.value] || []
})

const dailySpecialTasks = [
  'การควบคุมคุณภาพจอภาพ',
  'ตรวจสอบเครื่องเอกซเรย์',
  'ความสม่ำเสมอของภาพ',
  'ความคงที่ของดัชนีปริมาณรังสี'
]

const dayTasks = computed(() => {
  if (isDailySpecial.value) return dailySpecialTasks
  return dayEvents.value
})

/* ---------- methods popup ---------- */
const openDayPopup = (cell) => {
  const date = getCellDate(cell)
  if (!date) return
  dayPopupDate.value = date
  showDayPopup.value = true
  showAddPopup.value = false
  showSettingsPopup.value = false
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

/* ลบ event ทีละรายการ // NEW */
const removeEvent = (index) => {
  if (!currentDayKey.value) return
  const key = currentDayKey.value
  const old = eventsByDate.value[key] || []
  const next = old.filter((_, i) => i !== index)
  eventsByDate.value = {
    ...eventsByDate.value,
    [key]: next
  }
}

/* ลบข้อมูลทั้งวัน (events + monthly) // NEW */
const clearDayData = () => {
  if (!dayPopupDate.value) return
  const date = dayPopupDate.value
  const key = dateKey(date)

  // ลบ event ของวันนั้นทั้งหมด
  const { [key]: removedEvents, ...restEvents } = eventsByDate.value
  eventsByDate.value = restEvents

  // ถ้าเป็น Daily special ไม่ลบ state อะไรพิเศษ เพราะ Daily ใช้ค่าคงที่
  if (!isDailySpecialDate(date)) {
    const { [key]: removedType, ...restTypes } = monthlyTypeByDate.value
    monthlyTypeByDate.value = restTypes
  }
}

/* settings popup */
const openSettingsPopup = () => {
  if (!dayPopupDate.value) return
  const key = dateKey(dayPopupDate.value)
  settingsType.value = monthlyTypeByDate.value[key] || '1m'
  showSettingsPopup.value = true
}

const handleSaveSettings = () => {
  if (!dayPopupDate.value) return
  const key = dateKey(dayPopupDate.value)
  monthlyTypeByDate.value = {
    ...monthlyTypeByDate.value,
    [key]: settingsType.value
  }
  showSettingsPopup.value = false
}

const closeAllPopups = () => {
  showDayPopup.value = false
  showAddPopup.value = false
  showSettingsPopup.value = false
}
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

/* แท็กในปฏิทิน */
.monthly-tag {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 1px 6px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.6rem;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.monthly-tag .star {
  margin-right: 4px;
  font-size: 0.6rem;
}

.monthly-tag-blue {
  background-color: #1d4ed8;
}

.monthly-tag-red {
  background-color: #dc2626;
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
  padding-left: 12px;
  display: flex;             /* NEW */
  align-items: center;       /* NEW */
  justify-content: space-between; /* NEW */
}

.popup-list li::before {
  content: '–';
  position: absolute;
  left: 0;
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

.page-top {
  padding-top: 1px !important;
}

.page-top h2 {
  margin-top: 0;
  margin-bottom: 0px;
}
</style>

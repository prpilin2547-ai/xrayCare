<template>
  <MainLayout>
    <div class="page">
      <!-- ส่วนหัว Dashboard เดิม -->
      <div class="dashboard-header-row">
        <h2 class="page-title">Dashboard</h2>
        <div class="toggle-wrapper">
          <label class="toggle-label">
            <input type="checkbox" v-model="hasMachines" />
            <span>แสดงตัวอย่างเมื่อมีเครื่องลงทะเบียนแล้ว</span>
          </label>
        </div>
      </div>

      <!-- การ์ดสรุปด้านบน -->
      <div class="cards-row">
        <div class="card summary-card">
          <p class="card-label date">DATE</p>
          <p class="card-value">{{ displayDate }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label purple">EQUIPMENT</p>
          <p class="card-value">{{ hasMachines ? '4' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label orange">PENDING</p>
          <p class="card-value">{{ hasMachines ? '4' : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label blue">REPAIR REQUESTS</p>
          <p class="card-value">{{ hasMachines ? '-' : '-' }}</p>
        </div>
      </div>

      <!-- ตาราง CHECKLIST เดิม -->
      <div class="checklist-header">
        <div class="left">
          <span class="dot-blue"></span>
          <span class="checklist-text">CHECKLIST</span>
        </div>
        <button class="btn-add">
          <span class="btn-add-icon">＋</span>
        </button>
      </div>

      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Equipment (Brand/Model)</th>
              <th>Room</th>
              <th>Caretaker</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody v-if="hasMachines">
            <tr v-for="row in sampleRows" :key="row.no">
              <td>{{ row.no }}</td>
              <td class="equipment-cell" @click="goToDairyCheck(row.equipment)">
                {{ row.equipment }}
              </td>
              <td>{{ row.room }}</td>
              <td>{{ row.caretaker }}</td>
              <td class="status pending">รอดำเนินการ</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="n in 4" :key="n">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- กล่อง Monthly check เดิม -->
      <div class="monthly-box">
        <div class="monthly-left">
          <span class="monthly-icon">📅</span>
          <div>
            <p class="monthly-title">Monthly check</p>
            <p class="monthly-date">
              {{ hasMachines ? '15 Nov 2025' : '-' }}
            </p>
          </div>
        </div>
      </div>

      <!-- ================= ปฏิทิน PM Schedule (อ่านอย่างเดียว) ================= -->
      <div class="calendar-wrapper">
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

          <!-- overlay ทั้งหมด -->
          <div
            v-if="showAnyPopup"
            class="popup-overlay"
            @click="closeAllPopups"
          ></div>

          <!-- Popup วัน (สีชมพู) / ดูอย่างเดียว -->
          <div v-if="showDayPopup" class="popup-row" @click.stop>
            <div class="popup-box popup-day text-start">
              <div class="popup-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">
                  {{ dayPopupTitle }}
                </h5>
                <!-- เอาไอคอนตั้งค่า / ลบ / บวก ออกทั้งหมด -->
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
                  <p class="fw-bold mb-1">รายการที่ยังไม่ได้ทำ</p>
                  <ul class="mb-0 popup-list">
                    <li v-for="(task, idx) in dayTasks" :key="idx">
                      <span class="task-text">{{ task }}</span>
                    </li>
                  </ul>
                </template>

                <!-- กรณีอื่น ๆ (Monthly / Event ทั่วไป) -->
                <template v-else>
                  <!-- ถ้ามีรายการจริง ๆ ก็แสดงหัวข้อ "รายละเอียด" -->
                  <p v-if="dayTasks.length" class="fw-bold mb-1">รายละเอียด</p>

                  <!-- ถ้ายังไม่มีรายการ และยังไม่ได้ตั้ง Monthly Check เลย ค่อยแสดง "ไม่มีรายการ" -->
                  <p v-else-if="!dayPopupMonthlyType" class="mb-0">ไม่มีรายการ</p>

                  <ul v-if="dayTasks.length" class="mb-0 popup-list">
                    <li
                      v-for="(task, idx) in dayTasks"
                      :key="idx"
                    >
                      <span class="task-text">{{ task }}</span>
                      <!-- ปุ่มลบทีละรายการถูกตัดออก (ดูอย่างเดียว) -->
                    </li>
                  </ul>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ================= จบส่วนปฏิทิน ================= -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

/* ---------------- ส่วนของ Dashboard เดิม ---------------- */
const router = useRouter()
const hasMachines = ref(true)

const displayDate = '10 Nov 2025'

const sampleRows = [
  { no: 1, equipment: 'Shimazu', room: '1', caretaker: 'ศุภกร' },
  { no: 2, equipment: 'Carestream', room: '2', caretaker: 'พรไพลิน' },
  { no: 3, equipment: 'Konica', room: '3', caretaker: 'เบญจรัตน์' },
  { no: 4, equipment: 'Toshiba', room: '4', caretaker: 'ขยัน' }
]
function goToDairyCheck(equipmentName) {
  router.push({
    name: 'DairyCheckPage',
    params: { equipmentName }
  })
}

/* ---------------- ส่วนของปฏิทิน PM (อ่านอย่างเดียว) ---------------- */
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

const STORAGE_EVENTS_KEY = 'pmEventsByDate'
const STORAGE_RULES_KEY = 'pmMonthlyRules'

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
const showSettingsPopup = ref(false) // ยังใช้ใน showAnyPopup เท่านั้น

const showAnyPopup = computed(
  () => showDayPopup.value || showSettingsPopup.value
)

/* events ต่อวัน (อ่านจาก localStorage) */
const eventsByDate = ref({})

/* รอบ monthly: ใช้เป็น "กฎ" โดย key = วันที่เริ่มทำรอบนั้น */
const monthlyTypeByStartDate = ref({}) // key: YYYY-MM-DD -> '1m' | '3m' | '6m'

/* special date 20/11/2025 */
const DAILY_SPECIAL = {
  year: 2025,
  month: 10, // November (0-based)
  day: 20
}

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
  return (
    date.getFullYear() === DAILY_SPECIAL.year &&
    date.getMonth() === DAILY_SPECIAL.month &&
    date.getDate() === DAILY_SPECIAL.day
  )
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
  return MONTHLY_TASKS_MAP[dayPopupMonthlyType.value] || []
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
  '-การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์',
  '-การลบแผ่นเพลท'
]

/* รวมรายการของวันนั้น: ถ้า Daily ใช้ของ Daily, ถ้า Monthly ใช้ template + custom event */
const dayTasks = computed(() => {
  if (isDailySpecial.value) return dailySpecialTasks
  return [...monthlyTasksForCurrentDay.value, ...dayEvents.value]
})

/* ---------- methods popup (ดูอย่างเดียว: ไม่มี add/remove/setting) ---------- */
const openDayPopup = (cell) => {
  const date = getCellDate(cell)
  if (!date) return
  dayPopupDate.value = date
  showDayPopup.value = true
}

const closeAllPopups = () => {
  showDayPopup.value = false
  showSettingsPopup.value = false
}

/* ---------- โหลดข้อมูลจาก localStorage (อ่านอย่างเดียว) ---------- */
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
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
}

.toggle-wrapper {
  font-size: 0.82rem;
  color: #6b7280;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
}

.summary-card .card-label {
  font-size: 0.78rem;
  font-weight: 600;
  margin: 0 0 4px;
}

.summary-card .card-label.date {
  color: #db2777;
}

summary-card .card-label.purple {
  color: var(--purple-main);
}

.summary-card .card-label.orange {
  color: #f97316;
}

.summary-card .card-label.blue {
  color: #2563eb;
}

.summary-card .card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.checklist-header {
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-blue {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #3b82f6;
}

.checklist-text {
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-add {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-icon {
  font-size: 1.2rem;
}

.table-card {
  background: white;
  border-radius: 14px;
  padding: 12px 14px 16px;
  border: 1px solid #e5e7eb;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  text-align: left;
  padding: 6px 4px;
}

thead tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) {
  background: #f9fafb;
}

.status.pending {
  color: #f97316;
}

.equipment-cell {
  cursor: pointer;
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.equipment-cell:hover {
  color: #1d4ed8;
}

/* Monthly check box เดิม */
.monthly-box {
  display: inline-flex;
  width: 150px;
  background: #fee2e2;
  border-radius: 14px;
  padding: 4px 8px;
  align-items: center;
}

.monthly-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monthly-icon {
  font-size: 1.2rem;
}

.monthly-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.monthly-date {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

/* ---------- จัดปฏิทินให้อยู่กลางใต้ตาราง ---------- */
.calendar-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

/* ================== สไตล์ของปฏิทิน PM ================== */
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
  margin: 0;
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
  cursor: pointer;
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
  padding-left: 0;
  display: flex;
  align-items: center;
}

/* ข้อความรายการ */
.task-text {
  flex: 1;
}

/* --------------------------- */
@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

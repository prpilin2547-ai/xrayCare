<template>
  <MainLayout>
    <div class="container-fluid page-top">
      <div class="row justify-content-center">
        <div class="col-12 text-center mb-3">
          <h2>PM Schedule</h2>
        </div>

        <!-- กล่องเนื้อหากลางหน้า -->
        <div class="col-lg-6 col-md-8">
          <!-- ตัดกรอบใหญ่รอบนอก เหลือแค่ wrapper โปร่งใส -->
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
                    today: isToday(cell.day),
                    'has-monthly-check': isMonthlyCheckCell(cell)
                  }"
                >
                  <div v-if="cell.day" class="day-number">
                    <span>{{ cell.day }}</span>
                  </div>

                  <!-- ป้าย Monthly check -->
                  <div
                    v-if="isMonthlyCheckCell(cell)"
                    class="monthly-tag"
                    @click.stop="openMonthlyPopup(getCellDate(cell))"
                  >
                    <span class="star">★</span>
                    <span>Monthly check</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ไอคอนตั้งค่า -->
            <div class="settings-icon" @click.stop="openSettingsPopup">
              ⚙️
            </div>

            <div v-if="showAnyPopup" class="popup-overlay" @click="closeAllPopups"></div>

            <!-- Popup Monthly + Add -->
            <div v-if="showMonthlyPopup" class="popup-row" @click.stop>
              <!-- กล่องส้ม Monthly Check -->
              <div class="popup-box popup-monthly text-start">
                <div class="popup-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0 fw-bold">Monthly Check</h5>
                  <button class="btn btn-danger btn-sm rounded-circle plus-btn" @click.stop="toggleAddPopup">+</button>
                </div>

                <hr class="popup-divider" />

                <div class="popup-content">
                  <p class="mb-1 text-danger fw-bold">
                    {{ frequencyText }}
                  </p>

                  <p class="mb-2">
                    {{ monthlyCheckFullText }}
                  </p>

                  <p class="fw-bold mb-1">รายการ maintenance</p>
                  <ul class="mb-0 popup-list">
                    <li v-for="(task, idx) in monthlyTasks" :key="idx">
                     {{ task }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- กล่อง Add ด้านบนสีชมพูอ่อน -->
              <div v-if="showAddPopup" class="popup-box popup-add text-start" @click.stop>
                <div class="add-header d-flex justify-content-between mb-2">
                  <span class="add-action text-danger">ยกเลิก</span>
                  <span class="add-action text-dark">ใหม่</span>
                  <span class="add-action text-secondary">เพิ่ม</span>
                </div>

                <div class="add-body">
                  <input
                    type="text"
                    class="form-control form-control-sm add-input"
                    placeholder="ชื่อ"
                  />
                </div>
              </div>
            </div>

            <!-- Popup ตั้งค่า -->
            <div v-if="showSettingsPopup" class="popup-box popup-settings text-start" @click.stop>
              <h5 class="fw-bold mb-2">กำหนดรอบ Monthly Check</h5>
              <hr class="popup-divider" />

              <div class="mb-3">
                <label class="form-label mb-1">Date</label>
                <input
                  type="text"
                  v-model="settingsDate"
                  class="form-control form-control-sm"
                  placeholder="DD/MM/YYYY"
                  @input="formatSettingsDate"
                />
              </div>

              <div class="mb-3">
                <label class="form-label mb-1">Type</label>
                <select v-model="settingsType" class="form-select form-select-sm">
                  <option value="1m">1 month</option>
                  <option value="3m">3 months</option>
                  <option value="6m">6 months</option>
                </select>
              </div>

              <div class="text-end">
                <span class="text-danger fw-semibold save-text" @click="handleSaveSettings">
                  save
                </span>
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
import MainLayout from '../components/Layout/MainLayout.vue'

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekdayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const STORAGE_KEY = 'pm-schedule-monthly-configs'

const headerDateText = computed(() => {
  const d = today.getDate()
  const m = monthNames[today.getMonth()]
  const y = today.getFullYear()
  return `${d} ${m} ${y}`
})

const headerWeekdayText = computed(() => weekdayFull[today.getDay()])

/* ----------------- เก็บรอบ Monthly check หลายชุด ----------------- */
/*
  แต่ละ config = {
    startDate: Date,
    intervalMonths: 1 | 3 | 6,
    type: '1m' | '3m' | '6m'
  }
*/
const monthlyConfigs = ref([])
watch(
  monthlyConfigs,
  (newVal) => {
    const plain = newVal.map(cfg => ({
      ...cfg,
      startDate: cfg.startDate.toISOString() // แปลง Date -> string เก็บใน localStorage
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plain))
  },
  { deep: true }
)
onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      monthlyConfigs.value = arr.map(cfg => ({
        ...cfg,
        startDate: new Date(cfg.startDate) // แปลงกลับ string -> Date
      }))
    }
  } catch (e) {
    console.error('Failed to parse monthly configs from storage', e)
  }
})


/* วันที่ของ monthly check ที่ถูกคลิก และ config ที่ใช้รอบนั้น */
const selectedMonthlyDate = ref(null)
const selectedMonthlyConfig = ref(null)

const frequencyText = computed(() => {
  if (!selectedMonthlyConfig.value) return ''
  const m = selectedMonthlyConfig.value.intervalMonths
  if (m === 1) return 'ทำประจำทุก 1 เดือน'
  if (m === 6) return 'ทำประจำทุก 6 เดือน'
  return 'ทำประจำทุก 3 เดือน'
})

const monthlyCheckFullText = computed(() => {
  if (!selectedMonthlyDate.value) return ''
  const d = selectedMonthlyDate.value.getDate()
  const w = weekdayFull[selectedMonthlyDate.value.getDay()]
  const m = monthNames[selectedMonthlyDate.value.getMonth()]
  const y = selectedMonthlyDate.value.getFullYear()
  return `${w} ${d} ${m} ${y}`
})

/* ทำให้ปฏิทินมี 42 ช่อง (6 แถว x 7 วัน) ทุกเดือน */
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

/* ---------------- helper ของ Monthly Check ---------------- */
const getCellDate = (cell) => {
  if (!cell.day) return null
  return new Date(currentYear.value, currentMonth.value, cell.day)
}

// คืน array ของ config ที่มี monthly check ตรงวันที่ date
const getConfigsForDate = (date) => {
  if (!date) return []
  return monthlyConfigs.value.filter(cfg => {
    const start = cfg.startDate
    if (!start) return false
    if (date < start) return false
    if (date.getDate() !== start.getDate()) return false

    const monthsDiff =
      (date.getFullYear() - start.getFullYear()) * 12 +
      (date.getMonth() - start.getMonth())

    return monthsDiff % cfg.intervalMonths === 0
  })
}

// ตรวจว่าช่องนั้นเป็นวันที่ต้องโชว์ Monthly check หรือไม่
const isMonthlyCheckCell = (cell) => {
  if (!cell.day || cell.isPadding || monthlyConfigs.value.length === 0) return false
  const cellDate = getCellDate(cell)
  return getConfigsForDate(cellDate).length > 0
}

/* ---------------- state ของ popup ต่าง ๆ ---------------- */
const showMonthlyPopup = ref(false)
const showAddPopup = ref(false)
const showSettingsPopup = ref(false)

const showAnyPopup = computed(
  () => showMonthlyPopup.value || showAddPopup.value || showSettingsPopup.value
)

const openMonthlyPopup = (date) => {
  selectedMonthlyDate.value = date
  const configs = getConfigsForDate(date)
  selectedMonthlyConfig.value = configs[0] || null
  showMonthlyPopup.value = true
  showAddPopup.value = false
  showSettingsPopup.value = false
}

const toggleAddPopup = () => {
  showAddPopup.value = !showAddPopup.value
}

/* ---------------- popup ตั้งค่ารอบ ---------------- */
const settingsDate = ref('')
const settingsType = ref('3m')

// string DD/MM/YYYY -> Date
const parseSettingsDate = (str) => {
  const [dd, mm, yyyy] = str.split('/')
  const d = parseInt(dd, 10)
  const m = parseInt(mm, 10) - 1
  const y = parseInt(yyyy, 10)
  if (!d || !mm || !y) return null
  const date = new Date(y, m, d)
  if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) {
    return null
  }
  return date
}

const typeToMonths = (type) => {
  if (type === '1m') return 1
  if (type === '6m') return 6
  return 3
}

const formatDateDisplay = (date) => {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = date.getFullYear()
  return `${dd}/${mm}/${yy}`
}

const openSettingsPopup = () => {
  // default เปิดที่ 3 เดือน
  settingsType.value = '3m'
  const cfg = monthlyConfigs.value.find(c => c.type === '3m')
  settingsDate.value = cfg ? formatDateDisplay(cfg.startDate) : ''

  showSettingsPopup.value = true
  showMonthlyPopup.value = false
  showAddPopup.value = false
}

// เวลาเปลี่ยน type ใน select ให้ลองดึงวันที่เดิมของ type นั้นมาใส่
watch(settingsType, (newType) => {
  const cfg = monthlyConfigs.value.find(c => c.type === newType)
  settingsDate.value = cfg ? formatDateDisplay(cfg.startDate) : ''
})

const handleSaveSettings = () => {
  const date = parseSettingsDate(settingsDate.value)
  if (!date) {
    alert('กรุณากรอกวันที่ให้ถูกต้อง (DD/MM/YYYY)')
    return
  }

  const months = typeToMonths(settingsType.value)
  const newCfg = {
    startDate: date,
    intervalMonths: months,
    type: settingsType.value
  }

  const idx = monthlyConfigs.value.findIndex(c => c.type === settingsType.value)
  if (idx >= 0) {
    monthlyConfigs.value.splice(idx, 1, newCfg)
  } else {
    monthlyConfigs.value.push(newCfg)
  }

  selectedMonthlyDate.value = date
  selectedMonthlyConfig.value = newCfg

  closeAllPopups()
}

const closeAllPopups = () => {
  showMonthlyPopup.value = false
  showAddPopup.value = false
  showSettingsPopup.value = false
}

/* format วันที่ เป็น DD/MM/YYYY ขณะพิมพ์ */
const formatSettingsDate = () => {
  let v = settingsDate.value.replace(/\D/g, '')
  if (v.length > 8) v = v.slice(0, 8)

  const parts = []
  if (v.length >= 2) {
    parts.push(v.slice(0, 2))
    if (v.length >= 4) {
      parts.push(v.slice(2, 4))
      if (v.length > 4) {
        parts.push(v.slice(4))
      }
    } else if (v.length > 2) {
      parts.push(v.slice(2))
    }
  } else if (v.length > 0) {
    parts.push(v)
  }

  settingsDate.value = parts.join('/')
}

const monthlyTasks = computed(() => {
  // ถ้ายังไม่มี config ที่เลือก แสดงรายการของ 3 เดือนเป็นค่าเริ่มต้น
  const cfg = selectedMonthlyConfig.value
  const type = cfg ? cfg.type : '3m'

  if (type === '1m') {
    // 1 month
    return [
      'การตรวจสอบความสว่างแสงไฟ',
      'แบบบันทึกอัตราการถ่ายภาพซ้ำ'
    ]
  }

  if (type === '6m') {
    // 6 months
    return [
      'การทดสอบ Collimator and Beam Alignment',
      'การทดสอบ Collimator and Beam Alignment สำหรับกรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)',
      'การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ DR',
      'การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ CR',
      'การตรวจสอบคุณภาพเสื้อตะกั่วและหารอยแตกของเสื้อตะกั่วด้วยรังสีเอ็กซ์'
    ]
  }

  // 3 months (default)
  return [
    'การควบคุมคุณภาพจอภาพ',
    'แบบบันทึกการตรวจสอบเครื่องเอกซเรย์',
    'ความสม่ำเสมอของภาพ',
    'ความคงที่ของค่าดัชนีปริมาณรังสี'
  ]
})

</script>


<style scoped>
/* wrapper โปร่งใส ไม่มีกรอบ */
.pm-card {
  background-color: transparent;
  border: none !important;
  box-shadow: none !important;
}

/* การ์ดวันที่ด้านบน และการ์ดปฏิทิน ให้กว้างเท่ากัน */
.date-card,
.calendar-card {
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #d4d4d4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  max-width: 420px;
  width: 100%;
}

/* padding แยกเพื่อให้สวย */
.date-card {
  padding: 12px 24px;
}

.calendar-card {
  padding: 16px 24px 20px;
}

/* layout icon + text */
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

/* ปุ่มเลื่อนเดือน */
.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  line-height: 1;
  font-size: 0.9rem;
}

/* Grid ปฏิทิน – ช่องว่างเท่ากัน */
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
}

.day-cell.empty {
  background-color: transparent;
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

/* แท็ก Monthly check – ย่อให้เล็กลง */
.monthly-tag {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scale(0.9);
  padding: 1px 6px;
  border-radius: 999px;
  background-color: #1d4ed8;
  color: #ffffff;
  font-size: 0.6rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}

.monthly-tag .star {
  margin-right: 4px;
  font-size: 0.6rem;
}

/* ไอคอนตั้งค่า – ชิดขอบล่างขวา */
.settings-icon {
  position: absolute;
  right: -10px;
  bottom: -6px;
  font-size: 1.8rem;
  cursor: pointer;
}

/* popup overlay */
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 900;
}

/* กล่อง popup base */
.popup-box {
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  position: relative;
}

/* ตำแหน่ง row popup */
.popup-row {
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 1000;
}

/* กล่องส้ม Monthly Check */
.popup-monthly {
  background-color: #ffb981;
  width: 340px;
}

/* หัวลูกศรชี้ขึ้น */
.popup-monthly::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 40px;
  border-width: 0 10px 10px 10px;
  border-style: solid;
  border-color: transparent transparent #ffb981 transparent;
}

.popup-divider {
  border-color: rgba(255, 255, 255, 0.7);
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
}

.popup-list li::before {
  content: '–';
  position: absolute;
  left: 0;
}

/* ปุ่ม + */
.plus-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* กล่อง Add สีชมพูอ่อน */
.popup-add {
  background-color: #f7eeee;
  width: 340px;
}

/* input ด้านใน */
.popup-add .add-input {
  width: 100%;
  height: 44px;
  font-size: 0.9rem;
}

.add-body {
  margin-top: 8px;
}

/* กล่อง Settings */
.popup-settings {
  background-color: #f7eeee;
  width: 340px;
  position: absolute;
  right: -10px;
  bottom: -40px;
}

.popup-settings::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 40px;
  border-width: 10px 10px 0 10px;
  border-style: solid;
  border-color: #f7eeee transparent transparent transparent;
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

<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-note">Created New Machine</h2>

      <!-- กล่องฟอร์มหลัก -->
      <div class="form-card">
        <h1 class="form-title">Created New Machine</h1>

        <form class="form-grid" @submit.prevent="handleSave">
          <!-- ชื่อเครื่อง -->
          <div class="form-row">
            <div class="form-label">
              <label for="machineName">เครื่อง x-ray (ระบุชื่อ,ยี่ห้อ,รุ่น):</label>
            </div>
            <div class="form-input">
              <input id="machineName" v-model="machineName" type="text"
                placeholder="เช่น เครื่อง x-ray shimazu รุ่น AAA" />
              <p class="form-example">
                ตัวอย่าง: เครื่อง x-ray shimazu รุ่น AAA
              </p>
            </div>
          </div>

          <!-- ห้องตรวจ -->
          <div class="form-row">
            <div class="form-label">
              <label for="room">ห้องตรวจ</label>
            </div>
            <div class="form-input">
              <input id="room" v-model="room" type="text" placeholder="เช่น 2" />
              <p class="form-example">
                ตัวอย่าง: 2
              </p>
            </div>
          </div>

          <!-- วันที่ลงทะเบียนเครื่องครั้งแรก -->
          <div class="form-row">
            <div class="form-label">
              <label for="registerDate">วันที่ลงทะเบียนเครื่องครั้งแรก</label>
            </div>
            <div class="form-input">
              <div class="date-wrapper">
                <input id="registerDate" v-model="registerDate" type="text" placeholder="DD/MM/YYYY" maxlength="10"
                  @input="formatDate" @keypress="onlyNumber" />
                <button type="button" class="date-icon" @click.stop="openCalendarFromInput">
                  📅
                </button>
              </div>
              <p class="form-example">
                ตัวอย่าง: 25/11/2025
              </p>
            </div>
          </div>

          <!-- ผู้ดูแลเครื่อง -->
          <div class="form-row">
            <div class="form-label">
              <label for="caretaker">ผู้ดูแลเครื่อง</label>
            </div>
            <div class="form-input">
              <input id="caretaker" v-model="caretaker" type="text" placeholder="ศุภกร งามเมือง"
                class="caretaker-input" />
              <p class="form-example">
                ตัวอย่าง: ศุภกร งามเมือง
              </p>
            </div>
          </div>

          <!-- ปุ่ม -->
          <div class="form-actions">
            <button type="button" class="btn back" @click="goBack">
              Back
            </button>
            <button type="submit" class="btn save">
              Save
            </button>
          </div>
        </form>
      </div>

      <!-- วงกลมสีฟ้า + หัวข้อ เครื่องที่ทำการลงทะเบียน -->
      <div class="section-header-blue registered-header">
        <div class="left">
          <span class="dot-blue"></span>
          <span class="header-text-blue">เครื่องที่ทำการลงทะเบียน</span>
        </div>
      </div>

      <!-- ตารางแสดงเครื่องที่ลงทะเบียนแล้ว -->
      <div class="registered-panel">
        <div class="table-responsive">
          <table class="registered-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>เครื่อง x-ray</th>
                <th>ห้องตรวจ</th>
                <th>ผู้ดูแลเครื่อง</th>
                <th>วันที่ลงทะเบียนเครื่องครั้งแรก</th>
              </tr>
            </thead>
            <tbody>
              <!-- ตอนยังไม่มีข้อมูล แสดงแถวเปล่า -->
              <tr v-if="machines.length === 0">
                <td v-for="n in 5" :key="n">&nbsp;</td>
              </tr>
              <!-- ข้อมูลจากการกด Save -->
              <tr v-for="(m, index) in machines" :key="m.id">
                <td>{{ index + 1 }}</td>
                <td>{{ m.machineName }}</td>
                <td>{{ m.room }}</td>
                <td>{{ m.caretaker }}</td>
                <td>{{ m.registerDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ป็อปอัพปฏิทิน (ใช้ logic แบบหน้า Export PDF) -->
      <div v-if="isCalendarVisible" class="calendar-popup-overlay" @click="isCalendarVisible = false">
        <div class="calendar-popup-box" @click.stop>
          <div class="calendar-header">
            <button class="nav-btn" @click.stop="changeMonth(-1)">&lt;</button>
            <span class="month-title">{{ currentMonthYear }}</span>
            <button class="nav-btn" @click.stop="changeMonth(1)">&gt;</button>
          </div>

          <div class="calendar-grid">
            <div v-for="d in weekdays" :key="d" class="weekday">
              {{ d }}
            </div>

            <div v-for="cell in daysGrid" :key="cell.key" class="day-cell" :class="{
              'is-empty': !cell.day,
              'is-today': cell.isToday,
              'is-selected': cell.isSelected
            }" @click="cell.day ? selectDate(cell.date) : null">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const router = useRouter()

// ฟอร์ม
const machineName = ref('')
const room = ref('')
const registerDate = ref('')
const caretaker = ref('')

// เก็บรายการเครื่องที่ลงทะเบียน (frontend-only)
const machines = ref([])

// ---------- ปฏิทิน (ดึงมาจากหน้า Export PDF) ----------
const isCalendarVisible = ref(false)

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
  'December'
]

const currentMonthYear = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

const parseDateString = (str) => {
  const parts = str.split('/')
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

const selectedDate = computed(() => parseDateString(registerDate.value))

const daysGrid = computed(() => {
  const cells = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({
      key: `empty-${i}`,
      day: null,
      isToday: false,
      isSelected: false
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
      isSelected
    })
  }

  const totalCells = 42
  const cellsToFill = totalCells - cells.length
  for (let i = 0; i < cellsToFill; i++) {
    cells.push({
      key: `empty-post-${i}`,
      day: null,
      isToday: false,
      isSelected: false
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
  registerDate.value = `${day}/${month}/${year}`
  isCalendarVisible.value = false
}

const openCalendarFromInput = () => {
  const parsed = parseDateString(registerDate.value)
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
  let value = registerDate.value.replace(/\D/g, '')
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

  registerDate.value = value
}

// ---------- ปุ่มอื่น ๆ ----------
const goBack = () => {
  router.push('/dashboard')
}

const handleSave = () => {
  // เช็คให้กรอกครบ 4 ช่อง
  if (!machineName.value || !room.value || !registerDate.value || !caretaker.value) {
    alert('กรุณากรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  machines.value.push({
    id: Date.now(),
    machineName: machineName.value,
    room: room.value,
    registerDate: registerDate.value,
    caretaker: caretaker.value
  })

  // ล้างฟอร์ม
  machineName.value = ''
  room.value = ''
  registerDate.value = ''
  caretaker.value = ''
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* ให้เลื่อนขึ้นลงได้ + แถบเลื่อนสีเทา */
  max-height: 100vh;
  overflow-y: auto;
}

/* scrollbar สีเทา */
.page::-webkit-scrollbar {
  width: 8px;
}

.page::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.page::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 4px;
}

.page-note {
  font-size: 0.9rem;
  color: #9ca3af;
  align-self: flex-start;
  margin: 0 0 12px;
}

.form-card {
  width: 100%;
  max-width: 820px;
  background: white;
  border-radius: 18px;
  padding: 26px 28px 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.form-title {
  margin: 0 0 18px;
  text-align: center;
  font-size: 1.4rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
}

.form-label label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.form-input input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 0.9rem;
}

.form-input input:focus {
  border-color: var(--purple-main);
  outline: none;
  box-shadow: 0 0 0 1px rgba(91, 60, 196, 0.18);
}

/* ผู้ดูแลเครื่อง สีเทา */
.caretaker-input {
  color: #6b7280;
}

.caretaker-input::placeholder {
  color: #9ca3af;
}

.form-example {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 4px 0 0;
}

/* date input + icon */
.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding-right: 6px;
  background: white;
}

.date-wrapper input {
  border: none;
  border-radius: 999px;
  padding: 8px 10px 8px 12px;
  font-size: 0.9rem;
  flex: 1;
}

.date-wrapper input:focus {
  box-shadow: none;
  outline: none;
}

.date-wrapper input::placeholder {
  color: #9ca3af;
}

.date-icon {
  font-size: 1rem;
  opacity: 0.7;
  border: none;
  background: transparent;
  cursor: pointer;
}

/* ปุ่ม */
.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  min-width: 96px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn.back {
  border: 1px solid #111827;
  background: white;
  color: #111827;
}

.btn.save {
  border: none;
  background: var(--purple-main);
  color: white;
  font-weight: 600;
}

.btn.save:hover {
  background: #4c2faf;
}

/* ===== วงกลมสีฟ้า + หัวข้อ (เหมือน Admin Dashboard) ===== */
.section-header-blue {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  max-width: 820px;
  margin-top: 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-blue {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3b82f6;
}

.header-text-blue {
  font-weight: 600;
  font-size: 1.1rem;
  color: #000;
}

/* ===== ตารางเครื่องที่ลงทะเบียน (สไตล์คล้าย Analytical) ===== */
.registered-panel {
  width: 100%;
  max-width: 820px;
  margin-top: 8px;
  background: #f3f4f6;
  border-radius: 16px;
  padding: 12px 14px;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.registered-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.registered-table th,
.registered-table td {
  border: 1px solid #d1d5db;
  padding: 8px 6px;
  text-align: center;
}

/* หัวตารางสีเทาอ่อน ตัวหนา */
.registered-table thead th {
  background: #e5e7eb;
  font-weight: 700;
  color: #000;
}

/* แถวข้อมูลพื้นหลังขาว ตัวบาง */
.registered-table tbody tr td {
  background: #ffffff;
  font-weight: 400;
  color: #000;
}

/* ===============  เพิ่มส่วนนี้เข้าไป =============== */
/* ป็อปอัพปฏิทิน (ยกมาจากหน้า Export PDF) */
.calendar-popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* ให้ซ้อนทับทุกอย่าง */
}

.calendar-popup-box {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px 18px 18px;
  width: 320px;
  box-shadow:
    0 22px 50px rgba(15, 23, 42, 0.4),
    0 0 0 1px rgba(148, 163, 184, 0.4);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.month-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #111827;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background-color: #eef2ff;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease;
}

.nav-btn:hover {
  background-color: #e0e7ff;
  transform: translateY(-1px);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 6px;
  column-gap: 4px;
  font-size: 0.8rem;
  text-align: center;
}

.weekday {
  font-weight: 600;
  color: #6b7280;
}

.day-cell {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.day-cell.is-empty {
  pointer-events: none;
}

.day-number span {
  display: inline-flex;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.day-number span:hover {
  background-color: #e5e7eb;
}

/* วันนี้ */
.day-cell.is-today .day-number span {
  border: 1px solid #6366f1;
}

/* วันที่เลือก */
.day-cell.is-selected .day-number span {
  background-color: #4f46e5;
  color: #ffffff;
  transform: translateY(-1px);
}
/* ============= จบส่วนที่เพิ่ม ============= */
</style>
<template>
  <MainLayout>
    <div class="page">
      <!-- เอา Export PDF ออกแล้ว -->

      <!-- หน้า 1 : ฟอร์ม -->
      <div v-if="!isPreviewVisible" class="form-section-wrapper">
        <div class="form-panel">
          <form class="form">
            <!-- X-ray machine -->
            <div class="form-group">
              <label for="machine">X-ray machine</label>
              <div class="select-wrapper">
                <select id="machine" v-model="machine">
                  <option value="" disabled>
                    ชื่อรุ่น/ชื่อเครื่อง X-ray/หมายเลขห้อง
                  </option>
                  <option value="shimazu-aaa">x-ray shimazu รุ่น AAA ห้อง 1</option>
                  <option value="shimazu-bbb">x-ray shimazu รุ่น BBB ห้อง 2</option>
                  <option value="shimazu-ccc">x-ray shimazu รุ่น CCC ห้อง 3</option>
                </select>
                <span class="arrow">▼</span>
              </div>
            </div>

            <!-- Checklist type -->
            <div class="form-group">
              <label for="checklistType">Checklist type</label>
              <div class="select-wrapper">
                <select id="checklistType" v-model="checklistType">
                  <option value="" disabled>Checklist type</option>
                  <option value="daily">Daily</option>
                  <option value="1m">1 month</option>
                  <option value="3m">3 months</option>
                  <option value="6m">6 months</option>
                  <option value="6m">แบบบันทึกผลการวัดความหนาผู้ป่วย</option>
                  <option value="6m">แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์</option>
                </select>
                <span class="arrow">▼</span>
              </div>
            </div>

            <!-- Date -->
            <div class="form-group">
              <label for="date">Date</label>
              <div class="date-wrapper">
                <input
                  id="date"
                  v-model="date"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  maxlength="10"
                  @input="formatDate"
                  @keypress="onlyNumber"
                />
                <span class="date-icon" @click.stop="openCalendarFromInput">
                  📅
                </span>
              </div>
            </div>
          </form>
        </div>

        <!-- ปุ่มตัวอย่างไฟล์ -->
        <div class="preview-wrapper">
          <button class="btn-preview" @click="showPreview">
            ตัวอย่างไฟล์
          </button>
        </div>
      </div>

      <!-- ป็อปอัพปฏิทิน -->
      <div
        v-if="isCalendarVisible"
        class="calendar-popup-overlay"
        @click="isCalendarVisible = false"
      >
        <div class="calendar-popup-box" @click.stop>
          <div class="calendar-header">
            <button class="nav-btn" @click.stop="changeMonth(-1)">&lt;</button>
            <span class="month-title">{{ currentMonthYear }}</span>
            <button class="nav-btn" @click.stop="changeMonth(1)">&gt;</button>
          </div>

          <div class="calendar-grid">
            <div class="weekday" v-for="d in weekdays" :key="d">
              {{ d }}
            </div>

            <div
              v-for="cell in daysGrid"
              :key="cell.key"
              class="day-cell"
              :class="{
                'is-empty': !cell.day,
                'is-today': cell.isToday,
                'is-selected': cell.isSelected
              }"
              @click="cell.day ? selectDate(cell.date) : null"
            >
              <div class="day-number">
                <span v-if="cell.day">{{ cell.day }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- หน้า 2 : ตัวอย่างไฟล์ / พรีวิว -->
      <div v-if="isPreviewVisible" class="preview-section-wrapper">
        <div class="preview-inner">
          <!-- ลูกศรย้อนกลับ -->
          <button class="back-btn" @click="backToForm">
            ←
          </button>

          <!-- กระดาษ A4 ตามฟิกมา -->
          <div class="a4-paper">
            <h3 class="preview-title">
              การ Maintenance เครื่องเอกซเรย์รังสีวินิจฉัย
            </h3>

            <div class="info-chips-row">
            <div class="info-chip">
              X-ray machine: {{ displayedMachine }}
            </div>

            <div class="info-chip">
              Checklist type: {{ displayedChecklistType }}
            </div>

            <div class="info-chip">
              ข้อมูล ณ วันที่ {{ displayedDate }}
            </div>
          </div>

            <!-- กล่องรายละเอียดใหญ่ -->
            <div class="detail-box">
              <div class="detail-area">
                <p class="detail-label-inside">รายละเอียด</p>
                <p class="placeholder-content">
                  [แสดงรายการตรวจสอบ Daily/Monthly ในรูปแบบตารางหรือรายการ]
                </p>
              </div>
            </div>

            <!-- ลายเซ็นล่าง -->
            <div class="signature-section">
              <p class="signature-line">(..............................................)</p>
              <p class="signature-label">ผู้ทดสอบ</p>
              <p class="signature-line">ตำแหน่ง..............................................</p>
            </div>
          </div>

          <!-- ปุ่ม Export ด้านล่างขวาใกล้กระดาษ -->
          <div class="export-btn-wrapper">
            <button class="btn-export" @click="exportFile">
              Export File
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

// ------------------ form state ------------------
const machine = ref('')
const checklistType = ref('')
const date = ref('')

const isPreviewVisible = ref(false)
const isCalendarVisible = ref(false)

// ------------------ calendar state ------------------
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

// helper: แปลง string DD/MM/YYYY -> Date | null
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

const selectedDate = computed(() => parseDateString(date.value))

const daysGrid = computed(() => {
  const cells = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  // ช่องว่างก่อนต้นเดือน
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({
      key: `empty-${i}`,
      day: null,
      isToday: false,
      isSelected: false
    })
  }

  // วันที่ในเดือน
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

  // เติมช่องว่างท้ายเดือนให้ครบ 6 แถว
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

// ------------- input date: numeric only + format DD/MM/YYYY -------------
const onlyNumber = (e) => {
  const char = String.fromCharCode(e.which)
  if (!/[0-9]/.test(char)) {
    e.preventDefault()
  }
}

const formatDate = () => {
  let value = date.value.replace(/\D/g, '')
  value = value.substring(0, 8) // DDMMYYYY

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

// ------------- preview & export -------------
const showPreview = () => {
  isPreviewVisible.value = true
}

const backToForm = () => {
  isPreviewVisible.value = false
}

const exportFile = () => {
  alert('Exporting PDF file...')
}

// ------------- computed for preview -------------
const machineOptions = {
  'shimazu-aaa': 'x-ray shimazu รุ่น AAA',
  'shimazu-bbb': 'x-ray shimazu รุ่น BBB',
  'shimazu-ccc': 'x-ray shimazu รุ่น CCC'
}

const checklistTypeOptions = {
  daily: 'Daily Check',
  '1m': '1 month',
  '3m': '3 months',
  '6m': '6 months'
}

const displayedMachine = computed(() => {
  return machineOptions[machine.value] || 'X-ray machine (ไม่ได้เลือก)'
})

const displayedChecklistType = computed(() => {
  return checklistTypeOptions[checklistType.value] || 'Checklist type (ไม่ได้เลือก)'
})

const displayedDate = computed(() => {
  if (!date.value || date.value.length !== 10) return 'ไม่ระบุวันที่'
  const [day, monthIndex, year] = date.value.split('/').map(Number)
  const monthName = monthNames[monthIndex - 1]
  if (!monthName) return 'ไม่ระบุวันที่'
  return `${day} ${monthName} ${year}`
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  padding: 20px 0;
}

/* page-title ถูกลบออกแล้ว แต่จะเก็บ style ไว้ได้ */
.page-title {
  display: none;
}

.form-section-wrapper,
.preview-section-wrapper {
  max-width: 600px;
  width: 100%;
}

/* กล่องฟอร์มเทาโค้งมนกลางหน้า */
.form-panel {
  max-width: 600px;
  background: #e5e7eb;
  border-radius: 20px;
  padding: 40px 32px 60px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #374151;
  font-weight: 600;
}

/* select */
.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 10px 32px 10px 14px;
  font-size: 0.9rem;
  background: white;
  appearance: none;
  cursor: pointer;
}

.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  pointer-events: none;
  color: #4b5563;
}

/* date input */
.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding-right: 12px;
  background: white;
}

.date-wrapper input {
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.9rem;
  flex: 1;
}

.date-icon {
  font-size: 1.1rem;
  opacity: 0.7;
  cursor: pointer;
}

/* ปุ่มตัวอย่างไฟล์ ขวา */
.preview-wrapper {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  max-width: 600px;
  width: 100%;
}

.btn-preview {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background-color: #e5e7eb;
  font-size: 0.9rem;
  cursor: pointer;
}

/* ป็อปอัพปฏิทิน */
.calendar-popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 900;
}

.calendar-popup-box {
  background: #ffffff;
  border-radius: 18px;
  padding: 16px 18px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.month-title {
  font-weight: 600;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  font-size: 0.85rem;
  cursor: pointer;
}

/* grid ปฏิทิน */
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
}

/* วันนี้ */
.day-cell.is-today .day-number span {
  border: 1px solid #6366f1;
}

/* วันที่เลือก */
.day-cell.is-selected .day-number span {
  background-color: #6366f1;
  color: #ffffff;
}

/* ---------------- preview หน้า 2 ---------------- */
.preview-section-wrapper {
  max-width: 650px;
  width: 100%;
  margin-top: 12px;
}

.preview-inner {
  position: relative;
}

/* ลูกศรย้อนกลับ – ขยับไปซ้ายอีก */
.back-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;

  position: absolute;
  top: 10px;
  left: -60px;
}

/* กระดาษ A4 */
.a4-paper {
  width: 100%;
  max-width: 595px;
  min-height: 842px;
  border: 1px solid #d4d4d8;
  background-color: #ffffff;
  margin: 0 auto;
  padding: 12px 40px 36px; /* padding-top น้อยลงให้หัวข้อขึ้นสูง */
}

.preview-title {
  text-align: center;
  margin-bottom: 18px;
  /* ปรับขนาดตัวอักษรให้เล็กลง และบังคับให้อยู่บรรทัดเดียว */
  font-size: 1rem;        /* เล็กลงจากเดิม (จะลอง 0.95rem ก็ได้) */
  white-space: nowrap;    /* ไม่ให้ตัดบรรทัด */
}

/* แถบข้อความ 3 บรรทัดด้านบน (เอากรอบ pill ออก) */
.info-chips-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.info-chip {
  display: block;       /* ไม่ต้องเป็น pill แล้ว */
  padding: 0;           /* ตัด padding ออก */
  border: none;         /* ลบกรอบ */
  border-radius: 0;     /* ลบโค้งมุม */
  background: transparent; 
  font-size: 0.8rem;
}

/* กล่องรายละเอียดใหญ่ */
.detail-box {
  margin-top: 10px;
}

.detail-area {
  border-radius: 10px;
  border: 1px solid #9ca3af;
  min-height: 380px;
  padding: 10px 12px;
}

.detail-label-inside {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.placeholder-content {
  font-size: 0.8rem;
  color: #6b7280;
}

/* ลายเซ็น – ชิดขวาแต่ตัวอักษรกึ่งกลางตรงกัน */
.signature-section {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.signature-line,
.signature-label {
  width: 260px;
  text-align: center;
  margin: 4px 0;
}

/* ปุ่ม Export File – เพิ่มกรอบสีเทา */
.export-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-export {
  padding: 8px 24px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background-color: #e5e7eb;
  font-size: 0.9rem;
  cursor: pointer;
}

.page-top {
  padding-top: 16px !important;
}

.page-top h2 {
  margin-top: 0;
  margin-bottom: 0;
}
</style>

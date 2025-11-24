<template>
  <MainLayout>
    <div class="page">
      <!-- ฟอร์มหน้าแรก -->
      <div v-if="!isPreviewVisible" class="form-section-wrapper">
        <!-- แถบบาร์ด้านบน -->
        <div class="page-header">
          <span class="page-header-title">
            X-ray Maintenance Checklist
          </span>
        </div>

        <!-- กล่องฟอร์ม (ติดกับหัวข้อเลย) -->
        <div class="form-panel">
          <form class="form">
            <!-- X-ray machine -->
           <!-- Checklist type -->
        <div class="form-group">
        <label for="checklistType">Checklist type</label>
        <div class="input-shell">
        <div class="select-wrapper">
        <select id="checklistType" v-model="checklistType">
        <option value="" disabled>Checklist type</option>

        <!-- ระยะเวลา -->
        <option value="daily">Daily</option>
        <option value="1m">1 month</option>
        <option value="3m">3 months</option>
        <option value="6m">6 months</option>

        <!-- รายการตามที่แจ้ง -->
        <option value="xrayCare">
          การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์
        </option>
        <option value="erasureIP">
          การลบแผ่นเพลท (Erasure of Imaging Plate)
        </option>
        <option value="displayQC">
          การควบคุมคุณภาพจอภาพ (Display monitor)
        </option>
        <option value="xrayRecord">
          แบบบันทึกการตรวจสอบเครื่องเอกซเรย์
        </option>
        <option value="uniformity">
          ความสม่ำเสมอของภาพ (Measured Uniformity)
        </option>
        <option value="exposureIndex">
          ความคงที่ของค่าดัชนีปริมาณรังสี (Consistency of Exposure Index)
        </option>
        <option value="collimatorAlignment">
          การทดสอบ Collimator and Beam Alignment
        </option>
        <option value="collimatorAlignmentDrBucky">
          การทดสอบ Collimator and Beam Alignment
          สำหรับ กรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)
        </option>
        <option value="darkNoiseCR">
          การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR
        </option>
        <option value="darkNoiseDR">
          การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ DR
        </option>
        <option value="leadApron">
          การตรวจสอบคุณภาพเสื้อตะกั่วและหารอยแตกของเสื้อตะกั่วด้วยรังสีเอกซ
        </option>
        <option value="lightBox">
          แบบบันทึกการตรวจสอบความสว่างแสงไฟ
        </option>
        <option value="patientThickness">
          แบบบันทึกผลการวัดความหนาผู้ป่วย
        </option>
        <option value="repeatRate">
          แบบบันทึกอัตราการถ่ายภาพซ้ำ
        </option>
        <option value="usgBmode">
          แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์ : B-mode QC Test
        </option>
      </select>
      <span class="arrow">▾</span>
    </div>
  </div>
</div>

            <!-- Checklist type -->
            <div class="form-group">
              <label for="checklistType">Checklist type</label>
              <div class="input-shell">
                <div class="select-wrapper">
                  <select id="checklistType" v-model="checklistType">
                    <option value="" disabled>Checklist type</option>
                    <option value="daily">Daily</option>
                    <option value="1m">1 month</option>
                    <option value="3m">3 months</option>
                    <option value="6m">6 months</option>
                    <option value="thickness">แบบบันทึกผลการวัดความหนาผู้ป่วย</option>
                    <option value="usg">แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์</option>
                  </select>
                  <span class="arrow">▾</span>
                </div>
              </div>
            </div>

            <!-- Date -->
            <div class="form-group">
              <label for="date">Date</label>
              <div class="input-shell">
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
                  <button
                    type="button"
                    class="date-icon"
                    @click.stop="openCalendarFromInput"
                  >
                    📅
                  </button>
                </div>
              </div>
            </div>
          </form>

          <!-- ปุ่มตัวอย่างไฟล์ -->
          <div class="preview-wrapper">
            <button class="btn-primary" @click="showPreview">
              ตัวอย่างไฟล์
            </button>
          </div>
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

      <!-- หน้า 2 : พรีวิว -->
      <div v-if="isPreviewVisible" class="preview-section-wrapper">
        <div class="preview-inner">
          <!-- ลูกศรย้อนกลับ -->
          <button class="back-btn" @click="backToForm">
            ←
          </button>

          <!-- กระดาษ A4 -->
          <div class="a4-paper">
            <h3 class="preview-title">
              การ Maintenance เครื่องเอกซเรย์รังสีวินิจฉัย
            </h3>

            <div class="info-chips-row">
              <div class="info-chip">
                <span class="info-label">X-ray machine</span>
                <span class="info-value">{{ displayedMachine }}</span>
              </div>

              <div class="info-chip">
                <span class="info-label">Checklist type</span>
                <span class="info-value">{{ displayedChecklistType }}</span>
              </div>

              <div class="info-chip">
                <span class="info-label">ข้อมูล ณ วันที่</span>
                <span class="info-value">{{ displayedDate }}</span>
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

            <!-- ลายเซ็น -->
            <div class="signature-section">
              <p class="signature-line">(..............................................)</p>
              <p class="signature-label">ผู้ทดสอบ</p>
              <p class="signature-line">ตำแหน่ง..............................................</p>
            </div>
          </div>

          <!-- ปุ่ม Export -->
          <div class="export-btn-wrapper">
            <button class="btn-primary btn-shadow" @click="exportFile">
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

const machine = ref('')
const checklistType = ref('')
const date = ref('')

const isPreviewVisible = ref(false)
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

const selectedDate = computed(() => parseDateString(date.value))

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

const showPreview = () => {
  isPreviewVisible.value = true
}

const backToForm = () => {
  isPreviewVisible.value = false
}

const exportFile = () => {
  alert('Exporting PDF file...')
}

const machineOptions = {
  'shimazu-aaa': 'x-ray shimazu รุ่น AAA',
  'shimazu-bbb': 'x-ray shimazu รุ่น BBB',
  'shimazu-ccc': 'x-ray shimazu รุ่น CCC'
}

const checklistTypeOptions = {
  daily: 'Daily Check',
  '1m': '1 month',
  '3m': '3 months',
  '6m': '6 months',
  thickness: 'แบบบันทึกผลการวัดความหนาผู้ป่วย',
  usg: 'แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์'
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
:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 32px;
  /* พื้นหลังเดิมที่เป็นเทา + gradient */
  /* background: radial-gradient(circle at top, #e0e7ff 0, #f4f4f5 50%, #ffffff 100%); */

  /* เปลี่ยนเป็นพื้นหลังขาวล้วน */
  background: radial-gradient(circle at top, #e0e7ff 0, #ffffff 40%, #ffffff 100%);
}


/* --------- Header bar --------- */
.page-header {
  max-width: 640px;
  width: 100%;
  margin: 15 auto;              /* ชิดบนสุดของ page-section */
  padding: 12px 24px;
  border-radius: 24px 24px 0 0; /* โค้งเฉพาะด้านบน */
  background: #5b32d6;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 10px 18px rgba(91, 50, 214, 0.35);
}

.page-header-title {
  font-size: 0.95rem;
}

.form-section-wrapper,
.preview-section-wrapper {
  max-width: 640px;
  width: 100%;
}

/* กล่องฟอร์มต่อเนื่องกับหัวข้อ (ไม่มีช่องว่าง) */
.form-panel {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0 0 24px 24px;   /* โค้งเฉพาะด้านล่าง ให้ต่อกับ .page-header */
  padding: 32px 26px 26px;
  margin: 0 auto;
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(12px);
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
  color: #4b5563;
  font-weight: 600;
}

.input-shell {
  border-radius: 18px;
  padding: 3px 4px;
  background: #f9fafb;
  border: 1px solid transparent;
  transition: all 0.18s ease;
}

.input-shell:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.35);
  background: #ffffff;
}

/* select */
.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  border-radius: 14px;
  border: none;
  padding: 10px 32px 10px 14px;
  font-size: 0.9rem;
  background: transparent;
  cursor: pointer;
  outline: none;
  color: #111827;
}

select:disabled {
  cursor: not-allowed;
}

.arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  pointer-events: none;
  color: #6b7280;
}

/* date input */
.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: 14px;
  padding-right: 2px;
}

.date-wrapper input {
  border: none;
  outline: none;
  border-radius: 14px;
  padding: 10px 12px 10px 14px;
  font-size: 0.9rem;
  flex: 1;
  background: transparent;
  color: #111827;
}

.date-wrapper input::placeholder {
  color: #9ca3af;
}

.date-icon {
  border: none;
  background: #eef2ff;
  border-radius: 999px;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 4px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.date-icon:hover {
  transform: translateY(-1px);
  background: #e0e7ff;
  box-shadow: 0 6px 14px rgba(129, 140, 248, 0.5);
}

/* ปุ่ม primary */
.btn-primary {
  padding: 9px 26px;
  border-radius: 999px;
  border: none;
  background-image: linear-gradient(135deg, #4f46e5, #8b5cf6);
  color: #f9fafb;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.35);
  transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.45);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 8px 18px rgba(55, 48, 163, 0.4);
}

.btn-shadow {
  box-shadow: 0 12px 30px rgba(31, 41, 55, 0.28);
}

/* ปุ่มตัวอย่างไฟล์ */
.preview-wrapper {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

/* ป็อปอัพปฏิทิน */
.calendar-popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 900;
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

/* ---------------- preview หน้า 2 ---------------- */
.preview-section-wrapper {
  max-width: 680px;
  width: 100%;
}

.preview-inner {
  position: relative;
}

/* ลูกศรย้อนกลับ */
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  position: absolute;
  top: -38px;
  left: 2px;
  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.3);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.38);
}

/* กระดาษ A4 */
.a4-paper {
  width: 100%;
  max-width: 595px;
  min-height: 842px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(180deg, #ffffff, #f9fafb);
  margin: 0 auto;
  padding: 20px 40px 36px;
  box-shadow:
    0 26px 60px rgba(15, 23, 42, 0.28),
    0 0 0 1px rgba(148, 163, 184, 0.4);
}

.preview-title {
  text-align: center;
  margin-bottom: 18px;
  font-size: 1.02rem;
  white-space: nowrap;
  color: #111827;
  font-weight: 700;
}

/* แถบข้อมูลด้านบน */
.info-chips-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.info-chip {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 10px;
  border-radius: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  font-size: 0.78rem;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #111827;
  font-weight: 500;
}

/* กล่องรายละเอียดใหญ่ */
.detail-box {
  margin-top: 8px;
}

.detail-area {
  border-radius: 14px;
  border: 1px dashed #9ca3af;
  min-height: 380px;
  padding: 10px 12px;
  background: #fefefe;
}

.detail-label-inside {
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.placeholder-content {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 6px;
}

/* ลายเซ็น */
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
  font-size: 0.78rem;
}

/* ปุ่ม Export */
.export-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

/* --------- responsive --------- */
@media (max-width: 640px) {
  .form-panel {
    padding: 24px 18px 20px;
  }

  .a4-paper {
    padding: 16px 18px 26px;
    min-height: 700px;
  }

  .preview-title {
    white-space: normal;
  }

  .page-header {
    padding: 8px 12px;
  }
}
</style>


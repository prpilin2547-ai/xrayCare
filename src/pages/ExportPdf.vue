<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Export PDF</h2>

      <div v-if="!isPreviewVisible" class="form-section-wrapper">
        <div class="form-panel">
          <form class="form">
            <div class="form-group">
              <label for="machine">X-ray machine</label>
              <div class="select-wrapper">
                <select id="machine" v-model="machine">
                  <option value="" disabled>ชื่อรุ่น/ชื่อเครื่อง X-ray/หมายเลขห้อง</option>
                  <option value="shimazu-aaa">X-ray Shimazu รุ่น AAA ห้อง 1</option>
                  <option value="shimazu-bbb">X-ray Shimazu รุ่น BBB ห้อง 2</option>
                  <option value="shimazu-ccc">X-ray Shimazu รุ่น CCC ห้อง 3</option>
                </select>
                <span class="arrow">▼</span>
              </div>
            </div>

            <div class="form-group">
              <label for="checklistType">Checklist type</label>
              <div class="select-wrapper">
                <select id="checklistType" v-model="checklistType">
                  <option value="" disabled>รูปแบบการ Checklist</option>
                  <option value="daily">Daily Check</option>
                  <option value="monthly">Monthly Check</option>
                </select>
                <span class="arrow">▼</span>
              </div>
            </div>

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
                />
                <span class="date-icon" @click.stop="toggleCalendarPopup">📅</span>
              </div>
            </div>
          </form>
        </div>

        <div class="preview-wrapper">
          <button class="btn-preview" @click="showPreview">
            ตัวอย่างไฟล์
          </button>
        </div>
      </div>
      
      <div v-if="isCalendarVisible" class="calendar-popup-overlay" @click.stop="isCalendarVisible = false">
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
                'is-today': cell.isToday
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

      <div v-if="isPreviewVisible" class="preview-section-wrapper">
        <div class="a4-paper">
          <h3 class="preview-title">เอกสารการ Maintenance เครื่องเอกซเรย์รังสีวินิจฉัย</h3>
          <p class="preview-info-left">{{ displayedMachine }}</p>
          <p class="preview-info-left">{{ displayedChecklistType }}</p>
          <p class="preview-info-left">ข้อมูล ณ วันที่ {{ displayedDate }}</p>
          <hr class="divider">

          <div class="detail-box">
            <p class="detail-title">รายละเอียด</p>
            <p class="placeholder-content">
              [แสดงรายการตรวจสอบ Daily/Monthly ในรูปแบบตารางหรือรายการ]
            </p>
          </div>

          <div class="signature-section">
            <p class="signature-line">(.......................................)</p>
            <p class="signature-label">ผู้ตรวจสอบ</p>
            <p class="signature-line">ตำแหน่ง.......................................</p>
          </div>

        </div>

        <div class="export-btn-wrapper">
          <button class="btn-export" @click="exportFile">
            Export File
          </button>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

// ----------------------------------------------------
// 📍 State Management
// ----------------------------------------------------
const machine = ref('shimazu-aaa') // ตั้งค่าเริ่มต้น
const checklistType = ref('daily') // ตั้งค่าเริ่มต้น
const date = ref('16/11/2025') // ตั้งค่าเริ่มต้น
const isPreviewVisible = ref(false)
const isCalendarVisible = ref(false)

// ----------------------------------------------------
// 📅 Calendar State
// ----------------------------------------------------
const today = new Date()
const currentMonth = ref(today.getMonth()) 
const currentYear = ref(today.getFullYear()) 

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// ----------------------------------------------------
// 🔄 Calendar Logic
// ----------------------------------------------------

const currentMonthYear = computed(() => {
    return `< ${monthNames[currentMonth.value]} ${currentYear.value} >`
})

const daysGrid = computed(() => {
    const cells = []
    
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate() 

    // เพิ่มช่องว่าง (Empty Cells)
    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push({ key: `empty-${i}`, day: null, isToday: false })
    }
    
    // เพิ่มวันที่ในเดือน
    const [d, m, y] = date.value.split('/').map(Number)
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentYear.value, currentMonth.value, d)
        cells.push({ 
            key: `day-${d}`, 
            day: d, 
            date: dateObj,
            isToday: d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear()
        })
    }
    
    // เติมช่องว่างท้ายเดือน
    const cellsToFill = 42 - cells.length
    for (let i = 0; i < cellsToFill; i++) {
        cells.push({ key: `empty-post-${i}`, day: null, isToday: false })
    }
    
    return cells.slice(0, 42) // จำกัดสูงสุด 6 แถว (42 ช่อง)
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

const toggleCalendarPopup = () => {
    isCalendarVisible.value = !isCalendarVisible.value
}

// ----------------------------------------------------
// 📝 Form & Date Formatting Logic
// ----------------------------------------------------

const formatDate = () => {
  let value = date.value.replace(/\//g, '');
  value = value.substring(0, 8);

  if (value.length > 2 && value.length <= 4) {
    value = value.substring(0, 2) + '/' + value.substring(2);
  } else if (value.length > 4) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4);
  }

  date.value = value;
}

// ----------------------------------------------------
// 🚀 Preview & Export Logic
// ----------------------------------------------------

const showPreview = () => {
    // ในสถานการณ์จริง ควรมีการตรวจสอบความถูกต้องของข้อมูลก่อน
    isPreviewVisible.value = true
}

const exportFile = () => {
    alert('Exporting PDF file...')
    // ในความเป็นจริง จะมีการเรียก API หรือใช้ไลบรารีสำหรับสร้าง PDF ที่นี่
}

// ----------------------------------------------------
// 📜 Computed Properties สำหรับ Preview
// ----------------------------------------------------

const machineOptions = {
    'shimazu-aaa': 'X-ray Shimazu รุ่น AAA ห้อง 1',
    'shimazu-bbb': 'X-ray Shimazu รุ่น BBB ห้อง 2',
    'shimazu-ccc': 'X-ray Shimazu รุ่น CCC ห้อง 3',
}

const checklistTypeOptions = {
    'daily': 'Daily Check',
    'monthly': 'Monthly Check',
}

const displayedMachine = computed(() => {
    return machineOptions[machine.value] || 'X-ray machine (ไม่ได้เลือก)'
})

const displayedChecklistType = computed(() => {
    return checklistTypeOptions[checklistType.value] || 'Checklist type (ไม่ได้เลือก)'
})

const displayedDate = computed(() => {
    // แปลง DD/MM/YYYY เป็น D Month YYYY (สมมติว่าเป็นวันที่ 16/11/2025)
    if (!date.value || date.value.length !== 10) return 'ไม่ระบุวันที่'
    
    const [day, monthIndex, year] = date.value.split('/').map(Number)
    const monthName = monthNames[monthIndex - 1] // -1 เพราะ array เริ่มที่ 0
    return `${day} ${monthName} ${year}`
})
</script>

<style scoped>
/* ---------------------------------------------------- */
/* 🏠 Layout & Base Styles */
/* ---------------------------------------------------- */
.page {
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center; 
    padding: 20px 0;
}

.page-title {
    margin: 0 0 10px 0;
    font-size: 1.8rem;
    color: #374151;
}

.form-section-wrapper, .preview-section-wrapper {
    max-width: 600px; 
    width: 100%;
}

/* ---------------------------------------------------- */
/* 1. Form Styles */
/* ---------------------------------------------------- */
.form-panel {
    max-width: 600px; 
    background: #e5e7eb; /* 📍 สีเทาอ่อน (F3F4F6) ตามโค้ดเดิม */
    border-radius: 16px;
    padding: 16px 18px;
    margin: 0 auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form { display: flex; flex-direction: column; gap: 12px; }

.form-group label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 4px;
    color: #374151;
    font-weight: 600;
}

.select-wrapper { position: relative; }

select {
    width: 100%;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    padding: 8px 28px 8px 12px;
    font-size: 0.9rem;
    background: white;
    appearance: none;
    cursor: pointer;
}

.arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.8rem;
    pointer-events: none;
    color: #4b5563;
}

.date-wrapper {
    display: flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    padding-right: 10px;
    background: white;
    position: relative;
}

.date-wrapper input {
    border: none;
    outline: none;
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 0.9rem;
    flex: 1;
}

.date-icon {
    font-size: 1.1rem;
    opacity: 0.7;
    cursor: pointer;
}
</style>
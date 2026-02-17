<template>
  <MainLayout>
    <div class="page" @click="closeFloatingUI">
      <!-- ฟอร์มหน้าแรก -->
      <div class="form-section-wrapper">
        <!-- แถบบาร์ด้านบน -->
        <div class="page-header">
          <span class="page-header-title">
            Export Report
          </span>
        </div>

        <!-- กล่องฟอร์ม (ติดกับหัวข้อเลย) -->
        <div class="form-panel" @click.stop>
          <form class="form">
            <!-- X-ray machine -->
            <div class="form-group">
              <label for="checklistTypeDisplay">X-ray machine</label>
              <div class="input-shell input-shell--plain" @click.stop>
                <div class="select-wrapper">
                  <select
                    id="xrayMachine"
                    v-model="machine"
                    :class="{ 'select-placeholder': !machine }"
                  >
                    <option value="" disabled>
                      ชื่อรุ่น/ชื่อเครื่อง X-ray/หมายเลขห้อง
                    </option>
                    <option
                      v-for="(label, value) in machineOptions"
                      :key="value"
                      :value="value"
                    >
                      {{ label }}
                    </option>
                  </select>
                  <span class="arrow">▾</span>
                </div>
              </div>
            </div>

            <!-- Checklist type (multi-select) -->
            <div class="form-group">
              <label for="checklistTypeDisplay">Checklist type</label>
              <div class="input-shell" @click.stop>
                <!-- กล่องกดเลือก -->
                <div
                  id="checklistTypeDisplay"
                  class="select-wrapper multiselect-trigger"
                  @click="toggleChecklistDropdown"
                >
                  <div class="multiselect-display">
                    <span
                      v-if="!selectedItemLabel"
                      class="placeholder-checklist"
                    >
                      Checklist type
                    </span>
                    <span v-else class="chip">
                      {{ selectedItemLabel }}
                    </span>
                  </div>
                  <span class="arrow">▾</span>
                </div>

                <!-- รายการใน dropdown -->
                <div
                  v-if="isChecklistDropdownOpen"
                  class="multiselect-dropdown"
                >
                  <div
                    v-for="group in checklistGroups"
                    :key="group.id"
                    class="multi-group"
                  >
                    <!-- หัวข้อหลัก: Daily check / 1 Month / ... -->
                    <div class="multi-group-header">
                      <span class="group-label">
                        {{ group.label }}
                      </span>
                    </div>

                    <!-- รายการย่อย (เลือกได้แค่ 1 อัน) -->
                    <div class="multi-items">
                      <button
                        v-for="item in group.items"
                        :key="item.id"
                        type="button"
                        class="multi-item"
                        @click="selectItem(item.id)"
                      >
                        <span
                          class="radio-dot"
                          :class="{ 'radio-dot-checked': checklistType === item.id }"
                        ></span>
                        <span class="item-label">
                          {{ item.label }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date -->
            <div class="form-group">
              <label for="date">Date</label>
              <div class="input-shell">
                <div class="date-wrapper">
                  <!-- Daily check → แสดงแค่เดือน/ปี -->
                  <input
                    v-if="isDailyCheck"
                    id="date"
                    v-model="date"
                    type="text"
                    placeholder="MM/YYYY"
                    maxlength="7"
                    readonly
                  />
                  <!-- อื่นๆ → DD/MM/YYYY -->
                  <input
                    v-else
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

          <!-- ปุ่มตัวอย่างไฟล์ -> ไปหน้า XrayF1Print -->
          <div class="preview-wrapper">
            <button class="btn-primary" @click="goToXrayPrint">
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
          <!-- Daily check → เลือกเดือนเท่านั้น -->
          <template v-if="isDailyCheck">
            <div class="calendar-header">
              <button class="nav-btn" @click.stop="currentYear--">&lt;</button>
              <span class="month-title">{{ currentYear }}</span>
              <button class="nav-btn" @click.stop="currentYear++">&gt;</button>
            </div>

            <div class="month-picker-grid">
              <button
                v-for="(name, idx) in monthPickerNames"
                :key="idx"
                type="button"
                class="month-cell"
                :class="{
                  'is-selected': date === String(idx + 1).padStart(2, '0') + '/' + currentYear,
                  'is-today': idx === today.getMonth() && currentYear === today.getFullYear()
                }"
                @click="selectMonth(idx)"
              >
                {{ name }}
              </button>
            </div>
          </template>

          <!-- อื่นๆ → เลือกวัน -->
          <template v-else>
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
          </template>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const API_BASE = '/api/Xraycare'
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
const machineOptions = computed(() => {
  const opts = {}
  machines.value.forEach(m => {
    const key = `machine-${m.id}`
    const label = `${m.machineName} ห้อง ${m.room || '-'}`
    opts[key] = label
  })
  return opts
})

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`)
    if (res.ok) {
      const data = await res.json()
      machines.value = Array.isArray(data) ? data : []
    }
  } catch (e) {
    console.error('Load machines error:', e)
  }
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

// ---------- date helper ----------
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
</script>

<style scoped>
:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 32px;
  background: #ffffff;
}

/* --------- Header bar --------- */
.page-header {
  max-width: 640px;
  width: 100%;
  margin: 15 auto;
  padding: 12px 24px;
  border-radius: 24px 24px 0 0;
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

.form-section-wrapper {
  max-width: 640px;
  width: 100%;
}

/* กล่องฟอร์มต่อเนื่องกับหัวข้อ */
.form-panel {
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0 0 24px 24px;
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
  position: relative;
}

.input-shell:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(129, 140, 248, 0.35);
  background: #ffffff;
}

/* select ปกติ */
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

/* สีตัวเลือกใน dropdown */
select option {
  color: #111827;
}

/* placeholder (option ที่ disabled) ให้เป็นสีเทาอ่อน */
select option[disabled] {
  color: #9ca3af;
}

select:disabled {
  cursor: not-allowed;
}

/* ให้ select ของ X-ray machine เวลาเป็น placeholder เป็นสีเดียวกัน */
select.select-placeholder {
  color: #9ca3af;
}

/* ซ่อนลูกศรมาตรฐานของ browser */
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
  color: #4f46e5;
  pointer-events: none;
  background: #f3e8ff;
  border-radius: 999px;
  padding: 2px 6px;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.35);
}

/* ---------- custom multi-select ---------- */
.multiselect-trigger {
  cursor: pointer;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.multiselect-display {
  width: 100%;
  padding: 6px 32px 6px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

/* placeholder ของ Checklist type (multiselect) */
.placeholder-checklist {
  font-size: 0.9rem;
  color: #9ca3af;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef2ff;
  font-size: 0.78rem;
  color: #4f46e5;
  font-weight: 500;
  border: 1px solid rgba(129, 140, 248, 0.65);
}

/* dropdown */
.multiselect-dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
  padding: 8px 10px 10px;
  max-height: 280px;
  overflow-y: auto;
  z-index: 50;
}

.multi-group + .multi-group {
  border-top: 1px solid #f3f4f6;
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
  color: #111827;
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
  padding: 3px 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.12s ease;
}

.multi-item:hover {
  background: #f3f4ff;
}

.item-label {
  font-size: 0.8rem;
  text-align: left;
  color: #374151;
}

/* checkbox style */
.checkbox {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  margin-top: 2px;
  box-sizing: border-box;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: #ffffff;
}

.checkbox-checked {
  background: #4f46e5;
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.4);
}

.checkbox-checked::after {
  content: '✓';
}

/* radio dot style (single select) */
.radio-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  margin-top: 2px;
  box-sizing: border-box;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radio-dot-checked {
  border-color: #4f46e5;
}

.radio-dot-checked::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4f46e5;
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

/* month picker grid (สำหรับ Daily check) */
.month-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 4px 0;
}

.month-cell {
  padding: 10px 4px;
  border: none;
  border-radius: 12px;
  background: #f3f4f6;
  font-size: 0.82rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.month-cell:hover {
  background: #e5e7eb;
}

.month-cell.is-today {
  border: 1.5px solid #6366f1;
}

.month-cell.is-selected {
  background: #4f46e5;
  color: #ffffff;
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

/* --------- responsive --------- */
@media (max-width: 640px) {
  .form-panel {
    padding: 24px 18px 20px;
  }

  /* ให้ select X-ray machine เป็นพื้นขาว */
  .input-shell--plain {
    background: #ffffff;
  }

  .input-shell--plain:focus-within {
    background: #ffffff;
  }
}
</style>

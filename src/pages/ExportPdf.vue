<template>
  <MainLayout>
    <div class="page" @click="closeFloatingUI">
      <!-- ฟอร์มหน้าแรก -->
      <div v-if="!isPreviewVisible" class="form-section-wrapper">
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
                    <!-- แสดงคำว่า Checklist type ตอนยังไม่เลือกอะไร -->
                    <span
                      v-if="!selectedItemLabels.length"
                      class="placeholder-checklist"
                    >
                      Checklist type
                    </span>

                    <!-- แสดงหัวข้อที่เลือกแล้ว -->
                    <div v-else class="chip-list">
                      <span
                        v-for="label in selectedItemLabels"
                        :key="label"
                        class="chip"
                      >
                        {{ label }}
                      </span>
                    </div>
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
                    <button
                      type="button"
                      class="multi-group-header"
                      @click="toggleGroup(group.id)"
                    >
                      <span
                        class="checkbox"
                        :class="{ 'checkbox-checked': isGroupFullySelected(group.id) }"
                      ></span>
                      <span class="group-label">
                        {{ group.label }}
                      </span>
                    </button>

                    <!-- รายการย่อยในหัวข้อนั้น -->
                    <div class="multi-items">
                      <button
                        v-for="item in group.items"
                        :key="item.id"
                        type="button"
                        class="multi-item"
                        @click="toggleItem(item.id)"
                      >
                        <span
                          class="checkbox"
                          :class="{ 'checkbox-checked': isItemSelected(item.id) }"
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

          <!-- กระดาษ A4 : หน้าแรก -->
          <div class="a4-paper">
            <div class="paper-body">
              <!-- กรณีพิเศษ F1 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์ -->
              <template v-if="showDailyCareForm">
                <h3 class="preview-title">
                  แบบบันทึก การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์
                </h3>

                <p class="daily-subtitle">
                  ความถี่ : ทุกวันก่อนเริ่มปฏิบัติงาน
                </p>

                <div class="daily-info-row">
                  <span>
                    เครื่องเอกซเรย์ {{ displayedMachine }}
                  </span>
                  <span class="daily-month">
                    เดือน {{ selectedMonthText }}
                  </span>
                </div>

                <!-- ตาราง Daily care -->
                <table class="daily-table">
                  <tr>
                    <th class="daily-col1">
                      วันที่ : {{ selectedDayText }}
                    </th>
                    <th class="daily-col2">
                      ชื่อผู้ทดสอบ
                    </th>
                  </tr>
                  <tr>
                    <td>รายการตรวจสอบ</td>
                    <td>ผลการตรวจสอบ Pass(/) / Fail(X) ของวันที่</td>
                  </tr>
                  <tr>
                    <td>สายไฟ</td>
                    <td class="dates-row">
                      <span v-for="d in days1to30" :key="'r3-' + d">
                        {{ d }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>ระบบล็อกและเบรค</td>
                    <td class="dates-row">
                      <span v-for="d in days1to30" :key="'r4-' + d">
                        {{ d }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>เตียง หลอดเอกซเรย์ และบักกี้</td>
                    <td class="dates-row">
                      <span v-for="d in days1to30" :key="'r5-' + d">
                        {{ d }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>X-ray tube warm-up</td>
                    <td class="dates-row">
                      <span v-for="d in days1to30" :key="'r6-' + d">
                        {{ d }}
                      </span>
                    </td>
                  </tr>
                </table>
              </template>

              <!-- กรณีไม่ใช่ F1 ให้ใช้ layout เดิม -->
              <template v-else>
                <h3 class="preview-title">
                  {{ previewTitle }}
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

                <div class="detail-box">
                  <div class="detail-area">
                    <p class="detail-label-inside">รายละเอียด</p>
                    <p class="placeholder-content">
                      [แสดงรายการตรวจสอบ Daily/Monthly ในรูปแบบตารางหรือรายการ]
                    </p>
                  </div>
                </div>
              </template>
            </div>

            <!-- ลายเซ็นให้เฉพาะ layout เดิม -->
            <div v-if="!showDailyCareForm" class="signature-section">
              <p class="signature-line">
                ลงชื่อ................................................ผู้ทดสอบ
              </p>
              <p class="signature-line">
                (...........................................................................)
              </p>
              <p class="signature-line">
                ตำแหน่ง.............................................................
              </p>
            </div>
          </div>

          <!-- หน้าใหม่ : F2 การลบแผ่นเพลท -->
          <div v-if="showDailyErasureForm" class="a4-paper">
            <div class="paper-body">
              <h3 class="preview-title">
                แบบบันทึก การลบแผ่นเพลท แผนกเอกซเรย์
              </h3>
              <p class="center-line">
                ปีงบประมาณ พ.ศ. {{ thaiBudgetYear }}
              </p>

              <div class="erasure-meta">
                <p>ความถี่ : ทุกวัน</p>
                <p>หมายเลข IP …………. </p>
              </div>

              <!-- ตาราง 3 ตารางเรียงกัน -->
              <div class="erasure-tables-row">
                <div
                  class="erasure-table-wrapper"
                  v-for="idx in 3"
                  :key="'tb-' + idx"
                >
                  <table class="erasure-table">
                    <tr>
                      <th class="erasure-col1">
                        เดือน / รายการ / วันที่ /
                      </th>
                      <th class="erasure-col2">
                        1
                      </th>
                    </tr>
                    <tr>
                      <td>เดือน …………. </td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>ผลการทดสอบ Pass(/)/Fail(X)</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td>สภาพผิดปกติของแผ่นหรือตำแหน่งบนภาพ</td>
                      <td>4</td>
                    </tr>
                    <tr>
                      <td>ผู้ตรวจสอบ</td>
                      <td>5</td>
                    </tr>
                    <tr
                      v-for="n in extraNumsForErasure"
                      :key="'row-' + idx + '-' + n"
                    >
                      <td></td>
                      <td>{{ n }}</td>
                    </tr>
                  </table>
                </div>
              </div>
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
// checklistType เก็บ id ของ "รายการย่อย" ที่เลือก (เลือกได้หลายค่า)
const checklistType = ref([])
const date = ref('')

const isPreviewVisible = ref(false)
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
]

const currentMonthYear = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

// ---------- X-ray machine options ----------
const machineOptions = {
  'shimazu-aaa-room1': 'X-ray shimazu รุ่น AAA ห้อง 1',
  'shimazu-bbb-room2': 'X-ray shimazu รุ่น BBB ห้อง 2',
  'shimazu-ccc-room3': 'X-ray shimazu รุ่น CCC ห้อง 3',
  'shimazu-ddd-room4': 'X-ray shimazu รุ่น DDD ห้อง 4',
}

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

// ---------- Multi-select logic ----------
const toggleChecklistDropdown = () => {
  isChecklistDropdownOpen.value = !isChecklistDropdownOpen.value
}

const isItemSelected = (id) => checklistType.value.includes(id)

const toggleItem = (id) => {
  if (isItemSelected(id)) {
    checklistType.value = checklistType.value.filter((v) => v !== id)
  } else {
    checklistType.value = [...checklistType.value, id]
  }
}

const isGroupFullySelected = (groupId) => {
  const group = checklistGroups.find((g) => g.id === groupId)
  if (!group) return false
  return group.items.every((item) => isItemSelected(item.id))
}

const toggleGroup = (groupId) => {
  const group = checklistGroups.find((g) => g.id === groupId)
  if (!group) return

  const allSelected = isGroupFullySelected(groupId)

  if (allSelected) {
    checklistType.value = checklistType.value.filter(
      (id) => !group.items.some((item) => item.id === id),
    )
  } else {
    const newIds = [...checklistType.value]
    group.items.forEach((item) => {
      if (!newIds.includes(item.id)) {
        newIds.push(item.id)
      }
    })
    checklistType.value = newIds
  }
}

// เอา label ของ "รายการย่อย" ที่เลือกไปใช้แสดงใน preview/chip
const selectedItemLabels = computed(() => {
  const labels = []
  checklistGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (checklistType.value.includes(item.id)) {
        labels.push(item.label)
      }
    })
  })
  return labels
})

// ปิด dropdown เมื่อคลิกพื้นหลัง
const closeFloatingUI = () => {
  isChecklistDropdownOpen.value = false
}

// ---------- preview / export ----------
const showPreview = () => {
  isPreviewVisible.value = true
}

const backToForm = () => {
  isPreviewVisible.value = false
}

const exportFile = () => {
  alert('Exporting PDF file...')
}

// ---------- helpers / computed สำหรับแบบฟอร์มพิเศษ ----------
const showDailyCareForm = computed(() =>
  checklistType.value.includes('daily-care-xray'),
)

const showDailyErasureForm = computed(() =>
  checklistType.value.includes('daily-erasure-ip'),
)

const days1to30 = Array.from({ length: 30 }, (_, i) => i + 1)
const extraNumsForErasure = Array.from({ length: 15 }, (_, i) => i + 6) // 6–20

const selectedDayText = computed(() => {
  if (!selectedDate.value) return '……'
  return selectedDate.value.getDate()
})

const selectedMonthText = computed(() => {
  if (!selectedDate.value) return '……'
  const [day, month, year] = date.value.split('/')
  return month || '……'
})

const thaiBudgetYear = computed(() => {
  if (!selectedDate.value) return '…………'
  // ปี พ.ศ. (ไม่แยกปีงบฯ ตามเดือน เพื่อให้ logic ง่าย)
  return selectedDate.value.getFullYear() + 543
})

// ---------- computed สำหรับแสดงผลเดิม ----------
const displayedMachine = computed(() => {
  return machineOptions[machine.value] || 'X-ray machine (ไม่ได้เลือก)'
})

const displayedChecklistType = computed(() => {
  if (!selectedItemLabels.value.length) {
    return 'Checklist type (ไม่ได้เลือก)'
  }
  return selectedItemLabels.value.join(', ')
})

const displayedDate = computed(() => {
  if (!date.value || date.value.length !== 10) return 'ไม่ระบุวันที่'
  const [day, monthIndex, year] = date.value.split('/').map(Number)
  const monthName = monthNames[monthIndex - 1]
  if (!monthName) return 'ไม่ระบุวันที่'
  return `${day} ${monthName} ${year}`
})

// หัวข้อด้านบนของ A4 ให้ตรงกับ Checklist type
const previewTitle = computed(() => {
  if (showDailyCareForm.value) {
    return 'แบบบันทึก การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์'
  }
  if (!selectedItemLabels.value.length) {
    return 'Checklist type (ไม่ได้เลือก)'
  }
  return selectedItemLabels.value.join(' / ')
})
</script>

<style scoped>
:root {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.page {
  /* min-height: 100vh; */
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

.form-section-wrapper,
.preview-section-wrapper {
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
  cursor: pointer;
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
  top: 16px;
  left: -20px;
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
  margin: 0 auto 24px;
  padding: 20px 40px 36px;
  box-shadow:
    0 26px 60px rgba(15, 23, 42, 0.28),
    0 0 0 1px rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
}

/* เนื้อหาด้านบนให้ดันลงมา เหลือที่สำหรับลายเซ็นด้านล่าง */
.paper-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-title {
  text-align: center;
  margin-bottom: 12px;
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

.signature-section {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.signature-line {
  width: 260px;
  text-align: left;
  margin: 4px 0;
  font-size: 0.78rem;
}

/* ปุ่ม Export */
.export-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
  max-width: 595px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

/* ---------- Daily care form ---------- */
.daily-subtitle {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.daily-info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.daily-month {
  text-align: right;
}

.daily-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  margin-top: 4px;
}

.daily-table th,
.daily-table td {
  border: 1px solid #d1d5db;
  padding: 4px 6px;
  vertical-align: top;
}

.daily-col1 {
  width: 30%;
}

.daily-col2 {
  width: 70%;
}

.dates-row {
  line-height: 1.6;
}

.dates-row span {
  display: inline-block;
  min-width: 18px;
  text-align: center;
}

/* ---------- Erasure form ---------- */
.center-line {
  text-align: center;
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.erasure-meta {
  font-size: 0.85rem;
  margin-bottom: 10px;
}

.erasure-meta p {
  margin: 2px 0;
}

.erasure-tables-row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-top: 6px;
}

.erasure-table-wrapper {
  flex: 1;
}

.erasure-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.erasure-table th,
.erasure-table td {
  border: 1px solid #d1d5db;
  padding: 3px 4px;
  vertical-align: top;
}

.erasure-col1 {
  width: 60%;
}

.erasure-col2 {
  width: 40%;
  text-align: center;
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

  .erasure-tables-row {
    flex-direction: column;
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

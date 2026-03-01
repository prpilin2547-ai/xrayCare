<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-note">ระบบลงทะเบียน</h2>

      <!-- กล่องฟอร์มหลัก -->
      <div class="form-card">
        <h1 class="form-title">ระบบบันทึกข้อมูลเครื่องเอกซ์เรย์ที่ทำการลงทะเบียน</h1>

        <form class="form-grid" @submit.prevent="handleSave">
          <!-- ชื่อเครื่อง -->
          <div class="form-row">
            <div class="form-label">
              <label for="machineName">เครื่อง x-ray (ระบุชื่อ,ยี่ห้อ,รุ่น):</label>
            </div>
            <div class="form-input">
              <input id="machineName" v-model="machineName" type="text" placeholder="เช่น X-Ray (BrandA/ModelX)" />
              <p class="form-example">
                ตัวอย่าง: X-Ray (BrandA/ModelX)
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
            <button type="submit" class="btn save" :disabled="saving">
              {{ saving ? 'กำลังบันทึก...' : 'Save' }}
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
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <!-- โหลดข้อมูล -->
              <tr v-if="loading">
                <td colspan="6" class="text-center">กำลังโหลด...</td>
              </tr>
              <tr v-else-if="machines.length === 0">
                <td colspan="6" class="empty-state">
                  <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
                  <span>ยังไม่มีเครื่องที่ลงทะเบียน</span>
                </td>
              </tr>
              <!-- ข้อมูลจากการกด Save -->
              <tr v-for="(m, index) in machines" :key="m.id">
                <td>{{ index + 1 }}</td>
                <td>{{ m.machineName }}</td>
                <td>{{ m.room }}</td>
                <td>{{ m.caretaker }}</td>
                <td>{{ m.registerDate }}</td>
                <td>
                  <button
                    class="btn-delete"
                    :disabled="deleting === m.id"
                    @click="handleDelete(m.id, m.machineName)"
                  >
                    {{ deleting === m.id ? 'กำลังลบ...' : 'ลบ' }}
                  </button>
                </td>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const router = useRouter()

// ฟอร์ม
const machineName = ref('')
const room = ref('')

const todayDate = new Date()
const todayStr =
  String(todayDate.getDate()).padStart(2, '0') + '/' +
  String(todayDate.getMonth() + 1).padStart(2, '0') + '/' +
  todayDate.getFullYear()
const registerDate = ref(todayStr)

const caretaker = ref('')

// รายการเครื่องจาก API
const machines = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(null)

const API_BASE = '/api/Xraycare'

async function loadMachines() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`)
    if (!res.ok) throw new Error('โหลดรายการเครื่องไม่สำเร็จ')
    const data = await res.json()
    machines.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error(e)
    machines.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMachines()
})

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

// ---------- ลบเครื่อง ----------
async function handleDelete(id, name) {
  if (!confirm(`ต้องการลบเครื่อง "${name}" หรือไม่?`)) return

  deleting.value = id
  try {
    const res = await fetch(`${API_BASE}/DeleteMachine/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'ลบไม่สำเร็จ')
    }
    machines.value = machines.value.filter(m => m.id !== id)
  } catch (e) {
    console.error(e)
    alert(e.message || 'ลบไม่สำเร็จ กรุณาลองใหม่')
  } finally {
    deleting.value = null
  }
}

// ---------- ปุ่มอื่น ๆ ----------
const goBack = () => {
  router.push('/dashboard')
}

async function handleSave() {
  if (!machineName.value || !room.value || !registerDate.value || !caretaker.value) {
    alert('กรุณากรอกข้อมูลให้ครบทุกช่อง')
    return
  }

  saving.value = true
  try {
    const res = await fetch(`${API_BASE}/AddMachine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machineName: machineName.value,
        room: room.value,
        registerDate: registerDate.value,
        caretaker: caretaker.value
      })
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'บันทึกไม่สำเร็จ')
    }
    const created = await res.json()
    machines.value.push(created)
    machineName.value = ''
    room.value = ''
    registerDate.value = ''
    caretaker.value = ''
  } catch (e) {
    console.error(e)
    alert(e.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-note {
  font-size: 0.9rem;
  color: var(--text-muted, #94a3b8);
  align-self: flex-start;
  margin: 0 0 12px;
}

.form-card {
  width: 100%;
  max-width: 960px;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 32px;
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
}

.form-title {
  margin: 0 0 24px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
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
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
}

.form-input input {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
  transition: all 200ms;
}

.form-input input:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.caretaker-input {
  color: var(--text-secondary, #475569);
}

.caretaker-input::placeholder {
  color: var(--text-muted, #94a3b8);
}

.form-example {
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
  margin: 4px 0 0;
}

.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding-right: 6px;
  background: var(--bg-card, #fff);
}

.date-wrapper input {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 14px;
  font-size: 0.85rem;
  flex: 1;
}

.date-wrapper input:focus {
  box-shadow: none;
  outline: none;
}

.date-wrapper input::placeholder {
  color: var(--text-muted, #94a3b8);
}

.date-icon {
  font-size: 1rem;
  opacity: 0.7;
  border: none;
  background: transparent;
  cursor: pointer;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  min-width: 96px;
  padding: 10px 24px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn.back {
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #fff;
  color: var(--text-secondary, #475569);
  border-radius: var(--radius-sm, 8px);
}

.btn.back:hover {
  background: #f8fafc;
}

.btn.save {
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(3,105,161,0.3);
}

.btn.save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3,105,161,0.4);
}

.section-header-blue {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 960px;
  margin-top: 24px;
  margin-bottom: 12px;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-blue {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--info, #3b82f6);
}

.header-text-blue {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-main, #0f172a);
}

.registered-panel {
  width: 100%;
  max-width: 960px;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
  background: var(--bg-card, #fff);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.registered-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.registered-table thead {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.registered-table th {
  padding: 12px 16px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.03em;
  text-align: center;
  white-space: nowrap;
}

.registered-table td {
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
  text-align: center;
}

.registered-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.registered-table tbody tr {
  transition: background 150ms;
}

.registered-table tbody tr:hover {
  background: #f1f5f9;
}

.empty-state {
  padding: 40px 16px !important;
  text-align: center;
  color: var(--text-muted, #94a3b8);
  font-size: 0.85rem;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  opacity: 0.4;
}

.text-center {
  text-align: center;
}

.btn-delete {
  padding: 5px 14px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.calendar-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-popup-box {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 20px;
  width: 340px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.month-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 150ms);
}

.nav-btn:hover {
  background: #f1f5f9;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 0.8rem;
  text-align: center;
}

.weekday {
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  font-size: 0.65rem;
  text-transform: uppercase;
  padding-bottom: 8px;
}

.day-cell {
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.day-cell:not(.is-empty):hover {
  background: #f1f5f9;
}

.day-cell.is-empty {
  pointer-events: none;
}

.day-number span {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.day-cell.is-today .day-number span {
  border: 2px solid var(--purple-main, #0369A1);
  color: var(--purple-main, #0369A1);
  font-weight: 700;
}

.day-cell.is-selected .day-number span {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(3,105,161,0.35);
}

@media (max-width: 1024px) {
  .form-card { padding: 20px; }
  .form-row { grid-template-columns: 1fr; gap: 6px; }
  .registered-panel { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .registered-table { min-width: 500px; }
}
@media (max-width: 640px) {
  .page { padding: 0; }
  .page-note { font-size: 0.82rem; }
  .form-card { padding: 16px; border-radius: 12px; }
  .form-title { font-size: 1.1rem; }
  .form-input input { padding: 8px 10px; font-size: 0.82rem; }
  .form-actions { flex-direction: column; }
  .btn { width: 100%; text-align: center; }
  .section-header-blue { margin-top: 12px; }
  .header-text-blue { font-size: 0.95rem; }
  .registered-panel { padding: 10px; border-radius: 12px; }
}
</style>
<template>
  <MainLayout>
    <div class="page">

      <!-- HEADER -->
      <div class="dashboard-header-row">
        <h2 class="page-title">Dashboard (Radiological Technologist)</h2>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="cards-row">
        <div class="card summary-card">
          <p class="card-label date">DATE</p>
          <p class="card-value">{{ displayDate }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label purple">EQUIPMENT</p>
          <p class="card-value">{{ hasMachines ? equipmentCount : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label orange">PENDING</p>
          <p class="card-value">{{ hasMachines ? pendingCount : '-' }}</p>
        </div>
        <div class="card summary-card">
          <p class="card-label blue">REPAIR REQUESTS</p>
          <p class="card-value">{{ repairRequestCount || '-' }}</p>
        </div>
      </div>

      <!-- CHECKLIST TITLE -->
      <div class="checklist-header">
        <div class="left">
          <span class="dot-blue"></span>
          <span class="checklist-text">CHECKLIST</span>
        </div>

        <button class="btn-add" @click="goToMachinesCreate">
          <span class="btn-add-icon">＋</span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="table-card">
        <table class="table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Equipment (Brand/Model)</th>
              <th>Room</th>
              <th>Caretaker</th>
              <th>Status</th>
              <th>CHECK</th>
            </tr>
          </thead>

          <tbody v-if="hasMachines">
            <tr v-for="row in sampleRows" :key="row.no">
              <td>{{ row.rid }}</td>
              <td>{{ row.machine_name }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.caretaker }}</td>
              <td class="status pending">PENDING</td>
              <td>
                <button @click="goToDairyCheck(row.equipment)" class="check-btn">
                  CHECK
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="n in 4" :key="n">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ---------------------- CALENDAR (ใช้ logic เดียวกับ PM Schedule) ---------------------- -->
      <div class="calendar-wrapper">

        <!-- DATE CARD -->
        <div class="card date-card mb-3">
          <div class="date-inner">
            <div class="calendar-icon">📅</div>
            <div class="date-text">
              <p class="mb-0 fw-semibold">{{ headerDateText }}</p>
              <p class="mb-0 text-muted">{{ headerWeekdayText }}</p>
            </div>
          </div>
        </div>

        <!-- CALENDAR BODY -->
        <div class="card calendar-card">
          <div class="calendar-header d-flex justify-content-between align-items-center mb-3">
            <button class="nav-btn" @click="goPrevMonth">&lt;</button>
            <span class="fw-semibold">
              {{ monthNames[currentMonth] }} {{ currentYear }}
            </span>
            <button class="nav-btn" @click="goNextMonth">&gt;</button>
          </div>

          <div class="calendar-grid">

            <!-- WEEKDAY -->
            <div v-for="d in weekdays" :key="d" class="weekday fw-semibold text-muted">
              {{ d }}
            </div>

            <!-- DAYS -->
            <div v-for="cell in calendarCells" :key="cell.key" class="day-cell"
              :class="{ empty: !cell.day, today: isToday(cell.day) }" @click="cell.day && openDayPopup(cell)">
              <div v-if="cell.day" class="day-number">
                <span>{{ cell.day }}</span>
              </div>

              <!-- tag-stack เหมือนหน้า PM (ฟ้า/แดง/เขียว) -->
              <div class="tag-stack" v-if="hasMonthlyTag(cell) || isDailySpecialCell(cell) || getCustomTagLabel(cell)">
                <!-- Monthly Check -->
                <div v-if="hasMonthlyTag(cell)" class="tag-pill monthly-tag-blue">
                  <span class="star">★</span>
                  <span>Monthly Check</span>
                </div>

                <!-- Daily Check -->
                <div v-if="isDailySpecialCell(cell)" class="tag-pill monthly-tag-red">
                  <span class="star">★</span>
                  <span>Daily Check</span>
                </div>

                <!-- Custom event -->
                <div v-if="getCustomTagLabel(cell)" class="tag-pill custom-tag">
                  <span class="star">★</span>
                  <span>{{ getCustomTagLabel(cell) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ---------------------- READ-ONLY POPUP ---------------------- -->

      <div v-if="showPopup" class="popup-overlay" @click="closePopup"></div>

      <div v-if="showPopup" class="popup-row" @click="closePopup">
        <div class="popup-box popup-day text-start" @click.stop>

          <div class="popup-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">{{ popupTitle }}</h5>
          </div>

          <hr class="popup-divider" />

          <div class="popup-content">
            <p class="text-danger fw-bold" v-if="popupFrequency">
              {{ popupFrequency }}
            </p>

            <p class="mb-2">{{ popupFullDate }}</p>

            <p v-if="popupTasks.length" class="fw-bold mb-1">
              {{ popupSectionTitle }}
            </p>

            <ul class="popup-list" v-if="popupTasks.length">
              <li v-for="(task, i) in popupTasks" :key="i">
                <span class="task-text">{{ task }}</span>
              </li>
            </ul>

            <p v-if="popupTasks.length === 0">ไม่มีรายการ</p>
          </div>

        </div>
      </div>

      <!-- ==================== ENGINEER DASHBOARD SECTION ==================== -->
      <!-- Engineer Dashboard Cards -->
      <div class="engineer-section">
        <h2 class="engineer-title">Dashboard (Engineer)</h2>

        <div class="engineer-cards-row">
          <div class="card summary-card">
            <p class="card-label pink">DATE</p>
            <p class="card-value">{{ displayDate }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label blue-engineer">EQUIPMENT</p>
            <p class="card-value">{{ hasMachines ? equipmentCount : '-' }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label red">PENDING REPAIR</p>
            <p class="card-value">{{ hasPendingrepair ? pendingRepairCount : '-' }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label orange-engineer">IN PROGRESS</p>
            <p class="card-value">{{ hasProgress ? inProgressCount : '-' }}</p>
          </div>
          <div class="card summary-card">
            <p class="card-label green">COMPLETED</p>
            <p class="card-value">{{ hasCompleted ? completedCount : '-' }}</p>
          </div>
        </div>

        <!-- REQUESTS Section Header -->
        <div class="request-header">
          <div class="left">
            <span class="dot-blue"></span>
            <span class="checklist-text">REQUESTS</span>
          </div>
        </div>

        <!-- REQUESTS TABLE -->
        <div class="table-card">
          <table class="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Equipment (Brand/Model)</th>
                <th>Room</th>
                <th>Repair Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in repairRequests" :key="item.id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.equipment || '-' }}</td>
                <td>{{ item.room || '-' }}</td>
                <td class="status" :class="getStatusClass(item.statusText)">{{ item.statusText || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "../components/Layout/MainLayout.vue";

const router = useRouter();
const API_BASE = '/api/Xraycare';

/* ---------------- Data จาก API ---------------- */
const machines = ref([]);
const repairRequests = ref([]);
const loading = ref(false);

const hasMachines = computed(() => pendingMachines.value.length > 0);

// Abbreviated month names for displayDate
const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Display current date in format: "18 Dec 2025"
const displayDate = computed(() => {
  const now = new Date();
  const day = now.getDate();
  const month = monthNamesShort[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
});

/* ---------- Daily Check: อ่านเครื่องที่ check แล้ววันนี้ ---------- */
const DAILY_CHECK_KEY = 'xraycare-dailyChecked';

function getTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const todayCheckedMachines = ref([]);

function loadDailyChecked() {
  try {
    const stored = JSON.parse(localStorage.getItem(DAILY_CHECK_KEY) || '{}');
    todayCheckedMachines.value = stored[getTodayKey()] || [];
  } catch (e) {
    todayCheckedMachines.value = [];
  }
}

/* เครื่องที่ยังไม่ได้ check วันนี้ */
const pendingMachines = computed(() =>
  machines.value.filter(m => !todayCheckedMachines.value.includes(m.machineName))
);

/* Summary card counts - RT section */
const equipmentCount = computed(() => machines.value.length);
const pendingCount = computed(() => pendingMachines.value.length);
/* นับเฉพาะรายการที่ยังไม่เสร็จ (ไม่นับ ดำเนินการแล้ว / ซ่อมเสร็จ / COMPLETED) */
const repairRequestCount = computed(() =>
  repairRequests.value.filter(r => !COMPLETED_STATUSES.includes(r.statusText)).length
);

/* สร้าง rows สำหรับตาราง CHECKLIST - แสดงเฉพาะเครื่องที่ยังไม่ได้ check วันนี้ */
const sampleRows = computed(() =>
  pendingMachines.value.map((m, index) => ({
    rid: String(index + 1).padStart(3, '0'),
    equipment: m.machineName || '-',
    machine_name: m.machineName || '-',
    room: m.room || '-',
    caretaker: m.caretaker || '-'
  }))
);

/* ---------------- Engineer Dashboard Data (จาก API) ---------------- */
const PENDING_STATUSES = ['รอซ่อม', 'PENDING'];
const PROGRESS_STATUSES = ['อยู่ระหว่างดำเนินการ', 'กำลังซ่อม', 'IN PROGRESS'];
const COMPLETED_STATUSES = ['ดำเนินการแล้ว', 'ซ่อมเสร็จ', 'COMPLETED'];

const hasPendingrepair = computed(() =>
  repairRequests.value.some(r => PENDING_STATUSES.includes(r.statusText))
);
const hasProgress = computed(() =>
  repairRequests.value.some(r => PROGRESS_STATUSES.includes(r.statusText))
);
const hasCompleted = computed(() =>
  repairRequests.value.some(r => COMPLETED_STATUSES.includes(r.statusText))
);

const pendingRepairCount = computed(() =>
  repairRequests.value.filter(r => PENDING_STATUSES.includes(r.statusText)).length
);
const inProgressCount = computed(() =>
  repairRequests.value.filter(r => PROGRESS_STATUSES.includes(r.statusText)).length
);
const completedCount = computed(() =>
  repairRequests.value.filter(r => COMPLETED_STATUSES.includes(r.statusText)).length
);

/* ---------- โหลดข้อมูลจาก API ---------- */
async function loadMachines() {
  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`);
    if (!res.ok) throw new Error('โหลดข้อมูลเครื่องไม่สำเร็จ');
    const data = await res.json();
    machines.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadMachines error:', e);
    machines.value = [];
  }
}

async function loadRepairRequests() {
  try {
    const res = await fetch(`${API_BASE}/GetAllRepairRequests`);
    if (!res.ok) throw new Error('โหลดข้อมูลแจ้งซ่อมไม่สำเร็จ');
    const data = await res.json();
    repairRequests.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadRepairRequests error:', e);
    repairRequests.value = [];
  }
}

function goToDairyCheck(equipmentName) {
  router.push({ name: "DairyCheckPage", params: { equipmentName } });
}
function goToMachinesCreate() {
  router.push("/machines/create");
}

/* ---------------- Calendar Core (เหมือนหน้า PM) ---------------- */
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayFull = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const headerDateText = computed(() =>
  `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`
);
const headerWeekdayText = computed(() => weekdayFull[today.getDay()]);

const calendarCells = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ key: `p-${i}`, day: null, isPadding: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: `d-${d}`, day: d, isPadding: false });
  }
  const totalCells = 42;
  const remain = totalCells - cells.length;
  for (let i = 0; i < remain; i++) {
    cells.push({ key: `s-${i}`, day: null, isPadding: true });
  }
  return cells;
});

const goPrevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else currentMonth.value--;
};
const goNextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else currentMonth.value++;
};

const isToday = (day) => {
  if (!day) return false;
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

/* ---------- ใช้ localStorage ร่วมกับ PM Schedule ---------- */
const STORAGE_EVENTS_KEY = "pmEventsByDate";
const STORAGE_RULES_KEY = "pmMonthlyRules";
const STORAGE_HIDDEN_MONTHLY_KEY = "pmHiddenMonthlyTasks";
const STORAGE_DAILY_DISABLED_KEY = "pmDisabledDailyDates";

const eventsByDate = ref({});
const monthlyTypeByStartDate = ref({});
const hiddenMonthlyTasksByDate = ref({});
const disabledDailyDates = ref({});

/* วัน Daily Check พิเศษ: 28 Nov 2025 */
const DAILY_SPECIAL_DATES = [
  { year: 2025, month: 10, day: 28 } // month index 0-based
];

/* Tasks รายเดือน (เหมือน PM Schedule) */
const MONTHLY_TASKS_MAP = {
  "1m": [
    "-การตรวจสอบความสว่างแสงไฟ",
    "-แบบบันทึกอัตราการถ่ายภาพซ้ำ"
  ],
  "3m": [
    "-การควบคุมคุณภาพจอภาพ",
    "-แบบบันทึกการตรวจสอบเครื่องเอกซเรย์",
    "-ความสม่ำเสมอของภาพ",
    "-ความคงที่ของค่าดัชนีปริมาณรังสี"
  ],
  "6m": [
    "-การทดสอบ Collimator and Beam Alignment",
    "-การทดสอบ Collimator and Beam Alignment สำหรับกรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)",
    "-การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ DR",
    "-การทดสอบสัญญาณรบกวนมืด ( Dark noise ) ระบบ CR",
    "-การตรวจสอบคุณภาพเสื้อตะกั่วและหารอยแตกของเสื้อตะกั่วด้วยรังสีเอกซ์"
  ]
};

/* รายการที่ไม่ได้ทำของ Daily Check */
const dailySpecialTasks = [
  '- X-ray shimazu รุ่น AAA ห้อง 1'
];


const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getCellDate = (cell) => {
  if (!cell.day) return null;
  return new Date(currentYear.value, currentMonth.value, cell.day);
};

/* daily special? */
const isDailySpecialDate = (date) => {
  if (!date) return false;

  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const isBaseSpecial = DAILY_SPECIAL_DATES.some(
    (s) => s.year === dateYear && s.month === dateMonth && s.day === dateDay
  );
  if (!isBaseSpecial) return false;

  const key = dateKey(date);
  return !disabledDailyDates.value[key];
};

/* หารอบ Monthly ที่ตรงกับวันนั้น */
const getMonthlyTypeForDate = (date) => {
  if (!date) return null;
  const dateDay = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();

  const entries = Object.entries(monthlyTypeByStartDate.value);
  for (const [startKey, type] of entries) {
    const [y, m, d] = startKey.split("-").map((v) => parseInt(v, 10));
    const startYear = y;
    const startMonth = m - 1;
    const startDay = d;

    const startDate = new Date(startYear, startMonth, startDay);
    if (date < startDate) continue;
    if (dateDay !== startDay) continue;

    const diffMonths =
      (dateYear - startYear) * 12 + (dateMonth - startMonth);

    if (diffMonths < 0) continue;

    if (type === "1m" && diffMonths % 1 === 0) return type;
    if (type === "3m" && diffMonths % 3 === 0) return type;
    if (type === "6m" && diffMonths % 6 === 0) return type;
  }
  return null;
};

/* tag helpers */
const hasMonthlyTag = (cell) => {
  const date = getCellDate(cell);
  if (!date) return false;
  return !!getMonthlyTypeForDate(date);
};

const isDailySpecialCell = (cell) => {
  const date = getCellDate(cell);
  return isDailySpecialDate(date);
};

/* custom green tag: text 7 ตัวแรก + ... */
const getCustomTagLabel = (cell) => {
  const date = getCellDate(cell);
  if (!date) return "";
  const key = dateKey(date);
  const list = eventsByDate.value[key] || [];
  if (!list.length) return "";

  const firstText = (list[0] || "").trim();
  if (!firstText) return "";

  if (firstText.length <= 7) return firstText;
  return firstText.slice(0, 7) + "...";
};

/* ---------- Popup (read-only) ---------- */
const showPopup = ref(false);
const popupDate = ref(null);

const openDayPopup = (cell) => {
  const date = getCellDate(cell);
  if (!date) return;
  popupDate.value = date;
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const currentDayKey = computed(() =>
  popupDate.value ? dateKey(popupDate.value) : null
);

const isDailySpecial = computed(() => isDailySpecialDate(popupDate.value));

const dayPopupMonthlyType = computed(() => {
  if (!popupDate.value) return null;
  return getMonthlyTypeForDate(popupDate.value);
});

const dayEvents = computed(() => {
  if (!currentDayKey.value) return [];
  return eventsByDate.value[currentDayKey.value] || [];
});

const monthlyTasksForCurrentDay = computed(() => {
  if (!dayPopupMonthlyType.value) return [];
  const base = MONTHLY_TASKS_MAP[dayPopupMonthlyType.value] || [];
  if (!currentDayKey.value) return base;

  const hidden = hiddenMonthlyTasksByDate.value[currentDayKey.value] || [];
  return base.filter((text) => !hidden.includes(text));
});

const popupTasks = computed(() => {
  if (isDailySpecial.value) return dailySpecialTasks;
  return [...monthlyTasksForCurrentDay.value, ...dayEvents.value];
});

const popupTitle = computed(() => {
  if (isDailySpecial.value) return "Daily Check";
  if (dayPopupMonthlyType.value) return "Monthly Check";
  if (popupTasks.value.length) return "รายละเอียด";
  return "ไม่มีรายการ";
});

const popupFrequency = computed(() => {
  if (isDailySpecial.value) return "ทำประจำทุกวัน";
  if (!dayPopupMonthlyType.value) return "";
  if (dayPopupMonthlyType.value === "1m") return "ทำประจำทุก 1 เดือน";
  if (dayPopupMonthlyType.value === "6m") return "ทำประจำทุก 6 เดือน";
  return "ทำประจำทุก 3 เดือน";
});

const popupSectionTitle = computed(() => {
  if (isDailySpecial.value) return "รายการเครื่องที่ยังไม่ได้ทำ";
  if (popupTasks.value.length) return "รายละเอียด";
  return "";
});

const popupFullDate = computed(() => {
  if (!popupDate.value) return "";
  const d = popupDate.value.getDate();
  const w = weekdayFull[popupDate.value.getDay()];
  const m = monthNames[popupDate.value.getMonth()];
  const y = popupDate.value.getFullYear();
  return `${w} ${d} ${m} ${y}`;
});

/* ---------- Status class helper ---------- */
function getStatusClass(status) {
  if (!status) return '';
  if (PENDING_STATUSES.includes(status)) return 'pending-repair';
  if (PROGRESS_STATUSES.includes(status)) return 'in-progress';
  if (COMPLETED_STATUSES.includes(status)) return 'completed';
  return 'pending-repair';
}

/* ---------- โหลดข้อมูลจาก API + localStorage ---------- */
onMounted(async () => {
  /* โหลด daily check data */
  loadDailyChecked();

  /* โหลดข้อมูลจาก API */
  loading.value = true;
  await Promise.all([loadMachines(), loadRepairRequests()]);
  loading.value = false;

  /* โหลด calendar data จาก localStorage (เหมือนหน้า PM) */
  try {
    const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
    if (savedEvents) {
      eventsByDate.value = JSON.parse(savedEvents);
    }
  } catch (e) {
    console.error("Cannot load events from storage", e);
  }

  try {
    const savedRules = localStorage.getItem(STORAGE_RULES_KEY);
    if (savedRules) {
      monthlyTypeByStartDate.value = JSON.parse(savedRules);
    }
  } catch (e) {
    console.error("Cannot load monthly rules from storage", e);
  }

  try {
    const savedHiddenMonthly = localStorage.getItem(STORAGE_HIDDEN_MONTHLY_KEY);
    if (savedHiddenMonthly) {
      hiddenMonthlyTasksByDate.value = JSON.parse(savedHiddenMonthly);
    }
  } catch (e) {
    console.error("Cannot load hidden monthly tasks from storage", e);
  }

  try {
    const savedDisabledDaily = localStorage.getItem(STORAGE_DAILY_DISABLED_KEY);
    if (savedDisabledDaily) {
      disabledDailyDates.value = JSON.parse(savedDisabledDaily);
    }
  } catch (e) {
    console.error("Cannot load disabled daily dates from storage", e);
  }
});
</script>

<style scoped>
/* ====== MODERN DESIGN SYSTEM ====== */
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  color: var(--text-main, #0f172a);
}

.toggle-wrapper {
  font-size: 0.82rem;
  color: var(--text-muted, #94a3b8);
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* Summary cards */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  transition: all var(--transition-base, 250ms cubic-bezier(0.4, 0, 0.2, 1));
}

.summary-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  padding: 18px 20px;
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  transition: all var(--transition-base, 250ms cubic-bezier(0.4, 0, 0.2, 1));
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover, 0 8px 25px rgba(0, 0, 0, 0.1));
}

.summary-card .card-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0;
}

.summary-card .card-label.date {
  color: #db2777;
}

.summary-card .card-label.purple {
  color: var(--purple-main, #0369A1);
}

.summary-card .card-label.orange {
  color: #ea580c;
}

.summary-card .card-label.blue {
  color: #2563eb;
}

.summary-card .card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

/* Checklist header */
.checklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
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
  background: #3b82f6;
}

.checklist-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
}

.btn-add {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full, 9999px);
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

.btn-add-icon {
  font-size: 1.2rem;
}

/* Table card */
.table-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
  padding: 12px 14px 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.table thead {
  background: #f8fafc;
}

.table th {
  padding: 12px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  text-align: left;
}

.table td {
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
}

.table tbody tr {
  transition: background 150ms;
}

.table tbody tr:hover {
  background: #f8fafc;
}

.status.pending {
  color: #ea580c;
  font-weight: 600;
}

.status.pending-repair {
  color: #dc2626;
  font-weight: 600;
}

.status.in-progress {
  color: #ea580c;
  font-weight: 600;
}

.status.completed {
  color: #16a34a;
  font-weight: 600;
}

.check-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 6px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.check-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

/* ====== CALENDAR + POPUP ====== */
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 460px;
  margin-top: 20px;
}

.date-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-icon {
  font-size: 22px;
}

.date-card,
.calendar-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  width: 420px;
  max-width: 100%;
}

.date-card {
  padding: 12px 18px;
}

.date-text p {
  margin: 0;
}

.calendar-card {
  padding: 14px 18px 18px;
}

.calendar-header {
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  margin-bottom: 10px;
}

.calendar-header span {
  font-size: 0.92rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-main, #0f172a);
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: #f9fafb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.nav-btn:hover {
  background: #eff6ff;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.18);
  transform: translateY(-1px);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  justify-items: center;
  margin-top: 10px;
  font-size: 0.78rem;
}

.weekday {
  text-transform: uppercase;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: var(--text-muted, #94a3b8) !important;
}

.day-cell {
  position: relative;
  min-height: 40px;
  width: 100%;
  max-width: 44px;
  cursor: pointer;
  border-radius: var(--radius-md, 12px);
  padding-top: 4px;
  padding-bottom: 18px;
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.day-cell.empty {
  cursor: default;
  background: transparent;
  box-shadow: none;
}

.day-cell:not(.empty):hover {
  background: #eff6ff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.14);
  transform: translateY(-2px);
}

.day-number {
  display: flex;
  justify-content: center;
}

.day-number span {
  font-size: 0.8rem;
  color: var(--text-main, #0f172a);
}

.day-cell.today .day-number span {
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
}

.tag-stack {
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.tag-pill {
  padding: 1px 5px;
  border-radius: var(--radius-full, 9999px);
  color: #fff;
  font-size: 0.52rem;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1.3;
}

.tag-stack .star {
  margin-right: 4px;
  font-size: 0.6rem;
}

.monthly-tag-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.monthly-tag-red {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.custom-tag {
  background: linear-gradient(135deg, #10b981, #059669);
}

/* Popup */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 900;
}

.popup-row {
  position: fixed;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1000;
}

.popup-box {
  background: var(--bg-card, #fff);
  width: 380px;
  max-width: 92vw;
  border-radius: var(--radius-xl, 20px);
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.popup-divider {
  margin: 8px 0 10px;
  border-color: var(--border-soft, #e2e8f0);
}

.popup-content p {
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
}

.popup-content .text-danger {
  font-size: 0.82rem;
}

.popup-list {
  list-style: none;
  padding-left: 0;
  margin: 4px 0 0;
}

.task-text {
  font-size: 0.84rem;
  color: var(--text-main, #0f172a);
}

.popup-list li + li {
  margin-top: 2px;
}

/* ====== ENGINEER DASHBOARD SECTION ====== */
.engineer-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--border-soft, #e2e8f0);
}

.engineer-title {
  margin: 0;
  color: var(--text-main, #0f172a);
}

.engineer-cards-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.summary-card .card-label.pink {
  color: #db2777;
}

.summary-card .card-label.blue-engineer {
  color: #2563eb;
}

.summary-card .card-label.red {
  color: #dc2626;
}

.summary-card .card-label.orange-engineer {
  color: #ea580c;
}

.summary-card .card-label.green {
  color: #16a34a;
}

.request-header {
  margin-top: 25px;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 1024px) {
  .cards-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .engineer-cards-row { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .table-card { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { min-width: 500px; }
  .calendar-wrapper { max-width: 100%; }
}
@media (max-width: 640px) {
  .cards-row { grid-template-columns: 1fr; }
  .engineer-cards-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .summary-card { padding: 14px 16px; }
  .card-value { font-size: 1.2rem; }
  .popup-box { width: calc(100vw - 32px); }
}
</style>
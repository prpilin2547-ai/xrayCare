<template>
  <MainLayout>
    <div class="page">

      <!-- HEADER -->
      <div class="dashboard-header-row">
        <h2 class="page-title">Dashboard1</h2>
      </div>

      <!-- SUMMARY CARDS -->
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
          <p class="card-value">-</p>
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
              <td class="status pending">รอดำเนินการ</td>
              <td>
                <button @click="goToDairyCheck(row.equipment)" class="check-btn">
                  CHECK
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="n in 4" :key="n">
              <td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>
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
            <div
              v-for="d in weekdays"
              :key="d"
              class="weekday fw-semibold text-muted"
            >
              {{ d }}
            </div>

            <!-- DAYS -->
            <div
              v-for="cell in calendarCells"
              :key="cell.key"
              class="day-cell"
              :class="{ empty: !cell.day, today: isToday(cell.day) }"
              @click="cell.day && openDayPopup(cell)"
            >
              <div v-if="cell.day" class="day-number">
                <span>{{ cell.day }}</span>
              </div>

              <!-- tag-stack เหมือนหน้า PM (ฟ้า/แดง/เขียว) -->
              <div
                class="tag-stack"
                v-if="hasMonthlyTag(cell) || isDailySpecialCell(cell) || getCustomTagLabel(cell)"
              >
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

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "../components/Layout/MainLayout.vue";

const router = useRouter();

/* ---------------- Table Data ---------------- */
const hasMachines = ref(true);
const displayDate = "10 Nov 2025";

const sampleRows = ref([
  { rid: "001", equipment: "XRay-Alpha", machine_name: "X-Ray (BrandA/ModelX)", room: "Room 101", caretaker: "John" },
  { rid: "002", equipment: "XRay-Beta", machine_name: "X-Ray (BrandB/ModelY)", room: "Room 102", caretaker: "Jane" },
  { rid: "003", equipment: "XRay-Gamma", machine_name: "X-Ray (BrandC/ModelZ)", room: "Room 103", caretaker: "Mike" },
  { rid: "004", equipment: "XRay-Delta", machine_name: "X-Ray (BrandD/ModelW)", room: "Room 104", caretaker: "Emily" }
]);

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
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
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

/* daily tasks */
const dailySpecialTasks = [
  "-การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์",
  "-การลบแผ่นเพลท (Erasure of Imaging Plate)"
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
  if (isDailySpecial.value) return "รายการที่ยังไม่ได้ทำ";
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

/* ---------- โหลดข้อมูลจาก localStorage ให้เหมือนหน้า PM ---------- */
onMounted(() => {
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
/* ====== DASHBOARD + TABLE (เดิม) ====== */
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

.summary-card .card-label.purple {
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

.check-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ====== CALENDAR + POPUP ====== */

.date-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-icon {
  font-size: 22px;
}

.calendar-wrapper {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.date-card,
.calendar-card {
  width: 420px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
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
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 10px;
}

.calendar-header span {
  font-size: 0.92rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
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
  color: #9ca3af !important;
}

.day-cell {
  position: relative;
  min-height: 40px;
  width: 100%;
  max-width: 44px;
  cursor: pointer;
  border-radius: 12px;
  padding-top: 4px;
  padding-bottom: 18px;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
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
  color: #111827;
}

.day-cell.today .day-number span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 2px solid #2563eb;
  background-color: #ffffff;
  color: #1d4ed8;
  font-weight: 600;
}

/* tag stack */
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
  padding: 1px 6px;
  border-radius: 999px;
  color: white;
  font-size: 0.58rem;
  white-space: nowrap;
  line-height: 1.3;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
}

.tag-stack .star {
  margin-right: 4px;
  font-size: 0.6rem;
}

.monthly-tag-blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.monthly-tag-red {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.custom-tag {
  background-color: #16a34a;
}

/* Popup overlay */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(2px);
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
  background: #ffffff;
  width: 380px;
  max-width: 92vw;
  border-radius: 18px;
  padding: 16px 18px 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
  border: 1px solid #e5e7eb;
}

.popup-divider {
  margin: 8px 0 10px;
  border-color: #e5e7eb;
}

.popup-content p {
  margin-bottom: 4px;
  font-size: 0.85rem;
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
  color: #111827;
}

.popup-list li + li {
  margin-top: 2px;
}

@media (max-width: 600px) {
  .calendar-wrapper {
    align-items: stretch;
  }

  .date-card,
  .calendar-card {
    width: 100%;
  }

  .calendar-grid {
    gap: 6px;
  }

  .day-cell {
    max-width: 100%;
  }

  .popup-box {
    width: 340px;
  }
}
</style>

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

      <!-- ---------------------- CALENDAR ---------------------- -->
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

              <div class="tag-stack" v-if="hasMonthlyTag(cell) || isDailySpecialCell(cell)">
                <div v-if="hasMonthlyTag(cell)" class="tag-pill monthly-tag-blue">
                  ★ Monthly Check
                </div>

                <div v-if="isDailySpecialCell(cell)" class="tag-pill monthly-tag-red">
                  ★ Daily Check
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
import { ref, computed } from "vue";
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

/* ---------------- Calendar Core ---------------- */
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

  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < first; i++) cells.push({ key: `p-${i}`, day: null });
  for (let d = 1; d <= days; d++) cells.push({ key: `d-${d}`, day: d });

  const remain = 42 - cells.length;
  for (let i = 0; i < remain; i++) cells.push({ key: `s-${i}`, day: null });

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

/* ---------------- Event Definition ---------------- */
// เริ่มต้นจากเดือน Nov 2025 (index 10)
const RECUR_EVENTS = [
  {
    id: "monthly-1",
    type: "monthly",
    day: 5,
    startYear: 2025,
    startMonth: 10,
    intervalMonths: 1,
    title: "Monthly Check",
    frequencyText: "ทำประจำทุก 1 เดือน",
    sectionTitle: "รายละเอียด",
    tasks: [
      "-การตรวจสอบความสว่างแสงไฟ",
      "-แบบบันทึกอัตราการถ่ายภาพซ้ำ"
    ]
  },
  {
    id: "monthly-3",
    type: "monthly",
    day: 12,
    startYear: 2025,
    startMonth: 10,
    intervalMonths: 3,
    title: "Monthly Check",
    frequencyText: "ทำประจำทุก 3 เดือน",
    sectionTitle: "รายละเอียด",
    tasks: [
      "-การควบคุมคุณภาพอภาพ",
      "-แบบบันทึกการตรวจสอบเครื่องเอกซเรย์",
      "-ความสม่ำเสมอของภาพ",
      "-ความคงที่ของค่าดัชนีปริมาณรังสี"
    ]
  },
  {
    id: "monthly-6",
    type: "monthly",
    day: 19,
    startYear: 2025,
    startMonth: 10,
    intervalMonths: 6,
    title: "Monthly Check",
    frequencyText: "ทำประจำทุก 6 เดือน",
    sectionTitle: "รายละเอียด",
    tasks: [
      "-การทดสอบ Collimator and Beam Alignment",
      "-การทดสอบ Collimator and Beam Alignment สำหรับกรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)",
      "-การทดสอบสัญญาณรบกวนมืด (Dark noise) ระบบ DR",
      "-การทดสอบสัญญาณรบกวนมืด (Dark noise) ระบบ CR",
      "-การตรวจสอบคุณภาพของฟิล์มและหัวทรอมแคสของเครื่องด้วยรังสีเอ็กซ์"
    ]
  }
];

// Daily check แค่ครั้งเดียว 28 Nov 2025
const ONE_TIME_EVENTS = [
  {
    id: "daily-1",
    type: "daily",
    date: new Date(2025, 10, 28),
    title: "Daily Check",
    frequencyText: "ทำประจำทุกวัน",
    sectionTitle: "รายการที่ยังไม่ได้ทำ",
    tasks: [
      "-การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์",
      "-การลบแผ่นเพลท (Erasure of Imaging Plate)"
    ]
  }
];

function sameYMD(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// เช็กว่า event รายเดือนตัวนี้เกิดในวันที่ date หรือไม่
function isMatchRecurring(event, date) {
  if (date.getDate() !== event.day) return false;

  const start = new Date(event.startYear, event.startMonth, event.day);
  if (date < start) return false;

  const diffMonths =
    (date.getFullYear() - start.getFullYear()) * 12 +
    (date.getMonth() - start.getMonth());

  return diffMonths % event.intervalMonths === 0;
}

// หาว่า วันที่นี้มี event อะไร
function getEventForDate(date) {
  // daily แบบครั้งเดียวก่อน
  for (const e of ONE_TIME_EVENTS) {
    if (sameYMD(e.date, date)) return e;
  }
  // recurring
  for (const e of RECUR_EVENTS) {
    if (isMatchRecurring(e, date)) return e;
  }
  return null;
}

/* ---------------- READ-ONLY TAG LOGIC ---------------- */
const hasMonthlyTag = (cell) => {
  if (!cell.day) return false;
  const d = new Date(currentYear.value, currentMonth.value, cell.day);
  const ev = getEventForDate(d);
  return ev && ev.type === "monthly";
};

const isDailySpecialCell = (cell) => {
  if (!cell.day) return false;
  const d = new Date(currentYear.value, currentMonth.value, cell.day);
  const ev = getEventForDate(d);
  return ev && ev.type === "daily";
};

/* ---------------- Popup (Read Only) ---------------- */
const showPopup = ref(false);
const popupDate = ref(null);
const activeEvent = ref(null);

const openDayPopup = (cell) => {
  const d = new Date(currentYear.value, currentMonth.value, cell.day);
  popupDate.value = d;
  activeEvent.value = getEventForDate(d);
  showPopup.value = true;
};

const closePopup = () => {
  showPopup.value = false;
};

const popupFullDate = computed(() => {
  if (!popupDate.value) return "";
  const d = popupDate.value.getDate();
  const w = weekdayFull[popupDate.value.getDay()];
  const m = monthNames[popupDate.value.getMonth()];
  const y = popupDate.value.getFullYear();
  return `${w} ${d} ${m} ${y}`;
});

const popupTitle = computed(() => {
  if (!activeEvent.value) return "ไม่มีรายการ";
  return activeEvent.value.title;
});

const popupTasks = computed(() => {
  if (!activeEvent.value) return [];
  return activeEvent.value.tasks;
});

const popupFrequency = computed(() => {
  if (!activeEvent.value) return "";
  return activeEvent.value.frequencyText;
});

const popupSectionTitle = computed(() => {
  if (!activeEvent.value) return "";
  return activeEvent.value.sectionTitle;
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

.equipment-cell {
  cursor: pointer;
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.equipment-cell:hover {
  color: #1d4ed8;
}

/* ปุ่ม CHECK ในตาราง */
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

/* Monthly check box */
.monthly-box {
  display: inline-flex;  /* ให้กล่องมีขนาดตามเนื้อหา */
  width: 150px;          /* กันการขยายเอง */
  background: #fee2e2;
  border-radius: 14px;
  padding: 4px 8px;      /* ลด padding ให้ดูพอดีกับข้อความ */
  align-items: center;
}

.monthly-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.monthly-icon {
  font-size: 1.2rem;
}

.monthly-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.monthly-date {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
}

@media (max-width: 960px) {
  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* ====== CALENDAR + POPUP (ดีไซน์ใหม่) ====== */

/* Date card ให้ข้อความอยู่ข้าง ๆ ไอคอน */
.date-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.calendar-icon {
  font-size: 22px;
}

/* Calendar layout */
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

/* ปรับ date card ให้ดูสะอาด */
.date-card {
  padding: 12px 18px;
}

.date-text p {
  margin: 0;
}

/* Calendar header */
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

/* ปุ่มเลื่อนเดือน */
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

/* Grid calendar */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  justify-items: center;
  margin-top: 10px;
  font-size: 0.78rem;
}

/* ส่วนหัววันในสัปดาห์ */
.weekday {
  text-transform: uppercase;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  color: #9ca3af !important;
}

/* ช่องวัน */
.day-cell {
  position: relative;
  min-height: 40px;
  width: 100%;
  max-width: 44px;
  cursor: pointer;
  border-radius: 12px;
  padding-top: 4px;
  padding-bottom: 18px; /* ให้มีที่ว่างเผื่อ tag-stack */
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

/* วันที่ไม่มี (ช่องว่าง) */
.day-cell.empty {
  cursor: default;
  background: transparent;
  box-shadow: none;
}

/* hover เฉพาะวันที่มีจริง */
.day-cell:not(.empty):hover {
  background: #eff6ff;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.14);
  transform: translateY(-2px);
}

/* เลขวัน */
.day-number {
  display: flex;
  justify-content: center;
}

.day-number span {
  font-size: 0.8rem;
  color: #111827;
}

/* วงกลมวันปัจจุบันในปฏิทิน (แบบขอบน้ำเงิน พื้นขาว) */
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

/* Tag stack ใต้เลขวัน */
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

/* Monthly / Daily สีแยกกันชัด ๆ */
.monthly-tag-blue {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.monthly-tag-red {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* Popup overlay */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(2px);
  z-index: 900;
}

/* Popup box row */
.popup-row {
  position: fixed;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 1000;
}

/* กล่อง popup ให้ดู modern, เน้นอ่านง่าย */
.popup-box {
  background: #ffffff;
  width: 380px;
  max-width: 92vw;
  border-radius: 18px;
  padding: 16px 18px 18px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
  border: 1px solid #e5e7eb;
}

/* เส้นคั่น */
.popup-divider {
  margin: 8px 0 10px;
  border-color: #e5e7eb;
}

/* ข้อความด้านใน */
.popup-content p {
  margin-bottom: 4px;
  font-size: 0.85rem;
}

/* ข้อความ frequency (สีแดง) */
.popup-content .text-danger {
  font-size: 0.82rem;
}

/* รายการงาน */
.popup-list {
  list-style: none;
  padding-left: 0;
  margin: 4px 0 0;
}

.task-text {
  font-size: 0.84rem;
  color: #111827;
}

/* bullet list spacing */
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

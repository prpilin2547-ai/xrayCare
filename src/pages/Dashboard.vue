<template>
  <MainLayout>
    <div class="page">

      <!-- ==================== NOTIFICATION BANNER ==================== -->
      <div v-if="notifications.length > 0" class="notification-container">
        <div v-for="notif in notifications" :key="notif.id"
          class="notification-banner"
          :class="{
            'notif-today': notif.status === 'today',
            'notif-urgent': notif.status !== 'today' && notif.daysRemaining <= 3,
            'notif-warning': notif.status !== 'today' && notif.daysRemaining > 3 && notif.daysRemaining <= 7,
            'notif-info': notif.daysRemaining > 7
          }">

          <div v-if="notif.status === 'today'" class="notif-pulse-ring"></div>

          <div class="notif-icon">
            <i v-if="notif.status === 'today'" class="fa-solid fa-bell"></i>
            <i v-else-if="notif.daysRemaining <= 3" class="fa-solid fa-triangle-exclamation"></i>
            <i v-else-if="notif.daysRemaining <= 7" class="fa-solid fa-clipboard-check"></i>
            <i v-else class="fa-solid fa-circle-check"></i>
          </div>

          <div class="notif-body">
            <div class="notif-title">
              <template v-if="notif.status === 'today'">
                ถึงกำหนดแล้ว! — ทำการ Check วันนี้
              </template>
              <template v-else-if="notif.daysRemaining <= 7">
                เหลืออีก <span class="notif-countdown">{{ notif.daysRemaining }}</span> วัน
              </template>
              <template v-else>
                ถึงรอบ Check วันที่ {{ notif.nextCheckDate }}
              </template>
            </div>
            <div class="notif-detail">
              Monthly Check ({{ notif.frequencyLabel }})
              <template v-if="notif.description"> — {{ notif.description }}</template>
              <template v-if="notif.daysRemaining > 7">
                &nbsp;·&nbsp; อีก {{ notif.daysRemaining }} วัน
              </template>
              <template v-else>
                &nbsp;·&nbsp; กำหนดวันที่ {{ notif.nextCheckDate }}
              </template>
            </div>
          </div>

          <div class="notif-badge">
            <span v-if="notif.status === 'today'" class="badge-today">TODAY</span>
            <span v-else class="badge-days">{{ notif.daysRemaining }} Days</span>
          </div>

          <button class="notif-close" @click="dismissNotification(notif.id)" title="ปิดการแจ้งเตือน">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- HEADER -->
      <div class="dashboard-header-row">
        <div>
          <h2 class="page-title">Dashboard</h2>
          <p class="page-subtitle">Overview of your equipment and schedule</p>
        </div>
      </div>

      <!-- SUMMARY CARDS -->
      <div class="cards-row">
        <div class="card summary-card card-date">
          <div class="card-icon-wrap icon-pink">
            <i class="fa-solid fa-calendar-day"></i>
          </div>
          <div class="card-content">
            <p class="card-label">DATE</p>
            <p class="card-value">{{ displayDate }}</p>
          </div>
        </div>
        <div class="card summary-card card-equipment">
          <div class="card-icon-wrap icon-purple">
            <i class="fa-solid fa-laptop-medical"></i>
          </div>
          <div class="card-content">
            <p class="card-label">EQUIPMENT</p>
            <p class="card-value">{{ hasMachines ? equipmentCount : '-' }}</p>
          </div>
        </div>
        <div class="card summary-card card-pending">
          <div class="card-icon-wrap icon-orange">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div class="card-content">
            <p class="card-label">PENDING</p>
            <p class="card-value">{{ hasMachines ? pendingCount : '-' }}</p>
          </div>
        </div>
        <div class="card summary-card card-repair">
          <div class="card-icon-wrap icon-blue">
            <i class="fa-solid fa-wrench"></i>
          </div>
          <div class="card-content">
            <p class="card-label">REPAIR REQUESTS</p>
            <p class="card-value">{{ repairRequestCount || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- CHECKLIST TITLE -->
      <div class="section-header">
        <div class="section-left">
          <div class="section-dot"></div>
          <span class="section-text">Checklist</span>
          <span class="section-badge" v-if="hasMachines">{{ pendingCount }} pending</span>
        </div>
        <button class="btn-add" @click="goToMachinesCreate">
          <i class="fa-solid fa-plus"></i>
          <span>Add Equipment</span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="table-card">
        <table class="modern-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Equipment (Brand/Model)</th>
              <th>Room</th>
              <th>Caretaker</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody v-if="hasMachines">
            <tr v-for="row in sampleRows" :key="row.no">
              <td><span class="row-num">{{ row.rid }}</span></td>
              <td class="fw-500">{{ row.machine_name }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.caretaker }}</td>
              <td>
                <span class="status-badge status-pending">
                  <span class="status-dot"></span>
                  Pending
                </span>
              </td>
              <td>
                <button @click="goToDairyCheck(row.equipment)" class="check-btn">
                  <i class="fa-solid fa-clipboard-check"></i>
                  Check
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-for="n in 4" :key="n" class="empty-row">
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

      <!-- ---------------------- CALENDAR ---------------------- -->
      <div class="calendar-wrapper">

        <!-- DATE CARD -->
        <div class="card date-card">
          <div class="date-inner">
            <div class="calendar-icon-wrap">
              <i class="fa-solid fa-calendar"></i>
            </div>
            <div class="date-text">
              <p class="date-main">{{ headerDateText }}</p>
              <p class="date-sub">{{ headerWeekdayText }}</p>
            </div>
          </div>
        </div>

        <!-- CALENDAR BODY -->
        <div class="card calendar-card">
          <div class="calendar-header">
            <button class="cal-nav-btn" @click="goPrevMonth">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span class="cal-month-label">
              {{ monthNames[currentMonth] }} {{ currentYear }}
            </span>
            <button class="cal-nav-btn" @click="goNextMonth">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div class="calendar-grid">
            <div v-for="d in weekdays" :key="d" class="weekday">
              {{ d }}
            </div>

            <div v-for="cell in calendarCells" :key="cell.key" class="day-cell"
              :class="{ empty: !cell.day, today: isToday(cell.day) }" @click="cell.day && openDayPopup(cell)">
              <div v-if="cell.day" class="day-number">
                <span>{{ cell.day }}</span>
              </div>

              <div class="tag-stack" v-if="hasMonthlyTag(cell) || isDailySpecialCell(cell) || getCustomTagLabel(cell)">
                <div v-if="hasMonthlyTag(cell)" class="tag-pill monthly-tag-blue">
                  <span class="tag-dot"></span>
                  <span>Monthly</span>
                </div>
                <div v-if="isDailySpecialCell(cell)" class="tag-pill monthly-tag-red">
                  <span class="tag-dot"></span>
                  <span>Daily</span>
                </div>
                <div v-if="getCustomTagLabel(cell)" class="tag-pill custom-tag">
                  <span class="tag-dot"></span>
                  <span>{{ getCustomTagLabel(cell) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ---------------------- READ-ONLY POPUP ---------------------- -->
      <Transition name="fade">
        <div v-if="showPopup" class="popup-overlay" @click="closePopup"></div>
      </Transition>

      <Transition name="pop">
        <div v-if="showPopup" class="popup-row" @click="closePopup">
          <div class="popup-box" @click.stop>

            <div class="popup-header">
              <h5 class="popup-title">{{ popupTitle }}</h5>
              <button class="popup-close-btn" @click="closePopup">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="popup-content">
              <div v-if="popupFrequency" class="popup-freq-badge">
                <i class="fa-solid fa-repeat"></i>
                {{ popupFrequency }}
              </div>

              <p class="popup-date-text">
                <i class="fa-regular fa-calendar"></i>
                {{ popupFullDate }}
              </p>

              <div v-if="popupTasks.length" class="popup-tasks">
                <p class="popup-section-title">{{ popupSectionTitle }}</p>
                <ul class="popup-list">
                  <li v-for="(task, i) in popupTasks" :key="i">
                    <span class="task-bullet"></span>
                    <span class="task-text">{{ task }}</span>
                  </li>
                </ul>
              </div>

              <div v-else class="popup-empty">
                <i class="fa-regular fa-circle-check"></i>
                <span>ไม่มีรายการ</span>
              </div>
            </div>

          </div>
        </div>
      </Transition>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "../components/Layout/MainLayout.vue";

const router = useRouter();
const API_BASE = '/api/Xraycare';

/* ---------------- Table Data (จาก API) ---------------- */
const machines = ref([]);
const repairRequests = ref([]);
const loading = ref(false);

const hasMachines = computed(() => pendingMachines.value.length > 0);

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const displayDate = computed(() => {
  const now = new Date();
  const day = now.getDate();
  const month = monthNamesShort[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
});

/* ---------- Daily Check ---------- */
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

const pendingMachines = computed(() =>
  machines.value.filter(m => !todayCheckedMachines.value.includes(m.machineName))
);

const equipmentCount = computed(() => machines.value.length);
const pendingCount = computed(() => pendingMachines.value.length);
const completedStatuses = ['ดำเนินการแล้ว', 'ซ่อมเสร็จ', 'completed'];
const repairRequestCount = computed(() =>
  repairRequests.value.filter(r => {
    const s = (r.statusText || '').toLowerCase();
    return !completedStatuses.includes(s);
  }).length
);

const sampleRows = computed(() =>
  pendingMachines.value.map((m, index) => ({
    rid: String(index + 1).padStart(3, '0'),
    equipment: m.machineName || '-',
    machine_name: m.machineName || '-',
    room: m.room || '-',
    caretaker: m.caretaker || '-'
  }))
);

/* ---------- Schedule Config (สำหรับเช็คว่าวันนี้ต้องทำ form อะไรบ้าง) ---------- */
const scheduleConfigs = ref([]);

async function loadScheduleConfigs() {
  try {
    const res = await fetch(`${API_BASE}/GetAllScheduleConfigs`);
    if (!res.ok) return;
    const data = await res.json();
    scheduleConfigs.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadScheduleConfigs error:', e);
    scheduleConfigs.value = [];
  }
}

/** คืนค่ารายการ form types ที่ต้องทำวันนี้: เริ่ม F1_F2 แล้วตาม config ที่ครบกำหนด */
function getFormTypesDueToday() {
  const todayDate = new Date();
  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const todayDay = todayDate.getDate();
  const result = ['F1_F2'];

  function parseFormTypes(jsonStr) {
    if (!jsonStr || typeof jsonStr !== 'string') return [];
    try {
      const arr = JSON.parse(jsonStr);
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  for (const cfg of scheduleConfigs.value) {
    const startDateStr = cfg.startDate || '';
    const freq = cfg.frequencyType || '';
    if (!startDateStr || !freq) continue;

    let startYear, startMonth, startDay;
    if (startDateStr.includes('-')) {
      const parts = startDateStr.split('-').map(Number);
      if (parts.length !== 3) continue;
      [startYear, startMonth, startDay] = parts;
      startMonth -= 1;
    } else {
      const parts = startDateStr.split('/').map(Number);
      if (parts.length !== 3) continue;
      [startDay, startMonth, startYear] = parts;
      startMonth -= 1;
    }

    if (todayDay !== startDay) continue;

    const diffMonths = (todayYear - startYear) * 12 + (todayMonth - startMonth);
    if (diffMonths < 0) continue;

    const interval = { '1m': 1, '3m': 3, '6m': 6 }[freq];
    if (!interval) continue;
    if (diffMonths % interval !== 0) continue;

    const types = parseFormTypes(cfg.formTypes);
    for (const t of types) {
      if (t && !result.includes(t)) result.push(t);
    }
  }

  return result;
}

/* ---------- Notifications ---------- */
const notifications = ref([]);

async function loadNotifications() {
  const allNotifs = [];

  try {
    const res = await fetch(`${API_BASE}/GetNotifications`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) allNotifs.push(...data);
    }
  } catch (e) {
    console.error('loadNotifications API error:', e);
  }

  try {
    const savedRules = JSON.parse(localStorage.getItem('pmMonthlyRules') || '{}');
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const freqLabels = { '1m': 'ทุก 1 เดือน', '3m': 'ทุก 3 เดือน', '6m': 'ทุก 6 เดือน' };
    const intervalMap = { '1m': 1, '3m': 3, '6m': 6 };
    const existingDates = new Set(allNotifs.map(n => n.nextCheckDate));

    let localId = 9000;
    for (const [startKey, type] of Object.entries(savedRules)) {
      const interval = intervalMap[type];
      if (!interval) continue;

      const [y, m, d] = startKey.split('-').map(Number);
      if (!y || !m || !d) continue;

      let startDate;
      try { startDate = new Date(y, m - 1, d); } catch { continue; }

      let nextCheck = new Date(startDate);
      while (nextCheck < todayDate) {
        nextCheck = new Date(nextCheck.getFullYear(), nextCheck.getMonth() + interval, nextCheck.getDate());
      }

      const daysRemaining = Math.round((nextCheck - todayDate) / (1000 * 60 * 60 * 24));

      const dd = String(nextCheck.getDate()).padStart(2, '0');
      const mm = String(nextCheck.getMonth() + 1).padStart(2, '0');
      const yyyy = nextCheck.getFullYear();
      const checkDateStr = `${dd}/${mm}/${yyyy}`;

      if (existingDates.has(checkDateStr)) continue;

      let status = 'upcoming';
      if (daysRemaining === 0) status = 'today';
      else if (daysRemaining > 7) status = 'info';

      allNotifs.push({
        id: `local-${localId++}`,
        status,
        daysRemaining,
        nextCheckDate: checkDateStr,
        frequencyType: type,
        frequencyLabel: freqLabels[type] || type,
        description: ''
      });
    }
  } catch (e) {
    console.error('loadNotifications localStorage error:', e);
  }

  allNotifs.sort((a, b) => a.daysRemaining - b.daysRemaining);
  notifications.value = allNotifs;
}

function dismissNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id);
}

/* ---------- API ---------- */
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
  const formTypes = getFormTypesDueToday();
  const query = formTypes.length > 0 ? { formTypes: formTypes.join(',') } : {};
  router.push({ name: "DairyCheckPage", params: { equipmentName }, query });
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

/* ---------- localStorage shared with PM Schedule ---------- */
const STORAGE_EVENTS_KEY = "pmEventsByDate";
const STORAGE_RULES_KEY = "pmMonthlyRules";
const STORAGE_HIDDEN_MONTHLY_KEY = "pmHiddenMonthlyTasks";
const STORAGE_DAILY_DISABLED_KEY = "pmDisabledDailyDates";

const eventsByDate = ref({});
const monthlyTypeByStartDate = ref({});
const hiddenMonthlyTasksByDate = ref({});
const disabledDailyDates = ref({});

const DAILY_SPECIAL_DATES = [
  { year: 2025, month: 10, day: 28 }
];

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

const hasMonthlyTag = (cell) => {
  const date = getCellDate(cell);
  if (!date) return false;
  return !!getMonthlyTypeForDate(date);
};

const isDailySpecialCell = (cell) => {
  const date = getCellDate(cell);
  return isDailySpecialDate(date);
};

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

/* ---------- Popup ---------- */
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

/* ---------- onMounted ---------- */
onMounted(async () => {
  loadDailyChecked();

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

  loading.value = true;
  await Promise.all([loadMachines(), loadRepairRequests(), loadNotifications(), loadScheduleConfigs()]);
  loading.value = false;
});
</script>

<style scoped>
/* ==================== NOTIFICATION STYLES ==================== */
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 8px;
}

.notification-banner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-radius: var(--radius-lg, 16px);
  color: #fff;
  overflow: hidden;
  box-shadow: var(--shadow-lg, 0 8px 30px rgba(0, 0, 0, 0.12));
  animation: notifSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes notifSlideIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.notif-today {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  animation: notifSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1), notifGlow 2s ease-in-out infinite;
}

@keyframes notifGlow {
  0%, 100% { box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3); }
  50% { box-shadow: 0 8px 36px rgba(220, 38, 38, 0.55); }
}

.notif-pulse-ring {
  position: absolute;
  top: 50%;
  left: 30px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.35);
  animation: pulseRing 1.5s ease-out infinite;
  pointer-events: none;
}

@keyframes pulseRing {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

.notif-urgent {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
}

.notif-warning {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.notif-info {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.notif-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md, 12px);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
}

.notif-body { flex: 1; min-width: 0; }

.notif-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
}

.notif-countdown {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  min-width: 30px;
  height: 30px;
  border-radius: var(--radius-sm, 8px);
  background: rgba(255, 255, 255, 0.2);
  padding: 0 6px;
  margin: 0 2px;
  vertical-align: middle;
}

.notif-detail {
  font-size: 0.78rem;
  margin-top: 2px;
  opacity: 0.85;
  line-height: 1.3;
}

.notif-badge { flex-shrink: 0; }

.badge-today {
  display: inline-block;
  padding: 5px 14px;
  border-radius: var(--radius-full, 9999px);
  background: #fff;
  color: #dc2626;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  animation: badgePulse 1.2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.badge-days {
  display: inline-block;
  padding: 5px 14px;
  border-radius: var(--radius-full, 9999px);
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 600;
  font-size: 0.78rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.notif-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast, 150ms);
  margin-left: 4px;
}

.notif-close:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
}

/* ====== PAGE LAYOUT ====== */
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.page-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main, #0f172a);
}

.page-subtitle {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
  font-weight: 400;
}

/* ====== SUMMARY CARDS ====== */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  transition: all var(--transition-base, 250ms);
}

.summary-card {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: default;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover, 0 8px 25px rgba(0, 0, 0, 0.1));
}

.card-icon-wrap {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md, 12px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.icon-pink {
  background: linear-gradient(135deg, #fce4ec, #f8bbd0);
  color: #c2185b;
}

.icon-purple {
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  color: #0284C7;
}

.icon-orange {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  color: #e65100;
}

.icon-blue {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  color: #1565c0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.card-value {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  letter-spacing: -0.01em;
}

/* ====== SECTION HEADER ====== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--info, #3b82f6);
}

.section-text {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-main, #0f172a);
}

.section-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  background: #fef3c7;
  color: #92400e;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-sm, 8px);
  border: none;
  background: var(--purple-main, #0369A1);
  color: white;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all var(--transition-fast, 150ms);
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.3);
}

.btn-add:hover {
  background: var(--purple-soft, #0EA5E9);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3, 105, 161, 0.4);
}

.btn-add i {
  font-size: 0.75rem;
}

/* ====== TABLE ====== */
.table-card {
  background: var(--bg-card, #ffffff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.modern-table thead {
  background: #f8fafc;
}

.modern-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.modern-table td {
  text-align: left;
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
}

.modern-table tbody tr {
  transition: background var(--transition-fast, 150ms);
}

.modern-table tbody tr:hover {
  background: #f8fafc;
}

.modern-table tbody tr:last-child td {
  border-bottom: none;
}

.row-num {
  font-weight: 600;
  color: var(--text-muted, #94a3b8);
  font-size: 0.8rem;
}

.fw-500 {
  font-weight: 600;
  color: var(--text-main, #0f172a);
}

.empty-row td {
  color: var(--text-muted, #94a3b8);
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-pending {
  background: #fff7ed;
  color: #c2410c;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.check-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 6px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
}

.check-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

.check-btn i {
  font-size: 0.72rem;
}

/* ====== CALENDAR ====== */
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 460px;
}

.date-card {
  padding: 16px 20px;
}

.date-inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.calendar-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md, 12px);
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #0284C7;
}

.date-text {
  display: flex;
  flex-direction: column;
}

.date-main {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main, #0f172a);
}

.date-sub {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
}

.calendar-card {
  padding: 18px 20px 22px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  margin-bottom: 14px;
}

.cal-month-label {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-main, #0f172a);
}

.cal-nav-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #ffffff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--text-secondary, #475569);
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.cal-nav-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: var(--text-main, #0f172a);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  justify-items: center;
  font-size: 0.78rem;
}

.weekday {
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-muted, #94a3b8);
  padding-bottom: 8px;
}

.day-cell {
  position: relative;
  min-height: 42px;
  width: 100%;
  max-width: 50px;
  cursor: pointer;
  border-radius: var(--radius-sm, 8px);
  padding-top: 6px;
  padding-bottom: 20px;
  transition: all var(--transition-fast, 150ms);
}

.day-cell.empty {
  cursor: default;
  background: transparent;
}

.day-cell:not(.empty):hover {
  background: #f1f5f9;
}

.day-number {
  display: flex;
  justify-content: center;
}

.day-number span {
  font-size: 0.8rem;
  color: var(--text-secondary, #475569);
  font-weight: 500;
}

.day-cell.today .day-number span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  box-shadow: 0 2px 8px rgba(3, 105, 161, 0.35);
}

/* tag stack */
.tag-stack {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 1px;
  align-items: center;
}

.tag-pill {
  padding: 1px 5px;
  border-radius: var(--radius-full, 9999px);
  color: white;
  font-size: 0.52rem;
  white-space: nowrap;
  line-height: 1.4;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

.tag-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.7;
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

/* ====== POPUP ====== */
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
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.popup-box {
  background: var(--bg-card, #ffffff);
  width: 400px;
  max-width: 92vw;
  border-radius: var(--radius-xl, 20px);
  padding: 24px;
  box-shadow: var(--shadow-xl, 0 20px 50px rgba(0, 0, 0, 0.15));
  border: 1px solid var(--border-soft, #e2e8f0);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.popup-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

.popup-close-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: transparent;
  color: var(--text-muted, #94a3b8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all var(--transition-fast, 150ms);
}

.popup-close-btn:hover {
  background: #f1f5f9;
  color: var(--text-main, #0f172a);
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-freq-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-sm, 8px);
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.popup-date-text {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-date-text i {
  color: var(--text-muted, #94a3b8);
}

.popup-tasks {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.popup-section-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.popup-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.popup-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.task-bullet {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--purple-main, #0369A1);
  margin-top: 7px;
  flex-shrink: 0;
}

.task-text {
  font-size: 0.82rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
}

.popup-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--radius-sm, 8px);
  background: #f8fafc;
  color: var(--text-muted, #94a3b8);
  font-size: 0.85rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.pop-leave-active {
  transition: all 150ms ease-in;
}
.pop-enter-from {
  opacity: 0;
  transform: translate(-50%, -48%) scale(0.95);
}
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -52%) scale(0.95);
}

/* ====== RESPONSIVE ====== */

/* Table horizontal scroll */
.table-card {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.modern-table {
  min-width: 600px;
}

@media (max-width: 1024px) {
  .page {
    gap: 16px;
  }

  .cards-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .section-header {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .cards-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .summary-card {
    padding: 14px 16px;
  }

  .card-value {
    font-size: 1.2rem;
  }

  .card-icon-wrap {
    width: 40px;
    height: 40px;
    font-size: 0.95rem;
  }

  .notification-banner {
    flex-wrap: wrap;
    padding: 12px 14px;
    gap: 10px;
  }

  .notif-badge {
    width: 100%;
    text-align: right;
  }

  .notif-title {
    font-size: 0.85rem;
  }

  .calendar-wrapper {
    max-width: 100%;
  }

  .calendar-card {
    padding: 14px 12px 16px;
  }

  .cal-month-label {
    font-size: 0.82rem;
  }

  .calendar-grid {
    gap: 2px;
  }

  .day-cell {
    min-height: 36px;
    padding-bottom: 16px;
  }

  .tag-pill {
    font-size: 0.45rem;
    padding: 0px 3px;
  }

  .btn-add span {
    display: none;
  }

  .btn-add {
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-text {
    font-size: 0.9rem;
  }

  .page-title {
    font-size: 1.2rem;
  }

  .page-subtitle {
    font-size: 0.78rem;
  }

  .popup-box {
    width: calc(100vw - 32px);
    max-width: 380px;
  }

  .popup-row {
    width: 100%;
    padding: 0 16px;
    left: 0;
    transform: translate(0, -50%);
    display: flex;
    justify-content: center;
  }

  .pop-enter-from {
    opacity: 0;
    transform: translate(0, -48%) scale(0.95);
  }
  .pop-leave-to {
    opacity: 0;
    transform: translate(0, -52%) scale(0.95);
  }

  .modern-table th,
  .modern-table td {
    padding: 10px 12px;
    font-size: 0.78rem;
  }

  .modern-table th {
    font-size: 0.65rem;
  }

  .check-btn {
    padding: 5px 10px;
    font-size: 0.72rem;
  }

  .status-badge {
    font-size: 0.68rem;
    padding: 3px 8px;
  }
}
</style>

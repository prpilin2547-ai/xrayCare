<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อ -->
      <h1 class="page-title">CHECKLIST</h1>

      <!-- capsule ข้อมูลเครื่อง -->
      <div class="pill-row">
        <div class="pill pill-main">
          {{ selectedDevice.name }}
        </div>
        <div class="pill">รุ่น {{ selectedDevice.model }}</div>
        <div class="pill">ห้อง {{ selectedDevice.room }}</div>
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้ทดสอบ : {{ currentUserName }}</div>
      </div>

      <!-- layout หลัก: sidebar + content -->
      <div class="page-layout">
        <!-- ⭐ sidebar แบบฟอร์ม -->
        <aside class="form-sidebar">
          <!-- เอาเฉพาะส่วน 3 MONTH ออก เหลือแค่ 6 MONTH -->
          <!-- <div class="sidebar-section-label mt-3">6 MONTH</div> -->
          <div
            v-for="tab in formTabs6M"
            :key="tab.id"
            :class="['form-tab', { active: activeForm === tab.id }]"
            @click="activeForm = tab.id"
          >
            <div class="form-code">{{ tab.code }}</div>
            <div class="form-title">{{ tab.title }}</div>
          </div>
        </aside>

        <!-- เนื้อหาฟอร์ม -->
        <div class="form-content">
          <p class="section-label">
            {{ sectionTitle }}
          </p>

          <!-- ==== BLOCK 6 MONTH เท่านั้น ==== -->
          <F7CollimatorForm
            v-if="activeForm === 'F7_1'"
            :initial="formF7_1"
            :current-user-name="currentUserName"
            @next="handleNext('F7_1', $event)"
          />

          <F7CollimatorBuckyForm
            v-else-if="activeForm === 'F7_2'"
            :initial="formF7_2"
            :current-user-name="currentUserName"
            @next="handleNext('F7_2', $event)"
          />

          <F8CRDarkNoiseForm
            v-else-if="activeForm === 'F8_1'"
            :initial="formF8_1"
            :current-user-name="currentUserName"
            @next="handleNext('F8_1', $event)"
          />

          <!-- ⭐ ฟอร์มสุดท้าย F8-2 มีปุ่มบันทึก -->
          <F8DRDarkNoiseForm
            v-else-if="activeForm === 'F8_2'"
            :initial="formF8_2"
            :current-user-name="currentUserName"
            @save="handleSave($event)"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import F7CollimatorForm from '../components/forms/F7CollimatorForm.vue'
import F7CollimatorBuckyForm from '../components/forms/F7CollimatorBuckyForm.vue'
import F8CRDarkNoiseForm from '../components/forms/F8CRDarkNoiseForm.vue'
import F8DRDarkNoiseForm from '../components/forms/F8DRDarkNoiseForm.vue'

const API_BASE = '/api/Xraycare'

const props = defineProps({
  selectedDevice: {
    type: Object,
    default: () => ({ name: '', model: '', room: '' })
  },
  currentUserName: {
    type: String,
    default: ''
  }
})

const router = useRouter()

/* ---------- โหลดข้อมูลเครื่องจาก API + ผู้ใช้จาก localStorage ---------- */
const deviceInfo = ref({ name: '', model: '', room: '' })
const userName = ref('')

const selectedDevice = computed(() =>
  deviceInfo.value.name ? deviceInfo.value : props.selectedDevice
)
const currentUserName = computed(() =>
  userName.value || props.currentUserName || 'Demo User'
)

onMounted(async () => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) userName.value = stored.username
  } catch (e) { /* ignore */ }

  try {
    const res = await fetch(`${API_BASE}/GetAllMachines`)
    if (res.ok) {
      const machines = await res.json()
      if (machines.length > 0) {
        const m = machines[0]
        deviceInfo.value = {
          name: m.machineName,
          model: m.machineName,
          room: m.room || ''
        }
      }
    }
  } catch (e) {
    console.error('Failed to load machines', e)
  }
})

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

/* sidebar tab config: เหลือเฉพาะ 6 เดือน */
const formTabs6M = [
  { id: 'F7_1', code: 'F7-1', title: 'Collimator & Beam Alignment' },
  { id: 'F7_2', code: 'F7-2', title: 'Collimator (DR กับ Bucky)' },
  { id: 'F8_1', code: 'F8-1', title: 'Dark Noise – CR' },
  { id: 'F8_2', code: 'F8-2', title: 'Dark Noise – DR' }
]

/* เริ่มต้นที่ฟอร์ม 6 เดือนตัวแรก */
const activeForm = ref('F7_1')

/* title ด้านบน: ตอนนี้เป็น 6 เดือนตลอด */
const sectionTitle = computed(() => {
  return 'Monthly check (6 month)'
})

/* state เก็บผลแต่ละแบบบันทึก (เฉพาะ 6 เดือน) */
const formF7_1 = ref(null)
const formF7_2 = ref(null)
const formF8_1 = ref(null)
const formF8_2 = ref(null)

/* ลำดับ next เฉพาะฟอร์ม 6 เดือน */
const order = ['F7_1', 'F7_2', 'F8_1', 'F8_2']

const handleNext = (fromId, payload) => {
  // เก็บค่าฟอร์มปัจจุบัน
  if (fromId === 'F7_1') formF7_1.value = payload
  else if (fromId === 'F7_2') formF7_2.value = payload
  else if (fromId === 'F8_1') formF8_1.value = payload

  const idx = order.indexOf(fromId)
  if (idx !== -1 && idx < order.length - 1) {
    activeForm.value = order[idx + 1]
  }
}

/* F8-2 เป็นตัวบันทึกสุดท้าย */
const handleSave = async (payloadF8_2) => {
  formF8_2.value = payloadF8_2

  const payload = {
    formType: 'F7_F8',
    machineName: selectedDevice.value.name,
    room: selectedDevice.value.room,
    checkDate: todayText.value,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      F7_1: formF7_1.value,
      F7_2: formF7_2.value,
      F8_1: formF8_1.value,
      F8_2: formF8_2.value
    })
  }

  try {
    const res = await fetch(`${API_BASE}/SaveChecklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) console.error('SaveChecklist failed:', await res.text())
  } catch (e) {
    console.error('SaveChecklist error:', e)
  }

  router.push('/dashboard')
}
</script>

<style scoped>
@import '../components/Forms/_formTableCommon.css';

.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.pill {
  background: #ffb480;
  color: #111827;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.pill-main {
  color: #047857;
  font-weight: 700;
}

.page-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* sidebar */
.form-sidebar {
  width: 260px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.sidebar-section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

.form-tab {
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background 0.18s ease, transform 0.12s ease;
}

.form-tab:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.form-tab.active {
  background: #3b82f6;
  color: #ffffff;
}

.form-code {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.form-title {
  font-size: 0.85rem;
}

/* content */
.form-content {
  flex: 1;
}

.section-label {
  font-size: 1rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 10px;
}

@media (max-width: 960px) {
  .page-layout {
    flex-direction: column;
  }

  .form-sidebar {
    width: 100%;
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .form-tab {
    flex: 1;
    min-width: 170px;
  }
}
</style>

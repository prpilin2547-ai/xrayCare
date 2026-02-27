<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อ 3 เดือน -->
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
          <div
            v-for="tab in formTabs"
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
          <p class="section-label">Monthly check (3 month)</p>

          <!-- F3 -->
          <F3MonitorForm
            v-if="activeForm === 'F3'"
            :initial="formF3"
            :current-user-name="currentUserName"
            @next="handleNext('F3', $event)"
          />

          <!-- F4 -->
          <F4XrayCheckForm
            v-else-if="activeForm === 'F4'"
            :initial="formF4"
            :current-user-name="currentUserName"
            @next="handleNext('F4', $event)"
          />

          <!-- F5 -->
          <F5UniformityForm
            v-else-if="activeForm === 'F5'"
            :initial="formF5"
            :current-user-name="currentUserName"
            @next="handleNext('F5', $event)"
          />

          <!-- F6 -->
          <F6EIConsistencyForm
            v-else-if="activeForm === 'F6'"
            :initial="formF6"
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
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import F3MonitorForm from '../components/forms/F3MonitorForm.vue'
import F4XrayCheckForm from '../components/forms/F4XrayCheckForm.vue'
import F5UniformityForm from '../components/forms/F5UniformityForm.vue'
import F6EIConsistencyForm from '../components/forms/F6EIConsistencyForm.vue'

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
const route = useRoute()

/* ---------- โหลดข้อมูลเครื่องจาก API + ผู้ใช้จาก localStorage (ถ้ามี equipmentName ใน query ใช้เครื่องนั้น — มาจาก Daily ถัดไป) ---------- */
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
        const fromQuery = route.query.equipmentName || props.selectedDevice?.name
        const m = fromQuery
          ? machines.find(mx => (mx.machineName || '').trim() === String(fromQuery).trim())
          : null
        if (m) {
          deviceInfo.value = {
            name: m.machineName,
            model: m.model || m.machineName,
            room: m.room || route.query.room || props.selectedDevice?.room || ''
          }
        } else if (fromQuery) {
          deviceInfo.value = {
            name: String(fromQuery).trim(),
            model: props.selectedDevice?.model || String(fromQuery).trim(),
            room: route.query.room || props.selectedDevice?.room || ''
          }
        } else {
          const first = machines[0]
          deviceInfo.value = {
            name: first.machineName,
            model: first.machineName,
            room: first.room || ''
          }
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

/* sidebar */
const formTabs = [
  { id: 'F3', code: 'F3', title: 'Display monitor' },
  { id: 'F4', code: 'F4', title: 'ตรวจสอบเครื่องเอกซเรย์' },
  { id: 'F5', code: 'F5', title: 'Measured Uniformity' },
  { id: 'F6', code: 'F6', title: 'Consistency of EI' }
]

const activeForm = ref('F3')

/* state เก็บผลแต่ละแบบบันทึก */
const formF3 = ref(null)
const formF4 = ref(null)
const formF5 = ref(null)
const formF6 = ref(null)

/* เมื่อกด ถัดไป ในแต่ละฟอร์ม */
const handleNext = (fromId, payload) => {
  if (fromId === 'F3') {
    formF3.value = payload
    activeForm.value = 'F4'
  } else if (fromId === 'F4') {
    formF4.value = payload
    activeForm.value = 'F5'
  } else if (fromId === 'F5') {
    formF5.value = payload
    activeForm.value = 'F6'
  }
}

/* เมื่อฟอร์ม F6 กดบันทึกสุดท้าย */
const handleSave = async (payloadF6) => {
  formF6.value = payloadF6

  const payload = {
    formType: 'F3_F6',
    machineName: selectedDevice.value.name,
    room: selectedDevice.value.room,
    checkDate: todayText.value,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      F3: formF3.value,
      F4: formF4.value,
      F5: formF5.value,
      F6: formF6.value
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
  padding: 0;
  min-height: calc(100vh - 56px);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.pill {
  background: #f1f5f9;
  color: var(--text-secondary, #475569);
  padding: 6px 16px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.pill-main {
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  color: #0369A1;
  font-weight: 700;
  border-color: #7DD3FC;
}

.page-layout {
  display: flex;
  gap: 24px;
}

.form-sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-tab {
  padding: 10px 16px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  color: var(--text-secondary, #475569);
  transition: all var(--transition-fast, 150ms cubic-bezier(0.4, 0, 0.2, 1));
}

.form-tab:hover {
  background: #f1f5f9;
}

.form-tab.active {
  background: linear-gradient(135deg, rgba(3,105,161,0.1), rgba(14,165,233,0.06));
  color: var(--purple-main, #0369A1);
  font-weight: 600;
  border-left: 3px solid var(--purple-main, #0369A1);
}

.form-code {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.form-title {
  font-size: 0.85rem;
}

.form-content {
  flex: 1;
  min-width: 0;
}

.section-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .page-layout { flex-direction: column; gap: 16px; }
  .form-sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; gap: 6px; }
  .form-tab { padding: 8px 14px; font-size: 0.8rem; }
  .form-content { width: 100%; }
}
@media (max-width: 640px) {
  .checklist-page { padding: 0; }
  .pill-row { gap: 6px; }
  .pill { font-size: 0.75rem; padding: 5px 12px; }
  .section-label { font-size: 0.9rem; }
  .form-tab { padding: 7px 10px; font-size: 0.75rem; }
}
</style>

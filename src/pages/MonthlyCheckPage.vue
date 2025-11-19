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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import F3MonitorForm from '../components/forms/F3MonitorForm.vue'
import F4XrayCheckForm from '../components/forms/F4XrayCheckForm.vue'
import F5UniformityForm from '../components/forms/F5UniformityForm.vue'
import F6EIConsistencyForm from '../components/forms/F6EIConsistencyForm.vue'

const props = defineProps({
  selectedDevice: {
    type: Object,
    default: () => ({
      name: 'เครื่องเอกซเรย์ทั่วไป',
      model: 'MODEL-XR-100',
      room: 'X-Ray Room 1'
    })
  },
  currentUserName: {
    type: String,
    default: 'Demo User'
  }
})

const router = useRouter()

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
const handleSave = (payloadF6) => {
  formF6.value = payloadF6

  const allPayload = {
    device: props.selectedDevice,
    date: todayText.value,
    user: props.currentUserName,
    F3: formF3.value,
    F4: formF4.value,
    F5: formF5.value,
    F6: formF6.value
  }

  console.log('📦 Monthly check payload (ready to send backend):', allPayload)

  router.push('/dashboard')
}
</script>

<style scoped>
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
  width: 230px;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
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
    min-width: 140px;
  }
}
</style>

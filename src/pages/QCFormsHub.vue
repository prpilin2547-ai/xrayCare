<!-- src/pages/QCFormsHub.vue -->
<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">
        Additional QC Forms 
      </h1>

      <!-- แคปซูลด้านบน -->
      <!-- <div class="pill-row">
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้ใช้งาน : {{ currentUserName }}</div>
      </div> -->

      <!-- กล่องเนื้อหา -->
      <div class="content-panel">
        <div class="header-row">
          <div>
            <h2 class="section-title">เลือกแบบบันทึกที่ต้องการใช้งาน</h2>
            <p class="section-subtitle">
              เลือกแบบฟอร์มที่ต้องการบันทึกข้อมูลคุณภาพเครื่องมือและอุปกรณ์
            </p>
          </div>
        </div>

        <!-- Grid แสดงการ์ดแบบบันทึก -->
        <div class="form-grid">
          <div
            v-for="form in forms"
            :key="form.id"
            class="form-card"
            @click="openForm(form.route)"
          >
            <div class="form-code">
              {{ form.code }}
            </div>
            <div class="form-main">
              <h3 class="form-title">{{ form.title }}</h3>
              <p class="form-desc">{{ form.description }}</p>
              <div class="form-meta">
                <span class="badge">{{ form.category }}</span>
              </div>
            </div>
            <button
              type="button"
              class="btn-card"
              @click.stop="openForm(form.route)"
            >
              เปิดแบบบันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const props = defineProps({
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

/**
 * forms: กำหนด route ให้ตรงกับที่คุณตั้งใน router/index.js
 * ถ้าใช้ชื่อ path อื่น เช่น /f9-protective ให้เปลี่ยนใน field route ได้เลย
 */
const forms = [
  {
    id: 'f9',
    code: 'F9',
    title: 'แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว',
    description: 'ตรวจสอบสภาพเสื้อตะกั่วและอุปกรณ์ป้องกันรังสี',
    route: '/f9', // แก้ให้ตรงกับ route จริงของ F9ProtectiveClothesForm.vue
    category: 'Protective Devices'
  },
  {
    id: 'f11',
    code: 'F11',
    title: 'แบบบันทึกผลการวัดความหนาผู้ป่วย',
    description: 'บันทึกค่าความหนาของผู้ป่วยและเทคนิคที่ใช้ในการถ่ายภาพ',
    route: '/f11',
    category: 'General X-ray'
  },
  {
    id: 'f12',
    code: 'F12',
    title: 'แบบบันทึกอัตราการถ่ายภาพซ้ำ',
    description: 'ประเมินสาเหตุการถ่ายภาพซ้ำและอัตราการปฏิเสธภาพ',
    route: '/f12',
    category: 'Quality Indicator'
  },
  {
    id: 'f13',
    code: 'F13',
    title: 'B-mode QC Test เครื่องอัลตราซาวด์',
    description: 'บันทึกผลการตรวจสอบคุณภาพภาพอัลตราซาวด์โหมด B-mode',
    route: '/f13',
    category: 'Ultrasound QC'
  }
]

const openForm = (routePath) => {
  router.push(routePath)
}
</script>

<style scoped>
/* ใช้สไตล์พื้นฐานตามหน้า checklist เดิม */
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

.content-panel {
  background: #ffffff;
  padding: 20px 24px 28px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 4px;
}

/* Grid การ์ดแบบฟอร์ม */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f9fafb, #e5f3ff);
  border-radius: 12px;
  padding: 14px 14px 12px;
  box-shadow: 0 0 0 1px #d1d5db;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.2s;
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
  background: linear-gradient(135deg, #eff6ff, #e0f2fe);
}

.form-code {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.form-main {
  flex: 1;
}

.form-title {
  font-size: 0.98rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.form-desc {
  font-size: 0.82rem;
  color: #4b5563;
  margin-bottom: 8px;
}

.form-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-card {
  margin-top: 10px;
  align-self: flex-end;
  border: none;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: #65d46e;
  color: #ffffff;
  transition: background 0.15s ease, transform 0.1s ease;
}

.btn-card:hover {
  background: #4fb759;
  transform: translateY(-1px);
}

/* responsive */
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checklist-page {
    padding: 16px;
  }
  .pill-row {
    gap: 8px;
  }
  .pill {
    font-size: 0.8rem;
  }
}
</style>

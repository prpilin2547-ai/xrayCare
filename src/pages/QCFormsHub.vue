<!-- src/pages/QCFormsHub.vue -->
<template>
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">
        Additional QC Forms
      </h1>

      <!-- กล่องเนื้อหา -->
      <div class="content-panel">
        <div class="header-row">
          <div>
            <h2 class="section-title">เลือกแบบบันทึกที่ต้องการใช้งาน</h2>
            <p class="section-subtitle">
              เลือกแบบฟอร์มที่ต้องการบันทึกข้อมูลคุณภาพเครื่องมือและอุปกรณ์
            </p>
          </div>

          <!-- ปุ่มสร้างฟอร์มเอง -->
          <div class="header-actions">
            <button type="button" class="btn-outline" @click="goToCreateForm">
              + สร้างแบบบันทึก
            </button>
          </div>
        </div>

        <!-- Grid แสดงการ์ดแบบบันทึก -->
        <div class="form-grid">
          <div v-for="form in allForms" :key="form.id" class="form-card" @click="openForm(form.route)">
            <!-- ปุ่มลบสำหรับฟอร์มที่สร้างเอง -->
            <button v-if="isCustomForm(form.id)" type="button" class="btn-delete"
              @click.stop="deleteCustomForm(form.id)" title="ลบแบบบันทึก">
              ✕
            </button>

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
            <button type="button" class="btn-card" @click.stop="openForm(form.route)">
              เปิดแบบบันทึก
            </button>
          </div>

          <!-- กรณีไม่มีฟอร์มเลย -->
          <div v-if="!allForms.length" class="empty-card">
            ยังไม่มีแบบฟอร์ม ให้กด &quot;สร้างแบบฟอร์มเอง&quot; เพื่อเริ่มต้น
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

const props = defineProps({
  currentUserName: {
    type: String,
    default: 'Demo User'
  }
})

const router = useRouter()

// แบบฟอร์มที่ fix ไว้เดิม
const builtinForms = [
  {
    id: 'f9',
    code: 'F9',
    title: 'แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว',
    description: 'ตรวจสอบสภาพเสื้อตะกั่วและอุปกรณ์ป้องกันรังสี',
    route: '/f9',
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

// ฟอร์มที่ผู้ใช้สร้างเองจาก localStorage
const customForms = ref([])

// รวมทั้งหมด
const allForms = computed(() => {
  return [...builtinForms, ...customForms.value]
})

const loadCustomForms = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare_custom_forms') || '[]')
    if (Array.isArray(stored)) {
      customForms.value = stored
    }
  } catch (err) {
    console.error('อ่าน custom forms จาก localStorage ไม่ได้', err)
    customForms.value = []
  }
}

const openForm = (routePath) => {
  if (!routePath) return
  router.push(routePath)
}

const goToCreateForm = () => {
  // path นี้ให้ตั้งใน router ว่าใช้ CustomFormBuilder.vue
  router.push('/custom-form-builder')
}

// ตรวจสอบว่าเป็นฟอร์มที่ผู้ใช้สร้างเองหรือไม่
const isCustomForm = (formId) => {
  return customForms.value.some(form => form.id === formId)
}

// ลบฟอร์มที่สร้างเองออกจาก localStorage
const deleteCustomForm = (formId) => {
  if (confirm('คุณต้องการลบแบบบันทึกนี้หรือไม่?')) {
    // ลบออกจาก array
    customForms.value = customForms.value.filter(form => form.id !== formId)

    // บันทึกกลับไปที่ localStorage
    try {
      localStorage.setItem('xraycare_custom_forms', JSON.stringify(customForms.value))
      console.log('ลบฟอร์มสำเร็จ:', formId)
    } catch (err) {
      console.error('ลบฟอร์มไม่สำเร็จ:', err)
      alert('เกิดข้อผิดพลาดในการลบฟอร์ม')
    }
  }
}

onMounted(() => {
  loadCustomForms()
})
</script>

<style scoped>
.checklist-page {
  background: var(--bg-card, #ffffff);
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.content-panel {
  background: var(--bg-card, #ffffff);
  padding: 24px 28px 32px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  margin-top: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.btn-outline {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  background: var(--bg-card, #fff);
  transition: all var(--transition-fast, 150ms);
}

.btn-outline:hover {
  background: #f1f5f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.form-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  padding: 20px;
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  cursor: pointer;
  transition: all 250ms;
}

.form-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.form-code {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.7rem;
  font-weight: 700;
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  color: #0284C7;
  margin-bottom: 10px;
}

.form-main {
  flex: 1;
}

.form-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin: 8px 0 4px;
}

.form-desc {
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
  margin-bottom: 8px;
}

.form-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: #f0fdf4;
  color: #15803d;
  border-radius: var(--radius-full, 9999px);
  padding: 2px 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.btn-card {
  border: none;
  padding: 7px 16px;
  border-radius: var(--radius-sm, 8px);
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  font-weight: 600;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
  box-shadow: 0 2px 6px rgba(3, 105, 161, 0.25);
  margin-top: 12px;
  align-self: flex-start;
}

.btn-card:hover {
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.35);
}

.btn-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  border-radius: var(--radius-sm, 8px);
  padding: 5px 12px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
  z-index: 10;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-card {
  grid-column: 1 / -1;
  padding: 32px 24px;
  border-radius: var(--radius-lg, 16px);
  background: #f8fafc;
  border: 1px dashed var(--border-soft, #e2e8f0);
  font-size: 0.9rem;
  color: var(--text-muted, #94a3b8);
  text-align: center;
}

@media (max-width: 1024px) {
  .form-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
}
@media (max-width: 640px) {
  .header-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-card { padding: 16px; }
  .page-title { font-size: 1.2rem; }
}
</style>

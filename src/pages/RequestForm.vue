<template>
  <MainLayout>
    <div class="page">


      <!-- หัวข้อ -->
      <div class="section-title">
        ระบบแจ้งซ่อม
      </div>

      <!-- ฟอร์ม -->
      <form class="form" @submit.prevent="submitForm">
        <!-- อุปกรณ์ -->
        <div class="form-row">
          <label class="label">อุปกรณ์ :</label>
          <div class="field">
            <button type="button" class="pill-btn">
              เลือกอุปกรณ์
              <span class="arrow">▼</span>
            </button>
          </div>
        </div>

        <!-- รายละเอียด -->
<div class="form-row">
  <label class="label">รายละเอียด :</label>
  <div class="field">
    <textarea
      v-model="detail"
      class="textarea-input"
      placeholder="เพิ่มรายละเอียด"
    ></textarea>
  </div>
</div>


        <!-- แนบไฟล์ภาพ -->
<div class="form-row">
  <label class="label">แนบไฟล์ภาพ :</label>
  <div class="field">

    <!-- input file ซ่อน -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden-file"
      @change="onFileSelected"
    />

    <!-- ปุ่ม UI
    <button type="button" class="pill-btn" @click="triggerFileSelect">
      เลือกไฟล์
      <span class="camera">📷</span>
    </button> -->

    <!-- แสดงชื่อไฟล์ -->
    <div v-if="fileName" class="file-name">
      {{ fileName }}
    </div>

  </div>
</div>


        <!-- ปุ่มแจ้งซ่อม -->
        <div class="form-actions">
          <button type="submit" class="btn-submit">
            แจ้งซ่อม
          </button>
        </div>
      </form>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/Layout/MainLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const detail = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)
const fileName = ref('')

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const onFileSelected = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    fileName.value = file.name
    console.log('เลือกไฟล์:', file)
  }
}

const submitForm = () => {
  alert('Mock: ส่งคำขอแจ้งซ่อมแล้ว (demo)')
  router.push('/requests')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--text-main, #0f172a);
}

.form {
  width: 100%;
  max-width: 820px;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 32px;
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
}

.field {
  min-width: 0;
}

.pill-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 18px;
  min-width: 180px;
  background: #fff;
  color: var(--text-secondary, #475569);
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.pill-btn:hover {
  background: #f8fafc;
}

.arrow {
  font-size: 0.75rem;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.btn-submit {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(3,105,161,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3,105,161,0.4);
}

.textarea-input {
  width: 100%;
  min-height: 140px;
  background: #fff;
  border-radius: var(--radius-sm, 8px);
  padding: 12px 14px;
  font-size: 0.85rem;
  color: var(--text-main, #0f172a);
  border: 1px solid var(--border-soft, #e2e8f0);
  outline: none;
  resize: vertical;
  transition: all 200ms;
}

.textarea-input:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}

.textarea-input::placeholder {
  color: var(--text-muted, #94a3b8);
}

.file-name {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
}

@media (max-width: 640px) {
  .form { padding: 16px; border-radius: 12px; }
  .section-title { font-size: 1.1rem; }
  .form-row { grid-template-columns: 1fr; gap: 6px; }
  .label { font-size: 0.8rem; width: 100%; }
  .field { width: 100%; }
  .textarea-input { min-height: 80px; }
  .btn-submit { width: 100%; }
}
</style>

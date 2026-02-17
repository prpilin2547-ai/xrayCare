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
  padding-top: 8px;
}

.page-title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 500;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 18px;
}

/* ฟอร์ม */
.form {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.label {
  width: 110px;
  font-size: 0.95rem;
}

.field {
  flex: 1;
}

/* ปุ่มเลือกอุปกรณ์ / เลือกไฟล์ */
.pill-btn {
  border-radius: 999px;
  border: none;
  padding: 10px 18px;
  min-width: 180px;
  background: #d4d4d4;
  color: #111827;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.arrow {
  font-size: 0.75rem;
}

.camera {
  font-size: 1rem;
}

/* ปุ่มแจ้งซ่อม ล่างขวา */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.btn-submit {
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  background: #86efac;
  color: #111827;
  font-size: 0.95rem;
  cursor: pointer;
}
.textarea-input {
  width: 100%;
  min-height: 140px;
  background: #d4d4d4;
  border-radius: 18px;
  padding: 18px 16px;
  font-size: 0.9rem;
  color: #111827;
  border: none;
  outline: none;
  resize: vertical; /* สามารถยืดได้, ถ้าไม่ต้องการให้ลบออก */
}

.textarea-input::placeholder {
  color: #9ca3af;
}


</style>

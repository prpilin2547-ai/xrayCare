<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Export PDF</h2>

      <div class="form-panel">
        <form class="form">
          <div class="form-group">
            <label for="machine">X-ray machine</label>
            <div class="select-wrapper">
              <select id="machine" v-model="machine">
                <option value="" disabled>ชื่อรุ่น/ชื่อเครื่อง X-ray/หมายเลขห้อง</option>
                <option value="shimazu">Shimazu - Room 1</option>
                <option value="carestream">Carestream - Room 2</option>
              </select>
              <span class="arrow">▼</span>
            </div>
          </div>

          <div class="form-group">
            <label for="checklistType">Checklist type</label>
            <div class="select-wrapper">
              <select id="checklistType" v-model="checklistType">
                <option value="" disabled>รูปแบบการ Checklist</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
              <span class="arrow">▼</span>
            </div>
          </div>

          <div class="form-group">
            <label for="date">Date</label>
            <div class="date-wrapper">
              <input
                id="date"
                v-model="date"
                type="text"
                placeholder="DD/MM/YYYY"
              />
              <span class="date-icon">📅</span>
            </div>
          </div>
        </form>
      </div>

      <div class="preview-wrapper">
        <button class="btn-preview">
          ตัวอย่างไฟล์
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const machine = ref('')
const checklistType = ref('')
const date = ref('')
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-title {
  margin: 0;
}

.form-panel {
  max-width: 520px;
  background: #f3f4f6;
  border-radius: 16px;
  padding: 16px 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #374151;
}

.select-wrapper {
  position: relative;
}

select {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 8px 28px 8px 12px;
  font-size: 0.9rem;
  background: white;
  appearance: none;
}

.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  pointer-events: none;
}

.date-wrapper {
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding-right: 10px;
  background: white;
}

.date-wrapper input {
  border: none;
  outline: none;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 0.9rem;
  flex: 1;
}

.date-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

.preview-wrapper {
  display: flex;
  justify-content: flex-end;
  max-width: 520px;
}

.btn-preview {
  border-radius: 999px;
  border: 1px solid #9ca3af;
  background: #e5e7eb;
  padding: 8px 18px;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
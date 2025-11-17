<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-note">Created New Machine</h2>

      <div class="form-card">
        <h1 class="form-title">Created New Machine</h1>

        <form class="form-grid" @submit.prevent="handleSave">
          <div class="form-row">
            <div class="form-label">
              <label for="machineName">เครื่อง x-ray (ระบุชื่อ,ยี่ห้อ,รุ่น):</label>
            </div>
            <div class="form-input">
              <input
                id="machineName"
                v-model="machineName"
                type="text"
                placeholder="เช่น เครื่อง x-ray shimazu รุ่น AAA"
              />
              <p class="form-example">
                ตัวอย่าง: เครื่อง x-ray shimazu รุ่น AAA
              </p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label">
              <label for="room">ห้องตรวจ</label>
            </div>
            <div class="form-input">
              <input
                id="room"
                v-model="room"
                type="text"
                placeholder="เช่น 2"
              />
              <p class="form-example">
                ตัวอย่าง: 2
              </p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label">
              <label for="registerDate">วันที่ลงทะเบียนเครื่องครั้งแรก</label>
            </div>
            <div class="form-input">
              <div class="date-wrapper">
                <input
                  id="registerDate"
                  v-model="registerDate"
                  type="text"
                  placeholder="xx/xx/xx"
                />
                <span class="date-icon">📅</span>
              </div>
              <p class="form-example">
                ตัวอย่าง: 18/พ.ย./68
              </p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label">
              <label for="caretaker">ผู้ดูแลเครื่อง</label>
            </div>
            <div class="form-input">
              <input
                id="caretaker"
                v-model="caretaker"
                type="text"
                placeholder="ศุภกร งานเมือง"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn back"
              @click="goBack"
            >
              Back
            </button>
            <button
              type="submit"
              class="btn save"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const router = useRouter()

const machineName = ref('')
const room = ref('')
const registerDate = ref('')
const caretaker = ref('ศุภกร งานเมือง')

const goBack = () => {
  router.push('/dashboard')
}

const handleSave = () => {
  alert('Mock: บันทึกข้อมูลเครื่องใหม่แล้ว (demo เท่านั้น)')
  router.push('/dashboard')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-note {
  font-size: 0.9rem;
  color: #9ca3af;
  align-self: flex-start;
  margin: 0 0 12px;
}

.form-card {
  width: 100%;
  max-width: 820px;
  background: white;
  border-radius: 18px;
  padding: 26px 28px 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
}

.form-title {
  margin: 0 0 18px;
  text-align: center;
  font-size: 1.4rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
}

.form-label label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.form-input input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 0.9rem;
}

.form-input input:focus {
  border-color: var(--purple-main);
  outline: none;
  box-shadow: 0 0 0 1px rgba(91, 60, 196, 0.18);
}

.form-example {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 4px 0 0;
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
  border-radius: 999px;
  padding-right: 0;
}

.date-wrapper input:focus {
  box-shadow: none;
  outline: none;
}

.date-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  min-width: 96px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn.back {
  border: 1px solid #111827;
  background: white;
  color: #111827;
}

.btn.save {
  border: none;
  background: var(--purple-main);
  color: white;
  font-weight: 600;
}

.btn.save:hover {
  background: #4c2faf;
}
</style>
<template>
  <MainLayout>
    <div class="page">
      <p class="header-note">แก้ไข password</p>

      <div class="profile-card">
        <h1 class="title">User Profile</h1>

        <div class="avatar"></div>

        <form class="form" @submit.prevent="handleEdit">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="xxxxxxx"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
              />
              <button type="button" class="eye-btn" @click="togglePassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn-edit">
            Edit
          </button>
        </form>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const username = ref('admin')
const password = ref('password123')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleEdit = () => {
  alert('Mock: บันทึกการแก้ไขโปรไฟล์แล้ว (demo)')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-note {
  align-self: flex-start;
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0 0 10px;
}

.profile-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 18px;
  padding: 24px 26px 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  text-align: center;
}

.title {
  margin: 0 0 12px;
  font-size: 1.4rem;
}

.avatar {
  width: 84px;
  height: 84px;
  border-radius: 999px;
  background: #e5e7eb;
  border: 2px solid #f3f4f6;
  margin: 0 auto 16px;
}

.form {
  text-align: left;
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

.form-group input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 0.9rem;
}

.password-wrapper {
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding-right: 4px;
  background: white;
}

.password-wrapper input {
  border: none;
  border-radius: 999px;
  padding-right: 0;
}

.eye-btn {
  border: none;
  background: transparent;
  padding: 0 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  margin-top: 12px;
  border-radius: 999px;
  border: 1px solid #111827;
  background: white;
  padding: 8px 0;
  font-size: 0.95rem;
  cursor: pointer;
}
</style>
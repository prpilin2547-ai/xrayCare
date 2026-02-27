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
  color: var(--text-muted, #94a3b8);
  margin: 0 0 10px;
}

.profile-card {
  max-width: 460px;
  margin: 0 auto;
  width: 100%;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 32px;
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  text-align: center;
}

.title {
  margin: 0 0 24px;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E0F2FE, #BAE6FD);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #0284C7;
  font-size: 2rem;
}

.form {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--text-secondary, #475569);
  font-weight: 600;
}

.form-group input {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
  transition: all 200ms;
}

.form-group input:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.password-wrapper {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding-right: 4px;
  background: var(--bg-card, #fff);
}

.password-wrapper input {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 14px;
  flex: 1;
}

.eye-btn {
  border: none;
  background: transparent;
  padding: 0 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  margin-top: 16px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(3,105,161,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-edit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(3,105,161,0.4);
}

@media (max-width: 640px) {
  .profile-card { padding: 20px; border-radius: 12px; margin: 0 -4px; }
  .avatar { width: 64px; height: 64px; font-size: 1.5rem; }
  .title { font-size: 1.1rem; }
  .form-group label { font-size: 0.8rem; }
  .form-group input { padding: 8px 10px; }
  .btn-edit { width: 100%; }
}
</style>
<template>
  <div class="login-page">
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-card">
      <div class="login-avatar">
        <i class="fa-solid fa-shield-halved"></i>
      </div>

      <h1 class="login-title">Welcome Back</h1>
      <p class="login-subtitle">Sign in to X-RayCare QC System</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-user input-icon"></i>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock input-icon"></i>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter your password"
            />
            <button type="button" class="eye-btn" @click="togglePassword">
              <i :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
            </button>
          </div>
        </div>

        <p v-if="errorMsg" class="error-msg">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ errorMsg }}
        </p>

        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="login-footer">
        <span>X-RayCare QC Management System</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_BASE = '/api/Xraycare'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMsg = ref('')
const isLoading = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  errorMsg.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMsg.value = 'กรุณากรอก Username และ Password'
    return
  }

  isLoading.value = true

  try {
    const res = await fetch(`${API_BASE}/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value
      })
    })

    if (res.status === 401) {
      errorMsg.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      return
    }

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(errText || 'เข้าสู่ระบบไม่สำเร็จ')
    }

    const user = await res.json()

    localStorage.setItem('xraycare-user', JSON.stringify({
      id: user.id,
      username: user.username,
      position: user.position
    }))

    const position = (user.position || '').toLowerCase()
    if (position === 'admin') {
      router.push('/admindashboard')
    } else if (position === 'engineer') {
      router.push('/engineerdashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (e) {
    console.error('Login error:', e)
    errorMsg.value = e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #0f0a1e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #0369A1 0%, transparent 70%);
  top: -15%;
  left: -10%;
  animation: floatShape 8s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
  bottom: -10%;
  right: -5%;
  animation: floatShape 10s ease-in-out infinite reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #0EA5E9 0%, transparent 70%);
  top: 50%;
  left: 60%;
  animation: floatShape 12s ease-in-out infinite;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 36px 32px;
  text-align: center;
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.login-avatar {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(3, 105, 161, 0.4);
}

.login-avatar i {
  font-size: 28px;
  color: #ffffff;
}

.login-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.login-subtitle {
  margin: 6px 0 28px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.02em;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 14px;
  transition: all 200ms ease;
}

.input-wrapper:focus-within {
  border-color: #0EA5E9;
  background: rgba(14, 165, 233, 0.08);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.input-icon {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.35);
  flex-shrink: 0;
  margin-right: 10px;
}

.input-wrapper:focus-within .input-icon {
  color: #38BDF8;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
}

.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.eye-btn {
  border: none;
  background: transparent;
  padding: 4px 2px;
  cursor: pointer;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  transition: color 150ms ease;
}

.eye-btn:hover {
  color: rgba(255, 255, 255, 0.7);
}

.btn-login {
  width: 100%;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: white;
  font-weight: 700;
  padding: 13px 0;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 200ms ease;
  box-shadow: 0 4px 16px rgba(3, 105, 161, 0.4);
  letter-spacing: 0.01em;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(3, 105, 161, 0.5);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-msg {
  color: #fca5a5;
  font-size: 0.82rem;
  margin: 0 0 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
}

.login-footer {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.03em;
}
</style>

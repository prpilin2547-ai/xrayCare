<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-avatar">
  <i class="fa-solid fa-circle-user"></i>
</div>


      <h1 class="login-title">Login</h1>
      <p class="login-subtitle">Welcome To X-ray care</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
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

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
        </button>
      </form>
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

    // เก็บข้อมูลผู้ใช้ใน localStorage
    localStorage.setItem('xraycare-user', JSON.stringify({
      id: user.id,
      username: user.username,
      position: user.position
    }))

    // redirect ตาม position/role
    const position = (user.position || '').toLowerCase()
    if (position === 'admin') {
      router.push('/admindashboard')
    } else if (position === 'engineer') {
      router.push('/engineerdashboard')
    } else {
      // Tech / นักรังสี / default
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
  background: radial-gradient(circle at top left, #6b46c1, #2b2345 55%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #111827;
  position: relative;
}

.login-header-note {
  position: absolute;
  top: 18px;
  left: 24px;
  color: #d1d5db;
  font-size: 0.9rem;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 18px;
  padding: 28px 26px 32px;
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.35);
  text-align: center;
}

.login-avatar {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  margin: 0 auto 12px;
  background: #e5e7eb;
  border: 2px solid #f3f4f6;
}

.login-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.login-subtitle {
  margin: 4px 0 18px;
  font-size: 0.95rem;
  color: #6b7280;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 14px;
}

label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: #374151;
}

input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  font-size: 0.9rem;
  outline: none;
}

input:focus {
  border-color: #5b3cc4;
  box-shadow: 0 0 0 1px rgba(91, 60, 196, 0.25);
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

.password-wrapper input:focus {
  box-shadow: none;
}

.eye-btn {
  border: none;
  background: transparent;
  padding: 0 8px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-login {
  width: 100%;
  margin-top: 12px;
  border-radius: 999px;
  border: none;
  background: #5b3cc4;
  color: white;
  font-weight: 600;
  padding: 10px 0;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-login:hover:not(:disabled) {
  background: #4c2faf;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 8px 0 0;
  text-align: center;
}
.login-avatar {
  width: 80px;     /* ขนาดเดิมของ avatar */
  height: 80px;
  border-radius: 999px;
  background: none; /* เอาพื้นหลังเดิมออกถ้ามี */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-avatar i {
  font-size: 80px;  /* ไอคอนใหญ่เท่า avatar */
  color: #4b5563;   /* เทาเข้ม ดูเหมือน user icon */
}

</style>
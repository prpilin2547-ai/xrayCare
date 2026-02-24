<template>
  <MainLayout activePage="user">
    <div class="user-management-content">

      <!-- Page Title -->
      <div class="page-title-section">
        <div class="blue-dot"></div>
        <h3 class="fw-bold m-0">User Management</h3>
      </div>

      <!-- Top Controls: Search & Add User -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="search-bar-container w-50">
          <div class="input-group">
            <input type="text" class="form-control border-dark" placeholder="Search" v-model="searchQuery">
            <button class="btn btn-outline-dark" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
        <button class="btn btn-purple px-4 py-2 rounded-2" @click="openModal">
          <i class="bi bi-person-plus-fill me-2"></i> Add User
        </button>
      </div>

      <!-- User Count -->
      <h5 class="mb-3">User Member ({{ filteredUsers.length }})</h5>

      <!-- User Table -->
      <div class="table-responsive">
        <table class="table user-table text-center">
          <thead>
            <tr>
              <th style="width: 25%;">Username</th>
              <!-- ข้อ 1: เพิ่มคอลัมน์ Position -->
              <th style="width: 25%;">Position</th>
              <th style="width: 30%;">Password</th>
              <th style="width: 20%;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <!-- 1. Username -->
              <td>{{ user.username }}</td>

              <!-- ข้อ 1: แสดง Position เป็นกล่องสี -->
              <td>
                <span class="position-badge" :class="getPositionClass(user.position)">
                  {{ user.position }}
                </span>
              </td>

              <!-- 2. Password (Display / Edit Mode) -->
              <td>
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <!-- Mode: Editing -->
                  <div v-if="user.isEditing" class="d-flex align-items-center gap-2 w-100 justify-content-center">
                    <input type="text" class="table-input" v-model="user.tempPassword" placeholder="Enter new password">
                    <!-- ปุ่ม Save สีเขียว -->
                    <i class="bi bi-check-circle-fill text-success cursor-pointer fs-5" @click="saveEdit(user)"
                      title="Save"></i>
                    <!-- ปุ่ม Cancel สีแดง -->
                    <i class="bi bi-x-circle-fill text-danger cursor-pointer fs-5" @click="cancelEdit(user)"
                      title="Cancel"></i>
                  </div>

                  <!-- Mode: View -->
                  <div v-else class="d-flex align-items-center gap-2">
                    <!-- แสดงจุดไข่ปลา หรือ รหัสผ่าน ตามสถานะ showPassword -->
                    <span>{{ user.showPassword ? user.password : '••••••••••' }}</span>
                    <!-- ปุ่มเปิด/ปิดตา -->
                    <i class="bi cursor-pointer" :class="user.showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'"
                      @click="toggleVisibility(user)"></i>
                  </div>
                </div>
              </td>

              <!-- 3. Action Buttons -->
              <td>
                <i class="bi bi-pencil-fill action-icon text-dark mx-2" @click="startEdit(user)" title="Edit"></i>
                <i class="bi bi-trash-fill action-icon text-dark mx-2" @click="deleteUser(user.id)" title="Delete"></i>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="text-center py-4 text-muted">No user found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Sign Up Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card">
          <button type="button" class="close-modal-btn" aria-label="ปิด" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>

          <h3 class="text-center fw-bold mb-4">Sign Up</h3>

          <!-- Form -->
          <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" class="form-control" v-model="newUser.username">
            <div v-if="errors.username" class="alert alert-danger mt-2 py-2" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
            </div>
          </div>

          <!-- ข้อ 2: เพิ่ม Position ในหน้า Sign Up -->
          <div class="mb-3">
            <label class="form-label">Position</label>
            <select class="form-select" v-model="newUser.position">
              <option value="" disabled>Select Position</option>
              <option value="Admin">Admin</option>
              <option value="Radiological Technologist">Radiological Technologist</option>
              <option value="Engineer">Engineer</option>
            </select>
            <div v-if="errors.position" class="alert alert-danger mt-2 py-2" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="password-input-wrap">
              <input :type="newUser.showPass ? 'text' : 'password'" class="form-control password-input"
                v-model="newUser.password" placeholder="กรอกรหัสผ่าน">
              <button type="button" class="password-toggle" aria-label="แสดง/ซ่อนรหัสผ่าน"
                @click="newUser.showPass = !newUser.showPass">
                <i class="bi" :class="newUser.showPass ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </button>
            </div>
            <div v-if="errors.password" class="alert alert-danger mt-2 py-2" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Confirm Password</label>
            <div class="password-input-wrap">
              <input :type="newUser.showConfirm ? 'text' : 'password'" class="form-control password-input"
                v-model="newUser.confirmPassword" placeholder="กรอกรหัสผ่านอีกครั้ง">
              <button type="button" class="password-toggle" aria-label="แสดง/ซ่อนรหัสผ่าน"
                @click="newUser.showConfirm = !newUser.showConfirm">
                <i class="bi" :class="newUser.showConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="alert alert-danger mt-2 py-2" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
            </div>
          </div>

          <button class="btn btn-create-account" @click="createAccount">
            Create Account
          </button>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

// --- State ---
const searchQuery = ref('')
const showModal = ref(false)
const loading = ref(false)

const API_BASE = '/api/Xraycare'

// รายการผู้ใช้จาก API
const users = ref([])

async function loadUsers() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/GetAllUsers`)
    if (!res.ok) throw new Error('โหลดรายการผู้ใช้ไม่สำเร็จ')
    const data = await res.json()
    users.value = (Array.isArray(data) ? data : []).map(u => ({
      ...u,
      showPassword: false,
      isEditing: false,
      tempPassword: ''
    }))
  } catch (e) {
    console.error(e)
    users.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})

// --- ฟอร์มสร้าง user ใหม่ ---
const newUser = ref({
  username: '',
  password: '',
  confirmPassword: '',
  position: '',
  showPass: false,
  showConfirm: false
})

const errors = ref({
  username: false,
  password: false,
  confirmPassword: false,
  position: false
})

// --- Computed ---
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// helper สำหรับ badge ของ position
const getPositionClass = (position) => {
  switch (position) {
    case 'Admin':
      return 'position-admin'
    case 'Engineer':
      return 'position-engineer'
    case 'Radiological Technologist':
    default:
      return 'position-rt'
  }
}

// --- Methods ---
const openModal = () => {
  newUser.value = {
    username: '',
    password: '',
    confirmPassword: '',
    position: '',
    showPass: false,
    showConfirm: false
  }
  errors.value = {
    username: false,
    password: false,
    confirmPassword: false,
    position: false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const createAccount = async () => {
  errors.value = {
    username: false,
    password: false,
    confirmPassword: false,
    position: false
  }
  let isValid = true

  if (!newUser.value.username) {
    errors.value.username = true
    isValid = false
  }
  if (!newUser.value.position) {
    errors.value.position = true
    isValid = false
  }
  if (!newUser.value.password) {
    errors.value.password = true
    isValid = false
  }
  if (
    !newUser.value.confirmPassword ||
    newUser.value.confirmPassword !== newUser.value.password
  ) {
    errors.value.confirmPassword = true
    isValid = false
  }

  if (!isValid) return

  try {
    const res = await fetch(`${API_BASE}/AddUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newUser.value.username,
        password: newUser.value.password,
        position: newUser.value.position
      })
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'สร้างบัญชีไม่สำเร็จ')
    }
    const created = await res.json()
    users.value.push({
      ...created,
      showPassword: false,
      isEditing: false,
      tempPassword: ''
    })
    showModal.value = false
  } catch (e) {
    console.error(e)
    alert(e.message || 'สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่')
  }
}

const deleteUser = async (id) => {
  if (!confirm('คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่?')) return

  try {
    const res = await fetch(`${API_BASE}/DeleteUser/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'ลบไม่สำเร็จ')
    }
    users.value = users.value.filter(u => u.id !== id)
  } catch (e) {
    console.error(e)
    alert(e.message || 'ลบไม่สำเร็จ กรุณาลองใหม่')
  }
}

const toggleVisibility = (user) => {
  user.showPassword = !user.showPassword
}

const startEdit = (user) => {
  user.tempPassword = ''
  user.isEditing = true
}

const saveEdit = async (user) => {
  if (!user.tempPassword.trim()) {
    alert('Password cannot be empty!')
    return
  }

  try {
    const res = await fetch(`${API_BASE}/UpdateUserPassword/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: user.tempPassword })
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || 'แก้ไขรหัสผ่านไม่สำเร็จ')
    }
    user.password = user.tempPassword
    user.isEditing = false
  } catch (e) {
    console.error(e)
    alert(e.message || 'แก้ไขรหัสผ่านไม่สำเร็จ กรุณาลองใหม่')
  }
}

const cancelEdit = (user) => {
  user.isEditing = false
}
</script>


<style scoped>
/* Page title section */
.page-title-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.blue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
}

/* Search bar */
.search-bar-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  max-width: 400px;
}

.search-bar-container :deep(.form-control),
.search-bar-container :deep(input) {
  flex: 1;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
  transition: all 200ms;
}

.search-bar-container :deep(.form-control:focus),
.search-bar-container :deep(input:focus) {
  border-color: var(--purple-soft, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

/* Purple button */
.btn-purple {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--purple-main, #6c3ce0), var(--purple-soft, #8b5cf6));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 60, 224, 0.3);
  transition: all 150ms;
}

.btn-purple:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(108, 60, 224, 0.4);
  color: #fff;
}

/* User table */
.user-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
}

.user-table thead {
  background: #f8fafc;
}

.user-table th {
  padding: 12px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted, #94a3b8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.user-table td {
  padding: 12px 16px;
  color: var(--text-secondary, #475569);
  border-bottom: 1px solid #f1f5f9;
}

.user-table tbody tr {
  transition: background 150ms;
}

.user-table tbody tr:hover {
  background: #f8fafc;
}

/* Table input */
.table-input {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 10px;
  font-size: 0.85rem;
  width: 140px;
  transition: all 200ms;
}

.table-input:focus {
  border-color: var(--purple-soft, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

/* Position badges */
.position-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.position-admin {
  background: #fef2f2;
  color: #dc2626;
}

.position-rt {
  background: #eff6ff;
  color: #1d4ed8;
}

.position-engineer {
  background: #f0fdf4;
  color: #15803d;
}

/* Action icons */
.action-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 150ms;
  color: var(--text-muted, #94a3b8);
}

.action-icon:hover {
  background: #f1f5f9;
  color: var(--text-main, #0f172a);
}

.bi-trash-fill:hover {
  color: #dc3545 !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  padding: 20px 0;
}

.modal-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 28px;
  max-width: 480px;
  width: 92%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
  min-height: 430px;
}

.close-modal-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #dc2626;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 150ms, border-color 150ms, transform 150ms;
}

.close-modal-btn:hover {
  color: #b91c1c;
  border-color: #b91c1c;
  transform: scale(1.05);
}

.btn-create-account {
  width: 100%;
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 12px;
  background: linear-gradient(135deg, var(--purple-main, #6c3ce0), var(--purple-soft, #8b5cf6));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 60, 224, 0.3);
  transition: all 150ms;
}

.btn-create-account:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(108, 60, 224, 0.4);
}

/* Form inputs in modal */
.modal-card :deep(input),
.modal-card :deep(select),
.modal-card :deep(.form-control),
.modal-card :deep(.form-select) {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
  transition: all 200ms;
}

.modal-card :deep(input:focus),
.modal-card :deep(select:focus),
.modal-card :deep(.form-control:focus),
.modal-card :deep(.form-select:focus) {
  border-color: var(--purple-soft, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  outline: none;
}

/* ช่องรหัสผ่าน: ไอคอนตาอยู่แนวเดียวกับช่องกรอก (inline) */
.password-input-wrap {
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 44px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
  transition: border-color 200ms, box-shadow 200ms;
}

.password-input-wrap:focus-within {
  border-color: var(--purple-soft, #8b5cf6);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.password-input-wrap .password-input {
  flex: 1;
  min-width: 0;
  border: none;
  border-radius: var(--radius-sm, 8px) 0 0 var(--radius-sm, 8px);
  padding: 10px 14px;
  font-size: 0.85rem;
  background: transparent;
}

.password-input-wrap .password-input:focus {
  outline: none;
  box-shadow: none;
}

.password-input-wrap .password-toggle {
  flex-shrink: 0;
  width: 44px;
  min-height: 44px;
  border: none;
  border-left: 1px solid var(--border-soft, #e2e8f0);
  background: transparent;
  color: var(--text-muted, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: color 150ms, background 150ms;
  border-radius: 0 var(--radius-sm, 8px) var(--radius-sm, 8px) 0;
}

.password-input-wrap .password-toggle:hover {
  color: var(--text-main, #0f172a);
  background: #f8fafc;
}

/* Hide browser password reveal (Edge) */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

@media (max-width: 1024px) {
  .user-table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
}
@media (max-width: 640px) {
  .search-bar-container { flex-direction: column; }
  .search-bar-container input { width: 100%; }
  .btn-purple { width: 100%; text-align: center; }
  .page-title-section h2 { font-size: 1.2rem; }
  .page-title-section h3 { font-size: 1.2rem; }
  .modal-card { width: calc(100vw - 24px); padding: 16px; }
}
</style>

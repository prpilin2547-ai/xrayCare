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
          <i class="bi bi-x-circle close-modal-btn" @click="closeModal"></i>

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
            <div class="input-group">
              <!-- ข้อ 3: ยังใช้ input-group เหมือนเดิม แต่เราจะซ่อนไอคอน reveal ของ browser ด้วย CSS ด้านล่าง -->
              <input :type="newUser.showPass ? 'text' : 'password'" class="form-control" v-model="newUser.password">
              <!-- ไอคอนตาข้างนอก (คงไว้) -->
              <span class="input-group-text cursor-pointer" @click="newUser.showPass = !newUser.showPass">
                <i class="bi" :class="newUser.showPass ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </span>
            </div>
            <div v-if="errors.password" class="alert alert-danger mt-2 py-2" role="alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Confirm Password</label>
            <div class="input-group">
              <input :type="newUser.showConfirm ? 'text' : 'password'" class="form-control"
                v-model="newUser.confirmPassword">
              <!-- ไอคอนตาข้างนอก (คงไว้) -->
              <span class="input-group-text cursor-pointer" @click="newUser.showConfirm = !newUser.showConfirm">
                <i class="bi" :class="newUser.showConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </span>
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
/* Page Title */
.page-title-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.blue-dot {
  width: 12px;
  height: 12px;
  background-color: #0d6efd;
  border-radius: 50%;
  margin-right: 10px;
}

/* Controls */
.search-bar-container {
  position: relative;
  max-width: 400px;
}

.btn-purple {
  background-color: #6200EA;
  color: white;
  border: none;
  transition: 0.2s;
}

.btn-purple:hover {
  background-color: #4a00b0;
  color: white;
}

/* Table Styles */
.user-table {
  background-color: white;
}

.user-table thead th {
  background-color: #dcdcdc;
  border-bottom: none;
  padding: 15px;
  font-weight: 600;
}

.user-table tbody tr {
  background-color: #e8e8e8;
  border-bottom: 2px solid #fff;
}

.user-table td {
  padding: 15px;
  vertical-align: middle;
}

.table-input {
  background: white;
  border: 1px solid #0d6efd;
  border-radius: 4px;
  padding: 4px 8px;
  width: 140px;
}

/* ข้อ 1: style ของ Position badge */
.position-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.position-admin {
  background-color: #6200EA;
  /* ม่วง */
}

.position-rt {
  background-color: #0d6efd;
  /* น้ำเงิน */
}

.position-engineer {
  background-color: #ff9800;
  /* ส้ม */
}

/* Icons */
.action-icon {
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.action-icon:hover {
  transform: scale(1.2);
}

.bi-trash-fill:hover {
  color: #dc3545 !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  overflow-y: auto;
  padding: 20px 0;
}

.modal-card {
  background: white;
  padding: 35px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 15px;
  width: 400px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  /* ข้อ 4: ขยายกล่อง Sign Up ลงล่าง (เพิ่มความสูงขั้นต่ำ) */
  min-height: 430px;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: #dc3545;
  font-size: 1.5rem;
  transition: 0.2s;
}

.close-modal-btn:hover {
  transform: scale(1.1);
}

.btn-create-account {
  background-color: #4A148C;
  color: white;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
}

.btn-create-account:hover {
  background-color: #38006b;
  color: white;
}

/* ข้อ 3: ซ่อนปุ่ม reveal password ที่อยู่ในกล่องฟ้าของ browser (เช่น Edge) */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
</style>

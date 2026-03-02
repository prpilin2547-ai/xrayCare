<template>
  <MainLayout activePage="user">
    <div class="user-management-content">

      <!-- Page Title -->
      <div class="page-title-section">
        <div class="blue-dot"></div>
        <h3 class="fw-bold m-0">User & Hospital Management</h3>
      </div>
      <p class="text-muted small mb-2">ระดับสิทธิ์: Root Admin (ทุกโรงพยาบาล) → SuperAdmin (โรงพยาบาลนี้) → User (Admin / Tech / Engineer)</p>

      <!-- Tabs -->
      <div class="tabs-row">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'users' }"
          @click="activeTab = 'users'"
        >
          <i class="bi bi-people-fill me-2"></i> User Management
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'hospitals' }"
          @click="activeTab = 'hospitals'; loadHospitals()"
        >
          <i class="bi bi-hospital me-2"></i> Hospital Management
        </button>
      </div>

      <!-- ========== USER MANAGEMENT TAB ========== -->
      <div v-show="activeTab === 'users'" class="tab-panel">
        <div v-if="sessionMissingHospital" class="alert alert-info d-flex align-items-center mb-4" role="alert">
          <i class="bi bi-info-circle-fill me-2 fs-5"></i>
          <div class="flex-grow-1">
            <strong>กรุณาเข้าสู่ระบบใหม่</strong> — บัญชีนี้ยังไม่มีข้อมูลโรงพยาบาล (เดิมเข้าสู่ระบบก่อนมีระบบหลายโรงพยาบาล) กรุณาออกจากระบบแล้วเข้าสู่ระบบอีกครั้ง และเลือกโรงพยาบาล เพื่อโหลดรายการผู้ใช้ได้
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm ms-2" @click="goToLoginAgain">
            ออกจากระบบและเข้าสู่ระบบใหม่
          </button>
        </div>
        <div v-if="getStoredUser()?.isSuperAdmin" class="mb-3">
          <label class="form-label small mb-1">แสดงผู้ใช้ของ</label>
          <select class="form-select form-select-sm w-auto" v-model.number="filterHospitalIdForAdmin" @change="loadUsers">
            <option :value="0">ทุกโรงพยาบาล</option>
            <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
          </select>
        </div>
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

        <h5 class="mb-3">User Member ({{ filteredUsers.length }})</h5>

        <div class="table-responsive">
          <table class="table user-table text-center">
            <thead>
              <tr>
                <th style="width: 20%;">Username</th>
                <th style="width: 22%;">Role</th>
                <th style="width: 18%;">Hospital</th>
                <th style="width: 25%;">Password</th>
                <th style="width: 15%;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.username }}</td>
                <td>
                  <span class="position-badge" :class="getPositionClass(user.position)">
                    {{ getRoleLabel(user.position, user.isSuperAdmin) }}
                  </span>
                  <div class="role-permission-hint" v-if="getRolePermissionHint(user.position, user.isSuperAdmin)">
                    {{ getRolePermissionHint(user.position, user.isSuperAdmin) }}
                  </div>
                </td>
                <td>{{ getHospitalName(user.hospitalId) }}</td>
                <td>
                  <div class="d-flex justify-content-center align-items-center gap-2">
                    <span>{{ user.showPassword ? user.password : '••••••••••' }}</span>
                    <i class="bi cursor-pointer" :class="user.showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'" @click="toggleVisibility(user)"></i>
                  </div>
                </td>
                <td>
                  <i class="bi bi-pencil-fill action-icon text-dark mx-2" @click="openEditModal(user)" title="Edit (change hospital, role, password)"></i>
                  <i class="bi bi-trash-fill action-icon text-dark mx-2" @click="deleteUser(user.id)" title="Delete"></i>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  {{ sessionMissingHospital ? 'กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ พร้อมเลือกโรงพยาบาล' : 'No user found.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add User Modal -->
        <div v-if="showModal" class="modal-overlay">
          <div class="modal-card">
            <button type="button" class="close-modal-btn" aria-label="ปิด" @click="closeModal">
              <i class="bi bi-x-lg"></i>
            </button>
            <h3 class="text-center fw-bold mb-4">Sign Up</h3>

            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" v-model="newUser.username">
              <div v-if="errors.username" class="alert alert-danger mt-2 py-2" role="alert">
                <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Role (Position)</label>
              <select class="form-select" v-model="newUser.position">
                <option value="" disabled>Select Role</option>
                <option v-for="opt in roleOptionsForSelect" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <p v-if="newUser.position" class="role-desc mt-1 mb-0 small text-muted">
                {{ getRolePermissionHint(newUser.position === ROOT_ADMIN_VALUE ? 'Admin' : newUser.position, newUser.position === ROOT_ADMIN_VALUE) }}
              </p>
              <div v-if="errors.position" class="alert alert-danger mt-2 py-2" role="alert">
                <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณาเลือก Role
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Hospital</label>
              <select class="form-select" v-model.number="newUser.hospitalId">
                <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
              <p class="small text-muted mt-1 mb-0">ผู้ใช้จะสามารถเข้าสู่ระบบได้เฉพาะโรงพยาบาลที่เลือก</p>
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="password-input-wrap">
                <input :type="newUser.showPass ? 'text' : 'password'" class="form-control password-input"
                  v-model="newUser.password" placeholder="กรอกรหัสผ่าน">
                <button type="button" class="password-toggle" aria-label="แสดง/ซ่อนรหัสผ่าน" @click="newUser.showPass = !newUser.showPass">
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
                <button type="button" class="password-toggle" aria-label="แสดง/ซ่อนรหัสผ่าน" @click="newUser.showConfirm = !newUser.showConfirm">
                  <i class="bi" :class="newUser.showConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="alert alert-danger mt-2 py-2" role="alert">
                <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกข้อมูลให้ครบ
              </div>
            </div>

            <button class="btn btn-create-account" @click="createAccount">Create Account</button>
          </div>
        </div>

        <!-- Edit User Modal (change hospital, role, password) -->
        <div v-if="showEditModal" class="modal-overlay">
          <div class="modal-card">
            <button type="button" class="close-modal-btn" aria-label="ปิด" @click="closeEditModal">
              <i class="bi bi-x-lg"></i>
            </button>
            <h3 class="text-center fw-bold mb-4">Edit User</h3>

            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" :value="editForm.username" readonly disabled>
            </div>

            <div class="mb-3">
              <label class="form-label">Hospital</label>
              <select class="form-select" v-model.number="editForm.hospitalId">
                <option v-for="h in hospitals" :key="h.id" :value="h.id">{{ h.name }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" v-model="editForm.position">
                <option v-for="opt in roleOptionsForSelect" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label">New password (leave blank to keep current)</label>
              <div class="password-input-wrap">
                <input :type="editForm.showPass ? 'text' : 'password'" class="form-control password-input"
                  v-model="editForm.password" placeholder="Leave blank to keep current">
                <button type="button" class="password-toggle" @click="editForm.showPass = !editForm.showPass">
                  <i class="bi" :class="editForm.showPass ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
                </button>
              </div>
            </div>

            <button class="btn btn-create-account" @click="saveEditUser">Save changes</button>
          </div>
        </div>
      </div>

      <!-- ========== HOSPITAL MANAGEMENT TAB ========== -->
      <div v-show="activeTab === 'hospitals'" class="tab-panel">
        <div v-if="apiUnreachable" class="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>
            <strong>API not reachable (404).</strong> Start the backend so Hospital Management works:
            <ul class="mb-0 mt-1 small">
              <li><strong>Docker:</strong> <code>docker compose up -d --build</code> (from project root)</li>
              <li><strong>Or .NET:</strong> <code>dotnet run</code> in <code>api/api.xraycare</code> (API must listen on port 8001)</li>
            </ul>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="mb-0">Hospitals ({{ hospitals.length }})</h5>
          <button v-if="getStoredUser()?.isSuperAdmin" class="btn btn-purple px-4 py-2 rounded-2" @click="openHospitalModal()">
            <i class="bi bi-plus-lg me-2"></i> Add Hospital
          </button>
        </div>

        <div class="table-responsive">
          <table class="table user-table text-center">
            <thead>
              <tr>
                <th style="width: 15%;">Code</th>
                <th style="width: 50%;">Name</th>
                <th style="width: 35%;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in hospitals" :key="h.id">
                <td><code class="hospital-code">{{ h.code || '-' }}</code></td>
                <td>{{ h.name }}</td>
                <td>
                  <i v-if="canEditHospital(h.id)" class="bi bi-pencil-fill action-icon text-dark mx-2" @click="openHospitalModal(h)" title="Edit"></i>
                  <i v-if="getStoredUser()?.isSuperAdmin" class="bi bi-trash-fill action-icon text-dark mx-2" @click="deleteHospital(h)" title="Delete"></i>
                </td>
              </tr>
              <tr v-if="hospitals.length === 0">
                <td colspan="3" class="text-center py-4 text-muted">No hospital. Add one to get started.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Add/Edit Hospital Modal -->
        <div v-if="showHospitalModal" class="modal-overlay">
          <div class="modal-card modal-card-sm">
            <button type="button" class="close-modal-btn" aria-label="Close" @click="closeHospitalModal">
              <i class="bi bi-x-lg"></i>
            </button>
            <h3 class="text-center fw-bold mb-4">{{ editingHospital ? 'Edit Hospital' : 'Add Hospital' }}</h3>

            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" v-model="hospitalForm.name" placeholder="e.g. โรงพยาบาลสมเด็จ">
              <div v-if="hospitalErrors.name" class="alert alert-danger mt-2 py-2" role="alert">
                <i class="bi bi-exclamation-circle-fill me-2"></i>กรุณากรอกชื่อโรงพยาบาล
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Code (optional)</label>
              <input type="text" class="form-control" v-model="hospitalForm.code" placeholder="e.g. SMD">
            </div>

            <button class="btn btn-create-account" @click="saveHospital">
              {{ editingHospital ? 'Update Hospital' : 'Create Hospital' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'
import { apiFetch, getStoredUser, getApiErrorMessage } from '../api/client'

const router = useRouter()

const activeTab = ref('users')
const searchQuery = ref('')
const showModal = ref(false)
const showEditModal = ref(false)
const showHospitalModal = ref(false)
const loading = ref(false)
const editingUser = ref(null)
const editForm = ref({
  username: '',
  hospitalId: null,
  position: '',
  password: '',
  showPass: false
})
const users = ref([])
const hospitals = ref([])
const editingHospital = ref(null)
const apiUnreachable = ref(false)
const sessionMissingHospital = ref(false)
/** When SuperAdmin: 0 = all hospitals, else filter by hospital id */
const filterHospitalIdForAdmin = ref(0)

// Sentinel value for "Root Admin" in dropdown (stores as position=Admin + isSuperAdmin=true)
const ROOT_ADMIN_VALUE = '__RootAdmin__'

// Role hierarchy: Root Admin (all hospitals) → SuperAdmin (this hospital) → User (Admin/Tech/Engineer)
// Roles & permissions: label, value, permission description
const ROLE_OPTIONS = [
  { value: 'SuperAdmin', label: 'SuperAdmin (Hospital)', permissions: 'Manage users and hospital settings for this hospital only' },
  { value: 'Admin', label: 'Admin', permissions: 'Manage users & view analytics for this hospital' },
  { value: 'Radiological Technologist', label: 'Radiological Technologist (Tech)', permissions: 'Daily/monthly checks, Machines, Requests, Export PDF, QC forms' },
  { value: 'Engineer', label: 'Engineer', permissions: 'Repair requests, Analytics, Engineer dashboard' }
]

// Dropdown options: include Root Admin when current user is SuperAdmin
const roleOptionsForSelect = computed(() => {
  const list = ROLE_OPTIONS.map(o => ({ ...o }))
  if (getStoredUser()?.isSuperAdmin) {
    list.push({ value: ROOT_ADMIN_VALUE, label: 'Root Admin', permissions: 'Manage users & hospitals across all hospitals' })
  }
  return list
})

function getRoleLabel(position, isSuperAdmin) {
  if (isSuperAdmin && (position || '').trim() === 'Admin') return 'Root Admin'
  const p = (position || '').trim()
  const opt = ROLE_OPTIONS.find(o => o.value === p)
  return opt ? opt.label : (p || '-')
}

function getRolePermissionHint(position, isSuperAdmin) {
  if (isSuperAdmin && (position || '').trim() === 'Admin') return 'Manage users & hospitals across all hospitals'
  const opt = ROLE_OPTIONS.find(o => o.value === (position || '').trim())
  return opt ? opt.permissions : ''
}

function getHospitalName(hospitalId) {
  if (hospitalId == null) return '-'
  const h = hospitals.value.find(x => x.id === hospitalId)
  return h ? h.name : `ID ${hospitalId}`
}

/** Root Admin: edit any hospital. SuperAdmin/Admin: edit only own hospital. */
function canEditHospital(hospitalId) {
  const u = getStoredUser()
  if (u?.isSuperAdmin) return true
  return u?.hospitalId === hospitalId
}

async function loadHospitals() {
  apiUnreachable.value = false
  try {
    const res = await apiFetch('/GetHospitals')
    if (!res.ok) {
      if (res.status === 404) apiUnreachable.value = true
      console.warn('GetHospitals failed:', res.status, '- Is the API running on port 8001?')
      hospitals.value = []
      return
    }
    const data = await res.json()
    hospitals.value = Array.isArray(data) ? data : []
  } catch (e) {
    apiUnreachable.value = true
    console.warn('GetHospitals error:', e.message)
    hospitals.value = []
  }
}

async function loadUsers() {
  loading.value = true
  sessionMissingHospital.value = false
  const user = getStoredUser()
  const isSuperAdmin = user?.isSuperAdmin === true
  if (!user) {
    users.value = []
    loading.value = false
    return
  }
  if (!isSuperAdmin && (user.hospitalId == null || user.hospitalId === undefined)) {
    sessionMissingHospital.value = true
    users.value = []
    loading.value = false
    return
  }
  try {
    const res = await apiFetch('/GetAllUsers', isSuperAdmin ? { hospitalId: filterHospitalIdForAdmin.value } : {})
    if (!res.ok) {
      const msg = await getApiErrorMessage(res)
      if (res.status === 400 && (msg.includes('X-Hospital-Id') || msg.includes('hospital'))) {
        sessionMissingHospital.value = true
        users.value = []
        return
      }
      throw new Error(msg)
    }
    const data = await res.json()
    users.value = (Array.isArray(data) ? data : []).map(u => ({
      ...u,
      showPassword: false
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
  loadHospitals()
})

const newUser = ref({
  username: '',
  password: '',
  confirmPassword: '',
  position: '',
  hospitalId: null,
  showPass: false,
  showConfirm: false
})

const errors = ref({ username: false, password: false, confirmPassword: false, position: false })

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getPositionClass = (position) => {
  const p = (position || '').trim()
  if (p === 'Admin') return 'position-admin'
  if (p === 'Engineer') return 'position-engineer'
  return 'position-rt'
}

function openModal() {
  const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
  newUser.value = {
    username: '',
    password: '',
    confirmPassword: '',
    position: '',
    hospitalId: stored.hospitalId != null ? stored.hospitalId : (hospitals.value[0]?.id ?? null),
    showPass: false,
    showConfirm: false
  }
  errors.value = { username: false, password: false, confirmPassword: false, position: false }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function createAccount() {
  errors.value = { username: false, password: false, confirmPassword: false, position: false }
  let isValid = true
  if (!newUser.value.username) { errors.value.username = true; isValid = false }
  if (!newUser.value.position) { errors.value.position = true; isValid = false }
  if (!newUser.value.password) { errors.value.password = true; isValid = false }
  if (!newUser.value.confirmPassword || newUser.value.confirmPassword !== newUser.value.password) {
    errors.value.confirmPassword = true
    isValid = false
  }
  if (!newUser.value.hospitalId && hospitals.value.length > 0) {
    newUser.value.hospitalId = hospitals.value[0].id
  }
  if (getStoredUser()?.isSuperAdmin && !newUser.value.hospitalId) {
    alert('SuperAdmin must select a hospital for the new user.')
    return
  }
  if (!isValid) return

  const isRootAdmin = newUser.value.position === ROOT_ADMIN_VALUE
  const positionToSend = isRootAdmin ? 'Admin' : newUser.value.position

  try {
    const addOpts = {
      method: 'POST',
      body: JSON.stringify({
        username: newUser.value.username,
        password: newUser.value.password,
        position: positionToSend,
        hospitalId: newUser.value.hospitalId || undefined,
        isSuperAdmin: getStoredUser()?.isSuperAdmin ? isRootAdmin : undefined
      })
    }
    if (getStoredUser()?.isSuperAdmin) addOpts.hospitalId = 0
    const res = await apiFetch('/AddUser', addOpts)
    if (!res.ok) throw new Error(await getApiErrorMessage(res))
    const created = await res.json()
    users.value.push({
      ...created,
      hospitalId: newUser.value.hospitalId,
      showPassword: false
    })
    showModal.value = false
    await loadUsers()
  } catch (e) {
    console.error(e)
    alert(e.message || 'สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่')
  }
}

async function deleteUser(id) {
  if (!confirm('คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่?')) return
  try {
    const res = await apiFetch(`/DeleteUser/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await getApiErrorMessage(res))
    users.value = users.value.filter(u => u.id !== id)
  } catch (e) {
    console.error(e)
    alert(e.message || 'ลบไม่สำเร็จ กรุณาลองใหม่')
  }
}

function toggleVisibility(user) {
  user.showPassword = !user.showPassword
}

function openEditModal(user) {
  editingUser.value = user
  editForm.value = {
    username: user.username,
    hospitalId: user.hospitalId ?? null,
    position: (user.isSuperAdmin && (user.position || '').trim() === 'Admin') ? ROOT_ADMIN_VALUE : (user.position ?? ''),
    password: '',
    showPass: false
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingUser.value = null
}

async function saveEditUser() {
  const user = editingUser.value
  if (!user) return
  const isRootAdmin = editForm.value.position === ROOT_ADMIN_VALUE
  const positionToSend = isRootAdmin ? 'Admin' : editForm.value.position
  const payload = {
    hospitalId: editForm.value.hospitalId || undefined,
    position: positionToSend || undefined,
    isSuperAdmin: getStoredUser()?.isSuperAdmin ? isRootAdmin : undefined
  }
  if (editForm.value.password.trim())
    payload.password = editForm.value.password.trim()
  try {
    const res = await apiFetch(`/UpdateUser/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await getApiErrorMessage(res))
    const updated = await res.json()
    Object.assign(user, {
      hospitalId: updated.hospitalId ?? user.hospitalId,
      position: updated.position ?? user.position,
      password: updated.password ?? user.password
    })
    closeEditModal()
  } catch (e) {
    console.error(e)
    alert(e.message || 'บันทึกไม่สำเร็จ')
  }
}

function goToLoginAgain() {
  localStorage.removeItem('xraycare-user')
  router.push('/login')
}

// ---------- Hospital CRUD ----------
const hospitalForm = ref({ name: '', code: '' })
const hospitalErrors = ref({ name: false })

function openHospitalModal(hospital = null) {
  editingHospital.value = hospital
  hospitalForm.value = {
    name: hospital ? hospital.name : '',
    code: hospital ? (hospital.code || '') : ''
  }
  hospitalErrors.value = { name: false }
  showHospitalModal.value = true
}

function closeHospitalModal() {
  showHospitalModal.value = false
  editingHospital.value = null
}

async function saveHospital() {
  hospitalErrors.value = { name: false }
  if (!hospitalForm.value.name.trim()) {
    hospitalErrors.value.name = true
    return
  }
  try {
    if (editingHospital.value) {
      const res = await apiFetch(`/UpdateHospital/${editingHospital.value.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: hospitalForm.value.name.trim(), code: hospitalForm.value.code?.trim() || null })
      })
      if (!res.ok) {
        if (res.status === 404) apiUnreachable.value = true
        throw new Error(await getApiErrorMessage(res))
      }
    } else {
      const res = await apiFetch('/AddHospital', {
        method: 'POST',
        body: JSON.stringify({ name: hospitalForm.value.name.trim(), code: hospitalForm.value.code?.trim() || null })
      })
      if (!res.ok) {
        if (res.status === 404) apiUnreachable.value = true
        throw new Error(await getApiErrorMessage(res))
      }
    }
    closeHospitalModal()
    await loadHospitals()
  } catch (e) {
    console.error(e)
    if (e.message && (e.message.includes('fetch') || e.message.includes('Failed'))) apiUnreachable.value = true
    alert(e.message || 'บันทึกไม่สำเร็จ')
  }
}

async function deleteHospital(h) {
  if (!confirm(`ลบโรงพยาบาล "${h.name}" ใช่หรือไม่? (จะลบไม่ได้ถ้ามีผู้ใช้หรือเครื่องในโรงพยาบาลนี้)`)) return
  try {
    const res = await apiFetch(`/DeleteHospital/${h.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await getApiErrorMessage(res))
    await loadHospitals()
  } catch (e) {
    console.error(e)
    alert(e.message || 'ลบไม่สำเร็จ')
  }
}
</script>

<style scoped>
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

.tabs-row {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-sm, 8px) var(--radius-sm, 8px) 0 0;
  background: transparent;
  color: var(--text-secondary, #475569);
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
}

.tab-btn:hover {
  color: var(--primary-main, #0369A1);
  background: rgba(3, 105, 161, 0.08);
}

.tab-btn.active {
  color: var(--primary-main, #0369A1);
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-soft, #e2e8f0);
  border-bottom-color: var(--bg-card, #fff);
  margin-bottom: -1px;
}

.tab-panel {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.role-permission-hint {
  font-size: 0.7rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 2px;
  max-width: 180px;
  margin-left: auto;
  margin-right: auto;
}

.role-desc {
  font-size: 0.8rem;
}

.hospital-code {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.search-bar-container {
  max-width: 400px;
}

.search-bar-container :deep(.form-control),
.search-bar-container :deep(input) {
  flex: 1;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
}

.btn-purple {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
}

.btn-purple:hover {
  transform: translateY(-1px);
  color: #fff;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  box-shadow: var(--shadow-card);
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

.user-table tbody tr:hover {
  background: #f8fafc;
}

.table-input {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 10px;
  font-size: 0.85rem;
  width: 140px;
}

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
}

.modal-card-sm {
  max-width: 420px;
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
}

.close-modal-btn:hover {
  color: #b91c1c;
  border-color: #b91c1c;
}

.btn-create-account {
  width: 100%;
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 12px;
  background: linear-gradient(135deg, var(--purple-main, #0369A1), var(--purple-soft, #0EA5E9));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms;
}

.btn-create-account:hover {
  transform: translateY(-1px);
}

.modal-card :deep(input),
.modal-card :deep(select),
.modal-card :deep(.form-control),
.modal-card :deep(.form-select) {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 14px;
  font-size: 0.85rem;
}

.modal-card :deep(input:focus),
.modal-card :deep(select:focus),
.modal-card :deep(.form-control:focus),
.modal-card :deep(.form-select:focus) {
  border-color: var(--purple-soft, #0EA5E9);
  outline: none;
}

.password-input-wrap {
  display: flex;
  align-items: stretch;
  min-height: 44px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
}

.password-input-wrap:focus-within {
  border-color: var(--purple-soft, #0EA5E9);
}

.password-input-wrap .password-input {
  flex: 1;
  border: none;
  border-radius: var(--radius-sm, 8px) 0 0 var(--radius-sm, 8px);
  padding: 10px 14px;
  background: transparent;
}

.password-input-wrap .password-toggle {
  width: 44px;
  border: none;
  border-left: 1px solid var(--border-soft, #e2e8f0);
  background: transparent;
  color: var(--text-muted, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1024px) {
  .user-table { display: block; overflow-x: auto; }
}
@media (max-width: 640px) {
  .tabs-row { flex-wrap: wrap; }
  .tab-btn { flex: 1; min-width: 120px; }
  .search-bar-container { width: 100% !important; }
  .btn-purple { width: 100%; }
}
</style>

<template>
  <MainLayout activePage="user">
    <div class="user-management-content">
      
      <!-- Page Title -->
      <div class="page-title-section">
        <div class="blue-dot"></div>
        <h3 class="fw-bold m-0">User Management </h3>
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
              <th style="width: 30%;">Username</th>
              <th style="width: 40%;">Password</th>
              <th style="width: 30%;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <!-- 1. Username -->
              <td>{{ user.username }}</td>
              
              <!-- 2. Password (Display / Edit Mode) -->
              <td>
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <!-- Mode: Editing -->
                  <div v-if="user.isEditing" class="d-flex align-items-center gap-2 w-100 justify-content-center">
                    <input type="text" class="table-input" v-model="user.tempPassword" placeholder="Enter new password">
                    <!-- ปุ่ม Save สีเขียว -->
                    <i class="bi bi-check-circle-fill text-success cursor-pointer fs-5" @click="saveEdit(user)" title="Save"></i>
                    <!-- ปุ่ม Cancel สีแดง -->
                    <i class="bi bi-x-circle-fill text-danger cursor-pointer fs-5" @click="cancelEdit(user)" title="Cancel"></i>
                  </div>
                  
                  <!-- Mode: View -->
                  <div v-else class="d-flex align-items-center gap-2">
                    <!-- แสดงจุดไข่ปลา หรือ รหัสผ่าน ตามสถานะ showPassword -->
                    <span>{{ user.showPassword ? user.password : '••••••••••' }}</span>
                    <!-- ปุ่มเปิด/ปิดตา -->
                    <i class="bi cursor-pointer" 
                       :class="user.showPassword ? 'bi-eye-fill' : 'bi-eye-slash-fill'"
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
              <td colspan="3" class="text-center py-4 text-muted">No user found.</td>
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
            <input type="text" 
                   class="form-control" 
                   :class="{ 'is-invalid': errors.username }"
                   v-model="newUser.username">
          </div>
          
          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-group">
              <input :type="newUser.showPass ? 'text' : 'password'" 
                     class="form-control" 
                     :class="{ 'is-invalid': errors.password }"
                     v-model="newUser.password">
              <span class="input-group-text cursor-pointer" @click="newUser.showPass = !newUser.showPass">
                <i class="bi" :class="newUser.showPass ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Confirm Password</label>
            <div class="input-group">
              <input :type="newUser.showConfirm ? 'text' : 'password'" 
                     class="form-control" 
                     :class="{ 'is-invalid': errors.confirmPassword }"
                     v-model="newUser.confirmPassword">
              <span class="input-group-text cursor-pointer" @click="newUser.showConfirm = !newUser.showConfirm">
                <i class="bi" :class="newUser.showConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill'"></i>
              </span>
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
import { ref, computed, onMounted, watch } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

// --- State ---
const searchQuery = ref('');
const showModal = ref(false);
// เริ่มต้น users เป็น array ว่างก่อน แล้วค่อยโหลดจาก onMounted เพื่อป้องกันค่า default แสดงก่อน
const users = ref([]);

// --- ข้อมูลเริ่มต้น (Default Mock Data) - ไม่มี showPassword: true ---
const defaultUsers = [
  { id: 1, username: 'xxxxxxxxx', password: 'password123' },
  { id: 2, username: 'yyyyyyyyy', password: 'securepass' },
  { id: 3, username: 'zzzzzzzzz', password: 'userpass01' },
  { id: 4, username: 'ทดสอบก', password: 'password007' },
];

// --- Load Data Logic (แก้ปัญหาข้อ 1 & 3) ---
const loadUsers = () => {
  const storedUsers = localStorage.getItem('xray_users');
  let parsedUsers = [];

  if (storedUsers) {
    try {
      parsedUsers = JSON.parse(storedUsers);
    } catch (e) {
      parsedUsers = defaultUsers;
    }
  } else {
    parsedUsers = defaultUsers;
  }

  // สำคัญ: เมื่อโหลดข้อมูลมาแล้ว ต้อง Force ให้ showPassword เป็น false และ isEditing เป็น false เสมอ
  // เพื่อแก้ปัญหาข้อ 1 (เข้ามาแล้วต้องปิดตา) และป้องกันสถานะค้าง
  users.value = parsedUsers.map(u => ({
    ...u,
    showPassword: false, 
    isEditing: false,
    tempPassword: ''
  }));
};

// เรียกใช้ตอนโหลดหน้าเว็บ
onMounted(() => {
  loadUsers();
});

// --- Save Data Logic (แก้ปัญหาข้อ 2 & 3) ---
// Watcher นี้จะทำงานทุกครั้งที่มีการ เพิ่ม/ลบ/แก้ไข ข้อมูลใน users
watch(users, (newUsers) => {
  // บันทึกเฉพาะข้อมูลที่จำเป็น (ไม่บันทึกสถานะ UI เช่น showPassword)
  const dataToSave = newUsers.map(({ id, username, password }) => ({ id, username, password }));
  localStorage.setItem('xray_users', JSON.stringify(dataToSave));
}, { deep: true });

// --- New User Form State ---
const newUser = ref({
    username: '',
    password: '',
    confirmPassword: '',
    showPass: false,
    showConfirm: false
});

const errors = ref({
    username: false,
    password: false,
    confirmPassword: false
});

// --- Computed ---
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value;
    return users.value.filter(user => 
        user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// --- Methods ---

const openModal = () => {
    newUser.value = { username: '', password: '', confirmPassword: '', showPass: false, showConfirm: false };
    errors.value = { username: false, password: false, confirmPassword: false };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const createAccount = () => {
    errors.value = { username: false, password: false, confirmPassword: false };
    let isValid = true;

    if (!newUser.value.username) { errors.value.username = true; isValid = false; }
    if (!newUser.value.password) { errors.value.password = true; isValid = false; }
    if (!newUser.value.confirmPassword || newUser.value.confirmPassword !== newUser.value.password) {
        errors.value.confirmPassword = true;
        isValid = false;
    }

    if (isValid) {
        users.value.push({
            id: Date.now(),
            username: newUser.value.username,
            password: newUser.value.password,
            showPassword: false, // สร้างใหม่ก็ต้องปิดตา
            isEditing: false,
            tempPassword: ''
        });
        showModal.value = false; 
    }
};

// Delete Logic (ข้อ 3: ลบแล้วต้องหายไปเลย)
const deleteUser = (id) => {
    if(confirm('คุณต้องการลบบัญชีผู้ใช้นี้ใช่หรือไม่?')) {
        // การ filter ออกจะทำให้ users.value เปลี่ยน -> trigger watch -> บันทึกลง localStorage
        users.value = users.value.filter(u => u.id !== id);
    }
};

// Toggle Eye
const toggleVisibility = (user) => {
    user.showPassword = !user.showPassword;
};

// Edit Logic (ข้อ 2: แก้ไขแล้วจำค่าใหม่)
const startEdit = (user) => {
    user.tempPassword = ''; // เคลียร์ค่าเพื่อให้กรอกใหม่
    user.isEditing = true;
};

const saveEdit = (user) => {
    if (user.tempPassword.trim()) {
        user.password = user.tempPassword; // อัปเดตค่าจริง
        user.isEditing = false;
        // users.value เปลี่ยน -> trigger watch -> บันทึกลง localStorage ทันที
    } else {
        alert("Password cannot be empty!");
    }
};

const cancelEdit = (user) => {
    user.isEditing = false;
};
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
}

.modal-card {
    background: white;
    padding: 30px;
    border-radius: 15px;
    width: 400px;
    position: relative;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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

.form-control.is-invalid {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5zM6 8.2a.3.3 0 00-6 0 .3.3 0 00.6 0z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right calc(0.375em + 0.1875rem) center;
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    border-color: #dc3545;
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
</style>
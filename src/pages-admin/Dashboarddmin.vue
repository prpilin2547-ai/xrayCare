<template>
  <div class="app-container d-flex font-thai">
    
    <nav class="sidebar d-flex flex-column p-3 flex-shrink-0" :class="{'bg-light': true}">
      <div class="mb-4 text-center">
         </div>
      
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: currentView === 'dashboard' }" @click.prevent="currentView = 'dashboard'">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" :class="{ active: currentView === 'user' }" @click.prevent="currentView = 'user'">
            <i class="bi bi-person-badge me-2"></i>
            User Account
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link analytical-link" :class="{ active: currentView === 'analytical' }" @click.prevent="currentView = 'analytical'">
            <i class="bi bi-graph-up me-2"></i>
            Analytical
          </a>
        </li>
        <li class="nav-item">
           <a href="#" class="nav-link">
            <i class="bi bi-person-plus me-2"></i>
            Sign Up
          </a>
        </li>
      </ul>
      
      <hr>
      
      <div class="mt-auto">
        <a href="#" class="nav-link text-danger" @click.prevent="logout">
          <i class="bi bi-box-arrow-right me-2"></i>
          Log out
        </a>
      </div>
    </nav>

    <div class="main-content flex-grow-1 d-flex flex-column">
      
      <header class="header-bar d-flex align-items-center justify-content-between px-4 py-2 text-white">
        <div class="d-flex align-items-center">
          <h4 class="mb-0 fw-bold me-3">x-raycare</h4>
        </div>
        <div class="d-flex align-items-center">
          <i class="bi bi-person-circle fs-4 me-2"></i>
          <span>Username (Admin)</span>
        </div>
      </header>

      <div class="content-body p-4 bg-white h-100 overflow-auto">
        
        <div v-if="currentView === 'dashboard'">
          <h3 class="mb-4">ภาพรวมประจำวัน</h3>
          
          <div class="row g-3 mb-4">
            <div class="col-md-3" v-for="(card, index) in summaryCards" :key="index">
              <div class="card h-100 border-light shadow-sm rounded-3">
                <div class="card-body text-center">
                  <h5 class="card-title fw-bold" :class="card.colorClass">{{ card.title }}</h5>
                  <p class="card-text display-6">{{ card.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card border shadow-sm mb-4">
             <div class="card-body p-0">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Equipment Name</th>
                      <th>Room</th>
                      <th>Last Check</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in equipmentList" :key="item.id">
                      <td>
                         <a href="#" class="text-decoration-none text-info fw-bold" style="text-decoration: underline !important;">
                           {{ item.name }}
                         </a>
                      </td>
                      <td>{{ item.room }}</td>
                      <td>{{ item.lastCheck }}</td>
                      <td>
                        <span v-if="item.status === 'Pending'" class="badge rounded-pill text-bg-warning text-white">
                          รอดำเนินการ
                        </span>
                        <span v-else class="badge rounded-pill text-bg-success">ปกติ</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
             </div>
          </div>

          <button class="btn btn-monthly w-100 py-3 d-flex align-items-center justify-content-center rounded-3">
             <i class="bi bi-calendar-check fs-3 me-3 text-danger"></i>
             <span class="fs-5 text-dark">ตรวจสอบประจำเดือน (Monthly Check)</span>
          </button>
        </div>

        <div v-if="currentView === 'user'">
          <div class="d-flex align-items-center mb-4">
             <div class="circle-indicator bg-primary me-2"></div>
             <h3 class="fw-bold mb-0">User Management</h3>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">User Member ({{ users.length }})</h5>
            
            <div class="input-group" style="width: 300px;">
              <input type="text" class="form-control border-dark" placeholder="Search...">
              <button class="btn btn-outline-dark" type="button">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered custom-grey-table text-center">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in users" :key="index">
                  <td>{{ user.username }}</td>
                  <td>
                    <div class="d-flex justify-content-center align-items-center gap-2">
                      <span>{{ user.showPass ? user.password : '••••••••' }}</span>
                      <i class="bi cursor-pointer" 
                         :class="user.showPass ? 'bi-eye' : 'bi-eye-slash'"
                         @click="togglePassword(index)"></i>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-link text-dark p-0 me-3"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-link text-dark p-0"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="currentView === 'analytical'">
           <h3 class="mb-4 text-purple-theme">Analytical Overview</h3>

           <div class="row g-4">
             
             <div class="col-12">
               <div class="card rounded-3 border-0 shadow-sm overflow-hidden">
                 <div class="card-header bg-header-purple text-white py-2">
                   สรุปสถานะการแจ้งซ่อม (Proportion)
                 </div>
                 <div class="card-body bg-off-white d-flex justify-content-center align-items-center" style="height: 300px;">
                    <div class="position-relative" style="width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(#fd7e14 0% 20%, #198754 20% 80%, #e83e8c 80% 100%);"></div>
                    <div class="ms-4">
                       <div class="d-flex align-items-center mb-2"><span class="dot bg-orange me-2"></span> Failure Rate (20%)</div>
                       <div class="d-flex align-items-center mb-2"><span class="dot bg-green me-2"></span> QC Pass (60%)</div>
                       <div class="d-flex align-items-center"><span class="dot bg-pink me-2"></span> Recurrent Failure (20%)</div>
                    </div>
                 </div>
               </div>
             </div>

             <div class="col-12">
               <div class="card rounded-3 border-0 shadow-sm overflow-hidden">
                 <div class="card-header bg-header-purple text-white py-2">
                   สรุปสถานะการแจ้งซ่อม (Statistics)
                 </div>
                 <div class="card-body bg-off-white d-flex align-items-end justify-content-around px-5" style="height: 300px;">
                    <div class="text-center w-100 mx-2">
                      <div class="bg-orange rounded-top" style="height: 100px;"></div>
                      <small>Failure</small>
                    </div>
                    <div class="text-center w-100 mx-2">
                      <div class="bg-green rounded-top" style="height: 220px;"></div>
                      <small>QC Pass</small>
                    </div>
                    <div class="text-center w-100 mx-2">
                      <div class="bg-pink rounded-top" style="height: 80px;"></div>
                      <small>Recurrent</small>
                    </div>
                 </div>
               </div>
             </div>

           </div>

           <div class="mt-4 p-3 rounded-pill bg-light-pink text-center text-dark">
             <strong>Summary:</strong> QC ผ่านเกณฑ์ 60% แต่อัตราการซ่อมซ้ำยังสูงอยู่ที่ 20% ต้องตรวจสอบเครื่อง General X-ray ห้อง 2 เพิ่มเติม
           </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State สำหรับเปลี่ยนหน้า
const currentView = ref('admindashboard');

// Mock Data: Dashboard Summary Cards
const summaryCards = [
  { title: 'Date', value: '19 Nov', colorClass: 'text-magenta' },
  { title: 'Equipment', value: '5 Units', colorClass: 'text-purple' },
  { title: 'Pending', value: '2 Tasks', colorClass: 'text-orange' },
  { title: 'Repair Requests', value: '1 New', colorClass: 'text-blue' }
];

// Mock Data: Equipment List
const equipmentList = [
  { id: 1, name: 'General X-ray (Samsung GC85)', room: 'Room 1', lastCheck: '18 Nov 2025', status: 'Normal' },
  { id: 2, name: 'Portable X-ray (Shimadzu)', room: 'ER', lastCheck: '15 Nov 2025', status: 'Pending' },
  { id: 3, name: 'Fluoroscopy', room: 'Room 3', lastCheck: '19 Nov 2025', status: 'Normal' },
];

// Mock Data: Users
const users = ref([
  { username: 'supakorn_rt', password: 'password123', showPass: false },
  { username: 'engineer_01', password: 'fixitnow456', showPass: false }
]);

// Function: Toggle Password Visibility
const togglePassword = (index) => {
  users.value[index].showPass = !users.value[index].showPass;
};

// Function: Logout (Simulation)
const logout = () => {
  alert('Logging out... Redirecting to Login Page');
  // logic to redirect usually goes here
};
</script>

<style scoped>
/* Font Setup */
.font-thai {
  font-family: 'Prompt', sans-serif;
}

/* Layout Sizing */
.app-container {
  height: 100vh;
  overflow: hidden;
}

/* 1.2.1 & 1.1.2 Header Bar */
.header-bar {
  height: 60px;
  background-color: #4A148C; /* Deep Purple */
}
.bg-header-purple {
  background-color: #4A148C;
}

/* Sidebar Styling */
.sidebar {
  width: 250px;
  background-color: #F8F9FA; /* Light Grey */
  border-right: 1px solid #dee2e6;
}

.nav-link {
  color: #333;
  margin-bottom: 5px;
  border-radius: 5px;
}

.nav-link.active {
  background-color: #e9ecef; /* Slightly darker grey */
  color: #000;
  font-weight: 600;
}

/* Analytical Active State (Special case with purple border) */
.nav-link.analytical-link.active {
  border-left: 5px solid #4A148C;
  background-color: #e2e6ea;
}

/* Text Colors for Summary Cards */
.text-magenta { color: #D81B60; }
.text-purple  { color: #6A1B9A; }
.text-orange  { color: #fd7e14; }
.text-blue    { color: #0d6efd; }
.text-purple-theme { color: #4A148C; }

/* Background Colors for Analytical Charts & Pills */
.bg-off-white { background-color: #f8f9fa; }
.bg-light-pink { background-color: #F8D7DA; }
.bg-orange { background-color: #fd7e14; }
.bg-green { background-color: #198754; }
.bg-pink { background-color: #D81B60; }

/* Dashboard: Monthly Button */
.btn-monthly {
  background-color: #F8D7DA; /* Light Pink */
  border: none;
  transition: all 0.3s;
}
.btn-monthly:hover {
  background-color: #f1b0b7;
}

/* User Account: Title Indicator */
.circle-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #0d6efd; /* Blue */
}

/* User Account: Custom Grey Table */
.custom-grey-table thead th, 
.custom-grey-table tbody td {
  background-color: #e9ecef; /* Grey Cell Background */
  border: 1px solid white;   /* White Grid Lines */
  vertical-align: middle;
}

/* Analytical: Chart Dot Legend */
.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
<template>
  <MainLayout>
    <div class="repair-detail-page">
        
        <!-- Header Title -->
        <div class="page-header">
            <div class="blue-dot"></div>
            <h2 class="page-title">รายละเอียดแจ้งซ่อม</h2>
        </div>

        <!-- Main Content Box -->
        <div class="main-box">
            <!-- Orange Header -->
            <div class="box-header">
                <div class="header-label">อุปกรณ์</div>
                <div class="header-value">{{ repairData.equipmentName }} ห้อง {{ repairData.room }}</div>
            </div>

            <!-- Grey Body -->
            <div class="box-body">
                <!-- Details -->
                <div class="mb-3">
                    <strong>รายละเอียด</strong>
                    <ul class="content-list">
                        <li v-for="(detail, index) in repairData.details" :key="index">{{ detail }}</li>
                    </ul>
                </div>

                <!-- Remarks -->
                <div class="mb-3">
                    <strong>หมายเหตุ</strong>
                    <ul class="content-list">
                        <li v-for="(remark, index) in repairData.remarks" :key="index">{{ remark }}</li>
                    </ul>
                </div>

                <!-- Action Area inside Box -->
                <div class="inner-actions">
                    <!-- 4. File Button (Open Image Modal) -->
                    <button class="btn btn-file shadow-sm" @click="openImageModal">
                        ไฟล์ภาพ 
                        <i class="bi bi-camera-fill bg-white rounded-1 ms-2 px-1"></i>
                    </button>

                    <!-- Current Status Display (Not Dropdown) -->
                    <!-- แสดงสถานะปัจจุบันเป็นปุ่มเฉยๆ (ถ้าไม่ได้กดแก้ไข) -->
                    <div v-if="!isEditingStatus" class="status-display">
                        <button class="btn btn-status-base shadow-sm" :class="statusClass">
                            {{ currentStatus }}
                        </button>
                    </div>

                    <!-- 1. & 2. Status Dropdown (Show ONLY when editing) -->
                    <!-- ส่วนนี้จะแสดงก็ต่อเมื่อกดปุ่ม 'แก้ไขสถานะ' ด้านล่าง -->
                    <div v-if="isEditingStatus" class="status-selector-container bg-white border border-dark p-2 shadow-sm position-absolute" style="bottom: 80px; right: 30px; z-index: 10;">
                        <ul class="list-unstyled m-0">
                            <li><a class="dropdown-item p-2" href="#" @click.prevent="changeStatus('รอซ่อม')">รอซ่อม</a></li>
                            <li><a class="dropdown-item p-2" href="#" @click.prevent="changeStatus('อยู่ระหว่างดำเนินการ')">อยู่ระหว่างดำเนินการ</a></li>
                            <li><a class="dropdown-item p-2" href="#" @click.prevent="changeStatus('ดำเนินการแล้ว')">ดำเนินการแล้ว</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Action Buttons -->
        <div class="footer-actions">
            <!-- 2. Toggle Edit Status Mode -->
            <button class="btn btn-edit-status shadow-sm" @click="toggleEditStatus">
                {{ isEditingStatus ? 'ปิดการแก้ไข' : 'แก้ไขสถานะ' }}
            </button>
            <!-- 5. Save Button -->
            <button class="btn btn-save shadow-sm" @click="saveData">บันทึก</button>
        </div>

        <!-- 4. Image Modal -->
        <div v-if="showImageModal" class="modal-overlay">
            <div class="modal-card image-modal-card">
                <div class="modal-header bg-success text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 class="m-0">รูปภาพ</h5>
                    <i class="bi bi-x-circle cursor-pointer fs-4" @click="closeImageModal"></i>
                </div>
                <div class="modal-body p-5 bg-light d-flex justify-content-center align-items-center" style="min-height: 300px;">
                    <!-- Placeholder Image -->
                     <div class="text-center">
                        <img src="https://via.placeholder.com/400x300?text=X-Ray+Machine+Issue" alt="Request Image" class="img-fluid shadow-sm mb-3">
                        <p class="text-muted">รูปภาพที่ส่งมาจากนักรังสี</p>
                     </div>
                </div>
            </div>
        </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Use Router for navigation
import MainLayout from '../components/Layout/MainLayout.vue';

const router = useRouter();

// Mock Data
const repairData = ref({
    equipmentName: 'X-ray general รุ่น xxx',
    room: '1',
    details: ['ระบบล็อกและเบรก'],
    remarks: ['ระบบล็อกติดขัด']
});

// State
const currentStatus = ref('ดำเนินการแล้ว');
const isEditingStatus = ref(false); // Control Dropdown visibility
const showImageModal = ref(false);

// Computed Class for Status Color
const statusClass = computed(() => {
    if (currentStatus.value === 'รอซ่อม') return 'status-waiting';
    if (currentStatus.value === 'อยู่ระหว่างดำเนินการ') return 'status-progress';
    if (currentStatus.value === 'ดำเนินการแล้ว') return 'status-completed';
    return 'status-waiting';
});

// --- Methods ---

// 2. Toggle Dropdown visibility
const toggleEditStatus = () => {
    isEditingStatus.value = !isEditingStatus.value;
};

// 3. Change Status & Hide Dropdown
const changeStatus = (status) => {
    currentStatus.value = status;
    isEditingStatus.value = false; // Auto hide after selection
};

// 4. Image Modal Controls
const openImageModal = () => {
    showImageModal.value = true;
};
const closeImageModal = () => {
    showImageModal.value = false;
};

// 5. Save Data & Navigate Back
const saveData = () => {
    // In real app: Call API to update status
    alert(`บันทึกข้อมูลเรียบร้อย!\nสถานะใหม่: ${currentStatus.value}`);
    
    // Navigate back to Dashboard (assuming route name is 'combined-dashboard' or similar)
    // For now, just log
    console.log("Navigating back to Dashboard...");
    // router.push({ name: 'Dashboard' }); 
};
</script>

<style scoped>
/* Page Header */
.page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.blue-dot {
    width: 12px;
    height: 12px;
    background-color: #007bff;
    border-radius: 50%;
    margin-right: 10px;
}
.page-title {
    font-weight: 600;
    font-size: 1.2rem;
    margin: 0;
}

/* Main Box */
.main-box {
    border: 1px solid #000;
    background-color: #D9D9D9;
    border-radius: 4px;
    overflow: hidden;
}

/* Box Header */
.box-header {
    background-color: #FFCC99;
    border-bottom: 1px solid #000;
    display: flex;
    min-height: 60px;
}
.header-label {
    width: 120px;
    border-right: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    padding: 10px;
}
.header-value {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    font-weight: 400;
}

/* Box Body */
.box-body {
    padding: 30px;
    position: relative;
    min-height: 300px;
}

/* Lists */
ul.content-list {
    list-style-type: none;
    padding-left: 10px;
}
ul.content-list li::before {
    content: "•";
    color: black;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}

/* Buttons Area */
.inner-actions {
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
}

.btn-file {
    background-color: #9EBD6E;
    border: 1px solid #333;
    color: black;
    width: 140px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.btn-status-base {
    border: 1px solid #333;
    color: black;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    min-width: 180px;
    padding: 0 25px;
    white-space: nowrap;
}

/* Status Colors */
.status-waiting { background-color: #FF5C5C; }
.status-progress { background-color: #FFB347; }
.status-completed { background-color: #8BE296; }

/* Dropdown Menu Custom */
.dropdown-item {
    cursor: pointer;
    font-size: 1rem;
}
.dropdown-item:hover {
    background-color: #f0f0f0;
}

/* Footer Buttons */
.footer-actions {
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
    gap: 20px;
}

.btn-edit-status {
    background-color: #F4F85B; /* Yellow */
    border: 1px solid #333;
    color: black;
    width: 160px;
    height: 50px;
    font-size: 1.1rem;
}

.btn-save {
    background-color: #8BE296; /* Green */
    border: 1px solid #333;
    color: black;
    width: 160px;
    height: 50px;
    font-size: 1.1rem;
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
.image-modal-card {
    width: 600px;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.cursor-pointer {
    cursor: pointer;
}
</style>
<template>
    <MainLayout>
        <div class="page">
            <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
            <div v-if="!selectedItem">
                <!-- หัวข้อระบบแจ้งซ่อม + ปุ่มเพิ่มรายการ -->
                <div class="section-header">
                    <span class="section-title">ระบบแจ้งซ่อม</span>
                    <button type="button" class="btn btn-danger d-flex align-items-center gap-2" @click="openModal">
                        <i class="bi bi-plus-lg"></i>
                        เพิ่มรายการ
                    </button>
                </div>

                <!-- ตารางแจ้งซ่อม -->
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>อุปกรณ์</th>
                                <th>ห้องตรวจ</th>
                                <th>รายละเอียด</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in activeItems" :key="item.id" class="clickable-row"
                                @click="openDetail(item)">
                                <!-- ใช้ index + 1 เป็นลำดับแทน id -->
                                <td>{{ index + 1 }}</td>
                                <td>{{ getEquipmentText(item) }}</td>
                                <td>{{ getRoomText(item) }}</td>
                                <td>{{ item.detail }}</td>
                                <td class="status" :class="getStatusCellClass(item.statusText)">
                                    {{ item.statusText }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ================== VIEW 2 : รายละเอียดแจ้งซ่อม (แสดงอย่างเดียว) ================== -->
            <div v-else class="repair-detail-page">
                <!-- Header Title + ปุ่มกากบาท -->
                <div class="page-header">
                    <div class="blue-dot"></div>
                    <h2 class="page-title">รายละเอียดแจ้งซ่อม</h2>
                    <i class="bi bi-x-circle close-modal-btn" @click="closeDetail"></i>
                </div>



                <!-- Main Content Box -->
                <div class="main-box">
                    <!-- Orange Header -->
                    <div class="box-header">
                        <div class="header-label">อุปกรณ์</div>
                        <div class="header-value">
                            {{ getEquipmentWithRoom(selectedItem) }}
                        </div>
                    </div>


                    <!-- Grey Body -->
                    <div class="box-body">
                        <!-- Details -->
                        <div class="mb-3">
                            <strong>รายละเอียด</strong>
                            <ul class="content-list">
                                <li>{{ selectedItem.detail }}</li>
                            </ul>
                        </div>

                        <!-- Remarks (ตัวอย่าง fix ไว้) -->
                        <div class="mb-3">
                            <strong>หมายเหตุ</strong>
                            <ul class="content-list">
                                <li>ระบบล็อกติดขัด</li>
                            </ul>
                        </div>

                        <div class="inner-actions">
                            <!-- ปุ่มไฟล์ภาพ (เพิ่มใหม่) -->
                            <button v-if="selectedItem && selectedItem.imageData" class="btn btn-file shadow-sm"
                                @click="openImageModal(selectedItem.imageData)">
                                ไฟล์ภาพ
                                <i class="bi bi-camera-fill bg-white rounded-1 ms-2 px-1"></i>
                            </button>

                            <div class="status-display">
                                <div class="btn-status-base shadow-sm" :class="detailStatusClass">
                                    {{ selectedItem.statusText }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal (เพิ่มใหม่) -->
        <div v-if="showImageModal" class="modal-overlay">
            <div class="modal-card image-modal-card">
                <div class="modal-header bg-success text-white p-3 d-flex justify-content-between align-items-center">
                    <h5 class="m-0">รูปภาพ</h5>
                    <i class="bi bi-x-circle cursor-pointer fs-4" @click="closeImageModal"></i>
                </div>
                <div class="modal-body p-5 bg-light d-flex justify-content-center align-items-center"
                    style="min-height: 300px">
                    <div class="text-center">
                        <img v-if="previewImageSrc" :src="previewImageSrc" alt="Request Image"
                            class="img-fluid shadow-sm mb-3" />
                        <p class="text-muted">
                            รูปภาพที่อัปโหลดไว้ในรายการแจ้งซ่อม
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>

    <!-- ================== MODAL: เพิ่มรายการแจ้งซ่อม ================== -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true" ref="modalEl">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">ระบบแจ้งซ่อม</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>

                <div class="form-container modal-body">
                    <!-- ฟอร์ม -->
                    <div @submit.prevent="submitForm">
                        <!-- อุปกรณ์ -->
                        <div class="row">
                            <label class="label">อุปกรณ์ :</label>
                            <div class="field">
                                <select v-model="selectedEquipment" class="pill-btn form-control form-control-sm">
                                    <option value="">เลือกอุปกรณ์</option>
                                    <option v-for="eq in equipmentOptions" :key="eq" :value="eq">
                                        {{ eq }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- ห้องตรวจ (ใหม่) -->
                        <div class="row mt-3">
                            <label class="label">ห้องตรวจ :</label>
                            <div class="field">
                                <select v-model="selectedRoom" class="pill-btn form-control form-control-sm">
                                    <option value="">เลือกห้องตรวจ</option>
                                    <option v-for="room in roomOptions" :key="room" :value="room">
                                        {{ room }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- รายละเอียด -->
                        <div class="mt-3">
                            <label class="label">รายละเอียด :</label>
                            <div class="field">
                                <textarea v-model="detail" class="textarea-input form-control"
                                    placeholder="เพิ่มรายละเอียด"></textarea>
                            </div>
                        </div>

                        <!-- แนบไฟล์ภาพ -->
                        <div class="mt-3">
                            <label class="label">แนบไฟล์ภาพ :</label>
                            <div class="field">
                                <input ref="fileInput" type="file" accept="image/*" class="hidden-file form-control"
                                    @change="onFileSelected" />
                                <div v-if="fileName" class="file-name">
                                    <!-- คลิกชื่อไฟล์เพื่อพรีวิว -->
                                    <span v-if="uploadedImageData" class="file-link"
                                        @click="openImageModal(uploadedImageData)">
                                        {{ fileName }}
                                    </span>
                                    <span v-else>{{ fileName }}</span>

                                    <!-- ปุ่มกากบาทลบไฟล์ -->
                                    <button type="button" class="file-remove" @click="clearFile">
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">ปิด</button>
                    <button class="btn btn-primary" @click="submitForm">บันทึก</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import { Modal } from 'bootstrap'

const STORAGE_KEY = 'repair_items'

const modalEl = ref(null)
let modal = null
const fileInput = ref(null)
const fileName = ref('')

const detail = ref('')
const selectedEquipment = ref('')
const selectedRoom = ref('')       // ห้องตรวจ (ใหม่)
const selectedItem = ref(null)

// เพิ่มใหม่
const uploadedImageData = ref('')      // เก็บ dataURL ของรูปที่อัปโหลด
const showImageModal = ref(false)      // คุม modal รูป
const previewImageSrc = ref('')        // src ที่จะแสดงใน modal

// list อุปกรณ์ (เอาคำว่า "ห้อง X" ออกแล้ว)
const equipmentOptions = [
    'X-ray general รุ่น xxx',
    'X-ray general รุ่น yyyy',
    'X-ray general รุ่น zzzz',
    'X-ray general รุ่น aaaa'
]

// list ห้องตรวจ
const roomOptions = ['ห้อง 1', 'ห้อง 2', 'ห้อง 3', 'ห้อง 4']

// default ข้อมูลเริ่มต้นในตาราง
const defaultItems = [
    {
        id: 1,
        equipment: 'X-ray general รุ่น xxx',
        room: 'ห้อง 1',
        detail: 'ระบบล็อกและเบรก',
        statusText: 'รอซ่อม'
    }
]

// items ใช้ร่วมกับ Engineer (ผ่าน localStorage)
const items = ref([...defaultItems])

onMounted(() => {
    // โหลดข้อมูลจาก localStorage (ถ้ามี)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
        try {
            items.value = JSON.parse(stored)
        } catch (e) {
            items.value = [...defaultItems]
        }
    }

    modal = new Modal(modalEl.value, {
        backdrop: 'static'
    })
})

// sync items -> localStorage (ใช้ร่วมกับ RequestEN)
watch(
    items,
    newItems => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    },
    { deep: true }
)

// แสดงเฉพาะรายการที่ยังไม่ "ดำเนินการแล้ว"
const activeItems = computed(() =>
    items.value.filter(i => i.statusText !== 'ดำเนินการแล้ว')
)

// helper แสดงชื่ออุปกรณ์ (ตัดคำว่า "ห้อง X" ออกกรณีเป็นข้อมูลเก่า)
const getEquipmentText = (item) => {
    if (item.room) return item.equipment
    return item.equipment.replace(/\s*ห้อง\s*\d+\s*$/, '')
}

// helper แสดงห้องตรวจ (รองรับข้อมูลเก่าที่ยังไม่ได้แยก room)
const getRoomText = (item) => {
    if (item.room) return item.room
    const match = item.equipment.match(/ห้อง\s*\d+/)
    return match ? match[0] : ''
}

// *** ใหม่: ใช้สำหรับกล่องสีส้ม ***
const getEquipmentWithRoom = (item) => {
    if (!item) return ''
    const equip = getEquipmentText(item)
    const room  = getRoomText(item)
    return room ? `${equip} ${room}` : equip
}

// เปิด modal
const openModal = () => {
    modal.show()
}

// ปิด modal
const closeModal = () => {
    modal.hide()
}

// เลือกไฟล์ภาพ
const onFileSelected = (event) => {
    const file = event.target.files[0]
    if (!file) {
        fileName.value = ''
        uploadedImageData.value = ''
        return
    }

    fileName.value = file.name
    const reader = new FileReader()
    reader.onload = e => {
        uploadedImageData.value = e.target.result // เก็บเป็น base64
    }
    reader.readAsDataURL(file)
}

// เปิดหน้ารายละเอียดเมื่อคลิกในตาราง
const openDetail = (item) => {
    selectedItem.value = item
}

// ปิดหน้ารายละเอียดด้วยปุ่มกากบาท
const closeDetail = () => {
    selectedItem.value = null
}

// เพิ่มข้อมูลใหม่ + กลับไปตาราง
const submitForm = () => {
    if (!selectedEquipment.value || !selectedRoom.value || !detail.value) {
        return
    }

    const newId = items.value.length
        ? Math.max(...items.value.map(i => i.id)) + 1
        : 1

    items.value.push({
        id: newId,
        equipment: selectedEquipment.value,
        room: selectedRoom.value,
        detail: detail.value,
        statusText: 'รอซ่อม',                // สถานะเริ่มต้น
        imageData: uploadedImageData.value || null // เก็บรูปไปกับ item
    })

    // เคลียร์ฟอร์ม
    selectedEquipment.value = ''
    selectedRoom.value = ''
    detail.value = ''
    fileName.value = ''
    uploadedImageData.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }

    closeModal()
}

// ลบไฟล์ที่อัปโหลด (กากบาท)
const clearFile = (event) => {
    event.stopPropagation()
    fileName.value = ''
    uploadedImageData.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// เปิด modal รูปภาพ
const openImageModal = (imageSrc) => {
    if (!imageSrc) return
    previewImageSrc.value = imageSrc
    showImageModal.value = true
}

// ปิด modal รูปภาพ
const closeImageModal = () => {
    showImageModal.value = false
    previewImageSrc.value = ''
}

// สีพื้นหลังของสถานะในตาราง
const getStatusCellClass = (status) => {
    if (status === 'รอซ่อม') return 'status-waiting'
    if (status === 'อยู่ระหว่างดำเนินการ') return 'status-progress'
    if (status === 'ดำเนินการแล้ว') return 'status-completed'
    return ''
}

// สีปุ่มสถานะในหน้ารายละเอียด
const detailStatusClass = computed(() => {
    if (!selectedItem.value) return ''
    return getStatusCellClass(selectedItem.value.statusText)
})
</script>

<style scoped>
.page {
    padding-top: 8px;
}

.page-title {
    margin: 0 0 12px;
    font-size: 1rem;
    font-weight: 500;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.section-title {
    font-size: 1rem;
    font-weight: 600;
}

.repair-detail-page {
    position: relative;
}

/* ปุ่มกากบาทมุมขวาบน */
.close-modal-btn {
    margin-left: auto;
    /* ดันไปชิดขวาในแถวเดียวกับหัวข้อ */
    cursor: pointer;
    color: #dc3545;
    font-size: 1.5rem;
    transition: 0.2s;
}


.close-modal-btn:hover {
    transform: scale(1.1);
}


/* ตาราง */
.table-wrapper {
    max-width: 800px;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

th,
td {
    padding: 10px 8px;
    text-align: center;
    border: 1px solid #9ca3af;
}

thead th {
    background: #93c5fd;
    font-weight: 600;
}

tbody td {
    background: #e5e5e5;
}

.status.pending {
    color: #ef4444;
    font-weight: 600;
}

.clickable-row {
    cursor: pointer;
}

/* ---------- style หน้ารายละเอียด ---------- */
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

.repair-detail-page .page-title {
    font-weight: 600;
    font-size: 1.2rem;
    margin: 0;
}

/* Main Box */
.main-box {
    border: 1px solid #000;
    background-color: #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
}

/* Box Header */
.box-header {
    background-color: #ffcc99;
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
    content: '•';
    color: black;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}

/* Status แสดงอย่างเดียวด้านล่างขวา */
.inner-actions {
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
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
    pointer-events: none;
}

/* สีสถานะใช้ร่วมกับ RequestEN */
.status-waiting {
    background-color: #ff5c5c;
}

.status-progress {
    background-color: #ffb347;
}

.status-completed {
    background-color: #8be296;
}

/* ปุ่มไฟล์ภาพ */
.btn-file {
    background-color: #9ebd6e;
    border: 1px solid #333;
    color: black;
    width: 140px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

/* กล่องชื่อไฟล์ + ปุ่มกากบาท */
.file-name {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.file-link {
    text-decoration: underline;
    cursor: pointer;
}

.file-remove {
    border: none;
    background: none;
    color: #6b7280;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}

/* modal แสดงรูปภาพ – ให้ลอยอยู่ด้านขวา ไม่บังหน้าระบบแจ้งซ่อม */
.modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 50vw;
    max-width: 600px;
    height: 100vh;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.image-modal-card {
    width: 100%;
    background: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.cursor-pointer {
    cursor: pointer;
}

.section-header button {
    padding: 6px 14px;
    font-size: 0.9rem;
}
</style>
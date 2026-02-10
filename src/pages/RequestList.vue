<template>
    <MainLayout>
        <div class="page">
            <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
            <div v-if="!selectedItem">
                <!-- หัวข้อระบบแจ้งซ่อม + ปุ่มเพิ่มรายการ -->
                <div class="section-header">
                    <span class="section-title">ระบบแจ้งซ่อม </span>
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
                                <th>วันที่แจ้ง</th>
                                <th>รายละเอียด</th>
                                <th>สถานะ</th>
                                <th>รายละเอียด</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in activeItems" :key="item.id">
                                <!-- ใช้ index + 1 เป็นลำดับแทน id -->
                                <td>{{ index + 1 }}</td>
                                <td>{{ getEquipmentText(item) }}</td>
                                <td>{{ getRoomText(item) }}</td>
                                <td>{{ item.requestDate || '-' }}</td>
                                <td>{{ item.detail }}</td>
                                <td class="status" :class="getStatusCellClass(item.statusText)">
                                    {{ item.statusText }}
                                </td>
                                <!-- ✅ คอลัมน์ใหม่: ลิงก์ไปดูรายละเอียด -->
                                <td>
                                    <span class="detail-link" @click="openDetail(item)">
                                        ดูรายละเอียด
                                    </span>
                                </td>
                                <!-- ✅ คอลัมน์ใหม่: ลบ -->
                                <td>
                                    <span class="delete-link" @click="deleteItem(item.id)">
                                        ลบ
                                    </span>
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
                                <li>{{ selectedItem.remarks || '-' }}</li>
                            </ul>
                        </div>

                        <!-- วันที่แจ้ง (ใหม่) -->
                        <div class="mb-3">
                            <strong>วันที่แจ้ง</strong>
                            <ul class="content-list">
                                <li>{{ selectedItem.requestDate || '-' }}</li>
                            </ul>
                        </div>

                        <div class="inner-actions">
                            <!-- ปุ่มไฟล์ภาพ (เพิ่มใหม่) -->
                            <button v-if="selectedItem && selectedItem.imageData" class="btn btn-file shadow-sm"
                                @click="openImageModal(selectedItem.imageData)">
                                ไฟล์ภาพ
                                <i class="bi bi-camera-fill ms-2"></i>
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
                    <h5 class="m-0">ไฟล์รูปภาพ</h5>
                    <i class="bi bi-x-circle cursor-pointer fs-4" @click="closeImageModal"></i>
                </div>
                <div class="modal-body p-5 bg-light d-flex justify-content-center align-items-center"
                    style="min-height: 300px">
                    <div class="text-center">
                        <img v-if="previewImageSrc" :src="previewImageSrc" alt="Request Image"
                            class="img-fluid shadow-sm mb-3" />
                        <p class="text-muted">
                            รูปภาพที่แนบมาพร้อมรายการแจ้งซ่อม
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>

    <!-- ================== MODAL: เพิ่มรายการแจ้งซ่อม ================== -->
    <div class="modal fade" id="createModal" tabindex="-1" aria-hidden="true" ref="modalEl">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">ระบบแจ้งซ่อม</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>

                <div class="form-container modal-body">
                    <!-- Alert แจ้งเตือน -->
                    <div v-if="showError" class="alert alert-danger d-flex align-items-center" role="alert">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                            กรุณากรอกข้อมูลให้ครบถ้วน
                        </div>
                    </div>
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

                        <!-- วันที่แจ้งซ่อม (ใหม่) -->
                        <div class="row mt-3">
                            <label class="label">วันที่แจ้งซ่อม :</label>
                            <div class="field d-flex align-items-center gap-2">
                                <input type="text" v-model="requestDate" class="form-control form-control-sm"
                                    placeholder="DD/MM/YYYY" readonly @click="openCalendar" />
                                <button type="button"
                                    class="btn btn-light border d-flex align-items-center justify-content-center"
                                    style="width: 40px; height: 38px;" @click="openCalendar">
                                    <i class="bi bi-calendar-event"></i>
                                </button>
                            </div>
                        </div>

                        <!-- รายละเอียด (Dropdown) -->
                        <div class="mt-3">
                            <label class="label">รายละเอียด :</label>
                            <div class="field">
                                <select v-model="detail" class="pill-btn form-control form-control-sm">
                                    <option value="">เลือกรายละเอียด</option>
                                    <option value="สายไฟ">สายไฟ</option>
                                    <option value="ระบบล็อกและเบรก">ระบบล็อกและเบรก</option>
                                    <option value="เตียง หลอดเอกซเรย์ และบักกี้">เตียง หลอดเอกซเรย์ และบักกี้</option>
                                    <option value="X-ray tube warm-up">X-ray tube warm-up</option>
                                    <option value="ส่วนอื่นเพิ่มเติม">ส่วนอื่นเพิ่มเติม</option>
                                </select>
                            </div>
                        </div>

                        <!-- หมายเหตุ (ใหม่) -->
                        <div class="mt-3">
                            <label class="label">หมายเหตุ :</label>
                            <div class="field">
                                <textarea v-model="remarks" class="textarea-input form-control"
                                    placeholder="เพิ่มหมายเหตุ"></textarea>
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
                                <!-- Image Preview -->
                                <div v-if="uploadedImageData" class="image-preview-container">
                                    <img :src="uploadedImageData" alt="Preview" class="image-preview" />
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

    <!-- ================== MODAL: ปฏิทิน (English) ================== -->
    <!-- z-index ต้องมากกว่า modal ปกติ (1055) -->
    <div v-if="isCalendarVisible" class="calendar-popup-overlay" @click="isCalendarVisible = false">
        <div class="calendar-popup-box" @click.stop>
            <div class="calendar-header">
                <button class="nav-btn" @click.stop="changeMonth(-1)">&lt;</button>
                <!-- แสดง เดือน (English) ปี (ค.ศ.) -->
                <span class="month-title">{{ englishMonthYear }}</span>
                <button class="nav-btn" @click.stop="changeMonth(1)">&gt;</button>
            </div>

            <div class="calendar-grid">
                <!-- วันในสัปดาห์ (English) -->
                <div v-for="d in englishWeekdays" :key="d" class="weekday">
                    {{ d }}
                </div>

                <div v-for="cell in daysGrid" :key="cell.key" class="day-cell" :class="{
                    'is-empty': !cell.day,
                    'is-today': cell.isToday,
                    'is-selected': cell.isSelected
                }" @click="cell.day ? selectDate(cell.date) : null">
                    <div class="day-number">
                        <span v-if="cell.day">{{ cell.day }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
import { Modal } from 'bootstrap'

const API_BASE = '/api/Xraycare'

const modalEl = ref(null)
let modal = null
const fileInput = ref(null)
const fileName = ref('')

const detail = ref('')
const remarks = ref('')           // หมายเหตุ (ใหม่)
const selectedEquipment = ref('')
const selectedRoom = ref('')       // ห้องตรวจ (ใหม่)
const requestDate = ref('')        // วันที่แจ้งซ่อม (ใหม่)
const selectedItem = ref(null)
const showError = ref(false) // Validation alert
const loading = ref(false)

// เพิ่มใหม่
const uploadedImageData = ref('')      // เก็บ dataURL ของรูปที่อัปโหลด
const showImageModal = ref(false)      // คุม modal รูป
const previewImageSrc = ref('')        // src ที่จะแสดงใน modal

// list อุปกรณ์ (เอาคำว่า "ห้อง X" ออกแล้ว)
const equipmentOptions = [
    'X-ray general shimazu รุ่น xxx',
    'X-ray general carestream รุ่น xxx',
    'X-ray general konica รุ่น xxx',
    'X-ray general toshiba รุ่น xxx'
]

// list ห้องตรวจ
const roomOptions = ['ห้อง 1', 'ห้อง 2', 'ห้อง 3', 'ห้อง 4']

// items จาก API
const items = ref([])

async function loadItems() {
    loading.value = true
    try {
        const res = await fetch(`${API_BASE}/GetAllRepairRequests`)
        if (!res.ok) throw new Error('โหลดรายการแจ้งซ่อมไม่สำเร็จ')
        const data = await res.json()
        items.value = Array.isArray(data) ? data : []
    } catch (e) {
        console.error(e)
        items.value = []
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadItems()

    modal = new Modal(modalEl.value, {
        backdrop: 'static'
    })
})

// ------------------- CALENDAR LOGIC (ENGLISH) -------------------
const isCalendarVisible = ref(false)
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const englishMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
const englishWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Header ปฏิทิน: December 2025 (ค.ศ.)
const englishMonthYear = computed(() => {
    return `${englishMonthNames[currentMonth.value]} ${currentYear.value}`
})

// แปลงวันที่ (Date object) -> "18/12/2025"
const formatEnglishDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${day}/${month}/${year}`
}

// Grid
const daysGrid = computed(() => {
    const cells = []
    const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
    const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

    for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push({ key: `empty-${i}`, day: null })
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentYear.value, currentMonth.value, d)

        // เช็ควันนี้
        const isToday =
            d === today.getDate() &&
            currentMonth.value === today.getMonth() &&
            currentYear.value === today.getFullYear()

        // เช็คว่าเลือกอยู่นี่ไหม (เทียบ string DD/MM/YYYY)
        const dateStr = formatEnglishDate(dateObj)
        const isSelected = (requestDate.value === dateStr)

        cells.push({
            key: `day-${d}`,
            day: d,
            date: dateObj,
            isToday,
            isSelected
        })
    }

    // เติมท้ายให้ครบ 42 ช่อง (optional)
    const totalCells = 42
    const cellsToFill = totalCells - cells.length
    for (let i = 0; i < cellsToFill; i++) {
        cells.push({ key: `empty-post-${i}`, day: null })
    }

    return cells.slice(0, 42)
})

const changeMonth = (delta) => {
    const newDate = new Date(currentYear.value, currentMonth.value + delta, 1)
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
}

const selectDate = (dateObj) => {
    requestDate.value = formatEnglishDate(dateObj)
    isCalendarVisible.value = false
}

const openCalendar = () => {
    // default to current month/year
    isCalendarVisible.value = true
}

// -------------------------------------------------------------

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
    const room = getRoomText(item)
    return room ? `${equip} ${room}` : equip
}

// เปิด modal
const openModal = () => {
    modal.show()
}

// ปิด modal
const closeModal = () => {
    showError.value = false
    modal.hide()
}

// เลือกไฟล์ภาพ + บีบอัดรูป
const onFileSelected = (event) => {
    const file = event.target.files[0]
    if (!file) {
        fileName.value = ''
        uploadedImageData.value = ''
        return
    }

    fileName.value = file.name

    // บีบอัดรูปภาพก่อนเก็บ
    const reader = new FileReader()
    reader.onload = e => {
        const img = new Image()
        img.onload = () => {
            // สร้าง canvas เพื่อ resize
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // กำหนดขนาดสูงสุด (800px)
            const maxSize = 800
            let width = img.width
            let height = img.height

            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width
                    width = maxSize
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height
                    height = maxSize
                }
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)

            // บีบอัดที่ 70% quality
            uploadedImageData.value = canvas.toDataURL('image/jpeg', 0.7)
        }
        img.src = e.target.result
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
const submitForm = async () => {
    if (!selectedEquipment.value || !selectedRoom.value || !detail.value || !requestDate.value) {
        showError.value = true
        return
    }
    showError.value = false

    try {
        const res = await fetch(`${API_BASE}/AddRepairRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                equipment: selectedEquipment.value,
                room: selectedRoom.value,
                requestDate: requestDate.value,
                detail: detail.value,
                remarks: remarks.value,
                statusText: 'รอซ่อม',
                imageData: uploadedImageData.value || null
            })
        })
        if (!res.ok) {
            const err = await res.text()
            throw new Error(err || 'บันทึกไม่สำเร็จ')
        }
        const created = await res.json()
        items.value.push(created)

        // เคลียร์ฟอร์ม
        selectedEquipment.value = ''
        selectedRoom.value = ''
        requestDate.value = ''
        detail.value = ''
        remarks.value = ''
        fileName.value = ''
        uploadedImageData.value = ''
        if (fileInput.value) {
            fileInput.value.value = ''
        }

        closeModal()
    } catch (e) {
        console.error(e)
        alert(e.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่')
    }
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

// ลบรายการแจ้งซ่อม
const deleteItem = async (id) => {
    if (!window.confirm('คุณต้องการลบรายการแจ้งซ่อมนี้ใช่หรือไม่?')) return

    try {
        const res = await fetch(`${API_BASE}/DeleteRepairRequest/${id}`, { method: 'DELETE' })
        if (!res.ok) {
            const err = await res.text()
            throw new Error(err || 'ลบไม่สำเร็จ')
        }
        items.value = items.value.filter((i) => i.id !== id)
    } catch (e) {
        console.error(e)
        alert(e.message || 'ลบไม่สำเร็จ กรุณาลองใหม่')
    }
}
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
    max-width: 100%;
    background: white;
    border-radius: 14px;
    padding: 12px 14px 16px;
    border: 1px solid #e5e7eb;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

th,
td {
    text-align: center;
    padding: 6px 4px;
}

thead tr {
    border-bottom: 1px solid #e5e7eb;
}

tbody tr:nth-child(even) {
    background: #f9fafb;
}

.status.pending {
    color: #ef4444;
    font-weight: 600;
}

.clickable-row {
    /* ไม่ต้องให้ทั้งแถวเป็น pointer แล้ว */
}

/* ✅ ลิงก์ "ดูรายละเอียด" */
.detail-link {
    color: #2563eb;
    /* น้ำเงิน */
    text-decoration: underline;
    /* ขีดเส้นใต้ */
    cursor: pointer;
    /* เมาส์เป็นรูปมือ */
}

/* ✅ ลิงก์ "ลบ" */
.delete-link {
    color: #dc2626;
    /* แดง */
    text-decoration: underline;
    cursor: pointer;
    /* เมาส์เป็นรูปมือ */
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
    background-color: rgb(229, 229, 229);
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
    background-color: white;
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
    border-radius: 6px;
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
    color: #ef4444;
    font-weight: 600;
    background-color: white;
}

.status-progress {
    color: #f59e0b;
    font-weight: 600;
    background-color: white;
}

.status-completed {
    background-color: white;
}

/* ปุ่ศไฟล์ภาพ */
.btn-file {
    background-color: white;
    border: 1px solid #00d42a;
    color: #00d42a;
    width: 140px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 6px;
    transition: 0.2s;
    cursor: pointer;
}

.btn-file i {
    color: #00d42a;
}

.btn-file:hover {
    color: #00d42a;
    background-color: white;
    border-color: #00d42a;
    transform: scale(1.1);
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

/* modal แสดงรูปภาพ – ให้อยู่ตรงกลางหน้าจอ */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.image-modal-card {
    width: 90%;
    max-width: 600px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* ================= CALENDAR STYLES (Scoped for this Page) ================= */
.calendar-popup-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2060;
    /* Higher than Bootstrap Model (1055) */
}

.calendar-popup-box {
    background: #ffffff;
    border-radius: 20px;
    padding: 16px 18px 18px;
    width: 320px;
    box-shadow:
        0 22px 50px rgba(15, 23, 42, 0.4),
        0 0 0 1px rgba(148, 163, 184, 0.4);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.month-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: #111827;
}

.nav-btn {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: none;
    background-color: #eef2ff;
    font-size: 0.85rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease, transform 0.15s ease;
}

.nav-btn:hover {
    background-color: #e0e7ff;
    transform: translateY(-1px);
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 6px;
    column-gap: 4px;
    font-size: 0.8rem;
    text-align: center;
}

.weekday {
    font-weight: 600;
    color: #6b7280;
}

.day-cell {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.day-cell.is-empty {
    pointer-events: none;
}

.day-number span {
    display: inline-flex;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}

.day-number span:hover {
    background-color: #e5e7eb;
}

/* วันนี้ */
.day-cell.is-today .day-number span {
    border: 1px solid #6366f1;
}

/* วันที่เลือก */
.day-cell.is-selected .day-number span {
    background-color: #4f46e5;
    color: #ffffff;
    transform: translateY(-1px);
}


.cursor-pointer {
    cursor: pointer;
}

.section-header button {
    padding: 6px 14px;
    font-size: 0.9rem;
}

/* Image Preview Styling */
.image-preview-container {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}

.image-preview {
    max-width: 300px;
    max-height: 300px;
    width: auto;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

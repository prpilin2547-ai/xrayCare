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
                    <table class="table repair-table">
                        <thead>
                            <tr>
                                <th class="col-no">#</th>
                                <th class="col-equip">อุปกรณ์</th>
                                <th class="col-room">ห้อง</th>
                                <th class="col-date">วันที่แจ้ง</th>
                                <th class="col-time">เวลา</th>
                                <th class="col-user">ผู้ทำ</th>
                                <th class="col-detail">รายละเอียด</th>
                                <th class="col-status">สถานะ</th>
                                <th class="col-action" colspan="2">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="activeItems.length === 0">
                                <td colspan="10" class="empty-row">
                                    <i class="bi bi-inbox"></i>
                                    <span>ไม่มีรายการแจ้งซ่อม</span>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in activeItems" :key="item.id">
                                <td class="col-no">{{ index + 1 }}</td>
                                <td class="col-equip">{{ getEquipmentText(item) }}</td>
                                <td class="col-room">{{ getRoomText(item) }}</td>
                                <td class="col-date">{{ getDisplayDate(item.requestDate) }}</td>
                                <td class="col-time">{{ getDisplayTime(item.requestDate) }}</td>
                                <td class="col-user">{{ item.reporterName || '-' }}</td>
                                <td class="col-detail">{{ item.detail }}</td>
                                <td class="col-status">
                                    <span class="status-badge" :class="getStatusCellClass(item.statusText)">
                                        {{ item.statusText }}
                                    </span>
                                </td>
                                <td class="col-action">
                                    <span class="detail-link" @click="openDetail(item)">
                                        <i class="bi bi-eye me-1"></i>ดูรายละเอียด
                                    </span>
                                </td>
                                <td class="col-action">
                                    <span class="delete-link" @click="deleteItem(item.id)">
                                        <i class="bi bi-trash3 me-1"></i>ลบ
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

                        <!-- วันที่แจ้ง -->
                        <div class="mb-3">
                            <strong>วันที่แจ้ง</strong>
                            <ul class="content-list">
                                <li>{{ getDisplayDate(selectedItem.requestDate) || '-' }}</li>
                            </ul>
                        </div>

                        <!-- เวลาที่ทำ -->
                        <div class="mb-3">
                            <strong>เวลาที่ทำ</strong>
                            <ul class="content-list">
                                <li>{{ getDisplayTime(selectedItem.requestDate) }}</li>
                            </ul>
                        </div>

                        <!-- ผู้ทำ -->
                        <div class="mb-3">
                            <strong>ผู้ทำ</strong>
                            <ul class="content-list">
                                <li>{{ selectedItem.reporterName || '-' }}</li>
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

        <!-- Image Modal -->
        <div v-if="showImageModal" class="modal-overlay" @click.self="closeImageModal">
            <div class="modal-card image-modal-card">
                <div class="image-modal-header">
                    <h5 class="image-modal-title">ไฟล์รูปภาพ</h5>
                    <button type="button" class="image-modal-close" aria-label="ปิด" @click="closeImageModal">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="image-modal-body">
                    <div class="image-modal-content">
                        <img v-if="previewImageSrc" :src="previewImageSrc" alt="Request Image" class="image-modal-img" />
                        <p class="image-modal-caption">รูปภาพที่แนบมาพร้อมรายการแจ้งซ่อม</p>
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
                                <select v-model="selectedEquipment" class="form-select form-select-sm">
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
                                <select v-model="selectedRoom" class="form-select form-select-sm">
                                    <option value="">เลือกห้องตรวจ</option>
                                    <option v-for="room in roomOptions" :key="room" :value="room">
                                        {{ room }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- วันที่แจ้งซ่อม -->
                        <div class="row mt-3">
                            <label class="label">วันที่แจ้งซ่อม :</label>
                            <div class="field">
                                <div class="date-wrapper">
                                    <input type="text" v-model="requestDate" class="form-control form-control-sm"
                                        placeholder="DD/MM/YYYY" readonly @click="openCalendar" />
                                    <button type="button" class="date-icon" @click="openCalendar">
                                        <i class="bi bi-calendar-event"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- ชื่อผู้แจ้ง (ดึงจากบัญชี user ที่ล็อกอิน) -->
                        <div class="row mt-3">
                            <label class="label">ชื่อผู้แจ้ง :</label>
                            <div class="field">
                                <input v-model="reporterName" type="text" class="form-control form-control-sm"
                                    placeholder="จากบัญชีที่ล็อกอิน" />
                            </div>
                        </div>

                        <!-- รายละเอียด (Dropdown) -->
                        <div class="mt-3">
                            <label class="label">รายละเอียด :</label>
                            <div class="field">
                                <select v-model="detail" class="form-select form-select-sm">
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
const remarks = ref('')
const selectedEquipment = ref('')
const selectedRoom = ref('')
const reporterName = ref('')
// วันที่แจ้งซ่อม — ค่าเริ่มต้นเป็นวันปัจจุบัน DD/MM/YYYY
const _now = new Date()
const _defaultDate = `${String(_now.getDate()).padStart(2, '0')}/${String(_now.getMonth() + 1).padStart(2, '0')}/${_now.getFullYear()}`
const requestDate = ref(_defaultDate)
const selectedItem = ref(null)
const showError = ref(false) // Validation alert
const loading = ref(false)

// เพิ่มใหม่
const uploadedImageData = ref('')      // เก็บ dataURL ของรูปที่อัปโหลด
const showImageModal = ref(false)      // คุม modal รูป
const previewImageSrc = ref('')        // src ที่จะแสดงใน modal

// list อุปกรณ์ (จาก API เครื่องที่ลงทะเบียน)
const machines = ref([])
const equipmentOptions = computed(() => machines.value.map(m => m.machineName))
const roomOptions = computed(() => {
    const rooms = machines.value.map(m => m.room).filter(Boolean)
    return [...new Set(rooms)]
})

// เมื่อเลือกอุปกรณ์ → กำหนดห้องตรวจอัตโนมัติ
watch(selectedEquipment, (eq) => {
    if (!eq) return
    const found = machines.value.find(m => m.machineName === eq)
    if (found && found.room) {
        selectedRoom.value = found.room
    }
})

// items จาก API
const items = ref([])

async function loadMachines() {
    try {
        const res = await fetch(`${API_BASE}/GetAllMachines`)
        if (res.ok) {
            const data = await res.json()
            machines.value = Array.isArray(data) ? data : []
        }
    } catch (e) {
        console.error('Load machines error:', e)
    }
}

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
    loadMachines()
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

// เวลาปัจจุบันในรูปแบบ HH:mm:ss (ใช้ตอนบันทึก)
const formatTimeNow = () => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

// ดึงเฉพาะวันที่จาก requestDate (DD/MM/YYYY หรือส่วนก่อนช่องว่าง)
function getDisplayDate(str) {
    if (!str || typeof str !== 'string') return '-'
    const part = str.trim().split(/\s+/)[0]
    return part || '-'
}

// ดึงเฉพาะเวลาจาก requestDate (HH:mm:ss) ถ้าไม่มีให้ 00:00:00
function getDisplayTime(str) {
    if (!str || typeof str !== 'string') return '00:00:00'
    const parts = str.trim().split(/\s+/)
    for (let i = parts.length - 1; i >= 0; i--) {
        const m = parts[i].match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
        if (m) return `${m[1].padStart(2, '0')}:${m[2]}:${(m[3] || '00').padStart(2, '0')}`
    }
    return '00:00:00'
}

// ดึงชื่อผู้ใช้ที่ล็อกอินจาก localStorage (บัญชี user)
function getLoggedInUsername() {
    try {
        const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
        return (stored && stored.username) ? String(stored.username).trim() : ''
    } catch {
        return ''
    }
}

// คำนวณ timestamp สำหรับเรียงลำดับจาก requestDate (รองรับ DD/MM/YYYY และ DD/MM/YYYY HH:mm:ss)
function parseRequestDateForSort(str) {
    if (!str || typeof str !== 'string') return 0
    const trimmed = str.trim()
    const datePart = (trimmed.split(/\s+/)[0] || trimmed).trim()
    const parts = datePart.split('/')
    if (parts.length >= 3) {
        const d = parseInt(parts[0], 10)
        const m = parseInt(parts[1], 10) - 1
        const y = parseInt(parts[2], 10)
        const yAd = y > 2400 ? y - 543 : y
        let t = new Date(yAd, m, d).getTime()
        if (isNaN(t)) return 0
        const timePart = trimmed.split(/\s+/)[1]
        const timeMatch = timePart && timePart.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
        if (timeMatch) {
            t += (parseInt(timeMatch[1], 10) * 3600 + parseInt(timeMatch[2], 10) * 60 + parseInt(timeMatch[3] || '0', 10)) * 1000
        }
        return t
    }
    return 0
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

// แสดงเฉพาะรายการที่ยังไม่ "ดำเนินการแล้ว" และเรียงจากทำล่าสุดเป็นลำดับแรก
const activeItems = computed(() => {
    const list = items.value.filter(i => i.statusText !== 'ดำเนินการแล้ว')
    return [...list].sort((a, b) => parseRequestDateForSort(b.requestDate) - parseRequestDateForSort(a.requestDate))
})

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

// เปิด modal — เติมชื่อผู้แจ้งจากบัญชี user ที่ล็อกอิน
const openModal = () => {
    reporterName.value = getLoggedInUsername()
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
        const dateTimeStr = requestDate.value.trim().includes(' ')
            ? requestDate.value
            : `${requestDate.value} ${formatTimeNow()}`
        const res = await fetch(`${API_BASE}/AddRepairRequest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                equipment: selectedEquipment.value,
                room: selectedRoom.value,
                requestDate: dateTimeStr,
                reporterName: reporterName.value?.trim() || '',
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
        requestDate.value = _defaultDate
        reporterName.value = ''
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
    padding: 12px 0 24px;
}

.page-title {
    margin: 0 0 12px;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-main, #0f172a);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main, #0f172a);
    letter-spacing: -0.02em;
}

.repair-detail-page {
    position: relative;
}

.close-modal-btn {
    margin-left: auto;
    cursor: pointer;
    color: #dc2626;
    font-size: 1.4rem;
    transition: color 150ms, transform 150ms;
}

.close-modal-btn:hover {
    color: #b91c1c;
    transform: scale(1.08);
}

.table-wrapper {
    border-radius: 16px;
    overflow-x: auto;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06);
    background: #fff;
    -webkit-overflow-scrolling: touch;
}

.repair-table {
    width: 100%;
    min-width: 960px;
    border-collapse: collapse;
    font-size: 0.84rem;
}

.repair-table thead {
    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

.repair-table th {
    padding: 14px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
}

.repair-table td {
    padding: 12px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
}

.repair-table tbody tr {
    transition: background 120ms ease;
}

.repair-table tbody tr:hover {
    background: #f8fafc;
}

.repair-table tbody tr:last-child td {
    border-bottom: none;
}

/* Column widths */
.col-no { width: 44px; text-align: center; }
.col-equip { min-width: 140px; }
.col-room { width: 64px; text-align: center; }
.col-date { width: 106px; text-align: center; white-space: nowrap; font-variant-numeric: tabular-nums; }
.col-time { width: 80px; text-align: center; white-space: nowrap; font-variant-numeric: tabular-nums; }
.col-user { width: 110px; }
.col-detail { min-width: 130px; }
.col-status { width: 120px; text-align: center; }
.col-action { white-space: nowrap; text-align: center; }

.empty-row {
    text-align: center;
    padding: 48px 16px !important;
    color: #94a3b8;
    font-size: 0.92rem;
}
.empty-row i { font-size: 1.8rem; display: block; margin-bottom: 6px; }

/* Status badge */
.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.73rem;
    font-weight: 600;
    white-space: nowrap;
    line-height: 1.4;
}

.status-badge.status-waiting { background: #fef2f2; color: #dc2626; }
.status-badge.status-progress { background: #fff7ed; color: #ea580c; }
.status-badge.status-completed { background: #f0fdf4; color: #16a34a; }

/* Action links */
.detail-link {
    display: inline-flex;
    align-items: center;
    color: #0EA5E9;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: color 150ms;
}

.detail-link:hover {
    color: #0369A1;
    text-decoration: underline;
}

.delete-link {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 8px;
    border: 1px solid #fecaca;
    background: #fef2f2;
    color: #dc2626;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 150ms;
}

.delete-link:hover {
    background: #fee2e2;
    border-color: #fca5a5;
}

.page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.dot-blue,
.blue-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--info, #3b82f6);
    margin-right: 10px;
}

.repair-detail-page .page-title {
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0;
}

.main-box {
    border: 1px solid var(--border-soft, #e2e8f0);
    background: var(--bg-card, #fff);
    border-radius: var(--radius-lg, 16px);
    overflow: hidden;
    box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
    transition: box-shadow 200ms;
}

.box-header {
    padding: 16px 20px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: #fff;
    font-weight: 700;
    display: flex;
    min-height: 60px;
}

.header-label {
    width: 120px;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    padding: 10px;
    color: #fff;
}

.header-value {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    font-weight: 500;
    color: #fff;
}

.box-body {
    background: var(--bg-card, #fff);
    padding: 30px;
    position: relative;
    min-height: 300px;
}

ul.content-list {
    list-style-type: none;
    padding-left: 10px;
}

ul.content-list li::before {
    content: '•';
    color: var(--purple-main, #0369A1);
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}

.inner-actions {
    position: absolute;
    bottom: 30px;
    right: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
}

.btn-status-base {
    border-radius: var(--radius-full, 9999px);
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    min-width: 180px;
    padding: 0 25px;
    white-space: nowrap;
    pointer-events: none;
    font-size: 0.85rem;
}

/* สีปุ่มสถานะในหน้ารายละเอียด (ให้ตรงกับ RequestEN) */
.btn-status-base.status-waiting {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
}

.btn-status-base.status-progress {
    background: #fff7ed;
    color: #ea580c;
    border: 1px solid #fed7aa;
}

.btn-status-base.status-completed {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #86efac;
}

/* (status badge styles moved above into .status-badge) */

.btn-file {
    background: #fff;
    border: 1px solid var(--purple-soft, #0EA5E9);
    color: var(--purple-main, #0369A1);
    width: 140px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border-radius: var(--radius-sm, 8px);
    transition: all var(--transition-fast, 150ms);
    cursor: pointer;
}

.btn-file i {
    color: var(--purple-main, #0369A1);
}

.btn-file:hover {
    background: #E0F2FE;
    transform: translateY(-1px);
}

.file-name {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.file-link {
    text-decoration: underline;
    cursor: pointer;
    color: var(--purple-soft, #0EA5E9);
}

.file-remove {
    border: none;
    background: none;
    color: var(--text-muted, #94a3b8);
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
}

/* overlay รูปภาพต้องอยู่เหนือ modal ระบบแจ้งซ่อม (Bootstrap ~1050) */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(6px);
    z-index: 2070;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.image-modal-card {
    background: var(--bg-card, #fff);
    border-radius: var(--radius-xl, 20px);
    overflow: hidden;
    box-shadow: 0 24px 56px rgba(0, 0, 0, 0.22);
    max-width: 90vw;
    max-height: 90vh;
    width: 100%;
    border: 1px solid var(--border-soft, #e2e8f0);
    display: flex;
    flex-direction: column;
}

/* หัว modal รูปภาพ - สีเขียวแบบเดิม */
.image-modal-header {
    background: #198754;
    color: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.image-modal-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.image-modal-close {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    transition: background 150ms, transform 150ms;
}

.image-modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.image-modal-body {
    padding: 24px;
    background: #f8fafc;
    min-height: 200px;
    max-height: calc(90vh - 120px);
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-modal-content {
    text-align: center;
    width: 100%;
}

.image-modal-img {
    max-width: 100%;
    max-height: min(400px, 60vh);
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: var(--radius-md, 12px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    margin-bottom: 16px;
}

.image-modal-caption {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-secondary, #64748b);
}

.calendar-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(4px);
    z-index: 2060;
    display: flex;
    justify-content: center;
    align-items: center;
}

.calendar-popup-box {
    background: var(--bg-card, #fff);
    border-radius: var(--radius-xl, 20px);
    padding: 20px;
    width: 340px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    border: 1px solid var(--border-soft, #e2e8f0);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.month-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-main, #0f172a);
}

.nav-btn {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm, 8px);
    border: 1px solid var(--border-soft, #e2e8f0);
    background: #fff;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast, 150ms);
}

.nav-btn:hover {
    background: #f1f5f9;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    font-size: 0.8rem;
    text-align: center;
}

.weekday {
    font-weight: 700;
    color: var(--text-muted, #94a3b8);
    font-size: 0.65rem;
    text-transform: uppercase;
    padding-bottom: 8px;
}

.day-cell {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-sm, 8px);
    cursor: pointer;
    transition: all var(--transition-fast, 150ms);
}

.day-cell.is-empty {
    pointer-events: none;
}

.day-cell:not(.is-empty):hover {
    background: #f1f5f9;
}

.day-number span {
    display: inline-flex;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 500;
}

.day-cell.is-today .day-number span {
    border: 2px solid var(--purple-main, #0369A1);
    color: var(--purple-main, #0369A1);
    font-weight: 700;
}

.day-cell.is-selected .day-number span {
    background: linear-gradient(135deg, #0369A1, #0EA5E9);
    color: #fff;
    box-shadow: 0 2px 8px rgba(3,105,161,0.35);
}

.date-wrapper {
    display: flex;
    align-items: center;
    border-radius: var(--radius-sm, 8px);
    border: 1px solid var(--border-soft, #e2e8f0);
    padding-right: 6px;
    background: var(--bg-card, #fff);
}

.date-wrapper input {
    border: none;
    flex: 1;
    padding: 10px 14px;
    font-size: 0.85rem;
    background: transparent;
}

.date-wrapper input:focus {
    box-shadow: none;
    outline: none;
}

.date-icon {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.1rem;
    color: var(--text-muted, #94a3b8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.date-icon:hover {
    color: var(--text-main, #0f172a);
}

.cursor-pointer {
    cursor: pointer;
}

.section-header button {
    padding: 8px 16px;
    font-size: 0.85rem;
}

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
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
}

@media (max-width: 1024px) {
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .table { min-width: 600px; }
}
@media (max-width: 640px) {
  .section-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .main-box { border-radius: 12px; }
  .box-body { padding: 14px; }
  .content-list .item { flex-direction: column; gap: 4px; }
  .inner-actions { flex-direction: column; gap: 8px; }
  .btn-file, .btn-status-base { width: 100%; text-align: center; }
  .modal-overlay .modal-card { width: calc(100vw - 24px); padding: 16px; }
  .form-group label { font-size: 0.8rem; }
  .form-group input, .form-group textarea, .form-group select { font-size: 0.82rem; }
}
</style>

<template>
    <MainLayout>
        <div class="page">
            <!-- ================== VIEW 1 : ตารางระบบแจ้งซ่อม ================== -->
            <div v-if="!selectedItem">
                <!-- หัวข้อระบบแจ้งซ่อม + ปุ่มบวก -->
                <div class="section-header">
                    <span class="section-title">ระบบแจ้งซ่อม</span>
                    <button type="button" class="btn-add" @click="openModal">
                        <span class="plus-icon">＋</span>
                    </button>
                </div>

                <!-- ตารางแจ้งซ่อม -->
                <div class="table-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ลำดับ</th>
                                <th>อุปกรณ์</th>
                                <th>รายละเอียด</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in activeItems" :key="item.id" class="clickable-row"
                                @click="openDetail(item)">
                                <!-- ใช้ index + 1 เป็นลำดับแทน id -->
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.equipment }}</td>
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
                <!-- ปุ่มกากบาทสีแดง มุมขวาบน (ข้อ 2) -->
                <button class="btn-close-detail" @click="closeDetail">×</button>

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
                        <div class="header-value">{{ selectedItem.equipment }}</div>
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

                        <!-- แสดงสถานะ (อ่านอย่างเดียว) -->
                        <div class="inner-actions">
                            <div class="status-display">
                                <div class="btn-status-base shadow-sm" :class="detailStatusClass">
                                    {{ selectedItem.statusText }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ================== END VIEW 2 ================== -->
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
                                    {{ fileName }}
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
const selectedItem = ref(null)

// list อุปกรณ์
const equipmentOptions = [
    'X-ray general รุ่น xxx ห้อง 1',
    'X-ray general รุ่น yyyy ห้อง 2',
    'X-ray general รุ่น zzzz ห้อง 3',
    'X-ray general รุ่น aaaa ห้อง 4'
]

// default ข้อมูลเริ่มต้นในตาราง
const defaultItems = [
    {
        id: 1,
        equipment: 'X-ray general รุ่น xxx ห้อง 1',
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

// แสดงเฉพาะรายการที่ยังไม่ "ดำเนินการแล้ว" (ข้อ 1)
const activeItems = computed(() =>
    items.value.filter(i => i.statusText !== 'ดำเนินการแล้ว')
)

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
    fileName.value = file ? file.name : ''
}

// เปิดหน้ารายละเอียดเมื่อคลิกในตาราง
const openDetail = (item) => {
    selectedItem.value = item
}

// ปิดหน้ารายละเอียดด้วยปุ่มกากบาท (ข้อ 2)
const closeDetail = () => {
    selectedItem.value = null
}

// เพิ่มข้อมูลใหม่ + กลับไปตาราง
const submitForm = () => {
    if (!selectedEquipment.value || !detail.value) {
        return
    }

    const newId = items.value.length
        ? Math.max(...items.value.map(i => i.id)) + 1
        : 1

    items.value.push({
        id: newId,
        equipment: selectedEquipment.value,
        detail: detail.value,
        statusText: 'รอซ่อม' // สถานะเริ่มต้น
    })

    // เคลียร์ฟอร์ม
    selectedEquipment.value = ''
    detail.value = ''
    fileName.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }

    closeModal()
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

.btn-add {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: none;
    background: #ef4444;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.plus-icon {
    font-size: 1rem;
    line-height: 1;
}

/* ปุ่มกากบาทสีแดงบนหน้ารายละเอียด (ข้อ 2) */
.repair-detail-page {
    position: relative;
}

.btn-close-detail {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: none;
    background: #ef4444;
    color: #ffffff;
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
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
    /* กดไม่ได้ */
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
</style>
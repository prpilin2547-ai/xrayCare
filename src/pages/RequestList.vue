<template>
    <MainLayout>
        <div class="page">
            <!-- ชื่อหน้า -->


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
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.id }}</td>
                            <td>{{ item.equipment }}</td>
                            <td>{{ item.detail }}</td>
                            <td class="status pending">{{ item.statusText }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </MainLayout>

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
                                <select class="pill-btn form-control form-control-sm">
                                    <option>เลือกอุปกรณ์</option>
                                    <option>X-ray general รุ่น xxx ห้อง 1</option>
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

                                <!-- input file ซ่อน -->
                                <input ref="fileInput" type="file" accept="image/*" class="hidden-file form-control"
                                    @change="onFileSelected" />

                                <!-- แสดงชื่อไฟล์ -->
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'
import { Modal } from 'bootstrap'

const router = useRouter()
const modalEl = ref(null)
let modal = null
const fileInput = ref(null)
const fileName = ref('')
const detail = ref('')
const form = reactive({
    title: '',
    detail: ''
})

onMounted(() => {
    modal = new Modal(modalEl.value, {
        backdrop: 'static'
    })
})

const openModal = () => {
    modal.show()
}

const closeModal = () => {
    modal.hide()
}

const submitForm = () => {
    console.log("ข้อมูลที่บันทึก:", form)

    form.title = ''
    form.detail = ''

    closeModal()
}

// ข้อมูลตัวอย่างในตาราง
const items = ref([
    {
        id: 1,
        equipment: 'X-ray general รุ่น xxx ห้อง 1',
        detail: 'ระบบล็อกและเบรก',
        statusText: 'รอซ่อม'
    }
])

const goToCreate = () => {
    router.push('/requests/new') // ไปหน้าแบบฟอร์มแจ้งซ่อม
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
</style>

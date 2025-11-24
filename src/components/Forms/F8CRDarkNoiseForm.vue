<!-- src/components/forms/F8CRDarkNoiseForm.vue -->
<template>
    <div class="card shadow-sm">
        <div class="card-body">
            <h5 class="card-title mb-1">
                แบบบันทึก F8-1 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR
            </h5>
            <!-- <p class="text-muted mb-3">ความถี่ : ทุก 6 เดือน</p> -->

            <!-- ตาราง -->
            <div class="table-responsive mb-3">
                <table class="table table-bordered table-sm align-middle mb-0">
                    <thead class="table-light text-center small">
                        <!-- แถวหัวบนสุด -->
                        <tr>
                            <th rowspan="3">IP no.</th>
                            <th rowspan="3">IP size</th>
                            <th rowspan="3">ID</th>
                            <th rowspan="3">Type</th>
                            <th rowspan="3">EI/S</th>
                            <th colspan="8">ROI 80%</th>
                            <th colspan="2">การแปรผล (P/F)</th>
                        </tr>
                        <!-- แถวหัว ROI / การแปรผล -->
                        <tr>
                            <th colspan="4">PV</th>
                            <th colspan="4">PVSD</th>
                            <th rowspan="2">PV</th>
                            <th rowspan="2">PVSD</th>
                        </tr>
                        <!-- แถวเลข 1-6 / mean -->
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>mean</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>mean</th>
                        </tr>
                        <tr>
                        </tr>
                    </thead>

                    <tbody class="small">
                        <tr v-for="row in formarr" :key="row.id">
                            <td><input v-model="row.ipNo" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.ipSize" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.imageId" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.type" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.eis" class="form-control form-control-sm" /></td>

                            <td><input v-model="row.pv1" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pv2" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pv3" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pvMean" class="form-control form-control-sm" /></td>

                            <td><input v-model="row.pvsd4" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pvsd5" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pvsd6" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.pvsdMean" class="form-control form-control-sm" /></td>

                            <td><input v-model="row.resultPv" class="form-control form-control-sm" /></td>
                            <td><input v-model="row.resultPvsd" class="form-control form-control-sm" /></td>
                            <td><button @click="delrow(row.id)"><i class="fa-solid fa-trash"></i></button></td>
                        </tr>
                        <tr>
                            <td><input v-model="form.ipNo" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.ipSize" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.imageId" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.type" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.eis" class="form-control form-control-sm" /></td>

                            <td><input v-model="form.pv1" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pv2" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pv3" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pvMean" class="form-control form-control-sm" /></td>

                            <td><input v-model="form.pvsd4" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pvsd5" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pvsd6" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.pvsdMean" class="form-control form-control-sm" /></td>

                            <td><input v-model="form.resultPv" class="form-control form-control-sm" /></td>
                            <td><input v-model="form.resultPvsd" class="form-control form-control-sm" /></td>
                            <td><button @click="addform">เพิ่มอุปกรณ์</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- หมายเหตุ + ปุ่มถัดไป (ใต้ textarea, ขวาสุด) -->
            <div class="mt-3">
                <label class="form-label small mb-1">หมายเหตุ</label>
                <textarea
                    v-model="remark"
                    rows="2"
                    class="form-control form-control-sm mb-3"
                    placeholder="บันทึกรายละเอียดเพิ่มเติม..."
                ></textarea>

                <div class="mt-2">
          <label class="form-label small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
          <input
            type="file"
            class="form-control form-control-sm"
            @change="onFileChange"
          />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>
      </div> <br>

                <div class="d-flex justify-content-end">
                    <!-- ปุ่มถัดไป สีเหลือง -->
                    <button class="btn btn-warning btn-sm fw-semibold" @click="submitNext">
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    initial: Object,
    currentUserName: String
})

const formarr = ref([]);
const emit = defineEmits(['next'])
const form = ({
    ipNo: '',
    ipSize: '',
    imageId: '',
    type: '',
    eis: '',
    pv1: '',
    pv2: '',
    pv3: '',
    pvMean: '',
    pvsd4: '',
    pvsd5: '',
    pvsd6: '',
    pvsdMean: '',
    resultPv: '',
    resultPvsd: ''
})

const addform = () => {
    formarr.value.push({
        id: formarr.value.length + 1,
        ipNo: form.ipNo,
        ipSize: form.ipSize,
        imageId: form.imageId,
        type: form.type,
        eis: form.eis,
        pv1: form.pv1,
        pv2: form.pv2,
        pv3: form.pv3,
        pvMean: form.pvMean,
        pvsd4: form.pvsd4,
        pvsd5: form.pvsd5,
        pvsd6: form.pvsd6,
        pvsdMean: form.pvsdMean,
        resultPv: form.resultPv,
        resultPvsd: form.resultPvsd
    });
    resetform();
};

const resetform = () => {
    form.ipNo = '';
    form.ipSize = '';
    form.imageId = '';
    form.type = '';
    form.eis = '';
    form.pv1 = '';
    form.pv2 = '';
    form.pv3 = '';
    form.pvMean = '';
    form.pvsd4 = '';
    form.pvsd5 = '';
    form.pvsd6 = '';
    form.pvsdMean = '';
    form.resultPv = '';
    form.resultPvsd = '';
}

const remark = ref('')

const delrow = (id) => {
    formarr.value = formarr.value.filter(row => row.id !== id);
};

// ส่งข้อมูลไป MonthlyCheckAll เพื่อไป F8-2
const submitNext = () => {
    emit('next', form.value)
}
</script>

<!-- src/components/forms/F8CRDarkNoiseForm.vue -->
<template>
    <div class="card shadow-sm">
        <div class="card-body">
            <h5 class="card-title mb-1">
                แบบบันทึก F8-1 : การทดสอบสัญญาณรบกวนมืด (Dark Noise) ระบบ CR
            </h5>
            <!-- <p class="text-muted mb-3">ความถี่ : ทุก 6 เดือน</p> -->

            <!-- ตาราง -->
            <div class="table-responsive mb-3 cr-table-wrap">
                <table class="table table-bordered table-sm align-middle mb-0 cr-noise-table">
                    <colgroup>
                      <col class="col-ip-no" />
                      <col class="col-ip-size" />
                      <col class="col-id" />
                      <col class="col-type" />
                      <col class="col-eis" />
                      <col class="col-val" />
                      <col class="col-val" />
                      <col class="col-val" />
                      <col class="col-mean" />
                      <col class="col-val" />
                      <col class="col-val" />
                      <col class="col-val" />
                      <col class="col-mean" />
                      <col class="col-pf" />
                      <col class="col-pf" />
                      <col class="col-action" />
                    </colgroup>
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
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
    initial: Object,
    currentUserName: String
})

const formarr = ref([]);
const emit = defineEmits(['next'])
const form = ref({
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
        ipNo: form.value.ipNo,
        ipSize: form.value.ipSize,
        imageId: form.value.imageId,
        type: form.value.type,
        eis: form.value.eis,
        pv1: form.value.pv1,
        pv2: form.value.pv2,
        pv3: form.value.pv3,
        pvMean: form.value.pvMean,
        pvsd4: form.value.pvsd4,
        pvsd5: form.value.pvsd5,
        pvsd6: form.value.pvsd6,
        pvsdMean: form.value.pvsdMean,
        resultPv: form.value.resultPv,
        resultPvsd: form.value.resultPvsd
    });
    resetform();
};

const resetform = () => {
    form.value.ipNo = '';
    form.value.ipSize = '';
    form.value.imageId = '';
    form.value.type = '';
    form.value.eis = '';
    form.value.pv1 = '';
    form.value.pv2 = '';
    form.value.pv3 = '';
    form.value.pvMean = '';
    form.value.pvsd4 = '';
    form.value.pvsd5 = '';
    form.value.pvsd6 = '';
    form.value.pvsdMean = '';
    form.value.resultPv = '';
    form.value.resultPvsd = '';
}

const remark = ref('')

const delrow = (id) => {
    formarr.value = formarr.value.filter(row => row.id !== id);
};

// โหลดข้อมูลจาก initial (เมื่อกลับมาแก้ไขหรือเปิด record ที่บันทึกแล้ว)
function loadInitial () {
  const data = props.initial
  if (!data) return
  if (Array.isArray(data.rows) && data.rows.length) {
    formarr.value = data.rows.map((r, i) => ({
      id: i + 1,
      ipNo: r.ipNo ?? '',
      ipSize: r.ipSize ?? '',
      imageId: r.imageId ?? '',
      type: r.type ?? '',
      eis: r.eis ?? '',
      pv1: r.pv1 ?? '',
      pv2: r.pv2 ?? '',
      pv3: r.pv3 ?? '',
      pvMean: r.pvMean ?? '',
      pvsd4: r.pvsd4 ?? '',
      pvsd5: r.pvsd5 ?? '',
      pvsd6: r.pvsd6 ?? '',
      pvsdMean: r.pvsdMean ?? '',
      resultPv: r.resultPv ?? '',
      resultPvsd: r.resultPvsd ?? ''
    }))
  }
}
onMounted(loadInitial)
watch(() => props.initial, loadInitial, { deep: true })

// ส่งข้อมูลไป MonthlyCheckAll เพื่อไป F8-2 (ส่งทุกแถว: แถวที่เพิ่มแล้ว + แถวปัจจุบัน)
const submitNext = () => {
    const allRows = [...formarr.value]
    const current = { ...form.value }
    if (current.ipNo || current.imageId || current.pv1 || current.pv2 || current.pv3 || current.pvsd4 || current.pvsd5 || current.pvsd6) {
        allRows.push(current)
    }
    emit('next', { rows: allRows })
}

const attachmentFileName = ref('')
const onFileChange = (e) => {
  const file = e.target.files[0]
  attachmentFileName.value = file ? file.name : ''
}
</script>

<style scoped>
.cr-table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.cr-noise-table {
  min-width: 1100px;
  table-layout: fixed;
}

.cr-noise-table th,
.cr-noise-table td {
  text-align: center;
  vertical-align: middle;
  padding: 6px 4px;
}

.cr-noise-table th {
  white-space: nowrap;
  font-size: 0.78rem;
}

/* column widths */
.cr-noise-table colgroup col.col-ip-no    { width: 70px; }
.cr-noise-table colgroup col.col-ip-size  { width: 70px; }
.cr-noise-table colgroup col.col-id       { width: 70px; }
.cr-noise-table colgroup col.col-type     { width: 70px; }
.cr-noise-table colgroup col.col-eis      { width: 65px; }
.cr-noise-table colgroup col.col-val      { width: 65px; }
.cr-noise-table colgroup col.col-mean     { width: 68px; }
.cr-noise-table colgroup col.col-pf       { width: 55px; }
.cr-noise-table colgroup col.col-action   { width: 80px; }

.cr-noise-table td input.form-control {
  width: 100%;
  min-width: 0;
  padding: 4px 5px;
  font-size: 0.82rem;
  text-align: center;
  box-sizing: border-box;
}

.cr-noise-table td input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.cr-noise-table td input[type="number"]::-webkit-inner-spin-button,
.cr-noise-table td input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.cr-noise-table td button {
  white-space: nowrap;
  font-size: 0.78rem;
  padding: 4px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  cursor: pointer;
  transition: background 0.15s;
}

.cr-noise-table td button:hover {
  background: #e5e7eb;
}
</style>

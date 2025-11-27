<template>
  <!-- หน้าโล่ง ไม่มีเมนู มีแค่ปุ่ม Print + A4 -->
  <div class="print-root">
    <!-- ปุ่มพิมพ์ (จะหายไปตอนสั่ง Print) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F10
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ส่วนหัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F10 : แบบบันทึกการตรวจสอบความสว่างแสงไฟ
          </div>
          <div class="title-sub">
            ความถี่ : ทุก 1 เดือน
          </div>
        </div>

        <!-- ข้อมูลเครื่อง / หน่วยงาน -->
        <div class="meta-block">
          <div class="meta-row">
            วันที่
            <span class="underline long">{{ record.date }}</span>
            ประเภทเครื่องฉายแสง
            <span class="underline long">{{ record.deviceType }}</span>
          </div>

          <div class="meta-row">
            หน่วยงาน
            <span class="underline mid">{{ record.department }}</span>
            ตำแหน่ง
            <span class="underline short">{{ record.location }}</span>
            อำเภอ
            <span class="underline short">{{ record.district }}</span>
            จังหวัด
            <span class="underline short">{{ record.province }}</span>
          </div>

          <div class="meta-row">
            เครื่องหมายเรียกชื่อ
            <span class="underline mid">{{ record.deviceName }}</span>
            Model
            <span class="underline short">{{ record.model }}</span>
            S/N
            <span class="underline short">{{ record.serialNo }}</span>
          </div>

          <div class="meta-row">
            Application
            <span class="underline long">{{ record.application }}</span>
          </div>

          <div class="meta-row">
            Calibration
            <span class="underline long">{{ record.calibration }}</span>
          </div>
        </div>

        <!-- ตารางค่าความสว่าง -->
        <table class="f10-table">
          <thead>
            <tr>
              <th class="col-run" rowspan="2">ครั้งที่</th>
              <th class="col-illum-group" colspan="5">
                ความสว่างแสงไฟ (lx)
              </th>
              <th class="col-bg" rowspan="2">
                Background (lx)
              </th>
            </tr>
            <tr>
              <th v-for="p in 5" :key="'head-point-' + p" class="col-point">
                จุดที่ {{ p }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(run, rIndex) in record.runs" :key="'run-' + rIndex">
              <td class="col-run">
                {{ run.runNo || rIndex + 1 }}
              </td>

              <td
                v-for="(val, pIndex) in run.points"
                :key="'run-' + rIndex + '-p-' + pIndex"
                class="col-point"
              >
                {{ val }}
              </td>

              <td class="col-bg">
                {{ run.background }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ส่วนคำนวณ IAV / IBG / ILBD -->
        <div class="formula-block">
          <div class="formula-row">
            I<sub>AV</sub> :
            <span class="underline formula">
              {{ record.iav }}
            </span>
            lx
          </div>

          <div class="formula-row">
            I<sub>BG(AV)</sub> :
            <span class="underline formula">
              {{ record.ibg }}
            </span>
            lx
          </div>

          <div class="formula-row">
            I<sub>LBD</sub> = I<sub>AV</sub> - I<sub>BG(AV)</sub> =
            <span class="underline formula-wide">
              {{ record.ilbd }}
            </span>
            lx
          </div>
        </div>

        <!-- ลายเซ็นผู้ทดสอบ -->
        <div class="signature-block">
          <div class="sig-row">
            ลงชื่อ
            <span class="underline sig-line">{{ record.testerName }}</span>
            ผู้ทดสอบ
          </div>
          <div class="sig-row">
            (
            <span class="underline sig-line">
              {{ record.testerFullName }}
            </span>
            )
          </div>
          <div class="sig-row">
            ตำแหน่ง
            <span class="underline sig-line">
              {{ record.testerPosition }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ---------------------------
// โครงข้อมูลหัวฟอร์ม + ตาราง (ดึงจริงจาก backend ทีหลัง)
// ---------------------------
const record = ref({
  date: '',             // วันที่ตรวจ
  deviceType: '',       // ประเภทเครื่องฉายแสง
  department: '',       // หน่วยงาน
  location: '',         // ตำแหน่งติดตั้ง
  district: '',         // อำเภอ
  province: '',         // จังหวัด
  deviceName: '',       // เครื่องหมายเรียกชื่อ
  model: '',            // รุ่น
  serialNo: '',         // หมายเลขเครื่อง
  application: '',      // การใช้งาน
  calibration: '',      // ข้อมูลการสอบเทียบ

  // ตารางค่าความสว่าง 3 ครั้ง
  runs: [
    { runNo: 1, points: ['', '', '', '', ''], background: '' },
    { runNo: 2, points: ['', '', '', '', ''], background: '' },
    { runNo: 3, points: ['', '', '', '', ''], background: '' }
  ],

  // ค่า IAV, IBG, ILBD
  iav: '',
  ibg: '',
  ilbd: '',

  // ผู้ทดสอบ
  testerName: '',
  testerFullName: '',
  testerPosition: ''
})

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id

  // ✳️ ตัวอย่างการดึงข้อมูลจาก backend (ปรับ URL / โครง JSON ให้ตรงระบบจริง)
  //
  // const res = await fetch(`/api/print/f10/${id}`)
  // const data = await res.json()
  // record.value = {
  //   date: data.date,
  //   deviceType: data.deviceType,
  //   department: data.department,
  //   location: data.location,
  //   district: data.district,
  //   province: data.province,
  //   deviceName: data.deviceName,
  //   model: data.model,
  //   serialNo: data.serialNo,
  //   application: data.application,
  //   calibration: data.calibration,
  //   runs: data.runs,         // [{ runNo, points:[...], background }, ...]
  //   iav: data.iav,
  //   ibg: data.ibg,
  //   ilbd: data.ilbd,
  //   testerName: data.testerName,
  //   testerFullName: data.testerFullName,
  //   testerPosition: data.testerPosition
  // }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ใช้ TH Sarabun ทั้งหน้า */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลังนอก */
.print-root {
  background: #111827;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม print */
.print-toolbar {
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 16px;
}

/* แผ่น A4 */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 180mm;
  padding: 18mm 0 14mm;
  font-size: 14pt;
}

/* หัวฟอร์ม */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

.title-sub {
  font-size: 16pt;
}

/* meta block */
.meta-block {
  margin-left: 10mm;
  margin-bottom: 6mm;
  font-size: 14pt;
}

.meta-row {
  margin-bottom: 3mm;
}

/* เส้นสำหรับกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.long {
  min-width: 55mm;
}

.mid {
  min-width: 40mm;
}

.short {
  min-width: 28mm;
}

/* ตาราง F10 */
.f10-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
  margin-bottom: 10mm;
}

.f10-table th,
.f10-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: center;
}

.col-run {
  width: 18mm;
}

.col-illum-group {
  text-align: center;
}

.col-point {
  width: 20mm;
}

.col-bg {
  width: 26mm;
}

/* block ค่าคำนวณ */
.formula-block {
  margin-left: 10mm;
  margin-bottom: 10mm;
  font-size: 14pt;
}

.formula-row {
  margin-bottom: 2mm;
}

.formula {
  min-width: 40mm;
}

.formula-wide {
  min-width: 60mm;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 10mm;
  text-align: right;
  font-size: 14pt;
}

.sig-row {
  margin-bottom: 3mm;
}

.sig-line {
  min-width: 60mm;
}

/* สไตล์ตอนพิมพ์ */
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  .print-toolbar {
    display: none;
  }

  .print-root {
    background: #ffffff;
    padding: 0;
  }

  .sheet-a4 {
    box-shadow: none;
    width: auto;
    min-height: auto;
  }
}
</style>

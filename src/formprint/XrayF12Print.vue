<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นเท่านั้น -->
  <div class="print-root">
    <!-- ปุ่มสั่งพิมพ์ (จะไม่แสดงตอน print) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F12
      </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ
          </div>
          <div class="title-sub">
            ความถี่ : ทุก 1 เดือน
          </div>
        </div>

        <!-- ข้อมูลหัวกระดาษ -->
        <div class="meta-block">
          <div class="meta-row">
            <span>สถานพยาบาล</span>
            <span class="fill-line">{{ header.hospital }}</span>
            <span class="meta-gap">หน่วยงาน</span>
            <span class="fill-line">{{ header.department }}</span>
          </div>
          <div class="meta-row">
            <span>เดือน / ปี</span>
            <span class="fill-line">{{ header.monthYear }}</span>
          </div>
          <div class="meta-row">
            <span>เครื่องเอกซเรย์ยี่ห้อ</span>
            <span class="fill-line">{{ header.machineBrand }}</span>
            <span class="meta-gap">รุ่น</span>
            <span class="fill-line short">{{ header.machineModel }}</span>
            <span class="meta-gap">หมายเลขเครื่อง S/N</span>
            <span class="fill-line short">{{ header.machineSn }}</span>
          </div>
          <div class="meta-row">
            <span>Application</span>
            <span class="fill-line">{{ header.application }}</span>
          </div>
          <div class="meta-row">
            <span>Calibration</span>
            <span class="fill-line">{{ header.calibration }}</span>
          </div>
        </div>

        <!-- ตารางสาเหตุการถ่ายภาพซ้ำ -->
        <table class="f12-table">
          <thead>
            <tr>
              <th class="col-reason">สาเหตุจากรูปภาพทางรังสีซ้ำ</th>
              <th class="col-count">จำนวนครั้ง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reason in reasons" :key="reason.code">
              <td class="align-left">
                {{ reason.code }} {{ reason.text }}
              </td>
              <td class="align-center">
                {{ reason.count }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- สรุปจำนวน / อัตราการถ่ายซ้ำ -->
        <div class="summary-block">
          <div class="summary-row">
            <span>รวม</span>
            <span class="fill-line short">
              {{ summary.totalRepeat }}
            </span>
            <span>ครั้ง</span>
          </div>
          <div class="summary-row">
            <span>จำนวนภาพทั้งหมดที่ถ่าย</span>
            <span class="fill-line short">
              {{ summary.totalExams }}
            </span>
            <span>ครั้ง</span>
          </div>
          <div class="summary-row">
            <span>อัตราการถ่ายซ้ำ</span>
            <span class="fill-line short">
              {{ summary.repeatRate }}
            </span>
            <span>%</span>
          </div>
        </div>

        <!-- ช่องอธิบายรายละเอียด / ข้อเสนอแนะ -->
        <div class="comment-block">
          <div class="comment-title">ข้อเสนอแนะ :</div>
          <div class="comment-line">
            {{ summary.commentLine1 }}
          </div>
          <div class="comment-line">
            {{ summary.commentLine2 }}
          </div>
        </div>

        <!-- หมายเหตุ (ข้อความคงที่ตาม PDF) -->
        <div class="note-block">
          <div class="note-title">หมายเหตุ</div>
          <div class="note-line">
            * ขยายความสาเหตุภาพการถ่ายซ้ำแบบก่อให้เกิดภาพ (Image Artifact) อาจแบ่งเป็น 4 สาเหตุได้ดังนี้
          </div>
          <div class="note-line">
            1. ระบบคอมพิวเตอร์ (Detector)
          </div>
          <div class="note-line">
            2. วัสดุแปลกปลอม (Foreign object) เช่น เครื่องประดับ เสื้อผ้า กลุ่มอุปกรณ์
          </div>
          <div class="note-line">
            3. สารทึบรังสี (contrast media)
          </div>
          <div class="note-line">
            4. วัสดุแปลกปลอมจากอุปกรณ์ในการตรวจ เช่น เตียงตรวจ/Support/X-ray tube
          </div>
        </div>

        <!-- ลายเซ็นผู้ทดสอบ -->
        <div class="sign-block">
          <div class="sign-row">
            ลงชื่อ ................................................................. ผู้ทดสอบ
          </div>
          <div class="sign-row">
            ( {{ footer.testerName }} )
          </div>
          <div class="sign-row">
            ตำแหน่ง ............................................................
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// ข้อมูลหัวฟอร์ม (จะถูกแทนที่ด้วยข้อมูลจากฐาน)
const header = ref({
  hospital: "",
  department: "",
  monthYear: "",
  machineBrand: "",
  machineModel: "",
  machineSn: "",
  application: "",
  calibration: ""
});

// ตารางสาเหตุ (1–9) + จำนวนครั้ง
const reasons = ref([
  { code: "1.", text: "การจัดท่าผู้ป่วย (Positioning)", count: "" },
  { code: "2.", text: "การตั้งค่าเวลา / ปริมาณรังสีผิด (Exposure error)", count: "" },
  { code: "3.", text: "ความผิดพลาดของกริ๊ด (Grid error)", count: "" },
  { code: "4.", text: "ความผิดพลาดของระบบภาพ (System error)", count: "" },
  { code: "5.", text: "สิ่งแปลกปลอมในภาพ (Artifact)", count: "" },
  { code: "6.", text: "การเคลื่อนไหวของผู้ป่วย (Patient motion)", count: "" },
  { code: "7.", text: "ภาพทดสอบ (Test image)", count: "" },
  { code: "8.", text: "ยกเลิกภาพ (Study canceled)", count: "" },
  { code: "9.", text: "อื่น ๆ", count: "" }
]);

// ส่วนสรุป
const summary = ref({
  totalRepeat: "",
  totalExams: "",
  repeatRate: "",
  commentLine1: "",
  commentLine2: ""
});

// ส่วนท้ายฟอร์ม
const footer = ref({
  testerName: ""
});

// ปุ่มพิมพ์
function handlePrint() {
  window.print();
}

// โหลดข้อมูลจริงจาก backend
onMounted(async () => {
  const id = route.params.id;

  // ตัวอย่างโครง API – แก้ URL / ชื่อฟิลด์ให้ตรงกับ backend ของคุณ
  /*
  const res = await fetch(`/api/forms/f12/${id}`);
  const data = await res.json();

  header.value = {
    hospital: data.header.hospital,
    department: data.header.department,
    monthYear: data.header.monthYear,
    machineBrand: data.header.machineBrand,
    machineModel: data.header.machineModel,
    machineSn: data.header.machineSn,
    application: data.header.application,
    calibration: data.header.calibration
  };

  reasons.value = data.reasons;      // ต้องเป็น array 1–9 เหมือนกัน
  summary.value = data.summary;
  footer.value = { testerName: data.testerName };
  */
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap");

/* ใช้ TH Sarabun ทั้งหน้า */
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
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

/* A4 */
.sheet-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 0 4mm rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
}

.sheet-inner {
  width: 180mm;
  padding: 18mm 0 14mm;
  font-size: 14pt;
}

/* Header */
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
  margin-bottom: 6mm;
  font-size: 14pt;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4mm;
  margin-bottom: 2mm;
}

.fill-line {
  border-bottom: 0.4pt solid #000;
  min-width: 35mm;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.fill-line.short {
  min-width: 25mm;
}

.meta-gap {
  margin-left: 4mm;
}

/* ตารางหลัก */
.f12-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
  margin-bottom: 6mm;
}

.f12-table th,
.f12-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
}

.col-reason {
  width: 75%;
}

.col-count {
  width: 25%;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

/* สรุป */
.summary-block {
  margin-bottom: 6mm;
  font-size: 14pt;
}

.summary-row {
  margin-bottom: 2mm;
}

/* ข้อเสนอแนะ */
.comment-block {
  margin-bottom: 6mm;
  font-size: 14pt;
}

.comment-title {
  margin-bottom: 2mm;
}

/* หมายเหตุ */
.note-block {
  margin-bottom: 10mm;
  font-size: 13pt;
}

.note-title {
  font-weight: 700;
  margin-bottom: 2mm;
}

.note-line {
  line-height: 1.2;
}

/* ลายเซ็น */
.sign-block {
  margin-top: 8mm;
  text-align: center;
  font-size: 14pt;
}

.sign-row {
  margin-bottom: 2mm;
}

/* การพิมพ์ */
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

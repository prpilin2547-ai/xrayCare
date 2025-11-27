<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นเท่านั้น -->
  <div class="print-root">
    <!-- ปุ่มสั่งพิมพ์ (จะไม่แสดงตอน print) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          style="margin-right:6px;"
        >
          <path
            d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"
          />
        </svg>
        Print
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

        <!-- บล็อก metadata -->
        <div class="meta-block">
          <!-- แถว 1 : สถานพยาบาล เต็มบรรทัด -->
          <div class="meta-row">
            <div class="meta-side meta-side-full">
              <span>สถานพยาบาล</span>
              <span class="fill-line">{{ header.hospital }}</span>
            </div>
          </div>

          <!-- แถว 2 : ผู้บันทึก ↔ ตำแหน่ง -->
          <div class="meta-row">
            <div class="meta-side">
              <span>ผู้บันทึก</span>
              <span class="fill-line">{{ header.recorder }}</span>
            </div>
            <div class="meta-side">
              <span>ตำแหน่ง</span>
              <span class="fill-line">{{ header.position }}</span>
            </div>
          </div>

          <!-- แถว 3 : ห้องตรวจ ↔ อาคาร -->
          <div class="meta-row">
            <div class="meta-side">
              <span>ห้องตรวจ</span>
              <span class="fill-line">{{ header.room }}</span>
            </div>
            <div class="meta-side">
              <span>อาคาร</span>
              <span class="fill-line">{{ header.building }}</span>
            </div>
          </div>

          <!-- แถว 4 : ตั้งแต่วันที่ ↔ ถึง -->
          <div class="meta-row">
            <div class="meta-side">
              <span>ตั้งแต่วันที่</span>
              <span class="fill-line">{{ header.fromDate }}</span>
            </div>
            <div class="meta-side">
              <span>ถึง</span>
              <span class="fill-line">{{ header.toDate }}</span>
            </div>
          </div>

          <!-- แถว 5 : อัตราการถ่ายซ้ำ ↔ อัตราการถ่ายซ้ำครั้งที่แล้ว -->
          <div class="meta-row">
            <div class="meta-side">
              <span>อัตราการถ่ายซ้ำ (%)</span>
              <span class="fill-line">{{ header.repeatRate }}</span>
            </div>
            <div class="meta-side">
              <span>อัตราการถ่ายซ้ำครั้งที่แล้ว (%)</span>
              <span class="fill-line">{{ header.previousRepeatRate }}</span>
            </div>
          </div>
        </div>

        <!-- ตารางสาเหตุการถ่ายภาพซ้ำ + รวม / จำนวนภาพ / อัตราการถ่ายซ้ำ -->
        <table class="f12-table">
          <thead>
            <tr>
              <th class="col-reason">สาเหตุการปฏิเสธภาพ/การถ่ายซ้ำ</th>
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

            <!-- แถวสรุปในตาราง (ตัวบางปกติ) -->
            <tr class="summary-row-table">
              <td class="align-left">รวม</td>
              <td class="align-center">
                {{ summary.totalRepeat }}
              </td>
            </tr>
            <tr class="summary-row-table">
              <td class="align-left">จำนวนภาพทั้งหมดที่ถ่าย</td>
              <td class="align-center">
                {{ summary.totalExams }}
              </td>
            </tr>
            <tr class="summary-row-table">
              <td class="align-left">อัตราการถ่ายซ้ำ</td>
              <td class="align-center">
                {{ summary.repeatRate }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ข้อเสนอแนะ: เส้นจุด 3 บรรทัด -->
        <div class="comment-block">
          <div class="comment-title">
            ข้อเสนอแนะ............................................................................................................................................................................................................
          </div>
          <div class="comment-dot-line">
            .................................................................................................................................................................................................................................
          </div>
          <div class="comment-dot-line">
            .................................................................................................................................................................................................................................
          </div>
        </div>

        <!-- หมายเหตุ (ข้อความใหม่) -->
        <div class="note-block">
          <div class="note-title">หมายเหตุ</div>
          <div class="note-line">
            * ขยายความสาเหตุการเกิดสิ่งแปลกปลอมในภาพ (Image Artifact) อาจแบ่งเป็น 4 สาเหตุได้ดังนี้
          </div>
          <div class="note-line">
            ก. ระบบถ่ายภาพ (Detector)
          </div>
          <div class="note-line">
            ข. วัตถุแปลกปลอม (Foreign object) เช่น เครื่องประดับ กระดุม กุญแจ
          </div>
          <div class="note-line">
            ค. สารเพิ่มคอนทราส (contrast media)
          </div>
          <div class="note-line">
            ง. จากเตียงตรวจ อุปกรณ์ช่วยถ่ายภาพ หรือจากหลอดเอกซเรย์ (Table/support/x-ray tube)
          </div>
        </div>

        <!-- ลายเซ็นผู้ทดสอบ (ชิดขวา & กึ่งกลางกัน) -->
        <div class="sign-block">
          <div class="sign-inner">
            <div class="sign-row sign-row-name">
              ลงชื่อ ................................................................. ผู้ทดสอบ
            </div>
            <div class="sign-row sign-row-parenthesis">
              (..................................................................)
            </div>
            <div class="sign-row sign-row-position">
              ตำแหน่ง ............................................................
            </div>
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
  recorder: "",
  room: "",
  fromDate: "",
  toDate: "",
  repeatRate: "",
  position: "",
  building: "",
  previousRepeatRate: ""
});

// ตารางสาเหตุ (1–9) + จำนวนครั้ง (ตามข้อความใหม่)
const reasons = ref([
  { code: "1.", text: "การจัดท่าผู้ป่วย (Positioning)", count: "" },
  { code: "2.", text: "ปริมาณรังสีที่ไม่เหมาะสม (Exposure error)", count: "" },
  { code: "3.", text: "ความผิดพลาดของกริด (Grid error)", count: "" },
  { code: "4.", text: "ความผิดพลาดของระบบ (System error)", count: "" },
  { code: "5.", text: "สิ่งแปลกปลอมในภาพ* (Artifact)", count: "" },
  { code: "6.", text: "การเคลื่อนไหวของผู้ป่วย (Patient motion)", count: "" },
  { code: "7.", text: "การทดสอบภาพ (Test image)", count: "" },
  { code: "8.", text: "ยกเลิกเคส (Study canceled)", count: "" },
  { code: "9.", text: "อื่นๆ", count: "" }
]);

// ส่วนสรุป (ใช้ในแถวท้ายตาราง)
const summary = ref({
  totalRepeat: "",
  totalExams: "",
  repeatRate: ""
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
  if (!id) return;

  // fetch ของจริงค่อยมาเติมภายหลัง
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap");

/* ฟอนต์: TH Sarabun New > Tahoma > sans-serif */
* {
  font-family: "TH Sarabun New", Tahoma, sans-serif !important;
}

.print-root {
  background: #e5e7eb;   /* เทาอ่อนแบบภาพที่หนึ่ง */
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
  font-size: 16pt; /* โครงหน้าทั้งหมด 16 pt */
  line-height: 1.2;
}

/* Header – ชิดซ้ายและระยะห่างเท่ากันกับบรรทัด metadata */
.header-main {
  text-align: left;
  margin-bottom: 2mm;   /* ระยะระหว่าง "ความถี่" กับ "สถานพยาบาล" */
}

.title-main {
  font-weight: 700;
  margin-bottom: 2mm;   /* ระยะระหว่าง "แบบบันทึก F12" กับ "ความถี่" */
  font-size: 16pt;
}

.title-sub {
  font-size: 16pt;
}

/* meta block */
.meta-block {
  margin-bottom: 6mm;
  font-size: 15pt;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 8mm;
  margin-bottom: 2mm;   /* ให้ทุกบรรทัด metadata ห่างเท่ากัน */
}

.meta-side {
  display: flex;
  align-items: flex-end;
  gap: 3mm;
  width: 50%;
}

.meta-side-full {
  width: 100%;
}

.fill-line {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
  flex: 1;              /* เส้นยืดเต็มความกว้างฝั่งของตัวเอง */
}

/* ไม่ใช้ความยาวพิเศษแล้ว ให้สไตล์เหมือนกันทุกเส้น */
.fill-line.short {
  flex: 1;
}

/* ตารางหลัก */
.f12-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt;
  margin-bottom: 6mm;
}

.f12-table th,
.f12-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
}

/* ทำให้ "จำนวนครั้ง" อยู่กึ่งกลางช่องแน่นอน */
.col-reason {
  width: 75%;
  text-align: left;
}

.col-count {
  width: 25%;
  text-align: center;
}

.align-left {
  text-align: left;
  padding-left: 3mm; /* ให้ข้อความทั้ง 9 ข้อเริ่มในแนวเดียวกัน */
}

.align-center {
  text-align: center;
}

/* แถวสรุปให้ตัวบางปกติ */
.summary-row-table td {
  font-weight: 400;
}

/* ข้อเสนอแนะ */
.comment-block {
  margin-bottom: 6mm;
  font-size: 14pt;
}

.comment-title {
  margin-bottom: 2mm;
}

.comment-dot-line {
  margin-bottom: 1.5mm;
}

/* หมายเหตุ */
.note-block {
  margin-bottom: 10mm;
  font-size: 14pt;
}

.note-title {
  font-weight: 400;  /* ✅ ไม่เป็นตัวหนาแล้ว */
  margin-bottom: 2mm;
}

.note-line {
  line-height: 1.2;
}

/* ลายเซ็น - ชิดขวา & กล่องเดียวกัน */
.sign-block {
  margin-top: 8mm;
  display: flex;
  justify-content: flex-end;
  font-size: 16pt;
}

.sign-inner {
  text-align: left;
}

.sign-row {
  margin-bottom: 2mm;
}

/* บรรทัดวงเล็บยังขยับเล็กน้อยได้ถ้าอยากให้ตรง "อ." ของคำว่า ชื่อ เป๊ะ */
.sign-row-parenthesis {
  text-indent: 8mm;
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


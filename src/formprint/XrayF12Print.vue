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
    <div class="sheet-inner sheet-inner--flow">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ
          </div>
          <div class="title-sub">
            <span class="freq-label">ความถี่ :</span>
            <span class="freq-value">ทุก 1 เดือน</span>
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
            <tr v-for="(reason, idx) in reasons" :key="reason.code">
              <td class="align-left">
                {{ reason.code }} {{ reason.text }}{{ reason.code === '9.' && formData.otherText ? ' (' + formData.otherText + ')' : '' }}
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

        <!-- ข้อเสนอแนะ: แสดง remark จาก jsonData -->
        <div class="comment-block">
          <div class="comment-title">
            ข้อเสนอแนะ....................................................................................................................................
          </div>
          <div class="comment-dot-line">
            {{ formData.remark || '........................................................................................' }}
          </div>
          <div class="comment-dot-line">
            ........................................................................................................................................................
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
              ลงชื่อ .................................................. ผู้ทดสอบ
            </div>
            <div class="sign-row sign-row-parenthesis">
              (....................................................)
            </div>
            <div class="sign-row sign-row-position">
              ตำแหน่ง ................................................
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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

// โครงสร้าง jsonData ตัวอย่าง: { reason, otherText, remark }
const formData = ref({
  reason: "",
  otherText: "",
  remark: ""
});

// รหัส reason จาก jsonData → ดัชนีแถว (0–8)
const REASON_CODE_TO_INDEX = {
  positioning: 0,
  exposureError: 1,
  gridError: 2,
  systemError: 3,
  artifact: 4,
  patientMotion: 5,
  testImage: 6,
  studyCanceled: 7,
  other: 8
};

// ตารางสาเหตุ (1–9) + จำนวนครั้ง
const reasonRows = [
  { code: "1.", text: "การจัดท่าผู้ป่วย (Positioning)", key: "positioning" },
  { code: "2.", text: "ปริมาณรังสีที่ไม่เหมาะสม (Exposure error)", key: "exposureError" },
  { code: "3.", text: "ความผิดพลาดของกริด (Grid error)", key: "gridError" },
  { code: "4.", text: "ความผิดพลาดของระบบ (System error)", key: "systemError" },
  { code: "5.", text: "สิ่งแปลกปลอมในภาพ* (Artifact)", key: "artifact" },
  { code: "6.", text: "การเคลื่อนไหวของผู้ป่วย (Patient motion)", key: "patientMotion" },
  { code: "7.", text: "การทดสอบภาพ (Test image)", key: "testImage" },
  { code: "8.", text: "ยกเลิกเคส (Study canceled)", key: "studyCanceled" },
  { code: "9.", text: "อื่นๆ", key: "other" }
];

// แถวสาเหตุ + จำนวนครั้ง (ตาม formData.reason จาก jsonData)
const reasons = computed(() => {
  const selected = String(formData.value.reason || "").trim();
  const idx = REASON_CODE_TO_INDEX[selected];
  return reasonRows.map((r, i) => ({
    code: r.code,
    text: r.text,
    count: idx === i ? 1 : ""
  }));
});

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

const API_BASE = '/api/Xraycare';

/** อ่าน jsonData ตัวอย่าง: { reason, otherText, remark } และรองรับ header/reasons/summary แบบเก่า */
function applyRecordData(data) {
  if (!data) return;
  if (data.checkDate) header.value.fromDate = data.checkDate;
  if (data.tester) header.value.recorder = data.tester;
  if (data.room) header.value.room = data.room;

  const raw = data.jsonData;
  if (raw === undefined || raw === null) return;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed.reason !== undefined) formData.value.reason = parsed.reason;
    if (parsed.otherText !== undefined) formData.value.otherText = parsed.otherText;
    if (parsed.remark !== undefined) formData.value.remark = parsed.remark;
    if (parsed.header && typeof parsed.header === "object") Object.assign(header.value, parsed.header);
    if (Array.isArray(parsed.reasons)) {
      const withCountIndex = parsed.reasons.findIndex((x) => x.count != null && x.count !== "");
      if (withCountIndex >= 0 && reasonRows[withCountIndex]) formData.value.reason = reasonRows[withCountIndex].key;
    }
    if (parsed.summary && typeof parsed.summary === "object") Object.assign(summary.value, parsed.summary);
    if (parsed.footer && typeof parsed.footer === "object") Object.assign(footer.value, parsed.footer);
  } catch (_) {}
}

onMounted(async () => {
  const id = route.query.id || route.params.id;
  const stateRecord = history.state?.record;

  if (stateRecord && (stateRecord.formType === "F12" || stateRecord.jsonData)) {
    applyRecordData(stateRecord);
    return;
  }

  if (!id) return;
  try {
    const res = await fetch(`${API_BASE}/GetChecklistRecord/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    applyRecordData(data);
  } catch (e) {
    console.error("Load checklist record error:", e);
  }
});
</script>

<style src="./printLayout.css"></style>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap");

/* ฟอนต์: TH Sarabun New และฐานทั้งหน้า 11pt */
* {
  font-family: "TH Sarabun New", Tahoma, sans-serif !important;
  font-size: 16pt;
}

/* Header */
.header-main {
  text-align: left;
  margin-bottom: 2mm;
}

/* คำว่า "แบบบันทึก F12 : ..." ให้เป็น 13pt */
.title-main {
  font-weight: 700;
  margin-bottom: 2mm;
  font-size: 18pt;
}

/* ความถี่ = 11pt */
.title-sub {
  font-size: 16pt;
}

/* meta block */
.meta-block {
  margin-bottom: 6mm;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 8mm;
  margin-bottom: 2mm;
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
  flex: 1;
}

/* ตารางหลัก */
.f12-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 6mm;
}

.f12-table th,
.f12-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
}

/* ทำให้ "จำนวนครั้ง" อยู่กึ่งกลาง */
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
  padding-left: 3mm;
}

.align-center {
  text-align: center;
}

/* แถวสรุปตัวบาง */
.summary-row-table td {
  font-weight: 400;
}

/* ข้อเสนอแนะ */
.comment-block {
  margin-bottom: 6mm;
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
}

.note-title {
  font-weight: 400;
  margin-bottom: 2mm;
}

.note-line {
  line-height: 1.2;
}

/* ลายเซ็น */
.sign-block {
  margin-top: 8mm;
  display: flex;
  justify-content: flex-end;
}

.sign-inner {
  text-align: left;
}

.sign-row {
  margin-bottom: 2mm;
}

/* ขยับวงเล็บได้ถ้าต้องการจูนเพิ่ม */
.sign-row-parenthesis {
  text-indent: 8mm;
}

/* ความถี่ : ตัวหนา */
.freq-label {
  font-weight: 700;
}

/* ทุก 1 เดือน : ตัวบาง */
.freq-value {
  font-weight: 400;
}

@media print {
  .print-root {
    background: #fff;
  }

  .f12-table th, .f12-table td { border: 1px solid #000 !important; }

  .meta-block,
  .f12-table,
  .comment-block,
  .note-block,
  .sign-block {
    page-break-inside: avoid;
  }
}
</style>

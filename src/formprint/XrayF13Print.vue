<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นอย่างเดียว -->
  <div class="print-root">
    <!-- ปุ่ม Print (หายตอนสั่งพิมพ์) -->
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
      <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"/>
    </svg>
      Print
    </button>
    </div>

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ===== หัวฟอร์ม ===== -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวนด์ : B-mode QC Test
          </div>
        </div>

        <!-- ข้อมูลเครื่อง / ผู้ตรวจ -->
        <div class="machine-block">
          <div class="machine-row">
            ยี่ห้อ <span class="underline long"></span>
            รุ่น <span class="underline long"></span>
            ผู้ตรวจสอบ <span class="underline long"></span>
          <br>
          </div>
          <div class="machine-row">
            แผนก/กลุ่มงาน <span class="underline long"></span>
            อุณหภูมิห้อง <span class="underline long"></span>
            ความชื้นห้อง <span class="underline long"></span>
          <br>
          </div> 
          <div class="machine-row">
            Probe ชนิด <span class="underline long"></span>
            ความถี่ <span class="underline long"></span>
            Phantom <span class="underline long"></span>
          <br>
          </div>
          <div class="machine-row">
            Power <span class="underline long"></span>
            TGC <span class="underline long"></span>
            Gain <span class="underline long"></span>
          </div>
        </div>

        <table class="qc-table">
  <thead>
    <tr>
      <th>Test Date</th>
      <th>baseline</th>
      <th></th>
      <th></th>
      <th></th>
      <th>Action level</th>
      <th>Defect level</th>
    </tr>
  </thead>

  <tbody>
  <!-- แถว 1 เป็น header จึงเริ่มกำหนดจากแถวที่ 2 -->

  <!-- แถว 2 -->
  <tr>
    <td>Image Uniformity</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 3 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 4 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 5 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 6 -->
  <tr>
    <td>Depth of Penetration (cm)</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 7 -->
  <tr>
    <td>Vertical Distance Accuracy Actual distance………………………….mm</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 8 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 9 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 10 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 11 -->
  <tr>
    <td>Horizontal Distance Accuracy Actual distance………………………….mm</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 12 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 13 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 14 -->
  <tr>
    <td>Lateral Resolution Pin depth: Near=………..… mm, Mid=………..…… mm, Far=…..……… mm</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 15 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 16 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 17 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 18 -->
  <tr>
    <td>Axial Resolution</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 19 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 20 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 21 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 22 -->
  <tr>
    <td>Image Geometry (Cyst Imaging) Actual diameter………………….mm</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 23 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 24 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 25 -->
  <tr>
    <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 26 -->
  <tr>
    <td>No. of Gray Scale Objects</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>

  <!-- แถว 27 -->
  <tr>
    <td>Dead zone (mm)</td>
    <td></td><td></td><td></td><td></td><td></td><td></td>
  </tr>
</tbody>
</table>

        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ข้อมูลหัวฟอร์ม (จะถูกแทนที่ด้วยข้อมูลจากฐาน)
const header = ref({
  frequencyLabel: 'ตามกำหนดการ QC',
  probeInfo: '',
  phantom: '',
  power: '',
  tgc: '',
  gain: '',
  testDate: ''
})

/**
 * ตารางหัวข้อทดสอบ
 * baseline / action / defect อันนี้ตั้งค่า default ให้เหมือนในฟอร์ม
 * ถ้าฐานข้อมูลคุณเก็บเป็น field แยก สามารถ map มาใส่แทนได้
 */
const tests = ref([
  // Image uniformity
  {
    id: 'image-uniformity',
    isGroup: true,
    label: 'Image Uniformity',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'iu-vertical',
    label: 'Vertical band (ซ้าย–ขวา), Horizontal band (บน–ล่าง), Artifacts',
    baseline: 'ไม่พบ band ผิดปกติเมื่อเทียบกับการตั้งค่าอ้างอิง',
    actionLevel: 'ความแตกต่าง ≤ 4 dB หรือมี band เล็กน้อยจาก baseline',
    defectLevel: 'ความแตกต่าง ≥ 6 dB หรือ band ชัดเจน ต้องส่งซ่อม'
  },

  // Depth of penetration
  {
    id: 'depth-group',
    isGroup: true,
    label: 'Depth of penetration',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'depth-row',
    label: 'ความลึกการมองเห็นสูงสุดที่ยังเห็นโครงสร้างได้ชัดเจน',
    baseline: 'ค่าความลึกจากการทดสอบครั้งแรก (Baseline)',
    actionLevel: 'แตกต่างจาก baseline ≤ 6 mm',
    defectLevel: 'แตกต่างจาก baseline ≥ 10 mm'
  },

  // Vertical distance accuracy
  {
    id: 'vda-group',
    isGroup: true,
    label: 'Vertical distance accuracy',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'vda-rows',
    label: 'วัดจากตำแหน่ง pin ในแนวตั้ง (เช่น Pin 1–3, 3–5, 6–8)',
    baseline: 'ค่าระยะห่างตามที่ phantom กำหนด',
    actionLevel: 'ความคลาดเคลื่อน ±1.5 mm หรือ 1.5%',
    defectLevel: 'ความคลาดเคลื่อน ≥2 mm หรือ ≥2%'
  },

  // Horizontal distance accuracy
  {
    id: 'hda-group',
    isGroup: true,
    label: 'Horizontal distance accuracy',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'hda-rows',
    label: 'วัดจากตำแหน่ง pin ในแนวนอน (Near / Far)',
    baseline: 'ค่าระยะห่างตามที่ phantom กำหนด',
    actionLevel: 'ความคลาดเคลื่อน ±2.0 mm หรือ 2%',
    defectLevel: 'ความคลาดเคลื่อน ≥3.0 mm หรือ 3%'
  },

  // Lateral resolution
  {
    id: 'lat-group',
    isGroup: true,
    label: 'Lateral resolution',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'lat-rows',
    label: 'ประเมินความสามารถแยกวัตถุด้านข้างที่ระดับความลึกต่าง ๆ (Near / Mid / Far)',
    baseline: 'ความกว้างของจุดทดสอบตามการทดสอบ baseline',
    actionLevel: 'ค่ากว้างเพิ่มขึ้นเล็กน้อยเมื่อเทียบกับ baseline',
    defectLevel: 'ค่ากว้างเพิ่มขึ้นชัดเจนจนกระทบต่อการวินิจฉัย'
  },

  // Axial resolution
  {
    id: 'ax-group',
    isGroup: true,
    label: 'Axial resolution',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'ax-rows',
    label: 'การแยกวัตถุในแนวลึก (Near / Mid / Far)',
    baseline: 'ค่าความละเอียดตาม baseline',
    actionLevel: 'Action level : 1 mm',
    defectLevel: 'Defect level : ≥2 mm'
  },

  // Image geometry
  {
    id: 'geo-group',
    isGroup: true,
    label: 'Image geometry (รูปทรงภาพ)',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'geo-row',
    label: 'ตรวจสอบว่าภาพไม่เบี้ยว / ไม่ยืด / สัดส่วนความสูง–ความกว้างถูกต้อง',
    baseline: 'ไม่มี distortion หรือเพียงเล็กน้อย',
    actionLevel: 'เริ่มมี distortion แต่ยังไม่เกินเกณฑ์ (เช่น Height/Width ผิด ≤ 20%)',
    defectLevel: 'ความผิดเพี้ยนชัดเจน เช่น Height/Width ผิด > 20%'
  },

  // No. of gray scale objects / Dead zone
  {
    id: 'gray-group',
    isGroup: true,
    label: 'No. of gray scale objects / Dead zone',
    baseline: '',
    actionLevel: '',
    defectLevel: ''
  },
  {
    id: 'gray-row',
    label: 'ตรวจจำนวน step ของ gray scale ที่มองเห็น และ dead zone บริเวณใกล้ผิว phantom',
    baseline: 'จำนวนบันไดระดับเทาและ dead zone ตาม baseline',
    actionLevel: 'มีการเปลี่ยนแปลงเล็กน้อยแต่ยังอยู่ในเกณฑ์ยอมรับได้',
    defectLevel: 'จำนวน step หายไปมากหรือ dead zone ลึกเกินเกณฑ์มาตรฐาน'
  }
])

function handlePrint () {
  window.print()
}

onMounted(async () => {
  const id = route.params.id

  // ตัวอย่างการดึงข้อมูลจาก backend (ปรับ URL / โครง response ตามระบบจริงของคุณ)
  // try {
  //   const res = await fetch(`/api/print/f13/${id}`)
  //   const data = await res.json()
  //
  //   header.value = {
  //     frequencyLabel: data.header.frequencyLabel,
  //     probeInfo: data.header.probeInfo,
  //     phantom: data.header.phantom,
  //     power: data.header.power,
  //     tgc: data.header.tgc,
  //     gain: data.header.gain,
  //     testDate: data.header.testDate
  //   }
  //
  //   // ถ้า backend มีรายละเอียด baseline / action / defect แยกของแต่ละ test
  //   // สามารถ map เข้ามาแทนค่าเริ่มต้นใน tests ได้
  //   // ตัวอย่าง:
  //   // tests.value = data.tests
  // } catch (e) {
  //   console.error('โหลดข้อมูล F13 ไม่สำเร็จ', e)
  // }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์ทั้งหน้า = 11pt */
* {
  font-family: "TH Sarabun New", "Sarabun", Tahoma, sans-serif !important;
  font-size: 11pt;
  font-weight: 400;
}

/* ===== พื้นหลัง & ปุ่ม ===== */
.print-root {
  background: #e5e7eb;   /* เทาอ่อนแบบภาพที่หนึ่ง */
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.print-toolbar {
  margin-bottom: 16px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
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
  width: 185mm;
  padding: 18mm 0 16mm;
  /* ใช้ฟอนต์ 11pt จาก * */
}

/* Header */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

/* << ตัวเดียวที่ใหญ่กว่า = 13pt >> */
.title-main {
  font-weight: 700;
  font-size: 13pt;   /* ยกเว้นหัวข้อนี้ */
  margin-bottom: 2mm;
}

/* ที่เหลือกลับมาใช้ 11pt (มาจาก * อยู่แล้ว) */
.title-sub {
  /* ไม่ต้องกำหนด font-size เพิ่ม */
}

/* ข้อมูลเครื่อง */
.machine-block {
  margin-bottom: 6mm;
}

.machine-row {
  margin-bottom: 2mm;
}

.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 5mm;
  padding: 0 2mm;
  display: inline-block;
}
.underline.short {
  min-width: 25mm;
}
.underline.long {
  min-width: 45mm;
}

/* ตาราง QC */
.qc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin-bottom: 6mm;
}

.qc-table th,
.qc-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1.5mm;
  vertical-align: top;
}

.col-test {
  width: 35%;
}
.col-baseline {
  width: 23%;
}
.col-action {
  width: 21%;
}
.col-defect {
  width: 21%;
}

.align-left {
  text-align: left;
}

.group-row td {
  background: #f3f4f6;
  font-weight: 700;
}

.group-title {
  font-weight: 700;
}

/* หมายเหตุ */
.note-block {
  margin-bottom: 10mm;
}

.note-line {
  border-bottom: 0.4pt solid #000;
  height: 6mm;
  margin-top: 1mm;
}

/* ลายเซ็น */
.signature-block {
  margin-top: 6mm;
}

.signature-line {
  margin-bottom: 3mm;
}

/* โหมดพิมพ์ */
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

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
        <div class="header-main align-with-table">
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
  <tr class="force-left">
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

<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    Image Uniformity
  </td>
</tr>


<tr>
  <td>Vertical band (y/n)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- คอลัมน์ 6 : Action level (ผสานแถว 3–4) -->
  <td rowspan="2">
    ≥ 4 dB or any change<br>
    from baseline
  </td>

  <!-- คอลัมน์ 7 : Defect level (ผสานแถว 3–4) -->
  <td rowspan="2">
    ≥ 6 dB or any change<br>
    from baseline
  </td>
</tr>


<tr>
  <td>Horizontal band (y/n)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6 และ 7 -->
</tr>

<tr>
  <td>Artifacts (y/n)</td>
  <td></td><td></td><td></td><td></td><td></td><td></td>
</tr>

<tr>
  <td><strong>Depth of Penetration (cm)</strong></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- คอลัมน์ที่ 6 : Action level -->
  <td>± 6 mm</td>

  <!-- คอลัมน์ที่ 7 : Defect level -->
  <td>± 10 mm</td>
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
  <strong>Vertical Distance Accuracy</strong>
  Actual distance………………………….mm
</td>
</tr>


<tr>
  <td>(Pin 1-3) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- คอลัมน์ที่ 6 : Action level (rowspan 3) -->
  <td rowspan="3">± 1.5 mm or 1.5%</td>

  <!-- คอลัมน์ที่ 7 : Defect level (rowspan 3) -->
  <td rowspan="3">± 2.0 mm or 2%</td>
</tr>


<tr>
  <td>(Pin 3-5) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Pin 6-8) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Horizontal Distance Accuracy</strong>
    Actual distance………………………….mm
  </td>
</tr>


<tr>
  <td>(Near) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- คอลัมน์ 6 -->
  <td rowspan="2">± 2.0 mm or 2%</td>

  <!-- คอลัมน์ 7 -->
  <td rowspan="2">± 3.0 mm or 3%</td>
</tr>

<tr>
  <td>(Far) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
</tr>



<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Lateral Resolution</strong>
    Pin depth: Near=………..… mm, Mid=………..…… mm, Far=…..……… mm
  </td>
</tr>

<tr>
  <td>(Near) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 15–17 -->
  <td colspan="2" rowspan="3">
    width &lt;1.5 mm, freq ≥ 5 MHz<br>
    width &lt;3 mm, 3.5 ≤ freq &lt; 5 MHz<br>
    width ≤4 mm, freq &lt; 3.5 MHz
  </td>
</tr>


<tr>
  <td>(Mid) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่ต้องมี td คอลัมน์ 6–7 -->
</tr>

<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    Axial Resolution
  </td>
</tr>

<tr>
  <td>(Near) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 19–21 -->
  <td colspan="2" rowspan="3">
    <strong>Action level:</strong> 1 mm<br>
    or 2 mm if freq &lt; 4 MHz<br>
    <strong>Defect level &gt;1 mm</strong>
  </td>
</tr>


<tr>
  <td>(Mid) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Measured (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="text-align:left;">
    <strong>Image Geometry (Cyst Imaging)</strong>
    Actual diameter………………….mm
  </td>
</tr>

<tr>
  <td>(Near) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- ผสานคอลัมน์ 6–7 และแถว 23–25 -->
  <td colspan="2" rowspan="3">
    Major distortion or any change from baseline<br>
    Height/Width ≥20%
  </td>
</tr>


<tr>
  <td>(Mid) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td>(Far) Cyst: Height / Width<br>
      Image quality (normal/noise)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <!-- ❌ ไม่มี td คอลัมน์ 6–7 -->
</tr>


<tr>
  <td colspan="7" style="font-weight:700; text-align:left;">
    No. of Gray Scale Objects
  </td>
</tr>

<tr>
  <td>Dead zone (mm)</td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>

  <!-- ผสานคอลัมน์ที่ 6 และ 7 -->
  <td colspan="2">
    7 mm; freq 3 MHz<br>
    5 mm; 3 MHz &lt; freq &lt; 7 MHz<br>
    3 mm; freq 7 MHz
  </td>
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
  font-size: 16pt;
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
  font-size: 18pt;   /* ยกเว้นหัวข้อนี้ */
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
  min-width: 35mm;
}
.qc-table thead th {
  font-weight: 700;
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

.qc-table td:first-child,
.qc-table th:first-child {
  width: 50mm !important;
  max-width: 50mm !important;
  min-width: 50mm !important;
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

/* เพิ่มความกว้าง Action level */
.qc-table th:nth-child(6),
.qc-table td:nth-child(6) {
  width: 28mm !important;
}

/* เพิ่มความกว้าง Defect level */
.qc-table th:nth-child(7),
.qc-table td:nth-child(7) {
  width: 28mm !important;
}
/* บังคับให้ตัวอักษรทุกตัวในตารางมีขนาด 14pt */
.qc-table,
.qc-table th,
.qc-table td {
  font-size: 14pt !important;
}

/* ค่าเริ่มต้น: คอลัมน์ที่ 1 ชิดขอบขวาทุกแถว */
.qc-table tbody td:first-child {
  text-align: right;
  padding-right: 2mm;
}

/* ยกเว้นแถวหัวข้อ / group title ให้ชิดซ้าย */
.qc-table tr.no-right-align td:first-child {
  text-align: left !important;
  padding-right: 1.5mm;
}
/* บังคับชิดซ้าย เฉพาะแถวที่กำหนด */
.qc-table tr.force-left td:first-child,
.qc-table tr.force-left th {
  text-align: left !important;
  padding-left: 1.5mm;
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

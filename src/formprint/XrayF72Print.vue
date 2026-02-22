<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + แผ่น A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะหายไปตอนสั่งพิมพ์) -->
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
    <div class="sheet-inner">
        <!-- ===== หัวฟอร์ม ===== -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F7-2 : การทดสอบ Collimator and Beam Alignment สำหรับ กรณีแผ่น DR ติดกับ Bucky (ไม่สามารถถอดออกได้)
          </div>

          <div class="title-sub">
            ความถี่ : {{ header.frequency }}
          </div>

          <!-- เครื่องเอกซเรย์ยี่ห้อ / รุ่น อยู่นอกตาราง -->
          <div class="title-sub machine-row">
            เครื่องเอกซเรย์ยี่ห้อ :
            <span class="underline medium">{{ header.machineBrand }}</span>
            รุ่น
            <span class="underline medium">{{ header.machineModel }}</span>
          </div>
        </div>

       <table class="main-table">
  <!-- ปรับเป็น 5 คอลัมน์: ข้อความ / cm / Pass / Fail / Note -->
  <colgroup>
    <col class="col-text" />
    <col class="col-cm" />
    <col class="col-pass" />
    <col class="col-fail" />
    <col class="col-note" />
  </colgroup>

  <!-- แถว 1: วัน/เดือน/ปี ที่ทดสอบ -->
  <tr>
    <td class="label-cell text-left" colspan="5">
      วัน/เดือน/ปี ที่ทดสอบ :
    </td>
  </tr>

  <!-- แถว 2: ผู้ทดสอบ -->
  <tr>
    <td class="label-cell text-left" colspan="5">
      ผู้ทดสอบ :
    </td>
  </tr>

  <!-- แถว 3: ○ หลอดไส้เล็ก ○ หลอดไส้ใหญ่ -->
  <tr>
    <td colspan="5" class="value-cell text-left">
      ○ หลอดไส้เล็ก<br />
      ○ หลอดไส้ใหญ่
    </td>
  </tr>

  <!-- แถว 4: ○ Collimator ... / ○ Coins ... -->
  <tr>
    <td class="align-left" colspan="5">
      ○ ทดสอบโดย Collimator / Beam alignment test tool<br />
      ○ ทดสอบโดย Coins for x-ray to light-beam alignment test
    </td>
  </tr>

  <!-- แถว 5: ข้อความคำอธิบาย + / - -->
  <tr>
    <td class="align-left note-row" colspan="5">
      <strong class="note-title">
        ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ (ไม่เกิน ± 2 cm หรือ 2% ที่ SID 100 cm)
      </strong><br />
      <span class="note-desc">
        + หมายถึงลำรังสีมีขนาดใหญ่กว่าขอบเขตจริง 
        - หมายถึงลำรังสีมีขนาดเล็กกว่าขอบเขตจริง
      </span>
    </td>
  </tr>

  <!-- แถว 6: หัวข้อ ความเหลื่อมล้ำ... + Pass / Fail / Note -->
  <tr class="sub-header">
    <!-- ผสานช่องข้อความ + cm -->
    <td class="center-item nowrap-header" colspan="2">
      ความเหลื่อมล้ำระหว่างลำรังสีกับลำแสงไฟ
    </td>
    <td>Pass</td>
    <td>Fail</td>
    <td>Note</td>
  </tr>

  <!-- แถว 7–10: ด้านแอโนด / ด้านแคโทด / ด้านบน / ด้านล่าง + cm -->
  <tr>
    <td class="center-item">ด้านแอโนด</td>
    <td class="cm-cell">cm</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td class="center-item">ด้านแคโทด</td>
    <td class="cm-cell">cm</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td class="center-item">ด้านบน</td>
    <td class="cm-cell">cm</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td class="center-item">ด้านล่าง</td>
    <td class="cm-cell">cm</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>

  <!-- แถว 11: ช่องว่าง -->
  <tr>
    <td colspan="5">&nbsp;</td>
  </tr>

  <!-- Beam Alignment section -->
  <tr class="section-row">
    <td class="section-title" colspan="5">
      Beam Alignment ต้องมีความเบี่ยงเบนไม่เกิน 3 องศา
    </td>
  </tr>

  <!-- หัว Beam Alignment + Pass / Fail / Note -->
  <tr class="sub-header">
    <!-- ใช้ 2 คอลัมน์แรกเป็น Beam Alignment -->
    <td class="col-beam-header" colspan="2">Beam Alignment</td>
    <td>Pass</td>
    <td>Fail</td>
    <td>Note</td>
  </tr>

  <!-- ผสานเซลล์ Pass / Fail / Note ในแนวตั้ง -->
  <tr>
    <td class="align-left" colspan="2">○ &lt; 1.5°</td>
    <td rowspan="3"></td>
    <td rowspan="3"></td>
    <td rowspan="3"></td>
  </tr>
  <tr>
    <td class="align-left" colspan="2">○ 1.5° &lt; X &lt; 3°</td>
  </tr>
  <tr>
    <td class="align-left" colspan="2">○ ≥ 3°</td>
  </tr>
</table>

      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Header + ข้อมูลทั่วไป
const header = ref({
  frequency: 'ทุก 6 เดือน',
  machineBrand: '',
  machineModel: '',
  roomNo: '',
  testDate: '',
  tester: ''
})

function handlePrint () {
  window.print()
}

const API_BASE = '/api/Xraycare'

onMounted(async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  try {
    const res = await fetch(`${API_BASE}/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    header.value.testDate = data.checkDate || ''
    header.value.tester = data.tester || ''
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData)
        if (parsed.frequency !== undefined) header.value.frequency = parsed.frequency
        if (parsed.machineBrand !== undefined) header.value.machineBrand = parsed.machineBrand
        if (parsed.machineModel !== undefined) header.value.machineModel = parsed.machineModel
        if (parsed.roomNo !== undefined) header.value.roomNo = parsed.roomNo
        if (parsed.testDate !== undefined) header.value.testDate = parsed.testDate
        if (parsed.tester !== undefined) header.value.tester = parsed.tester
      } catch (_) {}
    }
  } catch (e) {
    console.error('Load checklist record error:', e)
  }
})
</script>

<style src="./printLayout.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ฟอนต์พื้นฐานทั้งหน้า = 11 pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt !important;
  font-weight: 400;
}

/* Header */
.header-main {
  text-align: left;
  margin-bottom: 6mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt !important;
  text-align: left;
  margin-bottom: 2mm;
}

.title-sub {
  margin-bottom: 2mm;
}

.machine-row {
  margin-top: 2mm;
}

/* เส้นกรอกข้อมูล */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  padding: 0 2mm;
  display: inline-block;
}

.short { min-width: 25mm; }
.medium { min-width: 35mm; }
.long { min-width: 60mm; }

.main-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 4mm;
  margin-bottom: 6mm;
}

/* กำหนดสัดส่วนความกว้างแต่ละคอลัมน์
   - Fail แคบลง
   - Note กว้างขึ้น และอยู่ในตาราง */
.col-text { width: 15%; }  /* ข้อความหลัก */
.col-cm   { width: 20%; }  /* cm */
.col-pass { width: 10%; }  /* Pass */
.col-fail { width: 10%; }   /* Fail (ลดขนาดลง) */
.col-note { width: 25%; }  /* Note (กว้างขึ้น อยู่ในกรอบตาราง) */


.main-table td,
.main-table th {
  border: 0.4pt solid #000;
  padding: 1.5mm 2mm;
  vertical-align: middle;
  text-align: center;
  font-weight: 700;
}

/* ข้อความคำอธิบาย / label เป็นตัวบาง */
.label-cell {
  font-weight: 400;
}
/* ทำให้หัวข้อประโยคนี้หนามากขึ้น */
.note-row strong {
  font-weight: 700 !important;
  display: inline-block;
  margin-bottom: 1mm;
}

/* เพิ่มความสูงช่อง (บนล่าง) ของบรรทัดนี้ */
.note-row {
  padding-top: 3mm !important;
  padding-bottom: 3mm !important;
  line-height: 1.45;
}

/* แถวหัว section (บรรทัด Beam Alignment ต้องมีความเบี่ยงเบน...) */
/* ทำให้หัวข้อ section ชิดซ้ายของเซลล์จริงๆ */
.section-title {
  text-align: left !important;
  padding-left: 1mm !important;   /* ถ้าต้องการชิดสุดเปลี่ยนเป็น 0 */
  font-weight: 700;
}

/* ทำให้หัวคอลัมน์ Beam Alignment อยู่กลาง */
.col-beam-header {
  text-align: center !important;
  vertical-align: middle !important;
}

/* ทำให้ข้อความชิดขอบซ้ายของตารางมากขึ้น (ลด padding ซ้าย) */
.section-row .section-title {
  padding-left: 0.5mm !important; /* หรือ 0mm ถ้าอยากชิดสุดเลย */
}

/* ลบสีพื้นหัวตาราง */
.sub-header td {
  font-weight: 700;
  /* ไม่มี background แล้ว */
}

/* จัดข้อความซ้าย */
.text-left,
.align-left,
.left-cell {
  text-align: left !important;
  vertical-align: top !important;
}


/* ลายเซ็นชิดขวาเท่าขอบตาราง */
.sign-block {
  width: 100%;
  text-align: right;
  margin-top: 8mm;
}

/* ประโยคหัวข้อ = ตัวหนา */
.note-title {
  font-weight: 700 !important;
}

/* ประโยคอธิบาย + / - = ตัวบาง */
.note-desc {
  font-weight: 400 !important;
}
/* บังคับให้หัวข้อช่องนี้ไม่ตัดบรรทัด (อยู่บรรทัดเดียว) */
.nowrap-header {
  white-space: nowrap;
}
/* 1) ทำให้ข้อความหัวข้อและแถวด้านแอโนด/แคโทด/บน/ล่าง อยู่กึ่งกลางช่อง */
.center-item {
  text-align: center !important;
  vertical-align: middle !important;
  font-weight: 700 !important; /* คงความหนาของข้อความตามเดิม */
}

/* ทำให้คำว่า cm ชิดขอบขวาของช่องตาราง และเป็นตัวบาง */
.cm-cell {
  text-align: right !important;
  font-weight: 400 !important;
  padding-right: 1mm !important; /* ชิดขอบจริง ไม่ลอย */
}

/* ทำให้คำว่า "ความถี่ :" เป็นตัวหนา */
.title-sub {
  font-weight: 700 !important;
}

/* ทำให้คำว่า "ทุก 6 เดือน" เป็นตัวบาง */
.title-sub span {
  font-weight: 400 !important;
}

/* ทำให้คำว่า "เครื่องเอกซเรย์ยี่ห้อ :" เป็นตัวหนา */
.machine-row {
  font-weight: 700 !important;
}

/* แต่ค่าที่กรอก / เส้น underline เป็นตัวบาง */
.machine-row .underline {
  font-weight: 400 !important;
}

@media print {
  .main-table th, .main-table td { border: 1px solid #000 !important; }
}
</style>

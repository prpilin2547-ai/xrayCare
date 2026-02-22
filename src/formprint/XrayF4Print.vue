<template>
  <!-- หน้าโล่ง มีแค่ปุ่ม Print + หน้ากระดาษ A4 -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะไม่แสดงตอนสั่งพิมพ์) -->
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

    <div class="sheet-inner">
        <!-- ================= หัวฟอร์ม ================= -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์
          </div>

          <div class="title-sub">
            <span class="bold-text">ความถี่ :</span> ทุก 3 เดือน
          </div>

          <div class="title-sub header-row-inline">
            เครื่องเอกซเรย์ยี่ห้อ
          <span class="underline long"></span>
            รุ่น
          <span class="underline long"></span>
          </div>

      <div class="title-sub header-row-inline">
        วันที่
      <span class="underline short"></span>
        ผู้ทดสอบ
      <span class="underline short"></span>
      </div>
      </div>


        <!-- ================= ตารางตรวจสอบ ================= -->
        <table class="f4-table">
          <thead>
            <tr>
              <th class="col-no"><span class="bold-text">ลำดับที่</span></th>
              <th class="col-desc"><span class="bold-text">รายการตรวจสอบ</span></th>
              <th class="col-result"><span class="bold-text">ผ่าน (✓)<br> ไม่ผ่าน (✗)</span></th>
              <th class="col-remark"><span class="bold-text">หมายเหตุ</span></th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in rows" :key="row.no">
              <td class="col-no">{{ row.no }}</td>
              <td class="col-desc align-left">
                {{ row.description }}
              </td>
              <td class="col-result">
                <span v-if="row.result === 'P'">✓</span>
                <span v-else-if="row.result === 'F'">✗</span>
              </td>
              <td class="col-remark align-left">
                {{ row.remark }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- หมายเหตุเพิ่มเติมตามที่ระบุ -->
        <div class="note-block">
          <div class="note-line">
            *ในระบบ DR ให้ทวนสอบค่าทางเทคนิคว่าถูกต้องเป็นปัจจุบัน
          </div>
          <div class="note-line">
            **ไม่ต้องทดสอบสำหรับเครื่องเอกซเรย์เคลื่อนที่
          </div>
        </div>

        <!-- หมายเหตุท้ายฟอร์ม (จาก backend ถ้ามี) -->
        <div class="footer-note" v-if="footerNote">
          {{ footerNote }}
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// --------- หัวฟอร์ม (ข้อมูลจากฐาน) ----------
const header = ref({
  machineName: '..................................................',
  qcDate: '........../............/..........',
  testerName: '...................................',
  testerPosition: '.................................'
})

// --------- ตารางรายการตรวจสอบ (ข้อมูลจากฐาน) ----------
const rows = ref([
  {
    no: 1,
    description:
      'สภาพสายไฟไม่มีรอยแตก บิดงอหรือเป็นปมสาย และไม่ถูกอุปกรณ์ที่มีน้ำหนักกดทับสาย',
    result: '',
    remark: ''
  },
  {
    no: 2,
    description: 'ระบบอินเตอร์ล็อคและเบรคทำงานอย่างถูกต้อง',
    result: '',
    remark: ''
  },
  {
    no: 3,
    description:
      'การเคลื่อนที่ของเตียง หัวหลอดเอกซเรย์ และบัคกี้ เป็นไปอย่างราบรื่น',
    result: '',
    remark: ''
  },
  {
    no: 4,
    description:
      'สวิตซ์แผงควบคุม ไฟแสดงสถานะต่างๆ และมิเตอร์แสดงค่าทางเทคนิคทำงานและมองเห็นอย่างชัดเจน',
    result: '',
    remark: ''
  },
  {
    no: 5,
    description:
      'แสงไฟจากคอลลิเมเตอร์มีความเข้มแสงเพียงพอต่อการปฏิบัติงานในขณะที่เปิดไฟห้องปฏิบัติการ และคอลลิเมเตอร์ปราศจากฝุ่น',
    result: '',
    remark: ''
  },
  {
    no: '6*',
    description:
      'มีแผนภูมิค่าทางเทคนิคที่ใช้ปัจจุบันแสดงอยู่ใกล้แผงควบคุม',
    result: '',
    remark: ''
  },
  {
    no: 7,
    description:
      'ไม่มีน้ำมันระบายความร้อนรั่วรอบหลอดเอกซเรย์ ถังเครื่องกำเนิดไฟฟ้าแรงสูง และปราศจากฝุ่น',
    result: '',
    remark: ''
  },
  {
    no: 8,
    description: 'แผ่นรับภาพสะอาดและปราศจากสิ่งแปลกปลอม',
    result: '',
    remark: ''
  },
  {
    no: 9,
    description:
      'บนเวิร์กสเตชัน ให้แสดงภาพทางคลินิกล่าสุด ในภาพตรวจสอบเวลาและวันที่ รวมถึงการระบุสถานที่ และคำอธิบายประกอบอื่นๆถูกต้อง',
    result: '',
    remark: ''
  },
  {
    no: 10,
    description:
      'ที่หลอดเอกซเรย์ และเครื่องกำเนิดไฟฟ้า มีป้ายบอกรุ่น หมายเลขซีเรียลอ่านได้ชัดเจน หรือมีการจดบันทึกไว้ที่แฟ้มเอกสารคุณภาพ',
    result: '',
    remark: ''
  },
  {
    no: 11,
    description:
      'อุปกรณ์ป้องกันรังสี เช่น เสื้อตะกั่ว ไทรอยด์ชิวด์ อุปกรณ์กำบังรังสีบริเวณอวัยวะสืบพันธุ์ ไม่ชำรุดหรือฉีกขาด สะอาดและมีการจัดเก็บอย่างเหมาะสม',
    result: '',
    remark: ''
  },
  {
    no: '12**',
    description:
      'สามารถมองเห็นผู้ป่วยจากห้องควบคุมโดยไม่มีสิ่งกีดขวางบดบังผ่านจากช่องมองกระจก หรือมีระบบกล้องวงจรปิด',
    result: '',
    remark: ''
  },
  {
    no: '13**',
    description:
      'ป้ายและสัญลักษณ์เตือนภัยทางรังสีติดหน้าประตูและไฟเตือนขณะฉายรังสีหน้าห้องปฏิบัติการ',
    result: '',
    remark: ''
  },
  {
    no: '14**',
    description: 'ช่องหรือบักกี้ใส่คาสเซทและตัวล็อคทำงานปกติ',
    result: '',
    remark: ''
  },
  {
    no: '15**',
    description:
      'ศูนย์กลางลำรังสีกับเตียง ตัวเลขบอกระยะ SID หรือขนาดแสงไฟ ถูกต้อง',
    result: '',
    remark: ''
  }
])

const footerNote = ref('')

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
    header.value.machineName = data.machineName || ''
    header.value.testerName = data.tester || ''
    header.value.qcDate = data.checkDate || ''
    if (data.jsonData) {
      try {
        const parsed = JSON.parse(data.jsonData)
        if (parsed.header && typeof parsed.header === 'object') Object.assign(header.value, parsed.header)
        if (Array.isArray(parsed.rows)) rows.value = parsed.rows
        if (parsed.footerNote !== undefined) footerNote.value = parsed.footerNote
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

/* ตั้งค่ามาตรฐานทั้งหน้า = 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 16pt !important;
  font-weight: 400;
}

/* ================= Header ================= */
.header-main {
  margin-bottom: 8mm;
  width: 100%;           /* ให้กว้างเท่าตาราง */
}

/* คำว่า "แบบบันทึก F4…" = 13pt */
.title-main {
  font-weight: 700;
  font-size: 18pt !important;
  margin-bottom: 3mm;
}

/* บรรทัดอื่นของ header = 11pt */
.title-sub {
  font-size: 16pt !important;
  margin-bottom: 3mm;
  line-height: 1.4;
}

.header-row-inline {
  display: flex;
  align-items: center;
  gap: 4mm;
  width: 100%;
}

/* ตัวหนา */
.bold-text {
  font-weight: 700;
}

/* underline — ให้เส้นยาวจนสุดขอบเท่าตาราง */
.underline {
  border-bottom: 0.4pt solid #000;
  min-height: 6mm;
  display: inline-block;
  flex: 1;
  margin: 0;             /* ★ ไม่มีระยะข้างซ้าย-ขวา */
}

.short {
  flex: 0 0 40mm;
}

.long {
  flex: 1;
}

.f4-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14pt !important;   /* ← ตาราง = 14 */
}

.f4-table th {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  text-align: center;
  vertical-align: middle;
  font-size: 14pt !important;   /* ← ตาราง = 14 */
  font-weight: 700 !important;
}

.f4-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: left !important;
  font-size: 14pt !important;   /* ← ตาราง = 14 */
}


/* ★ ลำดับที่ (1–15) ให้อยู่กึ่งกลางช่อง */
.f4-table td.col-no {
  text-align: center !important;
  font-weight: 400;   /* ← ตัวบาง */
}


/* ถ้าต้องการให้ช่องผล (ผ่าน/ไม่ผ่าน) อยู่กลางด้วย */
.f4-table td.col-result {
  text-align: center !important;
  font-weight: 700;
}

/* เลขลำดับที่ 1–15 ชิดขอบบน */
.f4-table td.col-no {
  vertical-align: top !important;
  padding-top: 1mm;   /* ปรับได้ ถ้าอยากให้ติดมากขึ้น */
}


/* คอลัมน์ */
.col-no {
  width: 14mm;
}

.col-desc {
  width: 75mm;
}

.col-result {
  width: 30mm;
}

.col-remark {
  width: auto;
}

/* หมายเหตุ */
.note-block {
  margin-top: 4mm;
  font-size: 16pt !important;
}

.note-line {
  line-height: 1.4 !important;
}

.footer-note {
  margin-top: 3mm;
  font-size: 16pt !important;
}

/* ความถี่ : ตัวหนา */
.freq-label {
  font-weight: 700;
}

/* ค่า (ทุก 3 เดือน) ตัวบาง */
.freq-value {
  font-weight: 400;
}

@media print {
  .f4-table th, .f4-table td { border: 1px solid #000 !important; }
}
</style>

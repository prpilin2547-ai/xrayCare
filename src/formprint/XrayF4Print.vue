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

    <!-- แผ่น A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- ================= หัวฟอร์ม ================= -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์
          </div>

          <div class="title-sub">
            ความถี่ : ทุก 3 เดือน
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
              <th class="col-no">ลำดับที่</th>
              <th class="col-desc">รายการตรวจสอบ</th>
              <th class="col-result">ผ่าน (✓)<br />
                ไม่ผ่าน(✗)</th>
              <th class="col-remark">หมายเหตุ</th>
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

onMounted(async () => {
  const id = route.params.id
  if (!id) return
  // โหลดข้อมูลจริงค่อยใส่ภายหลังจาก backend
})
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

/* ตั้งค่ามาตรฐานทั้งหน้า = 11pt */
* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
  font-size: 11pt !important;
  font-weight: 400;
}

.print-root {
  background: #e5e7eb;
  min-height: 100vh;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ปุ่ม print */
.print-toolbar {
  margin-bottom: 18px;
}

.btn-print {
  padding: 6px 18px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 11pt !important;
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
}

/* ================= Header ================= */
.header-main {
  margin-bottom: 8mm;
  width: 100%;           /* ให้กว้างเท่าตาราง */
}

/* คำว่า "แบบบันทึก F4…" = 13pt */
.title-main {
  font-weight: 700;
  font-size: 13pt !important;
  margin-bottom: 3mm;
}

/* บรรทัดอื่นของ header = 11pt */
.title-sub {
  font-size: 11pt !important;
  margin-bottom: 3mm;
  line-height: 1.4;
}

.header-row-inline {
  display: flex;
  align-items: center;
  gap: 4mm;
  width: 100%;
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

/* ================= ตาราง (ฟอนต์ 10pt) ================= */
.f4-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 10pt !important;      /* ★ 10 pt ทั้งตาราง */
}

.f4-table th {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  text-align: center;
  vertical-align: middle;
  font-size: 10pt !important;
}

/* ข้อความในเซลล์ทั่วไปชิดซ้าย */
.f4-table td {
  border: 0.4pt solid #000;
  padding: 1.5mm 1mm;
  vertical-align: middle;
  text-align: left !important;
  font-size: 10pt !important;
}

/* ★ ลำดับที่ (1–15) ให้อยู่กึ่งกลางช่อง */
.f4-table td.col-no {
  text-align: center !important;
}

/* ถ้าต้องการให้ช่องผล (ผ่าน/ไม่ผ่าน) อยู่กลางด้วย */
.f4-table td.col-result {
  text-align: center !important;
}

/* คอลัมน์ */
.col-no {
  width: 12mm;
}

.col-desc {
  width: 90mm;
}

.col-result {
  width: 22mm;
}

.col-remark {
  width: auto;
}

/* หมายเหตุ */
.note-block {
  margin-top: 4mm;
  font-size: 11pt !important;
}

.note-line {
  line-height: 1.4 !important;
}

.footer-note {
  margin-top: 3mm;
  font-size: 11pt !important;
}

/* Print mode */
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

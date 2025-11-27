<template>
  <!-- หน้าโล่ง ใช้สำหรับปริ้นเท่านั้น -->
  <div class="print-root">
    <!-- ปุ่ม Print (จะถูกซ่อนตอนสั่งพิมพ์) -->
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        🖨 พิมพ์แบบบันทึก F11
      </button>
    </div>

    <!-- กระดาษ A4 -->
    <div class="sheet-a4">
      <div class="sheet-inner">
        <!-- หัวฟอร์ม -->
        <div class="header-main">
          <div class="title-main">
            แบบบันทึก F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย
          </div>
        </div>

        <!-- ตารางหลักตามฟอร์ม -->
        <table class="f11-table">
          <thead>
            <tr>
              <th class="col-region">
                บริเวณฉายรังสี
              </th>
              <th class="col-small">
                ค่าความต่างศักย์<br />
                (kV)
              </th>
              <th class="col-small">
                ค่ากระแสไฟฟ้า<br />
                กับเวลา (mAs)
              </th>
              <th class="col-small">
                ระยะโฟกัสถึง<br />
                ตัวรับภาพ (cm)<br />
                (FTD)
              </th>
              <th class="col-small">
                ความหนา<br />
                ของอวัยวะ (cm)<br />
                (tₚ)
              </th>
              <th class="col-small">
                ระยะ<br />
                Bucky (cm)
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, index) in record.rows"
              :key="index"
            >
              <td class="align-left">
                {{ row.region }}
              </td>
              <td>
                {{ row.kv }}
              </td>
              <td>
                {{ row.mas }}
              </td>
              <td>
                {{ row.ftd }}
              </td>
              <td>
                {{ row.tp }}
              </td>
              <td>
                {{ row.bucky }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- พื้นที่ว่างด้านล่าง (ให้ใกล้เคียง PDF) -->
        <div class="bottom-space"></div>

        <!-- ลายเซ็นผู้ตรวจสอบ -->
        <div class="sign-block">
          <div class="sign-line">
            ลงชื่อ......................................................................................ผู้ทดสอบ
          </div>
          <div class="sign-line">
            (.................................................................................)
          </div>
          <div class="sign-line">
            ตำแหน่ง..................................................................................
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

// โครงข้อมูลสำหรับ F11 (ตัวอย่างเริ่มต้น)
// ของจริงจะถูกแทนที่ด้วยข้อมูลจากฐาน
const record = ref({
  id: route.params.id || null,
  rows: [
    { region: 'Chest PA', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'L-Spine AP', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'L-Spine LAT', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Abdomen AP', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Pelvis AP', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Skull AP/PA', kv: '', mas: '', ftd: '', tp: '', bucky: '' },
    { region: 'Skull LAT', kv: '', mas: '', ftd: '', tp: '', bucky: '' }
  ]
})

function handlePrint () {
  // เปิด dialog พิมพ์ของเบราว์เซอร์ (Chrome/Edge จะขึ้นป๊อปอัพ Google Print)
  window.print()
}

// ดึงข้อมูลจริงจาก Backend ตาม id
onMounted(async () => {
  const id = route.params.id

  if (!id) return

  try {
    // แก้ URL และโครง response ให้ตรงกับ API ของระบบจริง
    // ตัวอย่างโครงตอบกลับ (mock):
    // {
    //   id: '123',
    //   rows: [
    //     { region: 'Chest PA', kv: '110', mas: '4', ftd: '180', tp: '22', bucky: '0' },
    //     ...
    //   ]
    // }

    // const res = await fetch(`/api/prints/f11/${id}`)
    // const data = await res.json()
    // record.value = data

  } catch (err) {
    console.error('โหลดข้อมูล F11 ไม่สำเร็จ', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

* {
  font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important;
}

/* พื้นหลัง นอกกระดาษ */
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
  padding: 6px 20px;
  background: #ffffff;
  border-radius: 999px;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-size: 16px;
}

/* กระดาษ A4 */
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

/* หัวฟอร์ม */
.header-main {
  text-align: center;
  margin-bottom: 8mm;
}

.title-main {
  font-weight: 700;
  font-size: 18pt;
}

/* ตารางหลัก */
.f11-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13pt;
}

.f11-table th,
.f11-table td {
  border: 0.4pt solid #000;
  padding: 2mm 1mm;
  text-align: center;
  vertical-align: middle;
}

.col-region {
  width: 50mm;
}

.col-small {
  width: 26mm;
}

.align-left {
  text-align: left;
  padding-left: 3mm;
}

/* พื้นที่ว่างก่อนลายเซ็น (ใกล้เคียง PDF) */
.bottom-space {
  height: 22mm;
}

/* ลายเซ็นผู้ทดสอบ */
.sign-block {
  margin-top: 6mm;
  font-size: 14pt;
}

.sign-line {
  margin-bottom: 2mm;
}

/* ตั้งค่าหน้ากระดาษตอน print */
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

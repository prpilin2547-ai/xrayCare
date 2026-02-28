<template>
  <div class="print-root">
    <div class="print-toolbar">
      <button class="btn-print" @click="handlePrint">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px;">
          <path d="M6 9V2h12v7h2.5A1.5 1.5 0 0 1 22 10.5v6A1.5 1.5 0 0 1 20.5 18H18v4H6v-4H3.5A1.5 1.5 0 0 1 2 16.5v-6A1.5 1.5 0 0 1 3.5 9H6zm2-5v5h8V4H8zm8 14H8v2h8v-2z"/>
        </svg>
        Print
      </button>
    </div>

    <div class="sheet-inner combined-sheet">
      <!-- ========== F3 : การควบคุมคุณภาพจอภาพ ========== -->
      <div class="print-section">
        <div class="header-main">
          <div class="title-main">แบบบันทึก F3 : การควบคุมคุณภาพจอภาพ (Display monitor)</div>
          <div class="title-sub"><span class="bold-text">ความถี่ :</span> ทุก 3 เดือน (หรือ 1 เดือน)</div>
        </div>
        <table class="f3-table">
          <tbody class="section-block">
            <tr>
              <td class="label-col right-label"><span class="bold-text">วันที่</span></td>
              <td colspan="4" class="value-cell">{{ f3Record.date }}</td>
            </tr>
            <tr>
              <td class="label-col right-label"><span class="bold-text">ผู้ทดสอบ</span></td>
              <td colspan="4" class="value-cell">{{ f3Record.tester }}</td>
            </tr>
            <tr><td colspan="5" class="center-cell bold-text">Pass (P) / Fail (F)</td></tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="section-title">คุณภาพของภาพพิมพ์โดยทั่วไป</td></tr>
            <tr v-for="(item, idx) in (f3Record.qualityItems || [])" :key="'pq-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="section-title">ความบิดเบือนทั่วไป</td></tr>
            <tr v-for="(item, idx) in (f3Record.sharpnessItems || [])" :key="'cl-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="section-title">ความส่องสว่าง (Luminance)</td></tr>
            <tr v-for="(item, idx) in (f3Record.luminanceItems || [])" :key="'lum-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="section-title">กลุ่มวัตถุคอนทราสสูงขนาดเล็กสุดมองเห็นได้ (ในมุมทั้ง 4 และตรงกลางของภาพ)</td></tr>
            <tr v-for="(item, idx) in (f3Record.objectGroupItems || [])" :key="'sg-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="section-title">จำนวนตัวอักษรที่มองเห็น (อย่างน้อย 11 ตัว หรืออ่านได้ถึง "QUALITY CONT")</td></tr>
            <tr v-for="(item, idx) in (f3Record.whiteObjectItems || [])" :key="'tx-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
          </tbody>
          <tbody class="section-block">
            <tr><td colspan="5" class="merged-left">ลูกกลิ้งของเครื่องพิมพ์</td></tr>
            <tr v-for="(item, idx) in (f3Record.rollerItems || [])" :key="'roll-' + (item.id || idx)">
              <td class="label-col">{{ item.label }}</td>
              <td class="check-cell" :class="{ 'result-p': item.result === 'P', 'result-f': item.result === 'F' }">{{ item.result === 'P' ? 'P' : item.result === 'F' ? 'F' : '' }}</td>
              <td class="check-cell"></td><td class="check-cell"></td><td class="check-cell"></td>
            </tr>
            <tr><td colspan="5" class="merged-left">ข้อคิดเห็น</td></tr>
            <tr><td colspan="5" class="value-cell align-left">{{ f3Record.remark }}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- ========== F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์ ========== -->
      <div class="print-section section-f4">
        <div class="header-main">
          <div class="title-main">แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์</div>
          <div class="title-sub"><span class="bold-text">ความถี่ :</span> ทุก 3 เดือน</div>
          <div class="title-sub header-row-inline">
            ห้อง <span class="underline short">{{ f4Record.room }}</span> รุ่น <span class="underline long">{{ f4Record.model }}</span>
          </div>
          <div class="title-sub header-row-inline">
            วันที่ <span class="underline short">{{ f4Record.date }}</span> ผู้ทดสอบ <span class="underline short">{{ f4Record.tester }}</span>
          </div>
        </div>
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
            <tr v-for="row in f4Rows" :key="row.id || row.order">
              <td class="col-no">{{ row.order ?? row.no }}</td>
              <td class="col-desc align-left">{{ row.label ?? row.description }}</td>
              <td class="col-result">
                <span v-if="row.pass === true || row.result === 'P'">✓</span>
                <span v-else-if="row.pass === false || row.result === 'F'">✗</span>
              </td>
              <td class="col-remark align-left">{{ row.remark ?? '' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="note-block">
          <div class="note-line">*ในระบบ DR ให้ทวนสอบค่าทางเทคนิคว่าถูกต้องเป็นปัจจุบัน</div>
          <div class="note-line">**ไม่ต้องทดสอบสำหรับเครื่องเอกซเรย์เคลื่อนที่</div>
        </div>
        <div class="footer-note" v-if="f4Record.remark">{{ f4Record.remark }}</div>
      </div>

      <!-- ========== F5 : ความสม่ำเสมอของภาพ ========== -->
      <div class="print-section section-f5">
        <div class="header-main">
          <div class="title-main">แบบบันทึก F5 : ความสม่ำเสมอของภาพ (Measured Uniformity)</div>
          <div class="title-sub"><span class="bold-text">ความถี่ :</span> ทุก 3 เดือน</div>
          <div class="title-sub"><span class="bold-text">หมายเลขของแผ่นรับภาพ</span> <span class="underline long">{{ f5Record.cassetteNumber }}</span></div>
        </div>
        <table class="summary-box">
          <tr>
            <td class="align-left">
              <span class="bold-text">ค่าขอบเขต</span><br />
              <template v-for="(c, i) in (f5Record.criteria || [])" :key="'crit-' + (c.id || i)">
                <span class="bold-text">{{ c.label }}</span> <span v-if="c.result">({{ c.result }})</span><br />
              </template>
            </td>
          </tr>
        </table>
        <table class="f5-table">
          <tbody>
            <tr>
              <td class="col-label"><span class="bold-text">วันที่</span></td>
              <td class="col-right-4" colspan="4">{{ f5Record.date }}</td>
            </tr>
            <tr>
              <td class="col-label"><span class="bold-text">ผู้ทดสอบ</span></td>
              <td class="col-right-4" colspan="4">{{ f5Record.tester }}</td>
            </tr>
            <tr v-for="(item, idx) in (f5Record.imageChecks || [])" :key="'img-' + (item.id || idx)">
              <td class="col-label"><span class="bold-text">{{ item.label }}</span></td>
              <td class="small-box" colspan="4">{{ item.result }}</td>
            </tr>
            <tr>
              <td class="col-label"><span class="bold-text">ข้อคิดเห็น–ความดำภาพ (heel effect etc?)</span></td>
              <td class="small-box" colspan="4">{{ f5Record.comment }}</td>
            </tr>
            <tr>
              <td class="col-label"><span class="bold-text">การแก้ไข (ถ้าเป็นไปได้)</span></td>
              <td class="small-box" colspan="4">{{ f5Record.correction }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ========== F6 : ความคงที่ของค่าดัชนีปริมาณรังสี ========== -->
      <div class="print-section section-f6">
        <div class="header-main">
          <div class="title-main">แบบบันทึก F6 : ความคงที่ของค่าดัชนีปริมาณรังสี (Consistency of Exposure Index)</div>
          <div class="title-sub"><span class="freq-label">ความถี่ :</span> <span class="freq-value">ทุก 3 เดือน</span></div>
        </div>
        <table class="f6-table">
          <tbody>
            <tr>
              <td colspan="4" class="align-left multi-line-cell">
                <div>ข้อมูลสำหรับระบบ {{ f6Record.systemType || 'CR / DR' }}</div>
                <div>หมายเลขคาสเซท {{ f6Record.systemType || 'CR / DR' }} : <span class="underline short">{{ f6Record.cassetteNumber }}</span></div>
                <div>หมายเลขเครื่องอ่าน {{ f6Record.systemType || 'CR / DR' }} : <span class="underline short">{{ f6Record.readerNumber }}</span></div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="align-left multi-line-cell">
                <div>ข้อมูลเครื่องเอกซเรย์</div>
                <div class="device-info-row">
                  <span>ยี่ห้อ : <span class="val-underline wide">{{ f6Record.xrayBrand }}</span></span>
                  <span>รุ่น : <span class="val-underline">{{ f6Record.xrayModel }}</span></span>
                  <span>หมายเลขเครื่อง : <span class="val-underline">{{ f6Record.xraySerial }}</span></span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="align-left multi-line-cell">
                <div>ขอบเขต</div>
                <div>ค่าแตกต่างจากค่าอ้างอิงพื้นฐาน (Baseline) น้อยกว่า ± 10%</div>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="align-left">ข้อมูลเบื้องต้น : ระบุเทอมของตัวชี้บอกปริมาณรังสี เช่น ฟูจิ ใช้ S, EI คือ <span class="underline short">{{ f6Record.eiUnitInfo }}</span></td>
            </tr>
            <tr>
              <td colspan="4" class="align-left">เทคนิคประมวลผลภาพ : <span class="val-underline wide">{{ f6Record.processingTechnique }}</span></td>
            </tr>
            <tr class="ei-header">
              <th>วันที่ทำการทดสอบ</th><th>อ้างอิง</th><th>ขอบเขตล่าง</th><th>ขอบเขตบน</th>
            </tr>
            <template v-for="row in f6TestRows" :key="'ei-' + row.id">
              <tr>
                <td class="align-left">{{ formatDate(row.date) }}</td>
                <td></td><td></td><td></td>
              </tr>
              <tr>
                <td class="align-left">EI</td>
                <td class="align-center">{{ row.ei_ref }}</td>
                <td class="align-center">{{ row.ei_lower }}</td>
                <td class="align-center">{{ row.ei_upper }}</td>
              </tr>
              <tr>
                <td class="align-left">EI จากเครื่อง</td>
                <td class="align-center">{{ row.eiMeasured_ref }}</td>
                <td class="align-center">{{ row.eiMeasured_lower }}</td>
                <td class="align-center">{{ row.eiMeasured_upper }}</td>
              </tr>
              <tr>
                <td class="align-left">EI อยู่ในเกณฑ์ (P/F)</td>
                <td class="align-center">{{ row.passFail_ref }}</td>
                <td class="align-center">{{ row.passFail_lower }}</td>
                <td class="align-center">{{ row.passFail_upper }}</td>
              </tr>
              <tr>
                <td class="align-left">ข้อคิดเห็น</td>
                <td colspan="3" class="align-left">{{ row.comment }}</td>
              </tr>
            </template>
            <template v-if="!f6TestRows.length">
              <tr><td></td><td></td><td></td><td></td></tr>
              <tr><td class="align-left">EI</td><td></td><td></td><td></td></tr>
              <tr><td class="align-left">EI จากเครื่อง</td><td></td><td></td><td></td></tr>
              <tr><td class="align-left">EI อยู่ในเกณฑ์ (P/F)</td><td></td><td></td><td></td></tr>
              <tr><td class="align-left">ข้อคิดเห็น</td><td colspan="3"></td></tr>
            </template>
            <tr class="section-header">
              <td colspan="4" class="align-left">ปริมาณรังสีที่ใช้สำหรับการทดสอบ (กรณีศูนย์วิทยาศาสตร์การแพทย์ ดำเนินการวัดให้พร้อมตรวจมาตรฐานเครื่องเอกซเรย์ประจำปี)</td>
            </tr>
            <template v-if="f6Record.doseRows && f6Record.doseRows.length">
              <tr v-for="(row, idx) in f6Record.doseRows" :key="'dose-' + (row.id ?? idx)">
                <td class="align-center">เทคนิคการถ่ายภาพ<br />{{ row.technique }}</td>
                <td class="align-center">kV<br />{{ row.kv }}</td>
                <td class="align-center">mAs<br />{{ row.mas }}</td>
                <td class="align-center">Dose (mGy)<br />{{ row.dose }}</td>
              </tr>
            </template>
            <tr v-else>
              <td class="align-center">เทคนิคการถ่ายภาพ<br /></td>
              <td class="align-center">kV<br /></td>
              <td class="align-center">mAs<br /></td>
              <td class="align-center">Dose (mGy)<br /></td>
            </tr>
            <tr class="empty-row"><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>
        <div class="signature-block">
          <div class="sig-line sig-row">ลงชื่อ .................................................. ผู้ทดสอบ</div>
          <div class="sig-line sig-row">( ................................................................. )</div>
          <div class="sig-line sig-row">ตำแหน่ง ..........................................................</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const API_BASE = '/api/Xraycare'

// F3 – โครงสร้างตรงกับ jsonData.F3
const f3Record = ref({
  date: '', tester: '', remark: '',
  qualityItems: [], sharpnessItems: [], luminanceItems: [], objectGroupItems: [], whiteObjectItems: [], rollerItems: []
})

// F4
const f4Record = ref({ room: '', model: '', date: '', tester: '', remark: '' })
const f4Rows = ref([
  { no: 1, description: 'สภาพสายไฟไม่มีรอยแตก บิดงอหรือเป็นปมสาย และไม่ถูกอุปกรณ์ที่มีน้ำหนักกดทับสาย', result: '', remark: '' },
  { no: 2, description: 'ระบบอินเตอร์ล็อคและเบรคทำงานอย่างถูกต้อง', result: '', remark: '' },
  { no: 3, description: 'การเคลื่อนที่ของเตียง หัวหลอดเอกซเรย์ และบัคกี้ เป็นไปอย่างราบรื่น', result: '', remark: '' },
  { no: 4, description: 'สวิตซ์แผงควบคุม ไฟแสดงสถานะต่างๆ และมิเตอร์แสดงค่าทางเทคนิคทำงานและมองเห็นอย่างชัดเจน', result: '', remark: '' },
  { no: 5, description: 'แสงไฟจากคอลลิเมเตอร์มีความเข้มแสงเพียงพอต่อการปฏิบัติงานในขณะที่เปิดไฟห้องปฏิบัติการ และคอลลิเมเตอร์ปราศจากฝุ่น', result: '', remark: '' },
  { no: '6*', description: 'มีแผนภูมิค่าทางเทคนิคที่ใช้ปัจจุบันแสดงอยู่ใกล้แผงควบคุม', result: '', remark: '' },
  { no: 7, description: 'ไม่มีน้ำมันระบายความร้อนรั่วรอบหลอดเอกซเรย์ ถังเครื่องกำเนิดไฟฟ้าแรงสูง และปราศจากฝุ่น', result: '', remark: '' },
  { no: 8, description: 'แผ่นรับภาพสะอาดและปราศจากสิ่งแปลกปลอม', result: '', remark: '' },
  { no: 9, description: 'บนเวิร์กสเตชัน ให้แสดงภาพทางคลินิกล่าสุด ในภาพตรวจสอบเวลาและวันที่ รวมถึงการระบุสถานที่ และคำอธิบายประกอบอื่นๆถูกต้อง', result: '', remark: '' },
  { no: 10, description: 'ที่หลอดเอกซเรย์ และเครื่องกำเนิดไฟฟ้า มีป้ายบอกรุ่น หมายเลขซีเรียลอ่านได้ชัดเจน หรือมีการจดบันทึกไว้ที่แฟ้มเอกสารคุณภาพ', result: '', remark: '' },
  { no: 11, description: 'อุปกรณ์ป้องกันรังสี เช่น เสื้อตะกั่ว ไทรอยด์ชิวด์ อุปกรณ์กำบังรังสีบริเวณอวัยวะสืบพันธุ์ ไม่ชำรุดหรือฉีกขาด สะอาดและมีการจัดเก็บอย่างเหมาะสม', result: '', remark: '' },
  { no: '12**', description: 'สามารถมองเห็นผู้ป่วยจากห้องควบคุมโดยไม่มีสิ่งกีดขวางบดบังผ่านจากช่องมองกระจก หรือมีระบบกล้องวงจรปิด', result: '', remark: '' },
  { no: '13**', description: 'ป้ายและสัญลักษณ์เตือนภัยทางรังสีติดหน้าประตูและไฟเตือนขณะฉายรังสีหน้าห้องปฏิบัติการ', result: '', remark: '' },
  { no: '14**', description: 'ช่องหรือบักกี้ใส่คาสเซทและตัวล็อคทำงานปกติ', result: '', remark: '' },
  { no: '15**', description: 'ศูนย์กลางลำรังสีกับเตียง ตัวเลขบอกระยะ SID หรือขนาดแสงไฟ ถูกต้อง', result: '', remark: '' }
])

// F5 – โครงสร้างตรงกับ jsonData.F5
const f5Record = ref({
  cassetteNumber: '', date: '', tester: '', comment: '', correction: '',
  criteria: [], imageChecks: []
})

// F6 – โครงสร้างตรงกับ jsonData.F6
const f6Record = ref({
  cassetteNumber: '', readerNumber: '', xrayBrand: '', xrayModel: '', xraySerial: '', eiUnitInfo: '', processingTechnique: '', remark: '',
  testRows: [], doseRows: []
})

const f6TestRows = computed(() => {
  if (Array.isArray(f6Record.value.testRows) && f6Record.value.testRows.length) {
    return f6Record.value.testRows
  }
  return []
})

function formatDate(val) {
  if (!val) return ''
  const s = String(val).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-')
    const thaiYear = Number.parseInt(y, 10) + 543
    return `${d}/${m}/${thaiYear}`
  }
  return s
}

function getLoggedInUser() {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    return stored.username || ''
  } catch (_) { return '' }
}

function resolveTester(saved) {
  if (saved && saved !== 'Demo User') return saved
  return getLoggedInUser() || saved || ''
}

onMounted(async () => {
  const id = route.query.id || route.params.id
  if (!id) return
  try {
    const res = await fetch(`${API_BASE}/GetChecklistRecord/${id}`)
    if (!res.ok) return
    const data = await res.json()
    const checkDate = data.checkDate || ''
    const tester = resolveTester(data.tester)
    const machineName = data.machineName || ''
    const room = data.room || ''
    let parsed = {}
    if (data.jsonData) {
      try {
        parsed = JSON.parse(data.jsonData)
      } catch (_) {}
    }
    // F3
    if (parsed.F3 && typeof parsed.F3 === 'object') {
      Object.assign(f3Record.value, parsed.F3)
    }
    f3Record.value.date = f3Record.value.date || checkDate
    f3Record.value.tester = resolveTester(f3Record.value.tester) || tester
    // F4 – ใช้ items[] จาก jsonData
    if (parsed.F4 && typeof parsed.F4 === 'object') {
      Object.assign(f4Record.value, {
        room: parsed.F4.room || room,
        model: parsed.F4.model || machineName,
        date: parsed.F4.date || checkDate,
        tester: resolveTester(parsed.F4.tester) || tester,
        remark: parsed.F4.remark ?? ''
      })
      f4Rows.value = Array.isArray(parsed.F4.items) ? parsed.F4.items : []
    } else {
      f4Record.value.room = room
      f4Record.value.model = machineName
      f4Record.value.date = checkDate
      f4Record.value.tester = tester
    }
    // F5
    if (parsed.F5 && typeof parsed.F5 === 'object') {
      Object.assign(f5Record.value, parsed.F5)
    }
    f5Record.value.date = f5Record.value.date || checkDate
    f5Record.value.tester = resolveTester(f5Record.value.tester) || tester
    // F6
    if (parsed.F6 && typeof parsed.F6 === 'object') {
      Object.assign(f6Record.value, parsed.F6)
    }
    // ดึงข้อมูลเครื่องจาก API เพื่อเติมข้อมูลที่ฟอร์มไม่ได้เก็บ
    let machineModel = ''
    if (machineName) {
      try {
        const mRes = await fetch(`${API_BASE}/GetAllMachines`)
        if (mRes.ok) {
          const machines = await mRes.json()
          const found = machines.find(mx => (mx.machineName || '').trim() === machineName.trim())
          if (found) {
            machineModel = found.model || ''
          }
        }
      } catch (_) {}
    }
    f6Record.value.xrayBrand = f6Record.value.xrayBrand || machineName
    f6Record.value.xrayModel = f6Record.value.xrayModel || machineModel
    f6Record.value.xraySerial = f6Record.value.xraySerial || ''
  } catch (e) {
    console.error('Load checklist record error:', e)
  }
})

function handlePrint() {
  window.print()
}
</script>

<style src="./printLayout.css"></style>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');

* { font-family: 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif !important; font-size: 16pt !important; font-weight: 400; }

/* หน้ารวม F3–F6: ยกเลิกความสูงคงที่ ให้ scroll ดูทุกฟอร์มได้ และพิมพ์แยกหน้าตาม section */
.print-root > .sheet-inner.combined-sheet {
  height: auto !important;
  min-height: 277mm;
  max-height: none !important;
  aspect-ratio: auto;
  overflow: visible !important;
}
.print-root:has(.combined-sheet) {
  overflow-x: hidden;
  overflow-y: auto;
  align-items: center;
  justify-content: flex-start;
}
.sheet-inner.combined-sheet {
  width: 190mm;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
/* แบ่งหน้าตามหัวข้อ: แต่ละบล็อกไม่ขาดกลางหน้า */
.section-block {
  display: table-row-group;
  page-break-inside: avoid;
}
.section-title {
  border-top: 1pt solid #000;
  padding-top: 3mm !important;
  margin-top: 2mm;
}
.section-block:first-child .section-title,
.section-block .section-title:first-child { border-top: none; padding-top: 0; margin-top: 0; }
.section-block + .section-block .section-title { border-top-color: #333; }
.print-section { margin-bottom: 8mm; }
.print-section.section-f4,
.print-section.section-f5,
.print-section.section-f6 { page-break-before: always; }
@media print {
  .print-root > .sheet-inner.combined-sheet {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    page-break-after: auto;
    width: 190mm !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .print-section.section-f4,
  .print-section.section-f5,
  .print-section.section-f6 { page-break-before: always; }
  .section-block { page-break-inside: avoid; }
}

/* F3 */
.header-main { margin-bottom: 6mm; }
.title-main { font-weight: 700; font-size: 18pt !important; margin-bottom: 2mm; }
.title-sub { font-size: 16pt !important; }
.f3-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 16pt !important; }
.f3-table td { border: 0.4pt solid #000; padding: 1.5mm 2mm; vertical-align: middle; font-size: 16pt !important; }
.label-col { width: 65mm; }
.check-cell { width: 25mm; }
.center-cell { text-align: center; }
.section-title { font-weight: 700; text-align: left; padding-left: 2mm; }
.bold-text { font-weight: 700; }
.value-cell { text-align: left; }
.merged-left { font-weight: 700; text-align: left !important; padding-left: 2mm !important; border: 0.4pt solid #000; }
.underline { display: inline-block; border-bottom: 0.4pt solid #000; min-width: 50mm; min-height: 6mm; }
.f3-table td, .f3-table th { padding-top: 0.2mm !important; padding-bottom: 0.2mm !important; }
.right-label { text-align: right !important; padding-right: 3mm !important; }
.check-cell.result-p { font-weight: 700; text-align: center; }
.check-cell.result-f { font-weight: 700; text-align: center; }
.align-left { text-align: left !important; }

/* F4 */
.header-row-inline { display: flex; align-items: center; gap: 4mm; width: 100%; }
.underline.long { flex: 1; min-width: 40mm; border-bottom: 0.4pt solid #000; min-height: 6mm; display: inline-block; }
.underline.short { flex: 0 0 40mm; border-bottom: 0.4pt solid #000; min-height: 6mm; display: inline-block; }
.f4-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 14pt !important; }
.f4-table th, .f4-table td { border: 0.4pt solid #000; padding: 1.5mm 1mm; vertical-align: middle; font-size: 14pt !important; }
.f4-table th { text-align: center; font-weight: 700 !important; }
.f4-table td { text-align: left !important; }
.f4-table td.col-no { text-align: center !important; vertical-align: top !important; padding-top: 1mm; }
.f4-table td.col-result { text-align: center !important; font-weight: 700; }
.col-no { width: 14mm; } .col-desc { width: 75mm; } .col-result { width: 30mm; } .col-remark { width: auto; }
.note-block { margin-top: 4mm; font-size: 16pt !important; }
.note-line { line-height: 1.4 !important; }
.footer-note { margin-top: 3mm; font-size: 16pt !important; }
.freq-label { font-weight: 700; } .freq-value { font-weight: 400; }
.align-left { text-align: left !important; }

/* F5 */
.summary-box { width: 100%; border-collapse: collapse; border: 0.4pt solid #000; margin-bottom: 8mm; }
.summary-box td { padding: 4mm; text-align: left; line-height: 2.5; }
.f5-table { width: 100%; border-collapse: collapse; }
.f5-table td { border: 0.4pt solid #000; padding: 3mm 2mm; vertical-align: middle; }
.col-label { width: 90mm; } .col-right-4 { width: auto; } .small-box { width: auto; border: 0.4pt solid #000; }
.merged-text { line-height: 2.5 !important; }

/* F6 */
.f6-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.f6-table td, .f6-table th { border: 1px solid #000; padding: 2mm; width: 25%; vertical-align: middle; font-weight: 400 !important; }
.f6-table th { font-weight: 700; text-align: center; font-size: 16pt !important; }
.align-center { text-align: center !important; }
.multi-line-cell { padding: 3mm 2mm; line-height: 1.4; }
.multi-line-cell div { margin-bottom: 1mm; }
/* ช่องค่า CR/DR (คาสเซท + เครื่องอ่าน) ไม่ให้มีเส้นขีด แสดงเหมือนข้อมูลเบื้องต้น */
.multi-line-cell .underline.short { text-decoration: none !important; }
.full-underline { display: inline-block; border-bottom: 0.4pt solid #000; width: 40mm; height: 4mm; vertical-align: middle; }
.short-line { width: 25mm; }
.device-info-row { display: flex; flex-wrap: wrap; gap: 4mm; align-items: baseline; }
.val-underline { display: inline-block; border-bottom: 0.4pt solid #000; min-width: 25mm; padding: 0 2mm 0.5mm; vertical-align: baseline; }
.val-underline.wide { min-width: 40mm; }
.section-header td { font-weight: 700; }
.ei-header th { font-weight: 700; }
.empty-row td { height: 10mm; }
.signature-block { margin-top: 20mm; text-align: right; font-size: 16pt !important; }
.sig-line { margin-bottom: 3mm; font-size: 16pt !important; }

@media print {
  .f3-table td, .f4-table th, .f4-table td, .f5-table td, .summary-box td, .f6-table td, .f6-table th { border: 1px solid #000 !important; }
}
</style>

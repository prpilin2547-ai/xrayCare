<template>
  <div class="content-panel">
    <div class="table-wrapper">
      <table class="check-table">
        <tbody>
          <tr class="row-header-main">
            <td colspan="4" class="text-center">
              แบบบันทึก F4 : แบบบันทึกการตรวจสอบเครื่องเอกซเรย์ (ทุก 3 เดือน)
            </td>
          </tr>

          <!-- header info -->
          <!-- <tr>
            <td class="cell-label">เครื่องเอกซเรย์ที่ห้อง</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.room"
                class="input-cell"
                placeholder="เช่น ห้อง X-ray 1"
              />
            </td>
          </tr> -->
          <tr>
            <!-- <td class="cell-label">รุ่น</td>
            <td>
              <input type="text" v-model="form.model" class="input-cell" />
            </td> -->
            <!-- <td class="cell-label small">วันที่</td>
            <td>
              <input type="date" v-model="form.date" class="input-cell" />
            </td> -->
          </tr>
          <!-- <tr>
            <td class="cell-label">ผู้ทดสอบ</td>
            <td colspan="3">
              <input
                type="text"
                v-model="form.tester"
                class="input-cell"
                :placeholder="currentUserName"
              />
            </td>
          </tr> -->

          <tr class="row-header-columns">
            <td style="width: 40px">ลำดับที่</td>
            <td>รายการตรวจสอบ</td>
            <td class="text-center" style="width: 70px">ผ่าน (✓)</td>
            <td class="text-center" style="width: 180px">หมายเหตุ</td>
          </tr>

          <tr v-for="item in form.items" :key="item.id">
            <td class="text-center">{{ item.order }}</td>
            <td class="cell-label">
              {{ item.label }}
            </td>
            <td class="text-center">
              <input type="checkbox" v-model="item.pass" />
            </td>
            <td>
              <input
                type="text"
                v-model="item.remark"
                class="input-cell"
                placeholder="ระบุถ้ามีข้อสังเกต"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- หมายเหตุ + ถัดไป -->
    <div class="remark-actions">
      <div class="remark-box">
        <label class="field-label">หมายเหตุรวม (F4)</label>
        <textarea
          v-model="form.remark"
          class="input-textarea"
          placeholder="สรุปผลการตรวจ / ข้อเสนอแนะ..."
        ></textarea>

       <div class="mt-2">
           <label class="form-label text-small mb-1">แนบไฟล์ภาพหรือเอกสาร</label>
          <input
            type="file"
            class="form-control form-control-sm"
            @change="onFileChange"
          />
          <p v-if="attachmentFileName" class="file-name small mt-1">
            ไฟล์ที่เลือก: {{ attachmentFileName }}
          </p>
        </div>

        <p class="footnote">
          * ในระบบ DR ให้ทวนสอบค่าทางเทคนิคว่าถูกต้องเป็นปัจจุบัน<br />
          ** ไม่ต้องทดสอบสำหรับเครื่องเอกซเรย์เคลื่อนที่
        </p>
      </div>

      <button class="btn-next" @click="submitNext">
        ถัดไป
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  initial: Object,
  currentUserName: String
})

const emit = defineEmits(['next'])

const defaultForm = () => ({
  room: '',
  model: '',
  date: '',
  tester: props.currentUserName || '',
  items: [
    {
      id: '1',
      order: 1,
      label:
        'สภาพสายไฟฟ้าไม่มีรอยแตก บิดงอหรือเป็นปมสาย และไม่ถูกอุปกรณ์ที่มีน้ำหนักกดทับสาย',
      pass: false,
      remark: ''
    },
    {
      id: '2',
      order: 2,
      label:
        'ระบบอินเตอร์ล็อคและเบรกทำงานอย่างถูกต้อง',
      pass: false,
      remark: ''
    },
    {
      id: '3',
      order: 3,
      label:
        'การเคลื่อนที่ของ เตียง หัวหลอดเอกชเรย์ และบัคกี้ เป็นไปอย่างราบรื่น',
      pass: false,
      remark: ''
    },
    {
      id: '4',
      order: 4,
      label:
        'สวิตช์แผงควบคุม ไฟแสดงสถานะต่างๆ และมิเตอร์แสดงค่าทางเทคนิคทำงานและมองเห็นอย่างชัดเจน',
      pass: false,
      remark: ''
    },
    {
      id: '5',
      order: 5,
      label:
        'แสงไฟจากคอลลิเมเตอร์มีความเข้มแสงเพียงพอต่อการปฏิบัติงานในขณะที่เปิดไฟห้องปฏิบัติการ และคอลลิเมเตอร์ปราศจากฝุ่น',
      pass: false,
      remark: ''
    },
    {
      id: '6',
      order: '6*',
      label:
        'มีแผนภูมิค่าทางเทคนิคที่ใช้อยู่ในปัจจุบันแสดงอยู่ใกล้แผงควบคุม',
      pass: false,
      remark: ''
    },
    {
      id: '7',
      order: 7,
      label:
        'ไม่มีน้ำมันระบายความร้อนรั่วรอบหลอดเอกซเรย์ ถังเครื่องกำเนิดไฟฟ้าแรงสูง และปราศจากฝุ่น',
      pass: false,
      remark: ''
    },
    {
      id: '8',
      order: 8,
      label: 'แผ่นรับภาพสะอาดและปราศจากสิ่งแปลกปลอม',
      pass: false,
      remark: ''
    },
    {
      id: '9',
      order: 9,
      label:
        'บนเวิร์กสเตชัน ให้แสดงภาพทางคลินิกล่าสุด ในภาพตรวจสอบเวลาและวันที่ รวมถึงการระบุสถานที่ และคำอธิบายประกอบอื่นๆถูกต้อง',
      pass: false,
      remark: ''
    },
    {
      id: '10',
      order: 10,
      label:
        'ที่หลอดเอกซเรย์และเครื่องกำเนิดไฟฟ้ามีป้ายบอกรุ่น หมายเลขซีเรียลอ่านได้ชัดเจน หรือมีการบันทึกเก็บไว้เป็นเอกสารคุณภาพ',
      pass: false,
      remark: ''
    },
    {
      id: '11',
      order: 11,
      label:
        'อุปกรณ์ป้องกันรังสี เช่น เสื้อตะกั่ว ไทรอยด์ชิลด์ อุปกรณ์กำบังรังสืบริเวณอวัยวะสืบพันธุ์ ไม่ชำรุดหรือฉีกขาดสะอาดและมีการจัดเก็บอย่างเหมาะสม',
      pass: false,
      remark: ''
    },
    {
      id: '12',
      order: '12**',
      label:
        'สามารถมองเห็นผู้ป่วยจากห้องควบคุมโดยไม่มีสิ่งกีดขวางบดบังผ่านจากช่องมองกระจก หรือมีระบบกล้องวงจรปิด',
      pass: false,
      remark: ''
    },
    {
      id: '13',
      order: '13**',
      label:
        'ป้ายและสัญลักษณ์เตือนภัยทางรังสีติดหน้าประตูและไฟเตือนขณะฉายรังสีหน้าห้องปฏิบัติการ',
      pass: false,
      remark: ''
    },
    {
      id: '14',
      order: '14**',
      label: 'ช่องหรือบักกี้ใส่คาสเซทและตัวล็อคทำงานปกติ',
      pass: false,
      remark: ''
    },
    {
      id: '15',
      order: '15**',
      label:
        'ศูนย์กลางลำรังสีกับเตียง ตัวเลขบอกระยะ SID หรือขนาดแสงไฟ ถูกต้อง',
      pass: false,
      remark: ''
    }
  ],
  remark: '',
  file: null,
  fileName: ''
})

const form = ref(props.initial || defaultForm())

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.file = file || null
  form.value.fileName = file ? file.name : ''
}

const submitNext = () => {
  emit('next', form.value)
}
</script>

<style scoped>
@import './_formTableCommon.css';
/* ใช้ไฟล์รวม หรือคัดลอก style จาก F3 ก็ได้
   ถ้าไม่ใช้ @import ก็สามารถคัดลอก style จาก F3 มาได้เหมือนกัน */
   .text-small {
  font-size: 0.875em;
}
</style>

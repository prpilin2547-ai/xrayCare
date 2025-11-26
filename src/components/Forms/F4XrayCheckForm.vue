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
        'สภาพสายไฟฟ้าไม่มีรอยแตก บิดงอ หรือซ่อมปะ และไม่ถูกอุปกรณ์หนักกดทับหรือพันกัน',
      pass: false,
      remark: ''
    },
    {
      id: '2',
      order: 2,
      label:
        'ระบบล็อกของตู้เอกซเรย์และแขนท่อเอกซเรย์ทำงานถูกต้อง',
      pass: false,
      remark: ''
    },
    {
      id: '3',
      order: 3,
      label:
        'การเคลื่อนที่ของเตียง หัวหลอดเอกซเรย์ และบักกี้ เป็นไปอย่างราบรื่น',
      pass: false,
      remark: ''
    },
    {
      id: '4',
      order: 4,
      label:
        'สวิตช์และแผงควบคุม ไฟแสดงสถานะต่าง ๆ และอินดิเคเตอร์แสดงค่าทำงานชัดเจน',
      pass: false,
      remark: ''
    },
    {
      id: '5',
      order: 5,
      label:
        'แสงไฟจากคอลิมเตอร์มีความเข้มและเพียงพอต่อการปฏิบัติงาน และซองคอลิมเตอร์ปิดทุกด้าน',
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
        'ไม่มีน้ำมันสะสมหรือน้ำรั่วรอบห้องเอกซเรย์ อันเนื่องมาจากเครื่องกำเนิดไฟฟ้าหรือระบบหล่อเย็น',
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
        'บันทึกรังสีด้าน ให้แสงภาพทางเทคนิคที่ชัดเจนในภาพตรวจสอบ และระบุเวลา วันที่ สถานที่ และคำอธิบายประกอบอย่างถูกต้อง',
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
        'อุปกรณ์ป้องกันรังสี เช่น เสื้อคลุมตะกั่ว ไทรอยด์ชีลด์ และอุปกรณ์กำบังรังสีอื่น ๆ สะอาด ไม่ชำรุด และพร้อมใช้งาน',
      pass: false,
      remark: ''
    },
    {
      id: '12',
      order: '12**',
      label:
        'สามารถมองเห็นผู้ป่วยจากห้องควบคุมโดยไม่มีสิ่งกีดขวาง หรือมีระบบกล้องวงจรปิดช่วยเฝ้าดูผู้ป่วย',
      pass: false,
      remark: ''
    },
    {
      id: '13',
      order: '13**',
      label:
        'ป้ายและสัญญาณเตือนการฉายรังสีที่บริเวณหน้าประตูและไฟเตือนขณะฉายรังสีทำงานปกติ',
      pass: false,
      remark: ''
    },
    {
      id: '14',
      order: '14**',
      label: 'ช่องหรือบานฝาปิดที่โล่กำบังรังสีและห้องทำงานปกติ',
      pass: false,
      remark: ''
    },
    {
      id: '15',
      order: '15**',
      label:
        'ศูนย์กลางลำรังสีสัมพันธ์กับคอลิเมเตอร์ ตำแหน่งระยะ SID หรือขนาดลำแสงถูกต้อง',
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

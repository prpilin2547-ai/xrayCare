<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">PM Schedule</h2>

      <div class="selected-date-card">
        <div class="date-icon">📅</div>
        <div class="date-text">
          <p class="date-main">7 มกราคม 2022</p>
          <p class="date-sub">วันศุกร์</p>
        </div>
      </div>

      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn">&lt;</button>
          <span class="month-title">January 2022</span>
          <button class="nav-btn">&gt;</button>
        </div>

        <div class="calendar-grid">
          <div class="weekday" v-for="d in weekdays" :key="d">
            {{ d }}
          </div>

          <div
            v-for="cell in daysGrid"
            :key="cell.key"
            class="day-cell"
            :class="{
              'is-empty': !cell.day,
              'is-selected': cell.day === 7,
              'has-tag': cell.day === 18
            }"
            @click="cell.day === 18 ? togglePopup($event) : null" 
            :style="{ cursor: cell.day === 18 ? 'pointer' : 'default' }"
          >
            <div class="day-number">
              <span v-if="cell.day">{{ cell.day }}</span>
            </div>
            <div v-if="cell.day === 18" class="tag">
              Monthly check
            </div>
          </div> </div>
      </div> <div v-if="isPopupVisible" class="popup-overlay" @click="isPopupVisible = false">
        <div 
          class="popup-box" 
          :style="{ top: popupPosition.top, left: popupPosition.left }"
          @click.stop
        >
          <div class="popup-header">
            <h3 class="popup-title">Monthly Check</h3>
            <span class="add-btn" @click="openAddPopup($event)">+</span> 
          </div>
          
          <div class="popup-content"> 
            <p class="highlight-red">ทำประจำทุก 3 เดือน</p>
            <p>วันอังคารที่ 18 มกราคม 2022</p>
            <p class="maintenance-title">รายการ Maintenance</p>
            <ul>
              <li>การควบคุมคุณภาพจอภาพ</li>
              <li>แบบบันทึกการตรวจสอบเครื่องเอกซเรย์</li>
              <li>ความสม่ำเสมอของภาพ</li>
              <li>ความคงที่ของค่าดัชนีปริมาณรังสี</li>
            </ul>
          </div>
        </div> 
      </div> <div v-if="isAddPopupVisible" class="add-popup-overlay">
        <div 
          class="add-popup-box" 
          :style="{ top: addPopupPosition.top, left: addPopupPosition.left }"
          @click.stop
          @mouseleave="closeAddPopupOnMouseLeave" 
          @mouseover="isAddPopupVisible = true" 
        >
          <div class="add-popup-header">
            <span class="btn-action btn-cancel" @click="isAddPopupVisible = false">ยกเลิก</span>
            <span class="btn-action btn-new">ใหม่</span>
            <span class="btn-action btn-add">เพิ่ม</span>
          </div>
          <div class="add-popup-content">
            <p class="add-popup-red-text">ตัวอักษรสีแดง</p> 
            <input type="text" placeholder="ชื่อ" class="input-name" /> 
          </div>
        </div>
      </div> </div> </MainLayout>
</template>
<script setup>
import { computed, ref, nextTick } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// January 2022 starts on Saturday (index 6), 31 days
const daysGrid = computed(() => {
    const cells = []
    const startDay = 6
    const totalDays = 31

    for (let i = 0; i < startDay; i++) {
        cells.push({ key: `empty-${i}`, day: null })
    }
    for (let d = 1; d <= totalDays; d++) {
        cells.push({ key: `day-${d}`, day: d })
    }
    return cells
})

// 📍 ตัวแปรสำหรับ Pop-up หลัก
const isPopupVisible = ref(false)
const popupPosition = ref({ top: '0px', left: '0px' })

// 📍 ตัวแปรสำหรับ Pop-up ซ้อน
const isAddPopupVisible = ref(false) 
const addPopupPosition = ref({ top: '0px', left: '0px' }) 

const togglePopup = (event) => {
    const wasVisible = isPopupVisible.value;
    isPopupVisible.value = !wasVisible;

    if (!wasVisible) {
        const targetElement = event.currentTarget;
        const rect = targetElement.getBoundingClientRect();
        
        nextTick(() => {
            const popupElement = document.querySelector('.popup-box');
            if (popupElement) {
                // ปรับตำแหน่งให้เหมาะสมตามรูป
                popupPosition.value.top = `${rect.top + window.scrollY - 320}px`; 
                popupPosition.value.left = `${rect.left + window.scrollX - 250}px`;
            }
        });
    }
}

// 📍 ฟังก์ชันสำหรับเปิด Pop-up ใหม่
const openAddPopup = (event) => {
    isAddPopupVisible.value = true;
    
    const rect = event.currentTarget.getBoundingClientRect();

    nextTick(() => {
        const popupElement = document.querySelector('.add-popup-box');
        if (popupElement) {
            addPopupPosition.value.top = `${rect.top + window.scrollY - 15}px`; 
            addPopupPosition.value.left = `${rect.left + window.scrollX - 250}px`; 
        }
    });
}

// 📍 ฟังก์ชันสำหรับปิด Pop-up ใหม่ เมื่อเมาส์ออก
const closeAddPopupOnMouseLeave = () => {
    setTimeout(() => {
        if (isAddPopupVisible.value) {
            isAddPopupVisible.value = false;
        }
    }, 150); 
}
</script>
<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;          
  max-width: 500px;     
  margin: 0 auto;       
  padding: 20px 0;
  align-items: center;  
  width: 100%;
}

.page-title {
  margin: 0;
}

.selected-date-card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  background: #f9fafb;
  width: 100%;       
  max-width: 480px;
}

.date-icon {
  font-size: 1.4rem;
}

.date-main {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
}

.date-sub {
  margin: 0;
  font-size: 0.86rem;
  color: #6b7280;
}

.calendar-card {
  margin-top: 4px;
  background: white;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  padding: 12px 16px 16px;
  max-width: 480px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 10px;
}

.month-title {
  font-weight: 600;
}

.nav-btn {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: white;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  font-size: 0.8rem;
}

.weekday {
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  padding: 4px 0;
}

.day-cell {
  min-height: 50px;
  border-radius: 10px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.day-cell.is-empty {
  background: transparent;
}

.day-number span {
  font-size: 0.85rem;
}

.day-cell.is-selected {
  border: 1px solid #111827;
}

.has-tag .day-number span {
  margin-bottom: 2px;
}

.tag {
  margin-top: 2px;
  padding: 2px 4px;
  border-radius: 999px;
  font-size: 0.7rem;
  background: #dbeafe;
  color: #1d4ed8;
  white-space: nowrap; 
  line-height: 1;
}

.gear-icon {
  position: absolute;
  right: 0px;
  bottom: 0px;
  font-size: 1.5rem;
  color: #6b7280;    
  cursor: pointer;
  margin-right: 20px; 
  margin-bottom: 20px;
}
/* 📍 3. CSS สำหรับ Pop-up Overlay และ Modal Box */

.day-cell {
    /* ... โค้ดเดิม ... */
    cursor: default; /* ให้ใช้ cursor: pointer เฉพาะวันที่ 18 */
}

.day-cell[style*="cursor: pointer"] {
    cursor: pointer !important;
}

/* Overlay สำหรับปิด Modal เมื่อคลิกด้านนอก */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999; 
    background-color: rgba(0, 0, 0, 0.05); /* พื้นหลังโปร่งใสเล็กน้อย */
}

.popup-box {
    position: absolute; /* 📍 ทำให้ Pop-up ลอยอยู่เหนือองค์ประกอบอื่น */
    width: 300px; 
    padding: 20px;
    background-color: #ffe6db; /* สีส้มอ่อนตามภาพตัวอย่าง (อาจปรับเข้มกว่านี้เป็น #f7a072 ถ้าต้องการ) */
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000; 
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #fff;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.popup-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #333; /* Monthly Check สีดำ/เทาเข้ม */
}
/* 📍 เพิ่มหรือแก้ไขโค้ดนี้ เพื่อให้ <p class="highlight-red"> เป็นสีแดงและตัวหนา */
.popup-content .highlight-red {
    color: #e24e42; /* สีแดง */
    font-weight: bold; /* ทำให้เด่นชัดขึ้น */
}

.popup-content p {
    margin: 8px 0;
    font-size: 1.1rem;
    color: #333;
}

.popup-content strong {
    font-weight: bold;
}

.maintenance-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 15px !important;
    margin-bottom: 5px !important;
}

.popup-content ul {
    list-style-type: none;
    padding-left: 0;
}

.popup-content li {
    font-size: 1rem;
    margin-bottom: 5px;
    color: #333;
    position: relative;
    padding-left: 15px;
}

.popup-content li::before {
    content: '–'; 
    position: absolute;
    left: 0;
    color: #333;
    font-weight: bold;
}

.popup-header {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    /* ... โค้ดอื่นๆ ... */
}

/* 📍 แก้ไข/ยืนยัน: สไตล์สำหรับปุ่มบวก (+) ที่มุมขวาบน */
.add-btn {
    cursor: pointer;
    font-size: 2rem;
    color: #e24e42; /* สีแดง */
    line-height: 1;
    /* 📍 สำคัญ: ต้องแน่ใจว่าไม่มีการ transform: rotate(45deg); ในคลาสนี้ */
    transform: none; 
}
.add-popup-box {
    position: absolute; /* 📍 ใช้ absolute เพื่อกำหนดตำแหน่งด้วย addPopupPosition */
    width: 280px; 
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    padding: 10px;
    z-index: 1002;
    background-color: #f7f7f7; /* สีพื้นหลังอ่อน */
    pointer-events: auto; /* ทำให้กล่องนี้รับ Event เมาส์ */
}

.add-popup-header {
    display: flex;
    justify-content: space-between;
    padding: 0 5px 8px 5px;
}

.btn-action {
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
}

.btn-cancel {
    color: #6b7280; /* ยกเลิก: สีเทา */
}

.btn-new {
    color: #e24e42; /* ใหม่: สีแดง */
}

.btn-add {
    color: #1d4ed8; /* เพิ่ม: สีน้ำเงิน (ถ้าต้องการสีแดงเหมือน "ใหม่" ให้เปลี่ยนเป็น #e24e42) */
}

.add-popup-content {
    padding: 0 5px 10px 5px;
}

/* 📍 สไตล์สำหรับข้อความสีแดงใน Pop-up ใหม่ */
.add-popup-red-text {
    color: #e24e42; 
    font-weight: bold;
    margin: 5px 0 10px 0 !important;
}

.input-name {
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
    font-size: 1rem;
    box-sizing: border-box;
    /* 📍 สีเทาในกรอบ */
    color: #6b7280; 
}
</style>
# X-Ray Care Setup Guide

## สิ่งที่ทำเสร็จแล้ว ✓

### 1. Git & GitHub Setup
- ✓ สร้าง `.gitignore` ครบถ้วน
- ✓ สร้าง `reset_git.ps1` script เพื่อ reset history และ push ไป GitHub
- **ยังต้องทำ:** รัน PowerShell script เพื่อ push ไป `https://github.com/prpilin2547-ai/xrayCare.git`

### 2. Router Configuration
- ✓ เพิ่ม `DairyCheckPage` import ใน `src/router/index.js`
- ✓ เพิ่ม route: `/dairy-check` (name: `DairyCheckPage`)

### 3. Dashboard Feature - Clickable Equipment
- ✓ ทำให้ equipment cell ใน Dashboard table กดได้
- ✓ เมื่อกดจะเชื่อมไปยัง `DairyCheckPage`
- ✓ ส่งชื่อเครื่อง (equipment name) ผ่าน route params

### 4. DairyCheckPage - Receive Equipment
- ✓ Import `useRoute` จาก `vue-router`
- ✓ สกัด `equipment` จาก `route.params.equipment`
- ✓ สามารถใช้ตัวแปร `equipment` ได้ทั่วไฟล์

---

## วิธีการใช้

### ขั้นตอนที่ 1: Push ไป GitHub
รัน PowerShell script นี้ในเครื่องของคุณ:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\test4\reset_git.ps1
```

**จะเกิดอะไรขึ้น:**
1. Backup `.git` folder (ถ้ามี)
2. Initialize fresh git repo
3. Add ไฟล์ทั้งหมด (node_modules จะถูกละไว้เพราะ .gitignore)
4. Commit ครั้งแรก
5. Set remote ไป `https://github.com/prpilin2547-ai/xrayCare.git`
6. Force-push ไป main branch

### ขั้นตอนที่ 2: ทดสอบ Equipment Link
1. รัน dev server:
```bash
npm run dev
```

2. ไป Dashboard
3. กดชื่อเครื่องใดก็ได้ (เช่น "Shimazu")
4. จะไปหน้า DairyCheckPage และแสดง equipment ที่เลือก

### ขั้นตอนที่ 3: ใช้ Equipment ใน DairyCheckPage
ใน `DairyCheckPage.vue`, ตัวแปร `equipment` พร้อมใช้งาน:

```javascript
// ตัวอย่าง:
console.log(equipment) // "Shimazu"

// ใช้ใน template:
<p>{{ equipment }}</p>
```

---

## MongoDB Connection (ต่อไป)
- ✓ MongoDB ติดตั้งแล้ว
- ยังต้องทำ: 
  - สร้าง backend server (Node + Express + Mongoose)
  - Connect ไป MongoDB
  - Create API endpoints สำหรับ equipment data

---

## File Structure ที่เพิ่มมา

```
c:\test4\
├── .gitignore          (อัพเดทแล้ว)
├── reset_git.ps1       (script ใหม่)
├── SETUP_GUIDE.md      (ไฟล์นี้)
└── src/
    ├── router/
    │   └── index.js    (เพิ่ม DairyCheckPage route)
    └── pages/
        ├── Dashboard.vue           (เพิ่ม clickable equipment)
        └── DairyCheckPage.vue      (เพิ่ม useRoute)
```

---

## ต่อไปต้องทำ

1. **Push to GitHub** — รัน reset_git.ps1
2. **Setup Backend** — Node + Express + MongoDB
3. **API Integration** — Connect Dashboard ← → Backend ← → MongoDB
4. **Equipment Data Management** — CRUD operations

---

## ติดต่อ / ปัญหา

ถ้ามีปัญหากับ:
- **Git push:** ตรวจสอบ GitHub authentication
- **Equipment link:** ตรวจสอบชื่อ route (`DairyCheckPage`)
- **MongoDB:** ตรวจสอบ service running (`Get-Service MongoDB`)

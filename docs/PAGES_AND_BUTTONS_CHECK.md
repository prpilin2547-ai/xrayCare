# รายงานตรวจสอบทุกหน้าและปุ่มในแอป (Pages & Buttons Check)

## สรุป routes และหน้าที่มีในระบบ

| Path | Component | ใช้ MainLayout | หมายเหตุ |
|------|-----------|----------------|----------|
| `/` | redirect | - | ไป `/login` |
| `/login` | Login.vue | ไม่ใช้ | หน้าเข้าสู่ระบบ |
| `/dashboard` | Dashboard.vue | ใช้ | หน้าแรก Tech |
| `/dairy-check/:equipmentName` | DairyCheckPage.vue | ใช้ | ตรวจรายวัน (จาก Dashboard) |
| `/machines/create` | MachinesCreate.vue | ใช้ | ลงทะเบียนเครื่อง |
| `/analytics` | Analytical.vue | ใช้ | วิเคราะห์ (Tech) |
| `/pm-schedule` | PMSchedule.vue | ใช้ | ตาราง PM |
| `/export-pdf` | ExportPdf.vue | ใช้ | Export Report → เลือก type แล้วไป formprint |
| `/profile` | UserProfile.vue | ใช้ | โปรไฟล์ผู้ใช้ |
| `/requests` | RequestList.vue | ใช้ | รายการแจ้งซ่อม + Modal เพิ่มรายการ |
| `/requests/new` | RequestForm.vue | ใช้ | ฟอร์มแจ้งซ่อม (หน้าเดียว) |
| `/admindashboard` | Dashboarddmin.vue | ใช้ | หน้าแรก Admin |
| `/engineerdashboard` | DashboardEN.vue | ใช้ | หน้าแรก Engineer |
| `/analyticalen` | AnalyticalEN.vue | ใช้ | วิเคราะห์ (Engineer) |
| `/requesten` | RequestEN.vue | ใช้ | แจ้งซ่อม (Engineer) |
| `/adminuseraccount` | Adminuseraccount.vue | ใช้ | จัดการบัญชีผู้ใช้ (Admin) |
| `/adminanalytical` | Adminanalytical.vue | ใช้ | วิเคราะห์ (Admin) |
| `/checklist-next` | ChecklistNext.vue | ใช้ | Checklist ถัดไป |
| `/monthly-check` | MonthlyCheckPage.vue | ใช้ | ตรวจรายเดือน |
| `/monthly-check-light` | F10LightCheckPage.vue | ใช้ | ตรวจแสง (มี props) |
| `/monthly-check-all` | MonthlyCheckAll.vue | ใช้ | ตรวจรายเดือนทั้งหมด |
| `/f12` | F12.vue | ใช้ | แบบ F12 อัตราการถ่ายภาพซ้ำ |
| `/f9` | F9ProtectiveClothesForm.vue | ใช้ | แบบ F9 เสื้อตะกั่ว |
| `/f11` | F11.vue | ใช้ | แบบ F11 ความหนาผู้ป่วย |
| `/f13` | F13.vue | ใช้ | แบบ F13 B-mode QC |
| `/qc-forms` | QCFormsHub.vue | ใช้ | Hub แบบฟอร์ม QC + ลิงก์ไป F9,F11,F12,F13, Custom |
| `/custom-form-builder` | CustomFormBuilder.vue | ใช้ | สร้างแบบฟอร์มเอง |
| `/formprint/xray-f1` … `xray-f13` | XrayF*Print.vue | ไม่ใช้ | หน้ากระดาษสำหรับพิมพ์ (มีปุ่ม Print) |

---

## การตรวจสอบปุ่มและ Navigation

### Sidebar (MainLayout → SidebarNav)
- ทุกเมนูมี `@click="$emit('navigate', ...)"` และ MainLayout มี `onNavigate` ที่ `router.push(...)` ครบ
- Logout: ลบ `xraycare-user` แล้วไป `/login` — ทำงานถูกต้อง
- **หมายเหตุ:** Sidebar แสดงทุกเมนู (Dashboard, Equipment, PM, Export, Analytical, Request, Admin*, Engineer*, Additional Forms) โดยไม่ซ่อนตาม role — ถ้าต้องการให้เมนูตามสิทธิ์ต้องเพิ่ม `v-if` ตาม position

### หน้า Login
- ปุ่ม Login: `@submit.prevent="handleLogin"` — เรียก API แล้ว redirect ตาม position
- ไม่มี dead link

### Dashboard (Tech)
- ปุ่ม **＋** (เพิ่มเครื่อง): `goToMachinesCreate` → `/machines/create` ✅
- ปุ่ม **CHECK** ในตาราง: `goToDairyCheck(row.equipment)` → `DairyCheckPage` with params ✅
- ปุ่มเดือนก่อน/ถัดไปในปฏิทิน: `goPrevMonth` / `goNextMonth` ✅
- คลิกวันในปฏิทิน: `openDayPopup` ✅

### RequestList
- ปุ่ม **เพิ่มรายการ**: เปิด Modal แจ้งซ่อม (ไม่ไป `/requests/new`) — ใช้ฟอร์มใน Modal
- **ดูรายละเอียด**: `openDetail(item)` แสดง view รายละเอียด ✅
- **ลบ**: `deleteItem(item.id)` ✅
- ปุ่ม **ไฟล์ภาพ**: แสดง modal รูป ✅
- ปุ่มกากบาทปิดรายละเอียด: `closeDetail` ✅

### RequestForm (`/requests/new`)
- ปุ่ม **แจ้งซ่อม**: `type="submit"` → `submitForm` — **แก้แล้ว:** refs ย้ายออกจากในฟังก์ชัน และหลัง submit ไป `/requests` ✅
- ปุ่มเลือกอุปกรณ์: ยังเป็น `type="button"` แต่ยังไม่ผูก dropdown/API — ใช้เป็น mock ได้

### ExportPdf
- เลือก machine, checklist type, date แล้วกดปุ่มไปหน้า Print: `goToXrayPrint()` → `router.push({ name: routeName, query: {...} })`
- `checklistRouteMap` ตรงกับชื่อ route ใน router (XrayF1Print … XrayF13Print) ทุกตัว ✅

### QCFormsHub
- ปุ่ม **สร้างแบบบันทึก**: `goToCreateForm` → `/custom-form-builder` ✅
- การ์ดแต่ละแบบ: `openForm(form.route)` → `/f9`, `/f11`, `/f12`, `/f13` ตามที่กำหนด ✅
- ปุ่มลบแบบที่สร้างเอง: `deleteCustomForm(form.id)` ✅

### CustomFormBuilder
- ปุ่มกลับ/ยกเลิก: `router.push('/qc-forms')` ✅

### หน้าฟอร์ม F9, F10, F11, F12, F13 และหน้าตรวจ (Dairy, Monthly, ChecklistNext)
- ปุ่มกลับ/เสร็จสิ้น: `router.push('/dashboard')` หรือ `/monthly-check` ตามหน้า ✅

### Formprint (XrayF1Print … XrayF13Print)
- ไม่ใช้ MainLayout (ออกแบบให้เป็นหน้ากระดาษสำหรับพิมพ์)
- ปุ่ม **Print**: `handlePrint` — ใช้ `window.print()` ✅

### Adminuseraccount
- มีปุ่ม/ฟอร์มจัดการ user ตาม logic ในหน้า (เพิ่ม/แก้/ลบ) — ต้องทดสอบกับ API จริง

### Adminanalytical / AnalyticalEN / Analytical
- ปุ่มและกราฟเป็นข้อมูลตัวอย่าง/ mock — ไม่มี navigation ผิด

---

## สิ่งที่แก้ไปแล้ว

1. **RequestForm.vue**
   - ย้าย `detail`, `fileInput`, `selectedFile`, `fileName`, `triggerFileSelect`, `onFileSelected` ออกจากภายในฟังก์ชัน `submitForm` มาไว้ที่ top level — ก่อนหน้านี้ template ใช้ `v-model="detail"` ไม่ได้เพราะ `detail` อยู่ภายในฟังก์ชัน
   - หลัง submit: เพิ่ม `router.push('/requests')` ให้กลับไปหน้ารายการแจ้งซ่อม

2. **MainLayout.vue (activeMenu)**
   - ให้ path เหล่านี้ highlight sidebar ถูกต้อง:
     - `/custom-form-builder`, `/f9`, `/f11`, `/f12`, `/f13` → เมนู **Additional Forms**
     - `/monthly-check`, `/checklist-next`, `/dairy-check` → เมนู **Dashboard**
   - (เมนู Request ตรงกับ `/requests` อยู่แล้ว รวม `/requests/new`)

---

## สรุป

- **ไม่มีลิงก์หรือ router.push ไป path ที่ไม่มีใน router**
- **ปุ่มหลัก (Login, Dashboard, Request, Export, QC Forms, Formprint, Logout) ทำงานถูกต้อง**
- **แก้บั๊ก RequestForm** (refs ใน scope ผิด + redirect หลัง submit)
- **ปรับ activeMenu** ให้ sidebar  highlight ตรงเมื่ออยู่หน้า QC forms และหน้า checklist/dairy

ถ้าต้องการให้เมนู Sidebar แสดงตาม role (เช่น Admin เห็นแค่ Admin*, Engineer เห็นแค่ Engineer* + บางเมนูร่วม) สามารถเพิ่มใน SidebarNav ด้วย `v-if` ตาม `userRole` ที่ส่งจาก MainLayout ได้

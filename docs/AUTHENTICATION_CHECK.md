# Authentication Check (ตาม Flow)

ตรวจสอบตาม flow: **Xray specialist → Frontend → Backend → Database → API → Sec-opt**

---

## 1. Xray specialist (การใช้งาน / Workflow)

| หัวข้อ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| หน้า Login | ✅ | มีหน้า Login (Username/Password), แสดง error ชัดเจน |
| Redirect ตาม role | ✅ | Admin → /admindashboard, Engineer → /engineerdashboard, อื่นๆ → /dashboard |
| ป้องกันเข้าเมนูโดยไม่ล็อกอิน | ✅ (แก้แล้ว) | เพิ่ม router guard แล้ว — ถ้าไม่ล็อกอินจะถูกส่งไป /login |
| Logout | ✅ | MainLayout ลบ `xraycare-user` แล้วไป /login |

---

## 2. Frontend developer

| หัวข้อ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| เก็บสถานะผู้ใช้หลัง Login | ✅ | เก็บใน `localStorage['xraycare-user']` (id, username, position) |
| Route protection | ✅ (แก้แล้ว) | `router.beforeEach` ตรวจสอบ `xraycare-user` ถ้าไม่มีและไม่ใช่ path สาธารณะ → redirect /login |
| Public path | ✅ | เฉพาะ `/login` เป็น public; path อื่นต้องล็อกอิน |
| ส่ง token ไป API | ⚠️ | Login ไม่คืน token; Backend ไม่มี JWT — API อื่นไม่ตรวจ auth (ดู Backend/API) |
| Commonfunction.js | ⚠️ | อ่าน token จาก `userdata` / `user` / `crm-auth-user` ไม่ได้ใช้ `xraycare-user` — ถ้าเรียก API ที่ต้อง auth ต้องปรับให้สอดคล้องเมื่อมี token จริง |

---

## 3. Backend developer

| หัวข้อ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| Login endpoint | ✅ | `POST /api/Xraycare/Login` รับ username/password, คืน id, username, position |
| การตรวจสอบรหัสผ่าน | ❌ ความเสี่ยง | เปรียบเทียบ plain text (`u.Password == request.password`) — ควร hash (เช่น BCrypt) แล้วเปรียบเทียบ |
| Auth middleware | ❌ | `UseAuthentication()` ถูก comment ไว้ — ไม่มี JWT/session |
| ป้องกัน endpoint อื่น | ❌ | ไม่มี `[Authorize]` — ทุก endpoint เรียกได้โดยไม่ต้องล็อกอิน |

---

## 4. Database developer

| หัวข้อ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| ตารางผู้ใช้ | ✅ | `UserAccount` (Username, Password, Position) |
| เก็บรหัสผ่าน | ❌ ความเสี่ยง | เก็บแบบ plain text — ควรเก็บเฉพาะ hash (ไม่เก็บรหัสผ่านตรงๆ) |
| ไม่มี token/session table | ⚠️ | ถ้าจะทำ JWT ไม่จำเป็นต้องมีตาราง session; ถ้าทำ session-based ต้องมีตารางเก็บ session |

---

## 5. API developer

| หัวข้อ | สถานะ | หมายเหตุ |
|--------|--------|----------|
| สัญญา Login | ✅ | POST body: `{ username, password }` → 200 + `{ id, username, position }` หรือ 401 |
| Auth ใน request อื่น | ❌ | API อื่นไม่รับ/ไม่ตรวจ token หรือ header auth — ใครก็เรียกได้ |
| CORS | ✅ | จำกัด origin (localhost:5173) |

---

## 6. Sec-opt (ความปลอดภัย)

| หัวข้อ | สถานะ | แนะนำ |
|--------|--------|--------|
| รหัสผ่านไม่เข้ารหัส | ❌ | ใช้ hash (BCrypt/Argon2) ทั้งเก็บใน DB และเปรียบเทียบตอน Login |
| ไม่มี auth บน API | ❌ | เพิ่ม JWT (หรือ session) หลัง Login และใส่ `[Authorize]` ใน endpoint ที่ต้องล็อกอิน |
| Rate limit / ล็อกบัญชี | ❌ | พิจารณา rate limit ที่ Login และ lock หลังผิดหลายครั้ง |
| HTTPS | ⚠️ | ปัจจุบันปิด redirect; production ควรใช้ HTTPS |
| ข้อมูลใน localStorage | ⚠️ | เก็บแค่ id/username/position (ไม่เก็บ password) — ถ้าเพิ่ม JWT ควรพิจารณา httpOnly cookie สำหรับ refresh token |

---

## สรุปการแก้ที่ทำแล้ว

- **Router guard:** ถ้าไม่ได้ล็อกอิน (ไม่มี `xraycare-user`) และไปที่ path ที่ไม่ใช่ `/login` จะถูก redirect ไป `/login`  
  ถ้าล็อกอินแล้วไปที่ `/login` จะถูกส่งไป dashboard ตาม role

---

## แนะนำลำดับถัดไป (ถ้าจะเสริมความปลอดภัย)

1. **Backend:** Hash รหัสผ่าน (BCrypt) ตอนสร้าง/แก้ user และตอน Login เปรียบเทียบกับ hash  
2. **Backend:** เพิ่ม JWT — หลัง Login สำเร็จ สร้าง token ส่งให้ frontend; ใส่ `[Authorize]` ใน endpoint ที่ต้องล็อกอิน  
3. **Frontend:** ส่ง `Authorization: Bearer <token>` ในทุก request ไป API ที่ต้อง auth  
4. **Database:** ไม่เก็บรหัสผ่านตรงๆ เก็บเฉพาะ hash

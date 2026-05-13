const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak, ShadingType, Header, Footer, PageNumber, LevelFormat, convertInchesToTwip } = require('docx');
const fs = require('fs');

const C = { DARK:'0F172A', PRIMARY:'2563EB', MID:'1E40AF', LIGHT:'EFF6FF', GRAY:'475569', GRAYLT:'F8FAFC', GREEN_BG:'F0FDF4', GREEN_BD:'86EFAC', YELLOW_BG:'FFFBEB', YELLOW_BD:'FCD34D', RED_BG:'FEF2F2', RED_BD:'FCA5A5', NOTE_BD:'93C5FD' };
const F = 'Cordia New';

const r = (text, opts={}) => new TextRun({ text, size:opts.s||22, font:opts.f||F, bold:opts.b, italics:opts.i, color:opts.c, underline:opts.u ? {} : undefined });
const rb = (text, opts={}) => r(text, { ...opts, b:true });

function parseRuns(text, size=22) {
  const runs = []; const parts = text.split(/(\*\*[^*]+\*\*)/g);
  for (const p of parts) { if (p.startsWith('**')&&p.endsWith('**')) runs.push(rb(p.slice(2,-2),{s:size})); else if(p) runs.push(r(p,{s:size})); }
  return runs;
}

const para = (text, opts={}) => new Paragraph({ children: parseRuns(text, opts.s||22), spacing:{after:opts.after||100}, alignment:opts.align||AlignmentType.JUSTIFIED, indent:opts.indent });
const tocMain = (text) => new Paragraph({ children:[rb(text,{s:24})], spacing:{after:50} });
const tocSub = (text) => new Paragraph({ children:[r(text,{s:21,c:C.GRAY})], spacing:{after:30}, indent:{left:convertInchesToTwip(0.35)} });
const heading1 = (text) => new Paragraph({ children:[rb(text,{s:36,c:C.DARK})], spacing:{before:400,after:140}, border:{bottom:{style:BorderStyle.SINGLE,size:4,color:C.PRIMARY}} });
const heading2 = (text) => new Paragraph({ children:[rb(text,{s:30,c:C.MID})], spacing:{before:320,after:120}, border:{left:{style:BorderStyle.SINGLE,size:6,color:C.PRIMARY,space:8}} });
const heading3 = (text) => new Paragraph({ children:[rb(text,{s:26,c:'1E3A5F'})], spacing:{before:240,after:80} });
const heading4 = (text) => new Paragraph({ children:[rb(text,{s:22,c:'334155'})], spacing:{before:180,after:60} });
const bullet = (text) => new Paragraph({ children:parseRuns(text), bullet:{level:0}, spacing:{after:40} });
function numItem(ref, text) { return new Paragraph({ children:parseRuns(text), numbering:{reference:ref,level:0}, spacing:{after:50} }); }
const PB = () => new Paragraph({ children:[new PageBreak()] });
const SP = (n=200) => new Paragraph({ spacing:{after:n}, children:[] });

function cell(text, opts={}) {
  return new TableCell({
    children:[new Paragraph({children:parseRuns(String(text),opts.hs||20), spacing:{after:20}, alignment:opts.center?AlignmentType.CENTER:undefined})],
    width:opts.w?{size:opts.w,type:WidthType.PERCENTAGE}:undefined,
    shading:opts.bg?{type:ShadingType.SOLID,color:opts.bg}:undefined,
    verticalAlign:opts.va||'center', rowSpan:opts.rs,
  });
}
function hCell(text,w) { return cell('**'+text+'**',{bg:C.LIGHT,w,hs:20,center:false}); }
function hCellC(text,w) { return cell('**'+text+'**',{bg:C.LIGHT,w,hs:20,center:true}); }

function tbl(headers, rows, widths, headerCenter) {
  const hc = headerCenter ? hCellC : hCell;
  const hr = new TableRow({ children:headers.map((h,i)=>hc(h,widths?widths[i]:undefined)), tableHeader:true });
  const drs = rows.map(row=>new TableRow({children:row.map((c,i)=>cell(c,{w:widths?widths[i]:undefined}))}));
  return new Table({ rows:[hr,...drs], width:{size:100,type:WidthType.PERCENTAGE} });
}
function tblC(headers,rows,widths) {
  const hr = new TableRow({ children:headers.map((h,i)=>hCellC(h,widths?widths[i]:undefined)), tableHeader:true });
  const drs = rows.map(row=>new TableRow({children:row.map((c,i)=>cell(c,{w:widths?widths[i]:undefined,center:i>0}))}));
  return new Table({ rows:[hr,...drs], width:{size:100,type:WidthType.PERCENTAGE} });
}

function infoBox(icon, title, text, borderColor=C.PRIMARY) {
  return new Paragraph({
    children:[rb(`${icon} ${title}: `,{s:22,c:C.MID}), r(text,{s:22})],
    spacing:{before:100,after:100},
    indent:{left:convertInchesToTwip(0.2)},
    border:{left:{style:BorderStyle.SINGLE,size:8,color:borderColor}},
  });
}
const noteBox = (text) => infoBox('\u2139','หมายเหตุ',text,C.NOTE_BD);
const tipBox = (text) => infoBox('\u2713','เคล็ดลับ',text,'22C55E');
const warnBox = (text) => infoBox('\u26A0','คำเตือน',text,'F59E0B');

async function generate() {
  const doc = new Document({
    numbering:{config:Array.from({length:20},(_,i)=>({reference:`num${i+1}`,levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',alignment:AlignmentType.LEFT,start:1}]}))},
    styles:{default:{heading1:{run:{size:36,bold:true,color:C.DARK,font:F}},heading2:{run:{size:30,bold:true,color:C.MID,font:F}},heading3:{run:{size:26,bold:true,color:'1E3A5F',font:F}}}},
    sections:[
      // ══ COVER ══
      { properties:{page:{size:{width:convertInchesToTwip(8.27),height:convertInchesToTwip(11.69)},margin:{top:convertInchesToTwip(3),bottom:convertInchesToTwip(1.5),left:convertInchesToTwip(1.2),right:convertInchesToTwip(1.2)}}},
        children:[
          SP(400),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[r('\u2695',{s:96,f:'Segoe UI Symbol',c:C.PRIMARY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:40},children:[rb('X-RayCare',{s:56,c:C.DARK})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:300},children:[r('QC MANAGEMENT SYSTEM',{s:28,c:C.PRIMARY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,border:{top:{style:BorderStyle.SINGLE,size:2,color:C.PRIMARY,space:10}},spacing:{before:200,after:60},children:[rb('คู่มือการใช้งานระบบ',{s:40,c:C.DARK})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:400},children:[r('ระบบจัดการคุณภาพเครื่องเอกซเรย์และอุปกรณ์ทางรังสีวิทยาสำหรับโรงพยาบาล',{s:24,c:C.GRAY})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:60},children:[r('วันที่จัดทำ: ',{s:22,c:C.GRAY}),rb('27 มีนาคม 2569',{s:22})]}),
          new Paragraph({alignment:AlignmentType.CENTER,children:[r('ประเภทเอกสาร: คู่มือผู้ใช้งาน (User Manual)',{s:20,c:C.GRAY})]}),
      ]},
      // ══ MAIN ══
      { properties:{page:{size:{width:convertInchesToTwip(8.27),height:convertInchesToTwip(11.69)},margin:{top:convertInchesToTwip(0.87),bottom:convertInchesToTwip(1),left:convertInchesToTwip(0.79),right:convertInchesToTwip(0.79)},pageNumbers:{start:1}}},
        headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[r('X-RayCare QC Management System — คู่มือการใช้งาน',{s:16,c:'94A3B8',i:true})]})]}),},
        footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[r('หน้า ',{s:18,c:C.GRAY}),new TextRun({children:[PageNumber.CURRENT],size:18,font:F,color:C.GRAY})]})]}),},
        children:[
          // ── TOC ──
          heading1('สารบัญ'),
          tocMain('บทที่ 1 — ภาพรวมของระบบ'),
          tocSub('1.1 วัตถุประสงค์'), tocSub('1.2 คุณสมบัติหลักของระบบ'), tocSub('1.3 เทคโนโลยีที่ใช้'), tocSub('1.4 การรองรับหลายโรงพยาบาล'),
          tocMain('บทที่ 2 — บทบาทผู้ใช้งานและสิทธิ์การเข้าถึง'),
          tocSub('2.1 ตารางบทบาทและสิทธิ์'), tocSub('2.2 เมนูที่แต่ละบทบาทเข้าถึงได้'),
          tocMain('บทที่ 3 — การเข้าสู่ระบบ (Login)'),
          tocSub('3.1 ขั้นตอนการเข้าสู่ระบบ'), tocSub('3.2 กรณีเข้าสู่ระบบไม่สำเร็จ'), tocSub('3.3 บัญชีผู้ใช้เริ่มต้น'),
          tocMain('บทที่ 4 — โครงสร้างหน้าจอหลัก'),
          tocSub('4.1 แถบด้านบน (Top Bar)'), tocSub('4.2 แถบเมนูด้านข้าง (Sidebar Navigation)'), tocSub('4.3 การแสดงผลบนอุปกรณ์พกพา'),
          tocMain('บทที่ 5 — เมนูนักรังสีเทคนิค (Radiological Technologist)'),
          tocSub('5.1 Dashboard — หน้าภาพรวม'), tocSub('5.2 Equipment — ลงทะเบียนเครื่อง'), tocSub('5.3 Daily Check — ตรวจสอบประจำวัน'), tocSub('5.4 Monthly Check — ตรวจสอบประจำเดือน'), tocSub('5.5 PM Schedule — ตารางบำรุงรักษา'), tocSub('5.6 Export PDF — ส่งออกรายงาน'), tocSub('5.7 Analytical — วิเคราะห์ความเสี่ยง'), tocSub('5.8 Request — แจ้งซ่อม'), tocSub('5.9 QC Forms — แบบบันทึกเพิ่มเติม'),
          tocMain('บทที่ 6 — เมนูผู้ดูแลระบบ (Admin)'),
          tocSub('6.1 Admin Dashboard'), tocSub('6.2 User Accounts — จัดการผู้ใช้งาน'), tocSub('6.3 Admin Analytics'),
          tocMain('บทที่ 7 — เมนูวิศวกร (Engineer)'),
          tocSub('7.1 Engineer Dashboard'), tocSub('7.2 Engineer Analytics'), tocSub('7.3 Engineer Request — จัดการแจ้งซ่อม'),
          tocMain('บทที่ 8 — โปรไฟล์ผู้ใช้งาน (User Profile)'),
          tocMain('บทที่ 9 — แบบบันทึก QC ทั้งหมดในระบบ'),
          tocSub('9.1 ตารางสรุปแบบบันทึก'), tocSub('9.2 ขั้นตอนการทำงานตามรอบ (Workflow)'),
          tocMain('บทที่ 10 — การออกจากระบบ'),
          tocMain('บทที่ 11 — ข้อมูลทางเทคนิคสำหรับผู้ดูแลระบบ'),
          tocSub('11.1 สถาปัตยกรรมระบบ'), tocSub('11.2 ฐานข้อมูล'), tocSub('11.3 API Endpoints'),
          tocMain('บทที่ 12 — คำถามที่พบบ่อย (FAQ)'),
          PB(),

          // ══ CH1 ══
          heading1('บทที่ 1 — ภาพรวมของระบบ'),
          heading2('1.1 วัตถุประสงค์'),
          para('ระบบ **X-RayCare QC Management System** เป็นระบบเว็บแอปพลิเคชันที่ได้รับการพัฒนาขึ้นเพื่อ**จัดการงานควบคุมคุณภาพ (Quality Control — QC)** ของเครื่องเอกซเรย์และอุปกรณ์ทางรังสีวิทยาภายในโรงพยาบาล โดยมุ่งเน้นการยกระดับมาตรฐานความปลอดภัยและประสิทธิภาพการทำงานของแผนกรังสีวิทยาให้เป็นไปตามข้อกำหนดด้านคุณภาพ'),
          heading2('1.2 คุณสมบัติหลักของระบบ'),
          tbl(['คุณสมบัติ','รายละเอียด'],[['**ลงทะเบียนเครื่องเอกซเรย์**','บันทึกข้อมูลเครื่อง ห้องตรวจ และผู้ดูแลเครื่องอย่างเป็นระบบ'],['**ตรวจสอบคุณภาพประจำวัน**','บันทึกผลการตรวจสอบเครื่องเอกซเรย์ในแต่ละวัน (Daily Check — F1/F2)'],['**ตรวจสอบคุณภาพประจำเดือน**','บันทึกผลการตรวจสอบตามรอบ 1, 3 หรือ 6 เดือน (F3–F13)'],['**แบบบันทึก QC เพิ่มเติม**','แบบฟอร์ม F9 ถึง F13 และการสร้างแบบฟอร์มกำหนดเอง (Custom Form)'],['**ตารางบำรุงรักษาเชิงป้องกัน**','จัดตาราง Preventive Maintenance (PM) พร้อมระบบแจ้งเตือนอัตโนมัติ'],['**ระบบแจ้งซ่อม**','แจ้งซ่อมอุปกรณ์พร้อมแนบภาพถ่าย ติดตามสถานะการดำเนินงาน'],['**ศูนย์วิเคราะห์ความเสี่ยง**','แสดงผลวิเคราะห์ KPI อัตราผ่าน QC กราฟแนวโน้ม และระดับความเสี่ยง'],['**ส่งออกรายงาน PDF**','กรองรายการ Checklist พร้อมพิมพ์เป็นเอกสาร PDF อย่างเป็นทางการ'],['**จัดการผู้ใช้งานและโรงพยาบาล**','รองรับการบริหารจัดการแบบหลายโรงพยาบาล (Multi-Hospital)']],[35,65]),
          heading2('1.3 เทคโนโลยีที่ใช้'),
          tbl(['ส่วนประกอบ','เทคโนโลยี'],[['ส่วนหน้า (Frontend)','Vue 3, Vue Router 4, Bootstrap 5, Chart.js'],['ส่วนหลัง (Backend API)','ASP.NET Core (.NET 10)'],['ฐานข้อมูล','PostgreSQL 16'],['ORM','Entity Framework Core'],['Build Tool','Vite 6']],[30,70]),
          heading2('1.4 การรองรับหลายโรงพยาบาล'),
          para('ระบบรองรับการทำงาน**แบบหลายโรงพยาบาล (Multi-Hospital)** ข้อมูลทั้งหมดจะถูกแบ่งแยกตามโรงพยาบาลที่ผู้ใช้สังกัด ผู้ใช้ที่มีสถานะ Root Admin สามารถสลับดูข้อมูลและบริหารจัดการข้ามโรงพยาบาลได้'),
          noteBox('ผู้ใช้งานทั่วไปจะสามารถเข้าถึงได้เฉพาะข้อมูลของโรงพยาบาลที่ตนสังกัดเท่านั้น ข้อมูลของโรงพยาบาลอื่นจะไม่ปรากฏในระบบ'),
          PB(),

          // ══ CH2 ══
          heading1('บทที่ 2 — บทบาทผู้ใช้งานและสิทธิ์การเข้าถึง'),
          para('ระบบกำหนดบทบาทผู้ใช้งานออกเป็น **5 ระดับ** โดยแต่ละบทบาทมีสิทธิ์การเข้าถึงฟังก์ชันที่แตกต่างกัน'),
          heading2('2.1 ตารางบทบาทและสิทธิ์'),
          tbl(['ลำดับ','ชื่อบทบาท','คำอธิบาย','สิทธิ์การเข้าถึง'],[['1','**Root Admin**','ผู้ดูแลระบบสูงสุด','เข้าถึงได้ทุกเมนู ทุกโรงพยาบาล สามารถเพิ่ม/ลบโรงพยาบาล สลับโรงพยาบาลจากแถบด้านบน และจัดการบัญชีผู้ใช้ทุกโรงพยาบาล'],['2','**SuperAdmin**','ผู้ดูแลระดับโรงพยาบาล','เข้าถึงเมนู Admin ได้ทั้งหมด แต่จำกัดขอบเขตเฉพาะโรงพยาบาลที่สังกัด'],['3','**Admin**','ผู้ดูแลทั่วไป','เข้าถึงเมนู Admin, เมนูนักรังสีเทคนิค (ยกเว้น Dashboard ของ Tech) และเมนูวิศวกร (ยกเว้น Dashboard ของ Engineer)'],['4','**Radiological Technologist**','นักรังสีเทคนิค','Dashboard, Equipment, Daily/Monthly Check, PM Schedule, Export PDF, Analytical, Request, QC Forms'],['5','**Engineer**','วิศวกร','Engineer Dashboard, Engineer Analytics, Engineer Request']],[5,20,18,57]),
          heading2('2.2 เมนูที่แต่ละบทบาทเข้าถึงได้'),
          tblC(['เมนู','Root Admin','SuperAdmin','Admin','Tech','Engineer'],[['Dashboard (Tech)','—','—','—','\u2714','—'],['Equipment','\u2714','\u2714','\u2714','\u2714','—'],['PM Schedule','\u2714','\u2714','\u2714','\u2714','—'],['Export PDF','\u2714','\u2714','\u2714','\u2714','—'],['Analytical','\u2714','\u2714','\u2714','\u2714','—'],['Request (แจ้งซ่อม)','\u2714','\u2714','\u2714','\u2714','—'],['QC Forms','\u2714','\u2714','\u2714','\u2714','—'],['Admin Dashboard','\u2714','\u2714','\u2714','—','—'],['User Accounts','\u2714','\u2714','\u2714','—','—'],['Admin Analytics','\u2714','\u2714','\u2714','—','—'],['Engineer Dashboard','—','—','—','—','\u2714'],['Engineer Analytics','\u2714','\u2714','\u2714','—','\u2714'],['Engineer Request','\u2714','\u2714','\u2714','—','\u2714']],[40,12,12,12,12,12]),
          PB(),

          // ══ CH3 ══
          heading1('บทที่ 3 — การเข้าสู่ระบบ (Login)'),
          heading2('3.1 ขั้นตอนการเข้าสู่ระบบ'),
          para('เปิดเว็บเบราว์เซอร์และเข้าไปยัง URL ของระบบ ระบบจะแสดงหน้าเข้าสู่ระบบพร้อมข้อความ "Welcome — Sign in to X-RayCare QC System"'),
          numItem('num1','กรอก **Username** — ชื่อผู้ใช้ที่ได้รับจากผู้ดูแลระบบ'),numItem('num1','กรอก **Password** — รหัสผ่านของบัญชีผู้ใช้ (สามารถคลิกไอคอนรูปตาทางด้านขวาเพื่อแสดง/ซ่อนรหัสผ่าน)'),numItem('num1','เลือก **โรงพยาบาล** — เลือกโรงพยาบาลที่ท่านสังกัดจากรายการแบบเลื่อนลง (Drop-down)'),numItem('num1','คลิกปุ่ม **"Sign In"** เพื่อเข้าสู่ระบบ'),numItem('num1','ระบบจะนำท่านเข้าสู่หน้า Dashboard ตามบทบาทของท่านโดยอัตโนมัติ'),
          SP(60),
          tbl(['ช่องข้อมูล','คำอธิบาย','ตัวอย่าง'],[['**Username**','ชื่อผู้ใช้ที่ได้รับจากผู้ดูแลระบบ','Superadmin'],['**Password**','รหัสผ่านของบัญชีผู้ใช้','Superadmin1234'],['**โรงพยาบาล**','เลือกโรงพยาบาลที่สังกัดจากรายการ','โรงพยาบาลตัวอย่าง']],[25,45,30]),
          para('**การนำทางหลังเข้าสู่ระบบ:** ระบบจะพาท่านไปยังหน้าแรกตามบทบาทโดยอัตโนมัติ ดังนี้'),
          bullet('**Admin / SuperAdmin / Root Admin** → หน้า Admin Dashboard'),bullet('**Radiological Technologist** → หน้า Dashboard'),bullet('**Engineer** → หน้า Engineer Dashboard'),
          heading2('3.2 กรณีเข้าสู่ระบบไม่สำเร็จ'),
          para('หากกรอกข้อมูลไม่ถูกต้อง ระบบจะแสดงข้อความแจ้งเตือนสีแดงใต้แบบฟอร์ม ท่านสามารถตรวจสอบสาเหตุได้ตามรายการต่อไปนี้:'),
          tbl(['ข้อความแจ้งเตือน','สาเหตุที่เป็นไปได้'],[['กรุณากรอก Username และ Password','ยังไม่ได้กรอกชื่อผู้ใช้หรือรหัสผ่าน'],['ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง','ชื่อผู้ใช้หรือรหัสผ่านไม่ตรงกับข้อมูลในระบบ'],['เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง','เซิร์ฟเวอร์ไม่สามารถตอบสนองได้ หรือเกิดปัญหาการเชื่อมต่อ']],[40,60]),
          tipBox('ตรวจสอบให้แน่ใจว่าท่านเลือกโรงพยาบาลที่ถูกต้อง เนื่องจากระบบจะตรวจสอบทั้งชื่อผู้ใช้ รหัสผ่าน และโรงพยาบาลพร้อมกัน หากเลือกโรงพยาบาลผิด จะไม่สามารถเข้าสู่ระบบได้แม้ชื่อผู้ใช้และรหัสผ่านจะถูกต้อง'),
          heading2('3.3 บัญชีผู้ใช้เริ่มต้น'),
          para('เมื่อติดตั้งระบบครั้งแรก ระบบจะสร้างบัญชี Root Admin โดยอัตโนมัติพร้อมข้อมูลดังนี้:'),
          tbl(['รายการ','ค่าเริ่มต้น'],[['Username','Superadmin'],['Password','Superadmin1234'],['บทบาท','Admin (Root Admin / SuperAdmin)']],[30,70]),
          warnBox('เพื่อความปลอดภัยของระบบ ควรดำเนินการเปลี่ยนรหัสผ่านของบัญชี Superadmin ทันทีหลังจากเข้าสู่ระบบครั้งแรก โดยให้ผู้ดูแลระบบดำเนินการผ่านหน้า User Accounts'),
          PB(),

          // ══ CH4 ══
          heading1('บทที่ 4 — โครงสร้างหน้าจอหลัก'),
          para('หลังจากเข้าสู่ระบบสำเร็จ หน้าจอหลักของระบบประกอบด้วยส่วนสำคัญ 3 ส่วนหลัก ดังนี้:'),
          heading2('4.1 แถบด้านบน (Top Bar)'),
          bullet('**ปุ่มเมนู (☰)** — ใช้สำหรับแสดงหรือซ่อนแถบเมนูด้านข้าง เหมาะสำหรับหน้าจอขนาดเล็ก'),bullet('**ชื่อระบบ X-RayCare** — แสดงชื่อระบบและข้อความ "QC Management"'),bullet('**ชื่อโรงพยาบาล** — แสดงชื่อโรงพยาบาลที่ท่านเข้าสู่ระบบอยู่'),bullet('**สลับโรงพยาบาล** — สำหรับ Root Admin จะมีเมนูแบบเลื่อนลง (Drop-down) ให้เลือกเปลี่ยนโรงพยาบาลที่ต้องการดูข้อมูลได้'),
          heading2('4.2 แถบเมนูด้านข้าง (Sidebar Navigation)'),
          para('แถบเมนูด้านซ้ายจัดกลุ่มเมนูตามบทบาท โดยแต่ละบทบาทจะมองเห็นเมนูที่แตกต่างกัน:'),
          tbl(['กลุ่มเมนู','รายการเมนู','สัญลักษณ์'],[['RADIOLOGICAL TECHNOLOGIST','Dashboard','\u{1F3E0}'],['','Equipment','\u{1F4BB}'],['','PM Schedule','\u{1F4C5}'],['','Export PDF','\u{1F4C4}'],['','Analytical','\u{1F4CA}'],['','Request','\u{1F527}'],['','QC Forms','\u{1F4CB}'],['ADMIN','Admin Dashboard','\u{1F4DF}'],['','User Accounts','\u{1F465}'],['','Admin Analytics','\u{1F4C8}'],['ENGINEER','Engineer Dashboard','\u{1F6E0}'],['','Engineer Analytics','\u{1F4C9}'],['','Engineer Request','\u{1F3AB}']],[30,50,20]),
          para('ปุ่ม **"Log out"** อยู่ที่ด้านล่างสุดของแถบเมนู สำหรับออกจากระบบ'),
          heading2('4.3 การแสดงผลบนอุปกรณ์พกพา'),
          para('ระบบรองรับการแสดงผลแบบ **Responsive Design** เมื่อหน้าจอมีขนาดเล็กกว่า 1,024 พิกเซล:'),
          bullet('แถบเมนูด้านข้าง (Sidebar) จะถูกซ่อนโดยอัตโนมัติ'),bullet('กดปุ่ม **☰** ที่แถบด้านบนเพื่อเปิดเมนูแบบ Overlay'),bullet('กดพื้นที่นอกเมนูหรือเลือกรายการเมนูแล้ว เมนูจะปิดโดยอัตโนมัติ'),
          PB(),

          // ══ CH5 ══
          heading1('บทที่ 5 — เมนูนักรังสีเทคนิค (Radiological Technologist)'),
          heading2('5.1 Dashboard — หน้าภาพรวม'),
          para('เส้นทาง: /dashboard  |  สิทธิ์: Radiological Technologist'),
          para('หน้า Dashboard เป็นหน้าแรกหลังเข้าสู่ระบบสำหรับนักรังสีเทคนิค แสดงข้อมูลสรุปและรายการสำคัญทั้งหมดในหน้าเดียว'),
          heading3('5.1.1 ระบบการแจ้งเตือน (Notification Banner)'),
          para('ด้านบนสุดของหน้าจะแสดงแถบแจ้งเตือนเมื่อมีกำหนดการตรวจสอบใกล้จะถึง โดยจำแนกตามระดับความเร่งด่วน:'),
          tbl(['ระดับ','สีแถบ','คำอธิบาย','ข้อความ'],[['**TODAY**','แดง (Pulse)','ถึงกำหนดตรวจสอบในวันนี้','"ถึงกำหนดแล้ว!"'],['**เร่งด่วน**','แดง','เหลือเวลาอีก 1–3 วัน','"เหลืออีก N วัน"'],['**เตือนล่วงหน้า**','เหลือง','เหลือเวลาอีก 4–7 วัน','"เหลืออีก N วัน"'],['**ข้อมูล**','เขียว','เหลือเวลามากกว่า 7 วัน','"เหลืออีก N วัน"']],[20,15,40,25]),
          para('ท่านสามารถปิดการแจ้งเตือนแต่ละรายการได้โดยคลิกปุ่ม **✕** ที่มุมขวาของแถบแจ้งเตือน (ปุ่ม "ปิดการแจ้งเตือน")'),
          heading3('5.1.2 การ์ดสรุปข้อมูล (Summary Cards)'),
          tbl(['การ์ด','ข้อมูลที่แสดง'],[['**DATE**','วันที่ปัจจุบัน'],['**EQUIPMENT**','จำนวนเครื่องเอกซเรย์ทั้งหมดที่ลงทะเบียนในระบบ'],['**PM SCHEDULE**','จำนวนรายการตารางบำรุงรักษาที่ตั้งค่าไว้'],['**CHECKLIST**','จำนวนรายการ Checklist ที่บันทึกในเดือนปัจจุบัน']],[25,75]),
          heading3('5.1.3 ตารางรายการเครื่อง'),
          para('แสดงรายการเครื่องเอกซเรย์ทั้งหมดที่ลงทะเบียน พร้อมข้อมูล: ชื่อเครื่อง (ยี่ห้อ/รุ่น), ห้องตรวจ, ผู้ดูแลเครื่อง และสถานะ คลิกปุ่ม **"Check"** ในคอลัมน์ Action เพื่อเริ่มทำ Daily Check'),
          heading3('5.1.4 ปฏิทินกิจกรรม'),
          para('แสดงปฏิทินเดือนปัจจุบัน โดยวันที่มีกำหนดการจะแสดงป้ายกำกับ Monthly หรือ Daily สามารถคลิกที่วันที่เพื่อดูรายละเอียดกิจกรรม'),
          heading3('5.1.5 สถานะเครื่อง (Equipment Readiness)'),
          bullet('**พร้อมใช้งาน** — ผ่านการตรวจ QC ล่าสุด'),bullet('**ไม่พร้อมใช้งาน** — ไม่ผ่านการตรวจ QC หรือยังไม่มีข้อมูลการตรวจสอบ'),

          heading2('5.2 Equipment — ระบบลงทะเบียนเครื่อง'),
          para('เส้นทาง: /machines/create  |  สิทธิ์: Admin, Radiological Technologist'),
          para('หน้านี้ใช้สำหรับ**ลงทะเบียนเครื่องเอกซเรย์ใหม่**เข้าสู่ระบบ และจัดการเครื่องที่ลงทะเบียนแล้ว'),
          heading3('5.2.1 ข้อมูลที่ต้องกรอก'),
          tbl(['ช่องข้อมูล','รายละเอียด','ตัวอย่าง'],[['**เครื่อง X-ray (ระบุชื่อ, ยี่ห้อ, รุ่น)**','ระบุชื่อเครื่อง ยี่ห้อ และรุ่นอย่างครบถ้วน','X-Ray (BrandA/ModelX)'],['**ห้องตรวจ**','หมายเลขหรือชื่อห้องที่ติดตั้งเครื่อง','2'],['**วันที่ลงทะเบียนเครื่องครั้งแรก**','วันที่เริ่มใช้งานเครื่อง (รูปแบบ DD/MM/YYYY)','25/11/2568'],['**ผู้ดูแลเครื่อง**','ชื่อ-นามสกุลผู้รับผิดชอบดูแลเครื่อง','ศุภกร งามเมือง']],[30,40,30]),
          heading3('5.2.2 ขั้นตอนการลงทะเบียน'),
          numItem('num2','คลิกเมนู **"Equipment"** ที่แถบเมนูด้านข้าง'),numItem('num2','กรอกข้อมูลเครื่องเอกซเรย์ตามช่องที่กำหนด'),numItem('num2','สำหรับวันที่ สามารถพิมพ์โดยตรง (DD/MM/YYYY) หรือคลิกไอคอนปฏิทินเพื่อเลือกวันที่'),numItem('num2','คลิกปุ่ม **"Save"** เพื่อบันทึกข้อมูล'),
          heading3('5.2.3 ตารางเครื่องที่ลงทะเบียน'),
          para('ด้านล่างของฟอร์มจะแสดงตาราง **"เครื่องที่ทำการลงทะเบียน"** ประกอบด้วยคอลัมน์: ลำดับ, เครื่อง X-ray, ห้องตรวจ, ผู้ดูแลเครื่อง, วันที่ลงทะเบียนเครื่องครั้งแรก และปุ่ม **"ลบ"** ในคอลัมน์จัดการ'),
          warnBox('การลบเครื่องเอกซเรย์จะเป็นการลบออกจากระบบอย่างถาวร กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ'),

          heading2('5.3 Daily Check — การตรวจสอบประจำวัน'),
          para('เส้นทาง: /dairy-check/:equipmentName  |  สิทธิ์: Admin, Radiological Technologist'),
          para('หน้า Daily Check ใช้สำหรับ**บันทึกผลการตรวจสอบเครื่องเอกซเรย์ประจำวัน** ตามแบบบันทึก F1 (การดูแลรักษาและตรวจสอบ) และ F2 (การลบแผ่นเพลท)'),
          heading3('5.3.1 ข้อมูลที่แสดงด้านบน'),
          bullet('**ชื่อเครื่อง** — เครื่องที่เลือกตรวจสอบ'),bullet('**รุ่น** — รุ่นของเครื่อง'),bullet('**ห้อง** — ห้องที่ตั้งเครื่อง'),bullet('**วันที่** — วันที่ปัจจุบัน (กำหนดโดยอัตโนมัติ)'),bullet('**ผู้ทดสอบ** — ชื่อผู้ใช้ที่เข้าสู่ระบบ'),bullet('**เวลา** — เวลาปัจจุบัน (อัปเดตโดยอัตโนมัติ)'),
          heading3('5.3.2 รายการที่ต้องทำวันนี้ (ตาม Schedule)'),
          para('หากมีรายการตรวจสอบที่ครบกำหนดตาม PM Schedule ระบบจะแสดงแถบรายการที่ต้องดำเนินการ เช่น:'),
          para('**F1/F2 (กำลังทำ)**  |  F3–F6  |  F7–F8'),
          para('ท่านสามารถคลิกลิงก์ของแบบบันทึกที่ต้องทำถัดไปได้โดยตรง'),
          heading3('5.3.3 ตารางบันทึกผลการตรวจ'),
          tbl(['คอลัมน์','คำอธิบาย'],[['**รายการ**','หัวข้อที่ต้องตรวจสอบ (เช่น สายไฟ, ระบบล็อกและเบรก, เตียง เป็นต้น)'],['**ผ่าน**','เลือก (Radio Button) หากรายการผ่านเกณฑ์มาตรฐาน'],['**ไม่ผ่าน**','เลือก (Radio Button) หากรายการไม่ผ่านเกณฑ์มาตรฐาน'],['**หมายเหตุ**','บันทึกรายละเอียดเพิ่มเติมและแนบไฟล์ภาพประกอบได้']],[20,80]),
          heading3('5.3.4 การแนบไฟล์ภาพ'),
          numItem('num3','คลิกปุ่ม **"เลือกไฟล์"** ใต้ช่องหมายเหตุของแต่ละรายการ'),numItem('num3','เลือกไฟล์รูปภาพจากเครื่องคอมพิวเตอร์ (รองรับรูปแบบ JPG, PNG, GIF, WebP)'),numItem('num3','ภาพจะแสดงตัวอย่าง (Preview) ด้านล่างทันที'),numItem('num3','หากต้องการลบภาพ คลิกปุ่ม **✕** ข้างชื่อไฟล์'),
          heading3('5.3.5 ปุ่มดำเนินการ'),
          bullet('**"ผ่านทั้งหมด"** — เลือก "ผ่าน" ให้กับทุกรายการพร้อมกัน'),bullet('**"ถัดไป" / "บันทึกและดำเนินการต่อ"** — บันทึกผลและนำไปยังหน้าถัดไป'),bullet('**"บันทึก"** — บันทึกผลโดยไม่ไปยังหน้าถัดไป'),

          heading2('5.4 Monthly Check — การตรวจสอบประจำเดือน'),
          para('ระบบ Monthly Check แบ่งออกเป็น 3 ระดับตามรอบความถี่ของการตรวจสอบ ดังนี้:'),
          heading3('5.4.1 Monthly Check — รอบ 3 เดือน (F3–F6)'),
          para('เส้นทาง: /monthly-check'),
          tbl(['แบบบันทึก','ชื่อ','เนื้อหาการตรวจสอบ'],[['**F3**','Monitor Performance','ตรวจสอบคุณภาพจอแสดงผล — คุณภาพภาพ, ความคมชัด, ความสว่าง เป็นต้น'],['**F4**','X-ray Check','ตรวจสอบคุณภาพเครื่องเอกซเรย์'],['**F5**','Uniformity Test','ทดสอบความสม่ำเสมอของภาพ'],['**F6**','EI Consistency','ตรวจสอบความสม่ำเสมอของค่า Exposure Index']],[12,28,60]),
          numItem('num4','เลือกแบบบันทึกจากแถบ Tab ด้านซ้าย (เริ่มจาก F3)'),numItem('num4','กรอกข้อมูลตามแบบฟอร์ม เลือก ผ่าน/ไม่ผ่าน (P/F) ในแต่ละหัวข้อ'),numItem('num4','แนบไฟล์ภาพประกอบ (หากต้องการ)'),numItem('num4','คลิก **"Next"** เพื่อบันทึกและไปยังแบบบันทึกถัดไป'),numItem('num4','ที่แบบบันทึกสุดท้าย (F6) คลิก **"Save"** เพื่อบันทึกข้อมูลทั้งหมด'),
          heading3('5.4.2 Monthly Check Light — รอบ 1 เดือน (F10)'),
          para('เส้นทาง: /monthly-check-light — แบบบันทึก F10 สำหรับตรวจสอบรายการที่ต้องทำทุกเดือน เช่น การตรวจสอบความสว่างของ Light Field พร้อมรองรับการแนบภาพประกอบ'),
          heading3('5.4.3 Monthly Check All — รอบ 6 เดือน (F7–F8)'),
          para('เส้นทาง: /monthly-check-all'),
          tbl(['แบบบันทึก','เนื้อหา'],[['**F7.1**','Collimator Check — ตรวจสอบ Collimator'],['**F7.2**','Collimator Bucky Check — ตรวจสอบ Collimator Bucky'],['**F8.1**','CR Dark Noise — ตรวจสอบ Dark Noise ระบบ CR'],['**F8.2**','DR Dark Noise — ตรวจสอบ Dark Noise ระบบ DR']],[15,85]),

          heading2('5.5 PM Schedule — ตารางบำรุงรักษาเชิงป้องกัน'),
          para('เส้นทาง: /pm-schedule  |  สิทธิ์: Admin, Radiological Technologist'),
          heading3('5.5.1 องค์ประกอบหน้าจอ'),
          bullet('**การ์ดวันที่** — แสดงวันที่และวันในสัปดาห์ปัจจุบัน'),bullet('**ปฏิทิน** — แสดงปฏิทินเดือนปัจจุบัน เลื่อนเดือนด้วยปุ่ม **<** และ **>**'),bullet('**เครื่องหมาย ★** — วันที่มีกำหนดการตรวจสอบจะแสดงดาวสีเหลืองเป็นสัญลักษณ์'),
          heading3('5.5.2 การตั้งค่ารอบ PM'),
          numItem('num5','คลิกที่วันที่ต้องการในปฏิทิน — ระบบจะแสดง Popup'),numItem('num5','คลิกไอคอน **ตั้งค่ารอบ** (รูปเฟือง) เพื่อเปิดหน้าต่างตั้งค่า'),numItem('num5','กำหนดรายละเอียดตารางบำรุงรักษา ดังนี้:'),
          tbl(['ช่องข้อมูล','คำอธิบาย'],[['**วันเริ่มต้น**','วันที่เริ่มต้นรอบการตรวจสอบ PM'],['**ความถี่**','เลือกรอบการตรวจ: 1 เดือน / 3 เดือน / 6 เดือน'],['**คำอธิบาย**','รายละเอียดของงานบำรุงรักษา'],['**ประเภทแบบบันทึก**','เลือกแบบบันทึกที่ต้องดำเนินการ (F1/F2, F3–F6, F7–F8 ฯลฯ)']],[25,75]),
          numItem('num5','คลิก **"Save"** เพื่อบันทึกตารางบำรุงรักษา'),
          heading3('5.5.3 ระบบแจ้งเตือนอัตโนมัติ'),
          para('เมื่อมีกำหนด PM ใกล้ถึง ระบบจะคำนวณวันที่ตรวจสอบถัดไปจาก วันเริ่มต้น + ความถี่ และแสดงการแจ้งเตือนบน Dashboard โดยอัตโนมัติ ตามระดับความเร่งด่วนที่ระบุไว้ในหัวข้อ 5.1.1'),

          heading2('5.6 Export PDF — ส่งออกรายงาน'),
          para('เส้นทาง: /export-pdf  |  สิทธิ์: Admin, Radiological Technologist'),
          heading3('5.6.1 ส่วนที่ 1 — รายการบันทึก Checklist'),
          heading4('ตัวกรองข้อมูล'),
          tbl(['ตัวกรอง','คำอธิบาย'],[['**เครื่อง X-ray**','เลือกเครื่องเอกซเรย์ที่ต้องการ หรือเลือก "ทั้งหมด"'],['**ประเภทแบบฟอร์ม**','เลือกประเภทแบบบันทึก (F1–F13) หรือเลือก "ทั้งหมด"'],['**จากวันที่**','กำหนดวันที่เริ่มต้นของช่วงเวลา'],['**ถึงวันที่**','กำหนดวันที่สิ้นสุดของช่วงเวลา']],[25,75]),
          heading4('ขั้นตอนการส่งออก PDF'),
          numItem('num6','กรองข้อมูลตามเงื่อนไขที่ต้องการ'),numItem('num6','คลิกปุ่ม **"ตัวอย่างไฟล์"** ในคอลัมน์จัดการ'),numItem('num6','ระบบจะเปิดหน้า Print View ของแบบบันทึกนั้น'),numItem('num6','กดคีย์ **Ctrl + P** (หรือ Cmd + P บน Mac)'),numItem('num6','เลือก **"Save as PDF"** จากเมนูเครื่องพิมพ์ หรือเลือกเครื่องพิมพ์เพื่อพิมพ์โดยตรง'),
          heading3('5.6.2 ส่วนที่ 2 — Export PDF รายเดือน (F1/F2)'),
          tbl(['ช่อง','คำอธิบาย'],[['**แบบฟอร์ม**','เลือก F1 (การดูแลรักษาฯ รายเดือน) หรือ F2 (การลบแผ่นเพลท รายเดือน)'],['**เดือน / ปี**','เลือกเดือนและปีที่ต้องการ'],['**เครื่อง X-ray**','เลือกเครื่องเอกซเรย์']],[25,75]),
          para('คลิก **"ส่งออก PDF รายเดือน"** เพื่อเปิดหน้า Print View'),

          heading2('5.7 Analytical — ศูนย์วิเคราะห์ความเสี่ยง'),
          para('เส้นทาง: /analytics  |  สิทธิ์: Admin, Radiological Technologist'),
          heading3('5.7.1 ตัวกรองข้อมูล'),
          para('ด้านขวาบนของหน้ามีเมนูเลือก **"ปี พ.ศ."** สำหรับกรองข้อมูลแสดงผลตามปีที่ต้องการ'),
          heading3('5.7.2 การ์ด KPI (Key Performance Indicators)'),
          tbl(['KPI','คำอธิบาย','เกณฑ์สี'],[['**เครื่องเอกซเรย์ทั้งหมด**','จำนวนเครื่องที่ลงทะเบียนในระบบ','น้ำเงิน (ข้อมูล)'],['**อัตราผ่าน QC ทั้งปี**','ร้อยละ Checklist ที่ผ่านเกณฑ์','≥80% เขียว, 60–79% เหลือง, <60% แดง'],['**แจ้งซ่อมรอดำเนินการ**','จำนวนคำขอแจ้งซ่อมที่ยังไม่ดำเนินการ','0 เขียว, 1–3 เหลือง, >3 แดง'],['**ระดับความเสี่ยงรวม**','การประเมินความเสี่ยงโดยรวม','เขียว / เหลือง / แดง (ตามการคำนวณ)']],[28,40,32]),
          heading3('5.7.3 กราฟและแผนภูมิ'),
          bullet('**กราฟเส้น (Line Chart)** — แนวโน้มการแจ้งซ่อมและผล QC รายเดือน'),bullet('**แผนภูมิวงกลม (Donut Chart)** — สัดส่วนการแจ้งซ่อมจำแนกตามเครื่อง'),bullet('**แผนภูมิแท่ง (Bar Chart)** — สถานะการตรวจ QC จำแนกตามประเภทแบบฟอร์ม'),
          heading3('5.7.4 การประเมินความเสี่ยงรายเครื่อง'),
          para('แสดงการ์ดรายเครื่องพร้อมข้อมูล: คะแนนสุขภาพ (Health Score), จำนวนการแจ้งซ่อม, QC ไม่ผ่าน, เกินกำหนด และข้อความระดับความเสี่ยง เช่น:'),
          bullet('**วิกฤต** — ต้องดำเนินการแก้ไขทันที'),bullet('**เฝ้าระวัง** — ต้องติดตามอย่างใกล้ชิด'),bullet('**ติดตาม** — สถานะปกติแต่ต้องติดตามต่อเนื่อง'),

          heading2('5.8 Request — ระบบแจ้งซ่อม'),
          para('เส้นทาง: /requests  |  สิทธิ์: Admin, Radiological Technologist'),
          heading3('5.8.1 รายการแจ้งซ่อม'),
          tbl(['คอลัมน์','คำอธิบาย'],[['**#**','ลำดับ'],['**อุปกรณ์**','ชื่อเครื่อง/อุปกรณ์ที่แจ้งซ่อม'],['**ห้อง**','ห้องที่ตั้งอุปกรณ์'],['**วันที่แจ้ง**','วันที่ส่งคำขอแจ้งซ่อม'],['**เวลา**','เวลาที่แจ้ง'],['**ผู้ทำ**','ชื่อผู้แจ้ง'],['**รายละเอียด**','รายละเอียดอาการเสีย'],['**สถานะ**','สถานะปัจจุบัน: รอซ่อม / อยู่ระหว่างดำเนินการ / ดำเนินการแล้ว'],['**การจัดการ**','ปุ่ม "ดูรายละเอียด" และ "ลบ"']],[18,82]),
          heading3('5.8.2 การสร้างคำขอแจ้งซ่อมใหม่'),
          numItem('num7','คลิกปุ่ม **"เพิ่มรายการ"** ที่มุมขวาบนของตาราง'),
          numItem('num7','ระบบจะเปิดหน้าต่าง (Modal) ฟอร์มแจ้งซ่อม กรอกข้อมูลดังนี้:'),
          tbl(['ช่อง','คำอธิบาย'],[['**อุปกรณ์**','เลือกเครื่อง/อุปกรณ์จากรายการแบบเลื่อนลง'],['**ห้องตรวจ**','ห้องที่ตั้งอุปกรณ์ (กรอกอัตโนมัติเมื่อเลือกอุปกรณ์)'],['**วันที่แจ้งซ่อม**','วันที่แจ้ง (ตั้งค่าอัตโนมัติเป็นวันปัจจุบัน)'],['**ชื่อผู้แจ้ง**','ชื่อผู้แจ้งซ่อม'],['**รายละเอียด**','เลือกประเภทปัญหา: สายไฟ / ระบบล็อกและเบรก / เตียง หลอดเอกซเรย์ และบักกี้ / X-ray tube warm-up / ส่วนอื่นเพิ่มเติม'],['**หมายเหตุ**','รายละเอียดเพิ่มเติม (ไม่บังคับ)'],['**แนบไฟล์ภาพ**','แนบรูปภาพประกอบ (ไม่บังคับ, รองรับ JPG/PNG)']],[22,78]),
          numItem('num7','คลิก **"บันทึก"** เพื่อส่งคำขอแจ้งซ่อม'),
          heading3('5.8.3 การดูรายละเอียดแจ้งซ่อม'),
          para('คลิกปุ่ม **"ดูรายละเอียด"** จะแสดงข้อมูลเต็มรูปแบบ ประกอบด้วย: อุปกรณ์, รายละเอียด, หมายเหตุ, วันที่แจ้ง, เวลา, ผู้แจ้ง, ไฟล์ภาพ (หากมี) และสถานะปัจจุบัน'),

          heading2('5.9 QC Forms — แบบบันทึกเพิ่มเติม'),
          para('เส้นทาง: /qc-forms  |  สิทธิ์: Admin, Radiological Technologist'),
          heading3('5.9.1 แบบบันทึกมาตรฐาน (Built-in Forms)'),
          tbl(['รหัส','ชื่อแบบบันทึก','คำอธิบาย'],[['**F9**','แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว','ตรวจสอบสภาพเสื้อตะกั่วและอุปกรณ์ป้องกันรังสี'],['**F11**','แบบบันทึกผลการวัดความหนาผู้ป่วย','บันทึกค่าความหนาของผู้ป่วยและเทคนิคที่ใช้ในการถ่ายภาพ'],['**F12**','แบบบันทึกอัตราการถ่ายภาพซ้ำ','ประเมินสาเหตุและอัตราการถ่ายภาพซ้ำ (Retake/Reject Rate)'],['**F13**','B-mode QC Test เครื่องอัลตราซาวด์','ตรวจสอบคุณภาพเครื่องอัลตราซาวด์']],[10,32,58]),
          heading3('5.9.2 ขั้นตอนการใช้งาน'),
          numItem('num8','คลิกเมนู **"QC Forms"** ที่แถบเมนูด้านข้าง'),numItem('num8','เลือกแบบบันทึกที่ต้องการจากการ์ดที่แสดง'),numItem('num8','คลิก **"เปิดแบบบันทึก"**'),numItem('num8','กรอกข้อมูลตามแบบฟอร์ม'),numItem('num8','คลิก **"บันทึก"** เพื่อจัดเก็บข้อมูลเข้าสู่ระบบ'),
          heading3('5.9.3 การสร้างแบบบันทึกกำหนดเอง (Custom Form Builder)'),
          para('ระบบรองรับการ**สร้างแบบบันทึกแบบกำหนดเอง**:'),
          numItem('num9','คลิกปุ่ม **"+ สร้างแบบบันทึก"** ที่มุมขวาบน'),numItem('num9','ระบบจะเปิดหน้า Custom Form Builder พร้อมตัวแก้ไขแบบ Visual, HTML และ Preview'),numItem('num9','กำหนดรายละเอียดของแบบบันทึก แทรกฟิลด์ที่ต้องการ'),numItem('num9','บันทึกแบบบันทึก — แบบบันทึกจะปรากฏเป็นการ์ดใหม่ใน QC Forms Hub'),
          noteBox('แบบบันทึกกำหนดเองจะถูกจัดเก็บใน Local Storage ของเบราว์เซอร์ หากต้องการใช้งานบนเครื่องคอมพิวเตอร์เครื่องอื่น จะต้องสร้างแบบบันทึกใหม่'),
          para('**การลบแบบบันทึกกำหนดเอง:** คลิกปุ่ม **✕** ที่มุมขวาบนของการ์ด (ปุ่มนี้แสดงเฉพาะแบบบันทึกที่สร้างเอง ไม่แสดงกับแบบบันทึกมาตรฐาน F9, F11, F12, F13)'),
          PB(),

          // ══ CH6 ══
          heading1('บทที่ 6 — เมนูผู้ดูแลระบบ (Admin)'),
          heading2('6.1 Admin Dashboard'),
          para('เส้นทาง: /admindashboard  |  สิทธิ์: Admin, SuperAdmin, Root Admin'),
          para('หน้า Admin Dashboard มีโครงสร้างเช่นเดียวกับ Dashboard ของนักรังสีเทคนิค ประกอบด้วย:'),
          bullet('**ระบบแจ้งเตือน** — การแจ้งเตือน PM Schedule ที่ใกล้ถึงกำหนด (แบ่งระดับ TODAY / เร่งด่วน / เตือนล่วงหน้า / ข้อมูล)'),bullet('**การ์ดสรุปข้อมูล** — DATE, EQUIPMENT, PM SCHEDULE, CHECKLIST'),bullet('**ตารางรายการเครื่อง** — รายการเครื่องเอกซเรย์ทั้งหมดพร้อมปุ่มเข้าสู่ Daily Check'),bullet('**ปฏิทินกิจกรรม** — ปฏิทินแสดงกำหนดการ Daily/Monthly Check'),bullet('**สถานะเครื่อง** — แสดงความพร้อมของเครื่องเอกซเรย์'),
          noteBox('ผู้ดูแลระบบสามารถมองเห็นเมนูนักรังสีเทคนิคเกือบทั้งหมด (ยกเว้น Dashboard ของ Tech ซึ่งถูกแทนที่ด้วย Admin Dashboard) รวมถึงสามารถเข้าถึงเมนูวิศวกร (ยกเว้น Engineer Dashboard)'),

          heading2('6.2 User Accounts — จัดการผู้ใช้งานและโรงพยาบาล'),
          para('เส้นทาง: /adminuseraccount  |  สิทธิ์: Admin, SuperAdmin, Root Admin'),
          para('หน้าจัดการบัญชีผู้ใช้งานแบ่งออกเป็น **2 แท็บ**:'),
          heading3('6.2.1 แท็บ User Management — จัดการผู้ใช้'),
          heading4('ตารางรายชื่อผู้ใช้'),
          tbl(['คอลัมน์','คำอธิบาย'],[['**Username**','ชื่อผู้ใช้งาน'],['**Role**','บทบาท พร้อมคำอธิบายสิทธิ์โดยย่อ'],['**Hospital**','โรงพยาบาลที่สังกัด'],['**Password**','รหัสผ่าน (คลิกไอคอนตาเพื่อแสดง/ซ่อน)'],['**Action**','ปุ่มแก้ไขและลบ']],[20,80]),
          heading4('การเพิ่มผู้ใช้ใหม่'),
          numItem('num10','คลิกปุ่ม **"Add User"** ที่มุมขวาบน'),
          numItem('num10','กรอกข้อมูลในหน้าต่าง "Sign Up":'),
          tbl(['ช่อง','คำอธิบาย'],[['**Username**','กำหนดชื่อผู้ใช้งาน'],['**Password**','กำหนดรหัสผ่าน'],['**Confirm Password**','ยืนยันรหัสผ่านอีกครั้ง'],['**Hospital**','เลือกโรงพยาบาลที่สังกัด (Root Admin สามารถเลือกได้ทุกโรงพยาบาล)'],['**Role**','เลือกบทบาท']],[25,75]),
          numItem('num10','คลิก **"Create Account"** เพื่อสร้างบัญชี'),
          heading4('บทบาทที่สามารถกำหนดได้'),
          tbl(['บทบาท','คำอธิบาย'],[['**Root Admin**','มองเห็นและจัดการได้ทุกโรงพยาบาล (กำหนดได้โดย Root Admin เท่านั้น)'],['**SuperAdmin**','จัดการบัญชีในโรงพยาบาลของตนเอง'],['**Admin**','เข้าถึงเมนู Admin ได้ จำกัดเฉพาะโรงพยาบาลที่สังกัด'],['**Radiological Technologist**','เข้าถึงเมนูงานตรวจสอบ QC'],['**Engineer**','เข้าถึงเมนูวิศวกร']],[25,75]),
          heading4('การแก้ไขผู้ใช้'),
          numItem('num11','คลิกไอคอนแก้ไข (ดินสอ) ในคอลัมน์ Action ของผู้ใช้ที่ต้องการ'),numItem('num11','แก้ไขข้อมูลที่ต้องการ: โรงพยาบาล, บทบาท, รหัสผ่าน (เว้นว่างเพื่อคงรหัสเดิม)'),numItem('num11','คลิก **"Save changes"** เพื่อยืนยันการแก้ไข'),
          heading4('การลบผู้ใช้'),
          para('คลิกไอคอนลบ (ถังขยะ) ในคอลัมน์ Action ระบบจะขอการยืนยันก่อนลบบัญชีผู้ใช้'),
          heading4('การกรองผู้ใช้ (สำหรับ Root Admin)'),
          para('Root Admin สามารถกรองรายชื่อผู้ใช้ตามโรงพยาบาลได้ที่เมนู **"แสดงผู้ใช้ของ"** — เลือก "ทุกโรงพยาบาล" หรือเลือกโรงพยาบาลเฉพาะ นอกจากนี้ยังใช้ช่อง **"Search"** เพื่อค้นหาตามชื่อผู้ใช้ได้'),
          heading3('6.2.2 แท็บ Hospital Management — จัดการโรงพยาบาล'),
          para('สิทธิ์การเพิ่ม/ลบ: Root Admin เท่านั้น'),
          heading4('การเพิ่มโรงพยาบาล'),
          numItem('num12','คลิกแท็บ **"Hospital Management"**'),numItem('num12','คลิกปุ่ม **"Add Hospital"**'),numItem('num12','กรอกข้อมูลโรงพยาบาล:'),
          tbl(['ช่อง','คำอธิบาย','ตัวอย่าง'],[['**ชื่อโรงพยาบาล**','ชื่อเต็มของโรงพยาบาล (จำเป็น)','โรงพยาบาลศูนย์ A'],['**รหัสโรงพยาบาล**','รหัสย่อ (ไม่จำเป็น)','HOSP-A']],[25,50,25]),
          numItem('num12','คลิก **"บันทึก"**'),
          heading4('การแก้ไขและลบโรงพยาบาล'),
          bullet('**การแก้ไข** — Root Admin สามารถแก้ไขโรงพยาบาลใดก็ได้ Admin ทั่วไปแก้ไขได้เฉพาะโรงพยาบาลของตน'),bullet('**การลบ** — เฉพาะ Root Admin เท่านั้น และไม่สามารถลบโรงพยาบาลที่ยังมีผู้ใช้งานหรือเครื่องเอกซเรย์ลงทะเบียนอยู่ได้'),

          heading2('6.3 Admin Analytics — วิเคราะห์ข้อมูลระดับผู้ดูแล'),
          para('เส้นทาง: /adminanalytical  |  สิทธิ์: Admin'),
          para('หน้า Admin Analytics มีเนื้อหาเหมือนกับหน้า Analytical ของนักรังสีเทคนิค (ดูรายละเอียดในหัวข้อ 5.7) ครอบคลุม: การ์ด KPI, กราฟแนวโน้ม, แผนภูมิสัดส่วน, แผนภูมิแท่ง และการประเมินความเสี่ยงรายเครื่อง'),
          PB(),

          // ══ CH7 ══
          heading1('บทที่ 7 — เมนูวิศวกร (Engineer)'),
          heading2('7.1 Engineer Dashboard'),
          para('เส้นทาง: /engineerdashboard  |  สิทธิ์: Engineer'),
          para('หน้า Dashboard สำหรับวิศวกร เน้นการแสดงข้อมูล**คำขอแจ้งซ่อมและสถานะเครื่อง**'),
          heading3('การ์ดสรุปข้อมูล'),
          tbl(['การ์ด','ข้อมูลที่แสดง'],[['**DATE**','วันที่ปัจจุบัน'],['**EQUIPMENT**','จำนวนเครื่องเอกซเรย์ทั้งหมด'],['**PENDING REPAIR**','จำนวนคำขอแจ้งซ่อมที่รอดำเนินการ'],['**IN PROGRESS**','จำนวนคำขอที่กำลังดำเนินการ'],['**COMPLETED**','จำนวนคำขอที่ดำเนินการเสร็จสิ้น']],[25,75]),
          heading3('ตาราง REQUESTS'),
          para('แสดงรายการคำขอแจ้งซ่อมทั้งหมดในรูปแบบตาราง: ลำดับ, ชื่อเครื่อง (Equipment Brand/Model), ห้อง (Room), ผู้แจ้ง (Reporter) และสถานะ (Repair Status)'),
          heading2('7.2 Engineer Analytics — วิเคราะห์ข้อมูลวิศวกร'),
          para('เส้นทาง: /analyticalen  |  สิทธิ์: Admin, Engineer'),
          para('หน้าวิเคราะห์ข้อมูลสำหรับวิศวกร แสดงข้อมูลเช่นเดียวกับศูนย์วิเคราะห์ความเสี่ยง ครอบคลุม: การ์ด KPI, กราฟแนวโน้มรายเดือน, แผนภูมิสัดส่วนการแจ้งซ่อม และการประเมินความเสี่ยง'),
          heading2('7.3 Engineer Request — จัดการคำขอแจ้งซ่อม'),
          para('เส้นทาง: /requesten  |  สิทธิ์: Admin, Engineer'),
          para('หน้านี้ให้วิศวกร**จัดการและอัปเดตสถานะ**คำขอแจ้งซ่อมจากนักรังสีเทคนิค'),
          heading3('ตารางคำขอแจ้งซ่อม'),
          para('แสดงคอลัมน์: วันที่ได้รับแจ้ง, ผู้แจ้งซ่อม และปุ่ม **"ตรวจสอบ"** / **"ลบ"**'),
          heading3('สถานะของคำขอแจ้งซ่อม'),
          tbl(['สถานะ','ข้อความ (ไทย)','คำอธิบาย'],[['Pending','รอซ่อม','เพิ่งแจ้งเข้ามา ยังไม่ได้รับการดำเนินการ'],['In Progress','อยู่ระหว่างดำเนินการ','วิศวกรกำลังดำเนินการซ่อม'],['Completed','ดำเนินการแล้ว','ซ่อมเสร็จเรียบร้อยแล้ว']],[25,25,50]),
          heading3('ขั้นตอนการอัปเดตสถานะ'),
          numItem('num13','คลิกปุ่ม **"ตรวจสอบ"** ของรายการที่ต้องการ'),numItem('num13','ระบบแสดงรายละเอียดคำขอแจ้งซ่อม พร้อมรูปภาพจากนักรังสีเทคนิค (หากมี)'),numItem('num13','เลือกสถานะใหม่จากเมนูแบบเลื่อนลง: **รอซ่อม / อยู่ระหว่างดำเนินการ / ดำเนินการแล้ว**'),numItem('num13','คลิก **"บันทึก"** เพื่อยืนยันการเปลี่ยนสถานะ'),
          PB(),

          // ══ CH8 ══
          heading1('บทที่ 8 — โปรไฟล์ผู้ใช้งาน (User Profile)'),
          para('เส้นทาง: /profile  |  สิทธิ์: ทุกบทบาท'),
          para('หน้า User Profile ใช้สำหรับ**ดูข้อมูลส่วนตัว**ของผู้ใช้งาน'),
          heading2('ข้อมูลที่แสดง'),
          tbl(['ช่อง','คำอธิบาย'],[['**Username**','ชื่อผู้ใช้งานของท่าน'],['**Password**','รหัสผ่าน (คลิกไอคอนตาเพื่อแสดง/ซ่อน)']],[25,75]),
          tipBox('หากท่านต้องการเปลี่ยนรหัสผ่าน ให้ติดต่อผู้ดูแลระบบ (Admin) เพื่อดำเนินการผ่านหน้า User Accounts'),
          PB(),

          // ══ CH9 ══
          heading1('บทที่ 9 — แบบบันทึก QC ทั้งหมดในระบบ'),
          heading2('9.1 ตารางสรุปแบบบันทึก'),
          para('ระบบประกอบด้วยแบบบันทึก QC ทั้งสิ้น **13 แบบบันทึกหลัก** ดังนี้:'),
          tbl(['รหัส','ชื่อ','ความถี่','การเข้าถึง'],[['**F1**','แบบบันทึกการดูแลรักษาและตรวจสอบเครื่องเอกซเรย์ (ส่วนที่ 1)','ทุกวัน','Daily Check'],['**F2**','แบบบันทึกการลบแผ่นเพลท (ส่วนที่ 2)','ทุกวัน','Daily Check'],['**F3**','แบบบันทึกตรวจสอบคุณภาพจอแสดงผล (Monitor Performance)','ทุก 3 เดือน','Monthly Check'],['**F4**','แบบบันทึกตรวจสอบคุณภาพเครื่องเอกซเรย์ (X-ray Check)','ทุก 3 เดือน','Monthly Check'],['**F5**','แบบบันทึกทดสอบความสม่ำเสมอของภาพ (Uniformity Test)','ทุก 3 เดือน','Monthly Check'],['**F6**','แบบบันทึกตรวจสอบค่า EI (EI Consistency)','ทุก 3 เดือน','Monthly Check'],['**F7.1**','แบบบันทึก Collimator Check','ทุก 6 เดือน','Monthly Check All'],['**F7.2**','แบบบันทึก Collimator Bucky Check','ทุก 6 เดือน','Monthly Check All'],['**F8.1**','แบบบันทึก CR Dark Noise','ทุก 6 เดือน','Monthly Check All'],['**F8.2**','แบบบันทึก DR Dark Noise','ทุก 6 เดือน','Monthly Check All'],['**F9**','แบบบันทึกตรวจสอบคุณภาพเสื้อตะกั่ว','ตามกำหนด','QC Forms Hub'],['**F10**','แบบบันทึกตรวจสอบ Light Field','ทุก 1 เดือน','Monthly Check Light'],['**F11**','แบบบันทึกผลการวัดความหนาผู้ป่วย','ตามกำหนด','QC Forms Hub'],['**F12**','แบบบันทึกอัตราการถ่ายภาพซ้ำ','ตามกำหนด','QC Forms Hub'],['**F13**','แบบบันทึกตรวจ QC อัลตราซาวด์ B-mode','ตามกำหนด','QC Forms Hub']],[8,42,15,35]),
          heading2('9.2 ขั้นตอนการทำงานตามรอบ (Workflow)'),
          para('เข้าสู่ระบบ → Dashboard (ดูการแจ้งเตือน) → Daily Check (F1/F2 ทุกวัน) / ตาม PM Schedule / แจ้งซ่อม (Request) → Monthly 1 เดือน (F10) / Monthly 3 เดือน (F3–F6) / Monthly 6 เดือน (F7–F8) → Export PDF (พิมพ์รายงาน)'),
          PB(),

          // ══ CH10 ══
          heading1('บทที่ 10 — การออกจากระบบ (Logout)'),
          numItem('num14','คลิกปุ่ม **"Log out"** ที่ด้านล่างสุดของแถบเมนูด้านข้าง (Sidebar)'),numItem('num14','ระบบจะล้างข้อมูลเซสชันออกจากเบราว์เซอร์โดยอัตโนมัติ'),numItem('num14','ท่านจะถูกนำกลับไปยังหน้าเข้าสู่ระบบ (Login) ทันที'),
          noteBox('หลังจากออกจากระบบแล้ว ท่านจะไม่สามารถเข้าถึงหน้าใดๆ ในระบบได้จนกว่าจะเข้าสู่ระบบใหม่ หากพยายามเข้าถึง URL โดยตรง ระบบจะเปลี่ยนเส้นทางกลับไปยังหน้า Login โดยอัตโนมัติ'),
          PB(),

          // ══ CH11 ══
          heading1('บทที่ 11 — ข้อมูลทางเทคนิคสำหรับผู้ดูแลระบบ'),
          heading2('11.1 สถาปัตยกรรมระบบ'),
          para('Browser (Vue 3 SPA, Port 5173) → Vite Proxy → ASP.NET Core Web API (Port 8001) → PostgreSQL (Port 5433)'),
          para('Vite Development Server ทำหน้าที่เป็น Proxy สำหรับ API โดย Forward Request จาก /api/Xraycare ไปยัง Backend ที่ http://localhost:8001'),
          heading2('11.2 ฐานข้อมูล'),
          tbl(['ตาราง','คำอธิบาย','ฟิลด์สำคัญ'],[['Hospitals','ข้อมูลโรงพยาบาล','RID, Name, Code'],['Machines','เครื่องเอกซเรย์','RID, HospitalId, Machine_name, Room, Register_date, Caretaker'],['Users','บัญชีผู้ใช้','RID, HospitalId, Username, Password, Position, IsSuperAdmin'],['RepairRequests','คำขอแจ้งซ่อม','RID, HospitalId, Equipment, Room, StatusText, ImageData'],['ChecklistRecords','บันทึก Checklist','RID, HospitalId, FormType, MachineName, CheckDate, JsonData'],['ScheduleConfigs','ตั้งค่าตาราง PM','RID, HospitalId, StartDate, FrequencyType, FormTypes']],[22,20,58]),
          heading2('11.3 API Endpoints'),
          para('**Base URL:** /api/Xraycare'),
          tbl(['กลุ่ม','Endpoints'],[['**สุขภาพระบบ**','GET /Ping'],['**โรงพยาบาล**','GET /GetHospitals, POST /AddHospital, PUT /UpdateHospital/{id}, DELETE /DeleteHospital/{id}'],['**เครื่องเอกซเรย์**','GET /GetAllMachines, POST /AddMachine, DELETE /DeleteMachine/{id}'],['**บัญชีผู้ใช้**','POST /Login, GET /GetAllUsers, POST /AddUser, PUT /UpdateUser/{id}, DELETE /DeleteUser/{id}'],['**แจ้งซ่อม**','GET /GetAllRepairRequests, POST /AddRepairRequest, PUT /UpdateRepairStatus/{id}, DELETE /DeleteRepairRequest/{id}'],['**Checklist**','GET /GetAllChecklistRecords, GET /GetChecklistRecord/{id}, POST /SaveChecklist'],['**PM Schedule / UI ร่วมโรง**','GET /GetAllScheduleConfigs, POST /AddScheduleConfig, PUT /UpdateScheduleConfig/{id}, DELETE /DeleteScheduleConfig/{id}, GET /GetHospitalUiState, PUT /SaveHospitalPmCalendar, POST /AppendDailyCheckedMachine'],['**การแจ้งเตือน**','GET /GetNotifications']],[22,78]),
          heading3('HTTP Headers ที่ใช้'),
          tbl(['Header','คำอธิบาย'],[['X-Hospital-Id','รหัสโรงพยาบาลของผู้ใช้ (ส่งทุก Request)'],['X-User-Id','รหัสผู้ใช้ (ส่งทุก Request)'],['Content-Type','application/json']],[28,72]),
          heading3('การรันระบบด้วย Docker Compose'),
          para('docker-compose up -d'),
          bullet('**api.xraycare** — Web API (.NET 10) ที่พอร์ต 8001'),bullet('**postgres** — PostgreSQL 16 ที่พอร์ต 5433'),
          PB(),

          // ══ CH12 ══
          heading1('บทที่ 12 — คำถามที่พบบ่อย (FAQ)'),
          heading3('Q1: ลืมรหัสผ่านต้องทำอย่างไร?'),para('**A:** ติดต่อผู้ดูแลระบบ (Admin) ของโรงพยาบาลเพื่อให้ตั้งรหัสผ่านใหม่ผ่านหน้า User Accounts ระบบไม่มีฟังก์ชันรีเซ็ตรหัสผ่านด้วยตนเอง'),
          heading3('Q2: ไม่สามารถเข้าสู่ระบบได้ แม้กรอกข้อมูลถูกต้อง'),para('**A:** ตรวจสอบว่าท่านเลือก**โรงพยาบาล**ที่ถูกต้องตรงกับบัญชีผู้ใช้ เนื่องจากระบบตรวจสอบทั้งชื่อผู้ใช้ รหัสผ่าน และโรงพยาบาลพร้อมกัน'),
          heading3('Q3: เครื่องเอกซเรย์ที่ลงทะเบียนแล้วไม่แสดงบน Dashboard'),para('**A:** เครื่องที่ลงทะเบียนผ่านหน้า Equipment จะแสดงบน Dashboard โดยอัตโนมัติ หากไม่แสดง ให้รีเฟรชหน้าเว็บโดยกดคีย์ F5 หรือ Ctrl + R'),
          heading3('Q4: การแจ้งเตือน PM Schedule ทำงานอย่างไร?'),para('**A:** ระบบคำนวณวันที่ตรวจสอบถัดไปจาก วันเริ่มต้น + ความถี่ เมื่อวันที่ถัดไปใกล้ถึงจะแสดงการแจ้งเตือนบน Dashboard (>7 วัน = เขียว, 4–7 วัน = เหลือง, 1–3 วัน = แดง, วันนี้ = แดง+Pulse)'),
          heading3('Q5: วิธีพิมพ์รายงานเป็น PDF'),para('**A:** ไปที่เมนู **Export PDF** → กรองข้อมูลตามเงื่อนไข → คลิก "ตัวอย่างไฟล์" → ระบบเปิดหน้า Print View → กด **Ctrl+P** → เลือก **"Save as PDF"** จากเมนูเครื่องพิมพ์'),
          heading3('Q6: Root Admin ต่างจาก Admin อย่างไร?'),para('**A:** **Root Admin** — เข้าถึงได้ทุกโรงพยาบาล สามารถเพิ่ม/ลบโรงพยาบาล สร้างบัญชี Root Admin อื่นได้ และสลับโรงพยาบาลจาก Top Bar ส่วน **Admin** — เข้าถึงได้เฉพาะโรงพยาบาลที่สังกัดเท่านั้น'),
          heading3('Q7: วิศวกรสามารถเข้าถึงแบบบันทึก QC ได้หรือไม่?'),para('**A:** ไม่สามารถเข้าถึงได้โดยตรง วิศวกรมีสิทธิ์เข้าถึงเฉพาะ Engineer Dashboard, Engineer Analytics และ Engineer Request เท่านั้น หากต้องการดูข้อมูล QC ให้ติดต่อ Admin หรือนักรังสีเทคนิค'),
          heading3('Q8: สามารถใช้งานบนมือถือได้หรือไม่?'),para('**A:** ได้ ระบบรองรับการแสดงผลแบบ Responsive Design สามารถใช้งานผ่านเบราว์เซอร์บนมือถือและแท็บเล็ต แถบเมนูด้านข้างจะเปลี่ยนเป็นโหมด Overlay สามารถเปิด/ปิดได้ด้วยปุ่ม ☰ ที่แถบด้านบน'),
          heading3('Q9: ภาพที่แนบในระบบจัดเก็บอย่างไร?'),para('**A:** ภาพจะถูกแปลงเป็นรูปแบบ Base64 String และจัดเก็บในฐานข้อมูล PostgreSQL โดยตรง ไม่มีการอัปโหลดเป็นไฟล์แยกต่างหาก'),
          heading3('Q10: สามารถลบโรงพยาบาลได้เมื่อไร?'),para('**A:** สามารถลบได้เฉพาะเมื่อโรงพยาบาลนั้น**ไม่มีผู้ใช้งานและไม่มีเครื่องเอกซเรย์ลงทะเบียนอยู่** จำเป็นต้องย้ายหรือลบข้อมูลเหล่านั้นให้หมดก่อนจึงจะดำเนินการลบโรงพยาบาลได้'),

          SP(400),
          new Paragraph({alignment:AlignmentType.CENTER,children:[r('— จบเอกสาร —',{s:22,c:C.GRAY,i:true})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[r('X-RayCare QC Management System — คู่มือการใช้งาน  |  จัดทำเมื่อ 27 มีนาคม 2569',{s:18,c:C.GRAY})]}),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  let outPath = 'USER_MANUAL_NEW.docx';
  try { fs.writeFileSync(outPath, buffer); } catch(e) { if(e.code==='EBUSY'){outPath='USER_MANUAL_V2.docx';fs.writeFileSync(outPath,buffer);} else throw e; }
  console.log(`${outPath} generated! (${(buffer.length/1024).toFixed(0)} KB)`);
}
generate().catch(e=>{console.error(e);process.exit(1);});

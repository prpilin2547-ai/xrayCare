<!-- src/pages/CustomFormBuilder.vue -->
<template>
  <MainLayout>
    <div class="builder-page">
      <!-- Header -->
      <div class="builder-header">
        <div>
          <h1 class="builder-title">สร้างแบบฟอร์มบันทึกผล</h1>
          <p class="builder-subtitle">
            เพิ่มช่องกรอกข้อมูล เลือกชนิดฟิลด์ และจัดรูปแบบข้อความ คล้ายโปรแกรมเอกสาร
          </p>
        </div>

        <div class="builder-actions">
          <button class="btn-outline" type="button" @click="goBack">
            กลับไปหน้าแบบฟอร์ม QC
          </button>
          <button class="btn-primary" type="button" @click="handleSaveForm">
            บันทึกฟอร์ม
          </button>
        </div>
      </div>

      <!-- Template Content header + tabs (เหมือนรูป Visual / HTML / Preview) -->
      <div class="template-shell">
        <div class="template-top-bar">
          <span class="template-top-title">Template Content</span>

          <div class="template-tabs">
            <button
              type="button"
              class="tab-btn"
              :class="{ active: editorMode === 'visual' }"
              @click="switchMode('visual')"
            >
              Visual Editor
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: editorMode === 'html' }"
              @click="switchMode('html')"
            >
              &lt;/&gt; HTML Code
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: editorMode === 'preview' }"
              @click="switchMode('preview')"
            >
              Preview
            </button>
          </div>
        </div>

        <!-- ===== VISUAL MODE: เหมือนหน้าสร้างฟอร์มเดิม + toolbar แบบในรูป ===== -->
        <div v-if="editorMode === 'visual'" class="template-body">
          <!-- Rich text toolbar + editor เหมือน Rich Text Editor ในภาพ -->
          <div class="rte-panel">
            <div class="rte-toolbar">
              <!-- undo / redo -->
              <button type="button" class="tool-btn" @click="exec('undo')">
                ⟲
              </button>
              <button type="button" class="tool-btn" @click="exec('redo')">
                ⟳
              </button>

              <div class="tool-divider"></div>

              <!-- bold / italic / underline / strike -->
              <button type="button" class="tool-btn" @click="exec('bold')">
                <strong>B</strong>
              </button>
              <button type="button" class="tool-btn" @click="exec('italic')">
                <em>I</em>
              </button>
              <button type="button" class="tool-btn" @click="exec('underline')">
                <u>U</u>
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="exec('strikeThrough')"
              >
                <s>S</s>
              </button>

              <div class="tool-divider"></div>

              <!-- font family -->
              <select
                class="tool-select"
                v-model="fontFamily"
                @change="applyFontFamily"
              >
                <option value="">Font Family</option>
                <option value="Arial">Arial</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Calibri">Calibri</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>

              <!-- font size -->
              <select
                class="tool-select"
                v-model="fontSize"
                @change="applyFontSize"
              >
                <option value="">Font Size</option>
                <option value="1">8 pt</option>
                <option value="2">10 pt</option>
                <option value="3">12 pt</option>
                <option value="4">14 pt</option>
                <option value="5">18 pt</option>
                <option value="6">24 pt</option>
                <option value="7">32 pt</option>
              </select>

              <!-- style: normal / H1 / H2 / H3 -->
              <select
                class="tool-select"
                v-model="blockStyle"
                @change="applyBlockStyle"
              >
                <option value="p">Style</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="p">Paragraph</option>
              </select>

              <div class="tool-divider"></div>

              <!-- align -->
              <button
                type="button"
                class="tool-btn"
                @click="exec('justifyLeft')"
              >
                ⬅
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="exec('justifyCenter')"
              >
                ⬍
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="exec('justifyRight')"
              >
                ➡
              </button>

              <div class="tool-divider"></div>

              <!-- list -->
              <button
                type="button"
                class="tool-btn"
                @click="exec('insertUnorderedList')"
              >
                •
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="exec('insertOrderedList')"
              >
                1.
              </button>

              <div class="tool-divider"></div>

              <!-- text color / bg color -->
              <label class="color-picker">
                <span class="color-label">A</span>
                <input
                  type="color"
                  v-model="fontColor"
                  @input="applyFontColor"
                />
              </label>

              <label class="color-picker">
                <span class="color-label">Bk</span>
                <input
                  type="color"
                  v-model="highlightColor"
                  @input="applyHighlightColor"
                />
              </label>

              <div class="tool-divider"></div>

              <!-- form elements (ไอคอนคล้ายในรูป) -->
              <span class="form-elements-label">Form Elements:</span>
              <button
                type="button"
                class="tool-btn"
                title="เพิ่มช่องข้อความ"
                @click="addField('short-text')"
              >
                Tx
              </button>
              <button
                type="button"
                class="tool-btn"
                title="เพิ่ม Textarea"
                @click="addField('long-text')"
              >
                T…
              </button>
              <button
                type="button"
                class="tool-btn"
                title="Dropdown"
                @click="addField('dropdown')"
              >
                ⌄
              </button>
              <button
                type="button"
                class="tool-btn"
                title="Checkbox"
                @click="addField('checkbox')"
              >
                ☑
              </button>
              <button
                type="button"
                class="tool-btn"
                title="Number"
                @click="addField('number')"
              >
                123
              </button>
              <button
                type="button"
                class="tool-btn"
                title="Date"
                @click="addField('date')"
              >
                📅
              </button>
              <button
                type="button"
                class="tool-btn"
                title="รูปภาพ"
                @click="addField('image')"
              >
                🖼
              </button>
            </div>

            <!-- ตัว editor จริง -->
            <div
              ref="richEditorRef"
              class="rich-editor"
              contenteditable="true"
              @input="syncRichContent"
            ></div>
          </div>

          <!-- meta ข้างบน (ชื่อ / code / หมวด) -->
          <div class="meta-panel">
            <div class="meta-row">
              <label class="meta-label">ชื่อแบบฟอร์ม</label>
              <input
                v-model="formTitle"
                type="text"
                class="meta-input"
                placeholder="เช่น Pachymetry, แบบบันทึกผลตรวจสอบคุณภาพอื่น ๆ"
              />
            </div>
            <div class="meta-grid">
              <div class="meta-row">
                <label class="meta-label">รหัสแบบฟอร์ม (Code)</label>
                <input
                  v-model="formCode"
                  type="text"
                  class="meta-input"
                  placeholder="เช่น C1, C2"
                />
              </div>
              <div class="meta-row">
                <label class="meta-label">หมวดหมู่</label>
                <input
                  v-model="formCategory"
                  type="text"
                  class="meta-input"
                  placeholder="เช่น Custom QC, Ultrasound, General X-ray"
                />
              </div>
            </div>
          </div>

          <!-- Placeholder note: Visual Editor is the single source of truth for form structure -->
          <div class="info-panel">
            <!-- <div class="preview-card">
              <h3 class="settings-title">กำหนดฟอร์มด้วย Visual Editor</h3>
              <p class="settings-subtitle">
                เพิ่มบล็อกฟิลด์โดยใช้ปุ่ม Form Elements ด้านบน แล้วจัดตำแหน่งและข้อความโดยตรงในตัว editor — ไม่มีการตั้งค่าฟิลด์เพิ่มเติมในแถบด้านขวาอีกต่อไป
              </p>
              <p class="html-hint">กด "Preview" เพื่อดูผลลัพธ์ทั้งหมดก่อนบันทึก</p>
            </div> -->
          </div>
        </div>

        <!-- ===== HTML MODE: แก้ HTML โดยตรง (เฉพาะส่วน Rich Text) ===== -->
        <div v-else-if="editorMode === 'html'" class="template-body">
          <div class="html-editor-wrapper">
            <label class="meta-label">HTML ของหัวฟอร์ม / คำอธิบาย</label>
            <textarea
              v-model="richContent"
              class="html-textarea"
              rows="18"
            ></textarea>
            <p class="html-hint">
              เมื่อกลับไปโหมด Visual ระบบจะ render HTML นี้ใน Rich Text
              Editor อัตโนมัติ
            </p>
          </div>
        </div>

        <!-- ===== PREVIEW MODE: แสดงฟอร์มเต็ม ๆ เหมือนในรูป ===== -->
        <div v-else class="template-body preview-mode">
          <div class="preview-template">
            <div class="preview-header-bar">
              <button class="btn-outline" type="button" @click="switchMode('visual')">
                แก้ไขต่อ (Visual Editor)
              </button>
            </div>

            <div class="preview-template-inner">
              <div class="preview-template-title">
                {{ formTitle || 'ฟอร์มไม่มีชื่อ' }}
              </div>
              <div class="preview-template-desc" v-html="richContent"></div>

              
            </div>
          </div>
        </div>
      </div>
      <!-- /template-shell -->
      <!-- Floating actions (bottom-right) -->
      <!-- <div class="floating-actions">
        <button class="btn-outline" type="button" @click="goBack">Cancel</button>
        <button class="btn-primary" type="button" @click="handleSaveForm">Save Template</button>
      </div> -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const router = useRouter()
const route = useRoute()

const richEditorRef = ref(null)

// editor mode: visual / html / preview
const editorMode = ref('visual')

// meta
const formTitle = ref('ฟอร์มไม่มีชื่อ')
const formCode = ref('C1')
const formCategory = ref('Custom QC')

// rich text (เก็บเป็น HTML string)
const richContent = ref('')

// toolbar state
const fontFamily = ref('')
const fontSize = ref('')
const blockStyle = ref('p')
const fontColor = ref('#000000')
const highlightColor = ref('#ffffff')

// fields state
const fields = ref([])

// note: field settings removed — form structure is defined in Visual Editor
// (fields[] is still kept for save/export if needed)

// ตรวจว่ากำลังแก้ฟอร์มเดิมหรือสร้างใหม่
const isEditMode = computed(() => !!route.params.id)
const editingFormId = computed(() => route.params.id || null)

// ----- helper: gen id ไม่ซ้ำจริง ๆ -----
const generateId = (prefix = 'cf_') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return prefix + crypto.randomUUID()
  }
  return (
    prefix +
    Date.now().toString(36) +
    '_' +
    Math.random().toString(36).slice(2, 8)
  )
}

// ---------- editor mode switch ----------
const switchMode = async (mode) => {
  if (mode === editorMode.value) return

  // ก่อนเปลี่ยนโหมดให้ sync richContent เสมอ (ไม่ว่าจะออกจากโหมดไหน)
  if (editorMode.value === 'visual' && richEditorRef.value) {
    syncRichContent()
  }

  editorMode.value = mode

  // เข้าสู่ visual อีกครั้ง → รอให้ DOM พร้อมก่อน render richContent ลง editor
  if (mode === 'visual') {
    await nextTick()
    if (richEditorRef.value) {
      richEditorRef.value.innerHTML = richContent.value
    }
  }
}

// ---------- rich text ----------
const exec = (cmd) => {
  document.execCommand(cmd, false, null)
}

const syncRichContent = () => {
  if (richEditorRef.value) {
    richContent.value = richEditorRef.value.innerHTML
  }
}

const applyFontFamily = () => {
  if (!fontFamily.value) return
  document.execCommand('fontName', false, fontFamily.value)
}

const applyFontSize = () => {
  if (!fontSize.value) return
  document.execCommand('fontSize', false, fontSize.value)
}

const applyBlockStyle = () => {
  const tag = blockStyle.value || 'p'
  document.execCommand('formatBlock', false, tag)
}

const applyFontColor = () => {
  if (!fontColor.value) return
  document.execCommand('foreColor', false, fontColor.value)
}

const applyHighlightColor = () => {
  if (!highlightColor.value) return
  document.execCommand('hiliteColor', false, highlightColor.value)
}

// ---------- field operations ----------
// insert HTML into the rich editor at the current cursor (fallback: append)
const insertHtmlAtCursor = (html) => {
  if (!richEditorRef.value) return
  richEditorRef.value.focus()
  try {
    document.execCommand('insertHTML', false, html)
  } catch (e) {
    // fallback: append
    richEditorRef.value.insertAdjacentHTML('beforeend', html)
  }
  syncRichContent()
}

const addField = (type) => {
  const id = generateId('fld_')
  const fieldName = 'f_' + generateId().slice(-8) // field name ไม่ซ้ำ
  
  const base = {
    id,
    name: fieldName,
    type,
    label: '',
    placeholder: '',
    required: false,
    note: ''
  }

  // เพิ่มเข้า fields array ก่อน
  fields.value.push(base)

  // ถ้าเป็น dropdown ให้ตั้งค่า options เริ่มต้นไว้ใน field
  if (type === 'dropdown') {
    base.options = base.options || ['ตัวเลือก 1','ตัวเลือก 2']
  }

  // สร้าง HTML สำหรับแสดงใน visual editor
  let html = ''
  const labelText = type === 'short-text' ? 'Enter text' : 'Field'

  switch (type) {
    case 'short-text':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control"><input class="editor-input" type="text" placeholder="Enter" /></div></div>`
      break
    case 'long-text':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control"><textarea class="editor-textarea" placeholder="Enter longer text"></textarea></div></div>`
      break
    case 'number':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control"><input class="editor-input" type="number" placeholder="" /></div></div>`
      break
    case 'date':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control"><input class="editor-input" type="date" /></div></div>`
      break
    case 'dropdown':
      {
        const opts = '<option>ตัวเลือก 1</option><option>ตัวเลือก 2</option>'
        html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control"><select class="editor-select">${opts}</select></div></div>`
      }
      break
    case 'checkbox':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label><input type="checkbox" /> ${labelText}</label></div>`
      break
    case 'image':
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label><div class="editor-control image-placeholder">Image placeholder</div></div>`
      break
    default:
      html = `<div class="editor-field" data-field-id="${id}" data-field-name="${fieldName}"><label>${labelText}</label></div>`
  }

  // เพิ่มลงใน visual editor
  if (editorMode.value === 'visual' && richEditorRef.value) {
    insertHtmlAtCursor(html)
  } else {
    // keep richContent in sync so HTML mode shows it
    richContent.value += html
  }
}



// ---------- save & load ----------
const handleSaveForm = () => {
  if (!formTitle.value.trim()) {
    alert('กรุณากรอกชื่อแบบฟอร์ม')
    return
  }

  // sync rich text ก่อนเซฟ
  if (editorMode.value === 'visual') {
    syncRichContent()
  }

  const stored = JSON.parse(localStorage.getItem('xraycare_custom_forms') || '[]')

  const id = editingFormId.value || generateId('cf_')
  const routePath = '/custom-forms/' + id // อย่าลืมเพิ่ม route path นี้ใน router

  const formPayload = {
    id, // id ฟอร์ม ไม่ซ้ำ
    code: formCode.value || 'C?',
    title: formTitle.value,
    category: formCategory.value || 'Custom QC',
    description: stripHtml(richContent.value).slice(0, 120),
    richContent: richContent.value,
    fields: fields.value,
    route: routePath
  }

  const existingIndex = stored.findIndex((f) => f.id === id)
  if (existingIndex >= 0) {
    stored[existingIndex] = formPayload
  } else {
    stored.push(formPayload)
  }

  localStorage.setItem('xraycare_custom_forms', JSON.stringify(stored))

  // กลับไปหน้า hub (path ของคุณตั้งไว้ /qc-forms)
  router.push('/qc-forms')
}

const stripHtml = (html) => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const goBack = () => {
  router.push('/qc-forms')
}

// โหลดฟอร์มเดิมถ้าอยู่ในโหมดแก้ไข
onMounted(() => {
  if (isEditMode.value) {
    const stored = JSON.parse(localStorage.getItem('xraycare_custom_forms') || '[]')
    const found = stored.find((f) => f.id === editingFormId.value)
    if (found) {
      formTitle.value = found.title
      formCode.value = found.code
      formCategory.value = found.category
      richContent.value = found.richContent || ''
      fields.value = found.fields || []
      if (richEditorRef.value) {
        richEditorRef.value.innerHTML = richContent.value
      }
    }
  }
})
</script>

<style scoped>
.builder-page {
  padding: 24px 32px 32px;
  background: #f8fafc;
  min-height: calc(100vh - 56px);
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.builder-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.builder-subtitle {
  font-size: 0.86rem;
  color: var(--text-secondary, #475569);
  margin-top: 4px;
  max-width: 520px;
}

.builder-actions {
  display: flex;
  gap: 10px;
}

.btn-primary,
.btn-outline,
.btn-danger {
  border-radius: var(--radius-sm, 8px);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast, 150ms);
}

.btn-primary {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  color: #fff;
  box-shadow: 0 2px 6px rgba(3, 105, 161, 0.25);
}
.btn-primary:hover {
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.35);
}

.btn-outline {
  background: var(--bg-card, #fff);
  color: var(--text-main, #0f172a);
  border: 1px solid var(--border-soft, #e2e8f0);
}
.btn-outline:hover {
  background: #f1f5f9;
}

.btn-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.btn-danger:hover {
  background: #fee2e2;
}

.template-shell {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  margin-top: 12px;
}

.template-top-bar {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-top-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.template-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 14px;
  font-size: 0.8rem;
  background: #f8fafc;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}
.tab-btn:hover {
  background: #f1f5f9;
}
.tab-btn.active {
  background: linear-gradient(135deg, #0369A1, #0EA5E9);
  border-color: transparent;
  color: #fff;
}

.template-body {
  padding: 16px 20px 20px;
}

.rte-panel {
  background: #f8fafc;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  margin-bottom: 16px;
}

.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
}

.tool-btn {
  border: none;
  background: transparent;
  padding: 6px 8px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}
.tool-btn:hover {
  background: #e2e8f0;
}

.tool-divider {
  width: 1px;
  height: 22px;
  background: var(--border-soft, #e2e8f0);
  margin: 0 4px;
}

.tool-select {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 4px 8px;
  font-size: 0.78rem;
  background: var(--bg-card, #fff);
}

.color-picker {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
}
.color-picker input {
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
}
.color-label {
  font-weight: 600;
}

.form-elements-label {
  font-size: 0.78rem;
  color: var(--text-muted, #94a3b8);
  margin-right: 4px;
}

.rich-editor {
  min-height: 160px;
  padding: 12px 14px 14px;
  font-size: 0.9rem;
  line-height: 1.5;
  background: var(--bg-card, #fff);
  border-radius: 0 0 var(--radius-md, 12px) var(--radius-md, 12px);
  border: 1px solid transparent;
  outline: none;
  transition: border-color var(--transition-fast, 150ms);
}
.rich-editor:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 2px rgba(3, 105, 161, 0.15);
}

.meta-panel {
  background: var(--bg-card, #fff);
  padding: 16px 0 8px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.meta-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
  margin-bottom: 6px;
}

.meta-input {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
  transition: border-color var(--transition-fast, 150ms);
}
.meta-input:focus {
  outline: none;
  border-color: var(--purple-soft, #0EA5E9);
}

.builder-body {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(260px, 0.9fr);
  gap: 16px;
  margin-top: 12px;
}

.preview-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card);
  padding: 16px 18px 18px;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.preview-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted, #94a3b8);
  margin-bottom: 10px;
}

.preview-field {
  border-radius: var(--radius-md, 12px);
  border: 1px dashed var(--border-soft, #e2e8f0);
  padding: 10px 12px;
  background: #f8fafc;
  cursor: pointer;
}

.preview-field.selected {
  border-color: var(--purple-soft, #0EA5E9);
  background: #E0F2FE;
}

.field-name-tag {
  font-size: 0.7rem;
  background: #e2e8f0;
  border-radius: var(--radius-full, 9999px);
  padding: 2px 8px;
  color: var(--text-secondary, #475569);
}

.preview-input,
.preview-textarea {
  width: 100%;
  font-size: 0.82rem;
  padding: 8px 10px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
}

.image-placeholder {
  font-size: 0.78rem;
  color: var(--text-muted, #94a3b8);
  padding: 16px 12px;
  border-radius: var(--radius-sm, 8px);
  border: 1px dashed var(--border-soft, #e2e8f0);
  text-align: center;
}

.settings-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  padding: 16px 18px 18px;
}

.settings-input,
.settings-textarea {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 10px;
  font-size: 0.82rem;
}

.html-editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.html-textarea {
  width: 100%;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 12px 14px;
  font-family: Consolas, monospace;
  font-size: 0.82rem;
}
.html-textarea:focus {
  outline: none;
  border-color: var(--purple-soft, #0EA5E9);
}
.html-hint {
  font-size: 0.78rem;
  color: var(--text-muted, #94a3b8);
}

.preview-mode {
  background: #f8fafc;
}
.preview-template {
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  background: var(--bg-card, #fff);
  box-shadow: var(--shadow-card);
}
.preview-header-bar {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  display: flex;
  justify-content: flex-end;
}
.preview-template-inner {
  padding: 20px 24px 24px;
}
.preview-template-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
  margin-bottom: 8px;
}
.preview-template-desc {
  font-size: 0.9rem;
  color: var(--text-secondary, #475569);
  margin-bottom: 16px;
}

.editor-field {
  padding: 12px 14px;
  border-radius: var(--radius-md, 12px);
  border: 1px dashed var(--border-soft, #e2e8f0);
  margin: 10px 0;
  background: #f8fafc;
}
.editor-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main, #0f172a);
}
.editor-control .editor-input,
.editor-control .editor-textarea,
.editor-control .editor-select {
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  background: var(--bg-card, #fff);
  font-size: 0.9rem;
}
.editor-control .editor-textarea {
  min-height: 70px;
}

@media (max-width: 1024px) {
  .rte-toolbar { flex-wrap: wrap; gap: 4px; }
  .meta-panel { flex-direction: column; }
}
@media (max-width: 640px) {
  .builder-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .builder-header .actions { width: 100%; justify-content: space-between; }
  .template-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .tab-btn { white-space: nowrap; font-size: 0.78rem; padding: 6px 12px; }
  .rich-editor { min-height: 200px; }
  .html-editor-wrapper textarea { min-height: 200px; font-size: 0.78rem; }
}
</style>

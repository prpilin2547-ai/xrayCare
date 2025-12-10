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

          <!-- Main layout: left preview + right settings -->
          <div class="builder-body">
            <!-- Left column: preview ของฟิลด์ -->
            <div class="left-column">
              <div class="preview-card">
                <h2 class="preview-title">ตัวอย่างช่องบันทึกผล</h2>
                <p class="preview-subtitle">
                  ด้านล่างเป็นตัวอย่างฟิลด์ที่ระบบจะใช้เก็บข้อมูลจริง
                </p>

                <form class="preview-form" @submit.prevent>
                  <div
                    v-for="(field, index) in fields"
                    :key="field.id"
                    class="preview-field"
                    :class="{ selected: selectedFieldIndex === index }"
                    @click.stop="selectField(index)"
                  >
                    <div class="preview-field-header">
                      <label class="preview-label">
                        {{ field.label || 'ชื่อฟิลด์ (ตั้งค่าด้านขวา)' }}
                        <span v-if="field.required" class="required-star">*</span>
                      </label>
                      <div class="preview-field-actions">
                        <span class="field-name-tag">{{ field.name }}</span>
                        <button
                          type="button"
                          class="icon-btn"
                          title="ลบฟิลด์"
                          @click.stop="removeField(index)"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div class="preview-input-wrapper">
                      <template v-if="field.type === 'short-text'">
                        <input
                          type="text"
                          class="preview-input"
                          :placeholder="field.placeholder || 'ใส่ข้อความ...'"
                          disabled
                        />
                      </template>

                      <template v-else-if="field.type === 'long-text'">
                        <textarea
                          class="preview-textarea"
                          :placeholder="field.placeholder || 'ใส่รายละเอียด...'"
                          disabled
                        ></textarea>
                      </template>

                      <template v-else-if="field.type === 'number'">
                        <input
                          type="number"
                          class="preview-input"
                          :placeholder="field.placeholder || 'ใส่ตัวเลข...'"
                          disabled
                        />
                      </template>

                      <template v-else-if="field.type === 'date'">
                        <input type="date" class="preview-input" disabled />
                      </template>

                      <template v-else-if="field.type === 'dropdown'">
                        <select class="preview-input" disabled>
                          <option v-if="!field.options?.length">
                            -- ตัวเลือก --
                          </option>
                          <option
                            v-for="(opt, idx) in field.options"
                            :key="idx"
                            :value="opt"
                          >
                            {{ opt }}
                          </option>
                        </select>
                      </template>

                      <template v-else-if="field.type === 'checkbox'">
                        <label class="checkbox-line">
                          <input type="checkbox" disabled />
                          <span>{{ field.placeholder || 'ตัวเลือก' }}</span>
                        </label>
                      </template>

                      <template v-else-if="field.type === 'image'">
                        <div class="image-placeholder">
                          พื้นที่แนบรูปภาพ (ผู้ใช้จะอัปโหลดจริงตอนบันทึกผล)
                        </div>
                      </template>
                    </div>

                    <div v-if="field.note" class="preview-note">
                      {{ field.note }}
                    </div>
                  </div>

                  <div v-if="!fields.length" class="empty-hint">
                    ยังไม่มีฟิลด์ในฟอร์ม กดไอคอน Form Elements ด้านบนเพื่อเพิ่มฟิลด์
                  </div>
                </form>
              </div>
            </div>

            <!-- Right column: ตั้งค่าฟิลด์ -->
            <div class="right-column">
              <div class="settings-card" v-if="selectedField">
                <h3 class="settings-title">ตั้งค่าฟิลด์</h3>
                <p class="settings-subtitle">
                  แก้ไขชื่อฟิลด์ Placeholder ตัวเลือก และคุณสมบัติอื่น ๆ
                </p>

                <div class="settings-row">
                  <label class="settings-label">ประเภทฟิลด์</label>
                  <div class="settings-pill">
                    {{ fieldTypeLabel(selectedField.type) }}
                  </div>
                </div>

                <div class="settings-row">
                  <label class="settings-label">Field ID / Name (ไม่ซ้ำ)</label>
                  <input
                    v-model="selectedField.name"
                    type="text"
                    class="settings-input"
                    readonly
                  />
                </div>

                <div class="settings-row">
                  <label class="settings-label">ชื่อฟิลด์ (Label)</label>
                  <input
                    v-model="selectedField.label"
                    type="text"
                    class="settings-input"
                    placeholder="เช่น ความหนา (mm), รายละเอียดปัญหา"
                  />
                </div>

                <div class="settings-row" v-if="selectedField.type !== 'image'">
                  <label class="settings-label">
                    Placeholder / คำอธิบายสั้น ๆ
                  </label>
                  <input
                    v-model="selectedField.placeholder"
                    type="text"
                    class="settings-input"
                    placeholder="ข้อความตัวอย่างในช่อง"
                  />
                </div>

                <div
                  class="settings-row"
                  v-if="selectedField.type === 'dropdown'"
                >
                  <label class="settings-label">
                    ตัวเลือก Dropdown (หนึ่งบรรทัดต่อหนึ่งตัวเลือก)
                  </label>
                  <textarea
                    v-model="dropdownOptionText"
                    class="settings-textarea"
                    rows="4"
                    placeholder="เช่น&#10;ผ่าน&#10;ไม่ผ่าน&#10;รอทดสอบใหม่"
                    @input="updateDropdownOptions"
                  ></textarea>
                </div>

                <div
                  class="settings-row"
                  v-if="selectedField.type === 'checkbox'"
                >
                  <label class="settings-label">ข้อความข้าง Checkbox</label>
                  <input
                    v-model="selectedField.placeholder"
                    type="text"
                    class="settings-input"
                    placeholder="เช่น ยืนยันว่าตรวจสอบแล้ว"
                  />
                </div>

                <div class="settings-row">
                  <label class="settings-label">
                    หมายเหตุ (จะแสดงตัวเล็กใต้ฟิลด์)
                  </label>
                  <textarea
                    v-model="selectedField.note"
                    class="settings-textarea"
                    rows="3"
                    placeholder="เช่น กรอกเป็นหน่วย mm, กรอกเฉพาะตัวเลข"
                  ></textarea>
                </div>

                <div class="settings-row inline">
                  <label class="settings-label">บังคับกรอก</label>
                  <label class="switch">
                    <input v-model="selectedField.required" type="checkbox" />
                    <span class="slider"></span>
                  </label>
                </div>

                <div class="settings-row">
                  <button
                    type="button"
                    class="btn-danger"
                    @click="deleteSelected"
                  >
                    ลบฟิลด์นี้
                  </button>
                </div>
              </div>

              <div class="settings-card empty" v-else>
                <h3 class="settings-title">เลือกฟิลด์เพื่อแก้ไข</h3>
                <p class="settings-subtitle">
                  คลิกฟิลด์ในตัวอย่างด้านซ้ายเพื่อดูรายละเอียดและแก้ไขค่าต่าง ๆ
                </p>
              </div>
            </div>
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

              <form class="preview-template-form" @submit.prevent>
                <div
                  v-for="field in fields"
                  :key="field.id"
                  class="preview-template-item"
                >
                  <label class="preview-template-label">
                    {{ field.label || field.name }}
                    <span v-if="field.required" class="required-star">*</span>
                  </label>

                  <div class="preview-template-control">
                    <template v-if="field.type === 'short-text'">
                      <input type="text" class="preview-input" />
                    </template>
                    <template v-else-if="field.type === 'long-text'">
                      <textarea class="preview-textarea"></textarea>
                    </template>
                    <template v-else-if="field.type === 'number'">
                      <input type="number" class="preview-input" />
                    </template>
                    <template v-else-if="field.type === 'date'">
                      <input type="date" class="preview-input" />
                    </template>
                    <template v-else-if="field.type === 'dropdown'">
                      <select class="preview-input">
                        <option
                          v-for="(opt, idx) in field.options"
                          :key="idx"
                          :value="opt"
                        >
                          {{ opt }}
                        </option>
                      </select>
                    </template>
                    <template v-else-if="field.type === 'checkbox'">
                      <label class="checkbox-line">
                        <input type="checkbox" />
                        <span>{{ field.placeholder || 'ตัวเลือก' }}</span>
                      </label>
                    </template>
                    <template v-else-if="field.type === 'image'">
                      <div class="image-placeholder">
                        พื้นที่แนบรูปภาพ
                      </div>
                    </template>
                  </div>

                  <div v-if="field.note" class="preview-note">
                    {{ field.note }}
                  </div>
                </div>
              </form>
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

const selectedFieldIndex = ref(null)
const selectedField = computed(() =>
  selectedFieldIndex.value != null ? fields.value[selectedFieldIndex.value] : null
)

// ใช้สำหรับ textarea ตัวเลือก dropdown
const dropdownOptionText = ref('')

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

  if (type === 'dropdown') {
    base.options = ['ตัวเลือก 1', 'ตัวเลือก 2']
  }

  // เพิ่มเข้า fields array ก่อน
  fields.value.push(base)
  selectedFieldIndex.value = fields.value.length - 1

  if (type === 'dropdown') {
    dropdownOptionText.value = base.options.join('\n')
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

const selectField = (index) => {
  selectedFieldIndex.value = index
  const field = fields.value[index]
  if (field.type === 'dropdown') {
    dropdownOptionText.value = (field.options || []).join('\n')
  }
}

const removeField = (index) => {
  fields.value.splice(index, 1)
  if (selectedFieldIndex.value === index) {
    selectedFieldIndex.value = null
  } else if (selectedFieldIndex.value > index) {
    selectedFieldIndex.value--
  }
}

const deleteSelected = () => {
  if (selectedFieldIndex.value != null) {
    removeField(selectedFieldIndex.value)
  }
}

const fieldTypeLabel = (type) => {
  switch (type) {
    case 'short-text':
      return 'ข้อความสั้น'
    case 'long-text':
      return 'ข้อความยาว'
    case 'number':
      return 'ตัวเลข'
    case 'date':
      return 'วันที่'
    case 'dropdown':
      return 'Dropdown'
    case 'checkbox':
      return 'Checkbox'
    case 'image':
      return 'รูปภาพ'
    default:
      return type
  }
}

// dropdown options -> array
const updateDropdownOptions = () => {
  if (!selectedField.value || selectedField.value.type !== 'dropdown') return
  const lines = dropdownOptionText.value
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l)
  selectedField.value.options = lines
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
  background: #f3f4f6;
  min-height: calc(100vh - 56px);
}

.builder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.builder-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
}

.builder-subtitle {
  font-size: 0.86rem;
  color: #6b7280;
  margin-top: 4px;
  max-width: 520px;
}

.builder-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-outline,
.btn-danger {
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}
.btn-primary:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

.btn-outline {
  background: transparent;
  color: #111827;
  border: 1px solid #d1d5db;
}
.btn-outline:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #f97373;
  color: #ffffff;
}
.btn-danger:hover {
  background: #ef4444;
}

/* template shell + tabs (เหมือนในรูป) */
.template-shell {
  background: #ffffff;
  box-shadow: 0 0 0 1px #e5e7eb;
  border-radius: 12px;
  margin-top: 8px;
}

.template-top-bar {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-top-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

.template-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  font-size: 0.78rem;
  background: #f9fafb;
  cursor: pointer;
}
.tab-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

/* body inside template */
.template-body {
  padding: 12px 16px 16px;
}

/* RTE */
.rte-panel {
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 12px;
}

.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.tool-btn {
  border: none;
  background: transparent;
  padding: 3px 6px;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
}
.tool-btn:hover {
  background: #e5e7eb;
}

.tool-divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 4px;
}

.tool-select {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 2px 6px;
  font-size: 0.78rem;
  background: #ffffff;
}

.color-picker {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
}
.color-picker input {
  width: 18px;
  height: 18px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
.color-label {
  font-weight: 600;
}

.form-elements-label {
  font-size: 0.78rem;
  color: #6b7280;
  margin-right: 2px;
}

.rich-editor {
  min-height: 140px;
  padding: 8px 10px 10px;
  font-size: 0.9rem;
  line-height: 1.5;
  background: #ffffff;
  border-radius: 0 0 8px 8px;
}

/* meta */
.meta-panel {
  background: #ffffff;
  padding: 12px 0 4px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.meta-row {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}

.meta-label {
  font-size: 0.8rem;
  color: #4b5563;
  margin-bottom: 4px;
}

.meta-input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  font-size: 0.85rem;
}

/* body columns */
.builder-body {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(260px, 0.9fr);
  gap: 16px;
  margin-top: 12px;
}

/* preview card */
.preview-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e5e7eb;
  padding: 12px 14px 14px;
}

.preview-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.preview-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.preview-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-field {
  border-radius: 10px;
  border: 1px dashed #d1d5db;
  padding: 8px 10px;
  background: #fafafa;
  cursor: pointer;
}

.preview-field.selected {
  border-color: #2563eb;
  background: #e0f2fe;
}

.preview-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-field-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-name-tag {
  font-size: 0.7rem;
  background: #e5e7eb;
  border-radius: 999px;
  padding: 2px 6px;
  color: #374151;
}

.preview-label {
  font-size: 0.83rem;
  font-weight: 500;
}

.required-star {
  color: #ef4444;
  margin-left: 2px;
}

.preview-input-wrapper {
  margin-top: 6px;
}

.preview-input,
.preview-textarea {
  width: 100%;
  font-size: 0.82rem;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}

.preview-textarea {
  min-height: 70px;
  resize: vertical;
}

.checkbox-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
}

.image-placeholder {
  font-size: 0.78rem;
  color: #6b7280;
  padding: 14px 10px;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
  text-align: center;
}

.preview-note {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #6b7280;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  cursor: pointer;
  color: #9ca3af;
}
.icon-btn:hover {
  color: #ef4444;
}

.empty-hint {
  padding: 10px 8px;
  font-size: 0.8rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 8px;
}

/* right column */
.settings-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e5e7eb;
  padding: 12px 14px 14px;
}

.settings-card.empty {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.settings-subtitle {
  font-size: 0.78rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.settings-row {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-row.inline {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.settings-label {
  font-size: 0.8rem;
  color: #4b5563;
}

.settings-input,
.settings-textarea {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.82rem;
}

.settings-textarea {
  resize: vertical;
}

.settings-pill {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.78rem;
}

/* switch */
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #d1d5db;
  transition: 0.2s;
  border-radius: 999px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: #ffffff;
  transition: 0.2s;
  border-radius: 999px;
}
input:checked + .slider {
  background-color: #4ade80;
}
input:checked + .slider:before {
  transform: translateX(16px);
}

/* HTML mode */
.html-editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.html-textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-family: Consolas, monospace;
  font-size: 0.82rem;
}
.html-hint {
  font-size: 0.78rem;
  color: #6b7280;
}

/* Preview mode (เต็มจอ คล้ายรูป) */
.preview-mode {
  background: #f9fafb;
}
.preview-template {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}
.preview-header-bar {
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}
.preview-template-inner {
  padding: 16px 18px 18px;
}
.preview-template-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.preview-template-desc {
  font-size: 0.9rem;
  color: #4b5563;
  margin-bottom: 14px;
}
.preview-template-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.preview-template-item {
  padding: 6px 0;
}
.preview-template-label {
  font-size: 0.83rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.preview-template-control {
  margin-bottom: 2px;
}

/* editor inserted field blocks (inside rich editor) */
.editor-field {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
  margin: 8px 0;
  background: #fafafa;
}
.editor-field label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111827;
}
.editor-control .editor-input,
.editor-control .editor-textarea,
.editor-control .editor-select {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 0.9rem;
}
.editor-control .editor-textarea {
  min-height: 70px;
}

/* floating action buttons (bottom-right) */
.floating-actions {
  position: fixed;
  right: 22px;
  bottom: 22px;
  display: flex;
  gap: 10px;
  z-index: 60;
}

/* responsive */
@media (max-width: 1024px) {
  .builder-body {
    grid-template-columns: 1fr;
  }
  .right-column {
    order: -1;
  }
}
@media (max-width: 768px) {
  .builder-page {
    padding: 16px;
  }
  .builder-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .builder-actions {
    align-self: stretch;
    justify-content: flex-start;
  }
  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>

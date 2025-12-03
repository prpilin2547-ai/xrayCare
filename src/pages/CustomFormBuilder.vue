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

      <!-- Form meta (title, code, category) -->
      <div class="meta-panel">
        <div class="meta-row">
          <label class="meta-label">ชื่อแบบฟอร์ม</label>
          <input
            v-model="formTitle"
            type="text"
            class="meta-input"
            placeholder="เช่น แบบบันทึกผลตรวจสอบคุณภาพอื่น ๆ"
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

      <!-- Main layout: left = editor + preview, right = field settings -->
      <div class="builder-body">
        <!-- Left side -->
        <div class="left-column">
          <!-- Rich text area (description / header) -->
          <div class="editor-card">
            <div class="editor-toolbar">
              <button type="button" class="tool-btn" @click="applyRichCommand('bold')">
                B
              </button>
              <button type="button" class="tool-btn" @click="applyRichCommand('italic')">
                I
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('underline')"
              >
                U
              </button>

              <div class="tool-divider"></div>

              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('insertUnorderedList')"
              >
                • List
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('insertOrderedList')"
              >
                1. List
              </button>

              <div class="tool-divider"></div>

              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('justifyLeft')"
              >
                ⬅
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('justifyCenter')"
              >
                ⬍
              </button>
              <button
                type="button"
                class="tool-btn"
                @click="applyRichCommand('justifyRight')"
              >
                ➡
              </button>
            </div>

            <div
              ref="richEditorRef"
              class="rich-editor"
              contenteditable="true"
              @input="syncRichContent"
            ></div>
          </div>

          <!-- Field add toolbar -->
          <div class="field-toolbox">
            <span class="toolbox-label">เพิ่มฟิลด์สำหรับบันทึกผล</span>
            <div class="toolbox-buttons">
              <button type="button" class="chip-btn" @click="addField('short-text')">
                ข้อความสั้น
              </button>
              <button type="button" class="chip-btn" @click="addField('long-text')">
                ข้อความยาว
              </button>
              <button type="button" class="chip-btn" @click="addField('number')">
                ตัวเลข
              </button>
              <button type="button" class="chip-btn" @click="addField('date')">
                วันที่
              </button>
              <button type="button" class="chip-btn" @click="addField('dropdown')">
                Dropdown
              </button>
              <button type="button" class="chip-btn" @click="addField('checkbox')">
                Checkbox
              </button>
              <button type="button" class="chip-btn" @click="addField('image')">
                เพิ่มรูปภาพ
              </button>
            </div>
          </div>

          <!-- Preview area -->
          <div class="preview-card">
            <h2 class="preview-title">ตัวอย่างแบบฟอร์ม</h2>
            <p class="preview-subtitle">
              ฟิลด์ด้านล่างเป็นตัวอย่างเวลาใช้งานจริง ผู้ใช้จะเห็นหน้าตาประมาณนี้
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
                    {{ field.label || 'ชื่อฟิลด์ (ดับเบิลคลิกเพื่อแก้ไขด้านขวา)' }}
                    <span v-if="field.required" class="required-star">*</span>
                  </label>
                  <button
                    type="button"
                    class="icon-btn"
                    title="ลบฟิลด์"
                    @click.stop="removeField(index)"
                  >
                    ✕
                  </button>
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
                      <option v-if="!field.options?.length">-- ตัวเลือก --</option>
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
                ยังไม่มีฟิลด์ในฟอร์ม กดปุ่มด้านบนเพื่อเพิ่มฟิลด์
              </div>
            </form>
          </div>
        </div>

        <!-- Right side: field properties -->
        <div class="right-column">
          <div class="settings-card" v-if="selectedField">
            <h3 class="settings-title">ตั้งค่าฟิลด์</h3>
            <p class="settings-subtitle">
              แก้ไขชื่อฟิลด์ Placeholder ตัวเลือก และคุณสมบัติอื่น ๆ
            </p>

            <div class="settings-row">
              <label class="settings-label">ประเภทฟิลด์</label>
              <div class="settings-pill">{{ fieldTypeLabel(selectedField.type) }}</div>
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
              <label class="settings-label">Placeholder / คำอธิบายสั้น ๆ</label>
              <input
                v-model="selectedField.placeholder"
                type="text"
                class="settings-input"
                placeholder="ข้อความตัวอย่างในช่อง"
              />
            </div>

            <div class="settings-row" v-if="selectedField.type === 'dropdown'">
              <label class="settings-label">ตัวเลือก Dropdown (หนึ่งบรรทัดต่อหนึ่งตัวเลือก)</label>
              <textarea
                v-model="dropdownOptionText"
                class="settings-textarea"
                rows="4"
                placeholder="เช่น&#10;ผ่าน&#10;ไม่ผ่าน&#10;รอทดสอบใหม่"
                @input="updateDropdownOptions"
              ></textarea>
            </div>

            <div class="settings-row" v-if="selectedField.type === 'checkbox'">
              <label class="settings-label">ข้อความข้าง Checkbox</label>
              <input
                v-model="selectedField.placeholder"
                type="text"
                class="settings-input"
                placeholder="เช่น ยืนยันว่าตรวจสอบแล้ว"
              />
            </div>

            <div class="settings-row">
              <label class="settings-label">หมายเหตุ (จะแสดงตัวเล็กใต้ฟิลด์)</label>
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
              <button type="button" class="btn-danger" @click="deleteSelected">
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
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const router = useRouter()
const route = useRoute()

const richEditorRef = ref(null)

// meta
const formTitle = ref('ฟอร์มไม่มีชื่อ')
const formCode = ref('C1')
const formCategory = ref('Custom QC')

// rich text (เก็บเป็น HTML string)
const richContent = ref('')

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

// ---------- rich text ----------
const applyRichCommand = (cmd) => {
  document.execCommand(cmd, false, null)
}

const syncRichContent = () => {
  if (richEditorRef.value) {
    richContent.value = richEditorRef.value.innerHTML
  }
}

// ---------- field operations ----------
const addField = (type) => {
  const id = 'fld_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
  const base = {
    id,
    type,
    label: '',
    placeholder: '',
    required: false,
    note: ''
  }

  if (type === 'dropdown') {
    base.options = ['ตัวเลือก 1', 'ตัวเลือก 2']
  }

  fields.value.push(base)
  selectedFieldIndex.value = fields.value.length - 1

  if (type === 'dropdown') {
    dropdownOptionText.value = base.options.join('\n')
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

  const stored = JSON.parse(localStorage.getItem('xraycare_custom_forms') || '[]')

  const id = editingFormId.value || 'cf_' + Date.now().toString()
  const routePath = '/custom-forms/' + id // อย่าลืมเพิ่ม route path นี้ใน router

  const formPayload = {
    id,
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

  // กลับไปหน้า hub (ถ้า path จริงไม่ใช่ /qc-forms-hub ให้แก้)
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
  margin-bottom: 18px;
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

/* meta */
.meta-panel {
  background: #ffffff;
  padding: 16px 18px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  margin-bottom: 16px;
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
  margin-top: 10px;
}

/* editor card */
.editor-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  margin-bottom: 12px;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-bottom: 1px solid #e5e7eb;
  gap: 4px;
}

.tool-btn {
  border: none;
  background: transparent;
  padding: 4px 6px;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
}
.tool-btn:hover {
  background: #e5e7eb;
}

.tool-divider {
  width: 1px;
  height: 18px;
  background: #e5e7eb;
  margin: 0 4px;
}

.rich-editor {
  min-height: 120px;
  padding: 8px 10px 10px;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* toolbox */
.field-toolbox {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toolbox-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #111827;
}

.toolbox-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.chip-btn {
  border-radius: 999px;
  border: none;
  padding: 6px 10px;
  font-size: 0.75rem;
  background: #eff6ff;
  color: #1d4ed8;
  cursor: pointer;
}
.chip-btn:hover {
  background: #dbeafe;
}

/* preview */
.preview-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  padding: 14px 16px 16px;
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
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  padding: 14px 14px 16px;
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
  margin-bottom: 10px;
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

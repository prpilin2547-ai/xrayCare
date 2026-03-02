/**
 * Central API client for Xraycare. Adds X-Hospital-Id from stored user to all requests
 * except Login and GetHospitals (which don't require it).
 */
const API_BASE = '/api/Xraycare'

export { API_BASE }

const STORAGE_KEY = 'xraycare-user'

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * @param {{ hospitalId?: number | null }} [overrides] - Optional overrides (e.g. SuperAdmin passing 0 for "all hospitals")
 */
export function getDefaultHeaders(overrides) {
  const user = getStoredUser()
  const headers = { 'Content-Type': 'application/json' }
  if (user?.id != null) {
    headers['X-User-Id'] = String(user.id)
  }
  const hid = overrides?.hospitalId !== undefined ? overrides.hospitalId : user?.hospitalId
  if (hid != null) {
    headers['X-Hospital-Id'] = String(hid)
  }
  return headers
}

/**
 * Call API with X-Hospital-Id header when user is logged in.
 * @param {string} path - e.g. '/GetAllMachines' (no leading slash on API_BASE)
 * @param {RequestInit} init - fetch options (headers are merged with default)
 * @returns {Promise<Response>}
 */
/**
 * @param {string} path - e.g. '/GetAllMachines'
 * @param {RequestInit & { hospitalId?: number | null }} [init] - fetch options; use hospitalId to override scope (e.g. 0 for SuperAdmin "all")
 */
export async function apiFetch(path, init = {}) {
  const { hospitalId, ...fetchInit } = init
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : '/' + path}`
  const headers = { ...getDefaultHeaders(hospitalId !== undefined ? { hospitalId } : undefined), ...(fetchInit.headers || {}) }
  return fetch(url, { ...fetchInit, headers })
}

/**
 * Read response body and return a user-friendly error message.
 * Prefer API's { message } when present; otherwise fallback by status code.
 * @param {Response} res - fetch Response (body will be consumed)
 * @returns {Promise<string>}
 */
export async function getApiErrorMessage(res) {
  let text = ''
  try {
    text = await res.text()
  } catch {
    return statusToMessage(res.status)
  }
  try {
    const obj = JSON.parse(text)
    if (obj && typeof obj.message === 'string' && obj.message.trim()) return obj.message.trim()
  } catch {
    // not JSON or no message
  }
  if (text && text.length < 200) return text
  return statusToMessage(res.status)
}

function statusToMessage(status) {
  switch (status) {
    case 400: return 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
    case 401: return 'กรุณาเข้าสู่ระบบใหม่'
    case 403: return 'ไม่มีสิทธิ์ดำเนินการ'
    case 404: return 'ไม่พบข้อมูลหรือ API ไม่พร้อมใช้งาน'
    case 500: return 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่'
    default: return 'เกิดข้อผิดพลาด กรุณาลองใหม่'
  }
}

/**
 * Fetch and parse JSON. If !res.ok, throws Error with message from getApiErrorMessage.
 * @param {string} path
 * @param {RequestInit & { hospitalId?: number | null }} [init]
 * @returns {Promise<unknown>} parsed JSON body
 */
export async function apiFetchJson(path, init = {}) {
  const res = await apiFetch(path, init)
  if (!res.ok) {
    const msg = await getApiErrorMessage(res)
    throw new Error(msg)
  }
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('ตอบกลับจากเซิร์ฟเวอร์ไม่ถูกต้อง')
  }
}

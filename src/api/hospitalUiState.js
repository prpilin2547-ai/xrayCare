import { apiFetch, apiFetchJson, getApiErrorMessage } from './client'

const LEGACY_DAILY_KEY = 'xraycare-dailyChecked'
export function emptyHospitalUiState() {
  return {
    dailyChecked: {},
    pmEventsByDate: {},
    pmMonthlyRules: {},
    pmHiddenMonthlyTasks: {},
    pmDisabledDailyDates: {}
  }
}

export async function getHospitalUiState() {
  try {
    const res = await apiFetch('/GetHospitalUiState')
    if (!res.ok) {
      let msg = res.statusText
      try {
        msg = await getApiErrorMessage(res)
      } catch {
        /* ignore */
      }
      if (res.status === 404) {
        console.warn(
          '[getHospitalUiState] 404 — ตรวจสอบว่า API รันอยู่และ proxy ใน vite.config ครอบคลุมทั้ง /api/Xraycare และ /api/xraycare',
          msg
        )
      } else {
        console.warn('[getHospitalUiState]', res.status, msg)
      }
      return emptyHospitalUiState()
    }
    const text = await res.text()
    let data = {}
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      return emptyHospitalUiState()
    }
    return { ...emptyHospitalUiState(), ...data }
  } catch (e) {
    console.error('getHospitalUiState', e)
    return emptyHospitalUiState()
  }
}

export async function appendDailyCheckedMachine(dateKey, machineName) {
  if (!dateKey || !machineName) return
  await apiFetchJson('/AppendDailyCheckedMachine', {
    method: 'POST',
    body: JSON.stringify({ dateKey, machineName })
  })
}

export async function saveHospitalPmCalendar(payload) {
  await apiFetchJson('/SaveHospitalPmCalendar', {
    method: 'PUT',
    body: JSON.stringify({
      pmEventsByDate: payload.pmEventsByDate ?? {},
      pmMonthlyRules: payload.pmMonthlyRules ?? {},
      pmHiddenMonthlyTasks: payload.pmHiddenMonthlyTasks ?? {},
      pmDisabledDailyDates: payload.pmDisabledDailyDates ?? {}
    })
  })
}

function readLegacyJson(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    const v = JSON.parse(raw)
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
  } catch {
    return {}
  }
}

function isPmCalendarEmpty(s) {
  const a = s.pmEventsByDate || {}
  const b = s.pmMonthlyRules || {}
  const c = s.pmHiddenMonthlyTasks || {}
  const d = s.pmDisabledDailyDates || {}
  return (
    !Object.keys(a).length &&
    !Object.keys(b).length &&
    !Object.keys(c).length &&
    !Object.keys(d).length
  )
}

function localPmHasData(ls) {
  return (
    Object.keys(ls.pmEventsByDate).length > 0 ||
    Object.keys(ls.pmMonthlyRules).length > 0 ||
    Object.keys(ls.pmHiddenMonthlyTasks).length > 0 ||
    Object.keys(ls.pmDisabledDailyDates).length > 0
  )
}

/**
 * Load hospital-wide UI state from API, migrate legacy per-browser localStorage once, return fresh state.
 */
export async function loadAndMigrateHospitalUiState() {
  let state = await getHospitalUiState()

  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayKey = `${y}-${m}-${dd}`

  try {
    const raw = localStorage.getItem(LEGACY_DAILY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const list = Array.isArray(parsed[todayKey]) ? parsed[todayKey] : []
      for (const name of list) {
        if (!name) continue
        const cur = state.dailyChecked[todayKey] || []
        if (!cur.includes(name)) {
          await appendDailyCheckedMachine(todayKey, name)
        }
      }
      localStorage.removeItem(LEGACY_DAILY_KEY)
    }
  } catch (e) {
    console.error('migrate dailyChecked from localStorage', e)
  }

  const lsPm = {
    pmEventsByDate: readLegacyJson('pmEventsByDate'),
    pmMonthlyRules: readLegacyJson('pmMonthlyRules'),
    pmHiddenMonthlyTasks: readLegacyJson('pmHiddenMonthlyTasks'),
    pmDisabledDailyDates: readLegacyJson('pmDisabledDailyDates')
  }

  if (isPmCalendarEmpty(state) && localPmHasData(lsPm)) {
    try {
      await saveHospitalPmCalendar(lsPm)
      for (const k of ['pmEventsByDate', 'pmMonthlyRules', 'pmHiddenMonthlyTasks', 'pmDisabledDailyDates']) {
        localStorage.removeItem(k)
      }
    } catch (e) {
      console.error('migrate PM calendar from localStorage', e)
    }
  }

  state = await getHospitalUiState()
  return state
}

/* ─────────────────────────────────
   Настройки рабочей области (редактируются в админке, localStorage)
───────────────────────────────── */
export interface AISettings {
  promptOverrides: Record<string, string>  // toolId -> шаблон промпта
  systemOverrides: Record<string, string>  // toolId -> system для текстовых
  models: { vision: string; text: string; image: string } // пусто = из env
  ym: string // ID Яндекс.Метрики
}

const KEY = 'airoom_admin_settings'

const DEFAULTS: AISettings = {
  promptOverrides: {},
  systemOverrides: {},
  models: { vision: '', text: '', image: '' },
  ym: '',
}

export function loadSettings(): AISettings {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    return {
      promptOverrides: raw.promptOverrides ?? {},
      systemOverrides: raw.systemOverrides ?? {},
      models: { ...DEFAULTS.models, ...(raw.models ?? {}) },
      ym: raw.ym ?? '',
    }
  } catch {
    return DEFAULTS
  }
}

export function saveSettings(s: AISettings) {
  localStorage.setItem(KEY, JSON.stringify(s))
}

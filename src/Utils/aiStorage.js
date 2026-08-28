/**
 * AI Configuration & Storage Manager for Sheypoor AI Copilot
 * Supports Google Gemini 2.5 Flash and OpenAI-compatible endpoints.
 * Settings are managed exclusively by Admin and shared across the app.
 */

const STORAGE_KEYS = {
  ADMIN_CONFIG: "sheypoor_ai_admin_config",
  HISTORY: "sheypoor_ai_history",
};

export const DEFAULT_AI_CONFIG = {
  apiKey: "",
  model: "gemini-2.5-flash",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  persona: "friendly", // 'friendly' | 'expert' | 'cash'
  autoGreeting: true,
  systemPrompt: "",
};

/**
 * Retrieves the full AI configuration set by Admin.
 * Falls back to env variable for API key if not set by admin.
 */
export function getAiConfig() {
  if (typeof window === "undefined") return { ...DEFAULT_AI_CONFIG };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG);
    const stored = raw ? JSON.parse(raw) : {};
    const config = { ...DEFAULT_AI_CONFIG, ...stored };
    // Fallback to env variable for API key
    if (!config.apiKey) {
      config.apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    }
    return config;
  } catch {
    return { ...DEFAULT_AI_CONFIG };
  }
}

/**
 * Saves full AI configuration (Admin-only action).
 */
export function setAiConfig(config) {
  if (typeof window === "undefined") return;
  const current = getAiConfig();
  const merged = { ...current, ...config };
  // Trim API key
  if (merged.apiKey) merged.apiKey = merged.apiKey.trim();
  localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("sheypoor_ai_config_changed"));
}

/**
 * Retrieves the stored Gemini API Key (convenience getter).
 */
export function getGeminiApiKey() {
  return getAiConfig().apiKey || "";
}

/**
 * Saves Gemini API Key (convenience setter, updates admin config).
 */
export function setGeminiApiKey(apiKey) {
  setAiConfig({ apiKey });
}

/**
 * Chat conversation history storage
 */
export function getStoredChatHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(history) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(-30)));
  } catch (e) {
    console.warn("Failed to persist AI chat history", e);
  }
}

export function clearChatHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

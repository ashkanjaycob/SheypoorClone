/**
 * AI Configuration & Storage Manager for Sheypoor AI Copilot
 * Supports Google Gemini 2.5 Flash and OpenAI-compatible endpoints
 */

const STORAGE_KEYS = {
  GEMINI_KEY: "sheypoor_gemini_api_key",
  MODEL: "sheypoor_ai_model",
  BASE_URL: "sheypoor_ai_base_url",
  PERSONA: "sheypoor_ai_persona",
  AUTO_GREETING: "sheypoor_ai_auto_greeting",
  HISTORY: "sheypoor_ai_history",
};

export const DEFAULT_AI_CONFIG = {
  model: "gemini-2.5-flash",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  persona: "friendly", // 'friendly' | 'professional' | 'expert'
  autoGreeting: true,
};

/**
 * Retrieves the stored Gemini API Key, falling back to environment variable if set.
 */
export function getGeminiApiKey() {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY);
  if (stored && stored.trim()) return stored.trim();
  return (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
}

/**
 * Saves Gemini API Key to localStorage.
 */
export function setGeminiApiKey(apiKey) {
  if (typeof window === "undefined") return;
  if (!apiKey || !apiKey.trim()) {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
  } else {
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, apiKey.trim());
  }
  window.dispatchEvent(new CustomEvent("sheypoor_ai_config_changed"));
}

/**
 * Retrieves full AI configuration.
 */
export function getAiConfig() {
  if (typeof window === "undefined") return DEFAULT_AI_CONFIG;
  return {
    apiKey: getGeminiApiKey(),
    model: localStorage.getItem(STORAGE_KEYS.MODEL) || DEFAULT_AI_CONFIG.model,
    baseURL: localStorage.getItem(STORAGE_KEYS.BASE_URL) || DEFAULT_AI_CONFIG.baseURL,
    persona: localStorage.getItem(STORAGE_KEYS.PERSONA) || DEFAULT_AI_CONFIG.persona,
    autoGreeting: localStorage.getItem(STORAGE_KEYS.AUTO_GREETING) !== "false",
  };
}

/**
 * Updates AI configuration.
 */
export function setAiConfig(partialConfig) {
  if (typeof window === "undefined") return;
  if (partialConfig.apiKey !== undefined) {
    setGeminiApiKey(partialConfig.apiKey);
  }
  if (partialConfig.model) {
    localStorage.setItem(STORAGE_KEYS.MODEL, partialConfig.model);
  }
  if (partialConfig.baseURL) {
    localStorage.setItem(STORAGE_KEYS.BASE_URL, partialConfig.baseURL);
  }
  if (partialConfig.persona) {
    localStorage.setItem(STORAGE_KEYS.PERSONA, partialConfig.persona);
  }
  if (partialConfig.autoGreeting !== undefined) {
    localStorage.setItem(STORAGE_KEYS.AUTO_GREETING, String(partialConfig.autoGreeting));
  }
  window.dispatchEvent(new CustomEvent("sheypoor_ai_config_changed"));
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

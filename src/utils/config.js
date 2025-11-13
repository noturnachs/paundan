import apiKeyManager from "./apiKeyManager";

// API Configuration
export const API_CONFIG = {
  // API key is loaded from .env file using Vite's import.meta.env
  // or from local storage using apiKeyManager
  get GROQ_API_KEY() {
    return apiKeyManager.getApiKey();
  },

  // Available models from Groq
  MODELS: {
    LLAMA_3_8B: "llama-3.1-8b-instant", // Fast, cost-effective
    LLAMA_3_70B: "llama-3.3-70b-versatile", // More powerful but slower
    GPT_OSS_20B: "openai/gpt-oss-20b", // Good balance
  },

  // Default model to use
  DEFAULT_MODEL: "llama-3.1-8b-instant",

  // API endpoints
  ENDPOINTS: {
    CHAT_COMPLETIONS: "/chat/completions",
  },

  // Base URL for Groq API
  BASE_URL: "https://api.groq.com/openai/v1",
};

export default API_CONFIG;

/**
 * API Key Manager
 *
 * This utility provides functions to securely handle API keys in a frontend-only application.
 * For a production application, it's recommended to use a backend service to handle API requests.
 */

// Get API key from environment variables or local storage
const getApiKey = () => {
  // First try to get from environment variables (preferred for development)
  const envApiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (envApiKey) {
    return envApiKey;
  }

  // Fallback to local storage (for user-provided keys)
  return localStorage.getItem("groq_api_key");
};

// Save API key to local storage (for user-provided keys)
const saveApiKey = (apiKey) => {
  if (!apiKey) return false;

  try {
    localStorage.setItem("groq_api_key", apiKey);
    return true;
  } catch (error) {
    console.error("Error saving API key:", error);
    return false;
  }
};

// Clear API key from local storage
const clearApiKey = () => {
  try {
    localStorage.removeItem("groq_api_key");
    return true;
  } catch (error) {
    console.error("Error clearing API key:", error);
    return false;
  }
};

// Check if API key exists
const hasApiKey = () => {
  return !!getApiKey();
};

export default {
  getApiKey,
  saveApiKey,
  clearApiKey,
  hasApiKey,
};

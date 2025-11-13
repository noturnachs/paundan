import { useState } from "react";
import languages from "../utils/languageList";

const LanguageSelector = ({ onLanguageSelect, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleToggle();
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
    setIsOpen(false);
  };

  const handleLanguageKeyDown = (e, language) => {
    if (e.key === "Enter" || e.key === " ") {
      handleLanguageSelect(language);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-700 transition-colors"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        tabIndex={0}
        aria-label="Select movie language"
      >
        <span
          className={`block truncate ${
            selectedLanguage ? "text-white" : "text-gray-400"
          }`}
        >
          {selectedLanguage || "Select a language"}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 overflow-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60">
          <ul
            className="py-1"
            role="listbox"
            aria-labelledby="language-selector"
            tabIndex={-1}
          >
            {languages.map((language) => (
              <li
                key={language}
                className="px-4 py-2 cursor-pointer hover:bg-indigo-600/50 text-gray-200 hover:text-white transition-colors"
                role="option"
                aria-selected={selectedLanguage === language}
                onClick={() => handleLanguageSelect(language)}
                onKeyDown={(e) => handleLanguageKeyDown(e, language)}
                tabIndex={0}
              >
                {language}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

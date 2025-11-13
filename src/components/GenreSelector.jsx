import { useState } from "react";
import genres from "../utils/genreList";

const GenreSelector = ({ onGenreSelect, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");

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

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    onGenreSelect(genre);
    setIsOpen(false);
  };

  const handleGenreKeyDown = (e, genre) => {
    if (e.key === "Enter" || e.key === " ") {
      handleGenreSelect(genre);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-800/50 transition-colors"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        tabIndex={0}
        aria-label="Select movie genre"
      >
        <span
          className={`block truncate ${
            selectedGenre ? "text-white" : "text-gray-400"
          }`}
        >
          {selectedGenre || "Select a genre"}
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
        <div className="absolute z-10 w-full mt-1 overflow-auto bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg max-h-60">
          <ul
            className="py-1"
            role="listbox"
            aria-labelledby="genre-selector"
            tabIndex={-1}
          >
            {genres.map((genre) => (
              <li
                key={genre}
                className="px-4 py-2 cursor-pointer hover:bg-purple-900/50 text-gray-200 hover:text-white transition-colors"
                role="option"
                aria-selected={selectedGenre === genre}
                onClick={() => handleGenreSelect(genre)}
                onKeyDown={(e) => handleGenreKeyDown(e, genre)}
                tabIndex={0}
              >
                {genre}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GenreSelector;

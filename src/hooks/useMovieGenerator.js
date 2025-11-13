import { useState } from "react";
import groqService from "../services/api";
import omdbService from "../services/omdbApi";

const useMovieGenerator = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousMovies, setPreviousMovies] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Clean up movie title for better OMDb search results
   * @param {string} title - Original movie title
   * @returns {string} - Cleaned up title
   */
  const cleanMovieTitle = (title) => {
    // Remove any text in parentheses, brackets, or after colons
    return title
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/:.*/g, "")
      .trim();
  };

  /**
   * Normalize movie title for duplicate comparison
   * @param {string} title - Movie title
   * @returns {string} - Normalized title for comparison
   */
  const normalizeTitle = (title) => {
    if (!title) return "";
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove special characters
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  /**
   * Check if a movie is a duplicate based on title or imdbID
   * @param {object} movie - Movie object to check
   * @param {string} imdbID - Optional IMDb ID
   * @returns {boolean} - True if duplicate
   */
  const isDuplicateMovie = (movie, imdbID = null) => {
    if (!movie || !movie.title) return false;

    const normalizedTitle = normalizeTitle(movie.title);

    return previousMovies.some((prevMovie) => {
      // Check by IMDb ID if available
      if (imdbID && prevMovie.imdbID && prevMovie.imdbID === imdbID) {
        return true;
      }

      // Check by normalized title
      const prevNormalizedTitle = normalizeTitle(prevMovie.title);
      return prevNormalizedTitle === normalizedTitle;
    });
  };

  /**
   * Generate a movie recommendation using Groq AI and enhance with OMDb data
   * @param {string} genre - The movie genre
   * @param {string} language - The movie language (optional)
   */
  const generateMovie = async (genre, language = "", retryAttempt = 0) => {
    let isRetrying = false;
    try {
      setLoading(true);
      setError(null);

      // Maximum retry attempts to avoid infinite loops
      const MAX_RETRIES = 10;

      // Step 1: Get movie suggestion from Groq
      const groqMovie = await groqService.generateMovie(genre, language);

      // Check if we've seen this movie before
      const isDuplicate = isDuplicateMovie(groqMovie);

      // If it's a duplicate and we haven't exceeded max retries, try again
      if (isDuplicate && retryAttempt < MAX_RETRIES) {
        console.log(
          `Got duplicate movie "${groqMovie.title}", trying again... (Attempt ${
            retryAttempt + 1
          }/${MAX_RETRIES})`
        );
        setRetryCount(retryAttempt + 1);
        isRetrying = true;
        // Keep loading state true while retrying
        return generateMovie(genre, language, retryAttempt + 1);
      }

      // If we've exceeded max retries, show the duplicate anyway
      if (isDuplicate && retryAttempt >= MAX_RETRIES) {
        console.warn(
          `Max retries reached. Showing duplicate movie: ${groqMovie.title}`
        );
      }

      try {
        // Step 2: Verify and enhance with OMDb data
        // Extract year if it exists in the format "2023" or "(2023)"
        const yearMatch = groqMovie.year ? groqMovie.year.match(/\d{4}/) : null;
        const year = yearMatch ? parseInt(yearMatch[0]) : null;

        // Clean up the title for better search results
        const cleanedTitle = cleanMovieTitle(groqMovie.title);

        // Try to get movie details from OMDb
        const omdbMovie = await omdbService.getMovieByTitle(cleanedTitle, year);

        // Check again with IMDb ID for more accurate duplicate detection
        const isDuplicateWithIMDb = isDuplicateMovie(
          groqMovie,
          omdbMovie.imdbID
        );

        // If duplicate with IMDb ID and we haven't exceeded max retries, try again
        if (isDuplicateWithIMDb && retryAttempt < MAX_RETRIES) {
          console.log(
            `Got duplicate movie with IMDb ID "${
              omdbMovie.imdbID
            }", trying again... (Attempt ${retryAttempt + 1}/${MAX_RETRIES})`
          );
          setRetryCount(retryAttempt + 1);
          isRetrying = true;
          return generateMovie(genre, language, retryAttempt + 1);
        }

        // Step 3: Merge data from both sources
        const enhancedMovie = {
          ...groqMovie,
          imdbID: omdbMovie.imdbID,
          poster:
            omdbMovie.Poster !== "N/A"
              ? omdbService.getPosterUrl(omdbMovie.imdbID)
              : omdbService.getDefaultPosterUrl(),
          plot: omdbMovie.Plot || groqMovie.synopsis,
          imdbRating: omdbMovie.imdbRating,
          runtime: omdbMovie.Runtime,
          genre: omdbMovie.Genre,
          language: omdbMovie.Language || groqMovie.language || language,
          awards: omdbMovie.Awards,
          ratings: omdbMovie.Ratings || [], // Include all ratings sources
          metascore: omdbMovie.Metascore,
          boxOffice: omdbMovie.BoxOffice,
          rated: omdbMovie.Rated,
          released: omdbMovie.Released,
          // Use OMDb data for accuracy, but fall back to Groq data if needed
          year: omdbMovie.Year || groqMovie.year,
          director: omdbMovie.Director || groqMovie.director,
          actors: omdbMovie.Actors
            ? omdbMovie.Actors.split(", ")
            : groqMovie.starring,
          verified: true,
        };

        // Add to previous movies list to avoid duplicates (track ALL movies in session)
        setPreviousMovies((prev) => {
          // Check if movie already exists before adding
          const alreadyExists = prev.some(
            (p) =>
              (p.imdbID &&
                enhancedMovie.imdbID &&
                p.imdbID === enhancedMovie.imdbID) ||
              normalizeTitle(p.title) === normalizeTitle(enhancedMovie.title)
          );

          if (alreadyExists) {
            return prev; // Don't add duplicates
          }

          return [...prev, enhancedMovie];
        });

        // Reset retry count on successful new movie
        setRetryCount(0);
        setMovie(enhancedMovie);
      } catch (omdbError) {
        // If OMDb lookup fails, just use the Groq data
        console.warn("Could not verify with OMDb:", omdbError);

        const unverifiedMovie = {
          ...groqMovie,
          poster: omdbService.getDefaultPosterUrl(),
          ratings: [{ Source: "AI Estimated", Value: groqMovie.rating }],
          language: groqMovie.language || language,
          verified: false,
        };

        // Add to previous movies list (track ALL movies in session)
        setPreviousMovies((prev) => {
          // Check if movie already exists before adding
          const alreadyExists = prev.some(
            (p) =>
              normalizeTitle(p.title) === normalizeTitle(unverifiedMovie.title)
          );

          if (alreadyExists) {
            return prev; // Don't add duplicates
          }

          return [...prev, unverifiedMovie];
        });

        // Reset retry count on successful new movie
        setRetryCount(0);
        setMovie(unverifiedMovie);
      }
    } catch (err) {
      console.error("API Error:", err);

      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          err.response.data?.error?.message ||
          "Server error. Please check your API key and try again.";
        setError(errorMessage);
      } else if (err.request) {
        // The request was made but no response was received
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || "Failed to generate movie. Please try again.");
      }
    } finally {
      // Only set loading to false if we're not retrying
      // When retrying, the recursive call will maintain the loading state
      if (!isRetrying) {
        setLoading(false);
      }
      // If isRetrying is true, don't set loading to false - let the recursive call handle it
    }
  };

  const resetMovie = (clearHistory = false) => {
    setMovie(null);
    setError(null);
    setRetryCount(0);
    if (clearHistory) {
      setPreviousMovies([]);
    }
  };

  return {
    movie,
    loading,
    error,
    generateMovie,
    resetMovie,
  };
};

export default useMovieGenerator;

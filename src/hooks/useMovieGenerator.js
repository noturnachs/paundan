import { useState } from "react";
import groqService from "../services/api";
import omdbService from "../services/omdbApi";

const useMovieGenerator = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousMovies, setPreviousMovies] = useState([]);

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
   * Generate a movie recommendation using Groq AI and enhance with OMDb data
   * @param {string} genre - The movie genre
   * @param {string} language - The movie language (optional)
   */
  const generateMovie = async (genre, language = "") => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Get movie suggestion from Groq
      const groqMovie = await groqService.generateMovie(genre, language);

      // Check if we've seen this movie before
      const isDuplicate = previousMovies.some(
        (prevMovie) => prevMovie.title === groqMovie.title
      );

      // If it's a duplicate and we haven't tried too many times, try again
      if (isDuplicate && previousMovies.length < 5) {
        console.log("Got duplicate movie, trying again...");
        setLoading(false);
        return generateMovie(genre);
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

        // Add to previous movies list to avoid duplicates
        setPreviousMovies((prev) => {
          const updatedList = [...prev, enhancedMovie];
          // Keep only the last 5 movies to avoid memory issues
          if (updatedList.length > 5) {
            return updatedList.slice(updatedList.length - 5);
          }
          return updatedList;
        });

        setMovie(enhancedMovie);
      } catch (omdbError) {
        // If OMDb lookup fails, just use the Groq data
        console.warn("Could not verify with OMDb:", omdbError);

        // Add to previous movies list
        setPreviousMovies((prev) => {
          const updatedList = [...prev, groqMovie];
          if (updatedList.length > 5) {
            return updatedList.slice(updatedList.length - 5);
          }
          return updatedList;
        });

        // Still show the movie, but mark as unverified
        setMovie({
          ...groqMovie,
          poster: omdbService.getDefaultPosterUrl(),
          ratings: [{ Source: "AI Estimated", Value: groqMovie.rating }],
          language: groqMovie.language || language,
          verified: false,
        });
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
      setLoading(false);
    }
  };

  const resetMovie = () => {
    setMovie(null);
    setError(null);
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

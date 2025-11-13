import { useState } from "react";
import groqService from "../services/api";

const useMovieGenerator = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMovie = async (genre) => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await groqService.generateMovie(genre);
      setMovie(movieData);
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

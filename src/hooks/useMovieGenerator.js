import { useState } from "react";
import groqService from "../services/api";

const useMovieGenerator = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousMovies, setPreviousMovies] = useState([]);

  const generateMovie = async (genre) => {
    try {
      setLoading(true);
      setError(null);

      // Get new movie from API
      const movieData = await groqService.generateMovie(genre);

      // Check if we've seen this movie before
      const isDuplicate = previousMovies.some(
        (prevMovie) => prevMovie.title === movieData.title
      );

      // If it's a duplicate and we haven't tried too many times, try again
      if (isDuplicate && previousMovies.length < 5) {
        console.log("Got duplicate movie, trying again...");
        setLoading(false);
        return generateMovie(genre);
      }

      // Add to previous movies list to avoid duplicates
      setPreviousMovies((prev) => {
        const updatedList = [...prev, movieData];
        // Keep only the last 5 movies to avoid memory issues
        if (updatedList.length > 5) {
          return updatedList.slice(updatedList.length - 5);
        }
        return updatedList;
      });

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

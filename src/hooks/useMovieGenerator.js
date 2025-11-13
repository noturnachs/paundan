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
      setError("Failed to generate movie. Please try again.");
      console.error(err);
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

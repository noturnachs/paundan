import axios from "axios";

// Create OMDb API service
const createOmdbService = () => {
  const API_KEY = "512835a2";
  const BASE_URL = "http://www.omdbapi.com/";
  const POSTER_URL = "http://img.omdbapi.com/";

  // Create axios instance
  const omdbInstance = axios.create({
    baseURL: BASE_URL,
  });

  /**
   * Search for movies by title
   * @param {string} title - Movie title to search for
   * @param {number} year - Optional year of release
   * @returns {Promise} - Promise with search results
   */
  const searchMovies = async (title, year = null) => {
    try {
      const params = {
        apikey: API_KEY,
        s: title, // search by title
        type: "movie",
      };

      if (year) {
        params.y = year;
      }

      const response = await omdbInstance.get("", { params });

      if (response.data.Response === "True") {
        return response.data.Search;
      } else {
        throw new Error(response.data.Error || "No results found");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  };

  /**
   * Get detailed movie information by IMDb ID
   * @param {string} imdbId - IMDb ID of the movie
   * @returns {Promise} - Promise with movie details
   */
  const getMovieById = async (imdbId) => {
    try {
      const response = await omdbInstance.get("", {
        params: {
          apikey: API_KEY,
          i: imdbId,
          plot: "full",
        },
      });

      if (response.data.Response === "True") {
        return response.data;
      } else {
        throw new Error(response.data.Error || "Movie not found");
      }
    } catch (error) {
      console.error("Error getting movie details:", error);
      throw error;
    }
  };

  /**
   * Get detailed movie information by title and year
   * @param {string} title - Movie title
   * @param {number} year - Optional year of release
   * @returns {Promise} - Promise with movie details
   */
  const getMovieByTitle = async (title, year = null) => {
    try {
      const params = {
        apikey: API_KEY,
        t: title,
        plot: "full",
      };

      if (year) {
        params.y = year;
      }

      const response = await omdbInstance.get("", { params });

      if (response.data.Response === "True") {
        return response.data;
      } else {
        throw new Error(response.data.Error || "Movie not found");
      }
    } catch (error) {
      console.error("Error getting movie details:", error);
      throw error;
    }
  };

  /**
   * Get poster URL for a movie
   * @param {string} imdbId - IMDb ID of the movie
   * @param {number} height - Optional height of the poster
   * @returns {string} - URL to the movie poster
   */
  const getPosterUrl = (imdbId, height = 600) => {
    return `${POSTER_URL}?i=${imdbId}&h=${height}&apikey=${API_KEY}`;
  };

  return {
    searchMovies,
    getMovieById,
    getMovieByTitle,
    getPosterUrl,
  };
};

export default createOmdbService();

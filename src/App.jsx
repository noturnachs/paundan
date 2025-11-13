import { useState } from "react";
import GenreSelector from "./components/GenreSelector";
import MovieCard from "./components/MovieCard";
import Button from "./components/Button";
import useMovieGenerator from "./hooks/useMovieGenerator";

function App() {
  const [selectedGenre, setSelectedGenre] = useState("");
  const { movie, loading, error, generateMovie, resetMovie } =
    useMovieGenerator();

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    resetMovie();
  };

  const handleGenerateMovie = () => {
    if (selectedGenre) {
      generateMovie(selectedGenre);
    }
  };

  const handleRegenerateMovie = () => {
    if (selectedGenre) {
      generateMovie(selectedGenre);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Aurora Borealis Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] blur-3xl opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-6000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">
              What to Watch?
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Discover your next favorite movie with our AI-powered
              recommendation engine
            </p>
          </header>

          <div className="flex flex-col items-center space-y-6 md:space-y-8">
            <div className="w-full max-w-xs">
              <label
                htmlFor="genre-selector"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Select a movie genre
              </label>
              <GenreSelector
                onGenreSelect={handleGenreSelect}
                disabled={loading}
              />
            </div>

            {!movie && (
              <Button
                onClick={handleGenerateMovie}
                disabled={!selectedGenre || loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Find a Movie"
                )}
              </Button>
            )}

            <div className="w-full">
              <MovieCard movie={movie} loading={loading} error={error} />
            </div>

            {movie && (
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
                <Button
                  onClick={handleRegenerateMovie}
                  disabled={loading}
                  className="flex-1"
                  variant="primary"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        ></path>
                      </svg>
                      Another Movie
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedGenre("");
                    resetMovie();
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Change Genre
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="w-full py-4 text-center text-gray-500 text-sm mt-8">
        <p>Powered by Groq AI & OMDb • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;

const MovieCard = ({ movie, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="mt-6 h-6 bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md p-6 rounded-xl bg-red-900/20 backdrop-blur-md border border-red-700 shadow-xl text-center">
        <svg
          className="w-12 h-12 mx-auto text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-medium text-red-300 mb-2">Error</h3>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  // Ensure all movie properties exist to prevent rendering errors
  const safeMovie = {
    title: movie.title || "Unknown Title",
    year: movie.year || "Unknown Year",
    director: movie.director || "Unknown Director",
    synopsis: movie.synopsis || "No synopsis available.",
    rating: movie.rating || "N/A",
    starring: Array.isArray(movie.starring) ? movie.starring : ["Unknown Cast"],
  };

  return (
    <div className="w-full max-w-md p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl transition-all hover:shadow-purple-500/20">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-white mb-1">
          {safeMovie.title}
        </h2>
        <span className="px-2 py-1 bg-purple-900/50 rounded text-purple-200 text-sm font-medium">
          {safeMovie.rating}
        </span>
      </div>
      <p className="text-gray-400 mb-4">
        {safeMovie.year} • Directed by {safeMovie.director}
      </p>

      <p className="text-gray-300 mb-6">{safeMovie.synopsis}</p>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Starring</h3>
        <div className="flex flex-wrap gap-2">
          {safeMovie.starring.map((actor, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
            >
              {actor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

const MovieCard = ({ movie, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-md p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster placeholder */}
          <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-800 rounded-lg animate-pulse"></div>

          <div className="w-full md:w-2/3 space-y-4">
            {/* Title placeholder */}
            <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            {/* Year and director placeholder */}
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            {/* Synopsis placeholder */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
            </div>
            {/* Cast placeholder */}
            <div className="mt-4">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 bg-gray-700 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded-full w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded-full w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
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
    synopsis: movie.plot || movie.synopsis || "No synopsis available.",
    rating: movie.imdbRating || movie.rating || "N/A",
    starring: movie.actors || movie.starring || ["Unknown Cast"],
    poster: movie.poster || null,
    runtime: movie.runtime || "Unknown",
    genre: movie.genre || "",
    awards: movie.awards || "",
    verified: movie.verified || false,
  };

  return (
    <div className="w-full max-w-md p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl transition-all hover:shadow-purple-500/20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster */}
        {safeMovie.poster ? (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img
              src={safeMovie.poster}
              alt={`${safeMovie.title} poster`}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full md:w-1/3 h-64 flex-shrink-0 bg-gray-800 rounded-lg flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 4v16M17 4v16M3 8h18M3 16h18"
              ></path>
            </svg>
          </div>
        )}

        {/* Movie Details */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white mb-1">
              {safeMovie.title}
            </h2>
            <div className="flex items-center">
              <span className="px-2 py-1 bg-purple-900/50 rounded text-purple-200 text-sm font-medium">
                {safeMovie.rating}
              </span>
              {safeMovie.verified && (
                <span
                  className="ml-2 text-green-400"
                  title="Verified with OMDb"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 text-gray-400 text-sm mb-4">
            <span>{safeMovie.year}</span>
            <span>{safeMovie.runtime}</span>
            {safeMovie.genre && <span>{safeMovie.genre}</span>}
          </div>

          <p className="text-gray-400 mb-3">
            Directed by{" "}
            <span className="text-gray-300">{safeMovie.director}</span>
          </p>

          <p className="text-gray-300 mb-4">{safeMovie.synopsis}</p>

          {safeMovie.awards && (
            <p className="text-yellow-400 text-sm mb-4">{safeMovie.awards}</p>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Starring</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(safeMovie.starring) ? (
                safeMovie.starring.map((actor, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))
              ) : (
                <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                  {safeMovie.starring}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

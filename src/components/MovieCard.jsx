const MovieCard = ({ movie, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster placeholder */}
          <div className="w-full md:w-2/5 h-64 md:h-96 bg-gray-800 rounded-lg animate-pulse"></div>

          <div className="w-full md:w-3/5 space-y-4">
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
      <div className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-red-900/20 backdrop-blur-md border border-red-700 shadow-xl text-center">
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
    ratings: movie.ratings || [],
    starring: movie.actors || movie.starring || ["Unknown Cast"],
    poster: movie.poster || null,
    runtime: movie.runtime || "Unknown",
    genre: movie.genre || "",
    language: movie.language || "",
    awards: movie.awards || "",
    rated: movie.rated || "",
    released: movie.released || "",
    boxOffice: movie.boxOffice || "",
    metascore: movie.metascore || "",
    verified: movie.verified || false,
  };

  // Get rating icon based on source
  const getRatingIcon = (source) => {
    if (source.includes("Internet Movie Database") || source.includes("IMDb")) {
      return (
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (source.includes("Rotten Tomatoes")) {
      return (
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        </svg>
      );
    } else if (source.includes("Metacritic")) {
      return (
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          <path d="M11 7h2v10h-2zm-4 3h2v4H7zm8 0h2v4h-2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
  };

  // Get color for rating based on source
  const getRatingColor = (source) => {
    if (source.includes("Internet Movie Database") || source.includes("IMDb")) {
      return "text-amber-400";
    } else if (source.includes("Rotten Tomatoes")) {
      return "text-red-500";
    } else if (source.includes("Metacritic")) {
      return "text-blue-400";
    } else {
      return "text-purple-400";
    }
  };

  // Format source name to be more readable
  const formatSourceName = (source) => {
    if (source.includes("Internet Movie Database")) return "IMDb";
    if (source.includes("Rotten Tomatoes")) return "Rotten Tomatoes";
    if (source.includes("Metacritic")) return "Metacritic";
    return source;
  };

  // Generate a custom placeholder URL with the movie title if no poster is available
  const getCustomPlaceholder = (title) => {
    const safeTitle = title.replace(/\s+/g, "+");
    return `https://placehold.co/300x450/121826/667799/png?text=${safeTitle}&font=montserrat`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-700 shadow-xl transition-all hover:shadow-purple-500/20">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster */}
        <div className="w-full md:w-2/5 flex-shrink-0 flex justify-center md:justify-start">
          <div className="poster-container h-auto rounded-lg shadow-lg overflow-hidden">
            <img
              src={safeMovie.poster || getCustomPlaceholder(safeMovie.title)}
              alt={`${safeMovie.title} poster`}
              className="w-full h-auto object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/300x450/121826/667799/png?text=${safeMovie.title.replace(
                  /\s+/g,
                  "+"
                )}&font=montserrat`;
              }}
            />
          </div>
        </div>

        {/* Movie Details */}
        <div className="w-full md:w-3/5">
          <div className="flex justify-between items-start">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              {safeMovie.title}
            </h2>
            {safeMovie.verified && (
              <span className="ml-2 text-green-400" title="Verified with OMDb">
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

          <div className="flex flex-wrap gap-x-4 text-gray-400 text-sm mb-4">
            <span>{safeMovie.year}</span>
            <span>{safeMovie.runtime}</span>
            {safeMovie.rated && <span>{safeMovie.rated}</span>}
            {safeMovie.language && <span>{safeMovie.language}</span>}
          </div>

          {/* Ratings Section */}
          <div className="flex flex-wrap gap-2 mb-4">
            {safeMovie.ratings && safeMovie.ratings.length > 0
              ? safeMovie.ratings.map((rating, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center px-2 py-1 bg-gray-800 rounded ${getRatingColor(
                      rating.Source
                    )}`}
                  >
                    {getRatingIcon(rating.Source)}
                    <span className="text-sm font-medium">{rating.Value}</span>
                    <span className="text-xs ml-1 opacity-75">
                      ({formatSourceName(rating.Source)})
                    </span>
                  </div>
                ))
              : safeMovie.rating && (
                  <div className="flex items-center px-2 py-1 bg-gray-800 rounded text-amber-400">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">
                      {safeMovie.rating}
                    </span>
                  </div>
                )}
          </div>

          {safeMovie.genre && (
            <div className="flex flex-wrap gap-2 mb-4">
              {safeMovie.genre.split(", ").map((g, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-800/70 rounded-md text-xs text-gray-300"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-400 mb-3">
            Directed by{" "}
            <span className="text-gray-300">{safeMovie.director}</span>
          </p>

          <div className="max-h-[180px] md:max-h-none overflow-y-auto pr-2 mb-4 synopsis-container">
            <p className="text-gray-300 text-sm md:text-base">
              {safeMovie.synopsis}
            </p>
          </div>

          {safeMovie.awards && safeMovie.awards !== "N/A" && (
            <p className="text-amber-400 text-sm mb-4">{safeMovie.awards}</p>
          )}

          {safeMovie.boxOffice && safeMovie.boxOffice !== "N/A" && (
            <p className="text-green-400 text-sm mb-4">
              Box Office: {safeMovie.boxOffice}
            </p>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Starring</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(safeMovie.starring) ? (
                safeMovie.starring.map((actor, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-800/70 text-gray-300 rounded-md text-sm"
                  >
                    {actor}
                  </span>
                ))
              ) : (
                <span className="inline-block px-3 py-1 bg-gray-800/70 text-gray-300 rounded-md text-sm">
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

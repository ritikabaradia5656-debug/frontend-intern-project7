import { useState, useEffect } from "react";

const API_KEY = "a00890c3";

function useMovies(search, page) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!search) return;

    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&page=${page}&apikey=${API_KEY}`
        );
        const data = await res.json();

        if (data.Response === "True") {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError(data.Error);
        }
      } catch {
        setError("Something went wrong");
      }
      setLoading(false);
    };

    fetchMovies();
  }, [search, page]);

  return { movies, loading, error };
}

export default function App() {
  const [search, setSearch] = useState("batman");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const { movies, loading, error } = useMovies(search, page);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites"));
    if (saved) setFavorites(saved);
  }, []);

  const toggleFavorite = (movie) => {
    const exists = favorites.find((f) => f.imdbID === movie.imdbID);
    let updated;

    if (exists) {
      updated = favorites.filter((f) => f.imdbID !== movie.imdbID);
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black to-transparent">
        <h1 className="text-red-600 text-2xl font-bold">NETFLIX</h1>
        <input
          className="bg-gray-800 px-3 py-1 rounded text-sm outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search movies..."
        />
      </div>

      {/* States */}
      {loading && <p className="px-6">Loading...</p>}
      {error && <p className="px-6 text-red-500">{error}</p>}

      {/* Movies */}
      <div className="px-6 mt-4">
        <h2 className="text-xl font-semibold mb-3">Popular</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="relative group cursor-pointer"
            >
              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300"
                }
                alt={movie.Title}
                className="rounded-lg w-full h-72 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 rounded-lg">
                <h3 className="text-sm font-bold">{movie.Title}</h3>
                <p className="text-xs">{movie.Year}</p>

                <button
                  onClick={() => toggleFavorite(movie)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded"
                >
                  {favorites.find((f) => f.imdbID === movie.imdbID)
                    ? "💔 Remove"
                    : "❤️ Favorite"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
        >
          Next
        </button>
      </div>

      {/* Favorites */}
      <div className="px-6 mt-10">
        <h2 className="text-xl font-semibold mb-3">My List ⭐</h2>
        <div className="flex gap-4 overflow-x-auto">
          {favorites.map((movie) => (
            <img
              key={movie.imdbID}
              src={movie.Poster}
              className="w-32 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
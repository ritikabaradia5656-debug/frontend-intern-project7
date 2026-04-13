import { useState, useEffect } from "react";

const API_KEY = "a00890c3";

/* ================= CUSTOM HOOK ================= */
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

/* ================= APP ================= */
export default function App() {
  const [search, setSearch] = useState("batman");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  const { movies, loading, error } = useMovies(search, page);

  /* Load favorites */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites"));
    if (saved) setFavorites(saved);
  }, []);

  /* Toggle favorite */
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
    <div className="min-h-screen" style={{ background: "#141414", color: "#fff" }}>

      {/* ================= NAVBAR ================= */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px"
      }}>
        <h1 style={{ color: "#e50914", fontSize: "24px" }}>
          NETFLIX
        </h1>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search movies..."
        />
      </div>

      {/* ================= STATES ================= */}
      {loading && <p style={{ paddingLeft: "20px" }}>Loading...</p>}
      {error && <p style={{ paddingLeft: "20px", color: "red" }}>{error}</p>}

      {/* ================= MOVIES ================= */}
      <div style={{ padding: "20px" }}>
        <h2>Popular</h2>

        {movies.length === 0 && !loading && <p>No movies found</p>}

        <div className="grid">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">

              <img
                src={
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/300"
                }
                alt={movie.Title}
              />

              <div className="card-content">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>

                <button onClick={() => toggleFavorite(movie)}>
                  {favorites.find((f) => f.imdbID === movie.imdbID)
                    ? "💔 Remove"
                    : "❤️ Favorite"}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* ================= FAVORITES ================= */}
      <div className="favorites">
        <h2>My List ⭐</h2>

        <div className="favorites-row">
          {favorites.map((movie) => (
            <img
              key={movie.imdbID}
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/150"
              }
              alt={movie.Title}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
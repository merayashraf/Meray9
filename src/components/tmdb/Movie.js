import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig/instance';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../Redux/Rxd";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [lang, setLang] = useState('en-US');
  const favorites = useSelector((state) => state.favorites);
  const api = 'ed28eb94318601461e6122f853363392';
  const path = 'https://image.tmdb.org/t/p/w500';
  const isFavorite = (id) => favorites.some((item) => item.id === id);
  const handleToggleFavorites = (id, title, imgSrc) => {
    if (isFavorite(id)) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites({ id, title, imgSrc }));
    }
  };
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get('/3/movie/popular', {
          params: {
            api_key: api,
            language: lang,
            page: currentPage,
          },
        });
        if (response.status !== 200) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const data = response.data;
        setMovies(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, [currentPage, lang]);

  const changeLanguage = () => {
    setLang(lang === 'en-US' ? 'ar-SA' : 'en-US');
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12 bg-light text-right">
          <button type="button" className="btn btn-primary float-end my-3" onClick={changeLanguage}>
            {lang}
          </button>
        </div>
      </div>
      <h1>Popular Movies - Page {currentPage}</h1>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-6 col-lg-4 col-xl-4" key={movie.id}>
            <div className="card text-black">
              <i className="fab fa-apple fa-lg pt-3 pb-1 px-3"></i>
              <img src={path + movie.poster_path} className="card-img-top" alt="Apple Computer" />
              <div className="card-body">
                <div className="text-center">
                  <h5 className="card-title">{movie.name}</h5>
                  <p className="text-muted mb-4">{movie.overview}</p>
                </div>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>Year</span>
                    <span>{movie.first_air_date}</span>
                  </div>
                </div>
                <Link to={'/movieDetails/' + movie.id} style={{ textDecoration: 'none' }}>
                  <div className="row">
                    <div className="col-md-12 bg-light text-right">
                      <button type="button" className="btn btn-primary my-3">
                        Show Movie Details
                      </button>
                    </div>
                  </div>
                </Link>
                <button
                      onClick={() =>
                        handleToggleFavorites(
                          movie.id,
                          movie.title,
                         `${path}${movie.poster_path}`
                        )
                      }
                      className={`btn ${
                        isFavorite(movie.id) ? "btn-danger" : "btn-primary"
                      }`}
                    >
                      {isFavorite(movie.id)
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
        disabled={currentPage === 1}
      >
        Previous Page
      </button>
      <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next Page</button>
    </div>
  );
}

export default Movies;

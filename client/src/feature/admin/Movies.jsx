import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMovieForUpdate, getMovies } from '../../api/movie';
import UpdateMovie from '../../components/modals/UpdateMovie';
import MovieListItem from '../../components/MovieListItem';
import NextAndPrevButton from '../../components/NextAndPrevButton';
import { useNotification } from '../../hooks';
import { getToken } from '../../redux/selector';

const limit = 1;
let currentPageNo = 0;

function Movies() {
  const [movies, setMovies] = useState([]);
  const token = useSelector(getToken);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo) => {
    try {
      const { movies } = await getMovies(pageNo, limit, token);
      setMovies([...movies]);
      if (!movies.length) {
        currentPageNo = pageNo - 1;
        return setReachedToEnd(true);
      }
    } catch (e) {
      updateNotification('error', e);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const handleOnPrevClick = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  const handleOnEditClick = async ({ id }) => {
    try {
      const { movie } = await getMovieForUpdate(id, token);
      setSelectedMovie(movie);
      setShowUpdateModal(true);
    } catch (error) {
      updateNotification('error', error);
    }
  };

  return (
    <>
      <div className="space-y-3 p-5">
        {movies.map((movie) => {
          return (
            <MovieListItem
              movie={movie}
              key={movie.id}
              onEditClick={() => handleOnEditClick(movie)}
            />
          );
        })}
        <NextAndPrevButton
          className="mt-5"
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
      <UpdateMovie visible={showUpdateModal} initialState={selectedMovie} />
    </>
  );
}

export default Movies;

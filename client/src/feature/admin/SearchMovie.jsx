import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getToken } from '../../redux/selector';
import { useSelector } from 'react-redux';
import { searchMovieForAdmin } from '../../api/movie';
import { useNotification } from '../../hooks/index';
import { parseError } from '../../utils/helper';
import MovieListItem from '../../components/MovieListItem';
import NotFoundText from '../../components/NotFoundText';
export default function SearchMovie() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const token = useSelector(getToken);
  const { updateNotification } = useNotification();
  const query = searchParams.get('title');

  const searchMovies = async (value) => {
    try {
      const { results } = await searchMovieForAdmin(value, token);

      if (!results.length) {
        setResultNotFound(true);
        return setMovies([]);
      }

      setResultNotFound(false);
      setMovies([...results]);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  const handleAfterDelete = (movie) => {
    const updateMovies = movies.filter((m) => movie.id !== m.id);
    setMovies([...updateMovies]);
  };
  const handleAfterUpdate = (movie) => {
    const updateMovies = movies.map((m) => {
      if (m.id === movie.id) return movie;
      return m;
    });
    setMovies([...updateMovies]);
  };

  useEffect(() => {
    if (query.trim()) searchMovies(query);
  }, [query]);

  return (
    <div>
      <NotFoundText text="Record not found!" visible={resultNotFound} />
      {!resultNotFound
        ? movies.map((m) => {
            return (
              <MovieListItem
                movie={m}
                key={m.id}
                afterDelete={handleAfterDelete}
                afterUpdate={handleAfterUpdate}
                token={token}
              />
            );
          })
        : null}
    </div>
  );
}

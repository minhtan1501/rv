import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
import MovieList from './MovieList';
export default function TopRatedTVSeries() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fectchMovie = async (signal) => {
    try {
      const { movies } = await getTopRatedMovies('TV Series',signal);
      setMovies([...movies]);
    } catch (error) {
      updateNotification('error',parseError(error));
    }
  };
  useEffect(() => {
    const ac = new AbortController()
    fectchMovie(ac.signal);
    return () => {
      ac.abort()
    }
  }, []);


  return (
   <MovieList movies={movies} title="Viewers choice (TV Series)"/>
  );
}

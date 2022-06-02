import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
import MovieList from './MovieList';
export default function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fectchMovie = async () => {
    try {
      const { movies } = await getTopRatedMovies();
      setMovies([...movies]);
    } catch (error) {
      updateNotification('error',parseError(error));
    }
  };
  useEffect(() => {
    fectchMovie();
  }, []);


  return (
   <MovieList movies={movies} title="Viewers choice (Movies)"/>
  );
}

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchPublic } from '../../api/movie';
import Container from '../../components/Container';
import NotFoundText from '../../components/NotFoundText';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
import MovieList from './MovieList';

export default function SearchMovies() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const { updateNotification } = useNotification();
  const query = searchParams.get('title');

  const searchMovies = async (value) => {
    try {
      const { results } = await searchPublic(value);

      if (!results.length) {
        setResultNotFound(true);
        console.log("Test");
        return setMovies([]);
      }

      setResultNotFound(false);
      setMovies([...results]);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  useEffect(() => {
    if (query?.trim()) searchMovies(query);
  }, [query]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:px-0">
        <NotFoundText text="Record not found!" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import ModalContainer from './ModalContainer';
import MovieForm from '../form/MovieForm';
import { getToken } from '../../redux/selector';
import { useSelector } from 'react-redux';
import { getMovieForUpdate, updateMovie } from '../../api/movie';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
export default function UpdateMovie({
  visible,
  onSuccess,
  onClose,
  movieId,
}) {
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const token = useSelector(getToken);
  const { updateNotification } = useNotification();
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const { message, movie } = await updateMovie(
        movieId,
        data,
        token
      );
      setLoading(false);
      updateNotification('success', message);
      onSuccess && onSuccess(movie);
      onClose && onClose();
    } catch (error) {
      setLoading(false);
      updateNotification('error', parseError(error));
    }
  };

  const fetchMovieToUpdate = async () => {
    try {
      const { movie } = await getMovieForUpdate(movieId, token);
      setSelectedMovie(movie);
      setReady(true);
    } catch (error) {
      updateNotification('error', error);
    }
  };

  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      {ready ? (
        <MovieForm
          initialState={selectedMovie}
          loading={loading}
          btnTitle="Update"
          onSubmit={!loading ? handleSubmit : null}
        />
      ) : (
        <div className="
        w-full h-full justify-center 
        items-center flex">
          <p className='text-light-subtle text-xl
          dark:text-dark-subtle animate-pulse'>
            Please wait...
          </p>
        </div>
      )}
    </ModalContainer>
  );
}

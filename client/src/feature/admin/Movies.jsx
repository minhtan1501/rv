import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie, getMovieForUpdate, getMovies } from '../../api/movie';
import ConfirmModal from '../../components/modals/ConfirmModal';
import UpdateMovie from '../../components/modals/UpdateMovie';
import MovieListItem from '../../components/MovieListItem';
import NextAndPrevButton from '../../components/NextAndPrevButton';
import { useNotification } from '../../hooks';
import movieSlice, {fetchMovie} from '../../redux/movieSlice';
import { getToken } from '../../redux/selector';
import { parseError } from '../../utils/helper';


function Movies() {
  const [movies, setMovies] = useState([]);
  const token = useSelector(getToken);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateNotification } = useNotification();
  const dispatch = useDispatch();
  const {newMovies,currentPageNo} = useSelector(state =>state.movie)
  const fetchMovies =  (pageNo = 0) => {
     return dispatch(fetchMovie({pageNo,token}))
  };
  useEffect(() => {
     fetchMovies(currentPageNo);
  }, [currentPageNo]);

  const handleOnNextClick = () => {
    dispatch(movieSlice.actions.nextClick())
    
  };

  const handleOnPrevClick = () => {
     dispatch(movieSlice.actions.prevClick())
     
  };
  
  // const hideUpdateForm = () => {
  //   setShowUpdateModal(false);
  // };

  // const handleOnUpdate = (movie) => {
  //   const updatedMovie = movies.map((m) => {
  //     if (m.id === movie.id) return movie;
  //     return m;
  //   });
  //   setMovies([...updatedMovie]);
  // };
  

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };


  const handleUIUpdate = () => {
    fetchMovies(currentPageNo);
  }


  return (
    <>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              movie={movie}
              key={movie.id}
              token={token}
              alterUpdate={handleUIUpdate}
              // onEditClick={() => handleOnEditClick(movie)}
              // onDeleteClick={() => handleOnDeleteClick(movie)}
              alterDelete={handleUIUpdate}
            />
          );
        })}
        
          <NextAndPrevButton
            className="mt-5"
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
      </div>
      {/* <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        title="Are you sure?"
        subTitle="This action will remove this movie permanently!"
        loading={loading}
      /> */}
      {/* <UpdateMovie
        onSuccess={handleOnUpdate}
        visible={showUpdateModal}
        initialState={selectedMovie}
        onClose={hideUpdateForm}
      /> */}
    </>
  );
}

export default Movies;

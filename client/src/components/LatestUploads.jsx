import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie, getMovieForUpdate, getMovies } from '../api/movie';
import { useNotification } from '../hooks';
import { fetchLatestMovie } from '../redux/movieSlice';
import { getToken } from '../redux/selector';
import { parseError } from '../utils/helper';
import ConfirmModal from './modals/ConfirmModal';
import UpdateMovie from './modals/UpdateMovie';
import MovieListItem from './MovieListItem';

const pageNo = 0;
const limit = 5;

export default function LatestUploads({ avatar }) {
  const { updateNotification } = useNotification();
  const [movies, setMovies] = useState([]);
  const dispatch = useDispatch();
  const {newMovies} = useSelector((state) => state.movie)
  const token = useSelector(getToken);
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [showUpdateModal,setShowUpdateModal] = useState(false);
  // const hideUpdateModal = () => setShowUpdateModal(false);

  // const handleOnEditClick = async({id}) =>{
  //   try {
  //     const {movie} = await getMovieForUpdate(id,token)
  //     setShowUpdateModal(true);
  //     setSelectedMovie(movie);
  //   } catch (error) {
      
  //   }
  // }
  // const handleOnUpdate = (movie) => {
  //   const updatedMovie = movies.map((m) => {
  //     if (m.id === movie.id) return movie;
  //     return m;
  //   });
  //   setMovies([...updatedMovie]);
  // };



  // const hideConfirmModal = () => setShowConfirmModal(false);

  // const handleOnDeleteClick = (movie) => {
  //   setShowConfirmModal(true);
  //   setSelectedMovie(movie);
  // };

  // const handleOnDeleteConfirm = async () => {
  //   try {
  //     setLoading(true);
  //     const { message } = await deleteMovie(selectedMovie.id, token);
  //     setLoading(false);
  //     updateNotification('success', message);
  //     hideConfirmModal()
  //     fetchLatesUploads()
  //   } catch (error) {
  //     setLoading(false);
  //     updateNotification('error', parseError(error));
  //   }
  // };


  const fetchLatesUploads = async () => {
    try {
      // const { movies } = await getMovies(0, limit, token);
      // setMovies([...movies]);
      dispatch(fetchLatestMovie({qty:5,token}));
    } catch (e) {
       updateNotification('error', parseError(e));
    }
  };

  useEffect(() => {
    fetchLatesUploads();
  }, []);

  const handleUIUpdate = () => {
    fetchLatesUploads();
  }

  return (
    <>
      <div
        className="
   bg-white shadow dark:shadow 
   dark:bg-secondary p-5 rounded
   col-span-2 "
      >
        <h1
          className="
        font-semibold text-2xl 
        mb-2 text-primary
        dark:text-white"
        >
          Recent Uploads
        </h1>
        <div className="space-y-2">
          {newMovies.map((m) => {
            return (
              <MovieListItem
                movie={m}
                key={m.id}
                token={token}
                // onDeleteClick={()=>handleOnDeleteClick(m)}
                // onEditClick={()=>handleOnEditClick(m)}
                alterDelete={handleUIUpdate}
                alterUpdate={handleUIUpdate}
              />
            );
          })}
        </div>
      </div>
      {/* <ConfirmModal
        title="Are you sure?"
        subTitle="This action will remove this movie permanently!"
        onCancel={hideConfirmModal}
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        loading={loading}
      />
      <UpdateMovie onSuccess={handleOnUpdate} visible={showUpdateModal} initialState={selectedMovie} onClose={hideUpdateModal} /> */}
    </>
  );
}

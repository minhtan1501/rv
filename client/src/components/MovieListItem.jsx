import React, { useState } from 'react';
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { deleteMovie } from '../api/movie';
import { useNotification } from '../hooks';
import { parseError } from '../utils/helper';
import ConfirmModal from './modals/ConfirmModal';
import UpdateMovie from './modals/UpdateMovie';

export default function MovieListItem({
  movie,
  alterDelete,
  token,
  alterUpdate,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { updateNotification } = useNotification();

  const handleOnDeleteConfirm = async () => {
    try {
      setLoading(true);
      const { message } = await deleteMovie(movie.id, token);
      setLoading(false);
      hideConfirmModal();
      updateNotification('success', message);
      alterDelete(movie);
    } catch (error) {
      setLoading(false);
      updateNotification('error', parseError(error));
    }
  };
  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };
  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleOnUpdate = (movie) => {
    setShowUpdateModal(false);
    alterUpdate && alterUpdate(movie);
    setSelectedMovieId(null);
  };

  const handleOnEditClick = async () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };

  const hideUpdateModal = () => setShowUpdateModal(false);
  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
        // onOpenClick={onOpenClick}
      />
      <div className="p-0">
        <ConfirmModal
          visible={showConfirmModal}
          onCancel={hideConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          title="Are you sure?"
          subTitle="This action will remove this movie permanently!"
          loading={loading}
        />
        <UpdateMovie
          onSuccess={handleOnUpdate}
          visible={showUpdateModal}
          movieId={selectedMovieId}
          onClose={hideUpdateModal}
        />
      </div>
    </>
  );
}

function MovieCard({ movie, onDeleteClick, onEditClick, onOpenClick }) {
  const { poster, title, genres = [], status } = movie;
  return (
    <table
      className="
       w-full border-b "
    >
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img
                className="
                  w-full aspect-video
                  "
                src={poster}
                alt={title}
              />
            </div>
          </td>

          <td className="w-full pl-5">
            <div className="">
              <h1
                className="
                text-lg
              font-semibold
              font-serif 
            text-primary
            dark:text-white"
              >
                {title}
              </h1>
              <div className="space-x-2">
                {genres?.map((g, index) => {
                  return (
                    <span
                      className="
                      text-primary
                      dark:text-white
                        text-xs"
                      key={index + g}
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>
          <td className="px-5">
            <p
              className="
               text-primary
                dark:text-white
                "
            >
              {status}
            </p>
          </td>

          <td>
            <div
              className="
                flex items-center justify-center 
                space-x-3 text-primary 
                dark:text-white text-lg"
            >
              <button type="button" onClick={onDeleteClick}>
                <BsTrash />
              </button>
              <button type="button" onClick={onEditClick}>
                <BsPencilSquare />
              </button>
              <button type="button" onClick={onOpenClick}>
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

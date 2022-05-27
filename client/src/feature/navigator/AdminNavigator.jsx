import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ActorUpload from '../../components/modals/ActorUpload';
import NotFound from '../../components/NotFound';
import Actors from '../admin/Actors';
import Dashboard from '../admin/Dashboard';
import Header from '../admin/Header';
import Movies from '../admin/Movies';
import MovieUpload from '../admin/MovieUpload';
import NavbarAdmin from '../admin/NavbarAdmin';

function AdminNavigator() {
  const [showModalUploadMovie, setShowModalUploadMovie] = useState(false);
  const [showModalUploadActor, setShowModalUploadActor] = useState(false);

  const displayModalUploadMovie = () => {
    setShowModalUploadMovie(true);
  };

  const hideModalUploadMovie = () => {
    setShowModalUploadMovie(false);
  };

  const displayModalUploadActor = () => {
    setShowModalUploadActor(true);
  };

  const hideModalUploadActor = () => {
    setShowModalUploadActor(false);
  };

  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        <NavbarAdmin />
        <div className="flex-1  max-w-screen-xl">
          <Header
            onAddMoviesClick={displayModalUploadMovie}
            onAddActorsClick={displayModalUploadActor}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <MovieUpload
        visible={showModalUploadMovie}
        onClose={hideModalUploadMovie}
      />
      <ActorUpload
        visible={showModalUploadActor}
        onClose={hideModalUploadActor}
      />
    </>
  );
}

export default AdminNavigator;

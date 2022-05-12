import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../../components/NotFound';
import Actors from '../admin/Actors';
import Dashboard from '../admin/Dashboard';
import Header from '../admin/Header';
import Movies from '../admin/Movies';
import NavbarAdmin from '../admin/NavbarAdmin';

function AdminNavigator() {
  return (
    <div className="flex dark:bg-primary bg-white">
      <NavbarAdmin />
      <div className="flex-1 p-2 max-w-screen-xl">
          <Header/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminNavigator;

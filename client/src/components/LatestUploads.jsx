import React from 'react';
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from 'react-icons/bs';
import MovieListItem from './MovieListItem';
export default function LatestUploads({ avatar }) {
  return (
    <div
      className="
   bg-white shadow dark:shadow 
   dark:bg-secondary p-5 rounded
   col-span-2"
    >
      <h1
        className="
        font-semibold text-2xl 
        mb-2 text-primary
        dark:text-white"
      >
        Recent Uploads
      </h1>
      <MovieListItem
        movie={{
          poster: 'http://localhost:3000/logo.png',
          title: 'Lorem ipsum dolor sit amet',
          status: 'public',
          genres: ["Action","Drama"]
        }}
      />
    </div>
  );
}


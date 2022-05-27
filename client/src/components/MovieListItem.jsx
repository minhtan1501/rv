import React from 'react';
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from 'react-icons/bs';

export default function MovieListItem({
  movie,
  onDeleteClick,
  onEditClick,
  onOpenClick,
}) {
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

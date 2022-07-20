import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMostRatedMovies } from '../api/admin';
import { useNotification } from '../hooks';
import { getToken } from '../redux/selector';
import { convertReviewCount, parseError } from '../utils/helper';
import RatingStar from '../components/RatingStar';
export default function MostRatedMovies() {
  const [movies, setMovies] = useState([]);
  const token = useSelector(getToken);
  const { updateNotification } = useNotification();

  const fetchMostRatedMovies = async () => {
    try {
      const { movies } = await getMostRatedMovies(token);
      setMovies([...movies]);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);
  return (
    <div
      className="
    bg-white shadow dark:bg-secondary
    rounded dark:shadow p-5
    "
    >
      <h1
        className="
        font-semibold text-2xl 
        mb-2 text-primary
        dark:text-white"
      >
        Most Rated Movies
      </h1>
      <ul className="space-y-3"></ul>
      {movies.map((m) => {
        return (
          <li key={m.id} className="list-none">
            <h1
              className="
                text-secondary dark:text-white 
                font-semibold "
            >
              {m.title}
            </h1>
            <div className="flex">
              <RatingStar rating={m.reviews?.ratingAvg} />
              <p className="text-light-subtle dark:text-dark-subtle">
                {convertReviewCount(m.reviews?.ratingCount)} Review
              </p>
            </div>
          </li>
        );
      })}
    </div>
  );
}

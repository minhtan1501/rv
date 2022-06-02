import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSingleMovie } from '../../api/movie';
import { useNotification } from '../../hooks';
import { parseError } from '../../utils/helper';
import Container from '../../components/Container';
import RatingStar from '../../components/RatingStar';

const convertReviewCount = (count) => {
  if (count <= 999) {
    return count;
  }

  return parseFloat(count / 1000).toFixed(2) + 'k';
};

const convertDate = (date = '') => {
  return date.split("T")[0]
}

export default function SingleMovie() {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const { movieId } = useParams();

  const { updateNotification } = useNotification();

  const fectchMovie = async () => {
    try {
      const { movie } = await getSingleMovie(movieId);
      setLoading(true);
      setMovie(movie);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };
  useEffect(() => {
    if (movieId) fectchMovie();
  }, [movieId]);
  if (!loading) {
    return (
      <div
        className="
      w-screen h-screen flex
      justify-center items-center
      dark:bg-primary bg-white
      "
      >
        <p className="text-light-subtle dark:text-white animate-pulse">
          Please wait
        </p>
      </div>
    );
  }

  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    reviews = {},
    director = {},
    writers = [],
    cast=[],
    genres = [],
    language,
    releseDate,
    type,
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container>
        <video poster={poster} controls src={trailer} />
        <div className="flex justify-between">
          <h1
            className="
          text-4xl text-highlight
        dark:text-highlight-dark 
          font-semibold py-3"
          >
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <Link
              className="
              text-highlight
            dark:text-highlight-dark 
            hover:underline"
              to={'/movie/reviews/' + id}
            >
              {convertReviewCount(reviews.ratingCount)} Reviews
            </Link>

            <button
              className="
            text-highlight
            dark:text-highlight-dark 
            hover:underline"
              type="button"
            >
              Rate The Movie
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Director:
            </p>
            <p className="text-highlight dark:text-highlight-dark hover:underline">
              {director.name}
            </p>
          </div>
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Writers:
            </p>
            {writers.map((w) => (
              <p
                key={w.id}
                className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
              >
                {w.name}
              </p>
            ))}
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Cast:
            </p>
            {cast.map((c) =>
              c.leadActor ? (
                <p
                  key={c.id}
                  className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
                >
                  {c.profile.name}
                </p>
              ) : null
            )}
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Language:
            </p>
            <p
              className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
            >
              {language}
            </p>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Release Date:
            </p>
            <p
              className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
            >
              {convertDate(releseDate)}
            </p>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Genres:
            </p>
            {genres.map((g,index) =>
               (
                <p
                  key={index}
                  className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
                >
                  {g}
                </p>
              ) 
            )}
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Type:
            </p>
            <p
              className="
              text-highlight dark:text-highlight-dark 
              hover:underline cursor-pointer"
            >
              {type}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

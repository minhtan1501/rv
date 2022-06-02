import React from 'react';
import { Link } from 'react-router-dom';
import GridContainer from '../../components/GridContainer';
import RatingStar from '../../components/RatingStar';
import { trimTitle } from '../../utils/helper';

export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;
  return (
    <div>
      <h1
        className="
            text-2xl dark:text-white
            text-secondary font-semibold
            mb-5"
      >
        {title}
      </h1>
      <GridContainer>
        {movies.map((movie) => {
          return <ListItem key={movie.id} movie={movie} />;
        })}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { id, title, poster, reviews } = movie;
  return (
    <Link to={`/movie/${id}`}>
      <div>
        <img className="aspect-video object-cover" src={poster} alt={title} />

        <h1
          className="
        text-lg dark:text-white
        text-secondary font-semibold
      "
          title={title}
        >
          {trimTitle(title)}
        </h1>

        <RatingStar rating={reviews.ratingAvg} />
      </div>
    </Link>
  );
};

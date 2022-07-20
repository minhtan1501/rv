import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSingleMovie } from '../../api/movie';
import { useNotification } from '../../hooks';
import { convertDate, convertReviewCount, parseError } from '../../utils/helper';
import Container from '../../components/Container';
import RatingStar from '../../components/RatingStar';
import RelatedMovies from '../../components/RelatedMovies';
import { useSelector } from 'react-redux';
import AddRatingModal from '../../components/modals/AddRatingModal';
import CustomButton from '../../components/CustomButton';
import ProfileModal from '../../components/modals/ProfileModal';



export default function SingleMovie() {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});

  const navigate = useNavigate();
  const { isLogin } = useSelector((state) => state.user);

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
  const {
    id,
    trailer,
    poster,
    title,
    storyLine,
    reviews = {},
    director = {},
    writers = [],
    cast = [],
    genres = [],
    language,
    releseDate,
    type,
  } = movie;

  const handleOnRateMovie = () => {
    if (!isLogin) return navigate('/auth/signin');
    setShowRatingModal(true);
  };

  const hideRatingModal = () => setShowRatingModal(false);

  const hideProfileModal = () => setShowProfileModal(false);

  const handleOnSuccess = (reviews) => {
    setMovie({ ...movie, reviews });
  };

  const handleProfileClick = (profile) =>{
    setSelectedProfile(profile);
    setShowProfileModal(true);
  }
  
  useEffect(() => {
    window.scroll(0, 0);
  }, []);
 
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

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="px-2 xl:px-0">
        <video poster={poster} controls src={trailer} className="w-full" />
        <div className="flex justify-between">
          <h1
            className="
          xl:text-4xl lg:text-3xl text-2xl text-highlight
        dark:text-highlight-dark 
          font-semibold py-3"
          >
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButton
              label={convertReviewCount(reviews.ratingCount) + ' Reviews'}
              onClick={() => navigate('/movie/reviews/' + id)}
              clickable
            />

            <CustomButton
              clickable
              label="Rate The Movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
          <ListWithLabel label="Director:">
            <CustomButton label={director.name} clickable onClick={()=> handleProfileClick(director)} />
          </ListWithLabel>

          <ListWithLabel label="Writers:">
            {writers.map((w) => (
              <CustomButton key={w.id} clickable label={w.name} />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Cast:">
            {cast.map((c) =>
              c.leadActor ? (
                <CustomButton key={c.id} label={c.profile.name} />
              ) : null
            )}
          </ListWithLabel>

          <ListWithLabel label="Language:">
            <CustomButton label={language} clickable />
          </ListWithLabel>

          <ListWithLabel label="Release Date:">
            <CustomButton label={convertDate(releseDate)} clickable />
          </ListWithLabel>

          <ListWithLabel label="Genres:">
            {genres.map((g, index) => (
              <CustomButton key={index} clickable label={g} />
            ))}
          </ListWithLabel>

          <ListWithLabel label="Type:">
            <CustomButton label={type} clickable />
          </ListWithLabel>

          <CastProfile cast={cast} />
        </div>

        <div className="mt-3">
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>
      <AddRatingModal
        onSuccess={handleOnSuccess}
        visible={showRatingModal}
        onClose={hideRatingModal}
      />
      <ProfileModal
        profileId={selectedProfile.id}
        visible={showProfileModal}
        onClose={hideProfileModal}
      />
    </div>
  );
}

const ListWithLabel = ({ label, children }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfile = ({ cast }) => {
  return (
    <div className="mt-5">
      <h1
        className="
          text-2xl mb-2 text-light-subtle 
          dark:text-dark-subtle font-semibold"
      >
        Cast:
      </h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ profile, id, roleAs }) => {
          return (
            <div
              key={id}
              className="
                flex flex-col items-center 
                basis-36 text-center mb-4"
            >
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.avatar}
                alt=""
              />
              <div className="text-center flex flex-col items-center">
                <CustomButton label={profile.name} />
                <span
                  className="
                    text-sm text-light-subtle 
                  dark:text-dark-subtle font-semibold"
                >
                  as
                </span>
                <p
                  className="
                text-light-subtle 
                dark:text-dark-subtle font-semibold text-lg"
                >
                  {roleAs}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

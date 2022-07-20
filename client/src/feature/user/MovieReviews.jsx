import React, { useEffect, useState } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { deleteReview, getReviewByMovie } from '../../api/review';
import Container from '../../components/Container';
import CustomButton from '../../components/CustomButton';
import ConfirmModal from '../../components/modals/ConfirmModal';
import EditRatingModal from '../../components/modals/EditRatingModal';
import NotFoundText from '../../components/NotFoundText';
import RatingStar from '../../components/RatingStar';
import { useNotification } from '../../hooks';
import { getToken } from '../../redux/selector';
import { parseError } from '../../utils/helper';
const getNameInitial = (name = '') => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [title, setTitle] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileOwnerReview, setProfileOwnerReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(false);

  const { updateNotification } = useNotification();
  const { movieId } = useParams();
  const { _id: id } = useSelector((state) => state.user.profile);
  const token = useSelector(getToken);
  const fetchReviews = async () => {
    try {
      const { movie } = await getReviewByMovie(movieId);
      setReviews([...movie?.reviews]);
      setTitle(movie.title);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  const findProfileOwnerReview = () => {
    if (profileOwnerReview) return setProfileOwnerReview(null);
    const match = reviews.find((r) => r.owner.id === id);
    if (!match)
      return updateNotification('error', "You don't have any review!");
    setProfileOwnerReview(match);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);

  const handleDeleteReview = async () => {
    try {
      setLoading(true);
      const { message } = await deleteReview(profileOwnerReview.id, token);
      updateNotification('success', message);
      const updatedReviews = reviews.filter(
        (r) => r.id !== profileOwnerReview.id
      );

      setReviews([...updatedReviews]);
      setProfileOwnerReview(null);
      hideConfirmModal();
      setLoading(false);
    } catch (error) {
      updateNotification('error', parseError(error));
    }
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnerReview;
    setShowEditModal(true);
    setSelectedReview({
      id,
      content,
      rating,
    });
  };

  const hideShowEditModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnerReview,
      rating: review.rating,
      content: review.content,
    };
    setProfileOwnerReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });
    setReviews([...newReviews]);
  };

  useEffect(() => {
    movieId && fetchReviews();
  }, [movieId]);

  return (
    <div className="bg-white dark:bg-primary min-h-screen ">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between">
          <h1
            className="
        text-2xl font-semibold
        dark:text-white text-secondary"
          >
            <span className="text-light-subtle dark:text-dark-subtle font-normal ">
              Reviews for:
            </span>{' '}
            {title}
          </h1>
          {id ? (
            <CustomButton
              onClick={findProfileOwnerReview}
              clickable
              label={profileOwnerReview ? 'View All' : 'Find My Review'}
            />
          ) : null}
        </div>

        <NotFoundText text="No Reviews" visible={!reviews.length} />

        <div className="space-y-3 mt-3">
          {profileOwnerReview ? (
            <div className="">
              <ReviewCard review={profileOwnerReview} />
              <div className="dark:text-white text-primary text-xl flex items-center space-x-3">
                <button onClick={displayConfirmModal} type="button">
                  <BsTrash />
                </button>
                <button onClick={handleOnEditClick} type="button">
                  <BsPencilSquare />
                </button>
              </div>
            </div>
          ) : (
            reviews.map((r) => <ReviewCard review={r} key={r.id} />)
          )}
        </div>
      </Container>
      <ConfirmModal
        loading={loading}
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteReview}
        title="Are you sure?"
        subTitle="This action will remove this review permanently"
      />
      <EditRatingModal
        onClose={hideShowEditModal}
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
      />
    </div>
  );
}

const ReviewCard = ({ review = {} }) => {
  if (!review) return;
  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3">
      <div
        className="
        flex items-center 
        justify-center w-14 h-14 
        rounded-full bg-primary 
      dark:bg-dark-subtle text-white 
        text-xl select-none"
      >
        {getNameInitial(owner?.name)}
      </div>
      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg">
          {owner?.name}
        </h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};

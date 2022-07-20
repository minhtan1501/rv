import axiosClient from './axiosClient';

export const addReview = (movieId, reviewData, token) => {
  const url = '/review/add/' + movieId;
  return axiosClient.post(url, reviewData, {
    headers: { Authorization: token },
  });
};

export const getReviewByMovie = (movieId) => {
  const url = '/review/get-reviews-by-movie/' + movieId;
  return axiosClient.get(url)
}

export const deleteReview = (reviewId,token) => {
  const url = '/review/' + reviewId;
  return axiosClient.delete(url,{
    headers: { Authorization: token}
  })
}


export const updateReview = (reviewId, reviewData, token) => {
  const url = '/review/' + reviewId;
  return axiosClient.patch(url, reviewData, {
    headers: { Authorization: token },
  });
};

import axiosClient from './axiosClient';

export const uploadTrailer = (formData, token, onUploadProgress) => {
  const url = '/movie/upload-trailer';
  return axiosClient.post(url, formData, {
    headers: { Authorization: token, 'content-type': 'multipart/form-data' },
    withCredentials: true,
    onUploadProgress: ({ loaded, total }) => {
      if (onUploadProgress)
        onUploadProgress(Math.floor((loaded / total) * 100));
    },
  });
};
export const uploadMovie = (formData, token) => {
  const url = '/movie/create';
  return axiosClient.post(url, formData, {
    headers: { Authorization: token, 'content-type': 'multipart/form-data' },
    withCredentials: true,
  });
};



export const getMovies = async (pageNo,limit,token) =>{
  const url = `/movie/movies?pageNo=${pageNo}&limit=${limit}`;
  return axiosClient.get(url,{
    withCredentials: true,
    headers: { Authorization: token}
  })
}

export const getMovieForUpdate = async (id,token) =>{
  const url = `/movie/for-update/${id}`;
  return axiosClient.get(url,{
    withCredentials: true,
    headers: { Authorization: token}
  })
}

export const updateMovie = (id,formData, token) => {
  const url = `/movie/update/${id}`;
  return axiosClient.patch(url, formData, {
    headers: { Authorization: token, 'content-type': 'multipart/form-data' },
    withCredentials: true,
  });
};

export const deleteMovie = (id, token) => {
  const url = `/movie/${id}`;
  return axiosClient.delete(url,{
    headers: { Authorization: token, 'content-type': 'multipart/form-data' },
    withCredentials: true,
  });
};

export const searchMovieForAdmin = (value, token) => {
  const url = `/movie/search?title=${value}`;
  return axiosClient.get(url,{
    headers: { Authorization: token, 'content-type': 'multipart/form-data' },
    withCredentials: true,
  });
};

export const getTopRatedMovies = (type) => {
  let url = '/movie/top-rated';
  if(type) url = url + "?type=" + type

  return axiosClient.get(url);
};

export const getLatestUploads = () => {
  const url = '/movie/latest-uploads';

  return axiosClient.get(url);
};

export const getSingleMovie = (movieId) => {
  const url = '/movie/single/' + movieId;
  return axiosClient.get(url);

}
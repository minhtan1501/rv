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

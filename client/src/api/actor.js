import axiosClient from './axiosClient';

export const createActor = (formdata, token) => {
  const url = '/actor/create';
  return axiosClient.post(url, formdata, {
    headers: { 'content-type': 'multipart/form-data', authorization: token },
  });
};

export const searchActor = (query, token) => {
  const url = `/actor/search?name=${query}`;
  return axiosClient.get(url, {
    headers: { 'content-type': 'multipart/form-data', authorization: token },
  });
};

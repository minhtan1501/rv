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
   authorization: token });
};

export const getActors = (pageNo, limit, token) => {
  const url = `/actor/actors?pageNo=${pageNo}&limit=${limit}`;
  return axiosClient.get(url, {
    authorization: token,
  });
};

export const updateActor = (formdata,id, token) => {
  const url = `/actor/update/${id}`;
  return axiosClient.post(url, formdata, {
    headers: { 'content-type': 'multipart/form-data', authorization: token },
  });
};

export const deleteActor = (id, token) => {
  const url = `/actor/${id}`;
  return axiosClient.delete(url, {
    headers: {authorization: token },
  });
};


export const getActorProfile = (id) => {
  const url = `/actor/single/${id}`;
  return axiosClient.get(url);
};
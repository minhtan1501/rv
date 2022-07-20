import axiosClient from "./axiosClient";

export const getAppInfo = (token) =>{
    const url = '/admin/app-info';
    return axiosClient.get(url,{
        headers: { Authorization: token}
    })
}

export const getMostRatedMovies = (token) =>{
    const url = '/admin/most-rated';
    return axiosClient.get(url,{
        headers: { Authorization: token}
    })
}
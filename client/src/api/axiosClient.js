import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // // Any status codes that falls outside the range of 2xx cause this function to trigger
    // // Do something with response error
    if(!error.response) return Promise.reject(error?.message);
    const { config , status, data } = error?.response;
    const URLS = [
      '/user/create',
      '/user/resend-email-verify',
      '/user/reset-password',
      '/user/verify-pass-reset-token',
      '/user/login',
      '/user/verify-email',
      '/movie/upload-trailer',
      '/actor/create',
      '/movie/create',
      '/actor/actors',
      '/movie/movies',
      '/actor/:id',
      '/movie/for-update/',
      '/movie/update/',
      '/movie/',
    ];
    //URLS.includes(config.url) && status === 400
    if (config?.url === '/user/refreshtoken')
      localStorage.removeItem('firstLogin');
    if (status === 400 || status === 404) {
      console.log(data?.error);
      throw new Error(data?.error || data?.message?.name);
    }
    return Promise.reject(error?.response || error?.message);
  }
);
export default axiosClient;

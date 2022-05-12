import axiosClient from './axiosClient';
export const createUser = (userInfo) => {
  const url = '/user/create';
  return axiosClient.post(url, userInfo);
};
export const verifyEmail =  (userInfo) => {
  const url = '/user/verify-email';
  return axiosClient.post(url, userInfo,{
    withCredentials: true,
  });
};

export const login =  (userInfo) => {
  const url = '/user/login';
  return axiosClient.post(url, userInfo, {
    withCredentials: true,
  });
};

export const getInfo =  (token) => {
  const url = '/user/info';
  return axiosClient.get(url, {
    headers: { Authorization: token },
    withCredentials: true,
  });
};
export const getToken =  () => {
  const url = '/user/refreshtoken';
  return axiosClient.get(url, {
    withCredentials: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
};

export const logout =  (userInfo) => {
  const url = '/user/logout';
  return axiosClient.get(url, userInfo, {
    withCredentials: true,
  });
};

export const forgetPassword = (email) => {
  const url = 'user/forget-password';
  return axiosClient.post(url, email)
}

export const verifyPasswordResetToken = async (token,userId) => {
  const url = '/user/verify-pass-reset-token';
  return axiosClient.post(url, {
    token,
    userId
  })
}

export const resetPassword = async (data) =>{
  const url = '/user/reset-password';
  return axiosClient.post(url, data)
}
export const resendEmailVerificationToken = async (data) =>{
  const url = '/user/resend-email-verify';
  return axiosClient.post(url, data)
}
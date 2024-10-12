import {axiosUnauthenticated} from '../API/AxiosInstance';

export const createUser = async (registerData) => {
  const {data} = await axiosUnauthenticated.post('/auth/register', registerData);
  return data;
};

export const loginUser = async (loginData) => {
  const {data} = await axiosUnauthenticated.post('/auth/login', loginData);
  return data;
};


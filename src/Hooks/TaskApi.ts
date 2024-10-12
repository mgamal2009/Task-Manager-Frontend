import {axiosInstance} from '../API/AxiosInstance';


export const createTask = async (task) => {
  const {data} = await axiosInstance.post('/tasks', task);
  return data;
};

export const updateTask = async (task) => {
  const {id, ...taskData} = task;
  const {data} = await axiosInstance.put(`/tasks/${id}`, taskData);
  return data;
};
export const deleteTask = async (id) => {
  const {data} = await axiosInstance.delete(`/tasks/${id}`);
  return data;
};
export const getTasks = async () => {
  const {data} = await axiosInstance.get('/tasks');
  return data;
};



import axiosInstance from './axiosInstance';

const authService = {
  login: async (email, password) => {
    const { data } = await axiosInstance.post('/auth/login/', { email, password });
    return data;
  },
  register: async ({ name, email, password }) => {
    const { data } = await axiosInstance.post('/auth/register/', {
      full_name: name, email, password,
    });
    return data;
  },
  logout: async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) await axiosInstance.post('/auth/logout/', { refresh });
    localStorage.clear();
  },
  getMe: async () => {
    const { data } = await axiosInstance.get('/auth/me/');
    return data;
  },
};

export default authService;
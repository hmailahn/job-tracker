import axios from 'axios';

const client = axios.create({
  baseURL: 'https://job-tracker-production-06bb.up.railway.app/api',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = !!localStorage.getItem('token');
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
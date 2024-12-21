import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/auth/login', formData);
    return response.data;
  },
  register: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/auth/register', formData);
    return response.data;
  },
};

export const profiles = {
  getProfile: async (userId: number) => {
    const response = await api.get(`/profiles/${userId}`);
    return response.data;
  },
  createProfile: async (data: any) => {
    const response = await api.post('/profiles/', data);
    return response.data;
  },
  updateProfile: async (profileId: number, data: any) => {
    const response = await api.put(`/profiles/${profileId}`, data);
    return response.data;
  },
};

export const publications = {
  getUserPublications: async (userId: number) => {
    const response = await api.get(`/publications/user/${userId}`);
    return response.data;
  },
  createPublication: async (data: any) => {
    const response = await api.post('/publications/', data);
    return response.data;
  },
  updatePublication: async (pubId: number, data: any) => {
    const response = await api.put(`/publications/${pubId}`, data);
    return response.data;
  },
  deletePublication: async (pubId: number) => {
    const response = await api.delete(`/publications/${pubId}`);
    return response.data;
  },
};

export const teaching = {
  getUserTeaching: async (userId: number) => {
    const response = await api.get(`/teaching/user/${userId}`);
    return response.data;
  },
  createTeaching: async (data: any) => {
    const response = await api.post('/teaching/', data);
    return response.data;
  },
  updateTeaching: async (teachingId: number, data: any) => {
    const response = await api.put(`/teaching/${teachingId}`, data);
    return response.data;
  },
  deleteTeaching: async (teachingId: number) => {
    const response = await api.delete(`/teaching/${teachingId}`);
    return response.data;
  },
  getCourses: async (teachingId: number) => {
    const response = await api.get(`/teaching/courses/${teachingId}`);
    return response.data;
  },
  createCourse: async (data: any) => {
    const response = await api.post('/teaching/courses/', data);
    return response.data;
  },
  updateCourse: async (courseId: number, data: any) => {
    const response = await api.put(`/teaching/courses/${courseId}`, data);
    return response.data;
  },
  deleteCourse: async (courseId: number) => {
    const response = await api.delete(`/teaching/courses/${courseId}`);
    return response.data;
  },
};
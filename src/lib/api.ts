import { variable } from '@/utils';
import axios from 'axios';

const API_URL = variable.manage_url;

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
  deleteUser: async (userId: number) => {
    const response = await api.delete(`/users/${userId}`);
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
  deleteProfile: async (profileId: number) => {
    const response = await api.delete(`/profiles/${profileId}`);
    return response.data;
  },
};

export const publications = {
  getAllPublications: async () => {
    const response = await api.get('/publications/');
    return response.data;
  },
  getOrgPublications: async () => {
    const response = await api.get('/publications/org');
    return response.data;
  },
  getUserPublications: async (userId: number) => {
    const response = await api.get(`/publications/user/${userId}`);
    return response.data;
  },
  getPublication: async (pubId: number) => {
    const response = await api.get(`/publications/${pubId}`);
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
  getTeaching: async (teachingId: number) => {
    const response = await api.get(`/teaching/${teachingId}`);
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

export const organization = {
  // Centers
  getCenters: async () => {
    const response = await api.get('/organization/centers/');
    return response.data;
  },
  getCenter: async (centerId: number) => {
    const response = await api.get(`/organization/centers/${centerId}`);
    return response.data;
  },
  createCenter: async (data: any) => {
    const response = await api.post('/organization/centers/', data);
    return response.data;
  },
  updateCenter: async (centerId: number, data: any) => {
    const response = await api.put(`/organization/centers/${centerId}`, data);
    return response.data;
  },
  deleteCenter: async (centerId: number) => {
    const response = await api.delete(`/organization/centers/${centerId}`);
    return response.data;
  },

  // Partners
  getPartners: async () => {
    const response = await api.get('/organization/partners/');
    return response.data;
  },
  getPartner: async (partnerId: number) => {
    const response = await api.get(`/organization/partners/${partnerId}`);
    return response.data;
  },
  createPartner: async (data: any) => {
    const response = await api.post('/organization/partners/', data);
    return response.data;
  },
  updatePartner: async (partnerId: number, data: any) => {
    const response = await api.put(`/organization/partners/${partnerId}`, data);
    return response.data;
  },
  deletePartner: async (partnerId: number) => {
    const response = await api.delete(`/organization/partners/${partnerId}`);
    return response.data;
  },

  // Careers
  getCareers: async () => {
    const response = await api.get('/organization/careers/');
    return response.data;
  },
  getCareer: async (careerId: number) => {
    const response = await api.get(`/organization/careers/${careerId}`);
    return response.data;
  },
  createCareer: async (data: any) => {
    const response = await api.post('/organization/careers/', data);
    return response.data;
  },
  updateCareer: async (careerId: number, data: any) => {
    const response = await api.put(`/organization/careers/${careerId}`, data);
    return response.data;
  },
  deleteCareer: async (careerId: number) => {
    const response = await api.delete(`/organization/careers/${careerId}`);
    return response.data;
  },
}
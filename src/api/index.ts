import axios from 'axios';
import { Publication, PublicationFormData, BioSection, TeachingExperience, Course } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicationsAPI = {
  getAll: async (userId: number): Promise<Publication[]> => {
    try {
      const response = await api.get(`/users/${userId}/publications`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch publications');
    }
  },

  create: async (data: PublicationFormData): Promise<Publication> => {
    try {
      const response = await api.post('/publications', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create publication');
    }
  },

  update: async (id: number, data: Partial<Publication>): Promise<Publication> => {
    try {
      const response = await api.patch(`/publications/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update publication');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/publications/${id}`);
    } catch (error) {
      throw new Error('Failed to delete publication');
    }
  },
};

export const bioSectionsAPI = {
  getAll: async (userId: number): Promise<BioSection[]> => {
    try {
      const response = await api.get(`/users/${userId}/bio-sections`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bio sections');
    }
  },

  create: async (data: Omit<BioSection, 'id'>): Promise<BioSection> => {
    try {
      const response = await api.post('/bio-sections', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create bio section');
    }
  },

  update: async (id: number, data: Partial<BioSection>): Promise<BioSection> => {
    try {
      const response = await api.patch(`/bio-sections/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update bio section');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/bio-sections/${id}`);
    } catch (error) {
      throw new Error('Failed to delete bio section');
    }
  },
};

export const teachingAPI = {
  getAll: async (userId: number): Promise<TeachingExperience[]> => {
    try {
      const response = await api.get(`/users/${userId}/teaching`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch teaching experiences');
    }
  },

  create: async (data: Omit<TeachingExperience, 'id'>): Promise<TeachingExperience> => {
    try {
      const response = await api.post('/teaching', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create teaching experience');
    }
  },

  update: async (id: number, data: Partial<TeachingExperience>): Promise<TeachingExperience> => {
    try {
      const response = await api.patch(`/teaching/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update teaching experience');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/teaching/${id}`);
    } catch (error) {
      throw new Error('Failed to delete teaching experience');
    }
  },
};

export const coursesAPI = {
  create: async (data: Omit<Course, 'id'>): Promise<Course> => {
    try {
      const response = await api.post('/courses', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create course');
    }
  },

  update: async (id: number, data: Partial<Course>): Promise<Course> => {
    try {
      const response = await api.patch(`/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update course');
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/courses/${id}`);
    } catch (error) {
      throw new Error('Failed to delete course');
    }
  },
};
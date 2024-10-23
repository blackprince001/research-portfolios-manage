import React from 'react';
import { Course } from '../types';

interface CourseFormProps {
  onSubmit: (course: Omit<Course, 'id' | 'teachingExperienceId'>) => void;
}

export function CourseForm({ onSubmit }: CourseFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
          Course Name *
        </label>
        <input
          type="text"
          id="courseName"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="courseDescription"
          name="description"
          rows={2}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-secondary w-full"
        >
          Add Course
        </button>
      </div>
    </form>
  );
}
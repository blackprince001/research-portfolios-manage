import React from 'react';
import { TeachingExperience, Course } from '../../types';
import { CourseForm } from '../CourseForm';

interface TeachingFormProps {
  teaching?: TeachingExperience | null;
  onSubmit: (data: Partial<TeachingExperience>) => void;
  onCancel: () => void;
}

export function TeachingForm({ teaching, onSubmit, onCancel }: TeachingFormProps) {
  const [formData, setFormData] = React.useState({
    institution: teaching?.institution || '',
    position: teaching?.position || '',
    description: teaching?.description || '',
    startDate: teaching?.startDate || '',
    endDate: teaching?.endDate || '',
    courses: teaching?.courses || [],
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
  };

  const handleAddCourse = (course: Omit<Course, 'id' | 'teachingExperienceId'>) => {
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...course, id: Date.now(), teachingExperienceId: teaching?.id || 0 }],
    }));
  };

  const handleRemoveCourse = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
          Institution *
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          required
          value={formData.institution}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
          Position *
        </label>
        <input
          type="text"
          id="position"
          name="position"
          required
          value={formData.position}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Courses</h3>
        <CourseForm onSubmit={handleAddCourse} />
        
        <div className="mt-4 space-y-2">
          {formData.courses.map((course, index) => (
            <div key={course.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div>
                <h4 className="font-medium">{course.name}</h4>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCourse(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {teaching ? 'Update' : 'Create'} Teaching Experience
        </button>
      </div>
    </form>
  );
}
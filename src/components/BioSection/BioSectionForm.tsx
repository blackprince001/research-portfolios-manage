import React from 'react';
import { BioSection } from '../../types';

interface BioSectionFormProps {
  bioSection?: BioSection | null;
  onSubmit: (data: Partial<BioSection>) => void;
  onCancel: () => void;
}

export function BioSectionForm({ bioSection, onSubmit, onCancel }: BioSectionFormProps) {
  const [formData, setFormData] = React.useState({
    title: bioSection?.title || '',
    content: bioSection?.content || '',
    order: bioSection?.order || 0,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={4}
          value={formData.content}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Order *
        </label>
        <input
          type="number"
          id="order"
          name="order"
          required
          min="0"
          value={formData.order}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
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
          {bioSection ? 'Update' : 'Create'} Bio Section
        </button>
      </div>
    </form>
  );
}
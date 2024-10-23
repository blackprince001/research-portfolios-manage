import React from 'react';
import { Publication, PublicationType } from '../types';

interface PublicationFormProps {
  publication?: Publication | null;
  onSubmit: (data: Partial<Publication>) => void;
  onCancel: () => void;
}

export function PublicationForm({ publication, onSubmit, onCancel }: PublicationFormProps) {
  const [formData, setFormData] = React.useState({
    title: publication?.title || '',
    abstract: publication?.abstract || '',
    authors: publication?.authors || '',
    publicationType: publication?.publicationType || 'published',
    journal: publication?.journal || '',
    conference: publication?.conference || '',
    year: publication?.year || new Date().getFullYear(),
    doi: publication?.doi || '',
    url: publication?.url || '',
    pdfLink: publication?.pdfLink || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      <div className="space-y-4">
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
          <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">
            Abstract *
          </label>
          <textarea
            id="abstract"
            name="abstract"
            required
            rows={4}
            value={formData.abstract}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">
            Authors *
          </label>
          <input
            type="text"
            id="authors"
            name="authors"
            required
            value={formData.authors}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="publicationType" className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <select
              id="publicationType"
              name="publicationType"
              required
              value={formData.publicationType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="published">Published</option>
              <option value="working_paper">Working Paper</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              required
              min="1900"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="journal" className="block text-sm font-medium text-gray-700">
              Journal
            </label>
            <input
              type="text"
              id="journal"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="conference" className="block text-sm font-medium text-gray-700">
              Conference
            </label>
            <input
              type="text"
              id="conference"
              name="conference"
              value={formData.conference}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="doi" className="block text-sm font-medium text-gray-700">
              DOI
            </label>
            <input
              type="text"
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700">
            PDF Link
          </label>
          <input
            type="url"
            id="pdfLink"
            name="pdfLink"
            value={formData.pdfLink}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {publication ? 'Update' : 'Create'} Publication
        </button>
      </div>
    </form>
  );
}
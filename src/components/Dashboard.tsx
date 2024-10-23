import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Publication } from '../types';
import { publicationsAPI } from '../api';
import { PublicationForm } from './PublicationForm';
import { PublicationGrid } from './PublicationGrid';
import { GraduationCap, Plus } from 'lucide-react';

export function Dashboard() {
  const [selectedPublication, setSelectedPublication] = React.useState<Publication | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: publications, isLoading } = useQuery<Publication[], Error>(
    'publications',
    () => publicationsAPI.getAll(1)
  );

  const createMutation = useMutation<
    Publication,
    Error,
    Omit<Publication, 'id'>
  >(
    (data) => publicationsAPI.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('publications');
        toast.success('Publication created successfully');
        setIsFormOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to create publication: ${error.message}`);
      },
    }
  );

  const updateMutation = useMutation<
    Publication,
    Error,
    { id: number; data: Partial<Publication> }
  >(
    ({ id, data }) => publicationsAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('publications');
        toast.success('Publication updated successfully');
        setSelectedPublication(null);
        setIsFormOpen(false);
      },
      onError: (error) => {
        toast.error(`Failed to update publication: ${error.message}`);
      },
    }
  );

  const deleteMutation = useMutation<void, Error, number>(
    (id) => publicationsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('publications');
        toast.success('Publication deleted successfully');
      },
      onError: (error) => {
        toast.error(`Failed to delete publication: ${error.message}`);
      },
    }
  );

  const handleSubmit = async (data: Partial<Publication>) => {
    if (selectedPublication) {
      await updateMutation.mutate({ id: selectedPublication.id, data });
    } else {
      await createMutation.mutate(data as Omit<Publication, 'id'>);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Academic Profile Manager</h1>
          </div>
          <button
            onClick={() => {
              setSelectedPublication(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-8">
            <PublicationForm
              publication={selectedPublication}
              onSubmit={handleSubmit}
              onCancel={() => {
                setSelectedPublication(null);
                setIsFormOpen(false);
              }}
            />
          </div>
        )}

        <PublicationGrid
          publications={publications || []}
          isLoading={isLoading}
          onEdit={(publication) => {
            setSelectedPublication(publication);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
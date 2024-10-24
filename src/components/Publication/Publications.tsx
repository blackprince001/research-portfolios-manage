import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { publicationsAPI } from '../../api';
import { Publication } from '../../types';
import { PublicationForm } from './PublicationForm';
import { PublicationList } from './PublicationList';

export function Publications() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedPublication, setSelectedPublication] = React.useState<Publication | null>(null);
  const queryClient = useQueryClient();

  const { data: publications, isLoading } = useQuery('publications', () =>
    publicationsAPI.getAll(1)
  );

  const createMutation = useMutation(publicationsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('publications');
      toast.success('Publication created successfully');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<Publication> }) =>
      publicationsAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('publications');
        toast.success('Publication updated successfully');
        setSelectedPublication(null);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  const deleteMutation = useMutation(publicationsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('publications');
      toast.success('Publication deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: Partial<Publication>) => {
    if (selectedPublication) {
      updateMutation.mutate({ id: selectedPublication.id, data });
    } else {
      createMutation.mutate(data as Omit<Publication, 'id'>);
    }
  };

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedPublication(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Publication
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6">
          <PublicationForm
            publication={selectedPublication}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      <PublicationList
        publications={publications || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
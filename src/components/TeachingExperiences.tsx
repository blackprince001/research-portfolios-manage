import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { teachingAPI } from '../api';
import { TeachingExperience } from '../types';
import { TeachingForm } from './TeachingForm';
import { TeachingList } from './TeachingList';

export function TeachingExperiences() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedTeaching, setSelectedTeaching] = React.useState<TeachingExperience | null>(null);
  const queryClient = useQueryClient();

  const { data: teaching, isLoading } = useQuery('teaching', () =>
    teachingAPI.getAll(1)
  );

  const createMutation = useMutation(teachingAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('teaching');
      toast.success('Teaching experience created successfully');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<TeachingExperience> }) =>
      teachingAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('teaching');
        toast.success('Teaching experience updated successfully');
        setSelectedTeaching(null);
        setIsFormOpen(false);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  const deleteMutation = useMutation(teachingAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('teaching');
      toast.success('Teaching experience deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: Partial<TeachingExperience>) => {
    if (selectedTeaching) {
      updateMutation.mutate({ id: selectedTeaching.id, data });
    } else {
      createMutation.mutate(data as Omit<TeachingExperience, 'id'>);
    }
  };

  const handleEdit = (teaching: TeachingExperience) => {
    setSelectedTeaching(teaching);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this teaching experience?')) {
      deleteMutation.mutate(id);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Teaching Experience</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Teaching Experience
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6">
          <TeachingForm
            teaching={selectedTeaching}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTeaching(null);
            }}
          />
        </div>
      )}

      <TeachingList
        teaching={teaching || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
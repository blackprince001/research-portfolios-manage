import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { bioSectionsAPI } from '../../api';
import { BioSection } from '../../types';
import { BioSectionForm } from './BioSectionForm';
import { BioSectionList } from './BioSectionList';

export function BioSections() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedBioSection, setSelectedBioSection] = React.useState<BioSection | null>(null);
  const queryClient = useQueryClient();

  const { data: bioSections, isLoading } = useQuery('bioSections', () =>
    bioSectionsAPI.getAll(1)
  );

  const createMutation = useMutation(bioSectionsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('bioSections');
      toast.success('Bio section created successfully');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: Partial<BioSection> }) =>
      bioSectionsAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bioSections');
        toast.success('Bio section updated successfully');
        setSelectedBioSection(null);
        setIsFormOpen(false);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );

  const deleteMutation = useMutation(bioSectionsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('bioSections');
      toast.success('Bio section deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: Partial<BioSection>) => {
    if (selectedBioSection) {
      updateMutation.mutate({ id: selectedBioSection.id, data });
    } else {
      createMutation.mutate(data as Omit<BioSection, 'id'>);
    }
  };

  const handleEdit = (bioSection: BioSection) => {
    setSelectedBioSection(bioSection);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this bio section?')) {
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
        <h2 className="text-2xl font-bold text-gray-900">Bio Sections</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Bio Section
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow p-6">
          <BioSectionForm
            bioSection={selectedBioSection}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedBioSection(null);
            }}
          />
        </div>
      )}

      <BioSectionList
        bioSections={bioSections || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
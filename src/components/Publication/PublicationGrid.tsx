import React from 'react';
import { Publication } from '../../types';
import { PublicationCard } from './PublicationCard';

interface PublicationGridProps {
  publications: Publication[];
  isLoading: boolean;
  onEdit: (publication: Publication) => void;
  onDelete: (id: number) => void;
}

export function PublicationGrid({ 
  publications, 
  isLoading, 
  onEdit, 
  onDelete 
}: PublicationGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publications.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
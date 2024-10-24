import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Publication } from '../../types';

interface PublicationListProps {
  publications: Publication[];
  onEdit: (publication: Publication) => void;
  onDelete: (id: number) => void;
}

export function PublicationList({ publications, onEdit, onDelete }: PublicationListProps) {
  if (publications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No publications found. Add your first publication!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <ul className="divide-y divide-gray-200">
        {publications.map((publication) => (
          <li key={publication.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{publication.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{publication.authors}</p>
                <p className="mt-2 text-sm text-gray-500">{publication.abstract}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{publication.year}</span>
                  <span>{publication.publicationType.replace('_', ' ')}</span>
                  {publication.journal && <span>{publication.journal}</span>}
                  {publication.conference && <span>{publication.conference}</span>}
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => onEdit(publication)}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                  aria-label="Edit publication"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(publication.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  aria-label="Delete publication"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
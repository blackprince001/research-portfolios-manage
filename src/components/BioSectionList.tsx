import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { BioSection } from '../types';

interface BioSectionListProps {
  bioSections: BioSection[];
  onEdit: (bioSection: BioSection) => void;
  onDelete: (id: number) => void;
}

export function BioSectionList({ bioSections, onEdit, onDelete }: BioSectionListProps) {
  const sortedBioSections = [...bioSections].sort((a, b) => a.order - b.order);

  if (bioSections.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No bio sections found. Add your first bio section!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <ul className="divide-y divide-gray-200">
        {sortedBioSections.map((bioSection) => (
          <li key={bioSection.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{bioSection.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{bioSection.content}</p>
                <p className="mt-1 text-xs text-gray-400">Order: {bioSection.order}</p>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => onEdit(bioSection)}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                  aria-label="Edit bio section"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(bioSection.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  aria-label="Delete bio section"
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
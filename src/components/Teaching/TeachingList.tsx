import React from 'react';
import { Edit2, Trash2, Book } from 'lucide-react';
import { TeachingExperience } from '../../types';

interface TeachingListProps {
  teaching: TeachingExperience[];
  onEdit: (teaching: TeachingExperience) => void;
  onDelete: (id: number) => void;
}

export function TeachingList({ teaching, onEdit, onDelete }: TeachingListProps) {
  if (teaching.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No teaching experiences found. Add your first teaching experience!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <ul className="divide-y divide-gray-200">
        {teaching.map((experience) => (
          <li key={experience.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{experience.position}</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">{experience.institution}</p>
                <p className="mt-2 text-sm text-gray-500">{experience.description}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Courses:</h4>
                  {/* <ul className="space-y-2"> <boltAction type="file" filePath="src/components/TeachingList.tsx"> */}
                  <ul className="space-y-2">
                    {experience.courses.map((course) => (
                      <li key={course.id} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Book className="h-4 w-4 text-indigo-500" />
                        <span>{course.name}</span>
                        {course.description && (
                          <span className="text-gray-400">- {course.description}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{experience.startDate}</span>
                  {experience.endDate ? (
                    <span>to {experience.endDate}</span>
                  ) : (
                    <span>to Present</span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={() => onEdit(experience)}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                  aria-label="Edit teaching experience"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(experience.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  aria-label="Delete teaching experience"
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
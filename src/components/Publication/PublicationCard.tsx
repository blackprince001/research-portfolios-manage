import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';
import { Publication } from '../../types';
import { Book, Pencil, Trash2, FileText } from 'lucide-react';

interface PublicationCardProps {
  publication: Publication;
  onEdit: (publication: Publication) => void;
  onDelete: (id: number) => void;
}

export function PublicationCard({ 
  publication, 
  onEdit, 
  onDelete 
}: PublicationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Book className="h-5 w-5 text-indigo-600 flex-shrink-0" />
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{publication.title}</h3>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(publication)}
            className="text-gray-400 hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(publication.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">{publication.authors}</p>
      <p className="mt-1 text-sm text-gray-500">
        {publication.journal || publication.conference}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {publication.keywords?.map((keyword: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
          >
            {keyword}
          </span>
        ))}
      </div>

      {publication.pdfLink && (
        <a
          href={publication.pdfLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          <FileText className="h-4 w-4 mr-1" />
          View PDF
        </a>
      )}
    </div>
  );
}
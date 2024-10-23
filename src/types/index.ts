export type PublicationType = 'published' | 'working_paper' | 'unpublished';

export interface Publication {
  id: number;
  userId: number;
  title: string;
  abstract: string;
  authors: string;
  publicationType: PublicationType;
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
  citationCount?: number;
  pdfLink?: string;
  currentStatus?: string;
  lastUpdated?: string;
}

export interface PublicationFormData extends Omit<Publication, 'id' | 'userId'> {}

export interface BioSection {
  id: number;
  userId: number;
  title: string;
  content: string;
  order: number;
}

export interface TeachingExperience {
  id: number;
  userId: number;
  institution: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  courses: Course[];
}

export interface Course {
  id: number;
  teachingExperienceId: number;
  name: string;
  description?: string;
}
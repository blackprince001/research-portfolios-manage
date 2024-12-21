export interface Publication {
  id: number;
  user_id: number;
  title: string;
  abstract: string;
  authors: string;
  publication_type: string;
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
  pdf_link?: string;
}

export interface TeachingExperience {
  id: number;
  user_id: number;
  institution: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  courses: Course[];
}

export interface Course {
  id: number;
  teaching_id: number;
  name: string;
  description?: string;
}

export interface Profile {
  id: number;
  user_id: number;
  home_content?: string[];
  projects?: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  teachings?: string[];
  cv_link?: string;
}
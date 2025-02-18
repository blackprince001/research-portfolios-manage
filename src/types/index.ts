// User types
export interface User {
  id: number;
  username: string;
}


export interface Profile {
  id: number;
  user_id: string;
  name: string;
  org_role: 'advisory' | 'team' | 'fellow';
  home_content?: string[];
  cv_link?: string;
  profile_image?: string;
  projects: {
    title: string;
    description: string;
    url: string;
  }[];
  teachings: string[];
}

// Publication types
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
  is_org: boolean;
  poster?: string;
  paper_summary?: string;
  url?: string;
  pdf_link?: string;
}

// Teaching types
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

// Organization types
export interface OrganizationCenter {
  id: number;
  center_name: string;
  location: string;
}

export interface OrganizationPartner {
  id: number;
  name: string;
  socials: string[];
  logo_url: string;
}

export interface OrganizationCareer {
  id: number;
  title: string;
  description: string;
  type: string;
  is_closed: boolean;
}

// Error types
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
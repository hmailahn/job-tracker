export type ApplicationStatus =
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface Application {
  id?: number;
  company: string;
  role: string;
  jobUrl?: string;
  status: ApplicationStatus;
  appliedDate: string;
  salaryMin?: number;
  salaryMax?: number;
  notes?: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export const STATUS_ORDER: ApplicationStatus[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'
];
/* src/types/index.ts */

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  status: 'PENDING' | 'REVIEWED' | 'ARCHIVED';
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'BACKLOG' | 'IN_PROGRESS' | 'COMPLETED';
  assignee: string;
  scheduled_date?: string;
  phases?: string[];
}

export interface AudioLog {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  duration: string;
  audio_url: string;
  created_at: string;
}
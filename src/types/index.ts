/* src/types/index.ts */

export type Task = {
  id: string;
  title: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: 'Live' | 'In Dev' | 'Pending';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  dueDate: string;
  tasks: Task[];
};

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  date?: string;
  created_at?: string;
  status: 'Pending' | 'Invited' | 'Onboarded';
  name?: string;
  phone?: string;
  sms_consent?: boolean;
}

export type AudioLog = {
  id: string;
  title: string;
  duration: string;
  date: string;
  description: string;
  audioUrl: string; 
};

export interface DayFlow {
  day: string;
  status: string;
  date: string;
  lifeEvents: string[];
  tasks: any[];
}
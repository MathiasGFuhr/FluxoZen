
export interface Assignee {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  content: string;
  assignee?: Assignee;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Project {
  name: string;
  logo: string | null;
  members: Assignee[];
}

export type Page = 'board' | 'settings' | 'help';

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export type TaskStatus = 'todo' | 'inprogress' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: {
    name: string;
    initials: string;
  };
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
}

export interface Filters {
  search: string;
  assignee: string;
  priority: TaskPriority | '';
  tags: string[];
  createdAt: string;
}

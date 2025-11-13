import { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { generateTaskId, generateInitials } from '@/utils/taskHelpers';

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Setup project repository',
    description: 'Initialize Git repository and setup project structure',
    status: 'completed',
    assignee: { name: 'John Doe', initials: 'JD' },
    priority: 'high',
    tags: ['setup', 'infrastructure'],
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    title: 'Design UI mockups',
    description: 'Create high-fidelity mockups for all main screens',
    status: 'inprogress',
    assignee: { name: 'Sarah Smith', initials: 'SS' },
    priority: 'high',
    tags: ['design', 'ui'],
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 3,
    title: 'Implement authentication',
    description: 'Add user login and registration functionality',
    status: 'todo',
    assignee: { name: 'Mike Johnson', initials: 'MJ' },
    priority: 'medium',
    tags: ['backend', 'security'],
    createdAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: 4,
    title: 'Write API documentation',
    description: 'Document all API endpoints with examples',
    status: 'todo',
    assignee: { name: 'Emily Davis', initials: 'ED' },
    priority: 'low',
    tags: ['documentation', 'api'],
    createdAt: new Date('2024-01-18').toISOString(),
  },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateTaskId(tasks.map((t) => t.id)),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const moveTask = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  return {
    tasks,
    addTask,
    editTask,
    deleteTask,
    moveTask,
  };
};

import { Task, TaskPriority, Filters, TaskStatus } from '@/types/task';

/**
 * Filter tasks based on multiple criteria
 */
export const filterTasks = (tasks: Task[], filters: Filters): Task[] => {
  return tasks.filter((task) => {
    const matchesSearch =
      !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesAssignee =
      !filters.assignee || task.assignee.name === filters.assignee;

    const matchesPriority =
      !filters.priority || task.priority === filters.priority;

    const matchesTags =
      filters.tags.length === 0 ||
      filters.tags.some((tag) => task.tags.includes(tag));

    const matchesDate =
      !filters.createdAt ||
      new Date(task.createdAt).toDateString() === new Date(filters.createdAt).toDateString();

    return matchesSearch && matchesAssignee && matchesPriority && matchesTags && matchesDate;
  });
};

/**
 * Sort tasks by priority and creation date
 * Priority: high > medium > low
 * Then by creation date: newest first
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
  
  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

/**
 * Get tasks filtered by status
 */
export const getTasksByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task) => task.status === status);
};

/**
 * Extract unique assignee names from tasks
 */
export const getUniqueAssignees = (tasks: Task[]): string[] => {
  return Array.from(new Set(tasks.map((task) => task.assignee.name)));
};

/**
 * Extract all unique tags from tasks
 */
export const getUniqueTags = (tasks: Task[]): string[] => {
  return Array.from(new Set(tasks.flatMap((task) => task.tags)));
};

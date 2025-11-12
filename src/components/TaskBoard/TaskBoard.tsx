import { useState, useMemo } from 'react';
import { Task, TaskStatus, Filters } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { AddTaskModal } from './AddTaskModal';
import { SearchFilters } from './SearchFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    assignee: '',
    priority: '',
    tags: [],
    createdAt: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.max(...tasks.map((t) => t.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleMoveTask = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
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

    // Sort by priority (high > medium > low) then by creation date (newest first)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [tasks, filters]);

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredAndSortedTasks.filter((task) => task.status === status);
  };

  const allAssignees = Array.from(new Set(tasks.map((task) => task.assignee.name)));
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)));

  return (
    <div className="min-h-screen bg-board p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Board Manager</h1>
            <p className="text-muted-foreground">Organize and track your tasks efficiently</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </Button>
        </div>

        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          assignees={allAssignees}
          tags={allTags}
          isVisible={filtersVisible}
          onToggle={() => setFiltersVisible(!filtersVisible)}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={getTasksByStatus('todo')}
            onMoveTask={handleMoveTask}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            status="inprogress"
            tasks={getTasksByStatus('inprogress')}
            onMoveTask={handleMoveTask}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Completed"
            status="completed"
            tasks={getTasksByStatus('completed')}
            onMoveTask={handleMoveTask}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        editingTask={editingTask}
        availableTags={allTags}
      />
    </div>
  );
};

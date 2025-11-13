import { Task } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { AddTaskModal } from './AddTaskModal';
import { SearchFilters } from './SearchFilters';
import { TaskBoardHeader } from './TaskBoardHeader';
import { useTasks } from '@/hooks/useTasks';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { useTaskModal } from '@/hooks/useTaskModal';
import { getTasksByStatus, getUniqueAssignees, getUniqueTags } from '@/utils/taskUtils';

export const TaskBoard = () => {
  // Custom hooks for separation of concerns
  const { tasks, addTask, editTask, deleteTask, moveTask } = useTasks();
  const { filters, setFilters, filtersVisible, toggleFiltersVisible, filteredAndSortedTasks } = useTaskFilters(tasks);
  const { isModalOpen, editingTask, openAddModal, openEditModal, closeModal } = useTaskModal();

  // Handlers
  const handleSubmit = (task: any) => {
    if (editingTask) {
      editTask(task);
    } else {
      addTask(task);
    }
    closeModal();
  };

  // Derived data
  const allAssignees = getUniqueAssignees(tasks);
  const allTags = getUniqueTags(tasks);

  return (
    <div className="min-h-screen bg-board p-6">
      <div className="mx-auto max-w-7xl">
        <TaskBoardHeader onAddTask={openAddModal} />

        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          assignees={allAssignees}
          tags={allTags}
          isVisible={filtersVisible}
          onToggle={toggleFiltersVisible}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={getTasksByStatus(filteredAndSortedTasks, 'todo')}
            onMoveTask={moveTask}
            onEditTask={openEditModal}
            onDeleteTask={deleteTask}
          />
          <TaskColumn
            title="In Progress"
            status="inprogress"
            tasks={getTasksByStatus(filteredAndSortedTasks, 'inprogress')}
            onMoveTask={moveTask}
            onEditTask={openEditModal}
            onDeleteTask={deleteTask}
          />
          <TaskColumn
            title="Completed"
            status="completed"
            tasks={getTasksByStatus(filteredAndSortedTasks, 'completed')}
            onMoveTask={moveTask}
            onEditTask={openEditModal}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTask={editingTask}
        availableTags={allTags}
      />
    </div>
  );
};

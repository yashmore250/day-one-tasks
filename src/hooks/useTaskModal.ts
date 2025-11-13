import { useState } from 'react';
import { Task } from '@/types/task';

export const useTaskModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return {
    isModalOpen,
    editingTask,
    openAddModal,
    openEditModal,
    closeModal,
  };
};

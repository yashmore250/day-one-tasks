import { useState, useMemo } from 'react';
import { Task, Filters } from '@/types/task';
import { filterTasks, sortTasks } from '@/utils/taskUtils';

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    assignee: '',
    priority: '',
    tags: [],
    createdAt: '',
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered);
  }, [tasks, filters]);

  const toggleFiltersVisible = () => {
    setFiltersVisible(!filtersVisible);
  };

  return {
    filters,
    setFilters,
    filtersVisible,
    toggleFiltersVisible,
    filteredAndSortedTasks,
  };
};

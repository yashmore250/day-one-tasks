import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskBoardHeaderProps {
  onAddTask: () => void;
}

export const TaskBoardHeader = ({ onAddTask }: TaskBoardHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Task Board Manager</h1>
        <p className="text-muted-foreground">Organize and track your tasks efficiently</p>
      </div>
      <Button onClick={onAddTask} size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Add Task
      </Button>
    </div>
  );
};

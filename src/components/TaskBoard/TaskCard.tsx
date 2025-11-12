import { Task, TaskStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, MoveRight } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onMoveTask: (taskId: number, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const priorityColors = {
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
};

export const TaskCard = ({ task, onMoveTask, onEditTask, onDeleteTask }: TaskCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id.toString());
  };

  const getNextStatus = (): TaskStatus | null => {
    if (task.status === 'todo') return 'inprogress';
    if (task.status === 'inprogress') return 'completed';
    return null;
  };

  const getNextStatusLabel = () => {
    const next = getNextStatus();
    if (next === 'inprogress') return 'In Progress';
    if (next === 'completed') return 'Completed';
    return '';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="cursor-move rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="mb-1 font-semibold text-card-foreground">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditTask(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteTask(task.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-tag-bg px-2 py-1 text-xs font-medium text-tag-text"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {task.assignee.initials}
          </div>
          <div className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`} />
        </div>

        {getNextStatus() && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveTask(task.id, getNextStatus()!)}
          >
            <MoveRight className="mr-1 h-4 w-4" />
            {getNextStatusLabel()}
          </Button>
        )}
      </div>
    </div>
  );
};

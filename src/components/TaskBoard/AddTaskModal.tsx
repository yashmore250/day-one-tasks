import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  editingTask: Task | null;
  availableTags: string[];
}

const defaultTags = ['frontend', 'backend', 'design', 'ui', 'api', 'bug', 'feature', 'documentation'];

export const AddTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingTask,
  availableTags,
}: AddTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeName: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    selectedTags: [] as string[],
  });

  const allTags = Array.from(new Set([...defaultTags, ...availableTags]));

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        assigneeName: editingTask.assignee.name,
        priority: editingTask.priority,
        status: editingTask.status,
        selectedTags: editingTask.tags,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigneeName: '',
        priority: 'medium',
        status: 'todo',
        selectedTags: [],
      });
    }
  }, [editingTask, isOpen]);

  const handleToggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.assigneeName.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const initials = formData.assigneeName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const taskData = {
      ...(editingTask && { id: editingTask.id, createdAt: editingTask.createdAt }),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      assignee: {
        name: formData.assigneeName,
        initials,
      },
      priority: formData.priority,
      tags: formData.selectedTags,
    };

    onSubmit(taskData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {editingTask ? 'Update task details below' : 'Fill in the details to create a new task'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignee">Assignee *</Label>
              <Input
                id="assignee"
                value={formData.assigneeName}
                onChange={(e) => setFormData({ ...formData, assigneeName: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value as TaskPriority })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {editingTask && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as TaskStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Tags *</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    formData.selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-tag-bg text-tag-text hover:bg-tag-bg/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

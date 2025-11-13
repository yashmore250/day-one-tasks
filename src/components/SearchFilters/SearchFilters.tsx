import { Filters, TaskPriority } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  assignees: string[];
  tags: string[];
  isVisible: boolean;
  onToggle: () => void;
}

export const SearchFilters = ({
  filters,
  onFiltersChange,
  assignees,
  tags,
  isVisible,
  onToggle,
}: SearchFiltersProps) => {
  const handleToggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      assignee: '',
      priority: '',
      tags: [],
      createdAt: '',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.assignee ||
    filters.priority ||
    filters.tags.length > 0 ||
    filters.createdAt;

  return (
    <div className="rounded-lg border border-border bg-[hsl(var(--filter-bg))] shadow-lg transition-all duration-300">
      {/* Compact Search Bar - Always Visible */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-9 bg-input border-border text-foreground"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80"
          >
            <Filter className="h-4 w-4" />
            Filters
            {isVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-border px-4 pb-4">
          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={filters.assignee || 'all'}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, assignee: value === 'all' ? '' : value })
            }
          >
            <SelectTrigger id="assignee">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              onFiltersChange({ 
                ...filters, 
                priority: value === 'all' ? '' : (value as TaskPriority)
              })
            }
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="createdAt">Created Date</Label>
          <Input
            id="createdAt"
            type="date"
            value={filters.createdAt}
            onChange={(e) => onFiltersChange({ ...filters, createdAt: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <Label>Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  filters.tags.includes(tag)
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-tag-bg text-tag-text hover:bg-tag-bg/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

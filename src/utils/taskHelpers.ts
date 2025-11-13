/**
 * Generate initials from a full name
 * @param name - Full name of the person
 * @returns Uppercase initials (max 2 characters)
 */
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Generate a unique ID for a new task
 * @param existingIds - Array of existing task IDs
 * @returns New unique ID
 */
export const generateTaskId = (existingIds: number[]): number => {
  return Math.max(...existingIds, 0) + 1;
};

export type TaskStatus = 'NOT_ASSIGNED' | 'COMPLETED' | 'DISCARDED' | 'REVIEWING' | 'IN_PROGRESS';
export type SubTaskStatus = 'COMPLETED' | 'ASSIGNED' | 'NOT_ASSIGNED';

export const TaskStatusColors: Record<TaskStatus, string> = {
  IN_PROGRESS: 'orange',
  NOT_ASSIGNED: 'gray',
  COMPLETED: 'green',
  DISCARDED: 'purple',
  REVIEWING: 'blue',
};
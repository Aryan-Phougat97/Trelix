import { useTable } from 'tinybase/ui-react';
import { store } from '../store';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export const useTasks = () => {
  const tasksTable = useTable('tasks');

  const tasks = Object.entries(tasksTable).map(([id, data]) => ({
    id,
    ...(data as object),
  })) as unknown as Task[];

  tasks.sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.completed ? 1 : -1;
  });

  const addTask = (taskData: Omit<Task, "id" | "completed" | "createdAt">) => {
    store.addRow('tasks', {
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      store.setPartialRow('tasks', id, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : undefined
      });
    }
  };

  const deleteTask = (id: string) => {
    store.delRow('tasks', id);
  };

  return { tasks, addTask, toggleTask, deleteTask };
};
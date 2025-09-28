import { useState, useEffect } from 'react';
import { taskController } from '../utils';

// Custom Hook - Encapsulates task-related logic and state
const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = taskController.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = (taskData) => {
    try {
      const newTask = taskController.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  const updateTask = (id, updates) => {
    try {
      const updatedTask = taskController.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
      }
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTask = (id) => {
    try {
      const deletedTask = taskController.deleteTask(id);
      if (deletedTask) {
        setTasks(prev => prev.filter(task => task.id !== id));
      }
      return deletedTask;
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Custom hook returns an object with state and functions
  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus
  };
};

export default useTasks;
import { taskController } from '../utils';

// Simple EventEmitter implementation for browser
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  removeListener(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Flux Store - Centralized state management
class TaskStore extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
    this.isLoading = false;
    this.error = null;
    this.filters = {
      status: '',
      assignee: '',
      priority: '',
      search: ''
    };
    
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.error = null;
    this.emit('change');
    
    try {
      this.tasks = taskController.getAllTasks();
      this.isLoading = false;
    } catch (error) {
      this.error = 'Failed to load tasks';
      this.isLoading = false;
    }
    
    this.emit('change');
  }

  getTasks() {
    return this.tasks;
  }

  getTask(id) {
    return this.tasks.find(task => task.id === id);
  }

  getFilteredTasks() {
    return this.tasks.filter(task => {
      if (this.filters.status && task.status !== this.filters.status) return false;
      if (this.filters.assignee && task.assignee !== this.filters.assignee) return false;
      if (this.filters.priority && task.priority !== this.filters.priority) return false;
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        return task.title.toLowerCase().includes(searchLower) ||
               task.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }

  getTaskStatistics() {
    const stats = {
      total: this.tasks.length,
      todo: this.getTasksByStatus('todo').length,
      inProgress: this.getTasksByStatus('in-progress').length,
      completed: this.getTasksByStatus('completed').length,
      overdue: this.tasks.filter(task => task.isOverdue()).length
    };
    
    stats.completionRate = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;
    
    return stats;
  }

  getLoadingState() {
    return this.isLoading;
  }

  getError() {
    return this.error;
  }

  getFilters() {
    return { ...this.filters };
  }

  // Flux Action Handlers - Called by dispatcher
  handleAction(action) {
    switch (action.type) {
      case 'CREATE_TASK':
        this.createTask(action.data);
        break;
        
      case 'UPDATE_TASK':
        this.updateTask(action.id, action.data);
        break;
        
      case 'DELETE_TASK':
        this.deleteTask(action.id);
        break;
        
      case 'SET_FILTERS':
        this.setFilters(action.filters);
        break;
        
      case 'CLEAR_FILTERS':
        this.clearFilters();
        break;
        
      case 'RELOAD_TASKS':
        this.loadTasks();
        break;
        
      default:
        break;
    }
  }

  createTask(taskData) {
    try {
      const newTask = taskController.createTask(taskData);
      this.tasks.push(newTask);
      this.error = null;
    } catch (error) {
      this.error = 'Failed to create task';
      console.error('Store error:', error);
    }
    
    this.emit('change');
  }

  updateTask(id, updates) {
    try {
      const updatedTask = taskController.updateTask(id, updates);
      if (updatedTask) {
        this.tasks = this.tasks.map(task => 
          task.id === id ? updatedTask : task
        );
        this.error = null;
      }
    } catch (error) {
      this.error = 'Failed to update task';
      console.error('Store error:', error);
    }
    
    this.emit('change');
  }

  deleteTask(id) {
    try {
      const deletedTask = taskController.deleteTask(id);
      if (deletedTask) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.error = null;
      }
    } catch (error) {
      this.error = 'Failed to delete task';
      console.error('Store error:', error);
    }
    
    this.emit('change');
  }

  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
    this.emit('change');
  }

  clearFilters() {
    this.filters = {
      status: '',
      assignee: '',
      priority: '',
      search: ''
    };
    this.emit('change');
  }

  addChangeListener(callback) {
    this.on('change', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('change', callback);
  }
}

export default new TaskStore();
import TaskStore from './TaskStore';

// Flux Actions - Action creators that dispatch actions to stores
class TaskActions {
  
  createTask(taskData) {
    if (!taskData.title) {
      throw new Error('Task title is required');
    }
    
    TaskStore.handleAction({
      type: 'CREATE_TASK',
      data: taskData
    });
  }

  updateTask(id, updates) {
    if (!id) {
      throw new Error('Task ID is required');
    }
    
    TaskStore.handleAction({
      type: 'UPDATE_TASK',
      id: id,
      data: updates
    });
  }

  deleteTask(id) {
    if (!id) {
      throw new Error('Task ID is required');
    }
    
    TaskStore.handleAction({
      type: 'DELETE_TASK',
      id: id
    });
  }

  updateTaskStatus(id, status) {
    const validStatuses = ['todo', 'in-progress', 'completed'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid task status');
    }
    
    this.updateTask(id, { status });
  }

  batchUpdateTasks(taskIds, updates) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('Task IDs array is required');
    }
    
    taskIds.forEach(id => {
      this.updateTask(id, updates);
    });
  }

  batchDeleteTasks(taskIds) {
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('Task IDs array is required');
    }
    
    taskIds.forEach(id => {
      this.deleteTask(id);
    });
  }

  setFilters(filters) {
    TaskStore.handleAction({
      type: 'SET_FILTERS',
      filters: filters
    });
  }

  clearFilters() {
    TaskStore.handleAction({
      type: 'CLEAR_FILTERS'
    });
  }

  reloadTasks() {
    TaskStore.handleAction({
      type: 'RELOAD_TASKS'
    });
  }

  searchTasks(searchTerm) {
    this.setFilters({ search: searchTerm });
  }

  filterByStatus(status) {
    this.setFilters({ status: status });
  }

  filterByAssignee(assignee) {
    this.setFilters({ assignee: assignee });
  }

  filterByPriority(priority) {
    this.setFilters({ priority: priority });
  }

  getTaskStatistics() {
    return TaskStore.getTaskStatistics();
  }

  getAllTasks() {
    return TaskStore.getTasks();
  }

  getFilteredTasks() {
    return TaskStore.getFilteredTasks();
  }

  getTaskById(id) {
    return TaskStore.getTask(id);
  }

  getTasksByStatus(status) {
    return TaskStore.getTasksByStatus(status);
  }

  subscribe(callback) {
    TaskStore.addChangeListener(callback);
  }

  unsubscribe(callback) {
    TaskStore.removeChangeListener(callback);
  }
}

export default new TaskActions();
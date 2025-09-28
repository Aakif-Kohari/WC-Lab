/**
 * CONCEPT: MVC - MODEL LAYER
 * Models represent data structure and business logic
 * They define how data should be structured and validated
 */

/**
 * Task Model Class
 * Represents a single task in our system
 */
class Task {
  constructor(title, description = '', assignee = '', priority = 'medium', dueDate = null) {
    this.id = this.generateId();
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.priority = priority;   // 'low', 'medium', 'high'
    this.status = 'todo';       // 'todo', 'in-progress', 'completed'
    this.dueDate = dueDate;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus) {
    const validStatuses = ['todo', 'in-progress', 'completed'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      this.updatedAt = new Date();
      return true;
    }
    return false;
  }

  updateTask(updates) {
    const allowedFields = ['title', 'description', 'assignee', 'priority', 'dueDate'];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        this[key] = updates[key];
      }
    });
    
    this.updatedAt = new Date();
  }

  isOverdue() {
    if (!this.dueDate) return false;
    return new Date() > new Date(this.dueDate) && this.status !== 'completed';
  }

  generateId() {
    return 'task_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  static fromJSON(json) {
    const task = new Task(json.title, json.description, json.assignee, json.priority, json.dueDate);
    task.id = json.id;
    task.status = json.status;
    task.createdAt = new Date(json.createdAt);
    task.updatedAt = new Date(json.updatedAt);
    return task;
  }
}

/**
 * Team Member Model Class
 * Represents a team member who can be assigned tasks
 */
class TeamMember {
  constructor(name, email, role = 'member') {
    this.id = this.generateId();
    this.name = name;
    this.email = email;
    this.role = role; // 'member', 'lead', 'manager'
    this.joinedAt = new Date();
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  updateRole(newRole) {
    const validRoles = ['member', 'lead', 'manager'];
    if (validRoles.includes(newRole)) {
      this.role = newRole;
      return true;
    }
    return false;
  }

  generateId() {
    return 'member_' + Math.random().toString(36).substr(2, 9);
  }

  static fromJSON(json) {
    const member = new TeamMember(json.name, json.email, json.role);
    member.id = json.id;
    member.joinedAt = new Date(json.joinedAt);
    member.isActive = json.isActive;
    return member;
  }
}

/**
 * CONCEPT: MVC - CONTROLLER LAYER
 * Controllers handle business logic and coordinate between models and views
 * They contain methods that components can call to perform operations
 */

/**
 * Task Controller
 * Handles all task-related operations and business logic
 */
class TaskController {
  constructor() {
    this.tasks = [];
    this.loadTasksFromStorage();
  }

  createTask(taskData) {
    const task = new Task(
      taskData.title,
      taskData.description,
      taskData.assignee,
      taskData.priority,
      taskData.dueDate
    );
    
    this.tasks.push(task);
    this.saveTasksToStorage();
    return task;
  }

  getAllTasks() {
    return this.tasks;
  }

  getTaskById(id) {
    return this.tasks.find(task => task.id === id);
  }

  updateTask(id, updates) {
    const task = this.getTaskById(id);
    if (task) {
      task.updateTask(updates);
      this.saveTasksToStorage();
      return task;
    }
    return null;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      const deletedTask = this.tasks.splice(index, 1)[0];
      this.saveTasksToStorage();
      return deletedTask;
    }
    return null;
  }

  getTasksByStatus(status) {
    return this.tasks.filter(task => task.status === status);
  }

  getTasksByAssignee(assignee) {
    return this.tasks.filter(task => task.assignee === assignee);
  }

  getOverdueTasks() {
    return this.tasks.filter(task => task.isOverdue());
  }

  getTaskStatistics() {
    const stats = {
      total: this.tasks.length,
      todo: this.getTasksByStatus('todo').length,
      inProgress: this.getTasksByStatus('in-progress').length,
      completed: this.getTasksByStatus('completed').length,
      overdue: this.getOverdueTasks().length
    };
    
    stats.completionRate = stats.total > 0 
      ? Math.round((stats.completed / stats.total) * 100) 
      : 0;
    
    return stats;
  }

  saveTasksToStorage() {
    try {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  loadTasksFromStorage() {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        this.tasks = parsedTasks.map(taskData => Task.fromJSON(taskData));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
    }
  }
}

/**
 * Team Member Controller
 * Handles team member operations
 */
class TeamMemberController {
  constructor() {
    this.members = [];
    this.loadMembersFromStorage();
  }

  createMember(memberData) {
    const member = new TeamMember(memberData.name, memberData.email, memberData.role);
    this.members.push(member);
    this.saveMembersToStorage();
    return member;
  }

  getAllMembers() {
    return this.members.filter(member => member.isActive);
  }

  getMemberById(id) {
    return this.members.find(member => member.id === id);
  }

  updateMember(id, updates) {
    const member = this.getMemberById(id);
    if (member) {
      Object.assign(member, updates);
      this.saveMembersToStorage();
      return member;
    }
    return null;
  }

  deleteMember(id) {
    const member = this.getMemberById(id);
    if (member) {
      member.deactivate();
      this.saveMembersToStorage();
      return member;
    }
    return null;
  }

  saveMembersToStorage() {
    try {
      localStorage.setItem('teamMembers', JSON.stringify(this.members));
    } catch (error) {
      console.error('Error saving team members:', error);
    }
  }

  loadMembersFromStorage() {
    try {
      const savedMembers = localStorage.getItem('teamMembers');
      if (savedMembers) {
        const parsedMembers = JSON.parse(savedMembers);
        this.members = parsedMembers.map(memberData => TeamMember.fromJSON(memberData));
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      this.members = [];
    }
  }
}

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getPriorityColor = (priority) => {
  const colors = {
    low: '#27ae60',
    medium: '#f39c12',
    high: '#e74c3c'
  };
  return colors[priority] || colors.medium;
};

export const getStatusColor = (status) => {
  const colors = {
    'todo': '#3498db',
    'in-progress': '#f39c12',
    'completed': '#27ae60'
  };
  return colors[status] || colors.todo;
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.assignee && task.assignee !== filters.assignee) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return task.title.toLowerCase().includes(searchLower) ||
             task.description.toLowerCase().includes(searchLower);
    }
    return true;
  });
};

export const taskController = new TaskController();
export const memberController = new TeamMemberController();
export { Task, TeamMember, TaskController, TeamMemberController };
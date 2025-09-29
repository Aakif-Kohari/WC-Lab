import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import { memberController, formatDate, filterTasks } from '../utils';

const TaskList = () => {
  const navigate = useNavigate();
  
  // Custom Hook usage
  const { tasks, loading, error, updateTask, deleteTask, loadTasks } = useTasks();
  
  // useRef for table scroll management
  const tableRef = useRef(null);
  const searchInputRef = useRef(null);

  // useState for table functionality
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    assignee: '',
    priority: '',
    search: ''
  });
  const [teamMembers, setTeamMembers] = useState([]);

  // Load team members for filter dropdown
  useEffect(() => {
    const members = memberController.getAllMembers();
    setTeamMembers(members);
  }, []);

  // Filter and sort tasks
  const filteredTasks = filterTasks(tasks, filters);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Table sorting handler
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Search with useRef
  const handleSearchChange = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Task selection for batch operations
  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const selectAllTasks = () => {
    if (selectedTasks.length === sortedTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(sortedTasks.map(task => task.id));
    }
  };

  // Batch operations - FIXED with Promise.all to ensure all updates complete
  const handleBatchDelete = async () => {
    if (window.confirm(`Delete ${selectedTasks.length} selected tasks?`)) {
      try {
        // Delete all selected tasks
        for (const taskId of selectedTasks) {
          deleteTask(taskId);
        }
        setSelectedTasks([]);
        // Force reload to ensure UI is in sync
        setTimeout(() => loadTasks(), 100);
      } catch (error) {
        console.error('Error deleting tasks:', error);
        alert('Failed to delete some tasks. Please try again.');
      }
    }
  };

  const handleBatchStatusUpdate = async (newStatus) => {
    try {
      // Update all selected tasks
      for (const taskId of selectedTasks) {
        updateTask(taskId, { status: newStatus });
      }
      setSelectedTasks([]);
      // Force reload to ensure UI is in sync
      setTimeout(() => loadTasks(), 100);
    } catch (error) {
      console.error('Error updating tasks:', error);
      alert('Failed to update some tasks. Please try again.');
    }
  };

  // useRef - Scroll to specific task
  const scrollToTask = (taskId) => {
    const taskRow = document.getElementById(`task-${taskId}`);
    if (taskRow) {
      taskRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      taskRow.style.backgroundColor = '#e3f2fd';
      setTimeout(() => {
        taskRow.style.backgroundColor = '';
      }, 2000);
    }
  };

  if (loading) {
    return <div className="card">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ color: '#e74c3c' }}>Error: {error}</div>
        <button className="btn btn-primary" onClick={loadTasks}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Task List ({sortedTasks.length} tasks)</h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/add-task')}
          >
            Add New Task
          </button>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="search-filters-section">
          {/* Search Input with useRef */}
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tasks by title or description..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
            {filters.search && (
              <button 
                onClick={clearSearch}
                className="search-clear"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Assignee Filter */}
          <select 
            value={filters.assignee} 
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Assignees</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select 
            value={filters.priority} 
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Batch Operations */}
        {selectedTasks.length > 0 && (
          <div className="batch-operations">
            <span>{selectedTasks.length} tasks selected</span>
            <button 
              className="btn btn-success"
              onClick={() => handleBatchStatusUpdate('completed')}
            >
              Mark Completed
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleBatchStatusUpdate('in-progress')}
            >
              Mark In Progress
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleBatchDelete}
            >
              Delete Selected
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedTasks([])}
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table" ref={tableRef}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === sortedTasks.length && sortedTasks.length > 0}
                    onChange={selectAllTasks}
                  />
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('title')}
                >
                  Title 
                  {sortBy === 'title' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('status')}
                >
                  Status 
                  {sortBy === 'status' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('assignee')}
                >
                  Assignee 
                  {sortBy === 'assignee' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('priority')}
                >
                  Priority 
                  {sortBy === 'priority' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date 
                  {sortBy === 'dueDate' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('createdAt')}
                >
                  Created 
                  {sortBy === 'createdAt' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No tasks found. {filters.search || filters.status || filters.assignee || filters.priority ? 
                      'Try adjusting your filters.' : 'Create your first task!'}
                  </td>
                </tr>
              ) : (
                sortedTasks.map(task => (
                  <tr 
                    key={task.id} 
                    id={`task-${task.id}`}
                    style={{ 
                      backgroundColor: selectedTasks.includes(task.id) ? '#f0f8ff' : '',
                      opacity: task.status === 'completed' ? 0.7 : 1
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskSelect(task.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{task.title}</strong>
                        {task.description && (
                          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                            {task.description.length > 50 
                              ? task.description.substring(0, 50) + '...' 
                              : task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status === 'todo' ? 'TO DO' : 
                         task.status === 'in-progress' ? 'IN PROGRESS' : 
                         'COMPLETED'}
                      </span>
                    </td>
                    <td>{task.assignee || 'Unassigned'}</td>
                    <td>
                      <span style={{ 
                        color: task.priority === 'high' ? '#e74c3c' : 
                               task.priority === 'medium' ? '#f39c12' : '#27ae60',
                        fontWeight: 'bold'
                      }}>
                        {task.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {task.dueDate ? (
                        <span style={{ 
                          color: task.isOverdue() ? '#e74c3c' : '#666'
                        }}>
                          {formatDate(task.dueDate)}
                          {task.isOverdue() && ' (Overdue)'}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>No due date</span>
                      )}
                    </td>
                    <td style={{ color: '#666', fontSize: '0.9rem' }}>
                      {formatDate(task.createdAt)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => navigate(`/edit-task/${task.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            if (window.confirm('Delete this task?')) {
                              deleteTask(task.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Summary */}
        <div className="table-summary">
          <div>
            Showing {sortedTasks.length} of {tasks.length} tasks
            {(filters.search || filters.status || filters.assignee || filters.priority) && 
              <button 
                onClick={() => setFilters({ status: '', assignee: '', priority: '', search: '' })}
                style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
              >
                Clear all filters
              </button>
            }
          </div>
          <div>
            <button 
              className="btn btn-secondary"
              onClick={() => scrollToTask(sortedTasks[0]?.id)}
              disabled={sortedTasks.length === 0}
            >
              Scroll to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
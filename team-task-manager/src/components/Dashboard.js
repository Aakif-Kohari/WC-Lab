// Dashboard.js - Main Dashboard Component
// Concepts Covered: Functional Components, useState Hook, useEffect Hook, MVC Integration

import React, { useState, useEffect } from 'react';
import { taskController, memberController, formatDate } from '../utils';

/**
 * CONCEPT: Functional Component with Hooks
 * This component demonstrates useState and useEffect hooks
 * It shows how to manage local component state and side effects
 */
const Dashboard = () => {
  /**
   * CONCEPT: useState Hook - State Management
   * useState allows functional components to have local state
   * It returns an array with [currentValue, setterFunction]
   */
  
  // State for task statistics
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    completionRate: 0
  });

  // State for recent tasks (shows array state management)
  const [recentTasks, setRecentTasks] = useState([]);
  
  // State for team members count
  const [teamCount, setTeamCount] = useState(0);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);

  // useEffect Hook - runs after component mounts (like componentDidMount)
  useEffect(() => {
    // Load task statistics using our controller (MVC pattern)
    const taskStats = taskController.getTaskStatistics();
    setStats(taskStats);
    
    // Load recent tasks (last 5 tasks)
    const allTasks = taskController.getAllTasks();
    const recent = allTasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setRecentTasks(recent);
    
    // Load team member count
    const members = memberController.getAllMembers();
    setTeamCount(members.length);
    
    setIsLoading(false);
  }, []); // Empty dependency array = run once on mount

  /**
   * CONCEPT: Event Handlers in Functional Components
   * These are regular JavaScript functions that update state
   */
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Refresh all data
    setTimeout(() => {
      const taskStats = taskController.getTaskStatistics();
      setStats(taskStats);
      
      const allTasks = taskController.getAllTasks();
      const recent = allTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentTasks(recent);
      
      const members = memberController.getAllMembers();
      setTeamCount(members.length);
      
      setIsLoading(false);
    }, 500);
  };

  /**
   * CONCEPT: Conditional Rendering
   * Show different content based on component state
   */
  if (isLoading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading dashboard...</p>
          {/* You could add a loading spinner component here */}
        </div>
      </div>
    );
  }

  /**
   * CONCEPT: JSX Rendering with State
   * The component returns JSX that uses the current state values
   * When state changes, React automatically re-renders this component
   */
  return (
    <div>
      {/* Header Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1>Team Dashboard</h1>
            <p style={{ color: '#666', margin: 0 }}>
              Welcome back! Here's what's happening with your team.
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {/* 
          CONCEPT: Rendering Dynamic Content
          Each stat card shows how to use state values in JSX
        */}
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#3498db' }}>{stats.todo}</div>
          <div className="stat-label">To Do</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f39c12' }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#27ae60' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: stats.overdue > 0 ? '#e74c3c' : '#27ae60' }}>
            {stats.overdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#9b59b6' }}>{teamCount}</div>
          <div className="stat-label">Team Members</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="card">
        <h2>Progress Overview</h2>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Completion Rate</span>
            <span>{stats.completionRate}%</span>
          </div>
          {/* 
            CONCEPT: Dynamic Styling
            CSS styles that change based on state values
          */}
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#ecf0f1', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${stats.completionRate}%`, 
              height: '100%', 
              backgroundColor: stats.completionRate > 80 ? '#27ae60' : 
                             stats.completionRate > 50 ? '#f39c12' : '#e74c3c',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
        
        {/* Status breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>{stats.todo}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>To Do</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>{stats.inProgress}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>{stats.completed}</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Completed</div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="card">
        <h2>Recent Tasks</h2>
        {/* 
          CONCEPT: Conditional Rendering with Arrays
          Show different content based on whether we have data
        */}
        {recentTasks.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No tasks created yet.</p>
        ) : (
          <div>
            {/* 
              CONCEPT: Array Mapping in JSX
              Transform array data into JSX elements
              Each element needs a unique key prop
            */}
            {recentTasks.map(task => (
              <div 
                key={task.id}
                style={{ 
                  padding: '1rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {task.description || 'No description'}
                  </p>
                  {task.assignee && (
                    <small style={{ color: '#999' }}>Assigned to: {task.assignee}</small>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span 
                    className={`status-badge status-${task.status}`}
                    style={{ marginBottom: '0.5rem', display: 'block' }}
                  >
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <small style={{ color: '#999' }}>
                    {formatDate(task.createdAt)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2>Quick Actions</h2>
        <div className="quick-actions-buttons">
          <button className="btn btn-primary">
            Create New Task
          </button>
          <button className="btn btn-success">
            Add Team Member
          </button>
          <button className="btn btn-secondary">
            View All Tasks
          </button>
          <button className="btn btn-secondary">
            Generate Report
          </button>
        </div>
      </div>
    </div>

  );
};

/**
 * CONCEPT: Component Export
 * Export the component so it can be imported and used in other files
 */
export default Dashboard;
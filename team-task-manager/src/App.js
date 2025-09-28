import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TeamMembers from './components/TeamMembers';

/**
 * CONCEPT: Functional Component
 * This is a modern React functional component using arrow function syntax
 * It replaces the older class-based components and works with hooks
 */
const App = () => {
  return (
    <Router>
      <div className="app">
        
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'active' : ''}
                end
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Tasks
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add-task" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Add Task
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/team" 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Team Members
              </NavLink>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/tasks" element={<TaskList />} />
            
            <Route path="/add-task" element={<TaskForm />} />
            
            <Route path="/team" element={<TeamMembers />} />
            
            <Route path="/edit-task/:id" element={<TaskForm />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NotFound = () => {
  return (
    <div className="card">
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <NavLink to="/" className="btn btn-primary">
        Go to Dashboard
      </NavLink>
    </div>
  );
};

export default App;
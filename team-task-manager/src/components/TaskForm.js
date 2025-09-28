import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskController, memberController } from '../utils';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // useRef Hook - Direct DOM access and focus management
  const titleInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const formRef = useRef(null);

  // useState for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: ''
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing task data if editing
  useEffect(() => {
    if (id) {
      const task = taskController.getTaskById(id);
      if (task) {
        setFormData({
          title: task.title,
          description: task.description,
          assignee: task.assignee,
          priority: task.priority,
          dueDate: task.dueDate || ''
        });
        setIsEditing(true);
      }
    }

    // Load team members for assignee dropdown
    const members = memberController.getAllMembers();
    setTeamMembers(members);

    // useRef - Focus on title input when component mounts
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const errorFields = Object.keys(errors);
      if (errorFields.includes('title') && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (errorFields.includes('description') && descriptionRef.current) {
        descriptionRef.current.focus();
      }
      return;
    }

    try {
      if (isEditing) {
        taskController.updateTask(id, formData);
      } else {
        taskController.createTask(formData);
      }

      navigate('/tasks');
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: ''
    });
    setErrors({});
    
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const scrollToTop = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToTop();
    }
  }, [errors]);

  return (
    <div className="card" ref={formRef}>
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
      {errors.submit && (
        <div style={{ 
          color: '#e74c3c', 
          background: '#fdf2f2', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title Field with useRef */}
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            ref={titleInputRef}  // useRef for direct DOM access
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title..."
            style={{
              borderColor: errors.title ? '#e74c3c' : '#ddd'
            }}
          />
          {errors.title && (
            <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {errors.title}
            </div>
          )}
        </div>

        {/* Description Field with useRef */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            ref={descriptionRef}  // useRef for focus management
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description..."
            rows="4"
            style={{
              borderColor: errors.description ? '#e74c3c' : '#ddd'
            }}
          />
          {errors.description && (
            <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {errors.description}
            </div>
          )}
          <small style={{ color: '#666' }}>
            {formData.description.length}/500 characters
          </small>
        </div>

        {/* Assignee Dropdown */}
        <div className="form-group">
          <label htmlFor="assignee">Assign To</label>
          <select
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleInputChange}
          >
            <option value="">Select team member...</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.name}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        {/* Priority Selection */}
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            style={{
              borderColor: errors.dueDate ? '#e74c3c' : '#ddd'
            }}
          />
          {errors.dueDate && (
            <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {errors.dueDate}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleClearForm}
          >
            Clear Form
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/tasks')}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Form Preview  */}
      {formData.title && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f8f9fa', 
          borderRadius: '4px' 
        }}>
          <h4>Preview:</h4>
          <p><strong>Title:</strong> {formData.title}</p>
          {formData.description && (
            <p><strong>Description:</strong> {formData.description}</p>
          )}
          {formData.assignee && (
            <p><strong>Assigned to:</strong> {formData.assignee}</p>
          )}
          <p><strong>Priority:</strong> {formData.priority}</p>
          {formData.dueDate && (
            <p><strong>Due Date:</strong> {new Date(formData.dueDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskForm;
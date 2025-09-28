import React, { useState, useEffect } from 'react';
import { memberController, formatDate } from '../utils';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadMembers();
  }, []);

  // MVC Controller Integration - Load data
  const loadMembers = () => {
    setLoading(true);
    try {
      const allMembers = memberController.getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    } else {
      // Check for duplicate email
      const existingMember = members.find(member => 
        member.email === formData.email && 
        (!editingMember || member.id !== editingMember.id)
      );
      if (existingMember) {
        errors.email = 'Email already exists';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // MVC Controller Integration - Create member
  const handleAddMember = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const newMember = memberController.createMember(formData);
      setMembers(prev => [...prev, newMember]);
      
      // Reset form
      setFormData({ name: '', email: '', role: 'member' });
      setShowAddForm(false);
      setFormErrors({});
      
    } catch (error) {
      console.error('Error creating member:', error);
      setFormErrors({ submit: 'Failed to create member' });
    }
  };

  // MVC Controller Integration - Update member
  const handleUpdateMember = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const updatedMember = memberController.updateMember(editingMember.id, formData);
      setMembers(prev => prev.map(member => 
        member.id === editingMember.id ? updatedMember : member
      ));
      
      // Reset form
      setFormData({ name: '', email: '', role: 'member' });
      setEditingMember(null);
      setFormErrors({});
      
    } catch (error) {
      console.error('Error updating member:', error);
      setFormErrors({ submit: 'Failed to update member' });
    }
  };

  // MVC Controller Integration - Delete member
  const handleDeleteMember = (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }
    
    try {
      memberController.deleteMember(memberId);
      setMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const startEditMember = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role
    });
    setFormErrors({});
  };

  const cancelForm = () => {
    setFormData({ name: '', email: '', role: 'member' });
    setEditingMember(null);
    setShowAddForm(false);
    setFormErrors({});
  };

  // MVC Controller Integration - Update member role
  const handleRoleChange = (memberId, newRole) => {
    try {
      const updatedMember = memberController.updateMember(memberId, { role: newRole });
      setMembers(prev => prev.map(member => 
        member.id === memberId ? updatedMember : member
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) {
    return <div className="card">Loading team members...</div>;
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Team Members ({members.length})</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Member'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingMember) && (
          <div style={{ 
            padding: '1.5rem', 
            background: '#f8f9fa', 
            borderRadius: '8px', 
            marginBottom: '2rem' 
          }}>
            <h3>{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
            
            {formErrors.submit && (
              <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>
                {formErrors.submit}
              </div>
            )}
            
            <form onSubmit={editingMember ? handleUpdateMember : handleAddMember}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    style={{ borderColor: formErrors.name ? '#e74c3c' : '#ddd' }}
                  />
                  {formErrors.name && (
                    <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {formErrors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    style={{ borderColor: formErrors.email ? '#e74c3c' : '#ddd' }}
                  />
                  {formErrors.email && (
                    <div style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      {formErrors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="member">Member</option>
                    <option value="lead">Team Lead</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members Table */}
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h3>No team members yet</h3>
            <p>Add your first team member to get started!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: '#3498db',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          marginRight: '1rem'
                        }}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>{member.name}</strong>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        style={{ 
                          border: 'none', 
                          background: 'transparent',
                          color: member.role === 'manager' ? '#e74c3c' : 
                                 member.role === 'lead' ? '#f39c12' : '#27ae60',
                          fontWeight: 'bold'
                        }}
                      >
                        <option value="member">Member</option>
                        <option value="lead">Team Lead</option>
                        <option value="manager">Manager</option>
                      </select>
                    </td>
                    <td style={{ color: '#666' }}>
                      {formatDate(member.joinedAt)}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: member.isActive ? '#e8f5e8' : '#fdf2f2',
                        color: member.isActive ? '#388e3c' : '#d32f2f'
                      }}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => startEditMember(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Team Statistics */}
        <div style={{ 
          marginTop: '2rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem' 
        }}>
          <div className="stat-card">
            <div className="stat-number">
              {members.filter(m => m.role === 'member').length}
            </div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#f39c12' }}>
              {members.filter(m => m.role === 'lead').length}
            </div>
            <div className="stat-label">Team Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#e74c3c' }}>
              {members.filter(m => m.role === 'manager').length}
            </div>
            <div className="stat-label">Managers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: '#27ae60' }}>
              {members.filter(m => m.isActive).length}
            </div>
            <div className="stat-label">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
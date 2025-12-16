import React, { useState } from 'react';
import './WorkModule.css';

const WorkModule = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design Homepage', status: 'In Progress', priority: 'High', assignee: 'John Doe' },
    { id: 2, title: 'API Integration', status: 'Completed', priority: 'Medium', assignee: 'Jane Smith' },
    { id: 3, title: 'Database Setup', status: 'Pending', priority: 'High', assignee: 'Mike Johnson' },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    status: 'Pending',
    priority: 'Medium',
    assignee: ''
  });

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.assignee.trim()) {
      const task = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...newTask
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', status: 'Pending', priority: 'Medium', assignee: '' });
    }
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    if (filter !== 'All') {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="work-module">
      <header className="module-header">
        <h1>Work Management Module</h1>
        <p>Track and manage your team's tasks efficiently</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{getStatusCount('Pending')}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-number">{getStatusCount('In Progress')}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{getStatusCount('Completed')}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="add-task-form">
        <h2>Add New Task</h2>
        <form onSubmit={handleAddTask}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Assignee Name"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <button type="submit" className="btn-add">Add Task</button>
          </div>
        </form>
      </div>

      <div className="task-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={filter === 'All' ? 'active' : ''}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button
            className={filter === 'Pending' ? 'active' : ''}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'In Progress' ? 'active' : ''}
            onClick={() => setFilter('In Progress')}
          >
            In Progress
          </button>
          <button
            className={filter === 'Completed' ? 'active' : ''}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <h2>Tasks List</h2>
        {getFilteredTasks().length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          <div className="tasks-grid">
            {getFilteredTasks().map(task => (
              <div key={task.id} className={`task-card ${task.priority.toLowerCase()}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="task-body">
                  <div className="task-info">
                    <span className="label">Assignee:</span>
                    <span className="value">{task.assignee}</span>
                  </div>
                  <div className="task-info">
                    <span className="label">Status:</span>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className={`status-select ${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="task-footer">
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkModule;

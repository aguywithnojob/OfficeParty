import React, { useState } from 'react';
import './AddGuest.css';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api/guests`;

const AddGuest = () => {
  const [formData, setFormData] = useState({
    name: '',
    foodOption: 'Veg',
    drink: 'Non Drinker'
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage('Please enter a name');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✓ ${formData.name} has been added successfully!`);
        setIsSuccess(true);
        setFormData({ name: '', foodOption: 'Veg', drink: 'Non Drinker' });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add guest. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      setMessage('Error: Could not connect to server');
      setIsSuccess(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-guest-page">
      <div className="add-guest-container">
        <header className="add-guest-header">
          <h1>➕ Add New Guest</h1>
          <p>Add someone to the party invitation list</p>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Guest Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter guest name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="foodOption">Food Preference</label>
                <select
                  id="foodOption"
                  name="foodOption"
                  value={formData.foodOption}
                  onChange={handleChange}
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="drink">Drink Preference</label>
                <select
                  id="drink"
                  name="drink"
                  value={formData.drink}
                  onChange={handleChange}
                >
                  <option value="Non Drinker">Non Drinker</option>
                  <option value="Drinker">Drinker</option>
                </select>
              </div>
            </div>

            {message && (
              <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="submit-btn">
              Add Guest
            </button>
          </form>
        </div>

        <div className="navigation-links">
          <a href="/" className="nav-link primary">
            🎉 View Invitations
          </a>
          <a href="/payment" className="nav-link secondary">
            💳 Payment Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default AddGuest;

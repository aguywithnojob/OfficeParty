import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

function AdminDashboard() {
  const [guests, setGuests] = useState([]);
  const [partyDetails, setPartyDetails] = useState({
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    timing: '',
    totalBill: '',
    paidBy: '',
    paymentMobile: '',
    paymentUPI: ''
  });
  const [activeTab, setActiveTab] = useState('guests');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    fetchGuests();
    fetchPartyDetails();
  }, [navigate]);

  const fetchGuests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests`);
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
    }
  };

  const fetchPartyDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/party-details`);
      const data = await response.json();
      setPartyDetails(data);
    } catch (error) {
      console.error('Failed to fetch party details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  const handleGuestChange = (id, field, value) => {
    setGuests(guests.map(guest =>
      guest.id === id ? { ...guest, [field]: value } : guest
    ));
  };

  const handleSaveGuests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guests),
      });
      const data = await response.json();
      if (data.success) {
        alert('Guests updated successfully!');
      }
    } catch (error) {
      alert('Failed to update guests');
    }
  };

  const handlePartyDetailsChange = (field, value) => {
    setPartyDetails({ ...partyDetails, [field]: value });
  };

  const handleSavePartyDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/party-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partyDetails),
      });
      const data = await response.json();
      if (data.success) {
        alert('Party details updated successfully!');
      }
    } catch (error) {
      alert('Failed to update party details');
    }
  };

  const handleDeleteGuest = (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      setGuests(guests.filter(guest => guest.id !== id));
    }
  };

  const acceptedCount = guests.filter(g => g.accepted).length;
  const totalGuests = guests.length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎉 Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="view-party-btn">
            View Party Page
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-value">{acceptedCount}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalGuests}</div>
          <div className="stat-label">Total Guests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalGuests - acceptedCount}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'guests' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('guests')}
        >
          Manage Guests
        </button>
        <button
          className={activeTab === 'details' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('details')}
        >
          Party Details
        </button>
      </div>

      {activeTab === 'guests' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>Guest List</h2>
            <button onClick={handleSaveGuests} className="save-btn">
              💾 Save All Changes
            </button>
          </div>
          <div className="guests-table-container">
            <table className="guests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Food</th>
                  <th>Drink</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.id}</td>
                    <td>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleGuestChange(guest.id, 'name', e.target.value)}
                        className="edit-input"
                      />
                    </td>
                    <td>
                      <select
                        value={guest.foodOption}
                        onChange={(e) => handleGuestChange(guest.id, 'foodOption', e.target.value)}
                        className="edit-select"
                      >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={guest.drink}
                        onChange={(e) => handleGuestChange(guest.id, 'drink', e.target.value)}
                        className="edit-select"
                      >
                        <option value="Drinker">Drinker</option>
                        <option value="Non Drinker">Non Drinker</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={guest.accepted ? 'true' : 'false'}
                        onChange={(e) => handleGuestChange(guest.id, 'accepted', e.target.value === 'true')}
                        className="edit-select status-select"
                      >
                        <option value="false">⏳ Pending</option>
                        <option value="true">✓ Accepted</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>Party Details</h2>
            <button onClick={handleSavePartyDetails} className="save-btn">
              💾 Save Changes
            </button>
          </div>
          <div className="party-details-form">
            <div className="form-row">
              <div className="form-field">
                <label>Venue</label>
                <input
                  type="text"
                  value={partyDetails.venue}
                  onChange={(e) => handlePartyDetailsChange('venue', e.target.value)}
                  placeholder="Enter venue"
                />
              </div>
              <div className="form-field">
                <label>Date</label>
                <input
                  type="date"
                  value={partyDetails.date}
                  onChange={(e) => handlePartyDetailsChange('date', e.target.value)}
                  placeholder="Select date"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Start Time</label>
                <input
                  type="time"
                  value={partyDetails.startTime || ''}
                  onChange={(e) => handlePartyDetailsChange('startTime', e.target.value)}
                  placeholder="Start time"
                />
              </div>
              <div className="form-field">
                <label>End Time</label>
                <input
                  type="time"
                  value={partyDetails.endTime || ''}
                  onChange={(e) => handlePartyDetailsChange('endTime', e.target.value)}
                  placeholder="End time"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Total Bill Amount (₹)</label>
                <input
                  type="text"
                  value={partyDetails.totalBill}
                  onChange={(e) => handlePartyDetailsChange('totalBill', e.target.value)}
                  placeholder="Enter total bill"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Paid By (Name)</label>
                <input
                  type="text"
                  value={partyDetails.paidBy}
                  onChange={(e) => handlePartyDetailsChange('paidBy', e.target.value)}
                  placeholder="Person who paid"
                />
              </div>
              <div className="form-field">
                <label>Payment Mobile</label>
                <input
                  type="text"
                  value={partyDetails.paymentMobile}
                  onChange={(e) => handlePartyDetailsChange('paymentMobile', e.target.value)}
                  placeholder="e.g., 9876543210"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field full-width">
                <label>UPI ID</label>
                <input
                  type="text"
                  value={partyDetails.paymentUPI}
                  onChange={(e) => handlePartyDetailsChange('paymentUPI', e.target.value)}
                  placeholder="e.g., username@paytm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="admin-footer">
        <p>© {new Date().getFullYear()} aguywithnojob. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;

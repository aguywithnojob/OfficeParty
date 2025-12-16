import React, { useState, useEffect } from 'react';
import './PartyLanding.css';
import { API_BASE_URL } from '../config';

const PartyLanding = () => {
  const [guests, setGuests] = useState([]);
  const [partyDetails, setPartyDetails] = useState({
    venue: 'TBD',
    date: 'December 17, 2025',
    timing: '4:00 PM - 11:00 PM'
  });
  const [loading, setLoading] = useState(true);

  const [userAcceptedId, setUserAcceptedId] = useState(() => {
    return localStorage.getItem('userAcceptedId') ? parseInt(localStorage.getItem('userAcceptedId')) : null;
  });

  // Fetch guests from backend on component mount
  useEffect(() => {
    fetchGuests();
    fetchPartyDetails();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setGuests(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      // Fallback to default data if backend is not available
      setGuests([
        { id: 1, name: 'Prajwal Dev', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 2, name: 'Gautam Rishi', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 3, name: 'Prateek Garg', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 4, name: 'Tushar Saxena', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 5, name: 'Gaurav Ahuja', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 6, name: 'Shivya Shukla', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 7, name: 'Ankit Grover', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 8, name: 'Shokin Ajiv', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 9, name: 'Mohit Kumar', foodOption: 'Veg', drink: 'Drinker', accepted: false },
        { id: 10, name: 'Mohit Mahendru', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
        { id: 11, name: 'Gajender Sharma', foodOption: 'Veg', drink: 'Non Drinker', accepted: false },
      ]);
      setLoading(false);
    }
  };

  const fetchPartyDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/party-details`);
      const data = await response.json();
      
      // Format date and time for display
      if (data.date) {
        const dateObj = new Date(data.date);
        data.date = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      // Format timing from startTime and endTime if available
      if (data.startTime && data.endTime) {
        const formatTime = (time) => {
          const [hours, minutes] = time.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };
        data.timing = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;
      }
      
      setPartyDetails(data);
    } catch (error) {
      console.error('Failed to fetch party details:', error);
    }
  };

  const updateGuestsOnServer = async (updatedGuests) => {
    try {
      await fetch(`${API_BASE_URL}/api/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuests),
      });
    } catch (error) {
      console.error('Failed to update guests:', error);
    }
  };

  const handleFoodChange = (id, value) => {
    const updatedGuests = guests.map(guest =>
      guest.id === id ? { ...guest, foodOption: value } : guest
    );
    setGuests(updatedGuests);
    updateGuestsOnServer(updatedGuests);
  };

  const handleDrinkChange = (id, value) => {
    const updatedGuests = guests.map(guest =>
      guest.id === id ? { ...guest, drink: value } : guest
    );
    setGuests(updatedGuests);
    updateGuestsOnServer(updatedGuests);
  };

  const triggerCelebration = () => {
    // Play celebration sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGJ0fPTgjMGHm7A7+OZUQ0MUKjn8bdfGwU/jtfyyHUrBSh+zPDajT4JFmm98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGwU8j9Xy0H0vBSqCy/HZiTwIGGy98OuhWBELTqXm77RiGw==');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Create confetti animation
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'celebration-confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
      }, i * 20);
    }

    // Create sparkles
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'celebration-sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 0.3 + 's';
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 2000);
      }, i * 30);
    }
  };

  const handleAccept = (id) => {
    if (userAcceptedId !== null) {
      alert('You have already accepted an invitation!');
      return;
    }
    
    const updatedGuests = guests.map(guest =>
      guest.id === id ? { ...guest, accepted: true } : guest
    );
    setGuests(updatedGuests);
    updateGuestsOnServer(updatedGuests);
    setUserAcceptedId(id);
    localStorage.setItem('userAcceptedId', id.toString());
    
    // Trigger celebration animation and sound
    triggerCelebration();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Food Option', 'Drink', 'Status'];
    const csvContent = [
      headers.join(','),
      ...guests.map(guest => 
        `${guest.name},${guest.foodOption},${guest.drink},${guest.accepted ? 'Accepted' : 'Pending'}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `party_rsvp_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToTXT = () => {
    const txtContent = [
      'PARTY RSVP LIST',
      '='.repeat(70),
      '',
      ...guests.map(guest => 
        `Name: ${guest.name}\nFood: ${guest.foodOption}\nDrink: ${guest.drink}\nStatus: ${guest.accepted ? 'Accepted' : 'Pending'}\n${'-'.repeat(70)}`
      )
    ].join('\n');

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `party_rsvp_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="party-landing">
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading party details...</p>
        </div>
      ) : (
        <>
          {/* Banner Section */}
          <div className="party-banner">
        <div className="banner-overlay">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <h1 className="party-title">🎉 You're Invited! 🎉</h1>
          <p className="party-subtitle">Join us for an unforgettable celebration</p>
        </div>
      </div>

      {/* Party Details Section */}
      <div className="party-details">
        <div className="detail-card">
          <div className="detail-icon">📅</div>
          <div className="detail-content">
            <h3>Date</h3>
            <p>{partyDetails.date}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">📍</div>
          <div className="detail-content">
            <h3>Venue</h3>
            <p>{partyDetails.venue}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">⏰</div>
          <div className="detail-content">
            <h3>Timing</h3>
            <p>{partyDetails.timing}</p>
          </div>
        </div>
      </div>

      {/* RSVP Table Section */}
      <div className="rsvp-section">
        <div className="rsvp-header">
          <h2 className="rsvp-title">Guest RSVP List</h2>
          <div className="export-buttons">
            <button onClick={exportToCSV} className="export-btn csv-btn">
              📊 Export CSV
            </button>
            {/* <button onClick={exportToTXT} className="export-btn txt-btn">
              📄 Export TXT
            </button> */}
          </div>
        </div>
        <div className="table-container">
          <table className="rsvp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Food Option</th>
                <th>Drink</th>
                <th>Invite</th>
              </tr>
            </thead>
            <tbody>
              {guests.map(guest => (
                <tr key={guest.id} className={guest.accepted ? 'accepted-row' : ''}>
                  <td className="name-cell">{guest.name}</td>
                  <td>
                    <select
                      value={guest.foodOption}
                      onChange={(e) => handleFoodChange(guest.id, e.target.value)}
                      disabled={guest.accepted}
                      className="food-select"
                      style={{
                        color: guest.foodOption === 'Veg' ? '#2e7d32' : '#c62828',
                        backgroundColor: guest.foodOption === 'Veg' ? '#e8f5e9' : '#ffebee'
                      }}
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={guest.drink}
                      onChange={(e) => handleDrinkChange(guest.id, e.target.value)}
                      disabled={guest.accepted}
                      className="drink-select"
                    >
                      <option value="Non Drinker">Non Drinker</option>
                      <option value="Drinker">Drinker</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleAccept(guest.id)}
                      disabled={guest.accepted || userAcceptedId !== null}
                      className={`accept-btn ${guest.accepted ? 'accepted' : ''}`}
                    >
                      {guest.accepted ? '✓ Accepted' : 'Accept'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Navigation Links */}
        <div className="navigation-section">
          <a href="/payment" className="payment-link-btn">💳 View Payment Details</a>
          <a href="/guest/add" className="add-guest-link-btn">➕ Add New Guest</a>
        </div>

        {/* Footer */}
        <footer className="party-footer">
          <p>© {new Date().getFullYear()} aguywithnojob. All rights reserved.</p>
        </footer>
      </div>
        </>
      )}
    </div>
  );
};

export default PartyLanding;

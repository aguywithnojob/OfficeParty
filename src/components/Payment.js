import React, { useState, useEffect } from 'react';
import './Payment.css';
import { API_BASE_URL } from '../config';

const Payment = () => {
  const [guests, setGuests] = useState([]);
  const [partyDetails, setPartyDetails] = useState({
    totalBill: '',
    paidBy: '',
    paymentMobile: '',
    paymentUPI: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
    fetchPartyDetails();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/guests`);
      const data = await response.json();
      setGuests(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch guests:', error);
      setLoading(false);
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

  const acceptedGuests = guests.filter(guest => guest.accepted);
  const totalAccepted = acceptedGuests.length;
  const totalBill = parseFloat(partyDetails.totalBill) || 0;
  const perPersonShare = totalAccepted > 0 ? (totalBill / totalAccepted).toFixed(2) : 0;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <header className="payment-header">
          <h1>💰 Payment Details</h1>
          <p>Split the bill among accepted guests</p>
        </header>

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading payment details...</p>
          </div>
        ) : (
          <>
            {/* Bill Configuration */}
            {/* <div className="bill-config">
              <h2>Configure Total Bill</h2>
              {partyDetails.paidBy && (
              <div className="paid-by-info">
                <strong>💳 Paid By:</strong> {partyDetails.paidBy}
              </div>
            )}
            </div> */}

            {/* Summary Cards */}
            <div className="payment-summary">
              <div className="summary-card">
                <div className="summary-icon">👥</div>
                <div className="summary-content">
                  <h3>Total Guests</h3>
                  <p className="summary-value">{totalAccepted}</p>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">💵</div>
                <div className="summary-content">
                  <h3>Total Bill</h3>
                  <p className="summary-value">₹{totalBill > 0 ? totalBill.toLocaleString() : 'TBD'}</p>
                </div>
              </div>

              <div className="summary-card highlight">
                <div className="summary-icon">💳</div>
                <div className="summary-content">
                  <h3>Per Person</h3>
                  <p className="summary-value">₹{perPersonShare > 0 ? perPersonShare : 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {(partyDetails.paymentUPI || partyDetails.paymentMobile) && (
            <div className="payment-info">
              <h2>Payment Information</h2>
              <div className="payment-methods">
                {partyDetails.paymentUPI && (
                <div className="payment-method">
                  <div className="method-header">
                    <span className="method-icon">📱</span>
                    <h3>UPI Payment</h3>
                  </div>
                  <div className="method-details">
                    <div className="detail-row">
                      <span className="detail-label">UPI ID:</span>
                      <div className="detail-value-group">
                        <span className="detail-value">{partyDetails.paymentUPI}</span>
                        <button
                          onClick={() => copyToClipboard(partyDetails.paymentUPI)}
                          className="copy-btn"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {partyDetails.paymentMobile && (
                <div className="payment-method">
                  <div className="method-header">
                    <span className="method-icon">📞</span>
                    <h3>Mobile Number</h3>
                  </div>
                  <div className="method-details">
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <div className="detail-value-group">
                        <span className="detail-value">{partyDetails.paymentMobile}</span>
                        <button
                          onClick={() => copyToClipboard(partyDetails.paymentMobile)}
                          className="copy-btn"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
            )}

            {/* Accepted Guests List */}
            <div className="accepted-guests">
              <h2>Accepted Guests ({totalAccepted})</h2>
              {totalAccepted === 0 ? (
                <div className="no-guests">
                  <p>No guests have accepted the invitation yet.</p>
                </div>
              ) : (
                <div className="guests-grid">
                  {acceptedGuests.map((guest, index) => (
                    <div key={guest.id} className="guest-payment-card">
                      <div className="guest-number">{index + 1}</div>
                      <div className="guest-info">
                        <h4>{guest.name}</h4>
                        <div className="guest-preferences">
                          <span className={`preference-tag food ${guest.foodOption === 'Non-Veg' ? 'non-veg' : 'veg'}`}>{guest.foodOption}</span>
                          <span className="preference-tag drink">{guest.drink}</span>
                        </div>
                      </div>
                      <div className="guest-amount">
                        <span className="amount-label">Owes</span>
                        <span className="amount-value">₹{perPersonShare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Back Button */}
            <div className="back-section">
              <a href="/" className="back-btn">← Back to Invitations</a>
            </div>

            {/* Footer */}
            <footer className="payment-footer">
              <p>© {new Date().getFullYear()} aguywithnojob. All rights reserved.</p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
